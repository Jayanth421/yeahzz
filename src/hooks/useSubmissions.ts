import { useEffect, useState } from "react";
import { INQUIRY_TABLE_NAMES, isSupabaseConnected, supabase } from "../lib/supabase";

export interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  timestamp: string;
  status: "active" | "resolved";
}

const STORAGE_KEY = "nexus_craft_submissions";
const REQUEST_TIMEOUT_MS = 10000;

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs = REQUEST_TIMEOUT_MS): Promise<T | null> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    const timeoutPromise = new Promise<null>((resolve) => {
      timeoutId = setTimeout(() => resolve(null), timeoutMs);
    });

    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const loadLocalSubmissions = (): Submission[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Submission[];
  } catch (error) {
    console.error("Failed to parse local submissions:", error);
    return [];
  }
};

const saveLocalSubmissions = (items: Submission[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save local submissions:", error);
  }
};

const normalizeSubmission = (id: string, payload: Record<string, unknown>): Submission => ({
  id,
  name: typeof payload.name === "string" ? payload.name : "",
  email: typeof payload.email === "string" ? payload.email : "",
  phone: typeof payload.phone === "string" ? payload.phone : "",
  service: typeof payload.service === "string" && payload.service ? payload.service : "web",
  message: typeof payload.message === "string" ? payload.message : "",
  timestamp: typeof payload.timestamp === "string" ? payload.timestamp : new Date().toISOString(),
  status: payload.status === "resolved" ? "resolved" : "active",
});

interface UseSubmissionsOptions {
  autoLoad?: boolean;
}

export function useSubmissions(options: UseSubmissionsOptions = {}) {
  const { autoLoad = true } = options;
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSubmissions = async () => {
    setLoading(true);

    if (isSupabaseConnected && supabase) {
      const client = supabase;
      try {
        let supabaseItems: Submission[] = [];

        for (const tableName of INQUIRY_TABLE_NAMES) {
          const result = await withTimeout(Promise.resolve(client.from(tableName).select("*")));
          if (result === null) {
            console.warn(`Supabase read timed out for table: ${tableName}`);
            continue;
          }
          const { data, error } = result;
          if (error) {
            console.warn(`Supabase read failed for table: ${tableName}`, error.message);
            continue;
          }
          const parsed = (data || []).map((row: Record<string, unknown>) => {
            const payload = row as Record<string, unknown>;
            return normalizeSubmission(String(payload.id || ""), payload);
          });

          if (parsed.length > 0) {
            supabaseItems = parsed;
            break;
          }
        }

        if (supabaseItems.length > 0) {
          setSubmissions(supabaseItems);
          saveLocalSubmissions(supabaseItems);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Failed loading submissions from Supabase:", error);
      }
    }

    setSubmissions(loadLocalSubmissions());
    setLoading(false);
  };

  useEffect(() => {
    if (!autoLoad) {
      setLoading(false);
      return;
    }

    void loadSubmissions();
  }, [autoLoad]);

  const addSubmission = async (data: Omit<Submission, "id" | "timestamp" | "status">) => {
    const newItem: Submission = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
      name: data.name,
      email: data.email,
      phone: data.phone,
      service: data.service || "web",
      message: data.message,
      timestamp: new Date().toISOString(),
      status: "active",
    };

    if (isSupabaseConnected && supabase) {
      try {
        const writeResult = await withTimeout(
          Promise.resolve(supabase.from(INQUIRY_TABLE_NAMES[0]).upsert(newItem, { onConflict: "id" })),
        );
        if (writeResult === null) {
          console.warn("Supabase submission write timed out.");
        }
      } catch (error) {
        console.error("Failed writing submission to Supabase:", error);
      }
    }

    const updated = [...submissions, newItem];
    setSubmissions(updated);
    saveLocalSubmissions(updated);
    return newItem;
  };

  const setSubmissionStatus = async (id: string, status: Submission["status"]) => {
    const current = submissions.find((item) => item.id === id);
    if (!current) return;

    const updatedItem = { ...current, status };

    if (isSupabaseConnected && supabase) {
      try {
        const writeResult = await withTimeout(
          Promise.resolve(
            supabase.from(INQUIRY_TABLE_NAMES[0]).upsert(updatedItem, { onConflict: "id" }),
          ),
        );
        if (writeResult === null) {
          console.warn("Supabase submission status update timed out.");
        }
      } catch (error) {
        console.error("Failed updating submission status in Supabase:", error);
      }
    }

    const updated = submissions.map((item) => (item.id === id ? updatedItem : item));
    setSubmissions(updated);
    saveLocalSubmissions(updated);
  };

  const removeSubmission = async (id: string) => {
    if (isSupabaseConnected && supabase) {
      try {
        const writeResult = await withTimeout(
          Promise.resolve(supabase.from(INQUIRY_TABLE_NAMES[0]).delete().eq("id", id)),
        );
        if (writeResult === null) {
          console.warn("Supabase submission delete timed out.");
        }
      } catch (error) {
        console.error("Failed deleting submission from Supabase:", error);
      }
    }

    const updated = submissions.filter((item) => item.id !== id);
    setSubmissions(updated);
    saveLocalSubmissions(updated);
  };

  const clearSubmissions = async () => {
    if (isSupabaseConnected && supabase) {
      const client = supabase;
      try {
        const result = await withTimeout(
          Promise.resolve(client.from(INQUIRY_TABLE_NAMES[0]).select("id")),
        );
        if (result === null) {
          console.warn("Supabase clear submissions read timed out.");
          return;
        }
        const { data, error } = result;
        if (error) {
          console.error("Failed fetching submissions for clear:", error);
        } else if (data?.length) {
          await Promise.all(
            data.map((entry: { id: string }) =>
              client.from(INQUIRY_TABLE_NAMES[0]).delete().eq("id", entry.id),
            ),
          );
        }
      } catch (error) {
        console.error("Failed clearing Supabase submissions:", error);
      }
    }

    setSubmissions([]);
    saveLocalSubmissions([]);
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
