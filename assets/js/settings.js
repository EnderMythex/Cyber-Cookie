/* --------------------------------------------------------------------------

                              Disable Right Click

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
        alert("504 Error, NOT ALLOWED!");
        return false;
    } else {
        return true;
    }
  };