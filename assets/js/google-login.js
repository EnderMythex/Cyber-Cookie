/* --------------------------------------------------------------------------

                              Google Login

   -------------------------------------------------------------------------- */

//Google Firebase

// Import the functions you need from the SDKs you need
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { initializeSecurity } from './fonctions/otherFunctions.js';
import { auth, db } from './fonctions/firebaseConfig.js';
import { TURNSTILE_SITE_KEY } from './fonctions/config.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Remove the Firebase config and initialization code
// Keep the provider initialization
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
    // Gérer les erreurs spécifiques
    if (error.code === 'auth/popup-blocked') {
      alert("Veuillez autoriser les popups pour vous connecter avec Google");
    }
  }
}

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

                                Loading

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

// Initialiser la sécurité
initializeSecurity();

/* --------------------------------------------------------------------------

                                Guest redirect button

   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function() {
    // Wait for Turnstile to be available
    function initTurnstile() {
        if (typeof turnstile !== 'undefined') {
            turnstile.render('#captcha-container', {
                sitekey: TURNSTILE_SITE_KEY,
                callback: onCaptchaSuccess,
                theme: 'dark'
            });
        } else {
            setTimeout(initTurnstile, 100);
        }
    }

    initTurnstile();

    // Rest of the event listeners
    const googleLoginBtn = document.getElementById('google-login-btn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', handleGoogleLogin);
    }

    // Gérer le bouton invité
    const guestButton = document.getElementById('guest-button');
    if (guestButton) {
        guestButton.addEventListener('click', function() {
            localStorage.removeItem('isGoogleUser');
            window.location.href = '/main.html';
        });
    }

    // Gérer le bouton de déconnexion
    const googleLogout = document.getElementById("google-logout-btn");
    if (googleLogout) {
        googleLogout.addEventListener("click", function() {
            auth.signOut().then(() => {
                console.log("Déconnexion réussie");
                localStorage.removeItem('isGoogleUser');
                window.location.href = "/main.html";
            }).catch((error) => {
                console.error("Erreur lors de la déconnexion:", error);
            });
        });
    }
});

// Fonction de callback du captcha
window.onCaptchaSuccess = function(token) {
    // Activer les boutons une fois le captcha validé
    document.getElementById('google-login-btn').disabled = false;
    document.getElementById('guest-button').disabled = false;
    
    // Optionnel: Stocker le token pour validation côté serveur
    localStorage.setItem('turnstileToken', token);
};
