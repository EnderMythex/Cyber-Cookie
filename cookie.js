document.addEventListener('DOMContentLoaded', function () {
  var count = 0;
  var autoclickers = 0;
  var powerfulAutoclickers = 0;
  var superPowerfulAutoclickers = 0;
  var ultraPowerfulAutoclickers = 0;
  var cookie = document.getElementById('cookie');
  var buy = document.getElementById('buy');
  var buyPowerful = document.getElementById('buyPowerful');
  var buySuperPowerful = document.getElementById('buySuperPowerful');
  var buyUltraPowerful = document.getElementById('buyUltraPowerful');
  var reset = document.getElementById('reset');
  var display = document.getElementById('count');
  var autoclickerDisplay = document.getElementById('autoclickers');
  var powerfulAutoclickerDisplay = document.getElementById('powerfulAutoclickers');
  var superPowerfulAutoclickerDisplay = document.getElementById('superPowerfulAutoclickers');
  var ultraPowerfulAutoclickerDisplay = document.getElementById('ultraPowerfulAutoclickers');
  var shop = document.getElementById('shop');
  var shopOptions = document.getElementById('shopOptions');
  var theme1Purchased = false;
  var theme2Purchased = false;
  var theme3Purchased = false;
  var theme4Purchased = false;
  var theme5Purchased = false;
  var theme6Purchased = false;
  var currentTheme = '';
  var settings = document.getElementById('settings');
  var confirmationDialog = document.getElementById('confirmationDialog');
  var confirmYes = document.getElementById('confirmYes');
  var confirmNo = document.getElementById('confirmNo');

  var autoclickerCost = 15;
  var powerfulAutoclickerCost = 70;
  var superPowerfulAutoclickerCost = 350;
  var ultraPowerfulAutoclickerCost = 1700;

/* --------------------------------------------------------------------------

                              Generate mini cookies 

   -------------------------------------------------------------------------- */

  function generateMiniCookie() {
    var miniCookie = document.createElement('div');
    miniCookie.className = 'mini-cookie';
    // Assurez-vous que le cookie reste dans les limites horizontales de la fenêtre
    miniCookie.style.left = Math.random() * (window.innerWidth - 50) + 'px'; // 50 est la largeur du cookie
    document.body.appendChild(miniCookie);

    // Supprimer le mini cookie après 2 secondes
    setTimeout(function() {
        document.body.removeChild(miniCookie);
    }, 1800);
}

cookie.addEventListener('click', function () {
    generateMiniCookie();
});

/* --------------------------------------------------------------------------

                                Shop Affichage 

   -------------------------------------------------------------------------- */

  shop.addEventListener('click', function () {
    if (shopOptions.style.display === "none") {
      shopOptions.style.display = "block";
      cookie.style.display = 'none'; 
      reset.style.display = 'none'; 
      discord.style.display = 'none';
      settings.style.display = 'none';
      extension.style.display = 'none';
      theme.style.display = 'none';
    } else {
      shopOptions.style.display = "none";
      cookie.style.display = 'block'; 
      reset.style.display = 'block'; 
      discord.style.display = 'block';
      settings.style.display = 'block';
      extension.style.display = 'block';
      theme.style.display = 'block';
    }
  });

/* --------------------------------------------------------------------------

                                Theme Affichage 

   -------------------------------------------------------------------------- */

  theme.addEventListener('click', function () {
    if (themeOptions.style.display === "none") {
      themeOptions.style.display = "block";
      shopOptions.style.display = 'none';
      cookie.style.display = 'none'; 
      reset.style.display = 'none'; 
      discord.style.display = 'none';
      settings.style.display = 'none';
      extension.style.display = 'none';
      shop.style.display = 'none';
    } else {
      themeOptions.style.display = "none";
      cookie.style.display = 'block'; 
      reset.style.display = 'block'; 
      discord.style.display = 'block';
      settings.style.display = 'block';
      extension.style.display = 'block';
      shop.style.display = 'block';
    }
  });

/* --------------------------------------------------------------------------

                                Load an crypts cookies 

   -------------------------------------------------------------------------- */

  function loadFromCookies() {
    const secretKey = '@ender1469';
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, encryptedValue] = cookie.split('=');
        try {
            const decryptedValue = CryptoJS.AES.decrypt(encryptedValue, secretKey).toString(CryptoJS.enc.Utf8);
            if (decryptedValue) { // Vérifiez si la valeur décryptée est non vide
                acc[key] = decryptedValue;
            }
        } catch (e) {
            console.error('Erreur de décryptage pour la clé:', key, 'avec erreur:', e.message);
        }
        return acc;
    }, {});

    count = parseInt(cookies.score || '0');
    autoclickers = parseInt(cookies.autoclickers || '0');
    powerfulAutoclickers = parseInt(cookies.powerfulAutoclickers || '0');
    superPowerfulAutoclickers = parseInt(cookies.superPowerfulAutoclickers || '0');
    ultraPowerfulAutoclickers = parseInt(cookies.ultraPowerfulAutoclickers || '0');
    theme1Purchased = cookies.theme1Purchased === 'true';
    theme2Purchased = cookies.theme2Purchased === 'true';
    theme3Purchased = cookies.theme3Purchased === 'true';
    theme4Purchased = cookies.theme4Purchased === 'true';
    theme5Purchased = cookies.theme5Purchased === 'true';
    theme6Purchased = cookies.theme6Purchased === 'true';

    display.textContent = count.toLocaleString('fr-FR');
    autoclickerDisplay.textContent = autoclickers;
    powerfulAutoclickerDisplay.textContent = powerfulAutoclickers;
    superPowerfulAutoclickerDisplay.textContent = superPowerfulAutoclickers;
    ultraPowerfulAutoclickerDisplay.textContent = ultraPowerfulAutoclickers;
  }

  loadFromCookies();

