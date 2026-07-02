import { useEffect, useState } from "react";
import {
  isAirtableConnected,
  SUBMISSIONS_TABLE,
  listRecords,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../lib/airtable";

export interface Submission {
  id: string;
  /** Airtable record id (undefined for local-only entries) */
  _recordId?: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  timestamp: string;
  status: "active" | "resolved";
  /** Optional: client access code for the client portal */
  clientCode?: string;
}

const STORAGE_KEY = "nexus_craft_submissions";

// ── local storage helpers ────────────────────────────────────────────────────

const loadLocal = (): Submission[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Submission[]) : [];
  } catch {
    return [];
  }
};

const saveLocal = (items: Submission[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
};

// ── Airtable field mapping ───────────────────────────────────────────────────

type AirtableSubmissionFields = {
  Name: string;
  Email: string;
  Phone: string;
  Service: string;
  Message: string;
  Timestamp: string;
  Status: string;
  ClientCode: string;
};

const toSubmission = (rec: { id: string; fields: Partial<AirtableSubmissionFields> }): Submission => ({
  id: rec.id,
  _recordId: rec.id,
  name: rec.fields.Name ?? "",
  email: rec.fields.Email ?? "",
  phone: rec.fields.Phone ?? "",
  service: rec.fields.Service ?? "web",
  message: rec.fields.Message ?? "",
  timestamp: rec.fields.Timestamp ?? new Date().toISOString(),
  status: rec.fields.Status === "resolved" ? "resolved" : "active",
  clientCode: rec.fields.ClientCode ?? "",
});

const toFields = (s: Omit<Submission, "id" | "_recordId">): AirtableSubmissionFields => ({
  Name: s.name,
  Email: s.email,
  Phone: s.phone,
  Service: s.service || "web",
  Message: s.message,
  Timestamp: s.timestamp,
  Status: s.status,
  ClientCode: s.clientCode ?? "",
});

// ── hook ─────────────────────────────────────────────────────────────────────

interface UseSubmissionsOptions {
  autoLoad?: boolean;
}

export function useSubmissions(options: UseSubmissionsOptions = {}) {
  const { autoLoad = true } = options;
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSubmissions = async () => {
    setLoading(true);

    if (isAirtableConnected) {
      try {
        const records = await listRecords<AirtableSubmissionFields>(SUBMISSIONS_TABLE);
        const items = records.map(toSubmission);
        setSubmissions(items);
        saveLocal(items);
        setLoading(false);
        return;
      } catch (err) {
        console.error("Airtable load failed, falling back to local storage:", err);
      }
    }

    setSubmissions(loadLocal());
    setLoading(false);
  };

  useEffect(() => {
    if (!autoLoad) {
      setLoading(false);
      return;
    }
    void loadSubmissions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad]);

  const addSubmission = async (
    data: Omit<Submission, "id" | "_recordId" | "timestamp" | "status">
  ): Promise<Submission> => {
    const base: Omit<Submission, "id" | "_recordId"> = {
      ...data,
      timestamp: new Date().toISOString(),
      status: "active",
      clientCode:
        data.clientCode ??
        Math.random().toString(36).substring(2, 8).toUpperCase(),
    };

    if (isAirtableConnected) {
      try {
        const rec = await createRecord<AirtableSubmissionFields>(
          SUBMISSIONS_TABLE,
          toFields(base)
        );
        const newItem = toSubmission(rec);
        const updated = [...submissions, newItem];
        setSubmissions(updated);
        saveLocal(updated);
        return newItem;
      } catch (err) {
        console.error("Airtable create failed:", err);
      }
    }

    // local fallback
    const newItem: Submission = {
      ...base,
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
    };
    const updated = [...submissions, newItem];
    setSubmissions(updated);
    saveLocal(updated);
    return newItem;
  };

  const setSubmissionStatus = async (id: string, status: Submission["status"]) => {
    const current = submissions.find((s) => s.id === id);
    if (!current) return;

    const updatedItem = { ...current, status };

    if (isAirtableConnected && current._recordId) {
      try {
        await updateRecord<AirtableSubmissionFields>(SUBMISSIONS_TABLE, current._recordId, {
          Status: status,
        });
      } catch (err) {
        console.error("Airtable status update failed:", err);
      }
    }

    const updated = submissions.map((s) => (s.id === id ? updatedItem : s));
    setSubmissions(updated);
    saveLocal(updated);
  };

  const removeSubmission = async (id: string) => {
    const current = submissions.find((s) => s.id === id);

    if (isAirtableConnected && current?._recordId) {
      try {
        await deleteRecord(SUBMISSIONS_TABLE, current._recordId);
      } catch (err) {
        console.error("Airtable delete failed:", err);
      }
    }

    const updated = submissions.filter((s) => s.id !== id);
    setSubmissions(updated);
    saveLocal(updated);
  };

  const clearSubmissions = async () => {
    if (isAirtableConnected) {
      try {
        await Promise.all(
          submissions
            .filter((s) => s._recordId)
            .map((s) => deleteRecord(SUBMISSIONS_TABLE, s._recordId!))
        );
      } catch (err) {
        console.error("Airtable clear failed:", err);
      }
    }
    setSubmissions([]);
    saveLocal([]);
  };

  return {
    submissions,
    loading,
    addSubmission,
    setSubmissionStatus,
    removeSubmission,
    clearSubmissions,
    refreshSubmissions: loadSubmissions,
  };
}
