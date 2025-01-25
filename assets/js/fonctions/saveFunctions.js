import { shopState } from './shopFunctions.js';
import { themeState } from './themeFunctions.js';
import { otherState, updateInterval } from './otherFunctions.js';
import { saveToFirestore } from './googleFunctions.js';
import { SECRET_KEY, SAVE_INTERVAL } from './config.js';
import { db } from './firebaseConfig.js';
import { updateLeaderboard } from './LeadboardFonction.js';

/* --------------------------------------------------------------------------
 
                          Fonctions de Sauvegarde
 
   -------------------------------------------------------------------------- */

export function loadFromCookies() {
    const cookies = {};
    
    // Fonction utilitaire pour décrypter en toute sécurité
    const safeDecrypt = (encryptedValue) => {
        try {
            if (!encryptedValue) return '';
            const decrypted = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            console.log('Erreur de décryptage:', e);
            return '';
        }
    };

    // Parse les cookies
    document.cookie.split('; ').forEach(cookie => {
        const [key, value] = cookie.split('=');
        cookies[key] = safeDecrypt(value);
    });

    // Charge les valeurs du shop
    shopState.count = parseInt(cookies.score) || 0;
    shopState.autoclickers = parseInt(cookies.autoclickers) || 0;
    shopState.powerfulAutoclickers = parseInt(cookies.powerfulAutoclickers) || 0;
    shopState.superPowerfulAutoclickers = parseInt(cookies.superPowerfulAutoclickers) || 0;
    shopState.ultraPowerfulAutoclickers = parseInt(cookies.ultraPowerfulAutoclickers) || 0;
    shopState.clickPower = parseInt(cookies.clickPower) || 1;
    shopState.autoclickerCost = parseInt(cookies.autoclickerCost) || 15;
    shopState.powerfulAutoclickerCost = parseInt(cookies.powerfulAutoclickerCost) || 70;
    shopState.superPowerfulAutoclickerCost = parseInt(cookies.superPowerfulAutoclickerCost) || 350;
    shopState.ultraPowerfulAutoclickerCost = parseInt(cookies.ultraPowerfulAutoclickerCost) || 1700;
    shopState.clickPowerCost = parseInt(cookies.clickPowerCost) || 100;

    // Charge les thèmes
    themeState.theme1Purchased = cookies.theme1Purchased === 'true';
    themeState.theme2Purchased = cookies.theme2Purchased === 'true';
    themeState.theme3Purchased = cookies.theme3Purchased === 'true';
    themeState.theme4Purchased = cookies.theme4Purchased === 'true';
    themeState.theme5Purchased = cookies.theme5Purchased === 'true';
    themeState.theme6Purchased = cookies.theme6Purchased === 'true';
    themeState.theme7Purchased = cookies.theme7Purchased === 'true';
    themeState.theme8Purchased = cookies.theme8Purchased === 'true';
    themeState.theme9Purchased = cookies.theme9Purchased === 'true';
    themeState.theme10Purchased = cookies.theme10Purchased === 'true';
    themeState.theme11Purchased = cookies.theme11Purchased === 'true';
    themeState.theme12Purchased = cookies.theme12Purchased === 'true';
    themeState.currentTheme = cookies.currentTheme || '';

    // Charge les paramètres
    otherState.onekoEnabled = cookies.onekoEnabled !== 'false';
    otherState.miniCookiesEnabled = cookies.miniCookiesEnabled !== 'false';

    // Met à jour l'affichage
    const display = document.getElementById('count');
    if (display) {
        display.textContent = shopState.count.toLocaleString('fr-FR');
    }

    // Met à jour le rang
    updateInterval();

    return otherState;
}