/* --------------------------------------------------------------------------

                                Save in Cookies 

   -------------------------------------------------------------------------- */

  function saveToCookies() {
    const secretKey = '@ender1469'; // Utilisez une clé secrète robuste
    document.cookie = `score=${CryptoJS.AES.encrypt(count.toString(), secretKey)};path=/;max-age=2147483647;secure`;
    document.cookie = `autoclickers=${CryptoJS.AES.encrypt(autoclickers.toString(), secretKey)};path=/;max-age=2147483647;secure`;
    document.cookie = `powerfulAutoclickers=${CryptoJS.AES.encrypt(powerfulAutoclickers.toString(), secretKey)};path=/;max-age=2147483647;secure`;
    document.cookie = `superPowerfulAutoclickers=${CryptoJS.AES.encrypt(superPowerfulAutoclickers.toString(), secretKey)};path=/;max-age=2147483647;secure`;
    document.cookie = `ultraPowerfulAutoclickers=${CryptoJS.AES.encrypt(ultraPowerfulAutoclickers.toString(), secretKey)};path=/;max-age=2147483647;secure`;
    document.cookie = `theme1Purchased=${CryptoJS.AES.encrypt(theme1Purchased.toString(), secretKey)};path=/;max-age=2147483647;secure`;
    document.cookie = `theme2Purchased=${CryptoJS.AES.encrypt(theme2Purchased.toString(), secretKey)};path=/;max-age=2147483647;secure`;
    document.cookie = `theme3Purchased=${CryptoJS.AES.encrypt(theme3Purchased.toString(), secretKey)};path=/;max-age=2147483647;secure`;
    document.cookie = `theme4Purchased=${CryptoJS.AES.encrypt(theme4Purchased.toString(), secretKey)};path=/;max-age=2147483647;secure`;
    document.cookie = `theme5Purchased=${CryptoJS.AES.encrypt(theme5Purchased.toString(), secretKey)};path=/;max-age=2147483647;secure`;
    document.cookie = `theme6Purchased=${CryptoJS.AES.encrypt(theme6Purchased.toString(), secretKey)};path=/;max-age=2147483647;secure`;
    document.cookie = `autoclickerCost=${CryptoJS.AES.encrypt(autoclickerCost.toString(), secretKey)};path=/;max-age=2147483647;secure`; // Ajouté
    document.cookie = `powerfulAutoclickerCost=${CryptoJS.AES.encrypt(powerfulAutoclickerCost.toString(), secretKey)};path=/;max-age=2147483647;secure`; // Ajouté
    document.cookie = `superPowerfulAutoclickerCost=${CryptoJS.AES.encrypt(superPowerfulAutoclickerCost.toString(), secretKey)};path=/;max-age=2147483647;secure`; // Ajouté
    document.cookie = `ultraPowerfulAutoclickerCost=${CryptoJS.AES.encrypt(ultraPowerfulAutoclickerCost.toString(), secretKey)};path=/;max-age=2147483647;secure`; // Ajouté
    console.log('Game Saved | Data saved in cookies');
    console.log(document.cookie);
}

