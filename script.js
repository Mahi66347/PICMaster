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

// Panel Control Fix
const sidePanel = document.getElementById('side-panel');
const settingsBtn = document.getElementById('settings-btn');
const menuToggle = document.getElementById('menu-toggle');

const togglePanel = (e) => { e.stopPropagation(); sidePanel.classList.toggle('active'); };
settingsBtn.onclick = togglePanel;
menuToggle.onclick = togglePanel;

document.onclick = (e) => { if (!sidePanel.contains(e.target)) sidePanel.classList.remove('active'); };

// Bubble Background
const wrap = document.getElementById('bubble-wrap');
for(let i=0; i<20; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const s = Math.random() * 40 + 10 + 'px';
    b.style.width = s; b.style.height = s;
    b.style.left = Math.random() * 100 + '%';
    b.style.animationDuration = Math.random() * 5 + 5 + 's';
    b.style.animationDelay = Math.random() * 5 + 's';
    wrap.appendChild(b);
}

// Login/Logout Hide/Show Logic
onAuthStateChanged(auth, (user) => {
    const mainLogin = document.getElementById('main-login-btn');
    const sideLogin = document.getElementById('side-login');
    const cameraBtn = document.getElementById('camera-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userDisp = document.getElementById('user-display');

    if (user) {
        mainLogin.style.display = 'none';
        sideLogin.style.display = 'none';
        cameraBtn.style.display = 'block';
        logoutBtn.style.display = 'flex';
        userDisp.innerText = user.displayName;
    } else {
        mainLogin.style.display = 'block';
        sideLogin.style.display = 'flex';
        cameraBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
        userDisp.innerText = "Guest User";
    }
});

document.getElementById('main-login-btn').onclick = () => signInWithPopup(auth, provider);
document.getElementById('side-login').onclick = () => signInWithPopup(auth, provider);
document.getElementById('logout-btn').onclick = () => signOut(auth).then(() => location.reload());

// Drop Area Logic
const dropArea = document.getElementById('drop-area');
dropArea.onclick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => { alert("File Selected: " + e.target.files[0].name); };
    input.click();
};
