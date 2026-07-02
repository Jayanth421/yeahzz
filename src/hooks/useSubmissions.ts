import { useEffect, useState } from "react";
import {
  isFirebaseConnected,
  SUBMISSIONS_COLLECTION,
  db,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "../lib/firebase";

export interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  timestamp: string;
  status: "active" | "resolved";
  /** Generated at submission time — used for client portal login */
  clientCode?: string;
}

const STORAGE_KEY = "nexus_craft_submissions";

// ── local storage helpers ─────────────────────────────────────────────────────

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

// ── hook ──────────────────────────────────────────────────────────────────────

interface UseSubmissionsOptions {
  autoLoad?: boolean;
}

export function useSubmissions(options: UseSubmissionsOptions = {}) {
  const { autoLoad = true } = options;
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSubmissions = async () => {
    setLoading(true);

    if (isFirebaseConnected) {
      try {
        const q = query(collection(db, SUBMISSIONS_COLLECTION), orderBy("timestamp", "desc"));
        const snap = await getDocs(q);
        const items: Submission[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Submission, "id">),
        }));
        setSubmissions(items);
        saveLocal(items);
        setLoading(false);
        return;
      } catch (err) {
        console.error("Firestore load submissions failed, falling back to local:", err);
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
    data: Omit<Submission, "id" | "timestamp" | "status">
  ): Promise<Submission> => {
    const base: Omit<Submission, "id"> = {
      ...data,
      timestamp: new Date().toISOString(),
      status: "active",
      clientCode:
        data.clientCode ?? Math.random().toString(36).substring(2, 8).toUpperCase(),
    };

    if (isFirebaseConnected) {
      try {
        const ref = await addDoc(collection(db, SUBMISSIONS_COLLECTION), base);
        const newItem: Submission = { id: ref.id, ...base };
        const updated = [newItem, ...submissions];
        setSubmissions(updated);
        saveLocal(updated);
        return newItem;
      } catch (err) {
        console.error("Firestore add submission failed:", err);
      }
    }

    // local fallback
    const newItem: Submission = {
      ...base,
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
    };
    const updated = [newItem, ...submissions];
    setSubmissions(updated);
    saveLocal(updated);
    return newItem;
  };

  const setSubmissionStatus = async (id: string, status: Submission["status"]) => {
    const current = submissions.find((s) => s.id === id);
    if (!current) return;

    if (isFirebaseConnected) {
      try {
        await updateDoc(doc(db, SUBMISSIONS_COLLECTION, id), { status });
      } catch (err) {
        console.error("Firestore status update failed:", err);
      }
    }

    const updated = submissions.map((s) => (s.id === id ? { ...s, status } : s));
    setSubmissions(updated);
    saveLocal(updated);
  };

  const removeSubmission = async (id: string) => {
    if (isFirebaseConnected) {
      try {
        await deleteDoc(doc(db, SUBMISSIONS_COLLECTION, id));
      } catch (err) {
        console.error("Firestore delete submission failed:", err);
      }
    }

    const updated = submissions.filter((s) => s.id !== id);
    setSubmissions(updated);
    saveLocal(updated);
  };

  const clearSubmissions = async () => {
    if (isFirebaseConnected) {
      try {
        await Promise.all(
          submissions.map((s) => deleteDoc(doc(db, SUBMISSIONS_COLLECTION, s.id)))
        );
      } catch (err) {
        console.error("Firestore clear submissions failed:", err);
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
