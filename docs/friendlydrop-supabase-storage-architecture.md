# FriendlyDrop Enterprise Supabase Storage Architecture

This document redesigns FriendlyDrop's storage layer for enterprise eCommerce scale.

## 1. Current Project Read

- The codebase currently has a lightweight browser Supabase client in `src/lib/supabase.ts`.
- There is no dedicated storage service layer, no API routes for uploads, and no storage schema yet.
- That means the right move is to introduce a storage control plane in the app and keep all direct bucket access behind policy, signed URLs, and server-side orchestration.

## 2. Architecture Goals

- Handle 10M product images and 1M product videos without hot partitions or unbounded query cost.
- Separate public merchandising assets from private vendor, customer, and payment evidence.
- Keep uploads synchronous only for validation, and move heavy work into async processing jobs.
- Make storage auditable, recoverable, and operationally observable.

## 3. Bucket Strategy

Use one bucket per business domain, with private buckets for sensitive content and public buckets only where anonymous storefront delivery is required.

### Bucket Matrix

| Bucket | Access | Primary Use | Notes |
| --- | --- | --- | --- |
| `product-images` | Public | Storefront product images | Public derivative variants, cached via CDN |
| `product-videos` | Public | Product video delivery | Serve transcoded renditions and thumbnails |
| `category-images` | Public | Category/collection navigation | Small images, aggressively cached |
| `brand-assets` | Private | Brand logos, identity files | Keep drafts and originals private; publish approved derivatives separately |
| `banners` | Public | Homepage and campaign banners | CDN-first, versioned paths |
| `cms-assets` | Private | Editorial images and files | Keep draft content private; publish live content as separate approved assets |
| `vendor-assets` | Private | Vendor certificates, line sheets, docs | Strict vendor isolation |
| `support-attachments` | Private | Support chat files | Agent/customer scoped access |
| `payment-proofs` | Private | UPI or bank proof uploads | Admin + finance only |
| `user-uploads` | Private | Customer-generated uploads | User-scoped access and moderation |
| `review-media` | Public | Customer review photos/videos | Moderate before publish |
| `marketing-assets` | Public | Ads, social creatives, emails | Versioned and immutable once approved |
| `backups` | Private | Exports, snapshots, manifests | Internal only |

### Bucket Configuration Rules

- Default all buckets to private unless anonymous delivery is required.
- Restrict content types and file size at bucket level.
- Use separate upload tokens per bucket and per role.
- Never reuse the same bucket for both raw uploads and final public delivery when the content is sensitive.

## 4. Folder and Object Naming

The system should use object paths as an organizational and operational primitive. For scale, include a sharding prefix to avoid object list hotspots.

### Standard Path Pattern

```text
{bucket}/{yyyy}/{mm}/{vendor_id}/{entity_id}/{hash_prefix}/{asset_variant}/{filename}
```

### Product Images

```text
product-images/
  2026/06/vendor_123/product_987/ab/original/image-uuid.jpg
  2026/06/vendor_123/product_987/ab/thumbnail/image-uuid.webp
  2026/06/vendor_123/product_987/ab/small/image-uuid.webp
  2026/06/vendor_123/product_987/ab/medium/image-uuid.webp
  2026/06/vendor_123/product_987/ab/large/image-uuid.webp
  2026/06/vendor_123/product_987/ab/webp/image-uuid.webp
  2026/06/vendor_123/product_987/ab/avif/image-uuid.avif
```

### Product Videos

```text
product-videos/
  2026/06/vendor_123/product_987/ab/original/video-uuid.mp4
  2026/06/vendor_123/product_987/ab/360p/video-uuid.mp4
  2026/06/vendor_123/product_987/ab/720p/video-uuid.mp4
  2026/06/vendor_123/product_987/ab/1080p/video-uuid.mp4
  2026/06/vendor_123/product_987/ab/thumbnail/video-uuid.jpg
```

### Other Buckets

