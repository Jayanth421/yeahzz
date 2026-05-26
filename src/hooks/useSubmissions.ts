import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db, INQUIRY_COLLECTION_NAMES, isFirebaseConnected } from "../lib/firebase";

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

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs = REQUEST_TIMEOUT_MS) => {
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

    if (isFirebaseConnected && db) {
      const fireDb = db;
      try {
        let firestoreItems: Submission[] = [];

        for (const collectionName of INQUIRY_COLLECTION_NAMES) {
          const snapshot = await withTimeout(getDocs(collection(fireDb, collectionName)));
          if (snapshot === null) {
            console.warn(`Firestore read timed out for collection: ${collectionName}`);
            continue;
          }
          const parsed = snapshot.docs.map((d) =>
            normalizeSubmission(d.id, d.data() as Record<string, unknown>)
          );

          if (parsed.length > 0) {
            firestoreItems = parsed;
            break;
          }
        }

        if (firestoreItems.length > 0) {
          setSubmissions(firestoreItems);
          saveLocalSubmissions(firestoreItems);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Failed loading submissions from Firestore:", error);
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

    if (isFirebaseConnected && db) {
      const fireDb = db;
      try {
        const writeResult = await withTimeout(
          setDoc(doc(fireDb, INQUIRY_COLLECTION_NAMES[0], newItem.id), newItem),
        );
        if (writeResult === null) {
          console.warn("Firestore submission write timed out.");
        }
      } catch (error) {
        console.error("Failed writing submission to Firestore:", error);
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

    if (isFirebaseConnected && db) {
      const fireDb = db;
      try {
        const writeResult = await withTimeout(
          setDoc(doc(fireDb, INQUIRY_COLLECTION_NAMES[0], id), updatedItem),
        );
        if (writeResult === null) {
          console.warn("Firestore submission status update timed out.");
        }
      } catch (error) {
        console.error("Failed updating submission status in Firestore:", error);
      }
    }

    const updated = submissions.map((item) => (item.id === id ? updatedItem : item));
    setSubmissions(updated);
    saveLocalSubmissions(updated);
  };

  const removeSubmission = async (id: string) => {
    if (isFirebaseConnected && db) {
      const fireDb = db;
      try {
        const writeResult = await withTimeout(deleteDoc(doc(fireDb, INQUIRY_COLLECTION_NAMES[0], id)));
        if (writeResult === null) {
          console.warn("Firestore submission delete timed out.");
        }
      } catch (error) {
        console.error("Failed deleting submission from Firestore:", error);
      }
    }

    const updated = submissions.filter((item) => item.id !== id);
    setSubmissions(updated);
    saveLocalSubmissions(updated);
  };

  const clearSubmissions = async () => {
    if (isFirebaseConnected && db) {
      const fireDb = db;
      try {
        const snapshot = await withTimeout(getDocs(collection(fireDb, INQUIRY_COLLECTION_NAMES[0])));
        if (snapshot === null) {
          console.warn("Firestore clear submissions read timed out.");
          return;
        }
        await Promise.all(
          snapshot.docs.map((entry) => deleteDoc(doc(fireDb, INQUIRY_COLLECTION_NAMES[0], entry.id))),
        );
      } catch (error) {
        console.error("Failed clearing Firestore submissions:", error);
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
