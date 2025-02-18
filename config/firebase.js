// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAErSpyk-Kd2HSt1AGCpsvgK1QVtCsfFew",
  authDomain: "cravingansbeta.firebaseapp.com",
  projectId: "cravingansbeta",
  storageBucket: "cravingansbeta.firebasestorage.app",
  messagingSenderId: "258402165067",
  appId: "1:258402165067:web:31694f132942b260fac8ce",
  measurementId: "G-FP5XWL954Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};
