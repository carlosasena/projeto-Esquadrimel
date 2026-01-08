// ===== SLIDESHOW - ESQUADRIMEL =====
class SlideshowEsquadrimel {
    constructor() {
        this.slideAtual = 0;
        this.intervaloAuto = null;
        this.estaRodando = true;
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.totalSlides = this.slides.length;
        this.toggleBtn = document.getElementById('toggle-play');
        this.reiniciarBtn = document.getElementById('reiniciar-btn');
        this.prevBtn = document.querySelector('.prev');
        this.nextBtn = document.querySelector('.next');
        
        this.init();
    }
    
    init() {
        // Mostrar primeiro slide
        this.mostrarSlide(0);
        
        // Iniciar autoplay
        this.iniciarAutoPlay();
        
        // Adicionar event listeners
        this.adicionarEventListeners();
        
        // Atualizar contador
        this.atualizarContador();
        
        // Pausar quando aba não estiver visível
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pausar();
            } else {
                this.retomar();
            }
        });
        
        // Pausar ao passar mouse sobre slideshow
        const slideshowSection = document.querySelector('.slideshow-section');
        slideshowSection.addEventListener('mouseenter', () => this.pausar());
        slideshowSection.addEventListener('mouseleave', () => {
            if (this.estaRodando) this.retomar();
        });
    }
    
    mostrarSlide(indice) {
        // Valida índice
        if (indice >= this.totalSlides) {
            this.slideAtual = 0;
        } else if (indice < 0) {
            this.slideAtual = this.totalSlides - 1;
        } else {
            this.slideAtual = indice;
        }
        
        // Remove classe active de todos
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Adiciona classe active ao atual
        this.slides[this.slideAtual].classList.add('active');
        this.dots[this.slideAtual].classList.add('active');
        
        // Atualiza contador
        this.atualizarContador();
    }
    
    mudarSlide(direcao) {
        this.mostrarSlide(this.slideAtual + direcao);
    }
    
    irParaSlide(indice) {
        this.mostrarSlide(indice);
    }
    
    atualizarContador() {
        const numeroAtual = document.getElementById('numero-atual');
        const total = document.getElementById('total');
        
        if (numeroAtual && total) {
            numeroAtual.textContent = this.slideAtual + 1;
            total.textContent = this.totalSlides;
        }
    }
    
    iniciarAutoPlay() {
        this.intervaloAuto = setInterval(() => {
            this.mudarSlide(1);
        }, 4000); // 4 segundos
        
        this.estaRodando = true;
        this.atualizarBotaoPlay();
    }
    
    pausar() {
        clearInterval(this.intervaloAuto);
        this.estaRodando = false;
        this.atualizarBotaoPlay();
    }
    
    retomar() {
        if (!this.estaRodando) {
            this.iniciarAutoPlay();
        }
    }
    
    toggleAutoPlay() {
        if (this.estaRodando) {
            this.pausar();
        } else {
            this.retomar();
        }
    }
    
    atualizarBotaoPlay() {
        if (this.toggleBtn) {
            this.toggleBtn.innerHTML = this.estaRodando ? '⏸ Pausar' : '▶ Play';
        }
    }
    
    reiniciar() {
        this.mostrarSlide(0);
        if (this.estaRodando) {
            this.pausar();
            this.retomar();
        }
    }
    
    adicionarEventListeners() {
        // Botões de navegação
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.mudarSlide(-1));
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.mudarSlide(1));
        }
        
        // Botões de controle
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleAutoPlay());
        }
        
        if (this.reiniciarBtn) {
            this.reiniciarBtn.addEventListener('click', () => this.reiniciar());
        }
        
        // Dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.irParaSlide(index));
        });
        
        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.mudarSlide(-1);
            } else if (e.key === 'ArrowRight') {
                this.mudarSlide(1);
            } else if (e.key === ' ') {
                e.preventDefault();
                this.toggleAutoPlay();
            }
        });
    }
}

// ===== INICIALIZAÇÃO QUANDO O DOM ESTIVER PRONTO =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar slideshow
    const slideshow = new SlideshowEsquadrimel();
    
    // Efeito de scroll suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Adicionar classe de carregamento ao body
    document.body.classList.add('loaded');
    
    // Log para desenvolvimento
    console.log('Esquadrimel - Site carregado com sucesso!');
});

