/* --------------------------------------------------------------------------

                                Disable Click droit

   -------------------------------------------------------------------------- */

// Désactiver le clic droit sur toute la page
document.addEventListener('contextmenu', function (event) {
  event.preventDefault();
});

/* --------------------------------------------------------------------------

                              Disable dev console

   -------------------------------------------------------------------------- */

document.onkeydown = function (e) {
  if ((e.ctrlKey && (e.keyCode === 67 || e.keyCode === 65 || e.keyCode === 86 || e.keyCode === 85 || e.keyCode === 73 || e.keyCode === 83 || e.keyCode === 88)) || e.keyCode === 123) {
    alert("Dont cheat !"); return false;
  } else {
    return true;
  }
};

/* --------------------------------------------------------------------------

                                Google Analytics

   -------------------------------------------------------------------------- */

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
src = "googletagmanager.com/gtag/js?id=G-WFEWHP2MJX"
gtag('config', 'G-WFEWHP2MJX');