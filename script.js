// ============ Custom Audio Player (Playlist) & Welcome Screen ============

// 1. Paksa web selalu mulai dari paling atas saat di-refresh/dibuka
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// 2. Kunci layar biar nggak bisa di-scroll sebelum kotak kejutan dibuka
document.body.style.overflow = 'hidden';

const musicToggle = document.getElementById('musicToggle');
const welcomeOverlay = document.getElementById('welcomeOverlay');
const openBtn = document.getElementById('openBtn');

// 🎵 DAFTAR LAGU KAMU 🎵
const playlist = [
  "shp.mp3", // Jangan lupa ganti dengan nama file mp3 kamu
];

let currentTrack = 0;
const bgMusic = new Audio(playlist[currentTrack]);
let isPlaying = false;

// Saat satu lagu selesai, otomatis putar lagu berikutnya
bgMusic.addEventListener('ended', () => {
  currentTrack++;
  if (currentTrack >= playlist.length) {
    currentTrack = 0; 
  }
  bgMusic.src = playlist[currentTrack];
  bgMusic.play();
});

// Fungsi untuk tombol pause/play yang di pojok bawah
function toggleMusic() {
  if (isPlaying) {
    bgMusic.pause();
    isPlaying = false;
    musicToggle.classList.remove('playing');
  } else {
    bgMusic.play().then(() => {
      isPlaying = true;
      musicToggle.classList.add('playing');
    });
  }
}

musicToggle.addEventListener('click', toggleMusic);

// FUNGSI TOMBOL BUKA KEJUTAN
openBtn.addEventListener('click', () => {
  // Sembunyikan layar pembuka
  welcomeOverlay.classList.add('hidden');
  
  // Buka kunci scroll biar web bisa digeser ke bawah lagi
  document.body.style.overflow = '';
  
  // Langsung nyalakan lagu
  bgMusic.play().then(() => {
    isPlaying = true;
    musicToggle.classList.add('playing');
  }).catch(err => console.log("Error mainkan lagu:", err));
});

// ============ Hero letter-by-letter reveal (FIXED VERSION) ============
function splitIntoLetters(el) {
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  Array.from(text).forEach(ch => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = (ch === ' ') ? '\u00A0' : ch;
    el.appendChild(span);
  });
}

// Pecah teks nama jadi huruf
document.querySelectorAll('#heroTitle .name').forEach(splitIntoLetters);

function revealHeroSequence() {
  // 1. Kalimat "Happy Birthday, Tami!" muncul huruf demi huruf
  const letters = document.querySelectorAll('#heroTitle .letter');
  
  if (letters.length > 0) {
    letters.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('show');
      }, 100 + i * 65);
    });
  } else {
    // Safety fallback jika huruf gagal di-split
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) heroTitle.style.opacity = '1';
  }

  const totalLettersTime = letters.length > 0 ? (100 + letters.length * 65) : 500;

  // 2. Teks "22 tahun sudah berlalu"
  const heroEyebrow = document.getElementById('heroEyebrow');
  setTimeout(() => {
    if (heroEyebrow) heroEyebrow.classList.add('show');
  }, totalLettersTime + 200);

  // 3. Badge "22 TAHUN" + Efek Confetti
  const badgeReveal = document.getElementById('badgeReveal');
  setTimeout(() => {
    if (badgeReveal) {
      badgeReveal.classList.add('show');
      const rect = badgeReveal.getBoundingClientRect();
      if (typeof burst === 'function') {
        burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
      }
    }
  }, totalLettersTime + 700);

  // 4. Tagline & Scroll hint
  const heroTagline = document.getElementById('heroTagline');
  const heroScrollHint = document.getElementById('heroScrollHint');
  setTimeout(() => {
    if (heroTagline) heroTagline.classList.add('show');
  }, totalLettersTime + 1200);

  setTimeout(() => {
    if (heroScrollHint) heroScrollHint.classList.add('show');
  }, totalLettersTime + 1600);
}

// Jalankan animasi saat tombol Buka Kejutan diklik
openBtn.addEventListener('click', revealHeroSequence);

// ============ Scroll progress bar ============
const revealEls = document.querySelectorAll('[data-reveal]');
revealEls.forEach(el => {
  const delay = el.getAttribute('data-reveal-delay') || 0;
  el.style.setProperty('--rd', delay);
});
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ============ Parallax on hero ============
const hero = document.querySelector('.hero');
addEventListener('scroll', () => {
  if (!hero) return;
  const y = window.scrollY;
  if (y < window.innerHeight) {
    hero.style.transform = `translateY(${y * 0.25}px)`;
    hero.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.9));
  }
}, { passive: true });

