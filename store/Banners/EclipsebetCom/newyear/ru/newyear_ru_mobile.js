const canvasBg = document.getElementById("snowBg");
const ctxBg = canvasBg.getContext("2d");

const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");

const banner = document.getElementById("banner");

let bgFlakes = [];
let flakes = [];
let w = 0;
let h = 0;
let started = false;

/* ================= BACKGROUND SNOW ================= */

function initBgSnow() {
  bgFlakes = [];
  for (let i = 0; i < 1300; i++) {
    const sizePercent = 0.0003 + Math.random() * 0.003;
    bgFlakes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      sizePercent,
      speed: 0.1 + Math.random() * 0.9,
      vx: (Math.random() - 0.5) * 1.5,
      sway: Math.random() * 0.02,
      swayOffset: Math.random() * Math.PI * 2,
      opacity: 0.2 + Math.random() * 0.8
    });
  }
}

function animateBgSnow() {
  ctxBg.clearRect(0, 0, w, h);

  bgFlakes.forEach(f => {
    f.y += f.speed;
    f.x += f.vx;
    f.swayOffset += f.sway;

    const swayX = Math.sin(f.swayOffset) * 20;

    if (f.y > h + 10) {
      f.y = -10;
      f.x = Math.random() * w;
    }

    if (f.x > w + 10) f.x = -10;
    if (f.x < -10) f.x = w + 10;

    const size = f.sizePercent * w;

    ctxBg.fillStyle = `rgba(255,255,255,${f.opacity})`;
    ctxBg.beginPath();
    ctxBg.arc(f.x + swayX, f.y, size, 0, Math.PI * 2);
    ctxBg.fill();
  });

  requestAnimationFrame(animateBgSnow);
}

/* ================= IMAGE SNOW ================= */

const snowImages = [
  "https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_7e3a7be561da2792cbe97ecb9a6137de.png",
  "https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_16abee358852435f6eb6249779408c7b.png",
  "https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_bd39aac654774ab099b07850b86ff246.png",
  "https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_2e977933fcba65fc795e1493f2ebf0a7.png",
  "https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_20a36185c1212cd074aba568dd0b0bfc.png",
  "https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_52da718eb7454781e074d033140db195.png",
  "https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_fd3ab39e682734ebab587ee8f8993da5.png",
  "https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_3e35655268027503258c23dcfb7cdd2a.png",
  "https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_e27ea490021915fa75e7842738a397f9.png",
  "https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_87a78509f4f06086cf34ede7db4a5e4c.png",
  "https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_b5e5c6ccfcde7ec1bd2bcb1fcbbd9acd.png",
  "https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_3cc2bd3ee21b2085e419f3658929d0d0.png",
  "https://cmsbetconstruct.com/storage/medias/betsunrise/media_1868048_cd55ae9d1643a2385b209e3ddd33c85f.png"
];

snowImages.forEach(src => {
  const img = new Image();
  img.src = src;
  flakes.push({
    img,
    x: 0,
    y: 0,
    size: 4 + Math.random() * 8,
    speed: 0.4 + Math.random() * 0.8,
    vx: (Math.random() - 0.5) * 0.6,
    rot: Math.random() * Math.PI
  });
});

function animate() {
  ctx.clearRect(0, 0, w, h);

  flakes.forEach(f => {
    if (!f.img.complete) return;

    f.y += f.speed;
    f.x += f.vx;
    f.rot += 0.002;

    if (f.y > h + 30) {
      f.y = -30;
      f.x = Math.random() * w;
    }

    if (f.x > w + 30) f.x = -30;
    if (f.x < -30) f.x = w + 30;

    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate(f.rot);
    ctx.drawImage(f.img, -f.size / 2, -f.size / 2, f.size, f.size);
    ctx.restore();
  });

  requestAnimationFrame(animate);
}

/* ================= RESIZE ================= */

function resize() {
  const rect = banner.getBoundingClientRect();
  w = Math.round(rect.width);
  h = Math.round(rect.height);

  if (!w || !h) return;

  canvas.width = w;
  canvas.height = h;
  canvasBg.width = w;
  canvasBg.height = h;

  initBgSnow();

  flakes.forEach(f => {
    f.x = Math.random() * w;
    f.y = Math.random() * h;
  });
}

window.addEventListener("resize", resize);

/* ================= iOS SAFE INIT ================= */

function waitForStableSize() {
  const rect = banner.getBoundingClientRect();

  if (rect.width > 0 && rect.height > 0) {
    if (!started) {
      started = true;
      resize();
      animateBgSnow();
      animate();
    }
  }

  requestAnimationFrame(waitForStableSize);
}

waitForStableSize();

/* ================= iOS VIEWPORT FIX ================= */

if (window.visualViewport) {
  visualViewport.addEventListener("resize", resize);
}
