import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, isFirebaseConnected, PORTFOLIO_COLLECTION_NAMES } from "../lib/firebase";

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  tags: string[];
  websiteUrl?: string;
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "p1",
    title: "CryptoFlow Platform",
    category: "Website",
    image: "src/assets/portfolio-fintech.jpg",
    tags: ["Web Development", "UX Design"],
  },
  {
    id: "p2",
    title: "Aura Couture",
    category: "eCommerce",
    image: "src/assets/portfolio-fashion.jpg",
    tags: ["eCommerce", "Branding"],
  },
  {
    id: "p3",
    title: "LuxeHomes Realty",
    category: "Website",
    image: "src/assets/portfolio-realestate.jpg",
    tags: ["Web Development", "SEO"],
  },
  {
    id: "p4",
    title: "FitTrack Pro",
    category: "Branding",
    image: "src/assets/portfolio-app.jpg",
    tags: ["App Design", "Branding"],
  },
  {
    id: "p5",
    title: "GrowthScale Campaign",
    category: "Marketing",
    image: "src/assets/portfolio-marketing.jpg",
    tags: ["Digital Marketing", "Analytics"],
  },
];

const STORAGE_KEY = "nexus_craft_portfolio";
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

export function usePortfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);
    if (isFirebaseConnected && db) {
      try {
        let list: Project[] = [];
        let activeCollection = PORTFOLIO_COLLECTION_NAMES[0];

        for (const collectionName of PORTFOLIO_COLLECTION_NAMES) {
          const querySnapshot = await withTimeout(getDocs(collection(db, collectionName)));
          if (querySnapshot === null) {
            console.warn(`Firestore read timed out for collection: ${collectionName}`);
            continue;
          }
          const parsed = querySnapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Project, "id">),
          }));

          if (parsed.length > 0) {
            list = parsed;
            activeCollection = collectionName;
            break;
          }
        }

        if (list.length === 0) {
          // If Firestore is empty, seed it with default projects
          for (const proj of DEFAULT_PROJECTS) {
            const writeResult = await withTimeout(setDoc(doc(db, activeCollection, proj.id), {
              title: proj.title,
              category: proj.category,
              image: proj.image,
              tags: proj.tags,
            }));
            if (writeResult === null) {
              console.warn(`Firestore seed write timed out for project: ${proj.id}`);
            }
          }
          setProjects(DEFAULT_PROJECTS);
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
          }
        } else {
          setProjects(list);
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
          }
        }
      } catch (error) {
        console.error("Failed to fetch from Firestore, falling back to local:", error);
        loadLocalProjects();
      } finally {
        setLoading(false);
      }
    } else {
      loadLocalProjects();
      setLoading(false);
    }
  };

  const loadLocalProjects = () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setProjects(JSON.parse(stored));
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
          setProjects(DEFAULT_PROJECTS);
        }
      } catch (error) {
        console.error("Local storage read failed:", error);
        setProjects(DEFAULT_PROJECTS);
      }
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const saveProjects = async (updatedList: Project[]) => {
    setProjects(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    }
  };

  const addProject = async (project: Omit<Project, "id">) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const newProj = { id, ...project };
    const updated = [...projects, newProj];

    if (isFirebaseConnected && db) {
      try {
        const writeResult = await withTimeout(setDoc(doc(db, PORTFOLIO_COLLECTION_NAMES[0], id), project));
        if (writeResult === null) {
          console.warn("Firestore add timed out.");
        }
      } catch (error) {
        console.error("Firestore add failed:", error);
      }
    }

    await saveProjects(updated);
    return newProj;
  };

  const updateProject = async (project: Project) => {
    const updated = projects.map((p) => (p.id === project.id ? project : p));

    if (isFirebaseConnected && db) {
      try {
        const { id, ...data } = project;
        const writeResult = await withTimeout(setDoc(doc(db, PORTFOLIO_COLLECTION_NAMES[0], id), data));
        if (writeResult === null) {
          console.warn("Firestore update timed out.");
        }
      } catch (error) {
        console.error("Firestore update failed:", error);
      }
    }

    await saveProjects(updated);
  };

  const deleteProject = async (id: string) => {
    const updated = projects.filter((p) => p.id !== id);

    if (isFirebaseConnected && db) {
      try {
        const writeResult = await withTimeout(deleteDoc(doc(db, PORTFOLIO_COLLECTION_NAMES[0], id)));
        if (writeResult === null) {
          console.warn("Firestore delete timed out.");
        }
      } catch (error) {
        console.error("Firestore delete failed:", error);
      }
    }

    await saveProjects(updated);
  };

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    refresh: loadProjects,
    isFirebaseConnected,
  };
}
