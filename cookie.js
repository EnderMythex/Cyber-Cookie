// cookie.js
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
  var currentTheme = '';
  var settings = document.getElementById('settings');
  
  function generateMiniCookie() {
    var miniCookie = document.createElement('div');
    miniCookie.className = 'mini-cookie';
    miniCookie.style.left = Math.random() * window.innerWidth + 'px';
    document.body.appendChild(miniCookie);

    // Supprimer le mini cookie après 2 secondes
    setTimeout(function() {
        document.body.removeChild(miniCookie);
    }, 1800);
}

cookie.addEventListener('click', function () {
    generateMiniCookie();
});

  shop.addEventListener('click', function () {
    if (shopOptions.style.display === "none") {
      shopOptions.style.display = "block";
      cookie.style.display = 'none'; 
      reset.style.display = 'none'; 
      discord.style.display = 'none';
      theme.style.display = 'none';
    } else {
      shopOptions.style.display = "none";
      cookie.style.display = 'block'; 
      reset.style.display = 'block'; 
      discord.style.display = 'block';
      theme.style.display = 'block';
    }
  });

  theme.addEventListener('click', function () {
    if (themeOptions.style.display === "none") {
      themeOptions.style.display = "block";
      shopOptions.style.display = 'none';
      cookie.style.display = 'none'; 
      reset.style.display = 'none'; 
      discord.style.display = 'none';
      shop.style.display = 'none';
    } else {
      themeOptions.style.display = "none";
      cookie.style.display = 'block'; 
      reset.style.display = 'block'; 
      discord.style.display = 'block';
      shop.style.display = 'block';
    }
  });

  // Charger le score et les autoclickers sauvegardés
  chrome.storage.sync.get(['score', 'autoclickers', 'powerfulAutoclickers', 'superPowerfulAutoclickers', 'ultraPowerfulAutoclickers'], function(result) {
    if(result.score) {
      count = result.score;
      display.textContent = count;
    }
    if(result.autoclickers) {
      autoclickers = result.autoclickers;
      autoclickerDisplay.textContent = autoclickers;
    }
    if(result.powerfulAutoclickers) {
      powerfulAutoclickers = result.powerfulAutoclickers;
      powerfulAutoclickerDisplay.textContent = powerfulAutoclickers;
    }
    if(result.superPowerfulAutoclickers) {
      superPowerfulAutoclickers = result.superPowerfulAutoclickers;
      superPowerfulAutoclickerDisplay.textContent = superPowerfulAutoclickers;
    }
    if(result.ultraPowerfulAutoclickers) {
      ultraPowerfulAutoclickers = result.ultraPowerfulAutoclickers;
      ultraPowerfulAutoclickerDisplay.textContent = ultraPowerfulAutoclickers;
    }
    chrome.storage.sync.get(['theme1Purchased', 'theme2Purchased', 'theme3Purchased'], function(result) {
      if(result.theme1Purchased) {
        theme1Purchased = true;
        document.body.style.background = "url('background_1.gif')";
        document.body.style.backgroundSize = "cover";
        buytheme1.textContent = "Theme 0 (0)"; // Mettre à jour le texte du bouton
      }
      if(result.theme2Purchased) {
        theme2Purchased = true;
        document.body.style.background = "url('background_2.jpg')";
        document.body.style.backgroundSize = "cover";
        buytheme2.textContent = "Theme 1 (0)"; // Mettre à jour le texte du bouton
      }
      if(result.theme3Purchased) {
        theme3Purchased = true;
        document.body.style.background = "url('background_3.jpg')";
        document.body.style.backgroundSize = "cover";
        buytheme3.textContent = "Theme 2 (0)"; // Mettre à jour le texte du bouton
      }
      chrome.storage.sync.get(['currentTheme'], function(result) {
        if(result.currentTheme === 'theme1') {
          document.body.style.background = "url('background_1.gif')";
          document.body.style.backgroundSize = "cover";
        } else if(result.currentTheme === 'theme2') {
          document.body.style.background = "url('background_2.jpg')";
          document.body.style.backgroundSize = "cover";
        }
      });
    });
  });

  cookie.addEventListener('click', function () {
    count++;
    display.textContent = count.toLocaleString('fr-FR');

    // Sauvegarder le score
    chrome.storage.sync.set({score: count}, function() {
      console.log('Game Saved | Score : ' + count);
    });
  });

  buy.addEventListener('click', function () {
    if(count >= 15) {
      count -= 15;
      autoclickers++;
      display.textContent = count.toLocaleString('fr-FR');
      autoclickerDisplay.textContent = autoclickers;

      // Sauvegarder le score et les autoclickers
      chrome.storage.sync.set({score: count, autoclickers: autoclickers}, function() {
        console.log('Game Saved | +1 AutoClicker Lv1 = +0.5C/s');
      });
    }
});

  buyPowerful.addEventListener('click', function () {
    if(count >= 70) {
      count -= 70;
      powerfulAutoclickers++;
      display.textContent = count.toLocaleString('fr-FR');
      powerfulAutoclickerDisplay.textContent = powerfulAutoclickers;

      // Sauvegarder le score et les autoclickers
      chrome.storage.sync.set({score: count, powerfulAutoclickers: powerfulAutoclickers}, function() {
        console.log('Game Saved | +1 AutoClicker Lv2 = +2.7C/s');
      });
    }
  });

  buySuperPowerful.addEventListener('click', function () {
    if(count >= 350) {
      count -= 350;
      superPowerfulAutoclickers++;
      display.textContent = count.toLocaleString('fr-FR');
      superPowerfulAutoclickerDisplay.textContent = superPowerfulAutoclickers;

      // Sauvegarder le score et les autoclickers
      chrome.storage.sync.set({score: count, superPowerfulAutoclickers: superPowerfulAutoclickers}, function() {
        console.log('Game Saved | +1 AutoClicker Lv3 = +10C/s');
      });
    }
  });

  buyUltraPowerful.addEventListener('click', function () {
    if(count >= 1750) {
      count -= 1750;
      ultraPowerfulAutoclickers++;
      display.textContent = count.toLocaleString('fr-FR');
      ultraPowerfulAutoclickerDisplay.textContent = ultraPowerfulAutoclickers;

      // Sauvegarder le score et les autoclickers
      chrome.storage.sync.set({score: count, ultraPowerfulAutoclickers: ultraPowerfulAutoclickers}, function() {
        console.log('Game Saved | +1 AutoClicker Lv4 = +50C/s');
      });
    }
  });

  buytheme1.addEventListener('click', function () {
    if(count >= 0.5 && !theme1Purchased) {
      count -= 0.5;
      theme1Purchased = true;
      display.textContent = count.toLocaleString('fr-FR');
  
      // Changer le fond d'écran
      document.body.style.background = "url('background_1.gif')";
      document.body.style.backgroundSize = "cover";
  
      // Changer le texte du bouton
      buytheme1.textContent = "Theme 0 (0)";
  
      // Sauvegarder le score
      chrome.storage.sync.set({score: count, theme1Purchased: theme1Purchased}, function() {
        console.log('Game Saved | +1 Theme');
      });
    } else if (theme1Purchased) {
      // Si le thème 1 a déjà été acheté, l'utilisateur peut toujours l'équiper
      document.body.style.background = "url('background_1.gif')";
      document.body.style.backgroundSize = "cover";
      currentTheme = 'theme1'; // Ajoutez cette ligne
    }
  });
  
  buytheme2.addEventListener('click', function () {
    if(count >= 7000 && !theme2Purchased) {
      count -= 7000;
      theme2Purchased = true;
      display.textContent = count.toLocaleString('fr-FR');
  
      // Changer le texte du bouton
      buytheme2.textContent = "Theme 1 (0)";
  
      // Sauvegarder le score
      chrome.storage.sync.set({score: count, theme2Purchased: theme2Purchased}, function() {
        console.log('Game Saved | +1 Theme');
      });
    } else if (theme2Purchased) {
      // Si le thème 2 a déjà été acheté, l'utilisateur peut toujours l'équiper
      document.body.style.background = "url('background_2.jpg')";
      document.body.style.backgroundSize = "cover";
      currentTheme = 'theme2'; // Ajoutez cette ligne
    }
  });

  buytheme3.addEventListener('click', function () {
    if(count >= 16000 && !theme3Purchased) {
      count -= 16000;
      theme3Purchased = true;
      display.textContent = count.toLocaleString('fr-FR');
  
      // Changer le texte du bouton
      buytheme3.textContent = "Theme 2 (0)";
  
      // Sauvegarder le score
      chrome.storage.sync.set({score: count, theme3Purchased: theme3Purchased}, function() {
        console.log('Game Saved | +1 Theme');
      });
    } else if (theme3Purchased) {
      // Si le thème 3 a déjà été acheté, l'utilisateur peut toujours l'équiper
      document.body.style.background = "url('background_3.jpg')";
      document.body.style.backgroundSize = "cover";
      currentTheme = 'theme3'; // Ajoutez cette ligne
    }
  });

  reset.addEventListener('click', function () {
    count = 0;
    autoclickers = 0;
    powerfulAutoclickers = 0;
    superPowerfulAutoclickers = 0;
    ultraPowerfulAutoclickers = 0;
    display.textContent = count;
    autoclickerDisplay.textContent = autoclickers;
    powerfulAutoclickerDisplay.textContent = powerfulAutoclickers;
    superPowerfulAutoclickerDisplay.textContent = superPowerfulAutoclickers;
    ultraPowerfulAutoclickerDisplay.textContent = ultraPowerfulAutoclickers;
    theme1Purchased = false;
    theme2Purchased = false;
    theme3Purchased = false;
    document.body.style.background = ""; // Réinitialiser le fond d'écran

    // Réinitialiser les valeurs dans chrome.storage.sync
    chrome.storage.sync.set({
        score: count,
        autoclickers: autoclickers,
        powerfulAutoclickers: powerfulAutoclickers,
        superPowerfulAutoclickers: superPowerfulAutoclickers,
        ultraPowerfulAutoclickers: ultraPowerfulAutoclickers,
        theme1Purchased: theme1Purchased,
        theme2Purchased: theme2Purchased,
        theme3Purchased: theme3Purchased
    }, function() {
        console.log('Game Reset');
    });
  });

  // Autoclicker
  setInterval(function() {
    if(autoclickers > 0 || powerfulAutoclickers > 0 || powerfulAutoclickers > 0 || superPowerfulAutoclickers > 0 || ultraPowerfulAutoclickers > 0) {
      count += (0.5 * autoclickers) + (2.7 * powerfulAutoclickers) + (10 * superPowerfulAutoclickers) + (50 * ultraPowerfulAutoclickers);
      display.textContent = count.toLocaleString('fr-FR');

      // Sauvegarder le score
      chrome.storage.sync.set({score: count}, function() {
        console.log('Game Saved | Score : ' + count);
      });
    }
  }, 1000);
});

  //Google Analytics Code Part 2
window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-WFEWHP2MJX');