// ===== GALERIA INTERATIVA =====
class GaleriaEsquadrimel {
    constructor() {
        this.galeriaItens = document.querySelectorAll('.galeria-item');
        this.filtroBtns = document.querySelectorAll('.filtro-btn');
        this.modal = null;
        
        this.init();
    }
    
    init() {
        // Inicializar filtros
        this.inicializarFiltros();
        
        // Inicializar modal
        this.criarModal();
        
        // Adicionar event listeners para as imagens
        this.adicionarEventListeners();
        
        // Log para desenvolvimento
        console.log(`Galeria carregada com ${this.galeriaItens.length} itens`);
    }
    
    inicializarFiltros() {
        this.filtroBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remover classe active de todos os botões
                this.filtroBtns.forEach(b => b.classList.remove('active'));
                
                // Adicionar classe active ao botão clicado
                btn.classList.add('active');
                
                // Filtrar galeria
                const categoria = btn.dataset.categoria;
                this.filtrarGaleria(categoria);
            });
        });
    }
    
    filtrarGaleria(categoria) {
        this.galeriaItens.forEach(item => {
            const itemCategoria = item.dataset.categoria;
            
            if (categoria === 'todos' || categoria === itemCategoria) {
                item.style.display = 'block';
                
                // Efeito de fade in
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    criarModal() {
        // Criar estrutura do modal
        this.modal = document.createElement('div');
        this.modal.className = 'modal-galeria';
        this.modal.innerHTML = `
            <div class="modal-conteudo">
                <button class="fechar-modal" aria-label="Fechar">&times;</button>
                <img src="" alt="">
            </div>
        `;
        
        document.body.appendChild(this.modal);
        
        // Event listener para fechar modal
        const fecharBtn = this.modal.querySelector('.fechar-modal');
        fecharBtn.addEventListener('click', () => this.fecharModal());
        
        // Fechar modal ao clicar fora da imagem
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.fecharModal();
            }
        });
        
        // Fechar modal com tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.fecharModal();
            }
        });
    }
    
    abrirModal(imgSrc, imgAlt) {
        const modalImg = this.modal.querySelector('img');
        modalImg.src = imgSrc;
        modalImg.alt = imgAlt;
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Impede scroll do body
    }
    
    fecharModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restaura scroll do body
    }
    
    adicionarEventListeners() {
        this.galeriaItens.forEach(item => {
            const imgContainer = item.querySelector('.galeria-img-container');
            const img = imgContainer.querySelector('img');
            
            // Abrir modal ao clicar na imagem
            imgContainer.addEventListener('click', () => {
                this.abrirModal(img.src, img.alt);
            });
            
            // Permitir abrir modal com Enter (acessibilidade)
            imgContainer.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.abrirModal(img.src, img.alt);
                }
            });
            
            // Tornar a imagem container focável para acessibilidade
            imgContainer.setAttribute('tabindex', '0');
            imgContainer.setAttribute('role', 'button');
            imgContainer.setAttribute('aria-label', `Ampliar imagem: ${img.alt}`);
        });
    }
}

// ===== INICIALIZAÇÃO DA GALERIA =====
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se estamos na página de galeria
    if (document.querySelector('.galeria-grid')) {
        const galeria = new GaleriaEsquadrimel();
        
        // Efeito de carregamento das imagens
        const imagens = document.querySelectorAll('.galeria-img-container img');
        let carregadas = 0;
        const totalImagens = imagens.length;
        
        imagens.forEach(img => {
            if (img.complete) {
                carregadas++;
            } else {
                img.addEventListener('load', () => {
                    carregadas++;
                    if (carregadas === totalImagens) {
                        console.log('Todas as imagens da galeria foram carregadas');
                    }
                });
            }
        });
    }
    
    // Adicionar classe de página ativa ao body
    document.body.classList.add('pagina-galeria');
});

// ===== FORMULÁRIO DE CONTATO - ESQUADRIMEL =====
class FormularioContato {
    constructor() {
        this.form = document.getElementById('formContato');
        this.successMessage = document.getElementById('success-message');
        this.newMessageBtn = document.getElementById('new-message');
        this.modalMapa = document.getElementById('modal-mapa');
        this.abrirMapaBtn = document.getElementById('abrir-mapa');
        this.fecharModalBtns = document.querySelectorAll('.fechar-modal');
        this.faqItems = document.querySelectorAll('.faq-item');
        
        this.init();
    }
    
    init() {
        // Inicializar máscaras de entrada
        this.inicializarMascaras();
        
        // Adicionar event listeners
        this.adicionarEventListeners();
        
        // Inicializar FAQ
        this.inicializarFAQ();
        
        // Log para desenvolvimento
        console.log('Formulário de contato carregado');
    }
    
