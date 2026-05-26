import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

const primaryPortfolioTable =
  process.env.NEXT_PUBLIC_SUPABASE_PORTFOLIO_TABLE || "portfolio_projects";
const primaryInquiryTable =
  process.env.NEXT_PUBLIC_SUPABASE_INQUIRY_TABLE || "nexus_craft_submissions";

const dedupe = (values: string[]) => [...new Set(values.filter(Boolean))];

export const PORTFOLIO_TABLE_NAMES = dedupe([
  primaryPortfolioTable,
  "portfolio_projects",
  "portfolio",
  "projects",
]);

export const INQUIRY_TABLE_NAMES = dedupe([
  primaryInquiryTable,
  "nexus_craft_submissions",
  "submissions",
  "inquiries",
]);

let supabase: SupabaseClient | null = null;
let isSupabaseConnected = false;

if (supabaseUrl && supabaseKey && typeof window !== "undefined") {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
    isSupabaseConnected = true;
    console.log("Supabase client initialized.");
  } catch (error) {
    console.error("Supabase initialization failed, using local storage fallback:", error);
  }
} else {
  console.log("Supabase configuration missing in env. Local storage fallback will be active.");
}

export { supabase, isSupabaseConnected };
