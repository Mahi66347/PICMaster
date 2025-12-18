import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Unga Firebase Project details (Corrected)
const firebaseConfig = {
  apiKey: "AIzaSyBLC6enWWKAr309ys-4NDjnhch4r1Psw0E",
  authDomain: "picmaster-59602.firebaseapp.com",
  projectId: "picmaster-59602",
  storageBucket: "picmaster-59602.firebasestorage.app",
  messagingSenderId: "434859259854",
  appId: "1:434859259854:web:522979eb1a7f8b6d211d9f",
  measurementId: "G-V15THQL3Z4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const dropArea = document.getElementById('drop-area');

// Login Click Logic
dropArea.addEventListener('click', async () => {
    try {
        console.log("Attempting Login...");
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Login Success aana alert varum
        alert("Success! Logged in as: " + user.displayName);
        
        // UI Change
        dropArea.innerHTML = `<h3>Login Success!</h3><p>Welcome ${user.displayName}</p><p>Server connecting...</p>`;
        
    } catch (error) {
        console.error("Login Error Details:", error);
        alert("Login Error: " + error.message);
    }
});