/* --------------------------------------------------------------------------

                              1K / 1M / 1B Simple 

   -------------------------------------------------------------------------- */

  function formatCost(cost) {
    if (cost >= 1000000000) {
      return (cost / 1000000000).toFixed(1) + 'B';
    } else if (cost >= 1000000) {
        return (cost / 1000000).toFixed(1) + 'M';
    } else if (cost >= 1000) {
        return (cost / 1000).toFixed(1) + 'K';
    } else {
        return cost;
    }
}

function updateAutoclickerCosts() {
    document.getElementById('buy').textContent = `Autoclicks Lv1 (${formatCost(autoclickerCost)})`;
    document.getElementById('buyPowerful').textContent = `Autoclicks Lv2 (${formatCost(powerfulAutoclickerCost)})`;
    document.getElementById('buySuperPowerful').textContent = `Autoclicks Lv3 (${formatCost(superPowerfulAutoclickerCost)})`;
    document.getElementById('buyUltraPowerful').textContent = `Autoclicks Lv4 (${formatCost(ultraPowerfulAutoclickerCost)})`;
}

/* --------------------------------------------------------------------------

                                Main cookie click 

   -------------------------------------------------------------------------- */

  cookie.addEventListener('click', function () {
    count++;
    display.textContent = count.toLocaleString('fr-FR');

    saveToCookies();
  });

/* --------------------------------------------------------------------------

                                Autoclicker 1 

   -------------------------------------------------------------------------- */

  buy.addEventListener('click', function () {
    if(count >= autoclickerCost) {
        count -= autoclickerCost;
        autoclickers++;
        autoclickerCost *= 2; // Multiplie le coût par 2
        display.textContent = count.toLocaleString('fr-FR');
        autoclickerDisplay.textContent = autoclickers;
        updateAutoclickerCosts(); // Met à jour le texte du bouton
        saveToCookies(); // Ajouté pour sauvegarder les coûts mis à jour
    }
});

/* --------------------------------------------------------------------------

                                Autoclicker 2 

   -------------------------------------------------------------------------- */

buyPowerful.addEventListener('click', function () {
    if(count >= powerfulAutoclickerCost) {
        count -= powerfulAutoclickerCost;
        powerfulAutoclickers++;
        powerfulAutoclickerCost *= 2; // Multiplie le coût par 2
        display.textContent = count.toLocaleString('fr-FR');
        powerfulAutoclickerDisplay.textContent = powerfulAutoclickers;
        updateAutoclickerCosts(); // Met à jour le texte du bouton
        saveToCookies(); // Ajouté pour sauvegarder les coûts mis à jour
    }
});

/* --------------------------------------------------------------------------

                                Autoclicker 3 

   -------------------------------------------------------------------------- */

buySuperPowerful.addEventListener('click', function () {
    if(count >= superPowerfulAutoclickerCost) {
        count -= superPowerfulAutoclickerCost;
        superPowerfulAutoclickers++;
        superPowerfulAutoclickerCost *= 2; // Multiplie le coût par 2
        display.textContent = count.toLocaleString('fr-FR');
        superPowerfulAutoclickerDisplay.textContent = superPowerfulAutoclickers;
        updateAutoclickerCosts(); // Met à jour le texte du bouton
        saveToCookies(); // Ajouté pour sauvegarder les coûts mis à jour
    }
});

/* --------------------------------------------------------------------------

                                Autoclicker 4 

   -------------------------------------------------------------------------- */

buyUltraPowerful.addEventListener('click', function () {
    if(count >= ultraPowerfulAutoclickerCost) {
        count -= ultraPowerfulAutoclickerCost;
        ultraPowerfulAutoclickers++;
        ultraPowerfulAutoclickerCost *= 2; // Multiplie le coût par 2
        display.textContent = count.toLocaleString('fr-FR');
        ultraPowerfulAutoclickerDisplay.textContent = ultraPowerfulAutoclickers;
        updateAutoclickerCosts(); // Met à jour le texte du bouton
        saveToCookies(); // Ajouté pour sauvegarder les coûts mis à jour
    }
});

