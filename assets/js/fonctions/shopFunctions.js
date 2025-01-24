/* --------------------------------------------------------------------------
 
                          Variables du Shop
 
   -------------------------------------------------------------------------- */

   export const shopState = {
    count: 0,
    autoclickers: 0,
    clickPower: 1,
    autoclickerCost: 15,
    clickPowerCost: 100,
    powerfulAutoclickers: 0,
    superPowerfulAutoclickers: 0,
    ultraPowerfulAutoclickers: 0,
    powerfulAutoclickerCost: 70,
    superPowerfulAutoclickerCost: 350,
    ultraPowerfulAutoclickerCost: 1700
};

/* --------------------------------------------------------------------------
 
                          Fonctions du Shop
 
   -------------------------------------------------------------------------- */

export function formatCost(cost) {
    if (cost >= 1000000000) {
        return (cost / 1000000000).toFixed(1) + 'B';
    } else if (cost >= 1000000) {
        return (cost / 1000000).toFixed(1) + 'M';
    } else if (cost >= 1000) {
        return (cost / 1000).toFixed(1) + 'K';
    } else {
        return cost.toFixed(1);
    }
}

export function updateAutoclickerCosts() {
    const buy = document.getElementById('buy');
    const buyPowerful = document.getElementById('buyPowerful');
    const buySuperPowerful = document.getElementById('buySuperPowerful');
    const buyUltraPowerful = document.getElementById('buyUltraPowerful');
    const buyClickPower = document.getElementById('buyClickPower');

    buy.textContent = `AutoClick LV1 (${formatCost(shopState.autoclickerCost)})`;
    buyPowerful.textContent = `AutoClick LV2 (${formatCost(shopState.powerfulAutoclickerCost)})`;
    buySuperPowerful.textContent = `AutoClick LV3 (${formatCost(shopState.superPowerfulAutoclickerCost)})`;
    buyUltraPowerful.textContent = `AutoClick LV4 (${formatCost(shopState.ultraPowerfulAutoclickerCost)})`;
    buyClickPower.textContent = `Click Power (${formatCost(shopState.clickPowerCost)})`;
}

export function updateAutoclickerButtons() {
    const autoclickerDisplay = document.getElementById('autoclickers');
    const powerfulAutoclickerDisplay = document.getElementById('powerfulAutoclickers');
    const superPowerfulAutoclickerDisplay = document.getElementById('superPowerfulAutoclickers');
    const ultraPowerfulAutoclickerDisplay = document.getElementById('ultraPowerfulAutoclickers');
    const clickPowerDisplay = document.getElementById('clickPower');

    autoclickerDisplay.textContent = shopState.autoclickers;
    powerfulAutoclickerDisplay.textContent = shopState.powerfulAutoclickers;
    superPowerfulAutoclickerDisplay.textContent = shopState.superPowerfulAutoclickers;
    ultraPowerfulAutoclickerDisplay.textContent = shopState.ultraPowerfulAutoclickers;
    clickPowerDisplay.textContent = shopState.clickPower;
}

/* --------------------------------------------------------------------------
 
                          Gestionnaires d'événements du Shop
 
   -------------------------------------------------------------------------- */

