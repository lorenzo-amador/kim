// ============================================
//        DIARIO DE AMOR - JAVASCRIPT
// ============================================

// ===== VARIABLES GLOBALES =====
let currentPage = 1;
const totalPages = 8;
let musicPlaying = false;
let heartsInterval;
let confettiTimeout;

// ===== ELEMENTOS DEL DOM =====
const introScreen     = document.getElementById('intro-screen');
const mainTitle       = document.getElementById('mainTitle');
const bookWrapper     = document.getElementById('bookWrapper');
const bookCover       = document.getElementById('bookCover');
const bookPages       = document.getElementById('bookPages');
const navigation      = document.getElementById('navigation');
const backCoverBtn    = document.getElementById('backCoverBtn');
const prevBtn         = document.getElementById('prevBtn');
const nextBtn         = document.getElementById('nextBtn');
const pageIndicator   = document.getElementById('pageIndicator');
const pageDots        = document.getElementById('pageDots');
const musicBtn        = document.getElementById('musicBtn');
const musicTooltip    = document.getElementById('musicTooltip');
const bgMusic         = document.getElementById('bgMusic');
const heartsContainer = document.getElementById('heartsContainer');
const coverDate       = document.getElementById('coverDate');

// ============================================
//         INICIALIZACIÓN
// ============================================
window.addEventListener('load', () => {
    setCurrentDate();
    createStars();
    createHearts();
    createPageDots();
    showMusicTooltip();
});

// Exponer funciones globales para onclick en HTML
window.openDiary = openDiary;
window.openBook = openBook;
window.closeBook = closeBook;
window.changePage = changePage;
window.goToPage = goToPage;
window.toggleMusic = toggleMusic;

// ===== FECHA ACTUAL EN PORTADA =====
function setCurrentDate() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const dateStr = now.toLocaleDateString('es-ES', options);
    if (coverDate) {
        coverDate.textContent = dateStr;
    }
}

