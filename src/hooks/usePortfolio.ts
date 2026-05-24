import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, isFirebaseConnected } from "../lib/firebase";

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

export function usePortfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);
    if (isFirebaseConnected && db) {
      try {
        const querySnapshot = await getDocs(collection(db, "portfolio_projects"));
        const list: Project[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Project);
        });

        if (list.length === 0) {
          // If Firestore is empty, seed it with default projects
          for (const proj of DEFAULT_PROJECTS) {
            await setDoc(doc(db, "portfolio_projects", proj.id), {
              title: proj.title,
              category: proj.category,
              image: proj.image,
              tags: proj.tags,
            });
          }
          setProjects(DEFAULT_PROJECTS);
        } else {
          setProjects(list);
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
        const stored = localStorage.getItem("nexus_craft_portfolio");
        if (stored) {
          setProjects(JSON.parse(stored));
        } else {
          localStorage.setItem("nexus_craft_portfolio", JSON.stringify(DEFAULT_PROJECTS));
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
      localStorage.setItem("nexus_craft_portfolio", JSON.stringify(updatedList));
    }
  };

  const addProject = async (project: Omit<Project, "id">) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const newProj = { id, ...project };
    const updated = [...projects, newProj];

    if (isFirebaseConnected && db) {
      try {
        await setDoc(doc(db, "portfolio_projects", id), project);
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
        await setDoc(doc(db, "portfolio_projects", id), data);
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
        await deleteDoc(doc(db, "portfolio_projects", id));
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