    inicializarMascaras() {
        // Máscara para telefone
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 10) {
                    value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
                } else if (value.length > 6) {
                    value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
                } else if (value.length > 2) {
                    value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
                } else if (value.length > 0) {
                    value = value.replace(/^(\d{0,2})/, '($1');
                }
                
                e.target.value = value;
            });
        }
    }
    
    adicionarEventListeners() {
        // Envio do formulário
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.enviarFormulario(e));
        }
        
        // Botão de nova mensagem
        if (this.newMessageBtn) {
            this.newMessageBtn.addEventListener('click', () => this.resetFormulario());
        }
        
        // Botão para abrir mapa
        if (this.abrirMapaBtn) {
            this.abrirMapaBtn.addEventListener('click', () => this.abrirModalMapa());
        }
        
        // Botões para fechar modal
        this.fecharModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.fecharModalMapa());
        });
        
        // Fechar modal ao clicar fora
        if (this.modalMapa) {
            this.modalMapa.addEventListener('click', (e) => {
                if (e.target === this.modalMapa) {
                    this.fecharModalMapa();
                }
            });
        }
        
        // Fechar modal com tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalMapa.classList.contains('active')) {
                this.fecharModalMapa();
            }
        });
    }
    
    inicializarFAQ() {
        this.faqItems.forEach(item => {
            const pergunta = item.querySelector('.faq-pergunta');
            const resposta = item.querySelector('.faq-resposta');
            
            pergunta.addEventListener('click', () => {
                // Fechar outras respostas
                this.faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherPergunta = otherItem.querySelector('.faq-pergunta');
                        const otherResposta = otherItem.querySelector('.faq-resposta');
                        otherPergunta.classList.remove('active');
                        otherResposta.classList.remove('active');
                    }
                });
                
                // Alternar estado atual
                pergunta.classList.toggle('active');
                resposta.classList.toggle('active');
            });
        });
    }
    
    validarFormulario() {
        let valido = true;
        this.limparErros();
        
        // Validar nome
        const nome = document.getElementById('nome');
        if (!nome.value.trim()) {
            this.mostrarErro('nome', 'Por favor, informe seu nome');
            valido = false;
        } else if (nome.value.trim().length < 3) {
            this.mostrarErro('nome', 'Nome deve ter pelo menos 3 caracteres');
            valido = false;
        }
        
        // Validar telefone
        const telefone = document.getElementById('telefone');
        const telefoneLimpo = telefone.value.replace(/\D/g, '');
        if (!telefoneLimpo) {
            this.mostrarErro('telefone', 'Por favor, informe seu telefone');
            valido = false;
        } else if (telefoneLimpo.length < 10) {
            this.mostrarErro('telefone', 'Telefone inválido');
            valido = false;
        }
        
        // Validar email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            this.mostrarErro('email', 'Por favor, informe seu e-mail');
            valido = false;
        } else if (!emailRegex.test(email.value.trim())) {
            this.mostrarErro('email', 'E-mail inválido');
            valido = false;
        }
        
        // Validar serviço
        const servico = document.getElementById('servico');
        if (!servico.value) {
            this.mostrarErro('servico', 'Por favor, selecione um serviço');
            valido = false;
        }
        
        // Validar mensagem
        const mensagem = document.getElementById('mensagem');
        if (!mensagem.value.trim()) {
            this.mostrarErro('mensagem', 'Por favor, digite sua mensagem');
            valido = false;
        } else if (mensagem.value.trim().length < 10) {
            this.mostrarErro('mensagem', 'Mensagem muito curta');
            valido = false;
        }
        
        return valido;
    }
    
    mostrarErro(campo, mensagem) {
        const errorElement = document.getElementById(`error-${campo}`);
        if (errorElement) {
            errorElement.textContent = mensagem;
        }
        
        // Adicionar classe de erro ao campo
        const inputElement = document.getElementById(campo);
        if (inputElement) {
            inputElement.style.borderColor = '#dc2626';
        }
    }
    
    limparErros() {
        // Limpar mensagens de erro
        document.querySelectorAll('.form-error').forEach(el => {
            el.textContent = '';
        });
        
        // Resetar bordas dos inputs
        document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
            el.style.borderColor = '';
        });
    }
    
    async enviarFormulario(e) {
        e.preventDefault();
        
        if (!this.validarFormulario()) {
            return;
        }
        
        // Desabilitar botão de envio
        const submitBtn = this.form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Simular envio (substituir por API real)
        try {
            // Coletar dados do formulário
            const formData = new FormData(this.form);
            const dados = Object.fromEntries(formData.entries());
            
            // Aqui você substituiria por uma chamada real à API
            await this.simularEnvioAPI(dados);
            
            // Mostrar mensagem de sucesso
            this.mostrarMensagemSucesso();
            
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            alert('Ocorreu um erro ao enviar sua mensagem. Tente novamente.');
            
            // Reabilitar botão
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    simularEnvioAPI(dados) {
        return new Promise((resolve) => {
            // Simular delay de rede
            setTimeout(() => {
                console.log('Dados do formulário:', dados);
                // Aqui normalmente você enviaria os dados para um servidor
                // Exemplo: fetch('/api/contato', { method: 'POST', body: JSON.stringify(dados) })
                resolve({ success: true });
            }, 1500);
        });
    }
    
    mostrarMensagemSucesso() {
        // Esconder formulário
        this.form.style.display = 'none';
        
        // Mostrar mensagem de sucesso
        this.successMessage.classList.add('active');
        
        // Rolagem suave para a mensagem
        this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    resetFormulario() {
        // Resetar formulário
        this.form.reset();
        this.limparErros();
        
        // Mostrar formulário novamente
        this.form.style.display = 'block';
        
        // Esconder mensagem de sucesso
        this.successMessage.classList.remove('active');
        
        // Foco no primeiro campo
        document.getElementById('nome').focus();
    }
    
    abrirModalMapa() {
        if (this.modalMapa) {
            this.modalMapa.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    fecharModalMapa() {
        if (this.modalMapa) {
            this.modalMapa.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
}

// ===== INICIALIZAÇÃO DA PÁGINA CONTATO =====
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se estamos na página de contato
    if (document.getElementById('formContato')) {
        const formularioContato = new FormularioContato();
    }
    
    // Adicionar classe de página ativa ao body
    document.body.classList.add('pagina-contato');
    
    // Configurações adicionais para WhatsApp
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        // Adicionar target _blank se não tiver
        if (!link.target) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
    });
});

// ===== SISTEMA DE ADMINISTRAÇÃO - ESQUADRIMEL =====
class SistemaAdministracao {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.loginForm = document.getElementById('loginForm');
        this.loginContainer = document.getElementById('loginContainer');
        this.adminContent = document.getElementById('adminContent');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabPanes = document.querySelectorAll('.tab-pane');
        this.addImageBtn = document.getElementById('addImageBtn');
        this.imageModal = document.getElementById('imageModal');
        this.confirmModal = document.getElementById('confirmModal');
        
        this.init();
    }
    
    init() {
        // Verificar se usuário está logado (simulação)
        this.verificarLogin();
        
        // Adicionar event listeners
        this.adicionarEventListeners();
        
        // Inicializar componentes
        this.inicializarComponentes();
        
        // Log para desenvolvimento
        console.log('Sistema administrativo carregado');
    }
    
    verificarLogin() {
        // Verificar no localStorage (simulação)
        const loggedIn = localStorage.getItem('esquadrimel_admin_loggedin');
        const userData = localStorage.getItem('esquadrimel_admin_user');
        
        if (loggedIn === 'true' && userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.isLoggedIn = true;
                this.mostrarPainelAdmin();
            } catch (e) {
                console.error('Erro ao ler dados do usuário:', e);
                this.fazerLogout();
            }
        }
    }
    
    mostrarPainelAdmin() {
        document.body.classList.add('admin-logged-in');
        
        // Atualizar nome do admin
        const adminName = document.getElementById('adminName');
        if (adminName && this.currentUser) {
            adminName.textContent = this.currentUser.nome;
        }
        
        // Atualizar estatísticas
        this.atualizarEstatisticas();
        
        // Atualizar último acesso
        this.atualizarUltimoAcesso();
        
        // Carregar galeria
        this.carregarGaleria();
    }
    
    atualizarEstatisticas() {
        // Simular dados de estatísticas
        const totalImages = Math.floor(Math.random() * 50) + 20;
        const totalMessages = Math.floor(Math.random() * 30) + 5;
        
        document.getElementById('totalImages').textContent = totalImages;
        document.getElementById('totalMessages').textContent = totalMessages;
    }
    
    atualizarUltimoAcesso() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR');
        const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        document.getElementById('lastAccess').textContent = dateStr;
        document.getElementById('lastAccessTime').textContent = timeStr;
    }
    
    adicionarEventListeners() {
        // Login
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.fazerLogin(e));
        }
        
        // Logout
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.fazerLogout());
        }
        
        // Toggle password visibility
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
        }
        
        // Tabs
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.mudarTab(btn.dataset.tab));
        });
        
        // Modal de imagem
        if (this.addImageBtn) {
            this.addImageBtn.addEventListener('click', () => this.abrirModalImagem());
        }
        
        // Fechar modais
        document.querySelectorAll('.fechar-modal').forEach(btn => {
            btn.addEventListener('click', (e) => this.fecharModal(e.target.closest('.modal')));
        });
        
        // Upload de imagem
        const imageFile = document.getElementById('imageFile');
        if (imageFile) {
            imageFile.addEventListener('change', (e) => this.previewImage(e));
        }
        
        // Formulário de imagem
        const imageForm = document.getElementById('imageForm');
        if (imageForm) {
            imageForm.addEventListener('submit', (e) => this.salvarImagem(e));
        }
        
        // Filtros de galeria
        const searchImages = document.getElementById('searchImages');
        if (searchImages) {
            searchImages.addEventListener('input', () => this.filtrarImagens());
        }
        
        const filterCategory = document.getElementById('filterCategory');
        if (filterCategory) {
            filterCategory.addEventListener('change', () => this.filtrarImagens());
        }
        
        // Filtros de mensagens
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filtrarMensagens(e.target.dataset.filter));
        });
        
        // Botões de edição de conteúdo
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => this.editarConteudo(e.target.dataset.section));
        });
        
        // Botões de configurações
        document.querySelectorAll('.btn-setting').forEach(btn => {
            btn.addEventListener('click', (e) => this.abrirConfiguracao(e.target.dataset.setting));
        });
    }
    
    inicializarComponentes() {
        // Inicializar data e hora
        this.atualizarDataHora();
        setInterval(() => this.atualizarDataHora(), 60000); // Atualizar a cada minuto
    }
    
    atualizarDataHora() {
        // Atualizar data e hora no sistema
        const now = new Date();
        console.log('Sistema atualizado em:', now.toLocaleString('pt-BR'));
    }
    
    async fazerLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        const errorDiv = document.getElementById('loginError');
        
        // Limpar erro anterior
        errorDiv.textContent = '';
        
        // Validação básica
        if (!username || !password) {
            errorDiv.textContent = 'Por favor, preencha todos os campos';
            return;
        }
        
        // Desabilitar botão de login
        const submitBtn = this.loginForm.querySelector('.btn-login');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
        submitBtn.disabled = true;
        
        try {
            // Simular verificação de credenciais
            await this.verificarCredenciais(username, password);
            
            // Salvar dados do usuário
            this.currentUser = {
                nome: 'Administrador',
                username: username,
                loginTime: new Date().toISOString()
            };
            
            this.isLoggedIn = true;
            
            // Salvar no localStorage
            localStorage.setItem('esquadrimel_admin_loggedin', 'true');
            localStorage.setItem('esquadrimel_admin_user', JSON.stringify(this.currentUser));
            
            if (remember) {
                // Salvar preferência de "lembrar-me"
                localStorage.setItem('esquadrimel_admin_remember', 'true');
            }
            
            // Mostrar painel admin
            this.mostrarPainelAdmin();
            
            // Registrar atividade
            this.registrarAtividade('Login realizado com sucesso');
            
        } catch (error) {
            errorDiv.textContent = error.message;
            
            // Reabilitar botão
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    verificarCredenciais(username, password) {
        return new Promise((resolve, reject) => {
            // Simular delay de rede
            setTimeout(() => {
                // Credenciais de demonstração (substituir por verificação real)
                const validUsers = [
                    { username: 'admin', password: 'admin123' },
                    { username: 'esquadrimel', password: 'aluminio2025' }
                ];
                
                const isValid = validUsers.some(user => 
                    user.username === username && user.password === password
                );
                
                if (isValid) {
                    resolve();
                } else {
                    reject(new Error('Usuário ou senha incorretos'));
                }
            }, 1000);
        });
    }
    
    fazerLogout() {
        // Confirmar logout
        if (!confirm('Tem certeza que deseja sair?')) {
            return;
        }
        
        // Limpar dados de sessão
        localStorage.removeItem('esquadrimel_admin_loggedin');
        localStorage.removeItem('esquadrimel_admin_user');
        
        this.isLoggedIn = false;
        this.currentUser = null;
        
        // Esconder painel admin
        document.body.classList.remove('admin-logged-in');
        
        // Resetar formulário de login
        if (this.loginForm) {
            this.loginForm.reset();
        }
        
        // Registrar atividade
        this.registrarAtividade('Logout realizado');
        
        // Mostrar mensagem de confirmação
        alert('Logout realizado com sucesso');
    }
    
    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('togglePassword');
        const icon = toggleBtn.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
            toggleBtn.title = 'Ocultar senha';
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
            toggleBtn.title = 'Mostrar senha';
        }
    }
    
    mudarTab(tabId) {
        // Atualizar botões das tabs
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        
        // Atualizar conteúdo das tabs
        this.tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === `tab-${tabId}`);
        });
        
        // Carregar conteúdo específico da tab
        switch(tabId) {
            case 'galeria':
                this.carregarGaleria();
                break;
            case 'mensagens':
                this.carregarMensagens();
                break;
            case 'conteudo':
                this.carregarConteudo();
                break;
        }
    }
    
    carregarGaleria() {
        // Simular carregamento de imagens
        const imagesGrid = document.getElementById('imagesGrid');
        if (!imagesGrid) return;
        
        // Mostrar placeholder enquanto carrega
        imagesGrid.innerHTML = `
            <div class="image-placeholder">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Carregando galeria...</p>
            </div>
        `;
        
        // Simular delay de carregamento
        setTimeout(() => {
            this.exibirImagensGaleria();
        }, 1000);
    }
    
    exibirImagensGaleria() {
        const imagesGrid = document.getElementById('imagesGrid');
        if (!imagesGrid) return;
        
        // Dados de exemplo (substituir por dados reais)
        const imagens = [
            { id: 1, titulo: 'Portão Residencial', categoria: 'portoes', url: 'image/image01.jpg' },
            { id: 2, titulo: 'Janelas Modernas', categoria: 'janelas', url: 'image/image03.jpg' },
            { id: 3, titulo: 'Box Banheiro', categoria: 'box', url: 'image/image05.jpg' },
            { id: 4, titulo: 'Grade Proteção', categoria: 'grades', url: 'image/image07.jpg' },
            { id: 5, titulo: 'Estrutura Metálica', categoria: 'estruturas', url: 'image/image11.jpg' }
        ];
        
        if (imagens.length === 0) {
            imagesGrid.innerHTML = `
                <div class="image-placeholder">
                    <i class="fas fa-image"></i>
                    <p>Nenhuma imagem encontrada</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        imagens.forEach(imagem => {
            html += `
                <div class="image-item" data-id="${imagem.id}" data-categoria="${imagem.categoria}">
                    <div class="image-preview">
                        <img src="${imagem.url}" alt="${imagem.titulo}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"><rect width=\"100\" height=\"100\" fill=\"%23f0f0f0\"/><text x=\"50\" y=\"50\" font-family=\"Arial\" font-size=\"14\" fill=\"%23999\" text-anchor=\"middle\" dy=\".3em\">Imagem</text></svg>';">
                    </div>
                    <div class="image-info">
                        <div class="image-title">${imagem.titulo}</div>
                        <span class="image-category">${this.getCategoriaNome(imagem.categoria)}</span>
                        <div class="image-actions">
                            <button class="btn-action" onclick="sistemaAdmin.editarImagem(${imagem.id})">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn-action" onclick="sistemaAdmin.excluirImagem(${imagem.id})">
                                <i class="fas fa-trash"></i> Excluir
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        imagesGrid.innerHTML = html;
    }
    
    getCategoriaNome(categoria) {
        const categorias = {
            'portoes': 'Portões',
            'janelas': 'Janelas',
            'grades': 'Grades',
            'box': 'Box Banheiro',
            'estruturas': 'Estruturas'
        };
        return categorias[categoria] || categoria;
    }
    
    filtrarImagens() {
        const searchTerm = document.getElementById('searchImages').value.toLowerCase();
        const filterCategory = document.getElementById('filterCategory').value;
        
        const imageItems = document.querySelectorAll('.image-item');
        let visibleCount = 0;
        
        imageItems.forEach(item => {
            const title = item.querySelector('.image-title').textContent.toLowerCase();
            const category = item.dataset.categoria;
            
            const matchesSearch = !searchTerm || title.includes(searchTerm);
            const matchesCategory = filterCategory === 'all' || category === filterCategory;
            
            if (matchesSearch && matchesCategory) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Mostrar mensagem se não houver resultados
        const noResults = document.querySelector('.no-images-message');
        if (visibleCount === 0) {
            if (!noResults) {
                const imagesGrid = document.getElementById('imagesGrid');
                imagesGrid.innerHTML += `
                    <div class="no-images-message" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--cor-cinza);">
                        <i class="fas fa-search"></i>
                        <p>Nenhuma imagem encontrada com os filtros aplicados</p>
                    </div>
                `;
            }
        } else if (noResults) {
            noResults.remove();
        }
    }
    
    abrirModalImagem() {
        this.abrirModal(this.imageModal);
    }
    
    previewImage(e) {
        const file = e.target.files[0];
        const fileName = document.getElementById('fileName');
        const filePreview = document.getElementById('filePreview');
        
        if (file) {
            fileName.textContent = file.name;
            
            // Criar preview da imagem
            const reader = new FileReader();
            reader.onload = function(e) {
                filePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            fileName.textContent = 'Nenhum arquivo selecionado';
            filePreview.innerHTML = '';
        }
    }
    
    async salvarImagem(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const title = formData.get('imageTitle');
        const category = formData.get('imageCategory');
        
        // Validação básica
        if (!title || !category) {
            alert('Por favor, preencha todos os campos obrigatórios');
            return;
        }
        
        // Desabilitar botão de envio
        const submitBtn = e.target.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
        submitBtn.disabled = true;
        
        try {
            // Simular upload (substituir por API real)
            await this.simularUploadImagem(formData);
            
            // Fechar modal
            this.fecharModal(this.imageModal);
            
            // Resetar formulário
            e.target.reset();
            document.getElementById('fileName').textContent = 'Nenhum arquivo selecionado';
            document.getElementById('filePreview').innerHTML = '';
            
            // Recarregar galeria
            this.carregarGaleria();
            
            // Atualizar estatísticas
            this.atualizarEstatisticas();
            
            // Registrar atividade
            this.registrarAtividade(`Imagem "${title}" adicionada à galeria`);
            
            // Mostrar mensagem de sucesso
            this.mostrarMensagem('Imagem adicionada com sucesso!', 'success');
            
        } catch (error) {
            console.error('Erro ao salvar imagem:', error);
            this.mostrarMensagem('Erro ao salvar imagem. Tente novamente.', 'error');
            
            // Reabilitar botão
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    simularUploadImagem(formData) {
        return new Promise((resolve) => {
            // Simular delay de upload
            setTimeout(() => {
                console.log('Dados da imagem:', Object.fromEntries(formData.entries()));
                // Aqui normalmente você enviaria os dados para um servidor
                resolve({ success: true });
            }, 2000);
        });
    }
    
    editarImagem(id) {
        console.log('Editar imagem:', id);
        this.mostrarMensagem('Funcionalidade de edição em desenvolvimento', 'info');
    }
    
    excluirImagem(id) {
        if (!confirm('Tem certeza que deseja excluir esta imagem?')) {
            return;
        }
        
        // Simular exclusão
        console.log('Excluir imagem:', id);
        
        // Remover imagem da lista
        const imageItem = document.querySelector(`.image-item[data-id="${id}"]`);
        if (imageItem) {
            imageItem.remove();
        }
        
        // Atualizar estatísticas
        this.atualizarEstatisticas();
        
        // Registrar atividade
        this.registrarAtividade(`Imagem ID ${id} excluída da galeria`);
        
        this.mostrarMensagem('Imagem excluída com sucesso!', 'success');
    }
    
    carregarMensagens() {
        // Implementar carregamento de mensagens do servidor
        console.log('Carregando mensagens...');
    }
    
    filtrarMensagens(filter) {
        // Atualizar botões de filtro
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        // Implementar filtragem de mensagens
        console.log('Filtrando mensagens por:', filter);
    }
    
    carregarConteudo() {
        // Implementar carregamento de conteúdo editável
        console.log('Carregando conteúdo...');
    }
    
    editarConteudo(section) {
        console.log('Editar seção:', section);
        
        const editor = document.getElementById('contentEditor');
        if (!editor) return;
        
        // Simular conteúdo
        const conteudos = {
            'home': {
                titulo: 'Página Inicial',
                campos: [
                    { nome: 'titulo_principal', label: 'Título Principal', valor: 'Qualidade e Tradição em Alumínio' },
                    { nome: 'texto_introducao', label: 'Texto de Introdução', valor: 'A Esquadrimel é referência em serralheria especializada...', tipo: 'textarea' }
                ]
            },
            'about': {
                titulo: 'Quem Somos',
                campos: [
                    { nome: 'missao', label: 'Missão', valor: 'Oferecer serviços de serralheria em alumínio...', tipo: 'textarea' },
                    { nome: 'visao', label: 'Visão', valor: 'Ser referência regional em serralheria de alumínio...', tipo: 'textarea' }
                ]
            }
        };
        
        const conteudo = conteudos[section] || {
            titulo: 'Editar Conteúdo',
            campos: []
        };
        
        let html = `
            <h4>${conteudo.titulo}</h4>
            <form id="editForm" class="edit-form">
        `;
        
        conteudo.campos.forEach(campo => {
            if (campo.tipo === 'textarea') {
                html += `
                    <div class="form-group">
                        <label>${campo.label}</label>
                        <textarea name="${campo.nome}" rows="4">${campo.valor}</textarea>
                    </div>
                `;
            } else {
                html += `
                    <div class="form-group">
                        <label>${campo.label}</label>
                        <input type="text" name="${campo.nome}" value="${campo.valor}">
                    </div>
                `;
            }
        });
        
        html += `
                <div class="form-actions">
                    <button type="submit" class="btn-submit">
                        <i class="fas fa-save"></i> Salvar Alterações
                    </button>
                </div>
            </form>
        `;
        
        editor.innerHTML = html;
        
        // Adicionar event listener ao formulário
        const editForm = document.getElementById('editForm');
        if (editForm) {
            editForm.addEventListener('submit', (e) => this.salvarConteudo(e, section));
        }
    }
    
    salvarConteudo(e, section) {
        e.preventDefault();
        
        console.log('Salvando conteúdo da seção:', section);
        this.mostrarMensagem('Conteúdo salvo com sucesso!', 'success');
        this.registrarAtividade(`Conteúdo da seção ${section} atualizado`);
    }
    
    abrirConfiguracao(setting) {
        console.log('Abrir configuração:', setting);
        this.mostrarMensagem(`Configuração ${setting} em desenvolvimento`, 'info');
    }
    
    abrirModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    fecharModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    mostrarMensagem(texto, tipo = 'info') {
        // Criar elemento de mensagem
        const mensagem = document.createElement('div');
        mensagem.className = `admin-message admin-message-${tipo}`;
        mensagem.innerHTML = `
            <span>${texto}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // Adicionar ao corpo
        document.body.appendChild(mensagem);
        
        // Remover após 5 segundos
        setTimeout(() => {
            if (mensagem.parentElement) {
                mensagem.remove();
            }
        }, 5000);
    }
    
    registrarAtividade(texto) {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toLocaleDateString('pt-BR') === new Date().toLocaleDateString('pt-BR') ? 'Hoje' : 'Ontem';
        
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-history"></i>
            </div>
            <div class="activity-details">
                <p>${texto}</p>
                <span class="activity-time">${dateStr}, ${timeStr}</span>
            </div>
        `;
        
        // Adicionar no início da lista
        activityList.insertBefore(activityItem, activityList.firstChild);
        
        // Manter apenas os 10 itens mais recentes
        const items = activityList.querySelectorAll('.activity-item');
        if (items.length > 10) {
            items[items.length - 1].remove();
        }
    }
}

// ===== INICIALIZAÇÃO DO SISTEMA ADMIN =====
let sistemaAdmin;

document.addEventListener('DOMContentLoaded', () => {
    // Verificar se estamos na página de administração
    if (document.querySelector('.admin-page')) {
        sistemaAdmin = new SistemaAdministracao();
        
        // Adicionar estilos para mensagens
        const style = document.createElement('style');
        style.textContent = `
            .admin-message {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: var(--border-radius);
                box-shadow: var(--sombra-forte);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 15px;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
            }
            
            .admin-message-success {
                background: #10b981;
                color: white;
                border-left: 5px solid #059669;
            }
            
            .admin-message-error {
                background: #dc2626;
                color: white;
                border-left: 5px solid #b91c1c;
            }
            
            .admin-message-info {
                background: #3b82f6;
                color: white;
                border-left: 5px solid #1d4ed8;
            }
            
            .admin-message button {
                background: none;
                border: none;
                color: white;
                font-size: 1.5em;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
});