// ============================================
//         ESTRELLAS EN INTRO
// ============================================
function createStars() {
    const starsContainer = document.getElementById('introStars');
    if (!starsContainer) return;

    for (let i = 0; i < 80; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        const size = Math.random() * 3 + 1;
        star.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-duration: ${Math.random() * 3 + 2}s;
            animation-delay: ${Math.random() * 3}s;
        `;
        starsContainer.appendChild(star);
    }
}

// ============================================
//         CORAZONES FLOTANTES
// ============================================
function createHearts() {
    const emojis = ['💕', '🌷', '💖', '💗', '💓', '💝', '🌹'];

    heartsInterval = setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart-particle');
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        heart.style.cssText = `
            left: ${Math.random() * 100}%;
            font-size: ${Math.random() * 15 + 12}px;
            animation-duration: ${Math.random() * 6 + 6}s;
            animation-delay: ${Math.random() * 2}s;
        `;

        heartsContainer.appendChild(heart);

        // Eliminar después de la animación
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 14000);

    }, 600);
}

// ============================================
//         PUNTOS DE NAVEGACIÓN
// ============================================
function createPageDots() {
    pageDots.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 1) dot.classList.add('active');
        dot.setAttribute('data-page', i);
        dot.addEventListener('click', () => goToPage(i));
        dot.title = `Página ${i}`;
        pageDots.appendChild(dot);
    }
}

function updateDots() {
    const dots = pageDots.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index + 1 === currentPage);
    });
}

// ============================================
//         ABRIR DIARIO (INTRO → LIBRO)
// ============================================
function openDiary() {
    // Ocultar intro
    introScreen.classList.add('hidden');

    setTimeout(() => {
        introScreen.style.display = 'none';

        // Mostrar elementos principales
        mainTitle.style.display = 'block';
        bookWrapper.style.display = 'block';

        // Animación de entrada
        mainTitle.style.animation = 'bookEntrance 1s ease forwards';
        bookWrapper.style.animation = 'bookEntrance 1s ease 0.3s forwards';
        bookWrapper.style.opacity = '0';

        setTimeout(() => {
            bookWrapper.style.opacity = '1';
        }, 300);

    }, 1500);
}

// ============================================
//         ABRIR LIBRO (PORTADA → PÁGINAS)
// ============================================
function openBook() {
    // Ocultar portada
    bookCover.style.transition = 'all 0.6s ease';
    bookCover.style.opacity = '0';
    bookCover.style.transform = 'rotateY(-90deg)';

    setTimeout(() => {
        bookCover.style.display = 'none';

        // Mostrar páginas
        bookPages.classList.add('active');
        navigation.style.display = 'flex';
        backCoverBtn.style.display = 'inline-block';

        // Ir a página 1
        currentPage = 1;
        showPage(currentPage);
        updateNavigation();
        updateDots();

        // Lanzar confetti
        launchConfetti();

    }, 600);
}

// ============================================
//         CERRAR LIBRO (PÁGINAS → PORTADA)
// ============================================
function closeBook() {
    // Ocultar páginas y navegación
    bookPages.classList.remove('active');
    navigation.style.display = 'none';
    backCoverBtn.style.display = 'none';

    // Mostrar portada
    bookCover.style.display = 'flex';
    bookCover.style.opacity = '0';
    bookCover.style.transform = 'rotateY(-90deg)';

    setTimeout(() => {
        bookCover.style.transition = 'all 0.6s ease';
        bookCover.style.opacity = '1';
        bookCover.style.transform = 'rotateY(0deg)';
    }, 100);

    // Reset página
    currentPage = 1;
}

// ============================================
//         MOSTRAR PÁGINA (CONTINUACIÓN)
// ============================================
function showPage(pageNum) {
    // Ocultar todas las páginas
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => {
        page.classList.remove('active');
    });

    // Mostrar página actual
    const targetPage = document.getElementById(`page-${pageNum}`);
    if (targetPage) {
        targetPage.classList.add('active');
        // Scroll al inicio del contenido
        const content = targetPage.querySelector('.page-content');
        if (content) {
            content.scrollTop = 0;
        }
    }
}

// ============================================
//         CAMBIAR PÁGINA
// ============================================
function changePage(direction) {
    const newPage = currentPage + direction;

    if (newPage < 1 || newPage > totalPages) return;

    // Animación de salida
    const currentPageEl = document.getElementById(`page-${currentPage}`);
    if (currentPageEl) {
        currentPageEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        currentPageEl.style.opacity = '0';
        currentPageEl.style.transform = direction > 0
            ? 'translateX(-30px)'
            : 'translateX(30px)';
    }

    setTimeout(() => {
        currentPage = newPage;
        showPage(currentPage);
        updateNavigation();
        updateDots();

        // Animación de entrada
        const newPageEl = document.getElementById(`page-${currentPage}`);
        if (newPageEl) {
            newPageEl.style.opacity = '0';
            newPageEl.style.transform = direction > 0
                ? 'translateX(30px)'
                : 'translateX(-30px)';

            setTimeout(() => {
                newPageEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                newPageEl.style.opacity = '1';
                newPageEl.style.transform = 'translateX(0)';
            }, 50);
        }

        // Efecto especial en última página
        if (currentPage === totalPages) {
            launchConfetti();
        }

    }, 300);
}

// ============================================
//         IR A PÁGINA ESPECÍFICA
// ============================================
function goToPage(pageNum) {
    if (pageNum === currentPage) return;

    const direction = pageNum > currentPage ? 1 : -1;

    const currentPageEl = document.getElementById(`page-${currentPage}`);
    if (currentPageEl) {
        currentPageEl.style.transition = 'opacity 0.3s ease';
        currentPageEl.style.opacity = '0';
    }

    setTimeout(() => {
        currentPage = pageNum;
        showPage(currentPage);
        updateNavigation();
        updateDots();

        const newPageEl = document.getElementById(`page-${currentPage}`);
        if (newPageEl) {
            newPageEl.style.opacity = '0';
            newPageEl.style.transition = 'opacity 0.4s ease';
            setTimeout(() => {
                newPageEl.style.opacity = '1';
            }, 50);
        }

        if (currentPage === totalPages) {
            launchConfetti();
        }

    }, 300);
}

// ============================================
//         ACTUALIZAR NAVEGACIÓN
// ============================================
function updateNavigation() {
    // Botones anterior/siguiente
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    // Indicador de página
    pageIndicator.textContent = `Página ${currentPage} de ${totalPages}`;

    // Cambiar texto del botón en última página
    if (currentPage === totalPages) {
        nextBtn.textContent = '¡El Fin! 💝';
        nextBtn.disabled = true;
    } else {
        nextBtn.innerHTML = 'Siguiente ▶';
    }

    if (currentPage === 1) {
        prevBtn.innerHTML = '◀ Anterior';
        prevBtn.disabled = true;
    } else {
        prevBtn.innerHTML = '◀ Anterior';
    }
}

// ============================================
//         CONFETTI
// ============================================
function launchConfetti() {
    const colors = [
        '#f8b4c8', '#e91e8c', '#c0392b',
        '#DAA520', '#ff6b6b', '#ffd700',
        '#ff69b4', '#ff1493', '#dc143c'
    ];

    const shapes = ['●', '■', '▲', '★', '♥'];

    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti-piece');

            const color = colors[Math.floor(Math.random() * colors.length)];
            const size  = Math.random() * 10 + 6;
            const left  = Math.random() * 100;
            const duration = Math.random() * 2 + 2;
            const delay = Math.random() * 1;

            confetti.style.cssText = `
                left: ${left}%;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                transform: rotate(${Math.random() * 360}deg);
            `;

            document.body.appendChild(confetti);

            // Eliminar después de la animación
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, (duration + delay) * 1000 + 500);

        }, i * 40);
    }
}

// ============================================
//         MÚSICA
// ============================================
function toggleMusic() {
    if (musicPlaying) {
        bgMusic.pause();
        musicBtn.textContent = '🎵';
        musicBtn.style.background = 'linear-gradient(135deg, #c0392b, #e91e8c)';
        musicPlaying = false;
        showTooltipMessage('Música pausada 🎵');
    } else {
        bgMusic.volume = 0.4;
        bgMusic.play().then(() => {
            musicBtn.textContent = '🎶';
            musicBtn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
            musicPlaying = true;
            showTooltipMessage('¡Música activada! 🎶');
        }).catch(() => {
            showTooltipMessage('Toca para activar música 🎵');
        });
    }
}

function showMusicTooltip() {
    setTimeout(() => {
        musicTooltip.classList.add('show');
        setTimeout(() => {
            musicTooltip.classList.remove('show');
        }, 3000);
    }, 3000);
}

function showTooltipMessage(message) {
    musicTooltip.textContent = message;
    musicTooltip.classList.add('show');
    setTimeout(() => {
        musicTooltip.classList.remove('show');
        setTimeout(() => {
            musicTooltip.textContent = '¡Activa el sonido! 🎵';
        }, 500);
    }, 2500);
}

// ============================================
//         TECLADO - NAVEGACIÓN
// ============================================
document.addEventListener('keydown', (e) => {
    // Solo si el libro está abierto
    if (!bookPages.classList.contains('active')) return;

    switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
            if (currentPage < totalPages) {
                changePage(1);
            }
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
            if (currentPage > 1) {
                changePage(-1);
            }
            break;
        case 'Home':
            goToPage(1);
            break;
        case 'End':
            goToPage(totalPages);
            break;
        case 'Escape':
            closeBook();
            break;
    }
});

// ============================================
//         SWIPE TÁCTIL - MÓVILES
// ============================================
let touchStartX = 0;
let touchStartY = 0;
let touchEndX   = 0;
let touchEndY   = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    if (!bookPages.classList.contains('active')) return;

    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - touchEndY);

    // Solo swipe horizontal
    if (Math.abs(diffX) < 50 || diffY > 100) return;

    if (diffX > 0) {
        // Swipe izquierda → página siguiente
        if (currentPage < totalPages) changePage(1);
    } else {
        // Swipe derecha → página anterior
        if (currentPage > 1) changePage(-1);
    }
}

// ============================================
//         EFECTO HOVER EN LIBRO
// ============================================
const mainBook = document.getElementById('mainBook');

if (mainBook) {
    mainBook.addEventListener('mousemove', (e) => {
        const rect = mainBook.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const rotateY = ((e.clientX - centerX) / rect.width) * 8;
        const rotateX = ((e.clientY - centerY) / rect.height) * -5;

        mainBook.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });

    mainBook.addEventListener('mouseleave', () => {
        mainBook.style.transition = 'transform 0.5s ease';
        mainBook.style.transform = 'rotateY(0deg) rotateX(0deg)';
        setTimeout(() => {
            mainBook.style.transition = 'transform 0.4s ease';
        }, 500);
    });
}

// ============================================
//         DOBLE CLICK - CORAZÓN ESPECIAL
// ============================================
document.addEventListener('dblclick', (e) => {
    createFloatingHeart(e.clientX, e.clientY);
});

function createFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.textContent = '💖';
    heart.style.cssText = `
        position: fixed;
        left: ${x - 15}px;
        top: ${y - 15}px;
        font-size: 30px;
        pointer-events: none;
        z-index: 9999;
        animation: floatUp 1.5s ease forwards;
        transition: all 0.3s ease;
    `;

    // Agregar animación dinámica
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0%   { opacity: 1; transform: scale(0) translateY(0); }
            30%  { opacity: 1; transform: scale(1.3) translateY(-20px); }
            100% { opacity: 0; transform: scale(0.8) translateY(-100px); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(heart);

    setTimeout(() => {
        if (heart.parentNode) heart.parentNode.removeChild(heart);
        if (style.parentNode) style.parentNode.removeChild(style);
    }, 1500);
}

// ============================================
//         PERSONALIZACIÓN - NOMBRES
// ============================================
// 👇 CAMBIA ESTOS VALORES CON TUS NOMBRES
const CONFIG = {
    miNombre:      'Lorenzo',       // Tu nombre
    suNombre:      'Kimberly',  // Nombre de tu novia
    fechaInicio:   '14 de Febrero',   // Fecha especial
};

// Aplicar personalización al cargar
function applyPersonalization() {
    // Título principal
    const mainTitleH1 = document.querySelector('.main-title h1');
    if (mainTitleH1) {
        mainTitleH1.textContent = `💕 Para ${CONFIG.suNombre} 💕`;
    }

    // Subtítulo
    const mainTitleP = document.querySelector('.main-title p');
    if (mainTitleP) {
        mainTitleP.textContent =
            `De ${CONFIG.miNombre}, con todo su amor`;
    }

    // Título de portada
    const coverTitle = document.querySelector('.cover-title');
    if (coverTitle) {
        coverTitle.innerHTML =
            `Nuestra Historia`;
    }

    // Subtítulo de portada
    const coverSubtitle = document.querySelector('.cover-subtitle');
    if (coverSubtitle) {
        coverSubtitle.textContent =
            `${CONFIG.miNombre} ❤️ ${CONFIG.suNombre}`;
    }

    // Firmas
    const signatures = document.querySelectorAll('.signature-line');
    signatures.forEach(sig => {
        sig.textContent = `${CONFIG.miNombre} 💖`;
    });
}

// ============================================
//         EASTER EGG - CÓDIGO SECRETO
// ============================================
let secretCode = '';
const targetCode = 'amor';

document.addEventListener('keypress', (e) => {
    secretCode += e.key.toLowerCase();
    if (secretCode.length > targetCode.length) {
        secretCode = secretCode.slice(-targetCode.length);
    }
    if (secretCode === targetCode) {
        activateEasterEgg();
        secretCode = '';
    }
});

function activateEasterEgg() {
    // Lluvia masiva de corazones
    for (let i = 0; i < 5; i++) {
        setTimeout(() => launchConfetti(), i * 300);
    }

    // Mensaje especial
    const msg = document.createElement('div');
    msg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #c0392b, #e91e8c);
        color: white;
        padding: 30px 50px;
        border-radius: 20px;
        font-family: 'Dancing Script', cursive;
        font-size: clamp(1.5rem, 3vw, 2.5rem);
        text-align: center;
        z-index: 9999;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        animation: easterEgg 0.5s ease;
        border: 3px solid rgba(218,165,32,0.5);
    `;
        msg.innerHTML = '💖 ¡Te Amo con Todo mi Corazón! 💖<br>' +
                    '<small style="font-size:1rem; opacity:0.9">' +
                    '✨ Encontraste el mensaje secreto ✨</small>';

    // Agregar estilo de animación
    const easterStyle = document.createElement('style');
    easterStyle.textContent = `
        @keyframes easterEgg {
            0%   { transform: translate(-50%, -50%) scale(0) rotate(-10deg); opacity: 0; }
            60%  { transform: translate(-50%, -50%) scale(1.1) rotate(3deg);  opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1)   rotate(0deg);  opacity: 1; }
        }
    `;
    document.head.appendChild(easterStyle);
    document.body.appendChild(msg);

    // Eliminar mensaje después de 4 segundos
    setTimeout(() => {
        msg.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        msg.style.opacity    = '0';
        msg.style.transform  = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            if (msg.parentNode)        msg.parentNode.removeChild(msg);
            if (easterStyle.parentNode) easterStyle.parentNode.removeChild(easterStyle);
        }, 800);
    }, 4000);
}

