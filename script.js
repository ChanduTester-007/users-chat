import { db, auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

let currentUserEmail = null;
let chatWithEmail = null;
let unsubscribe = null;

function generateChatId(email1, email2) {
  return [email1, email2].sort().join('_');
}

window.login = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    currentUserEmail = userCredential.user.email;
    document.getElementById("uidDisplay").textContent = `Logged in as: ${currentUserEmail}`;
  } catch (error) {
    alert("Login failed: " + error.message);
  }
};

window.startChat = () => {
  chatWithEmail = document.getElementById("chatWith").value.trim();
  if (!currentUserEmail || !chatWithEmail) return;

  const chatId = generateChatId(currentUserEmail, chatWithEmail);
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("timestamp"));

  if (unsubscribe) unsubscribe();
  unsubscribe = onSnapshot(q, (snapshot) => {
    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = "";

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const div = document.createElement("div");
      div.className = data.sender === currentUserEmail ? "sent" : "received";

      const time = data.timestamp?.toDate().toLocaleTimeString() || '';

      let content = `<b>${data.sender === currentUserEmail ? "You" : data.sender}:</b> ${data.message} <br><small>${time}</small>`;

      // If it's user's own message, show edit/delete buttons
      if (data.sender === currentUserEmail) {
        content += `
          <br>
          <button onclick="editMessage('${docSnap.id}')">Edit</button>
          <button onclick="deleteMessage('${docSnap.id}')">Delete</button>
        `;
      }

      div.innerHTML = content;
      chatBox.appendChild(div);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  });
};

window.sendMessage = async () => {
  const message = document.getElementById("message").value.trim();
  if (!message || !currentUserEmail || !chatWithEmail) return;

  const chatId = generateChatId(currentUserEmail, chatWithEmail);
  const messagesRef = collection(db, "chats", chatId, "messages");

  await addDoc(messagesRef, {
    sender: currentUserEmail,
    message,
    timestamp: serverTimestamp()
  });

  document.getElementById("message").value = "";
};

window.editMessage = async (messageId) => {
  const newMsg = prompt("Enter new message:");
  if (!newMsg) return;

  const chatId = generateChatId(currentUserEmail, chatWithEmail);
  const messageDoc = doc(db, "chats", chatId, "messages", messageId);

  await updateDoc(messageDoc, {
    message: newMsg,
    edited: true
  });
};

window.deleteMessage = async (messageId) => {
  if (!confirm("Delete this message?")) return;

  const chatId = generateChatId(currentUserEmail, chatWithEmail);
  const messageDoc = doc(db, "chats", chatId, "messages", messageId);

  await deleteDoc(messageDoc);
};
