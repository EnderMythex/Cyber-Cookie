/******************************************************************************************
 *                                                                                        *
 *           ██████╗██╗   ██╗      ██████╗ ██████╗  ██████╗ ██╗  ██╗██╗███████╗           *
 *           ██╔════╝╚██╗ ██╔╝     ██╔════╝██╔═══██╗██╔═══██╗██║ ██╔╝██║██╔════╝          *
 *           ██║      ╚████╔╝█████╗██║     ██║   ██║██║   ██║█████╔╝ ██║█████╗            *
 *           ██║       ╚██╔╝ ╚════╝██║     ██║   ██║██║   ██║██╔═██╗ ██║██╔══╝            *
 *           ╚██████╗   ██║        ╚██████╗╚██████╔╝╚██████╔╝██║  ██╗██║███████╗          *
 *            ╚═════╝   ╚═╝         ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝          *
 *                                                                                        *
 *          @project CyberCookie        @creator EndeMythex        @version 1.6.0         *
 *****************************************************************************************/


/* --------------------------------------------------------------------------

                              Setup / Import Resources                                                                                                                                  

   -------------------------------------------------------------------------- */

   import { db } from '../firebase/firebaseConfig.js';
   import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
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
   
   /* --------------------------------------------------------------------------
   
                                 Update Leadboard                                                                                                                                  
   
      -------------------------------------------------------------------------- */
   
   export async function updateLeaderboard(userId, username, score) {
       try {
           const auth = getAuth();
           const currentUser = auth.currentUser;

           if (!currentUser) {
               console.error("User must be logged in to update leaderboard");
               return;
           }

           // Utiliser l'ID de l'utilisateur connecté au lieu de celui passé en paramètre
           const actualUserId = currentUser.uid;
           const actualUsername = username || currentUser.displayName || 'Anonymous';

           // Vérification des paramètres requis
           if (!actualUserId || !actualUsername || score === undefined) {
               console.error("Missing required parameters for leaderboard update");
               return;
           }

           // Add rate limiting
           const now = new Date().getTime();
           const lastUpdate = localStorage.getItem(`lastLeaderboardUpdate_${actualUserId}`);
           
           if (lastUpdate && now - parseInt(lastUpdate) < 5000) {
               console.log("Leaderboard update throttled. Please wait.");
               return;
           }

           // Vérification que le score est un nombre valide
           if (isNaN(score) || score < 0) {
               console.error("Invalid score value");
               return;
           }

           const docRef = doc(db, "leaderboard", actualUserId);
           await setDoc(docRef, {
               username: actualUsername,
               score: score,
               lastUpdated: now,
               timestamp: now
           }, { merge: true });

           localStorage.setItem(`lastLeaderboardUpdate_${actualUserId}`, now.toString());
       } catch (error) {
           if (error.code === 'permission-denied') {
               console.error("Permission denied: Please check your authentication status");
               // Rediriger vers la page de connexion si nécessaire
               window.location.href = '/login.html';
           } else if (error.code === 'resource-exhausted') {
               console.warn("Quota exceeded. Waiting before retrying...");
           } else {
               console.error("Error updating leaderboard:", error.message);
           }
           throw error;
       }
   }
   
   /* --------------------------------------------------------------------------
   
                                 Load Leadboard                                                                                                                                  
   
      -------------------------------------------------------------------------- */
   
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
               if (error.code === 'resource-exhausted') {
                   console.warn("Quota exceeded. Reducing update frequency...");
                   // Implement a longer polling interval or show cached data
                   if (leaderboardUnsubscribe) {
                       leaderboardUnsubscribe();
                       leaderboardUnsubscribe = null;
                   }
                   
                   // Show cached leaderboard if available
                   const cachedData = localStorage.getItem('cachedLeaderboard');
                   if (cachedData) {
                       const leaderboardList = leaderboardContent.querySelector('.leaderboard-list') 
                           || document.createElement('div');
                       leaderboardList.className = 'leaderboard-list';
                       leaderboardList.innerHTML = cachedData;
                       leaderboardContent.appendChild(leaderboardList);
                   }
               }
               console.error("Error loading leaderboard:", error);
           });
   
           // Cache the leaderboard HTML for fallback
           const observer = new MutationObserver((mutations) => {
               const leaderboardList = leaderboardContent.querySelector('.leaderboard-list');
               if (leaderboardList) {
                   localStorage.setItem('cachedLeaderboard', leaderboardList.innerHTML);
               }
           });
   
           observer.observe(leaderboardContent, { childList: true, subtree: true });
   
       } catch (error) {
           console.error("Error setting up leaderboard:", error);
       }
   }
   
   /* --------------------------------------------------------------------------
    
                                    Format Number
    
      -------------------------------------------------------------------------- */
   
   function formatNumber(num) {
       if (num >= 1000000) {
           return (num / 1000000).toFixed(1) + 'M';
       } else if (num >= 1000) {
           return (num / 1000).toFixed(1) + 'K';
       }
       return num.toString();
   }
   
   /* --------------------------------------------------------------------------
    
                               Initialize Leaderboard
    
      -------------------------------------------------------------------------- */
   
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
   
   