/**
 * Airtable REST API helper.
 *
 * Required env vars (set in .env / .env.local):
 *   NEXT_PUBLIC_AIRTABLE_API_KEY          – Personal Access Token
 *   NEXT_PUBLIC_AIRTABLE_BASE_ID          – e.g. appXXXXXXXXXXXXXX
 *   NEXT_PUBLIC_AIRTABLE_SUBMISSIONS_TABLE – table name for inquiries (default: "Submissions")
 *   NEXT_PUBLIC_AIRTABLE_PORTFOLIO_TABLE   – table name for portfolio (default: "Portfolio")
 */

const API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY ?? "";
const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID ?? "";

export const SUBMISSIONS_TABLE =
  process.env.NEXT_PUBLIC_AIRTABLE_SUBMISSIONS_TABLE ?? "Submissions";
export const PORTFOLIO_TABLE =
  process.env.NEXT_PUBLIC_AIRTABLE_PORTFOLIO_TABLE ?? "Portfolio";

export const isAirtableConnected = Boolean(API_KEY && BASE_ID);

const BASE_URL = "https://api.airtable.com/v0";

type AirtableFields = Record<string, unknown>;

export interface AirtableRecord<T extends AirtableFields = AirtableFields> {
  id: string;
  fields: T;
  createdTime: string;
}

interface ListResponse<T extends AirtableFields> {
  records: AirtableRecord<T>[];
  offset?: string;
}

function headers() {
  return {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };
}

/** Fetch all records from a table (auto-paginates). */
export async function listRecords<T extends AirtableFields>(
  table: string
): Promise<AirtableRecord<T>[]> {
  const results: AirtableRecord<T>[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(`${BASE_URL}/${BASE_ID}/${encodeURIComponent(table)}`);
    if (offset) url.searchParams.set("offset", offset);

    const res = await fetch(url.toString(), { headers: headers() });
    if (!res.ok) throw new Error(`Airtable list failed: ${res.status} ${await res.text()}`);

    const body = (await res.json()) as ListResponse<T>;
    results.push(...body.records);
    offset = body.offset;
  } while (offset);

  return results;
}

/** Create a new record. Returns the created record. */
export async function createRecord<T extends AirtableFields>(
  table: string,
  fields: Partial<T>
): Promise<AirtableRecord<T>> {
  const res = await fetch(`${BASE_URL}/${BASE_ID}/${encodeURIComponent(table)}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`Airtable create failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as AirtableRecord<T>;
}

/** Update a record (PATCH — only specified fields). */
export async function updateRecord<T extends AirtableFields>(
  table: string,
  recordId: string,
  fields: Partial<T>
): Promise<AirtableRecord<T>> {
  const res = await fetch(`${BASE_URL}/${BASE_ID}/${encodeURIComponent(table)}/${recordId}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`Airtable update failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as AirtableRecord<T>;
}

/** Delete a record. */
export async function deleteRecord(table: string, recordId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${BASE_ID}/${encodeURIComponent(table)}/${recordId}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) throw new Error(`Airtable delete failed: ${res.status} ${await res.text()}`);
}