```text
category-images/
  2026/06/category_123/ab/original/image-uuid.jpg
  2026/06/category_123/ab/small/image-uuid.webp

brand-assets/
  2026/06/brand_123/ab/logo/image-uuid.svg
  2026/06/brand_123/ab/original/file-uuid.pdf

banners/
  2026/06/campaign_123/ab/original/banner-uuid.jpg
  2026/06/campaign_123/ab/webp/banner-uuid.webp

cms-assets/
  2026/06/page_123/ab/original/asset-uuid.jpg

vendor-assets/
  2026/06/vendor_123/ab/original/doc-uuid.pdf

support-attachments/
  2026/06/ticket_123/ab/original/file-uuid.pdf

payment-proofs/
  2026/06/payment_123/ab/original/proof-uuid.png

user-uploads/
  2026/06/user_123/ab/original/upload-uuid.jpg

review-media/
  2026/06/review_123/ab/original/media-uuid.jpg

marketing-assets/
  2026/06/campaign_123/ab/original/creative-uuid.psd

backups/
  2026/06/snapshot_123/manifest.json
  2026/06/snapshot_123/export.sql.gz
```

### Naming Rules

- Use immutable filenames generated from UUIDs or ULIDs.
- Keep the original filename only as metadata.
- Store hash prefixes (`00` to `ff`) as the first sharding layer when object count exceeds hundreds of thousands per folder prefix.
- Never store user-facing labels in paths for sensitive objects.

## 5. Media Optimization Architecture

Supabase Storage image transformations currently support WebP optimization automatically, but AVIF is not natively available yet. Use Supabase for delivery and a separate media worker for asset generation.

### Images

- Upload original image to the private or staging object path.
- Validate MIME, magic bytes, dimensions, and file size before persistence.
- Generate derivatives asynchronously:
  - JPEG fallback
  - WebP
  - AVIF
  - Thumbnail
  - Small, medium, large responsive sizes
- Store width, height, format, byte size, checksum, dominant color, and exif summary in the database.

### Videos

- Accept only approved source formats.
- Transcode using an external worker pipeline into H.264/H.265 or AV1 where platform support exists.
- Generate 360p, 720p, 1080p, and thumbnail poster frames.
- Persist duration, resolution, bitrate, keyframe interval, and poster frame metadata.

### Pipeline Services

- Validation worker
- Malware scanning worker
- Transcoding worker
- Thumbnail worker
- Metadata extraction worker
- Delivery cache warmer

## 6. Security Architecture

### Access Model

- Public buckets: storefront assets only.
- Private buckets: all sensitive and operational files.
- Signed URLs for all private reads.
- Signed upload URLs for all direct browser uploads.

### Role Model

- `anonymous`: read-only access to public storefront assets.
- `authenticated`: customer-owned uploads, review media, support attachments.
- `vendor`: vendor-scoped uploads and reads only.
- `ops`: processing jobs and internal operational visibility.
- `admin`: full moderation and restore privileges.
- `finance`: payment proofs only.

### Security Controls

- Bucket-level content type and file size restrictions.
- RLS on `storage.objects` for every write and read path.
- Vendor isolation by `vendor_id` claim or server-resolved vendor mapping.
- Admin-only buckets for backups and finance-sensitive data.
- Malware scanning before asset promotion to a public or shared path.
- Content validation before upload acceptance.
- Rate limiting per user, vendor, IP, and bucket.
- Audit every upload, download, delete, restore, and permission escalation.

### Signed URL Guidance

- Use signed URLs for private downloads and time-bound previews.
- Use signed upload URLs for direct-to-storage browser upload flows.
- Keep signed URL TTL short for sensitive assets.

## 7. Database Schema

Use Postgres as the metadata and orchestration system of record. Storage objects remain in Supabase Storage, while the database tracks lifecycle, policy, access, and processing.

### Core Tables

- `media_assets`
- `media_variants`
- `media_folders`
- `media_processing_jobs`
- `media_audit_logs`
- `media_usage`
- `media_access_logs`

### Table Design Principles

- Use UUID primary keys.
- Include `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`.
- Soft delete everything that may need restore.
- Keep the object path immutable; changes create a new version or variant.
- Index all foreign keys, ownership columns, status fields, and common lookup paths.

### Suggested Relationship Model

- `media_assets` is the parent record for each logical asset.
- `media_variants` stores every derivative or rendition of the parent.
- `media_processing_jobs` tracks async lifecycle from upload to publish.
- `media_folders` groups assets by business domain or editorial structure.
- `media_audit_logs` captures every action on the asset lifecycle.
- `media_usage` stores aggregated metrics by day, bucket, and tenant.
- `media_access_logs` stores request-level access telemetry.

## 8. API Design

Implement these routes in the Next.js App Router so storage logic stays server-side.

### `POST /api/uploads`

- Issues signed upload URLs or performs server-side preflight validation.
- Validates auth, role, tenant, bucket, size, and MIME type.
- Creates `media_assets` and `media_processing_jobs` records.

### `DELETE /api/uploads`

- Cancels pending uploads or deletes unpromoted objects.
- Requires ownership or elevated privileges.

### `GET /api/media`

- Lists media by tenant, entity, type, status, and pagination cursor.
- Supports filtering by bucket, folder, vendor, product, and date.

### `PATCH /api/media`

- Updates metadata, visibility, alt text, caption, moderation state, and restore status.

### `POST /api/media/optimize`

- Triggers reprocessing for variants, thumbnails, or new target formats.

### `POST /api/media/restore`

- Restores soft-deleted assets or replays metadata from backup.

## 9. Processing Flow

```text
Upload
-> Validation
-> Virus Scan
-> Storage Upload
-> Queue Job
-> Generate Variants
-> Generate Thumbnails
-> Update Database
-> CDN Cache
```

### Processing Notes

- Keep the upload request fast; do not block on transcode jobs.
- Promotion to public delivery should happen only after validation and malware scanning.
- Use idempotent job keys keyed by asset checksum and target preset.
- Retry failures with exponential backoff and dead-letter tracking.

## 10. CDN Strategy

- Put all public delivery paths behind a global CDN.
- Version every asset so invalidation is usually a pointer change, not a purge.
- Use cache-control headers based on asset class:
  - Product images: long TTL, immutable on versioned URLs
  - Campaign and CMS assets: moderate TTL
  - Sensitive signed URLs: short TTL and private cache behavior
- Use responsive image delivery with width-appropriate variants.
- Use lazy loading for product grids, gallery views, and chat attachments.

## 11. Monitoring Architecture

Track both operational health and business cost.

### Dashboards

- Storage usage by bucket, tenant, vendor, and entity
- Bandwidth and egress cost by asset class
- Failed upload and failed transcode counts
- Media processing queue depth and job duration
- Signed URL issuance and access anomalies
- Backup freshness and restore drill status

### Logs and Alerts

- Alert on spikes in upload failures.
- Alert on malware scan failures.
- Alert on orphaned objects with no database record.
- Alert on unexpected access to sensitive buckets.
- Alert on processing backlog growth.

## 12. Backup and Disaster Recovery

- Daily logical exports of metadata tables.
- Weekly full snapshots of object manifests and critical metadata.
- Multi-region backup storage for the `backups` bucket.
- Lifecycle policies to move cold archives to lower-cost tiers or delete after retention expiry.
- Regular restore drills for both metadata and objects.

## 13. Cost Optimization

- Store only one canonical original per asset.
- Generate only the variants you actually serve.
- Prefer public cached derivatives for storefront traffic.
- Use transformation caching and immutable URLs to minimize recomputation.
- Archive infrequently accessed originals and backup exports.
- Track cost by bucket, vendor, campaign, and product line.

## 14. Migration Plan

### Phase 1

- Add storage metadata tables and bucket policy scaffolding.
- Keep the existing local Supabase client but route media operations through server APIs.

### Phase 2

- Move uploads to signed URL flow.
- Backfill existing media into the new bucket naming scheme.
- Generate and attach metadata for every migrated object.

### Phase 3

- Turn on malware scanning, variant generation, and monitoring dashboards.
- Switch storefront reads to CDN-backed transformed delivery.

### Phase 4

- Decommission old ad hoc paths.
- Enable lifecycle management and restore workflows.
- Enforce strict RLS for all buckets.

## 15. Recommended Implementation Order

1. Create the bucket set and RLS policies.
2. Add the database schema and audit tables.
3. Add signed upload and signed download APIs.
4. Build the async media pipeline.
5. Add CDN delivery and transformation rules.
6. Add monitoring, alerts, and backup jobs.

## 16. Practical Recommendation for FriendlyDrop

- Keep `src/lib/supabase.ts` as a browser-friendly bootstrap for simple data access, but move all media write paths to server routes and job workers.
- Treat Supabase Storage as the object store and Postgres as the control plane.
- Use external transcoding for AVIF and video renditions, then store the outputs back in Supabase Storage.
- Use public buckets only for assets meant to be globally cacheable and safe to expose anonymously.
