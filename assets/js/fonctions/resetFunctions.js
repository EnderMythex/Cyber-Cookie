import { shopState, updateAutoclickerButtons, updateAutoclickerCosts } from './shopFunctions.js';
import { themeState, updateThemeButtons } from './themeFunctions.js';
import { otherState } from './otherFunctions.js';

/* --------------------------------------------------------------------------
 
                          Reset Functions
 
   -------------------------------------------------------------------------- */

export function initializeResetHandlers(playSound, saveToCookies) {
    const reset = document.getElementById('reset');
    const confirmationDialog = document.getElementById('confirmationDialog');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');

    reset.addEventListener('click', function () {
        confirmationDialog.style.display = 'block';
        playSound();
    });

    confirmYes.addEventListener('click', function () {
        resetAllStates();
        saveToCookies();
        updateAutoclickerButtons();
        updateThemeButtons();
        updateAutoclickerCosts();
        window.location.reload();
        confirmationDialog.style.display = 'none';
    });

    confirmNo.addEventListener('click', function () {
        playSound();
        confirmationDialog.style.display = 'none';
    });
}

function resetAllStates() {
    // Reset shop state
    shopState.count = 0;
    shopState.autoclickers = 0;
    shopState.powerfulAutoclickers = 0;
    shopState.superPowerfulAutoclickers = 0;
    shopState.ultraPowerfulAutoclickers = 0;
    shopState.clickPower = 1;
    shopState.autoclickerCost = 15;
    shopState.powerfulAutoclickerCost = 70;
    shopState.superPowerfulAutoclickerCost = 350;
    shopState.ultraPowerfulAutoclickerCost = 1700;
    shopState.clickPowerCost = 100;

    // Reset theme state
    themeState.theme1Purchased = false;
    themeState.theme2Purchased = false;
    themeState.theme3Purchased = false;
    themeState.theme4Purchased = false;
    themeState.theme5Purchased = false;
    themeState.theme6Purchased = false;
    themeState.theme7Purchased = false;
    themeState.theme8Purchased = false;
    themeState.theme9Purchased = false;
    themeState.theme10Purchased = false;
    themeState.theme11Purchased = false;
    themeState.theme12Purchased = false;
    themeState.currentTheme = '';

    // Reset other state
    otherState.onekoEnabled = true;
    otherState.miniCookiesEnabled = true;

    // Reset UI avec vérification des éléments
    const container = document.querySelector('.container');
    if (container) container.style.backgroundImage = "";

    const countElement = document.getElementById('count');
    if (countElement) countElement.textContent = '0';

    const autoclickersElement = document.getElementById('autoclickers');
    if (autoclickersElement) autoclickersElement.textContent = '0';

    const clickPowerElement = document.getElementById('clickPower');
    if (clickPowerElement) clickPowerElement.textContent = '1';

    // Reset oneko avec vérification des éléments
    window.onekoEnabled = true;
    
    const toggleOnekoBtn = document.getElementById('toggleOnekoBtn');
    if (toggleOnekoBtn) toggleOnekoBtn.textContent = "Chat: ON";

    const toggleMiniCookiesBtn = document.getElementById('toggleMiniCookiesBtn');
    if (toggleMiniCookiesBtn) toggleMiniCookiesBtn.textContent = "Mini-Cookies: ON";
}
