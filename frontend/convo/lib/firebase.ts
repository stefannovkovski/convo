import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getMessaging, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBmbXq5HD4AEolEzot6UUga5-UN-a7wn5E",
  authDomain: "convo-33541.firebaseapp.com",
  projectId: "convo-33541",
  storageBucket: "convo-33541.firebasestorage.app",
  messagingSenderId: "58045087584",
  appId: "1:58045087584:web:2ab3b45bfe9ef890ea2805"
};

function getApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null;
  const apps = getApps();
  if (apps.length) return apps[0] as FirebaseApp;
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) return null;
  return initializeApp(firebaseConfig);
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let messaging: Messaging | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  app = app ?? getApp();
  return app;
}

export function getFirebaseFirestore(): Firestore | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  db = db ?? getFirestore(firebaseApp);
  return db;
}

export function getFirebaseAuth(): Auth | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp || typeof window === 'undefined') return null;
  auth = auth ?? getAuth(firebaseApp);
  return auth;
}

export function getFirebaseMessaging(): Messaging | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp || typeof window === 'undefined') return null;
  try {
    messaging = messaging ?? getMessaging(firebaseApp);
    return messaging;
  } catch {
    return null;
  }
}

export const isFirebaseConfigured = (): boolean =>
  !!(firebaseConfig.apiKey && firebaseConfig.projectId);
