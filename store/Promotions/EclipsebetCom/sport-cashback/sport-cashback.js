// Modal functionality
function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('active');
  document.body.classList.remove('modal-open');
}

function initModals() {
  document.querySelectorAll('.modal-trigger').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const id = btn.getAttribute('data-modal');
      const modal = document.getElementById(id);

      if (modal) {
        document.body.classList.add('modal-open');
        modal.classList.add('active');
      }
    });
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const id = btn.getAttribute('data-close');
      closeModal(document.getElementById(id));
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(closeModal);
    }
  });
}

window.addEventListener('load', initModals);

// ==================== PARTICLES SYSTEM ====================
(function() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const container = canvas.parentElement;

  let particles = [];
  let animationId;
  let mouse = { x: null, y: null, radius: 150 };

  // Resize canvas
  function resizeCanvas() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    init();
  });

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

  // Particle class - golden particles
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      // Random position
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;

      // Size
      this.size = Math.random() * 3 + 1;

      // Velocity - slow floating movement
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;

      // Opacity
      this.opacity = Math.random() * 0.5 + 0.3;
      this.targetOpacity = this.opacity;

      // Life
      this.life = 0;
      this.maxLife = Math.random() * 400 + 300;

      // Glow intensity
      this.glowIntensity = Math.random() * 0.3 + 0.4;

      // Sine wave for smooth movement
      this.sineOffset = Math.random() * Math.PI * 2;
      this.sineAmplitude = Math.random() * 0.5 + 0.3;

      // Golden colors
      const goldColors = [
        'rgba(255, 215, 0,',
        'rgba(255, 222, 153,',
        'rgba(180, 136, 82,',
        'rgba(255, 231, 122,',
      ];
      this.color = goldColors[Math.floor(Math.random() * goldColors.length)];
    }

    update() {
      // Mouse interaction - gentle attraction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius && distance > 0) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          const pushStrength = force * 0.5;

          this.vx += Math.cos(angle) * pushStrength;
          this.vy += Math.sin(angle) * pushStrength;
          this.targetOpacity = Math.min(1, this.opacity + 0.3);
        } else {
          this.targetOpacity = this.opacity;
        }
      }

      // Smooth opacity transition
      this.opacity += (this.targetOpacity - this.opacity) * 0.1;

      // Gentle sine wave motion
      this.vx += Math.sin(this.life * 0.02 + this.sineOffset) * this.sineAmplitude * 0.01;
      this.vy += Math.cos(this.life * 0.02 + this.sineOffset) * this.sineAmplitude * 0.01;

      // Friction
      this.vx *= 0.98;
      this.vy *= 0.98;

      // Update position
      this.x += this.vx;
      this.y += this.vy;

      // Life cycle
      this.life++;

      // Wrap around edges
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;

      // Reset if life exceeded
      if (this.life >= this.maxLife) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity * 0.6;

      // Glow effect
      ctx.shadowBlur = 10 + this.glowIntensity * 15;
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
    const isMobile = canvas.width < 600;
    const particleCount = isMobile ? 40 : 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // Animation loop
  function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  // Start animation
  init();
  animate();

  // Cleanup
  window.addEventListener('beforeunload', () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
})();
