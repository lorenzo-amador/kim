// ══════════════════════════════════════════
//  VARIABLES GLOBALES
// ══════════════════════════════════════════
const TOTAL_PAGES = 13;
let currentPage = 1;
let isTurning = false;

// ══════════════════════════════════════════
//  CORAZONES FLOTANTES EN LA PORTADA
// ══════════════════════════════════════════
function createHearts() {
  const container = document.getElementById('hearts');
  const symbols = ['🤍', '✦', '·', '♡'];

  for (let i = 0; i < 18; i++) {
    const heart = document.createElement('span');
    heart.classList.add('heart-particle');
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const left     = Math.random() * 100;
    const duration = 6 + Math.random() * 10;
    const delay    = Math.random() * 8;
    const size     = 0.7 + Math.random() * 1.2;

    heart.style.cssText = `
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      font-size: ${size}rem;
    `;

    container.appendChild(heart);
  }
}

// ══════════════════════════════════════════
//  ABRIR EL LIBRO
// ══════════════════════════════════════════
function openBook() {
  const cover   = document.getElementById('cover');
  const wrapper = document.getElementById('book-wrapper');
  const navArea = document.getElementById('nav-area');

  cover.style.opacity    = '0';
  cover.style.pointerEvents = 'none';

  setTimeout(() => {
    cover.style.display  = 'none';
    wrapper.style.display = 'flex';
    navArea.style.display = 'flex';
    updateUI();
  }, 800);
}

// ══════════════════════════════════════════
//  CAMBIAR PÁGINA
// ══════════════════════════════════════════
function changePage(direction) {
  const newPage = currentPage + direction;

  if (isTurning) return;
  if (newPage < 1 || newPage > TOTAL_PAGES) return;

  const current = document.getElementById(`p${currentPage}`);
  const next = document.getElementById(`p${newPage}`);
  if (!current || !next) return;

  isTurning = true;

  // Cambio instantáneo sin animaciones
  current.classList.remove('active', 'turn-out-next', 'turn-out-prev', 'turn-in-next', 'turn-in-prev');
  next.classList.remove('turn-out-next', 'turn-out-prev', 'turn-in-next', 'turn-in-prev');
  next.classList.add('active');
  next.scrollTop = 0;

  currentPage = newPage;
  updateUI();
  isTurning = false;
}

// ══════════════════════════════════════════
//  ACTUALIZAR BARRA, CONTADOR Y BOTONES
// ══════════════════════════════════════════
function updateUI() {
  // Barra de progreso
  const percent = (currentPage / TOTAL_PAGES) * 100;
  document.getElementById('progress-bar').style.width = `${percent}%`;

  // Contador de páginas
  document.getElementById('page-counter').textContent =
    `${String(currentPage).padStart(2, '0')} / ${String(TOTAL_PAGES).padStart(2, '0')}`;

  // Botones prev / next
  document.getElementById('btn-prev').disabled = currentPage === 1;
  document.getElementById('btn-next').disabled = currentPage === TOTAL_PAGES;
}

// ══════════════════════════════════════════
//  BOTÓN "NO" — SE ESCAPA
// ══════════════════════════════════════════
function moveNoBtn() {
  const btn    = document.getElementById('btn-no');
  const page   = document.getElementById('p13');
  const rect   = page.getBoundingClientRect();

  const maxX = rect.width  - 80;
  const maxY = rect.height - 50;

  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  btn.style.position  = 'absolute';
  btn.style.left      = `${randomX}px`;
  btn.style.top       = `${randomY}px`;
  btn.style.transition = 'left 0.2s ease, top 0.2s ease';
}

// ══════════════════════════════════════════
//  PANTALLA DE SÍ
// ══════════════════════════════════════════
function showYes() {
  const yesScreen = document.getElementById('yes-screen');
  const navArea   = document.getElementById('nav-area');
  const counter   = document.getElementById('page-counter');
  const progress  = document.getElementById('progress-bar');

  // Ocultar navegación
  navArea.style.display  = 'none';
  counter.style.display  = 'none';
  progress.style.display = 'none';

  // Mostrar pantalla
  yesScreen.style.display = 'flex';

  // Lanzar confetti de corazones
  launchConfetti();
}

// ══════════════════════════════════════════
//  CONFETTI DE CORAZONES AL DECIR SÍ
// ══════════════════════════════════════════
function launchConfetti() {
  const symbols = ['🤍', '✨', '🌸', '✦', '💫'];
  const body    = document.body;

  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

      const size     = 1 + Math.random() * 1.5;
      const left     = Math.random() * 100;
      const duration = 3 + Math.random() * 4;

      el.style.cssText = `
        position: fixed;
        top: -30px;
        left: ${left}vw;
        font-size: ${size}rem;
        animation: floatDown ${duration}s ease forwards;
        pointer-events: none;
        z-index: 300;
      `;

      body.appendChild(el);

      // Limpiar después de la animación
      setTimeout(() => el.remove(), duration * 1000);

    }, i * 80);
  }

  // Agregar keyframe floatDown si no existe
  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
      @keyframes floatDown {
        0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
        100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ══════════════════════════════════════════
//  NAVEGACIÓN CON TECLADO
// ══════════════════════════════════════════
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') changePage(1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   changePage(-1);
});

// ══════════════════════════════════════════
//  NAVEGACIÓN CON SWIPE (MÓVIL)
// ══════════════════════════════════════════
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
  const deltaX = touchStartX - e.changedTouches[0].clientX;
  const deltaY = touchStartY - e.changedTouches[0].clientY;

  // Solo swipe horizontal
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
    if (deltaX > 0) changePage(1);
    else            changePage(-1);
  }
});

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  createHearts();
});