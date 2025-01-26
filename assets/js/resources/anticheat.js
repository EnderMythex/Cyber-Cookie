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

import { auth, db } from '../firebase/firebaseConfig.js';

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

/* --------------------------------------------------------------------------

                                AntiCheat                                                                                                                                  

   -------------------------------------------------------------------------- */

class AntiCheat {
    constructor() {
        this.lastClickTime = 0;
        this.clickCount = 0;
        this.suspiciousActivity = false;
        this.previousValues = {
            count: 0,
            clickPower: 1
        };
        this.checksumKey = crypto.getRandomValues(new Uint8Array(32));
        this.isHandlingConsole = false;
        this.isHandlingCheat = false;
        this.isHandlingDevTools = false;
        this.devToolsInterval = null;
    }

    // Vérifie la validité des valeurs du jeu
    validateGameState() {
        if (!this.isValidNumber(shopState.count) ||
            !this.isValidNumber(shopState.clickPower) ||
            !this.isValidNumber(shopState.autoclickers) ||
            !this.isValidNumber(shopState.powerfulAutoclickers) ||
            !this.isValidNumber(shopState.superPowerfulAutoclickers) ||
            !this.isValidNumber(shopState.ultraPowerfulAutoclickers)) {
            this.handleCheat("Invalid game state values detected");
            return false;
        }
        return true;
    }

    // Vérifie si un nombre est valide
    isValidNumber(value) {
        return typeof value === 'number' &&
            !isNaN(value) &&
            isFinite(value) &&
            value >= 0;
    }

    // Vérifie la cohérence des changements de valeurs
    validateValueChange(newValue, oldValue, maxChange) {
        const change = Math.abs(newValue - oldValue);
        if (change > maxChange) {
            this.handleCheat(`Suspicious value change detected: ${change}`);
            return false;
        }
        return true;
    }

    // Détecte les clics trop rapides
    validateClick() {
        const currentTime = Date.now();
        const timeDiff = currentTime - this.lastClickTime;

        // Stocke le temps du dernier clic
        this.lastClickTime = currentTime;

        // Fenêtre de temps pour la détection (en ms)
        const DETECTION_WINDOW = 500; // 500ms pour analyser les clics
        const MIN_CLICK_INTERVAL = 20; // 20ms entre les clics
        const MAX_CLICKS_IN_WINDOW = 8; // Maximum 8 clics dans la fenêtre

        // Si le temps entre les clics est trop court
        if (timeDiff < MIN_CLICK_INTERVAL) {
            this.clickCount += 2; // Pénalité plus forte pour les clics très rapides
        } else if (timeDiff < 100) {
            this.clickCount++; // Incrémentation normale pour les clics rapides
        }

        // Vérifie si on dépasse le seuil dans la fenêtre de temps
        if (this.clickCount > MAX_CLICKS_IN_WINDOW) {
            this.handleCheat("Autoclick detecte");
            this.clickCount = 0;
            return false;
        }

        // Diminue progressivement le compteur
        if (timeDiff > DETECTION_WINDOW) {
            this.clickCount = 0; // Reset complet après la fenêtre de détection
        } else if (timeDiff > 200) {
            this.clickCount = Math.max(0, this.clickCount - 1); // Diminution progressive
        }

        return true;
    }

    // Vérifie les modifications de la console
    detectConsoleModifications() {
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;
        const self = this;

        console.log = function () {
            // Évite la récursion infinie
            if (!self.isHandlingConsole) {
                self.isHandlingConsole = true;
                self.checkConsoleUsage("log");
                self.isHandlingConsole = false;
            }
            originalLog.apply(console, arguments);
        };

        console.warn = function () {
            // Évite la récursion infinie
            if (!self.isHandlingConsole) {
                self.isHandlingConsole = true;
                self.checkConsoleUsage("warn");
                self.isHandlingConsole = false;
            }
            originalWarn.apply(console, arguments);
        };

        console.error = function () {
            // Évite la récursion infinie
            if (!self.isHandlingConsole) {
                self.isHandlingConsole = true;
                self.checkConsoleUsage("error");
                self.isHandlingConsole = false;
            }
            originalError.apply(console, arguments);
        };
    }

    // Vérifie l'utilisation de la console
    checkConsoleUsage(type) {
        if (this.isDevToolsOpen()) {
            this.handleDevToolsOpen();
        }
    }

    // Détecte l'ouverture des DevTools
    isDevToolsOpen() {
        // Méthode 1: Vérification de la différence de taille
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;

        // Méthode 2: Vérification de la console
        const isConsoleOpen = window.console && /firebug/i.test(window.console.toString());

        // Méthode 3: Vérification des outils de développement Firefox
        const isFirebugOpen = window.console && (window.console.firebug || window.console.exception);

        // Méthode 4: Vérification de la présence d'éléments de débogage
        const hasDebugElement = document.getElementById('__webinspector');

        return widthThreshold || heightThreshold || isConsoleOpen || isFirebugOpen || hasDebugElement;
    }

