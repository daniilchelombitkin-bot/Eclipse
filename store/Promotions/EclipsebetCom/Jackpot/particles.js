// Particles system для Jackpot
(function() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const container = canvas.parentElement;

  let particles = [];
  let animationId;
  let mouse = { x: null, y: null, radius: 80 };

  // Resize canvas
  function resizeCanvas() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Mouse tracking
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle class
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 10;
      this.size = Math.random() * 2.5 + 1;
      this.speedY = -(Math.random() * 0.8 + 0.3);
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = 0;
      this.life = 0;
      this.maxLife = Math.random() * 150 + 150;

      // Золотые оттенки
      const goldColors = [
        'rgba(255, 215, 0,',   // Gold
        'rgba(255, 222, 153,', // Light gold
        'rgba(180, 136, 82,',  // Dark gold
        'rgba(255, 231, 122,', // Bright gold
      ];
      this.color = goldColors[Math.floor(Math.random() * goldColors.length)];
    }

    update() {
      // Mouse repulsion effect
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          const pushX = Math.cos(angle) * force * 3;
          const pushY = Math.sin(angle) * force * 3;

          this.x += pushX;
          this.y += pushY;
        }
      }

      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;

      // Fade in and out
      if (this.life < 20) {
        this.opacity = this.life / 20;
      } else if (this.life > this.maxLife - 20) {
        this.opacity = (this.maxLife - this.life) / 20;
      } else {
        this.opacity = 1;
      }

      // Reset if out of bounds or life ended
      if (this.y < -10 || this.life >= this.maxLife ||
          this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity * 0.6;

      // Glow effect
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color.replace('rgba', 'rgb').replace(/,[^,]*\)/, ')');

      // Draw particle
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.fill();

      ctx.restore();
    }
  }

  // Initialize particles
  function init() {
    particles = [];
    const particleCount = Math.min(Math.floor(canvas.width / 8), 60);

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  // Start
  init();
  animate();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
})();
