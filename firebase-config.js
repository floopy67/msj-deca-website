import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAYVTsoe2W26HpYGMGrj2S9N5J4dwxrQmQ",
  authDomain: "msj-deca.firebaseapp.com",
  projectId: "msj-deca",
  storageBucket: "msj-deca.firebasestorage.app",
  messagingSenderId: "433553740826",
  appId: "1:433553740826:web:e47f72f930cb920da56da3",
  measurementId: "G-B79RRL4NM6"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account"
});

export {
  auth,
  db,
  googleProvider
};
