import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase Config
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

const dropArea = document.getElementById('drop-area');

// Unga Telegram Details
const botToken = "8234454796:AAEF_c5gExxUp7X7pTpu9brOBmjIOTac2uQ"; 
const chatId = "7752627907";

dropArea.addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // File selection window open aagum
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.onchange = e => {
            const file = e.target.files[0];
            uploadFile(file, user);
        };
        fileInput.click();
        
    } catch (error) {
        alert("Login Error: " + error.message);
    }
});

async function uploadFile(file, user) {
    // Files-ah Telegram-ku anuppura logic
    const url = `https://api.telegram.org/bot${botToken}/sendDocument`;
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("document", file);
    formData.append("caption", `PICMaster Update:\nUser: ${user.displayName}\nEmail: ${user.email}`);

    try {
        dropArea.innerHTML = "<h3>Sending to Server...</h3>";
        const response = await fetch(url, { method: "POST", body: formData });
        
        if(response.ok) {
            dropArea.innerHTML = "<h3>Success!</h3><p>File received by Telegram Server.</p>";
            alert("File sent to your Telegram Bot!");
        } else {
            throw new Error("Telegram Server Error");
        }
    } catch (error) {
        alert("Upload Error: " + error.message);
        dropArea.innerHTML = "<h3>Upload Failed</h3>";
    }
}
