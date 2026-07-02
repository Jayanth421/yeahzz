import { useState, useEffect } from "react";
import {
  isFirebaseConnected,
  PORTFOLIO_COLLECTION,
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

// ── local helpers ─────────────────────────────────────────────────────────────

const loadLocal = (): Project[] => {
  if (typeof window === "undefined") return DEFAULT_PROJECTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Project[]) : DEFAULT_PROJECTS;
  } catch {
    return DEFAULT_PROJECTS;
  }
};

const saveLocal = (items: Project[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
};

// ── hook ──────────────────────────────────────────────────────────────────────

export function usePortfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);

    if (isFirebaseConnected) {
      try {
        const q = query(collection(db, PORTFOLIO_COLLECTION), orderBy("title"));
        const snap = await getDocs(q);
        const items: Project[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Project, "id">),
        }));

        if (items.length > 0) {
          setProjects(items);
          saveLocal(items);
          setLoading(false);
          return;
        }

        // Collection is empty — seed with defaults
        const seeded: Project[] = [];
        for (const proj of DEFAULT_PROJECTS) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id: _id, ...fields } = proj;
            const ref = await addDoc(collection(db, PORTFOLIO_COLLECTION), fields);
            seeded.push({ id: ref.id, ...fields });
          } catch (seedErr) {
            console.warn("Firestore seed failed for project:", proj.id, seedErr);
          }
        }
        const list = seeded.length > 0 ? seeded : DEFAULT_PROJECTS;
        setProjects(list);
        saveLocal(list);
        setLoading(false);
        return;
      } catch (err) {
        console.error("Firestore load projects failed, falling back to local:", err);
      }
    }

    const local = loadLocal();
    setProjects(local);
    setLoading(false);
  };

  useEffect(() => {
    void loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addProject = async (project: Omit<Project, "id">): Promise<Project> => {
    if (isFirebaseConnected) {
      try {
        const ref = await addDoc(collection(db, PORTFOLIO_COLLECTION), project);
        const newProj: Project = { id: ref.id, ...project };
        const updated = [...projects, newProj];
        setProjects(updated);
        saveLocal(updated);
        return newProj;
      } catch (err) {
        console.error("Firestore add project failed:", err);
      }
    }

    const newProj: Project = {
      ...project,
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    };
    const updated = [...projects, newProj];
    setProjects(updated);
    saveLocal(updated);
    return newProj;
  };

  const updateProject = async (project: Project) => {
    if (isFirebaseConnected) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, ...fields } = project;
        await updateDoc(doc(db, PORTFOLIO_COLLECTION, project.id), fields);
      } catch (err) {
        console.error("Firestore update project failed:", err);
      }
    }

    const updated = projects.map((p) => (p.id === project.id ? project : p));
    setProjects(updated);
    saveLocal(updated);
  };

  const deleteProject = async (id: string) => {
    if (isFirebaseConnected) {
      try {
        await deleteDoc(doc(db, PORTFOLIO_COLLECTION, id));
      } catch (err) {
        console.error("Firestore delete project failed:", err);
      }
    }

    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    saveLocal(updated);
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
