import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Unga screenshot-la iruntha correct config:
const firebaseConfig = {
  apiKey: "AIzaSyBLC6enWWKAr309ys-4NDjnhch4r1Psw0E",
  authDomain: "picmaster-59602.firebaseapp.com",
  projectId: "picmaster-59602",
  storageBucket: "picmaster-59602.firebasestorage.app",
  messagingSenderId: "434859259854",
  appId: "1:434859259854:web:522979eb1a7f8b6d211d9f",
  measurementId: "G-V15THQL3Z4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage();
const provider = new GoogleAuthProvider();

const dropArea = document.getElementById('drop-area');
const statusMsg = document.getElementById('status-msg');

// Click panna Login aahi file picker open aagum
dropArea.addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = _ => {
            let file = input.files[0];
            uploadFile(file, user);
        };
        input.click();
    } catch (error) {
        alert("Login Failed: " + error.message);
    }
});

async function uploadFile(file, user) {
    const storageRef = ref(storage, 'uploads/' + user.email + '/' + file.name);
    dropArea.innerHTML = "<p>Uploading...</p>";
    
    await uploadBytes(storageRef, file);
    
    dropArea.classList.add('hidden');
    statusMsg.classList.remove('hidden');
}