// ============================================
//         EFECTO PARALLAX EN FONDO
// ============================================
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX / window.innerWidth  - 0.5) * 20;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 20;

    document.body.style.backgroundPosition =
        `${50 + moveX * 0.5}% ${50 + moveY * 0.5}%`;
});

// ============================================
//         VISIBILIDAD DE PÁGINA
// ============================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pausar música si está sonando
        if (musicPlaying) {
            bgMusic.pause();
        }
        // Cambiar título de pestaña
        document.title = '💕 ¡Regrese, mi kim!';
    } else {
        // Reanudar música
        if (musicPlaying) {
            bgMusic.play().catch(() => {});
        }
        // Restaurar título
        document.title = '💕 Nuestra Pequeña Historia';
    }
});

// ============================================
//         ANIMACIÓN DE CORAZÓN EN TÍTULO
// ============================================
function animateTitle() {
    const titleEl = document.querySelector('.main-title h1');
    if (!titleEl) return;

    let isLarge = false;
    setInterval(() => {
        isLarge = !isLarge;
        titleEl.style.transition = 'transform 0.3s ease';
        titleEl.style.transform  = isLarge ? 'scale(1.02)' : 'scale(1)';
    }, 1500);
}

// ============================================
//         CONTADOR DE TIEMPO JUNTOS
// ============================================
function calcularTiempoJuntos() {
    // 👇 CAMBIA ESTA FECHA POR SU ANIVERSARIO
    const fechaInicio = new Date('2024-02-14');
    const ahora       = new Date();
    const diferencia  = ahora - fechaInicio;

    const dias  = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));

    return { dias, horas, mins };
}

