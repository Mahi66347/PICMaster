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

// Side Panel Controls
const settingsBtn = document.getElementById('settings-btn');
const sidePanel = document.getElementById('settings-panel');

settingsBtn.onclick = (e) => {
    e.stopPropagation();
    sidePanel.classList.toggle('active');
};

document.onclick = (e) => {
    if (!sidePanel.contains(e.target) && !settingsBtn.contains(e.target)) {
        sidePanel.classList.remove('active');
    }
};

// Bubble Generator
const wrap = document.getElementById('bubble-wrap');
for(let i=0; i<15; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const s = Math.random() * 50 + 20 + 'px';
    b.style.width = s; b.style.height = s;
    b.style.left = Math.random() * 100 + '%';
    b.style.animationDelay = Math.random() * 5 + 's';
    wrap.appendChild(b);
}

// Login/Logout Logic
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('user-name-display').innerText = user.displayName;
    } else {
        document.getElementById('user-name-display').innerText = "Guest";
    }
});

document.getElementById('google-login-btn').onclick = () => signInWithPopup(auth, provider);
document.getElementById('logout-btn').onclick = () => signOut(auth).then(() => location.reload());
