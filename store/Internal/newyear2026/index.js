const canvasBack = document.getElementById("snowBack");
const ctxBack = canvasBack.getContext("2d");
const banner = document.getElementById("banner");
let backFlakes = [];

// Фоновый снег (за контентом)
function initBackSnow() {
  const w = canvasBack.width;
  const h = canvasBack.height;

  // На мобилках снег чуть крупнее
  const isMobile = w < 768;
  const sizeMultiplier = isMobile ? 1.5 : 1;

  backFlakes = [];
  for (let i = 0; i < 80; i++) {
    const sizePercent = (0.0005 + Math.random() * 0.002) * sizeMultiplier;

    backFlakes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      sizePercent: sizePercent,
      speed: 0.3 + Math.random() * 0.7,
      vx: (Math.random() - 0.5) * 1.5,
      sway: Math.random() * 0.02,
      swayOffset: Math.random() * Math.PI * 2,
      opacity: 0.2 + Math.random() * 0.5
    });
  }
}

function animateBackSnow() {
  const w = canvasBack.width;
  const h = canvasBack.height;

  ctxBack.clearRect(0, 0, w, h);

  backFlakes.forEach(f => {
    f.y += f.speed;
    f.x += f.vx;

    f.swayOffset += f.sway;
    const swayX = Math.sin(f.swayOffset) * 20;

    if (f.y > h + 10) {
      f.y = -10;
      f.x = Math.random() * w;
    }

    if (f.x > w + 10) {
      f.x = -10;
    } else if (f.x < -10) {
      f.x = w + 10;
    }

    const size = f.sizePercent * w;

    ctxBack.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
    ctxBack.beginPath();
    ctxBack.arc(f.x + swayX, f.y, size, 0, Math.PI * 2);
    ctxBack.fill();
  });

  requestAnimationFrame(animateBackSnow);
}

function resize() {
  canvasBack.width = banner.offsetWidth;
  canvasBack.height = banner.offsetHeight;
  initBackSnow();
}
window.addEventListener("resize", resize);

// Firework - взрывается ВНУТРИ карточки
function createFirework() {
  const container = document.querySelector('.fireworks');
  const card = document.querySelector('.card');
  const cardWidth = card.offsetWidth;
  const cardHeight = card.offsetHeight;

  const x = Math.random() * cardWidth;
  const y = 100 + Math.random() * (cardHeight * 0.5);
  const hue = Math.random() * 60 + 30; // Золотистые оттенки

  const particleCount = 25;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = 60 + Math.random() * 30;

    particle.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: hsl(${hue}, 100%, 60%);
      box-shadow: 0 0 8px hsl(${hue}, 100%, 60%);
      pointer-events: none;
    `;

    particle.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
    particle.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');

    particle.style.animation = 'explode 1.2s ease-out forwards';

    container.appendChild(particle);
    setTimeout(() => particle.remove(), 1200);
  }
}

// CSS для фейерверков
const style = document.createElement('style');
style.textContent = `
  @keyframes explode {
    0% {
      transform: translate(0, 0);
      opacity: 1;
    }
    100% {
      transform: translate(var(--tx), var(--ty));
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Запуск всего
let started = false;

function waitForBannerSize() {
  const bw = banner.offsetWidth;
  const bh = banner.offsetHeight;

  if (bw > 0 && bh > 0) {
    if (started) return;
    started = true;

    resize();
    animateBackSnow();

    // Запускаем фейерверки каждые 2.5-4 секунды
    function launchRandomFirework() {
      createFirework();
      const nextDelay = 2500 + Math.random() * 1500;
      setTimeout(launchRandomFirework, nextDelay);
    }

    setTimeout(launchRandomFirework, 1000);
  } else {
    requestAnimationFrame(waitForBannerSize);
  }
}

waitForBannerSize();
