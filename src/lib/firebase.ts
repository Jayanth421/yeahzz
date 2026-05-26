import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || "",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    process.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID || "",
};

const primaryPortfolioCollection =
  process.env.NEXT_PUBLIC_FIREBASE_PORTFOLIO_COLLECTION || "portfolio_projects";
const primaryInquiryCollection =
  process.env.NEXT_PUBLIC_FIREBASE_INQUIRY_COLLECTION || "nexus_craft_submissions";

const dedupe = (values: string[]) => [...new Set(values.filter(Boolean))];

export const PORTFOLIO_COLLECTION_NAMES = dedupe([
  primaryPortfolioCollection,
  "portfolio_projects",
  "portfolio",
  "projects",
]);

export const INQUIRY_COLLECTION_NAMES = dedupe([
  primaryInquiryCollection,
  "nexus_craft_submissions",
  "submissions",
  "inquiries",
]);

let db: Firestore | null = null;
let isFirebaseConnected = false;

if (firebaseConfig.apiKey && firebaseConfig.projectId && typeof window !== "undefined") {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    isFirebaseConnected = true;
    console.log("Firebase Firestore initialized successfully.");
  } catch (error) {
    console.error("Firebase initialization failed, using local storage fallback:", error);
  }
} else {
  console.log("Firebase configuration missing in env. Local storage fallback will be active.");
}

export { db, isFirebaseConnected };
