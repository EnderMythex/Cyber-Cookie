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

   import { themeState, applyTheme, updateThemeButtons, initializeThemeHandlers, initializeThemeButton } from './resources/themeFunctions.js';

   import { initializeResetHandlers } from './resources/resetFunctions.js';
   
   import { initializeSettingsButton } from './resources/settingsFunctions.js';
   
   import { shopState, updateAutoclickerCosts, updateAutoclickerButtons, initializeShopHandlers, initializeShopButton, processAutoClicks, startAutoClickInterval, updateCount } from './resources/shopFunctions.js';
   
   import { otherState, playSound, vibrate, generateMiniCookie, updateRank, initializeToggles, initializeOtherHandlers, initializeAdminCookies, updateInterval, playSound2, initializeCookieEffects } from './resources/otherFunctions.js';
   
   import { loadFromCookies, saveToCookies, initializePeriodicSave } from './resources/saveFunctions.js';
   
   import { initializeAuthListener, saveToFirestore } from './resources/googleFunctions.js';
   
   import { CookieEffectsManager } from './resources/canvasEffects.js';
   
   import { initializeLeaderboard } from './resources/LeadboardFonction.js';
   
   import { antiCheat } from './resources/anticheat.js';
   
   // Éléments DOM
   const cookie = document.getElementById('cookie');
   const display = document.getElementById('count');
   
   /* --------------------------------------------------------------------------
   
                                   Interface Updates                                                                                                                                 
   
      -------------------------------------------------------------------------- */
   
   loadFromCookies();
   updateThemeButtons();
   updateAutoclickerCosts();
   updateAutoclickerButtons();
   updateInterval();
   
   /* --------------------------------------------------------------------------
   
                               Listen event / DOM loading                                                                                                                                 
   
      -------------------------------------------------------------------------- */
   
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
       initializeAuthListener();
       startAutoClickInterval(updateInterval, saveToCookies);
       initializeCookieEffects();
       initializeLeaderboard();
       
       // Initialise l'anti-triche
       antiCheat.init();
       
       // Initialiser la sauvegarde périodique
       initializePeriodicSave();
   });
   
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
   
   // Modifier le gestionnaire de clic pour inclure la validation
   const debouncedClick = debounce((event) => {
       if (!antiCheat.validateClick()) return;
       
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
   }, 50);
   
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