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


export class CookieEffectsManager {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.cookieImage = new Image();
        this.cookieImage.src = '/assets/icons/48x48cookie.png';
        this.textParticles = [];
        this.ctx.font = '24px clockDigital';
        
        // Configuration du canvas
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '10';
        
        // Ajuster la taille du canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Limiter le nombre maximum de particules
        this.MAX_PARTICLES = 50;
        this.MAX_TEXT_PARTICLES = 20;
        
        // Utiliser requestAnimationFrame avec throttling
        this.lastFrame = 0;
        this.FPS = 60;
        this.frameInterval = 1000 / this.FPS;
        
        // Démarrer l'animation
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addParticle(x, y) {
        if (this.particles.length >= this.MAX_PARTICLES) {
            this.particles.shift(); // Supprimer la plus ancienne particule
        }
        const particle = {
            x,
            y,
            size: 48,
            speed: 2 + Math.random() * 2,
            opacity: 0.8,
            rotation: Math.random() * Math.PI * 2
        };
        this.particles.push(particle);
    }

    addTextParticle(x, y, text) {
        if (this.textParticles.length >= this.MAX_TEXT_PARTICLES) {
            this.textParticles.shift();
        }
        const particle = {
            x,
            y,
            text,
            opacity: 1,
            speed: 1.5
        };
        this.textParticles.push(particle);
    }

    animate(timestamp) {
        // Limiter le FPS
        if (timestamp - this.lastFrame < this.frameInterval) {
            requestAnimationFrame((ts) => this.animate(ts));
            return;
        }
        this.lastFrame = timestamp;

        // Optimiser le nettoyage du canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Batch rendering pour les cookies
        this.ctx.save();
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.y += particle.speed;
            particle.opacity -= 0.008;
            particle.rotation += 0.02;

            if (particle.opacity > 0) {
                this.ctx.globalAlpha = particle.opacity;
                this.ctx.translate(particle.x + particle.size/2, particle.y + particle.size/2);
                this.ctx.rotate(particle.rotation);
                this.ctx.drawImage(
                    this.cookieImage, 
                    -particle.size/2, 
                    -particle.size/2, 
                    particle.size, 
                    particle.size
                );
                this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
            } else {
                this.particles.splice(i, 1);
            }
        }
        this.ctx.restore();

        // Batch rendering pour le texte
        this.ctx.save();
        this.ctx.font = '24px clockDigital';
        for (let i = this.textParticles.length - 1; i >= 0; i--) {
            const particle = this.textParticles[i];
            
            particle.y -= particle.speed;
            particle.opacity -= 0.02;

            if (particle.opacity > 0) {
                this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
                this.ctx.fillText(particle.text, particle.x, particle.y);
            } else {
                this.textParticles.splice(i, 1);
            }
        }
        this.ctx.restore();

        requestAnimationFrame((ts) => this.animate(ts));
    }

    init() {
        document.body.appendChild(this.canvas);
    }

    generateCookie(x, y) {
        if (x === undefined || y === undefined) {
            x = Math.random() * (window.innerWidth - 50);
            y = -50;
        }
        this.addParticle(x, y);
    }

    generateText(x, y, text) {
        this.addTextParticle(x, y, text);
    }
} 