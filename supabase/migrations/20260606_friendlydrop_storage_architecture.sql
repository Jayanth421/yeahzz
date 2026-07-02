create extension if not exists pgcrypto;

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  bucket_name text not null,
  entity_type text not null,
  entity_id text not null,
  owner_type text not null,
  owner_id uuid,
  vendor_id uuid,
  product_id uuid,
  category_id uuid,
  folder_id uuid,
  original_filename text not null,
  storage_path text not null unique,
  public_url text,
  mime_type text not null,
  media_kind text not null,
  file_size_bytes bigint not null check (file_size_bytes >= 0),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  duration_ms integer check (duration_ms is null or duration_ms >= 0),
  checksum_sha256 text,
  dominant_color text,
  alt_text text,
  caption text,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'pending',
  visibility text not null default 'private',
  is_public boolean not null default false,
  version integer not null default 1,
  deleted_at timestamptz,
  deleted_by uuid,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid
);

create index if not exists idx_media_assets_tenant_entity on public.media_assets (tenant_id, entity_type, entity_id);
create index if not exists idx_media_assets_bucket_status on public.media_assets (bucket_name, status);
create index if not exists idx_media_assets_vendor on public.media_assets (vendor_id);
create index if not exists idx_media_assets_product on public.media_assets (product_id);
create index if not exists idx_media_assets_category on public.media_assets (category_id);
create index if not exists idx_media_assets_created_at on public.media_assets (created_at desc);
create index if not exists idx_media_assets_deleted_at on public.media_assets (deleted_at);

create table if not exists public.media_folders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  bucket_name text not null,
  parent_folder_id uuid references public.media_folders (id) on delete set null,
  folder_key text not null,
  folder_name text not null,
  entity_type text,
  entity_id text,
  owner_type text not null,
  owner_id uuid,
  sort_order integer not null default 0,
  is_system boolean not null default false,
  deleted_at timestamptz,
  deleted_by uuid,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  unique (tenant_id, bucket_name, folder_key)
);

create index if not exists idx_media_folders_tenant_bucket on public.media_folders (tenant_id, bucket_name);
create index if not exists idx_media_folders_parent on public.media_folders (parent_folder_id);
create index if not exists idx_media_folders_deleted_at on public.media_folders (deleted_at);

alter table public.media_assets
  add constraint media_assets_folder_id_fkey
  foreign key (folder_id) references public.media_folders (id) on delete set null;

create table if not exists public.media_variants (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.media_assets (id) on delete cascade,
  variant_key text not null,
  bucket_name text not null,
  storage_path text not null unique,
  mime_type text not null,
  format text not null,
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  bitrate_kbps integer check (bitrate_kbps is null or bitrate_kbps >= 0),
  file_size_bytes bigint not null check (file_size_bytes >= 0),
  checksum_sha256 text,
  transform jsonb not null default '{}'::jsonb,
  is_default boolean not null default false,
  status text not null default 'pending',
  deleted_at timestamptz,
  deleted_by uuid,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  unique (asset_id, variant_key)
);

create index if not exists idx_media_variants_asset on public.media_variants (asset_id);
create index if not exists idx_media_variants_bucket_status on public.media_variants (bucket_name, status);
create index if not exists idx_media_variants_deleted_at on public.media_variants (deleted_at);

create table if not exists public.media_processing_jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  asset_id uuid not null references public.media_assets (id) on delete cascade,
  job_type text not null,
  job_key text not null unique,
  priority integer not null default 100,
  status text not null default 'queued',
  attempts integer not null default 0,
  max_attempts integer not null default 5,
  locked_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  error_code text,
  error_message text,
  payload jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid,
  updated_at timestamptz not null default now(),
  updated_by uuid
);

create index if not exists idx_media_jobs_tenant_status on public.media_processing_jobs (tenant_id, status);
create index if not exists idx_media_jobs_asset on public.media_processing_jobs (asset_id);
create index if not exists idx_media_jobs_locked_at on public.media_processing_jobs (locked_at);
create index if not exists idx_media_jobs_deleted_at on public.media_processing_jobs (deleted_at);

