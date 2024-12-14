// Firebase imports
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication state
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = 'index.html'; // Redirect to login if not authenticated
        } else {
            document.getElementById('player-name').textContent = `Welcome, ${user.displayName}`;
        }
    });

    // Sign-out functionality
    document.getElementById('signout-btn').addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                window.location.href = 'index.html'; // Redirect to login
            })
            .catch((error) => {
                console.error("Error signing out:", error.message);
            });
    });

    // Initialize game variables
    let currentPlayer = 'X';
    let gameOver = false;

    // Reset game function
    function resetGame() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell) => {
            cell.textContent = '';
            cell.classList.remove('X', 'O');
        });
        currentPlayer = 'X';
        gameOver = false;
        document.getElementById('game-status').textContent = "Player X's turn";
    }

    // Attach event listener to "New Game" button
    document.getElementById('new-game-btn').addEventListener('click', resetGame);

    // Function to handle cell click
    function handleClick(event) {
        console.log("Cell clicked!"); // Debugging
        if (gameOver) return;

        const cell = event.target;
        if (cell.textContent) {
            console.log("Cell already filled."); // Debugging
            return; // Prevent overwriting
        }

        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer);

        // Check for a winner
        if (checkWinner(currentPlayer)) {
            document.getElementById('game-status').textContent = `${currentPlayer} wins!`;
            gameOver = true;
            updateScore();
            return;
        }

        // Switch players
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        document.getElementById('game-status').textContent = `Player ${currentPlayer}'s turn`;
    }

    // Check for a winner
    function checkWinner(player) {
        const cells = Array.from(document.querySelectorAll('.cell'));
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winPatterns.some((pattern) => {
            return pattern.every((index) => cells[index].textContent === player);
        });
    }

    // Attach event listeners to game cells
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        cell.addEventListener('click', handleClick);
    });

    console.log("Event listeners added to cells."); // Debugging

    // Update player score in Firestore
    async function updateScore() {
        if (auth.currentUser) {
            const playerRef = doc(db, "players", auth.currentUser.uid);
            const playerDoc = await getDoc(playerRef);
            if (playerDoc.exists()) {
                const currentScore = playerDoc.data().score || 0;
                await setDoc(playerRef, { score: currentScore + 1 }, { merge: true });
            } else {
                await setDoc(playerRef, { score: 1 });
            }
        }
    }
});
