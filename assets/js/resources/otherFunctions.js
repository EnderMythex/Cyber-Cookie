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

import { shopState } from './shopFunctions.js';

import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import { db } from '../firebase/firebaseConfig.js';

/* --------------------------------------------------------------------------
 
                          Variables d'état
 
   -------------------------------------------------------------------------- */

export const otherState = {
    miniCookiesEnabled: true,
    onekoEnabled: true,
    soundEnabled: true
};

/* --------------------------------------------------------------------------
 
                          Fonctions Audio
 
   -------------------------------------------------------------------------- */

export function playSound() {
    if (!otherState.soundEnabled) return;

    const son = new Audio("/assets/sounds/menu_click.wav");
    son.volume = 0.15;

    son.play();
}

export function playSound2() {
    if (!otherState.soundEnabled) return;

    const son = new Audio("/assets/sounds/main_click.wav");
    son.volume = 0.15;

    son.play();
}



/* --------------------------------------------------------------------------
 
                          Fonctions Vibration
 
   -------------------------------------------------------------------------- */

export function vibrate() {
    navigator.vibrate(100);
}

/* --------------------------------------------------------------------------
 
                          Mini Cookies Generator
 
   -------------------------------------------------------------------------- */

let cookieEffects;

export function initializeCookieEffects() {
    import('./canvasEffects.js').then(module => {
        cookieEffects = new module.CookieEffectsManager();
        cookieEffects.init();
    });
}

export function generateMiniCookie(x, y) {
    if (!otherState.miniCookiesEnabled || !cookieEffects) return;
    cookieEffects.generateCookie(x, y);
}

/* --------------------------------------------------------------------------
 
                          Ranks Functions
 
   -------------------------------------------------------------------------- */

export function updateRank(score) {
    const ranks = [
        { threshold: 5000000000, name: 'Grandmaster' },
        { threshold: 1000000000, name: 'Master' },
        { threshold: 100000000, name: 'Pro' },
        { threshold: 1000000, name: 'Expert' },
        { threshold: 500000, name: 'Veteran' },
        { threshold: 100000, name: 'Advanced' },
        { threshold: 20000, name: 'Intermediate' },
        { threshold: 1000, name: 'Novice' },
        { threshold: 0, name: 'Beginner' }
    ];

    const rank = ranks.find(r => score >= r.threshold).name;
    const rankIndicator = document.getElementById('rankIndicator');
    if (rankIndicator) {
        rankIndicator.innerText = rank;
    }
}

export function updateInterval() {
    updateRank(shopState.count);
    const totalCPS = (shopState.autoclickers * 0.1) +
        (shopState.powerfulAutoclickers * 0.5) +
        (shopState.superPowerfulAutoclickers * 2) +
        (shopState.ultraPowerfulAutoclickers * 10);

    document.getElementById('cps').textContent = totalCPS.toFixed(1);
}

/* --------------------------------------------------------------------------
 
                          Toggle Functions
 
   -------------------------------------------------------------------------- */

export function initializeToggles(playSound, saveToCookies) {
    const toggleOnekoBtn = document.getElementById('toggleOneko');
    const toggleMiniCookiesBtn = document.getElementById('toggleMiniCookies');
    const toggleSoundBtn = document.getElementById('toggleSound');

    toggleOnekoBtn.addEventListener('click', function () {
        if (otherState.soundEnabled) playSound();
        otherState.onekoEnabled = !otherState.onekoEnabled;
        toggleOnekoBtn.textContent = `Cat: ${otherState.onekoEnabled ? 'ON' : 'OFF'}`;

        // Récupérer tous les chats existants
        const cats = document.querySelectorAll('.oneko');

        if (!otherState.onekoEnabled) {
            cats.forEach(cat => {
                cat.style.display = 'none';
            });
            window.onekoEnabled = false;
        } else {
            cats.forEach(cat => {
                cat.style.display = 'block';
            });
            window.onekoEnabled = true;
        }

        saveToCookies();
    });

    toggleMiniCookiesBtn.addEventListener('click', function () {
        if (otherState.soundEnabled) playSound();
        otherState.miniCookiesEnabled = !otherState.miniCookiesEnabled;
        toggleMiniCookiesBtn.textContent = `Mini-Cookies: ${otherState.miniCookiesEnabled ? 'ON' : 'OFF'}`;
        saveToCookies();
    });

    toggleSoundBtn.addEventListener('click', function () {
        otherState.soundEnabled = !otherState.soundEnabled;
        toggleSoundBtn.textContent = `Sound: ${otherState.soundEnabled ? 'ON' : 'OFF'}`;
        saveToCookies();
    });
}

