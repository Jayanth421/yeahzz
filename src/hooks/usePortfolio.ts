import { useState, useEffect } from "react";
import { isSupabaseConnected, PORTFOLIO_TABLE_NAMES, supabase } from "../lib/supabase";

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

export function usePortfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);
    if (isSupabaseConnected && supabase) {
      const client = supabase;
      try {
        let list: Project[] = [];
        let activeTable = PORTFOLIO_TABLE_NAMES[0];

        for (const tableName of PORTFOLIO_TABLE_NAMES) {
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
            return {
              id: String(payload.id || ""),
              title: typeof payload.title === "string" ? payload.title : "",
              category: typeof payload.category === "string" ? payload.category : "Website",
              image: typeof payload.image === "string" ? payload.image : "src/assets/portfolio-fintech.jpg",
              tags: Array.isArray(payload.tags)
                ? payload.tags.filter((tag): tag is string => typeof tag === "string")
                : [],
              websiteUrl: typeof payload.websiteUrl === "string" ? payload.websiteUrl : undefined,
            } as Project;
          });

          if (parsed.length > 0) {
            list = parsed;
            activeTable = tableName;
            break;
          }
        }

        if (list.length === 0) {
          // If Supabase table is empty, seed with defaults
          for (const proj of DEFAULT_PROJECTS) {
            const writeResult = await withTimeout(
              Promise.resolve(
                supabase.from(activeTable).upsert(
                {
                  id: proj.id,
                  title: proj.title,
                  category: proj.category,
                  image: proj.image,
                  tags: proj.tags,
                },
                { onConflict: "id" },
                ),
              ),
            );
            if (writeResult === null) {
              console.warn(`Supabase seed write timed out for project: ${proj.id}`);
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
        console.error("Failed to fetch from Supabase, falling back to local:", error);
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

    if (isSupabaseConnected && supabase) {
      try {
        const writeResult = await withTimeout(
          Promise.resolve(
            supabase.from(PORTFOLIO_TABLE_NAMES[0]).upsert({ id, ...project }, { onConflict: "id" }),
          ),
        );
        if (writeResult === null) {
          console.warn("Supabase add timed out.");
        }
      } catch (error) {
        console.error("Supabase add failed:", error);
      }
    }

    await saveProjects(updated);
    return newProj;
  };

  const updateProject = async (project: Project) => {
    const updated = projects.map((p) => (p.id === project.id ? project : p));

    if (isSupabaseConnected && supabase) {
      try {
        const writeResult = await withTimeout(
          Promise.resolve(supabase.from(PORTFOLIO_TABLE_NAMES[0]).upsert(project, { onConflict: "id" })),
        );
        if (writeResult === null) {
          console.warn("Supabase update timed out.");
        }
      } catch (error) {
        console.error("Supabase update failed:", error);
      }
    }

    await saveProjects(updated);
  };

  const deleteProject = async (id: string) => {
    const updated = projects.filter((p) => p.id !== id);

    if (isSupabaseConnected && supabase) {
      try {
        const writeResult = await withTimeout(
          Promise.resolve(supabase.from(PORTFOLIO_TABLE_NAMES[0]).delete().eq("id", id)),
        );
        if (writeResult === null) {
          console.warn("Supabase delete timed out.");
        }
      } catch (error) {
        console.error("Supabase delete failed:", error);
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
    isSupabaseConnected,
  };
}
