import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  type Firestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

// ── Firebase project config ──────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBX0NG8rh4CV7HCiTATfaws9nrVAC8KXpY",
  authDomain: "yeahzz.firebaseapp.com",
  projectId: "yeahzz",
  storageBucket: "yeahzz.firebasestorage.app",
  messagingSenderId: "836766697981",
  appId: "1:836766697981:web:74e5810c419c1ff17bf194",
  measurementId: "G-18TH735ZPB",
};

// ── Firestore collection names ────────────────────────────────────────────────
export const SUBMISSIONS_COLLECTION = "submissions";
export const PORTFOLIO_COLLECTION = "portfolio";

// ── Singleton initialisation (safe for Next.js SSR/hot-reload) ───────────────
let app: FirebaseApp;
let db: Firestore;

// Only initialise on the client (Firestore uses browser APIs)
if (typeof window !== "undefined") {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
}

export const isFirebaseConnected = typeof window !== "undefined";

export { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy };
