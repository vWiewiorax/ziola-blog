import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
}

const emulatorHost = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST;

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Brak konfiguracji Firebase, uzupełnij zmienne NEXT_PUBLIC_FIREBASE_* w pliku .env.local",
    );
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

let dbInstance: Firestore | undefined;
let authInstance: Auth | undefined;

export function getDb(): Firestore {
  if (!dbInstance) {
    dbInstance = getFirestore(getFirebaseApp());
    if (emulatorHost) connectFirestoreEmulator(dbInstance, emulatorHost, 8080);
  }
  return dbInstance;
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp());
    if (emulatorHost) {
      connectAuthEmulator(authInstance, `http://${emulatorHost}:9099`, { disableWarnings: true });
    }
  }
  return authInstance;
}

export const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID ?? "";

export function isAdminUid(uid: string | undefined | null): boolean {
  return Boolean(uid && adminUid && uid === adminUid);
}