// ============ Realistic balloons ============
const balloonPalette = [
  { fill: '#FF4FA3' }, { fill: '#FFD23F' }, { fill: '#3FE8E0' }, { fill: '#FF8A3D' }, { fill: '#B388FF' }
];
const field = document.getElementById('balloonField');
const balloonCount = 16;
for (let i = 0; i < balloonCount; i++) {
  const color = balloonPalette[i % balloonPalette.length];
  const depth = 0.55 + Math.random() * 0.8;      
  const width = Math.round(34 * depth) + 10;
  const height = Math.round(width * 1.25);
  const riseDuration = (16 + Math.random() * 12) / depth;
  const riseDelay = Math.random() * -riseDuration;
  const swayDuration = 2.4 + Math.random() * 2.2;
  const swayDelay = Math.random() * -swayDuration;

  const riseEl = document.createElement('div');
  riseEl.className = 'balloon-rise';
  riseEl.style.left = Math.random() * 100 + 'vw';
  riseEl.style.animationDuration = riseDuration + 's';
  riseEl.style.animationDelay = riseDelay + 's';
  riseEl.style.opacity = (0.55 + depth * 0.35).toFixed(2);
  riseEl.style.filter = depth < 0.9 ? 'blur(1px)' : 'none';
  riseEl.style.zIndex = Math.round(depth * 10);

  const swayEl = document.createElement('div');
  swayEl.className = 'balloon-sway';
  swayEl.style.animationDuration = swayDuration + 's';
  swayEl.style.animationDelay = swayDelay + 's';

  const bodyEl = document.createElement('div');
  bodyEl.className = 'balloon-body';
  bodyEl.style.width = width + 'px';
  bodyEl.style.height = height + 'px';
  bodyEl.style.background = `radial-gradient(circle at 32% 28%, ${lighten(color.fill, 25)}, ${color.fill} 55%, ${darken(color.fill, 15)} 100%)`;
  bodyEl.style.color = darken(color.fill, 20); 

  const stringEl = document.createElement('div');
  stringEl.className = 'balloon-string';
  stringEl.style.height = (40 + Math.random() * 30) + 'px';

  swayEl.appendChild(bodyEl);
  swayEl.appendChild(stringEl);
  riseEl.appendChild(swayEl);
  field.appendChild(riseEl);
}
function lighten(hex, pct) { return shade(hex, pct); }
function darken(hex, pct) { return shade(hex, -pct); }
function shade(hex, pct) {
  const num = parseInt(hex.replace('#', ''), 16);
  let r = (num >> 16) + Math.round(255 * pct / 100);
  let g = ((num >> 8) & 0x00FF) + Math.round(255 * pct / 100);
  let b = (num & 0x0000FF) + Math.round(255 * pct / 100);
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

// ============ Confetti ============
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
resize(); addEventListener('resize', resize);
let particles = [];
const confettiColors = ['#FF4FA3', '#FFD23F', '#3FE8E0', '#FF8A3D', '#FFF6EA'];
function burst(x, y, count = 80) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 7;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: 4 + Math.random() * 5,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rot: Math.random() * Math.PI,
      vrot: (Math.random() - 0.5) * 0.3,
      life: 0
    });
  }
}
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.vy += 0.12;
    p.x += p.vx; p.y += p.vy; p.rot += p.vrot; p.life++;
    ctx.save();
    ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(0, 1 - p.life / 140);
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  });
  particles = particles.filter(p => p.life < 140 && p.y < canvas.height + 50);
  requestAnimationFrame(loop);
}
loop();

// ============ Candles & Unlocking Sections ============
const total = 5;
const candleWrap = document.getElementById('candles');
const statusEl = document.getElementById('cakeStatus');
const messageWrap = document.getElementById('messageWrap');
const factsWrap = document.getElementById('factsWrap'); 
const galleryWrap = document.getElementById('galleryWrap');

let blownOut = 0;
let messageUnlocked = false;

