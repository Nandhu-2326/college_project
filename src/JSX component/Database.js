import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANarDaRBh3TvsZvhIzgi1V-St7JuZrFEs",
  authDomain: "college-mark.firebaseapp.com",
  projectId: "college-mark",
  storageBucket: "college-mark.firebasestorage.app",
  messagingSenderId: "710220235571",
  appId: "1:710220235571:web:05337252768d713fc63446"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
  const db = getFirestore(app)
export { db }