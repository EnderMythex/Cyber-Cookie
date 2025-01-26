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

import { auth, db } from '../firebase/firebaseConfig.js';

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import { getFirestore, setDoc, doc, onSnapshot, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { shopState, updateAutoclickerButtons, updateAutoclickerCosts } from './shopFunctions.js';

import { themeState, updateThemeButtons, applyTheme } from './themeFunctions.js';

import { otherState, updateInterval } from './otherFunctions.js';

/* --------------------------------------------------------------------------
 
                      FireStore Listener for Real-Time Updates
 
   -------------------------------------------------------------------------- */

export function listenForScoreUpdates(userId) {
    const userDocRef = doc(db, "users", userId);

    onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
            const userData = doc.data();
            const lastLocalUpdate = localStorage.getItem('lastUpdate') || 0;
            const serverTimestamp = userData.lastUpdate?.toMillis() || 0;

            if (serverTimestamp <= lastLocalUpdate) {
                return;
            }

            if (userData.shop?.score !== undefined) {
                var currentScore = parseInt(document.getElementById('count').textContent.replace(/,/g, ''), 10);
                var newScore = userData.shop.score;

                if (newScore !== currentScore) {
                    var display = document.getElementById('count');
                    display.textContent = newScore.toLocaleString('fr-FR');
                    localStorage.setItem('lastUpdate', serverTimestamp);
                }
            }
        }
    });
}

/* --------------------------------------------------------------------------
 
                      Load Data from FireStore
 
   -------------------------------------------------------------------------- */

export async function loadFromFirestore(userId) {
    const userDocRef = doc(db, "users", userId);

    try {
        // Charger les données initiales une fois avec forceUpdate
        const initialDoc = await getDoc(userDocRef);
        if (initialDoc.exists()) {
            // Force la mise à jour initiale
            updateDataFromFirestore(initialDoc.data(), true);
        }

        // Puis mettre en place l'écoute des changements
        onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                updateDataFromFirestore(doc.data());
            }
        });
    } catch (error) {
        console.error("Erreur lors du chargement depuis Firestore:", error);
    }
}

/* --------------------------------------------------------------------------
 
                        Update Data from FireStore
 
   -------------------------------------------------------------------------- */

