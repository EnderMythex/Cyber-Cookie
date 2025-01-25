import { shopState } from './shopFunctions.js';
import { playSound } from './otherFunctions.js';

/* --------------------------------------------------------------------------
 
                              Variables des thèmes
 
   -------------------------------------------------------------------------- */

   export const themeState = {
    theme1Purchased: false,
    theme2Purchased: false,
    theme3Purchased: false,
    theme4Purchased: false,
    theme5Purchased: false,
    theme6Purchased: false,
    theme7Purchased: false,
    theme8Purchased: false,
    theme9Purchased: false,
    theme10Purchased: false,
    theme11Purchased: false,
    theme12Purchased: false,
    currentTheme: ''
};

/* --------------------------------------------------------------------------
 
                              Fonctions des thèmes
 
   -------------------------------------------------------------------------- */

export function applyTheme(themeName, backgroundPath) {
    const container = document.querySelector('.container');
    
    // Supprimer toutes les classes de thème existantes
    container.classList.remove(
        'theme1-active',
        'theme2-active',
        'theme3-active',
        'theme4-active',
        'theme5-active',
        'theme6-active',
        'theme7-active',
        'theme8-active',
        'theme9-active',
        'theme10-active',
        'theme11-active',
        'theme12-active'
    );

    // Ajouter la nouvelle classe de thème
    if (themeName) {
        container.classList.add(`${themeName}-active`);
    }

    // Appliquer l'image de fond
    container.style.backgroundImage = `url(${backgroundPath})`;
    themeState.currentTheme = themeName;
}

export function updateThemeButtons() {
    const themes = Array.from({length: 12}, (_, i) => i + 1);
    
    themes.forEach(themeNumber => {
        const button = document.getElementById(`buytheme${themeNumber}`);
        if (button && themeState[`theme${themeNumber}Purchased`]) {
            button.textContent = `Theme ${themeNumber - 1} (0)`;
        }
    });
}

/* --------------------------------------------------------------------------
 
                              Gestionnaires d'événements des thèmes
 
   -------------------------------------------------------------------------- */

export function initializeThemeHandlers(playSound, saveToCookies) {
    const buytheme1 = document.getElementById('buytheme1');
    const buytheme2 = document.getElementById('buytheme2');
    const buytheme3 = document.getElementById('buytheme3');
    const buytheme4 = document.getElementById('buytheme4');
    const buytheme5 = document.getElementById('buytheme5');
    const buytheme6 = document.getElementById('buytheme6');
    const buytheme7 = document.getElementById('buytheme7');
    const buytheme8 = document.getElementById('buytheme8');
    const buytheme9 = document.getElementById('buytheme9');
    const buytheme10 = document.getElementById('buytheme10');
    const buytheme11 = document.getElementById('buytheme11');
    const buytheme12 = document.getElementById('buytheme12');

    function handleThemeClick(button, cost, themeNumber, backgroundPath) {
        if (shopState.count >= cost && !themeState[`theme${themeNumber}Purchased`]) {
            shopState.count -= cost;
            themeState[`theme${themeNumber}Purchased`] = true;
            button.textContent = `Theme ${themeNumber - 1} (0)`;
            document.getElementById('count').textContent = shopState.count.toLocaleString('fr-FR');
            saveToCookies();
            playSound();
            applyTheme(`theme${themeNumber}`, backgroundPath);
        } else if (themeState[`theme${themeNumber}Purchased`]) {
            playSound();
            applyTheme(`theme${themeNumber}`, backgroundPath);
        }
    }

    buytheme1.addEventListener('click', () => handleThemeClick(buytheme1, 0.5, 1, '/assets/backgrounds/background_1.gif'));
    buytheme2.addEventListener('click', () => handleThemeClick(buytheme2, 7000, 2, '/assets/backgrounds/background_2.jpg'));
    buytheme3.addEventListener('click', () => handleThemeClick(buytheme3, 16000, 3, '/assets/backgrounds/background_3.gif'));
    buytheme4.addEventListener('click', () => handleThemeClick(buytheme4, 120000, 4, '/assets/backgrounds/background_4.gif'));
    buytheme5.addEventListener('click', () => handleThemeClick(buytheme5, 670000, 5, '/assets/backgrounds/background_5.gif'));
    buytheme6.addEventListener('click', () => handleThemeClick(buytheme6, 1300000, 6, '/assets/backgrounds/background_6.gif'));
    buytheme7.addEventListener('click', () => handleThemeClick(buytheme7, 2000000, 7, '/assets/backgrounds/background_7.gif'));
    buytheme8.addEventListener('click', () => handleThemeClick(buytheme8, 4000000, 8, '/assets/backgrounds/background_8.gif'));
    buytheme9.addEventListener('click', () => handleThemeClick(buytheme9, 8000000, 9, '/assets/backgrounds/background_9.gif'));
    buytheme10.addEventListener('click', () => handleThemeClick(buytheme10, 16000000, 10, '/assets/backgrounds/background_10.gif'));
    buytheme11.addEventListener('click', () => handleThemeClick(buytheme11, 32000000, 11, '/assets/backgrounds/background_11.gif'));
    buytheme12.addEventListener('click', () => handleThemeClick(buytheme12, 64000000, 12, '/assets/backgrounds/background_12.gif'));
}

/* --------------------------------------------------------------------------
 
                              Themes Sections
 
   -------------------------------------------------------------------------- */

export function initializeThemeButton() {
    const theme = document.getElementById('theme');
    const themeOptions = document.getElementById('themeOptions');
    const cookie = document.getElementById('cookie');
    const reset = document.getElementById('reset');
    const discord = document.getElementById('discord');
    const settings = document.getElementById('settings');
    const extension = document.getElementById('extension');
    const shop = document.getElementById('shop');

    theme.addEventListener('click', function () {
        playSound();
        if (themeOptions.style.display === "none") {
            themeOptions.style.display = "block";
            theme.textContent = "Home";
            shopOptions.style.display = 'none';
            cookie.style.display = 'none';
            reset.style.display = 'none';
            discord.style.display = 'none';
            settings.style.display = 'none';
            leaderboardBtn.style.display = 'none';
            extension.style.display = 'none';
            shop.style.display = 'none';
        } else {
            themeOptions.style.display = "none";
            theme.textContent = "Theme";
            cookie.style.display = 'block';
            reset.style.display = 'block';
            discord.style.display = 'block';
            settings.style.display = 'block';
            extension.style.display = 'block';
            shop.style.display = 'block';
            leaderboardBtn.style.display = 'block';
        }
    });
}