export function initializeOtherHandlers(cookie, playSound, generateMiniCookie) {
    cookie.addEventListener('click', () => {
        generateMiniCookie();
    });
}

/* --------------------------------------------------------------------------
 
                              Disable Drag
 
   -------------------------------------------------------------------------- */

document.addEventListener("dragstart", function (event) {
    if (event.target.tagName === "IMG") {
        event.preventDefault();
    }
});


/* --------------------------------------------------------------------------
 
                              Snowflakes
 
   -------------------------------------------------------------------------- */

// function createSnowflakes() {
//     const container = document.getElementById('snow');
//     const screenWidth = window.innerWidth;

//     for (let i = 0; i < 50; i++) {
//       const snowflake = document.createElement('div');
//       snowflake.className = 'snowflake';

//       const size = Math.random() * 4 + 2;
//       const startingLeft = Math.random() * screenWidth;
//       const duration = Math.random() * 3 + 2;

//       snowflake.style.width = `${size}px`;
//       snowflake.style.height = `${size}px`;
//       snowflake.style.left = `${startingLeft}px`;
//       snowflake.style.animation = `fall ${duration}s linear infinite`;
//       snowflake.style.animationDelay = `${Math.random() * duration}s`;

//       container.appendChild(snowflake);
//     }
//   }

//   createSnowflakes();
//   window.addEventListener('resize', () => {
//     document.getElementById('snow').innerHTML = '';
//     createSnowflakes();
//   });

/* --------------------------------------------------------------------------
 
                              Admin Panel
 
   -------------------------------------------------------------------------- */

export async function initializeAdminCookies(saveToCookies) {
    const adminCommands = {
        'add': (amount) => {
            shopState.count += parseInt(amount);
            document.getElementById('count').textContent = shopState.count.toLocaleString('fr-FR');
        },
        'set': (amount) => {
            shopState.count = parseInt(amount);
            document.getElementById('count').textContent = shopState.count.toLocaleString('fr-FR');
        },
        'multiply': (factor) => {
            shopState.count *= parseInt(factor);
            document.getElementById('count').textContent = shopState.count.toLocaleString('fr-FR');
        }
    };

    document.addEventListener('keydown', async function (event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'E') {
            // Vérifier si l'utilisateur est admin
            const userId = document.getElementById('userId')?.textContent;
            if (!userId || userId === 'User not connected') {
                console.log('Not connected');
                return;
            }

            try {
                const adminDoc = await getDoc(doc(db, "admins", userId));
                if (!adminDoc.exists()) {
                    console.log('Not an admin');
                    return;
                }

                // Si admin, afficher la console
                const command = prompt(`Admin Commands:
                - add <amount>
                - set <amount>
                - multiply <factor>
                
                Enter command:`);

                if (command) {
                    const [cmd, ...args] = command.trim().toLowerCase().split(' ');
                    if (adminCommands[cmd]) {
                        adminCommands[cmd](...args);
                        saveToCookies();
                        if (typeof playSound2 === 'function') {
                            playSound2();
                        }
                    }
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
            }
        }
    });
}

/* --------------------------------------------------------------------------

                                Loading screen

   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('.loader');

    // Créer une promesse pour chaque image
    const imagePromises = Array.from(document.images)
        .map(img => {
            if (img.complete) {
                return Promise.resolve();
            }
            return new Promise(resolve => {
                img.addEventListener('load', resolve);
                img.addEventListener('error', resolve); // Gérer aussi les erreurs
            });
        });

    // Créer une promesse pour les polices
    const fontPromise = document.fonts.ready;

    // Attendre que tout soit chargé
    Promise.all([
        ...imagePromises,
        fontPromise
    ]).then(() => {
        loader.classList.add('hidden');
    });
});

// Afficher le loader lors de la navigation
window.addEventListener('beforeunload', () => {
    const loader = document.querySelector('.loader');
    loader.classList.remove('hidden');
});