    // Ajouter une nouvelle méthode pour vérifier si l'utilisateur est admin
    async isAdmin() {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return false;

            const adminDoc = await getDoc(doc(db, "admins", userId));
            return adminDoc.exists();
        } catch (error) {
            console.error('Error checking admin status:', error);
            return false;
        }
    }

    // Modifier la méthode handleDevToolsOpen
    async handleDevToolsOpen() {
        // Évite la récursion infinie
        if (this.isHandlingDevTools) return;
        this.isHandlingDevTools = true;

        // Vérifie si l'utilisateur est admin
        const isAdmin = await this.isAdmin();
        if (isAdmin) {
            this.isHandlingDevTools = false;
            return; // Permet l'accès aux DevTools pour les admins
        }

        // Affiche l'alerte
        this.showCheatAlert("DevTools detectes");

        // Démarre une boucle de refresh jusqu'à ce que les DevTools soient fermés
        const checkAndRefresh = () => {
            if (this.isDevToolsOpen()) {
                localStorage.setItem('devToolsDetected', 'true');
                window.location.reload();
            } else {
                localStorage.removeItem('devToolsDetected');
                this.isHandlingDevTools = false;
            }
        };

        this.devToolsInterval = setInterval(checkAndRefresh, 1000);
    }

    // Gère la détection de triche
    handleCheat(reason) {
        // Évite la récursion infinie
        if (this.isHandlingCheat) return;
        this.isHandlingCheat = true;

        this.suspiciousActivity = true;
        const originalWarn = console.warn;
        originalWarn.call(console, "Suspicious activity detected:", reason);

        // Réinitialise les valeurs aux dernières valeurs valides
        shopState.count = this.previousValues.count;
        shopState.clickPower = this.previousValues.clickPower;

        // Affiche l'alerte
        this.showCheatAlert(reason);

        // Si l'utilisateur est connecté, on peut enregistrer l'incident
        if (auth.currentUser) {
            this.logCheatAttempt(reason);
        }

        this.isHandlingCheat = false;
    }

    // Affiche l'alerte de triche
    showCheatAlert(reason) {
        // Supprime toute alerte existante
        const existingAlert = document.querySelector('.anticheat-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // Crée la nouvelle alerte
        const alert = document.createElement('div');
        alert.className = 'anticheat-alert';
        alert.textContent = `⚠️ Activite suspecte detectee : ${reason}`;

        // Ajoute l'alerte au document
        document.body.appendChild(alert);

        // Supprime l'alerte après 5 secondes
        setTimeout(() => {
            if (alert && alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }

    // Enregistre une tentative de triche
    async logCheatAttempt(reason) {
        try {
            const timestamp = new Date().toISOString();
            const userId = auth.currentUser.uid;

            // Ici vous pouvez implémenter la logique pour enregistrer 
            // la tentative de triche dans votre base de données
            console.warn(`Cheat attempt logged for user ${userId} at ${timestamp}: ${reason}`);
        } catch (error) {
            console.error("Error logging cheat attempt:", error);
        }
    }

    // Met à jour les valeurs précédentes
    updatePreviousValues() {
        this.previousValues = {
            count: shopState.count,
            clickPower: shopState.clickPower
        };
    }

    // Initialise l'anti-triche
    async init() {
        // Vérifie immédiatement si les DevTools sont ouverts
        if (this.isDevToolsOpen()) {
            await this.handleDevToolsOpen();
        }

        // Vérifie en continu si les DevTools sont ouverts
        setInterval(async () => {
            if (this.isDevToolsOpen()) {
                await this.handleDevToolsOpen();
            }
        }, 100);

        this.detectConsoleModifications();

        // Vérifie si les DevTools étaient ouverts lors du dernier refresh
        if (localStorage.getItem('devToolsDetected')) {
            await this.handleDevToolsOpen();
        }

        // Vérifie périodiquement l'état du jeu
        setInterval(() => {
            this.validateGameState();
            this.updatePreviousValues();
        }, 1000);

        // Surveille les modifications des propriétés de shopState
        Object.keys(shopState).forEach(key => {
            let value = shopState[key];
            Object.defineProperty(shopState, key, {
                get: () => value,
                set: (newValue) => {
                    if (this.validateValueChange(newValue, value, 1000000)) {
                        value = newValue;
                    }
                }
            });
        });

        // Modifier l'écouteur d'événements pour les raccourcis clavier
        window.addEventListener('keydown', async (e) => {
            if ((e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || e.key === 'F12') {
                const isAdmin = await this.isAdmin();
                if (!isAdmin) {
                    e.preventDefault();
                    await this.handleDevToolsOpen();
                }
            }
        });

        // Modifier l'écouteur pour le clic droit
        document.addEventListener('contextmenu', async (e) => {
            const isAdmin = await this.isAdmin();
            if (!isAdmin) {
                e.preventDefault();
            }
        });
    }
}

// Exporte une instance unique de l'anti-triche
export const antiCheat = new AntiCheat(); 
