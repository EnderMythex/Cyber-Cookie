import { db } from './firebaseConfig.js';
import { 
    collection, 
    query, 
    orderBy, 
    limit, 
    getDocs, 
    setDoc, 
    doc, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

let previousScores = new Map();
let leaderboardUnsubscribe = null; // Pour stocker la fonction de désabonnement

export async function updateLeaderboard(userId, username, score) {
    try {
        await setDoc(doc(db, "leaderboard", userId), {
            username: username,
            score: score,
            lastUpdated: new Date().getTime()
        });
    } catch (error) {
        console.error("Error updating leaderboard:", error);
    }
}

export async function loadLeaderboard() {
    const leaderboardContent = document.getElementById('leaderboardContent');
    
    try {
        const leaderboardQuery = query(
            collection(db, "leaderboard"),
            orderBy("score", "desc"),
            limit(7)
        );
        
        if (leaderboardUnsubscribe) {
            leaderboardUnsubscribe();
        }

        leaderboardUnsubscribe = onSnapshot(leaderboardQuery, (querySnapshot) => {
            if (!leaderboardContent.querySelector('.leaderboard-list')) {
                const leaderboardList = document.createElement('div');
                leaderboardList.className = 'leaderboard-list';
                leaderboardContent.appendChild(leaderboardList);
            }
            
            const leaderboardList = leaderboardContent.querySelector('.leaderboard-list');
            let rank = 1;
            const currentScores = new Map();
            const entries = new Map();
            
            // Première passe : créer ou mettre à jour les entrées
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const userId = doc.id;
                currentScores.set(userId, data);
                
                let entry = leaderboardList.querySelector(`[data-user-id="${userId}"]`);
                
                if (!entry) {
                    entry = document.createElement('div');
                    entry.className = 'leaderboard-entry';
                    entry.setAttribute('data-user-id', userId);
                }
                
                const previousData = previousScores.get(userId);
                if (!previousData || 
                    previousData.score !== data.score || 
                    previousData.username !== data.username) {
                    
                    entry.innerHTML = `
                        <span class="rank">#${rank}</span>
                        <span class="username">${data.username || 'Anonymous'}</span>
                        <span class="score">${formatNumber(data.score)}</span>
                    `;
                    
                    entry.classList.add('updated');
                    setTimeout(() => entry.classList.remove('updated'), 500);
                }
                
                entries.set(userId, { entry, score: data.score });
                rank++;
            });
            
            // Deuxième passe : réorganiser les entrées dans le bon ordre
            leaderboardList.innerHTML = ''; // Vider la liste
            const sortedEntries = Array.from(entries.values())
                .sort((a, b) => b.score - a.score);
            
            sortedEntries.forEach((item, index) => {
                const rankSpan = item.entry.querySelector('.rank');
                if (rankSpan) {
                    rankSpan.textContent = `#${index + 1}`;
                }
                leaderboardList.appendChild(item.entry);
            });
            
            // Supprimer les entrées qui ne sont plus dans le top 10
            const oldEntries = leaderboardList.querySelectorAll('.leaderboard-entry');
            oldEntries.forEach(entry => {
                const userId = entry.getAttribute('data-user-id');
                if (!currentScores.has(userId)) {
                    entry.remove();
                }
            });
            
            previousScores = currentScores;
            
            if (rank === 1) {
                leaderboardList.innerHTML = `
                    <div class="leaderboard-empty">No scores yet. Be the first!</div>
                `;
            }
        }, (error) => {
            console.error("Error loading leaderboard:", error);
            if (!leaderboardContent.querySelector('.leaderboard-error')) {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'leaderboard-error';
                errorMessage.textContent = 'Error loading leaderboard. Please try again later.';
                leaderboardContent.appendChild(errorMessage);
            }
        });
        
    } catch (error) {
        console.error("Error setting up leaderboard:", error);
    }
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

export function initializeLeaderboard() {
    const leaderboardBtn = document.getElementById('leaderboardBtn');
    const leaderboardContainer = document.getElementById('leaderboardContainer');
    const settingsOptions = document.getElementById('settingsOptions');
    const cookie = document.getElementById('cookie');
    const discord = document.getElementById('discord');
    const theme = document.getElementById('theme');
    const extension = document.getElementById('extension');
    const shop = document.getElementById('shop');
    const settings = document.getElementById('settings');

    leaderboardBtn.addEventListener('click', async function () {
        if (leaderboardContainer.style.display === "none") {
            leaderboardContainer.style.display = "block";
            leaderboardBtn.textContent = "Home";
            settingsOptions.style.display = "none";
            cookie.style.display = 'none';
            discord.style.display = 'none';
            theme.style.display = 'none';
            extension.style.display = 'none';
            shop.style.display = 'none';
            settings.style.display = 'none';
            loadLeaderboard(); // Charger le leaderboard quand on l'affiche
        } else {
            leaderboardContainer.style.display = "none";
            cookie.style.display = 'block';
            leaderboardBtn.textContent = "LeadBoard";
            theme.style.display = 'block';
            discord.style.display = 'block';
            extension.style.display = 'block';
            shop.style.display = 'block';
            settings.style.display = 'block';
            // Désabonner quand on cache le leaderboard
            if (leaderboardUnsubscribe) {
                leaderboardUnsubscribe();
                leaderboardUnsubscribe = null;
            }
        }
    });
}