export function saveToCookies() {
    const encrypt = (value) => CryptoJS.AES.encrypt(value.toString(), SECRET_KEY);

    // Vérifie si c'est un utilisateur Google
    if (localStorage.getItem('isGoogleUser')) {
        // Pour les utilisateurs Google, sauvegarde dans Firestore
        const userId = document.getElementById('userId')?.textContent;
        const username = document.getElementById('username')?.textContent || 'Anonymous';
        
        if (userId && userId !== 'User not connected') {
            const data = {
                shop: {
                    score: shopState.count,
                    autoclickers: {
                        basic: shopState.autoclickers,
                        powerful: shopState.powerfulAutoclickers,
                        superPowerful: shopState.superPowerfulAutoclickers,
                        ultraPowerful: shopState.ultraPowerfulAutoclickers
                    },
                    clickPower: {
                        power: shopState.clickPower,
                        cost: shopState.clickPowerCost
                    },
                    costs: {
                        autoclicker: shopState.autoclickerCost,
                        powerfulAutoclicker: shopState.powerfulAutoclickerCost,
                        superPowerfulAutoclicker: shopState.superPowerfulAutoclickerCost,
                        ultraPowerfulAutoclicker: shopState.ultraPowerfulAutoclickerCost
                    }
                },
                themes: {
                    current: themeState.currentTheme,
                    purchased: {
                        theme1: themeState.theme1Purchased,
                        theme2: themeState.theme2Purchased,
                        theme3: themeState.theme3Purchased,
                        theme4: themeState.theme4Purchased,
                        theme5: themeState.theme5Purchased,
                        theme6: themeState.theme6Purchased,
                        theme7: themeState.theme7Purchased,
                        theme8: themeState.theme8Purchased,
                        theme9: themeState.theme9Purchased,
                        theme10: themeState.theme10Purchased,
                        theme11: themeState.theme11Purchased,
                        theme12: themeState.theme12Purchased
                    }
                },
                settings: {
                    miniCookiesEnabled: otherState.miniCookiesEnabled,
                    onekoEnabled: otherState.onekoEnabled
                },
                lastUpdate: new Date()
            };
            
            // Sauvegarde les données du jeu
            saveToFirestore(userId, data);
            
            // Mise à jour du leaderboard
            updateLeaderboard(userId, username, shopState.count);
        }
        return;
    }

    // Pour les utilisateurs invités, sauvegarde dans les cookies et le leaderboard
    const anonymousId = 'anonymous_' + Math.random().toString(36).substr(2, 9);
    updateLeaderboard(anonymousId, 'Anonymous', shopState.count);

    document.cookie = `score=${encrypt(shopState.count)};path=/;max-age=2147483647;secure`;
    document.cookie = `autoclickers=${encrypt(shopState.autoclickers)};path=/;max-age=2147483647;secure`;
    document.cookie = `powerfulAutoclickers=${encrypt(shopState.powerfulAutoclickers)};path=/;max-age=2147483647;secure`;
    document.cookie = `superPowerfulAutoclickers=${encrypt(shopState.superPowerfulAutoclickers)};path=/;max-age=2147483647;secure`;
    document.cookie = `ultraPowerfulAutoclickers=${encrypt(shopState.ultraPowerfulAutoclickers)};path=/;max-age=2147483647;secure`;
    document.cookie = `clickPower=${encrypt(shopState.clickPower)};path=/;max-age=2147483647;secure`;

    // Sauvegarde des coûts
    document.cookie = `autoclickerCost=${encrypt(shopState.autoclickerCost)};path=/;max-age=2147483647;secure`;
    document.cookie = `powerfulAutoclickerCost=${encrypt(shopState.powerfulAutoclickerCost)};path=/;max-age=2147483647;secure`;
    document.cookie = `superPowerfulAutoclickerCost=${encrypt(shopState.superPowerfulAutoclickerCost)};path=/;max-age=2147483647;secure`;
    document.cookie = `ultraPowerfulAutoclickerCost=${encrypt(shopState.ultraPowerfulAutoclickerCost)};path=/;max-age=2147483647;secure`;
    document.cookie = `clickPowerCost=${encrypt(shopState.clickPowerCost)};path=/;max-age=2147483647;secure`;

    // Sauvegarde des thèmes
    document.cookie = `theme1Purchased=${encrypt(themeState.theme1Purchased)};path=/;max-age=2147483647;secure`;
    document.cookie = `theme2Purchased=${encrypt(themeState.theme2Purchased)};path=/;max-age=2147483647;secure`;
    document.cookie = `theme3Purchased=${encrypt(themeState.theme3Purchased)};path=/;max-age=2147483647;secure`;
    document.cookie = `theme4Purchased=${encrypt(themeState.theme4Purchased)};path=/;max-age=2147483647;secure`;
    document.cookie = `theme5Purchased=${encrypt(themeState.theme5Purchased)};path=/;max-age=2147483647;secure`;
    document.cookie = `theme6Purchased=${encrypt(themeState.theme6Purchased)};path=/;max-age=2147483647;secure`;
    document.cookie = `theme7Purchased=${encrypt(themeState.theme7Purchased)};path=/;max-age=2147483647;secure`;
    document.cookie = `theme8Purchased=${encrypt(themeState.theme8Purchased)};path=/;max-age=2147483647;secure`;
    document.cookie = `theme9Purchased=${encrypt(themeState.theme9Purchased)};path=/;max-age=2147483647;secure`;
    document.cookie = `theme10Purchased=${encrypt(themeState.theme10Purchased)};path=/;max-age=2147483647;secure`;
    document.cookie = `theme11Purchased=${encrypt(themeState.theme11Purchased)};path=/;max-age=2147483647;secure`;
    document.cookie = `theme12Purchased=${encrypt(themeState.theme12Purchased)};path=/;max-age=2147483647;secure`;
    document.cookie = `currentTheme=${encrypt(themeState.currentTheme)};path=/;max-age=2147483647;secure`;

    // Sauvegarde des paramètres
    document.cookie = `onekoEnabled=${encrypt(otherState.onekoEnabled)};path=/;max-age=2147483647;secure`;
    document.cookie = `miniCookiesEnabled=${encrypt(otherState.miniCookiesEnabled)};path=/;max-age=2147483647;secure`;
}

// Throttle les sauvegardes pour éviter les appels trop fréquents
export const throttledSave = (() => {
    let lastSave = 0;
   

    return () => {
        const now = Date.now();
        if (now - lastSave >= SAVE_INTERVAL) {
            saveToCookies();
            lastSave = now;
        }
    };
})();
