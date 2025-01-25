import { playSound } from './otherFunctions.js';

/* --------------------------------------------------------------------------
 
                              Settings State
 
   -------------------------------------------------------------------------- */

export const settingsState = {
    isSettingsOpen: false
};

/* --------------------------------------------------------------------------
 
                              Settings Sections
 
   -------------------------------------------------------------------------- */

export function initializeSettingsButton() {
    const settings = document.getElementById('settings');
    const settingsOptions = document.getElementById('settingsOptions');
    const cookie = document.getElementById('cookie');
    const discord = document.getElementById('discord');
    const theme = document.getElementById('theme');
    const extension = document.getElementById('extension');
    const shop = document.getElementById('shop');

    settings.addEventListener('click', function () {
        playSound();
        if (settingsOptions.style.display === "none") {
            settingsOptions.style.display = "block";
            settings.textContent = "Home";
            settings.style.display = 'block';
            cookie.style.display = 'none';
            discord.style.display = 'none';
            theme.style.display = 'none';
            leaderboardBtn.style.display = 'none';
            extension.style.display = 'none';
            shop.style.display = 'none';
        } else {
            settingsOptions.style.display = "none";
            settings.textContent = "Options";
            settings.style.display = 'none';
            cookie.style.display = 'block';
            theme.style.display = 'block';
            discord.style.display = 'block';
            settings.style.display = 'block';
            extension.style.display = 'block';
            shop.style.display = 'block';
            leaderboardBtn.style.display = 'block';
        }
    });
}
