class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        
        // More subtle, professional colors with lower opacity
        const colors = [
            'rgba(100, 149, 237, 0.4)',  // Soft blue
            'rgba(176, 196, 222, 0.4)',  // Light steel blue
            'rgba(119, 136, 153, 0.4)',  // Light slate gray
            'rgba(112, 128, 144, 0.4)'   // Slate gray
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.005;

        if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-js');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numberOfParticles = 150;
        this.mouse = {
            x: null,
            y: null,
            radius: 200
        };

        this.init();
        this.animate();
        this.handleResize();
        this.handleMouse();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    handleMouse() {
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            particle.update();
            particle.draw();

            for (let j = index; j < this.particles.length; j++) {
                const dx = particle.x - this.particles[j].x;
                const dy = particle.y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.ctx.beginPath();
                    // Softer connection lines
                    this.ctx.strokeStyle = `rgba(176, 196, 222, ${0.2 * (1 - distance/150)})`;
                    this.ctx.lineWidth = 2;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }

            if (this.mouse.x) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const directionX = dx / distance;
                    const directionY = dy / distance;
                    particle.x += directionX * force * 4;
                    particle.y += directionY * force * 4;
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the particle system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
}); 