// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA-FK7MwkOUTGYWU1N0YaXC5TxT060Azvc",
    authDomain: "tic-toc-toe-50c2c.firebaseapp.com",
    projectId: "tic-toc-toe-50c2c",
    storageBucket: "tic-toc-toe-50c2c.appspot.com",
    messagingSenderId: "550324643784",
    appId: "1:550324643784:web:72d584ce336e48fae582fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle Google Sign-In
document.getElementById('google-signin-btn').addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            localStorage.setItem('playerName', user.displayName);
            localStorage.setItem('playerUID', user.uid);
            window.location.href = 'game.html';
        })
        .catch((error) => {
            console.error("Error during sign-in:", error.message);
            alert("Sign-in failed: " + error.message);
        });
});