export function initializeShopHandlers(playSound, saveToCookies) {
    const buy = document.getElementById('buy');
    const buyPowerful = document.getElementById('buyPowerful');
    const buySuperPowerful = document.getElementById('buySuperPowerful');
    const buyUltraPowerful = document.getElementById('buyUltraPowerful');
    const buyClickPower = document.getElementById('buyClickPower');
    const display = document.getElementById('count');

    // AutoClick LV1
    buy.addEventListener('click', () => {
        if (shopState.count >= shopState.autoclickerCost) {
            shopState.count -= shopState.autoclickerCost;
            shopState.autoclickers++;
            shopState.autoclickerCost *= 1.2;
            display.textContent = shopState.count.toLocaleString('fr-FR');
            updateAutoclickerButtons();
            playSound();
            updateAutoclickerCosts();
            saveToCookies();
        }
    });

    // AutoClick LV2
    buyPowerful.addEventListener('click', () => {
        if (shopState.count >= shopState.powerfulAutoclickerCost) {
            shopState.count -= shopState.powerfulAutoclickerCost;
            shopState.powerfulAutoclickers++;
            shopState.powerfulAutoclickerCost *= 1.2;
            display.textContent = shopState.count.toLocaleString('fr-FR');
            updateAutoclickerButtons();
            playSound();
            updateAutoclickerCosts();
            saveToCookies();
        }
    });

    // AutoClick LV3
    buySuperPowerful.addEventListener('click', () => {
        if (shopState.count >= shopState.superPowerfulAutoclickerCost) {
            shopState.count -= shopState.superPowerfulAutoclickerCost;
            shopState.superPowerfulAutoclickers++;
            shopState.superPowerfulAutoclickerCost *= 1.2;
            display.textContent = shopState.count.toLocaleString('fr-FR');
            updateAutoclickerButtons();
            playSound();
            updateAutoclickerCosts();
            saveToCookies();
        }
    });

    // AutoClick LV4
    buyUltraPowerful.addEventListener('click', () => {
        if (shopState.count >= shopState.ultraPowerfulAutoclickerCost) {
            shopState.count -= shopState.ultraPowerfulAutoclickerCost;
            shopState.ultraPowerfulAutoclickers++;
            shopState.ultraPowerfulAutoclickerCost *= 1.2;
            display.textContent = shopState.count.toLocaleString('fr-FR');
            updateAutoclickerButtons();
            playSound();
            updateAutoclickerCosts();
            saveToCookies();
        }
    });

    // Click Power
    buyClickPower.addEventListener('click', () => {
        if (shopState.count >= shopState.clickPowerCost) {
            shopState.count -= shopState.clickPowerCost;
            shopState.clickPower += 1;
            shopState.clickPowerCost *= 1.1;
            display.textContent = shopState.count.toLocaleString('fr-FR');
            updateAutoclickerButtons();
            playSound();
            updateAutoclickerCosts();
            saveToCookies();
        }
    });
}

export function processAutoClicks() {
    const autoClickValue = (0.5 * shopState.autoclickers) + 
                         (2.7 * shopState.powerfulAutoclickers) + 
                         (10 * shopState.superPowerfulAutoclickers) + 
                         (50 * shopState.ultraPowerfulAutoclickers);
    
    if (autoClickValue > 0) {
        shopState.count += autoClickValue;
        document.getElementById('count').textContent = shopState.count.toLocaleString('fr-FR');
        return true;
    }
    return false;
}

export function updateCount(newCount) {
    shopState.count = newCount;
}

export function initializeShopButton(playSound) {
    const shop = document.getElementById('shop');
    const shopOptions = document.getElementById('shopOptions');
    const cookie = document.getElementById('cookie');
    const reset = document.getElementById('reset');
    const discord = document.getElementById('discord');
    const settings = document.getElementById('settings');
    const extension = document.getElementById('extension');
    const theme = document.getElementById('theme');

    shop.addEventListener('click', function () {
        playSound();
        if (shopOptions.style.display === "none") {
            shopOptions.style.display = "block";
            shop.textContent = "Home";
            cookie.style.display = 'none';
            reset.style.display = 'none';
            discord.style.display = 'none';
            settings.style.display = 'none';
            extension.style.display = 'none';
            theme.style.display = 'none';
        } else {
            shopOptions.style.display = "none";
            shop.textContent = "Shop";
            cookie.style.display = 'block';
            reset.style.display = 'block';
            discord.style.display = 'block';
            settings.style.display = 'block';
            extension.style.display = 'block';
            theme.style.display = 'block';
        }
    });
}

// Ajoutez cette fonction pour gérer les autoclicks périodiques
export function startAutoClickInterval(updateInterval, saveToCookies) {
    setInterval(function () {
        if (processAutoClicks()) {
            updateInterval();
            saveToCookies();
        }
    }, 2000);
}

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