function updateDataFromFirestore(userData, forceUpdate = false) {
    // Vérifier si les données sont plus récentes ou si c'est un forceUpdate
    const lastLocalUpdate = localStorage.getItem('lastUpdate') || 0;
    const serverTimestamp = userData.lastUpdate?.toMillis() || Date.now();

    if (!forceUpdate && serverTimestamp <= lastLocalUpdate) {
        console.log("Données locales plus récentes, synchronisation ignorée");
        return;
    }

    // Mettre à jour le score et les états du shop
    if (userData.shop) {
        // Mise à jour du score
        if (userData.shop.score !== undefined) {
            shopState.count = userData.shop.score;
            const display = document.getElementById('count');
            display.textContent = shopState.count.toLocaleString('fr-FR');
        }

        // Mise à jour des autoclickers
        if (userData.shop.autoclickers) {
            shopState.autoclickers = userData.shop.autoclickers.basic || 0;
            shopState.powerfulAutoclickers = userData.shop.autoclickers.powerful || 0;
            shopState.superPowerfulAutoclickers = userData.shop.autoclickers.superPowerful || 0;
            shopState.ultraPowerfulAutoclickers = userData.shop.autoclickers.ultraPowerful || 0;
        }

        // Mise à jour des coûts
        if (userData.shop.costs) {
            shopState.autoclickerCost = userData.shop.costs.autoclicker || 15;
            shopState.powerfulAutoclickerCost = userData.shop.costs.powerfulAutoclicker || 70;
            shopState.superPowerfulAutoclickerCost = userData.shop.costs.superPowerfulAutoclicker || 350;
            shopState.ultraPowerfulAutoclickerCost = userData.shop.costs.ultraPowerfulAutoclicker || 1700;
        }

        // Mise à jour du click power
        if (userData.shop.clickPower) {
            shopState.clickPower = userData.shop.clickPower.power || 1;
            shopState.clickPowerCost = userData.shop.clickPower.cost || 100;
        }
    }

    // Mise à jour des thèmes
    if (userData.themes) {
        if (userData.themes.purchased) {
            themeState.theme1Purchased = userData.themes.purchased.theme1 || false;
            themeState.theme2Purchased = userData.themes.purchased.theme2 || false;
            themeState.theme3Purchased = userData.themes.purchased.theme3 || false;
            themeState.theme4Purchased = userData.themes.purchased.theme4 || false;
            themeState.theme5Purchased = userData.themes.purchased.theme5 || false;
            themeState.theme6Purchased = userData.themes.purchased.theme6 || false;
            themeState.theme7Purchased = userData.themes.purchased.theme7 || false;
            themeState.theme8Purchased = userData.themes.purchased.theme8 || false;
            themeState.theme9Purchased = userData.themes.purchased.theme9 || false;
            themeState.theme10Purchased = userData.themes.purchased.theme10 || false;
            themeState.theme11Purchased = userData.themes.purchased.theme11 || false;
            themeState.theme12Purchased = userData.themes.purchased.theme12 || false;
        }
        themeState.currentTheme = userData.themes.current || '';
        if (themeState.currentTheme) {
            applyTheme(themeState.currentTheme, `/assets/backgrounds/background_${themeState.currentTheme.slice(-1)}.gif`);
        }
    }

    // Mise à jour des paramètres
    if (userData.settings) {
        otherState.miniCookiesEnabled = userData.settings.miniCookiesEnabled ?? true;
        otherState.onekoEnabled = userData.settings.onekoEnabled ?? true;

        // Mise à jour des boutons de toggle
        const toggleOnekoBtn = document.getElementById('toggleOneko');
        const toggleMiniCookiesBtn = document.getElementById('toggleMiniCookies');
        if (toggleOnekoBtn) toggleOnekoBtn.textContent = `Cat: ${otherState.onekoEnabled ? 'ON' : 'OFF'}`;
        if (toggleMiniCookiesBtn) toggleMiniCookiesBtn.textContent = `Mini-Cookies: ${otherState.miniCookiesEnabled ? 'ON' : 'OFF'}`;
    }

    // Mettre à jour l'interface
    updateAutoclickerButtons();
    updateAutoclickerCosts();
    updateThemeButtons();
    updateInterval();

    // Sauvegarder le timestamp de la dernière mise à jour
    localStorage.setItem('lastUpdate', serverTimestamp);
    console.log("Données synchronisées depuis Firestore");
}

/* --------------------------------------------------------------------------
 
                      Clear Cookies Function
 
   -------------------------------------------------------------------------- */

function clearAllCookies() {
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;secure`;
    }
}

/* --------------------------------------------------------------------------
 
                      User ID and Listener Initialization
 
   -------------------------------------------------------------------------- */

export function initializeAuthListener() {
    // Ajouter un loader pendant le chargement
    const loader = document.querySelector('.loader');
    if (loader) loader.style.display = 'block';

    // Réinitialiser le lastUpdate au chargement de la page
    localStorage.removeItem('lastUpdate');

    auth.onAuthStateChanged(async function (user) {
        const userIdElement = document.getElementById('userId');
        if (user) {
            userIdElement.textContent = user.uid;
            localStorage.setItem('isGoogleUser', 'true');
            clearAllCookies();
            await loadFromFirestore(user.uid);
        } else {
            userIdElement.textContent = 'User not connected';
            localStorage.removeItem('isGoogleUser');
        }

        // Cacher le loader une fois terminé
        if (loader) loader.style.display = 'none';
    });
}

/* --------------------------------------------------------------------------
 
                      FireStore Functions
 
   -------------------------------------------------------------------------- */

export async function saveToFirestore(userId, data) {
    if (localStorage.getItem('isGoogleUser')) {
        try {
            // Ajouter le timestamp actuel
            const timestamp = new Date();
            data.lastUpdate = timestamp;
            localStorage.setItem('lastUpdate', timestamp.getTime());

            await setDoc(doc(db, "users", userId), data);
            console.log("Données sauvegardées dans Firestore");
        } catch (error) {
            console.error("Erreur lors de la sauvegarde dans Firestore:", error);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const googleLogout = document.getElementById("google-logout-btn");
    googleLogout.addEventListener("click", function () {
        auth.signOut().then(() => {
            console.log("Utilisateur déconnecté");
            window.location.href = "/main.html";
        }).catch((error) => {
            console.error("Erreur lors de la déconnexion :", error);
        });
    });
});