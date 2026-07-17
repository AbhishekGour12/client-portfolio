import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDiAj08aOzZ7jbtmsbZxB3G_tr5aa0NICM",
  authDomain: "anushi-8c153.firebaseapp.com",
  databaseURL: "https://anushi-8c153-default-rtdb.firebaseio.com",
  projectId: "anushi-8c153",
  storageBucket: "anushi-8c153.firebasestorage.app",
  messagingSenderId: "844197592750",
  appId: "1:844197592750:web:4022ea91741a7158f1b73f",
  measurementId: "G-QSB8FHWVS4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
