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

   import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

   import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
   
   import { auth, db } from './firebase/firebaseConfig.js';
   
   import { TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY } from './config/config.js';
   
   /* --------------------------------------------------------------------------
   
                                     Google Login                                                                                                                                  
   
      -------------------------------------------------------------------------- */
   
   const provider = new GoogleAuthProvider();
   auth.languageCode = 'en';
   
   async function handleGoogleLogin() {
     try {
       const result = await signInWithPopup(auth, provider);
       const user = result.user;
       console.log("Connexion réussie:", user);
   
       await saveUserData(user);
       await loadUserData(user);
       localStorage.setItem('isGoogleUser', 'true');
   
       window.location.href = '/main.html';
     } catch (error) {
       console.error("Erreur de connexion Google:", error);
       if (error.code === 'auth/popup-blocked') {
         alert("Veuillez autoriser les popups pour vous connecter avec Google");
       }
     }
   }
   
   /* --------------------------------------------------------------------------
   
                                 Save User Data in DB                                                                                                                                  
   
      -------------------------------------------------------------------------- */
   
   async function saveUserData(user) {
     try {
       // Récupérer d'abord les données existantes
       const userDoc = await getDoc(doc(db, "users", user.uid));
       const existingData = userDoc.exists() ? userDoc.data() : {};
   
       // Fusionner avec les nouvelles données
       const userData = {
         ...existingData,  // Garder les données existantes
         userInfo: {       // Mettre les infos utilisateur dans un sous-objet
           email: user.email,
           displayName: user.displayName,
           photoURL: user.photoURL,
           lastLogin: new Date()
         }
       };
   
       // Sauvegarder en préservant les données existantes
       await setDoc(doc(db, "users", user.uid), userData, { merge: true });
       console.log("Données utilisateur sauvegardées");
     } catch (error) {
       console.error("Erreur lors de la sauvegarde:", error);
     }
   }
   
   /* --------------------------------------------------------------------------
   
                                 Load User Data in DB                                                                                                                                  
   
      -------------------------------------------------------------------------- */
   
   async function loadUserData(user) {
     try {
       const userDoc = await getDoc(doc(db, "users", user.uid));
       if (userDoc.exists()) {
         const userData = userDoc.data();
         // Si pas de données de jeu, initialiser avec des valeurs par défaut
         if (!userData.shop) {
           const defaultGameData = {
             shop: {
               score: 0,
               autoclickers: { basic: 0, powerful: 0, superPowerful: 0, ultraPowerful: 0 },
               clickPower: { power: 1, cost: 100 },
               costs: {
                 autoclicker: 15,
                 powerfulAutoclicker: 70,
                 superPowerfulAutoclicker: 350,
                 ultraPowerfulAutoclicker: 1700
               }
             },
             themes: {
               current: '',
               purchased: {}
             },
             settings: {
               miniCookiesEnabled: true,
               onekoEnabled: true
             }
           };
   
           await setDoc(doc(db, "users", user.uid),
             { ...userData, ...defaultGameData },
             { merge: true }
           );
         }
         console.log("Données utilisateur chargées");
       }
     } catch (error) {
       console.error("Erreur lors du chargement:", error);
     }
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
   
   /* --------------------------------------------------------------------------
   
                                   Guest redirect button
   
      -------------------------------------------------------------------------- */
   
   document.addEventListener('DOMContentLoaded', function () {
       // Désactive les boutons au chargement
       const googleLoginBtn = document.getElementById('google-login-btn');
       const guestButton = document.getElementById('guest-button');
       
       if (googleLoginBtn) {
           googleLoginBtn.disabled = true;
           googleLoginBtn.addEventListener('click', handleGoogleLogin);
       }
       
       if (guestButton) {
           guestButton.disabled = true;
           guestButton.addEventListener('click', function () {
               handleGuestLogin();
           });
       }
   
       // Initialise Turnstile avec callback
       function initTurnstile() {
           if (typeof turnstile !== 'undefined') {
               turnstile.render('#captcha-container', {
                   sitekey: TURNSTILE_SITE_KEY,
                   callback: function(token) {
                       // Active directement les boutons quand le captcha est complété
                       enableLoginButtons();
                       localStorage.setItem('turnstileToken', token);
                   },
                   theme: 'dark'
               });
           } else {
               setTimeout(initTurnstile, 100);
           }
       }
   
       initTurnstile();
   });
   
   // Fonction pour activer les boutons de connexion
   function enableLoginButtons() {
       const googleLoginBtn = document.getElementById('google-login-btn');
       const guestButton = document.getElementById('guest-button');
       
       if (googleLoginBtn) {
           googleLoginBtn.disabled = false;
       }
       
       if (guestButton) {
           guestButton.disabled = false;
       }
   }
   
   // Fonction pour gérer la connexion invité
   async function handleGuestLogin() {
       const token = localStorage.getItem('turnstileToken');
       if (!token) {
           console.error('No captcha token found');
           return;
       }
       
       localStorage.removeItem('isGoogleUser');
       window.location.href = '/main.html';
   }
   
   /* --------------------------------------------------------------------------
   
                                    Login Captcha
   
      -------------------------------------------------------------------------- */
   
   // Fonction de callback du captcha
   window.onCaptchaSuccess = function (token) {
     // Activer les boutons une fois le captcha validé
     document.getElementById('google-login-btn').disabled = false;
     document.getElementById('guest-button').disabled = false;
   
     // Optionnel: Stocker le token pour validation côté serveur
     localStorage.setItem('turnstileToken', token);
   };
   