function mostrarContador() {
    const { dias, horas, mins } = calcularTiempoJuntos();

    // Buscar elemento del contador si existe
    const contadorEl = document.getElementById('contador-amor');
    if (contadorEl) {
        contadorEl.innerHTML = `
            ⏰ Llevamos <strong>${dias}</strong> días,
            <strong>${horas}</strong> horas y
            <strong>${mins}</strong> minutos juntos 💕
        `;
    }
}

// Actualizar contador cada minuto
setInterval(mostrarContador, 60000);

// ============================================
//         EFECTO NIEVE DE PÉTALOS
// ============================================
function createPetal() {
    const petals  = ['🌸', '🌺', '🌹', '🌷', '💮'];
    const petal   = document.createElement('div');
    petal.textContent = petals[Math.floor(Math.random() * petals.length)];

    const size     = Math.random() * 15 + 10;
    const duration = Math.random() * 5  + 5;
    const startX   = Math.random() * window.innerWidth;

    petal.style.cssText = `
        position: fixed;
        top: -30px;
        left: ${startX}px;
        font-size: ${size}px;
        pointer-events: none;
        z-index: 1;
        opacity: 0.7;
        animation: petalFall ${duration}s linear forwards;
    `;

    // Agregar animación de pétalos
    if (!document.getElementById('petal-style')) {
        const petalStyle    = document.createElement('style');
        petalStyle.id       = 'petal-style';
        petalStyle.textContent = `
            @keyframes petalFall {
                0% {
                    top: -30px;
                    opacity: 0.7;
                    transform: rotate(0deg) translateX(0);
                }
                50% {
                    transform: rotate(180deg) translateX(50px);
                    opacity: 0.5;
                }
                100% {
                    top: 110vh;
                    opacity: 0;
                    transform: rotate(360deg) translateX(-30px);
                }
            }
        `;
        document.head.appendChild(petalStyle);
    }

    document.body.appendChild(petal);

    setTimeout(() => {
        if (petal.parentNode) petal.parentNode.removeChild(petal);
    }, duration * 1000 + 500);
}