create table if not exists public.media_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  asset_id uuid references public.media_assets (id) on delete set null,
  variant_id uuid references public.media_variants (id) on delete set null,
  action text not null,
  actor_type text not null,
  actor_id uuid,
  before_state jsonb not null default '{}'::jsonb,
  after_state jsonb not null default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  correlation_id text,
  created_at timestamptz not null default now()
);

create index if not exists idx_media_audit_tenant_created_at on public.media_audit_logs (tenant_id, created_at desc);
create index if not exists idx_media_audit_asset on public.media_audit_logs (asset_id);
create index if not exists idx_media_audit_action on public.media_audit_logs (action);

create table if not exists public.media_usage (
  id uuid primary key default gen_random_uuid(),
  usage_date date not null,
  tenant_id uuid not null,
  bucket_name text not null,
  entity_type text,
  media_kind text,
  object_count integer not null default 0,
  total_bytes bigint not null default 0,
  upload_count integer not null default 0,
  delete_count integer not null default 0,
  transform_count integer not null default 0,
  egress_bytes bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  entity_type_key text generated always as (coalesce(entity_type, '')) stored,
  media_kind_key text generated always as (coalesce(media_kind, '')) stored
);

create index if not exists idx_media_usage_tenant_date on public.media_usage (tenant_id, usage_date desc);
create index if not exists idx_media_usage_bucket_date on public.media_usage (bucket_name, usage_date desc);
create unique index if not exists idx_media_usage_unique
  on public.media_usage (usage_date, tenant_id, bucket_name, entity_type_key, media_kind_key);

create table if not exists public.media_access_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  asset_id uuid references public.media_assets (id) on delete set null,
  variant_id uuid references public.media_variants (id) on delete set null,
  access_type text not null,
  access_mode text not null,
  requester_type text not null,
  requester_id uuid,
  bucket_name text not null,
  storage_path text not null,
  ip_address inet,
  user_agent text,
  referrer text,
  status_code integer,
  bytes_sent bigint not null default 0,
  signed_url_expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_media_access_tenant_created_at on public.media_access_logs (tenant_id, created_at desc);
create index if not exists idx_media_access_asset on public.media_access_logs (asset_id);
create index if not exists idx_media_access_bucket on public.media_access_logs (bucket_name, created_at desc);
create index if not exists idx_media_access_requester on public.media_access_logs (requester_type, requester_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_media_assets_updated_at on public.media_assets;
create trigger trg_media_assets_updated_at
before update on public.media_assets
for each row execute function public.set_updated_at();

drop trigger if exists trg_media_folders_updated_at on public.media_folders;
create trigger trg_media_folders_updated_at
before update on public.media_folders
for each row execute function public.set_updated_at();

drop trigger if exists trg_media_variants_updated_at on public.media_variants;
create trigger trg_media_variants_updated_at
before update on public.media_variants
for each row execute function public.set_updated_at();

drop trigger if exists trg_media_jobs_updated_at on public.media_processing_jobs;
create trigger trg_media_jobs_updated_at
before update on public.media_processing_jobs
for each row execute function public.set_updated_at();

drop trigger if exists trg_media_usage_updated_at on public.media_usage;
create trigger trg_media_usage_updated_at
before update on public.media_usage
for each row execute function public.set_updated_at();

/*
Recommended bucket seed data:

insert into storage.buckets (id, name, public) values
  ('product-images', 'product-images', true),
  ('product-videos', 'product-videos', true),
  ('category-images', 'category-images', true),
  ('brand-assets', 'brand-assets', false),
  ('banners', 'banners', true),
  ('cms-assets', 'cms-assets', false),
  ('vendor-assets', 'vendor-assets', false),
  ('support-attachments', 'support-attachments', false),
  ('payment-proofs', 'payment-proofs', false),
  ('user-uploads', 'user-uploads', false),
  ('review-media', 'review-media', true),
  ('marketing-assets', 'marketing-assets', true),
  ('backups', 'backups', false)
on conflict (id) do update
set public = excluded.public;

RLS policies should be added separately based on tenant, role, bucket, and path scope.
*/