// Observer ini mengawasi messageWrap, factsWrap, dan galleryWrap
const unlockObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && messageUnlocked) {
      entry.target.classList.add('show');
      unlockObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

if (messageWrap) unlockObserver.observe(messageWrap);
if (factsWrap) unlockObserver.observe(factsWrap);
if (galleryWrap) unlockObserver.observe(galleryWrap);

for (let i = 0; i < total; i++) {
  const c = document.createElement('div');
  c.className = 'candle';
  c.innerHTML = '<div class="flame-wrap"><div class="glow"></div><div class="flame"></div></div><div class="smoke"></div>';
  const flameEl = c.querySelector('.flame');
  const glowEl = c.querySelector('.glow');
  const flickerDuration = (0.45 + Math.random() * 0.35).toFixed(2);
  const glowDuration = (0.9 + Math.random() * 0.6).toFixed(2);
  flameEl.style.animationDuration = flickerDuration + 's';
  flameEl.style.animationDelay = (Math.random() * -1).toFixed(2) + 's';
  glowEl.style.animationDuration = glowDuration + 's';
  glowEl.style.animationDelay = (Math.random() * -1).toFixed(2) + 's';
  c.addEventListener('click', () => {
    if (c.classList.contains('out')) return;
    c.classList.add('out');
    blownOut++;
    const rect = c.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top, 30);
    updateStatus();
  });
  candleWrap.appendChild(c);
}

function updateStatus() {
  const remaining = total - blownOut;
  if (remaining > 0) {
    statusEl.textContent = remaining + ' lilin lagi nunggu ditiup...';
  } else {
    statusEl.textContent = 'Yeay! Semua lilin padam, wish granted 🌟';
    const rect = candleWrap.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top, 160);
    messageUnlocked = true;
    
    // Langsung tampilkan section jika sudah ada di layar saat ditiup
    [messageWrap, factsWrap, galleryWrap].forEach(wrap => {
      if (!wrap) return;
      const wrapRect = wrap.getBoundingClientRect();
      if (wrapRect.top < innerHeight * 0.85 && wrapRect.bottom > 0) {
        wrap.classList.add('show');
        unlockObserver.unobserve(wrap);
      }
    });
  }
}

// ============ Fun facts (Kata-kata buat Tami) ============
const facts = [
  "Umur udah 22 ni, pertamo kenal dulu umur masih 11 atau 12 dak teraso kito la setuo ini yoo haha, tetap semangat yooo .",
  "Dulu sempat jalin hubungan yang biso dibilang itu masih cinta monyet yoo wkwk 🙈.",
  "Sekarang kito la samo-samo nginjak 22 tahun, umur yang sudah masuk dalam kategori dewasa, kalo butuh kawan cerito jangan sungkan yoo.",
  "Banyak hal yang kito lah lalui masing-masing, terkhusus kau yang berjalan sendiri dari waktu masih duduk di smk, jujur aku salut samo kau, semoga selalu diberkati yo.",
  "Selamat resmi jadi manusia usia 22 yoo, semoga apo yang kito rencano kan dihari ini bisa terwujud di masa depan yoo, dan semoga harapan kito untuk bisa ketemu dan saling ngobrol itu benar-benar bisa terwujudkan."
];
const grid = document.getElementById('factGrid');
facts.forEach((f, i) => {
  const card = document.createElement('div');
  card.className = 'fact-card';
  card.setAttribute('data-reveal-card', '');
  card.innerHTML = '<div class="num">0' + (i + 1) + '</div><p>' + f + '</p>';
  grid.appendChild(card);
});

// Animasi muncul per kartu
const factObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting && messageUnlocked) {
      setTimeout(() => entry.target.classList.add('in-view'), i * 90);
      factObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.fact-card').forEach(el => factObserver.observe(el));

// ============ Send wish via WhatsApp ============
const wishInput = document.getElementById('wishInput');
const sendWishBtn = document.getElementById('sendWishBtn');
const WHATSAPP_NUMBER = '6289652941814'; // Nomor WA kamu

sendWishBtn.addEventListener('click', () => {
  const text = wishInput.value.trim();
  const finalMessage = text
    ? text
    : 'Halo! Aku baru buka website ulang tahun buat Tami, seru banget 🎉';
  
  // Gunakan whatsapp:// agar langsung memicu app WA (HP/Desktop)
  const appUrl = 'whatsapp://send?phone=' + 6289652941814 + '&text=' + encodeURIComponent(finalMessage);
  
  // Fallback link web jika di laptop/browser belum terinstall WA Desktop
  const webUrl = 'https://api.whatsapp.com/send?6289652941814=' + 6289652941814 + '&text=' + encodeURIComponent(finalMessage);

  // Coba buka langsung ke aplikasinya
  window.location.href = appUrl;

  // Jika dipanggil dari PC yang nggak ada WA Desktop, buka via location biasa
  setTimeout(() => {
    window.location.href = webUrl;
  }, 1000);
});

// ============ Auto Random Tilt untuk Foto Manual ============
const polaroids = document.querySelectorAll('.polaroid');
polaroids.forEach(polaroid => {
  polaroid.style.setProperty('--r', (Math.random() * 8 - 4) + 'deg');
});