/* --------------------------------------------------------------------------

                                Theme 0 

   -------------------------------------------------------------------------- */

  buytheme1.addEventListener('click', function () {
    if(count >= 0.5 && !theme1Purchased) {
      count -= 0.5;
      theme1Purchased = true;
      display.textContent = count.toLocaleString('fr-FR');
  
      // Changer le fond d'écran
      document.querySelector('.container').style.backgroundImage = "url('./pictures/background_1.gif')";
      document.querySelector('.container').style.backgroundSize = "cover";
  
      // Changer le texte du bouton
      buytheme1.textContent = "Theme 0 (0)";
  
      saveToCookies();
    } else if (theme1Purchased) {
      // Si le thème 1 a déjà été acheté, l'utilisateur peut toujours l'équiper
      document.querySelector('.container').style.backgroundImage = "url('./pictures/background_1.gif')";
      document.querySelector('.container').style.backgroundSize = "cover";
      currentTheme = 'theme1'; // Ajoutez cette ligne
    }
  });
  
/* --------------------------------------------------------------------------

                                Theme 1 

   -------------------------------------------------------------------------- */

  buytheme2.addEventListener('click', function () {
    if(count >= 7000 && !theme2Purchased) {
      count -= 7000;
      theme2Purchased = true;
      display.textContent = count.toLocaleString('fr-FR');
  
      // Changer le texte du bouton
      buytheme2.textContent = "Theme 1 (0)";
  
      saveToCookies();
    } else if (theme2Purchased) {
      // Si le thème 2 a déjà été acheté, l'utilisateur peut toujours l'équiper
      document.querySelector('.container').style.backgroundImage = "url('./pictures/background_2.jpg')";
      document.querySelector('.container').style.backgroundSize = "cover";
      currentTheme = 'theme2'; // Ajoutez cette ligne
    }
  });

/* --------------------------------------------------------------------------

                                Theme 2 

   -------------------------------------------------------------------------- */

  buytheme3.addEventListener('click', function () {
    if(count >= 16000 && !theme3Purchased) {
      count -= 16000;
      theme3Purchased = true;
      display.textContent = count.toLocaleString('fr-FR');
  
      // Changer le texte du bouton
      buytheme3.textContent = "Theme 2 (0)";
  
      saveToCookies();
    } else if (theme3Purchased) {
      // Si le thème 3 a déjà été acheté, l'utilisateur peut toujours l'équiper
      document.querySelector('.container').style.backgroundImage = "url('./pictures/background_3.jpg')";
      document.querySelector('.container').style.backgroundSize = "cover";
      currentTheme = 'theme3'; // Ajoutez cette ligne
    }
  });

/* --------------------------------------------------------------------------

                                Theme 3 

   -------------------------------------------------------------------------- */

  buytheme4.addEventListener('click', function () {
    if(count >= 120000 && !theme4Purchased) {
      count -= 120000;
      theme4Purchased = true;
      display.textContent = count.toLocaleString('fr-FR');
  
      // Changer le texte du bouton
      buytheme4.textContent = "Theme 3 (0)";
  
      saveToCookies();
    } else if (theme4Purchased) {
      // Si le thème 4 a déjà été acheté, l'utilisateur peut toujours l'équiper
      document.querySelector('.container').style.backgroundImage = "url('./pictures/background_4.gif')";
      document.querySelector('.container').style.backgroundSize = "cover";
      currentTheme = 'theme4'; // Ajoutez cette ligne
    }
  });

/* --------------------------------------------------------------------------

                                Theme 4 

   -------------------------------------------------------------------------- */

  buytheme5.addEventListener('click', function () {
    if(count >= 670000 && !theme5Purchased) {
      count -= 670000;
      theme5Purchased = true;
      display.textContent = count.toLocaleString('fr-FR');
  
      // Changer le texte du bouton
      buytheme5.textContent = "Theme 4 (0)";
  
      saveToCookies();
    } else if (theme5Purchased) {
      // Si le thème 5 a déjà été acheté, l'utilisateur peut toujours l'équiper
      document.querySelector('.container').style.backgroundImage = "url('./pictures/background_5.gif')";
      document.querySelector('.container').style.backgroundSize = "cover";
      currentTheme = 'theme5'; // Ajoutez cette ligne
    }
  });