// Crear pétalos cada 3 segundos
setInterval(createPetal, 3000);

// ============================================
//         MENSAJE AL CERRAR VENTANA
// ============================================
window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = '💕 ¿Seguro que quieres cerrar nuestro diario de amor?';
    return e.returnValue;
});

// ============================================
//         CLICK DERECHO PERSONALIZADO
// ============================================
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();

    // Eliminar menú anterior si existe
    const oldMenu = document.getElementById('custom-menu');
    if (oldMenu) oldMenu.parentNode.removeChild(oldMenu);

    const menu = document.createElement('div');
    menu.id    = 'custom-menu';
    menu.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        background: linear-gradient(135deg, #2c1810, #4a0f0f);
        border: 1px solid rgba(218,165,32,0.4);
        border-radius: 12px;
        padding: 8px 0;
        z-index: 9999;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        min-width: 200px;
        font-family: 'Dancing Script', cursive;
        animation: menuAppear 0.2s ease;
    `;

    const menuStyle = document.createElement('style');
    menuStyle.textContent = `
        @keyframes menuAppear {
            from { opacity: 0; transform: scale(0.9); }
            to   { opacity: 1; transform: scale(1);   }
        }
        .menu-item {
            padding: 10px 20px;
            color: var(--rosa-suave);
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.2s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .menu-item:hover {
            background: rgba(233,30,140,0.2);
            color: white;
        }
        .menu-divider {
            height: 1px;
            background: rgba(218,165,32,0.2);
            margin: 4px 0;
        }
    `;
    document.head.appendChild(menuStyle);

    const menuItems = [
        { icon: '💖', text: 'Te Amo Mucho',      action: () => launchConfetti() },
        { icon: '🎵', text: 'Música On/Off',      action: () => toggleMusic()   },
        { icon: '📖', text: 'Página Siguiente',   action: () => changePage(1)   },
        { icon: '📕', text: 'Página Anterior',    action: () => changePage(-1)  },
        { icon: '🏠', text: 'Ir a la Portada',    action: () => closeBook()     },
        { icon: '🌸', text: 'Lluvia de Pétalos',  action: () => {
            for (let i = 0; i < 10; i++) {
                setTimeout(() => createPetal(), i * 200);
            }
        }},
    ];

    menuItems.forEach((item, index) => {
        if (index === 2) {
            const divider = document.createElement('div');
            divider.className = 'menu-divider';
            menu.appendChild(divider);
        }

        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `<span>${item.icon}</span><span>${item.text}</span>`;
        menuItem.addEventListener('click', () => {
            item.action();
            if (menu.parentNode) menu.parentNode.removeChild(menu);
        });
        menu.appendChild(menuItem);
    });

    document.body.appendChild(menu);

    // Cerrar menú al hacer click fuera
    setTimeout(() => {
        document.addEventListener('click', function closeMenu() {
            if (menu.parentNode) menu.parentNode.removeChild(menu);
            document.removeEventListener('click', closeMenu);
        });
    }, 100);
});

// ============================================
//         INICIALIZAR TODO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Aplicar personalización
    applyPersonalization();

    // Mostrar contador
    mostrarContador();

    // Animar título
    animateTitle();

    // Primer pétalo
    setTimeout(() => createPetal(), 2000);

    // Log de amor en consola 💕
    console.log('%c 💕 Hecho con Amor 💕 ', `
        background: linear-gradient(135deg, #c0392b, #e91e8c);
        color: white;
        font-size: 20px;
        font-family: cursive;
        padding: 10px 20px;
        border-radius: 10px;
    `);
    console.log('%c ✨ Este diario fue creado especialmente para ti ✨ ', `
        color: #e91e8c;
        font-size: 14px;
        font-family: cursive;
    `);
});

// ============================================
//         RESIZE - RESPONSIVE
// ============================================
window.addEventListener('resize', () => {
    // Recalcular posiciones si es necesario
    const book = document.getElementById('mainBook');
    if (book) {
        book.style.transform = 'none';
    }
});

// ============================================
//    FIN DEL DIARIO DE AMOR 💕
// ============================================