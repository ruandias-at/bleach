// Menu responsivo
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }
    
    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.querySelector('i').classList.remove('fa-times');
                navToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });
    
    // Versão simplificada apenas para as setas
    document.querySelectorAll('.arc-toggle:not(:disabled)').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.arc-card');
            const details = card.querySelector('.arc-details');
            const icon = this.querySelector('i');
            
            // Alterna a classe active
            details.classList.toggle('active');
            
            // Alterna a seta
            if (details.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
                this.setAttribute('aria-label', 'Ocultar detalhes');
            } else {
                icon.style.transform = 'rotate(0deg)';
                this.setAttribute('aria-label', 'Mostrar detalhes');
            }
            
            // Fecha outros abertos (opcional)
            document.querySelectorAll('.arc-details.active').forEach(otherDetails => {
                if (otherDetails !== details) {
                    otherDetails.classList.remove('active');
                    const otherIcon = otherDetails.closest('.arc-card').querySelector('.arc-toggle i');
                    otherIcon.style.transform = 'rotate(0deg)';
                    otherDetails.closest('.arc-card').querySelector('.arc-toggle').setAttribute('aria-label', 'Mostrar detalhes');
                }
            });
        });
    });
    
    // Efeito de digitação no título do hero (opcional)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        function typeWriter() {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Inicia o efeito após um breve delay
        setTimeout(typeWriter, 500);
    }

    // Funcionalidade dos cartões de personagens
    const characterToggles = document.querySelectorAll('.character-toggle');

    characterToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const card = this.closest('.character-card');
            const details = card.querySelector('.character-details');
            const icon = this.querySelector('i');
            
            // Alterna a classe active
            details.classList.toggle('active');
            
            // Alterna a seta
            if (details.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
                this.setAttribute('aria-label', 'Ocultar detalhes');
            } else {
                icon.style.transform = 'rotate(0deg)';
                this.setAttribute('aria-label', 'Mostrar detalhes');
            }
            
            // Fecha outros abertos no mesmo grupo (opcional)
            const group = card.closest('.character-group');
            if (group) {
                group.querySelectorAll('.character-details.active').forEach(otherDetails => {
                    if (otherDetails !== details) {
                        otherDetails.classList.remove('active');
                        const otherIcon = otherDetails.closest('.character-card').querySelector('.character-toggle i');
                        otherIcon.style.transform = 'rotate(0deg)';
                        otherDetails.closest('.character-card').querySelector('.character-toggle').setAttribute('aria-label', 'Mostrar detalhes');
                    }
                });
            }
        });
    });
    
    // Animação suave ao rolar para seções
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
});