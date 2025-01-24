/* --------------------------------------------------------------------------
	
                          Global Setup
	
   -------------------------------------------------------------------------- */

import { themeState, applyTheme, updateThemeButtons, initializeThemeHandlers, initializeThemeButton } from './fonctions/themeFunctions.js';

import { initializeResetHandlers } from './fonctions/resetFunctions.js';

import { initializeSettingsButton } from './fonctions/settingsFunctions.js';

import { shopState, updateAutoclickerCosts, updateAutoclickerButtons, initializeShopHandlers, initializeShopButton, processAutoClicks, startAutoClickInterval, updateCount } from './fonctions/shopFunctions.js';

import { otherState, playSound, vibrate, generateMiniCookie, updateRank, initializeToggles, initializeOtherHandlers, initializeAdminCookies, initializeSecurity, updateInterval, playSound2, initializeCookieEffects } from './fonctions/otherFunctions.js';

import { loadFromCookies, saveToCookies } from './fonctions/saveFunctions.js';

import { initializeAuthListener, saveToFirestore } from './fonctions/googleFunctions.js';

import { CookieEffectsManager } from './fonctions/canvasEffects.js';



// Éléments DOM
const cookie = document.getElementById('cookie');
const display = document.getElementById('count');

// Interface Update
loadFromCookies();
updateThemeButtons();
updateAutoclickerCosts();
updateAutoclickerButtons();
updateInterval();

// Écouteur d'événements pour le chargement du DOM
document.addEventListener('DOMContentLoaded', function () {
    initializeThemeHandlers(playSound, saveToCookies);
    initializeThemeButton();
    initializeShopHandlers(playSound, saveToCookies);
    initializeShopButton(playSound);
    initializeSettingsButton();
    initializeToggles(playSound, saveToCookies);
    initializeOtherHandlers(cookie, playSound, generateMiniCookie);
    initializeResetHandlers(playSound, saveToCookies);
    initializeAdminCookies(saveToCookies);
    initializeSecurity();
    initializeAuthListener();
    startAutoClickInterval(updateInterval, saveToCookies);
    initializeCookieEffects();
});

// Créer une instance du gestionnaire d'effets
const effectsManager = new CookieEffectsManager();
effectsManager.init();

/* --------------------------------------------------------------------------
 
                              Main Cookie Button
 
   -------------------------------------------------------------------------- */

// Debounce function pour limiter la fréquence des clics
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimiser le gestionnaire de clic
const debouncedClick = debounce((event) => {
    shopState.count += shopState.clickPower;
    display.textContent = shopState.count.toLocaleString('fr-FR');
    
    effectsManager.generateText(
        event.clientX + 10,
        event.clientY - 10,
        `+${shopState.clickPower}`
    );

    vibrate();
    playSound2();
    saveToCookies();
    updateInterval();
    generateMiniCookie(event.clientX, event.clientY);
}, 50); // 50ms de délai

cookie.addEventListener('click', debouncedClick);

// Modifier le gestionnaire pour la touche Espace
window.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
        event.preventDefault();
        const fakeEvent = {
            clientX: window.innerWidth / 2.035,
            clientY: window.innerHeight / 2.42,
        };
        cookie.dispatchEvent(new MouseEvent('click', fakeEvent));
    }
});
