/* ========================================
   ESQUADRIMEL - SCRIPT.JS
   ======================================== */

/* ========================================
   1. HEADER - Sombra ao rolar
   ======================================== */

const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

/* ========================================
   2. SEÇÕES - Fade In ao entrar na tela
   ======================================== */

// Seleciona todas as seções que terão animação
const seções = document.querySelectorAll(
    '.hero, .about, .excellence, .services, .features, .cta, .company-history, .mission, .services-intro, .services-details, .contact-intro, .contact-service, .contact-whatsapp, .contact-info'
);

// Adiciona a classe .fade-in em todas as seções ao carregar
seções.forEach(seção => {
    seção.classList.add('fade-in');
});

// Observador: detecta quando um elemento entra na tela
const observador = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible'); // Aplica a animação
        }
    });
}, {
    threshold: 0.1 // Dispara quando 10% do elemento está visível
});

// Aplica o observador em cada seção
seções.forEach(seção => {
    observador.observe(seção);
});