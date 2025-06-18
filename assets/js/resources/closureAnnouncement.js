/**
 * Module pour gérer l'annonce de fermeture de la plateforme
 */

export function showClosureAnnouncement(playSound = null) {
    // Vérifier si l'utilisateur a déjà vu l'annonce aujourd'hui
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('closureAnnouncementShown');
    
    if (lastShown === today) {
        return; // Ne pas afficher si déjà vu aujourd'hui
    }
    
    // Créer le modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        border: 2px solid #a6791e;
        color: white;
    `;
    
    modalContent.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
        <h2 style="color: #ff6b6b; margin-bottom: 20px; font-size: 24px;">
            Annonce Importante
        </h2>
        <p style="font-size: 18px; line-height: 1.6; margin-bottom: 20px;">
            La plateforme <strong>CyberCookie Version 1</strong> fermera définitivement vers 
            <strong style="color: #a6791e;">fin juillet 2025</strong>.
        </p>
        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 25px; color: #cccccc;">
            Nous travaillons sur une nouvelle version encore plus incroyable ! 
            Restez connectés pour ne rien manquer de CyberCookie v2.
        </p>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button id="closureOk" style="
                background: #a6791e;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: background 0.3s;
            ">
                J'ai compris
            </button>
            <button id="closureRemindLater" style="
                background: transparent;
                color: #cccccc;
                border: 1px solid #666;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                transition: background 0.3s;
            ">
                Me rappeler demain
            </button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Gérer les boutons
    document.getElementById('closureOk').addEventListener('click', () => {
        localStorage.setItem('closureAnnouncementShown', today);
        document.body.removeChild(modal);
        if (playSound) playSound();
    });
    
    document.getElementById('closureRemindLater').addEventListener('click', () => {
        document.body.removeChild(modal);
        if (playSound) playSound();
    });
    
    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    });
    
    // Effet hover pour les boutons
    const buttons = modalContent.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            if (button.id === 'closureOk') {
                button.style.background = '#8a6419';
            } else {
                button.style.background = 'rgba(255, 255, 255, 0.1)';
            }
        });
        
        button.addEventListener('mouseleave', () => {
            if (button.id === 'closureOk') {
                button.style.background = '#a6791e';
            } else {
                button.style.background = 'transparent';
            }
        });
    });
}