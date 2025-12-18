import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Unga unmaiyaana configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLC6enWWKAr3O9ys-4NDjnhch4r1PSw0E", // Idhula 'O' correct-ah irukku
  authDomain: "picmaster-59602.firebaseapp.com",
  projectId: "picmaster-59602",
  storageBucket: "picmaster-59602.firebasestorage.app",
  messagingSenderId: "434859259854",
  appId: "1:434859259854:web:522979eb1a7f8b6d211d9f",
  measurementId: "G-V15THQL3Z4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const dropArea = document.getElementById('drop-area');

dropArea.addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        alert("Login Success: " + user.displayName);
        
        // Login success aana mela message maathuvom
        dropArea.innerHTML = `<h3>Welcome ${user.displayName}!</h3><p>Server-ku file access kudukka permission venum.</p>`;
    } catch (error) {
        console.error(error);
        alert("Login Error: " + error.message);
    }
});
