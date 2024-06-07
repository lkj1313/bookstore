import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKoHKutcJnlZCKin_1Zo_M2tAPzz97E_0",
  authDomain: "book-1922d.firebaseapp.com",
  projectId: "book-1922d",
  storageBucket: "book-1922d.appspot.com",
  messagingSenderId: "982083654732",
  appId: "1:982083654732:web:629196459ade42f89ed0e9",
  measurementId: "G-VXBJYYLEN1",
};

//firebase가 초기화되지 않았을때 실행

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
