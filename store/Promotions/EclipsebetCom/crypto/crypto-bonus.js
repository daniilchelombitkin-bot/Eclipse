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

// ==================== COIN PARTICLES SYSTEM ====================
(function() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const container = canvas.parentElement;

  // Coin images URLs
  const coinUrls = [
    'https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_dabb3062160bd8148188326ab9bd9519.png',
    'https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_90f202c2c649cbf8fc0a731b3f9c36a9.png',
    'https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_cd07e8d0f61f479fba3e7ac0ef6aaa93.png',
    'https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_8614dbe064d78a119fac238ae65a6e79.png'
  ];

  let coinImages = [];
  let imagesLoaded = 0;
  let coins = [];
  let particles = []; // Golden particles
  let animationId;
  let mouse = { x: null, y: null, radius: 150 };
  let useImageFallback = false;

  // Try to load coin images with timeout fallback
  let loadTimeout = setTimeout(() => {
    console.warn('Coin images taking too long to load, using fallback particles');
    useImageFallback = true;
    init();
    animate();
  }, 3000);

  // Load coin images
  coinUrls.forEach((url, index) => {
    const img = new Image();
    img.onload = () => {
      imagesLoaded++;
      console.log(`Coin image ${index + 1} loaded`);
      if (imagesLoaded === coinUrls.length) {
        clearTimeout(loadTimeout);
        console.log('All coins loaded!');
        init();
        animate();
      }
    };
    img.onerror = (e) => {
      console.error(`Failed to load coin ${index + 1}`);
      imagesLoaded++;
      useImageFallback = true;
      if (imagesLoaded === coinUrls.length) {
        clearTimeout(loadTimeout);
        init();
        animate();
      }
    };
    img.src = url;
    coinImages.push(img);
  });

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

  // Coin class
  class Coin {
    constructor() {
      this.reset();
    }

    reset() {
      // Start from top
      this.x = Math.random() * canvas.width;
      this.y = -50;

      // Random coin image
      this.imageIndex = Math.floor(Math.random() * coinImages.length);

      // Size - slightly bigger on desktop, slightly smaller on mobile
      const isMobile = canvas.width < 600;
      if (isMobile) {
        this.baseSize = Math.random() * 20 + 32; // 28-48px (smaller)
      } else {
        this.baseSize = Math.random() * 20 + 40; // 40-60px (bigger)
      }
      this.size = this.baseSize;

      // Gentle falling motion
      this.vx = (Math.random() - 0.5) * 1.5; // Slight horizontal drift
      this.vy = Math.random() * 1 + 1.5; // Falling down

      // Rotation
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.08;

      // Opacity
      this.opacity = 0;

      // Life
      this.life = 0;
      this.maxLife = Math.random() * 400 + 300;

      // Glow intensity
      this.glowIntensity = Math.random() * 0.3 + 0.4;

      // Sine wave for smooth horizontal movement
      this.sineOffset = Math.random() * Math.PI * 2;
      this.sineAmplitude = Math.random() * 0.5 + 0.3;
    }

    update() {
      // Mouse interaction - gentle repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius && distance > 0) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          const pushStrength = force * .25; // Reduced from 4 to 1.5

          this.vx += Math.cos(angle) * pushStrength;
          this.vy += Math.sin(angle) * pushStrength;
        }
      }

      // Gentle sine wave motion
      this.vx += Math.sin(this.life * 0.02 + this.sineOffset) * this.sineAmplitude * 0.05;

      // Gravity
      this.vy += 0.02;

      // Friction
      this.vx *= 0.99;
      this.vy *= 0.995;

      // Update position
      this.x += this.vx;
      this.y += this.vy;

      // Update rotation
      this.rotation += this.rotationSpeed;

      // Wall bounce (horizontal only)
      if (this.x - this.size / 2 <= 0) {
        this.x = this.size / 2;
        this.vx *= -0.5;
      } else if (this.x + this.size / 2 >= canvas.width) {
        this.x = canvas.width - this.size / 2;
        this.vx *= -0.5;
      }

      // Life cycle
      this.life++;

      // Fade in
      if (this.life < 30) {
        this.opacity = this.life / 30;
      } else if (this.opacity < 0.9) {
        this.opacity = Math.min(0.9, this.opacity + 0.02);
      }

      // Reset if goes below canvas
      if (this.y - this.size / 2 > canvas.height || this.life >= this.maxLife) {
        this.reset();
      }
    }

    draw() {
      const img = coinImages[this.imageIndex];
      const hasValidImage = img && img.complete && img.naturalWidth > 0;

      ctx.save();

      // Set opacity
      ctx.globalAlpha = this.opacity;

      // Move to coin position
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      // Glow effect
      ctx.shadowBlur = 15 + this.glowIntensity * 20;
      ctx.shadowColor = `rgba(255, 215, 0, ${this.opacity * this.glowIntensity})`;

      // Draw coin image OR fallback gradient circle
      if (hasValidImage && !useImageFallback) {
        ctx.drawImage(
          img,
          -this.size / 2,
          -this.size / 2,
          this.size,
          this.size
        );
      } else {
        // Fallback: beautiful gradient coin
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size / 2);
        gradient.addColorStop(0, 'rgba(255, 222, 153, 1)');
        gradient.addColorStop(0.4, 'rgba(255, 215, 0, 1)');
        gradient.addColorStop(0.8, 'rgba(180, 136, 82, 1)');
        gradient.addColorStop(1, 'rgba(255, 222, 153, 0.7)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Inner shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.arc(-this.size / 6, -this.size / 6, this.size / 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Particle class for golden particles (bottom to top)
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
      // Coin repulsion - particles get pushed by coins
      coins.forEach(coin => {
        const dx = this.x - coin.x;
        const dy = this.y - coin.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = coin.size + 40; // Repel area around coin

        if (distance < repelRadius && distance > 0) {
          const force = (repelRadius - distance) / repelRadius;
          const angle = Math.atan2(dy, dx);
          const pushStrength = force * 2;

          this.x += Math.cos(angle) * pushStrength;
          this.y += Math.sin(angle) * pushStrength;
        }
      });

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

      // Reset if out of bounds
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

  // Initialize coins and particles
  function init() {
    coins = [];
    particles = [];
    const isMobile = canvas.width < 600;
    const coinCount = isMobile ? 4 : 6; // Less coins

    console.log(`Initializing ${coinCount} coins`);

    // Stagger coin creation for smoother appearance
    for (let i = 0; i < coinCount; i++) {
      const coin = new Coin();
      coin.y = -50 - i * 100; // Spread them out vertically
      coin.life = Math.floor(Math.random() * 100); // Random start life
      coins.push(coin);
    }

    console.log(`${coins.length} coins created`);

    // Initialize golden particles
    const particleCount = Math.min(Math.floor(canvas.width / 8), 60);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    console.log(`${particles.length} particles created`);
  }

  // Animation loop
  function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw golden particles first (background)
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    // Update and draw coins on top
    coins.forEach(coin => {
      coin.update();
      coin.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  // Cleanup
  window.addEventListener('beforeunload', () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
})();
