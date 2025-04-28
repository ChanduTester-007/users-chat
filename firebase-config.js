// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAw4K1waQG4p-3GuEB2I2ozeuF1vFKaeGk",
  authDomain: "school-chat-f66b4.firebaseapp.com",
  projectId: "school-chat-f66b4",
  storageBucket: "school-chat-f66b4.appspot.com",
  messagingSenderId: "615470684265",
  appId: "1:615470684265:web:5a1023ebf6335637282af8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