/* --------------------------------------------------------------------------

                                Theme 5 

   -------------------------------------------------------------------------- */

  buytheme6.addEventListener('click', function () {
    if(count >= 1300000 && !theme6Purchased) {
      count -= 1300000;
      theme6Purchased = true;
      display.textContent = count.toLocaleString('fr-FR');
  
      // Changer le texte du bouton
      buytheme6.textContent = "Theme 5 (0)";
  
      saveToCookies();
    } else if (theme6Purchased) {
      // Si le thème 6 a déjà été acheté, l'utilisateur peut toujours l'équiper
      document.querySelector('.container').style.backgroundImage = "url('./pictures/background_6.gif')";
      document.querySelector('.container').style.backgroundSize = "cover";
      currentTheme = 'theme6'; // Ajoutez cette ligne
    }
  });

/* --------------------------------------------------------------------------

                                Reset confirmations 

   -------------------------------------------------------------------------- */

  reset.addEventListener('click', function () {
    confirmationDialog.style.display = 'block';
  });

  confirmYes.addEventListener('click', function () {
    count = 0;
    autoclickers = 0;
    powerfulAutoclickers = 0;
    superPowerfulAutoclickers = 0;
    ultraPowerfulAutoclickers = 0; // Assurez-vous que cette ligne est présente et correctement écrite
    display.textContent = count.toLocaleString('fr-FR');
    ultraPowerfulAutoclickers = 0;
    display.textContent = count;
    autoclickerDisplay.textContent = autoclickers;
    powerfulAutoclickerDisplay.textContent = powerfulAutoclickers;
    superPowerfulAutoclickerDisplay.textContent = superPowerfulAutoclickers;
    ultraPowerfulAutoclickerDisplay.textContent = ultraPowerfulAutoclickers;
    theme1Purchased = false;
    theme2Purchased = false;
    theme3Purchased = false;
    theme4Purchased = false;
    theme5Purchased = false;
    theme6Purchased = false;
    document.querySelector('.container').style.backgroundImage = ""; // Réinitialiser le fond d'écran

    saveToCookies();

    confirmationDialog.style.display = 'none';
  });

  confirmNo.addEventListener('click', function () {
    confirmationDialog.style.display = 'none';
  });

/* --------------------------------------------------------------------------

                                Autoclicker give 

   -------------------------------------------------------------------------- */

  setInterval(function() {
    if(autoclickers > 0 || powerfulAutoclickers > 0 || powerfulAutoclickers > 0 || superPowerfulAutoclickers > 0 || ultraPowerfulAutoclickers > 0) {
      count += (0.5 * autoclickers) + (10 * powerfulAutoclickers) + (70 * superPowerfulAutoclickers) + (500 * ultraPowerfulAutoclickers);
      display.textContent = count.toLocaleString('fr-FR');

      saveToCookies();
    }
  }, 2000);

/* --------------------------------------------------------------------------

                                Admin Cookies give

   -------------------------------------------------------------------------- */

  document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.shiftKey && event.key === '+') {
        count += 1000000000; // Ajoute 1 million au compteur de cookies
        display.textContent = count.toLocaleString('fr-FR'); // Met à jour l'affichage
        saveToCookies(); // Sauvegarde la nouvelle valeur dans les cookies
    }
});

/* --------------------------------------------------------------------------

                                Disable Click droit

   -------------------------------------------------------------------------- */

  document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });

/* --------------------------------------------------------------------------

                              Disable dev console

   -------------------------------------------------------------------------- */

   document.onkeydown = function(e) {
    const forbiddenKeys = ['c', 'a', 'v', 'u', 'i', 's', 'x'];
    if ((e.ctrlKey && forbiddenKeys.includes(e.key.toLowerCase())) || e.code === 'F12') {
        alert("Don't cheat!");
        return false;
    } else {
        return true;
    }
  };

/* --------------------------------------------------------------------------

                                Google Analytics

   -------------------------------------------------------------------------- */

window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  src="googletagmanager.com/gtag/js?id=G-WFEWHP2MJX"
  gtag('config', 'G-WFEWHP2MJX');

  // Initialiser les coûts des autoclickers dans le HTML
  updateAutoclickerCosts();
});