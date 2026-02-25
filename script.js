/* ========================================
   ESQUADRIMEL - SCRIPT.JS
   ======================================== */

/* ========================================
   1. HEADER - Sombra ao rolar
   ======================================== */
const header = document.querySelector('.header');

if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ========================================
   2. SEÇÕES - Fade In ao entrar na tela
   ======================================== */

// Seleciona todas as seções que terão animação
const secoes = document.querySelectorAll(
    '.hero, .about, .excellence, .services, .features, .cta, .company-history, .mission, .services-intro, .services-details, .contact-intro, .contact-service, .contact-whatsapp, .contact-info, .contact-form-section, .gallery-intro, .gallery-main, .gallery-filter'
);

// Adiciona a classe .fade-in em todas as seções ao carregar
secoes.forEach(secao => {
    secao.classList.add('fade-in');
});

// Observador: detecta quando um elemento entra na tela
const observador = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

// Aplica o observador em cada seção
secoes.forEach(secao => {
    observador.observe(secao);
});

/* ========================================
   3. GALERIA - Filtro por categoria
   ======================================== */
const filterBtns = document.querySelectorAll('.gallery-filter-btn');
const galleryCategories = document.querySelectorAll('.gallery-category');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Atualiza botão ativo
            filterBtns.forEach(b => b.classList.remove('gallery-filter-btn--active'));
            btn.classList.add('gallery-filter-btn--active');

            const categoria = btn.getAttribute('data-category');

            // Mostra ou esconde categorias
            galleryCategories.forEach(cat => {
                if (categoria === 'all' || cat.id === categoria) {
                    cat.style.display = 'block';
                    cat.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    cat.style.display = 'none';
                }
            });
        });
    });
}