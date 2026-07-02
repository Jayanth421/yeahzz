import { useState, useEffect } from "react";
import {
  isAirtableConnected,
  PORTFOLIO_TABLE,
  listRecords,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../lib/airtable";

export interface Project {
  id: string;
  /** Airtable record id */
  _recordId?: string;
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

// ── Airtable field mapping ───────────────────────────────────────────────────

type AirtableProjectFields = {
  Title: string;
  Category: string;
  Image: string;
  Tags: string; // comma-separated
  WebsiteUrl: string;
};

const toProject = (rec: { id: string; fields: Partial<AirtableProjectFields> }): Project => ({
  id: rec.id,
  _recordId: rec.id,
  title: rec.fields.Title ?? "",
  category: rec.fields.Category ?? "Website",
  image: rec.fields.Image ?? "src/assets/portfolio-fintech.jpg",
  tags: rec.fields.Tags ? rec.fields.Tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
  websiteUrl: rec.fields.WebsiteUrl ?? undefined,
});

const toFields = (p: Omit<Project, "id" | "_recordId">): AirtableProjectFields => ({
  Title: p.title,
  Category: p.category,
  Image: p.image,
  Tags: p.tags.join(", "),
  WebsiteUrl: p.websiteUrl ?? "",
});

// ── local helpers ────────────────────────────────────────────────────────────

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

// ── hook ─────────────────────────────────────────────────────────────────────

export function usePortfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);

    if (isAirtableConnected) {
      try {
        const records = await listRecords<AirtableProjectFields>(PORTFOLIO_TABLE);
        const items = records.map(toProject);

        if (items.length > 0) {
          setProjects(items);
          saveLocal(items);
          setLoading(false);
          return;
        }

        // Table exists but is empty — seed with defaults
        const seeded: Project[] = [];
        for (const proj of DEFAULT_PROJECTS) {
          try {
            const rec = await createRecord<AirtableProjectFields>(PORTFOLIO_TABLE, toFields(proj));
            seeded.push(toProject(rec));
          } catch (seedErr) {
            console.warn("Airtable seed failed for project:", proj.id, seedErr);
          }
        }
        const list = seeded.length > 0 ? seeded : DEFAULT_PROJECTS;
        setProjects(list);
        saveLocal(list);
        setLoading(false);
        return;
      } catch (err) {
        console.error("Airtable load failed, falling back to local:", err);
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

  const addProject = async (project: Omit<Project, "id" | "_recordId">): Promise<Project> => {
    if (isAirtableConnected) {
      try {
        const rec = await createRecord<AirtableProjectFields>(PORTFOLIO_TABLE, toFields(project));
        const newProj = toProject(rec);
        const updated = [...projects, newProj];
        setProjects(updated);
        saveLocal(updated);
        return newProj;
      } catch (err) {
        console.error("Airtable add failed:", err);
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
    if (isAirtableConnected && project._recordId) {
      try {
        await updateRecord<AirtableProjectFields>(
          PORTFOLIO_TABLE,
          project._recordId,
          toFields(project)
        );
      } catch (err) {
        console.error("Airtable update failed:", err);
      }
    }

    const updated = projects.map((p) => (p.id === project.id ? project : p));
    setProjects(updated);
    saveLocal(updated);
  };

  const deleteProject = async (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (isAirtableConnected && proj?._recordId) {
      try {
        await deleteRecord(PORTFOLIO_TABLE, proj._recordId);
      } catch (err) {
        console.error("Airtable delete failed:", err);
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
    isAirtableConnected,
  };
}
