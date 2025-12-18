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

// Sidebars Toggle
const menuBtn = document.getElementById('menu-btn');
const settingsBtn = document.getElementById('settings-btn');
const sideMenu = document.getElementById('side-menu');
const settingsPanel = document.getElementById('settings-panel');

menuBtn.onclick = (e) => { e.stopPropagation(); sideMenu.classList.toggle('active'); settingsPanel.classList.remove('active'); };
settingsBtn.onclick = (e) => { e.stopPropagation(); settingsPanel.classList.toggle('active'); sideMenu.classList.remove('active'); };

document.onclick = (e) => {
    if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) sideMenu.classList.remove('active');
    if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) settingsPanel.classList.remove('active');
};

// Background Bubbles Generator
const bubbleContainer = document.getElementById('bubbles');
for (let i = 0; i < 15; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const size = Math.random() * 60 + 20 + 'px';
    b.style.width = size; b.style.height = size;
    b.style.left = Math.random() * 100 + '%';
    b.style.animationDelay = Math.random() * 8 + 's';
    bubbleContainer.appendChild(b);
}

// Rest of your auth and upload logic... (Upload logic stays the same)
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('acc-name').innerText = user.displayName;
        document.getElementById('guest-icon').style.display = 'none';
        document.getElementById('user-img').src = user.photoURL;
        document.getElementById('user-img').style.display = 'block';
    }
});

document.getElementById('logout-btn').onclick = () => { if(confirm("Logout?")) signOut(auth).then(() => location.reload()); };
