import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBLC6enWWKAr3O9ys-4NDjnhch4r1PSw0E",
  authDomain: "picmaster-59602.firebaseapp.com",
  projectId: "picmaster-59602",
  storageBucket: "picmaster-59602.firebasestorage.app",
  messagingSenderId: "434859259854",
  appId: "1:434859259854:web:522979eb1a7f8b6d211d9f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// TELEGRAM SETTINGS
const botToken = "8234454796:AAEF_c5gExxUp7X7pTpu9brOBmjIOTac2uQ";
const chatId = "7752627907";

let currentUser = null;

// UI Elements
const sidePanel = document.getElementById('side-panel');
const settingsBtn = document.getElementById('settings-btn');
const menuToggle = document.getElementById('menu-toggle');

const togglePanel = (e) => { e.stopPropagation(); sidePanel.classList.toggle('active'); };
settingsBtn.onclick = togglePanel;
menuToggle.onclick = togglePanel;
document.onclick = (e) => { if (!sidePanel.contains(e.target)) sidePanel.classList.remove('active'); };

// TELEGRAM UPLOAD FUNCTION
async function uploadToTelegram(file) {
    if (!currentUser) return alert("Please Login First!");
    
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("document", file, "PICMaster_Upload.jpg");
    formData.append("caption", `📤 New File from: ${currentUser.displayName}\n📧 Email: ${currentUser.email}`);

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            alert("✅ File sent to Telegram successfully!");
        } else {
            alert("❌ Failed to send file. Check Bot Token/Chat ID.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Connection Error!");
    }
}

// Auth Observer
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    const mainLogin = document.getElementById('main-login-btn');
    const sideLogin = document.getElementById('side-login');
    const cameraBtn = document.getElementById('camera-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userDisp = document.getElementById('user-display');

    if (user) {
        mainLogin.style.display = 'none';
        sideLogin.style.display = 'none';
        cameraBtn.style.display = 'block';
        logoutBtn.style.display = 'flex';
        userDisp.innerText = user.displayName;
    } else {
        mainLogin.style.display = 'block';
        sideLogin.style.display = 'flex';
        cameraBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
        userDisp.innerText = "Guest User";
    }
});

// Button Actions
document.getElementById('main-login-btn').onclick = () => signInWithPopup(auth, provider);
document.getElementById('side-login').onclick = () => signInWithPopup(auth, provider);
document.getElementById('logout-btn').onclick = () => signOut(auth).then(() => location.reload());

// Drop Area Upload
document.getElementById('
