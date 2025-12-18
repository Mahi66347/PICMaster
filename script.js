import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Unga Firebase Config (Corrected Key)
const firebaseConfig = {
  apiKey: "AIzaSyBLC6enWWKAr3O9ys-4NDjnhch4r1PSw0E", 
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

// Unga Telegram Details (Corrected)
const botToken = "8234454796:AAEF_c5gExxUp7X7pTpu9brOBmjIOTac2uQ";
const chatId = "7752627907";

const dropArea = document.getElementById('drop-area');
let currentUser = null;

// User Login status check
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        dropArea.innerHTML = `<h3>Welcome ${user.displayName}!</h3><p>Click here to select and send files to Telegram.</p>`;
    }
});

dropArea.addEventListener('click', async () => {
    if (!currentUser) {
        try {
            const result = await signInWithPopup(auth, provider);
            currentUser = result.user;
        } catch (error) {
            alert("Login Error: " + error.message);
        }
    } else {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.onchange = e => uploadFile(e.target.files[0], currentUser);
        fileInput.click();
    }
});

async function uploadFile(file, user) {
    const url = `https://api.telegram.org/bot${botToken}/sendDocument`;
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("document", file);
    formData.append("caption", `New File from: ${user.displayName}`);

    try {
        dropArea.innerHTML = "<h3>Sending to Telegram Bot...</h3>";
        const response = await fetch(url, { method: "POST", body: formData });
        const result = await response.json();

        if (response.ok) {
            dropArea.innerHTML = "<h3>Success! ✅</h3><p>File sent to your Telegram.</p>";
            alert("File sent successfully!");
        } else {
            alert("Telegram Error: " + result.description);
            dropArea.innerHTML = "<h3>Upload Failed</h3>";
        }
    } catch (error) {
        alert("Server Error. Check Internet.");
        dropArea.innerHTML = "<h3>Network Error</h3>";
    }
}
