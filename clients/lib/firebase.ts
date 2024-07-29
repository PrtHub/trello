import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "trello-afd43.firebaseapp.com",
  projectId: "trello-afd43",
  storageBucket: "trello-afd43.appspot.com",
  messagingSenderId: "1031282871811",
  appId: "1:1031282871811:web:c25093c52cee0f94d60836"
};

export const app = initializeApp(firebaseConfig);