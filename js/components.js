'use strict';

(function () {
    const isSubpage = window.location.pathname.includes('/pages/');
    const root = isSubpage ? '../' : './';

    const navLinks = [
        { href: `${root}index.html`,             label: 'Início'      },
        { href: `${root}pages/arcos.html`,       label: 'Arcos'       },
        { href: `${root}pages/fillers.html`,     label: 'Fillers'     },
        { href: `${root}pages/personagens.html`, label: 'Personagens' },
        { href: `${root}pages/zanpakuto.html`,   label: 'Zanpakutō'   },
        { href: `${root}pages/ichigo.html`,      label: 'Ichigo'      },
        { href: `${root}pages/sobre.html`,       label: 'Sobre'       },
    ];

    function isActive(href) {
        const target  = new URL(href, window.location.href).pathname.replace(/\/index\.html$/, '/');
        const current = window.location.pathname.replace(/\/index\.html$/, '/');
        return current === target || current.endsWith(target);
    }

    function renderHeader() {
        const items = navLinks.map(l => `
            <li><a href="${l.href}" class="nav-link${isActive(l.href) ? ' nav-link--active' : ''}">${l.label}</a></li>
        `).join('');
        return `
        <header class="header">
            <div class="container">
                <a href="${root}index.html" class="logo">
                    Bleach
                </a>
                <nav class="nav">
                    <button class="nav-toggle" aria-label="Abrir menu" aria-expanded="false">
                        <i class="fas fa-bars"></i>
                    </button>
                    <ul class="nav-menu">${items}</ul>
                </nav>
            </div>
        </header>`;
    }

    function renderFooter() {
        return `
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-logo"><i class="fas fa-skull-crossbones"></i> Bleach Guide</div>
                    <p class="footer-text">Site criado com ❤️ para Lisa</p>
                    <p class="footer-copyright">© 2026 Ruan Dias. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>`;
    }

    function injectComponents() {
        const headerEl = document.getElementById('site-header');
        if (headerEl) headerEl.outerHTML = renderHeader();
        else document.body.insertAdjacentHTML('afterbegin', renderHeader());

        const footerEl = document.getElementById('site-footer');
        if (footerEl) footerEl.outerHTML = renderFooter();
        else document.body.insertAdjacentHTML('beforeend', renderFooter());
    }

    /* ── Nav toggle ── */
    function initNav() {
        const toggle = document.querySelector('.nav-toggle');
        const menu   = document.querySelector('.nav-menu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            const open = menu.classList.toggle('active');
            toggle.setAttribute('aria-expanded', open);
            toggle.querySelector('i').className = open ? 'fas fa-times' : 'fas fa-bars';
        });

        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.querySelector('i').className = 'fas fa-bars';
            });
        });
    }

    /* ── Header shadow on scroll ── */
    function initHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            header.style.boxShadow = window.scrollY > 10
                ? '0 2px 32px rgba(0,0,0,0.7)' : 'none';
        }, { passive: true });
    }

    /* ── Scroll-reveal ── */
    function initReveal() {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.06, rootMargin: '0px 0px -32px 0px' });

        document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => observer.observe(el));
        document.querySelectorAll('.tab-pane.active .reveal-stagger').forEach(el => el.classList.add('visible'));
    }

    /* ── Arc timeline rows ── */
    function initArcRows() {
        document.querySelectorAll('.arc-row:not(.coming-soon)').forEach(row => {
            row.addEventListener('click', () => {
                const isOpen = row.classList.contains('arc-open');
                const timeline = row.closest('.arcs-timeline');
                if (timeline) {
                    timeline.querySelectorAll('.arc-row.arc-open').forEach(o => {
                        if (o !== row) o.classList.remove('arc-open');
                    });
                }
                row.classList.toggle('arc-open', !isOpen);
            });
        });
    }

    /* ── Filler cards ── */
    function initFillerCards() {
        document.querySelectorAll('.filler-card').forEach(card => {
            card.addEventListener('click', () => {
                const isOpen = card.classList.contains('filler-open');
                document.querySelectorAll('.filler-card.filler-open').forEach(o => {
                    if (o !== card) o.classList.remove('filler-open');
                });
                card.classList.toggle('filler-open', !isOpen);
            });
        });
    }

    /* ── Character cards ── */
    function initCharacterCards() {
        document.querySelectorAll('.character-card').forEach(card => {
            card.addEventListener('click', () => {
                const details = card.querySelector('.character-details');
                if (!details) return;

                const opening = !details.classList.contains('active');

                /* Fecha outros na mesma grid */
                const grid = card.closest('.characters-grid');
                if (grid) {
                    grid.querySelectorAll('.character-card').forEach(o => {
                        if (o === card) return;
                        o.querySelector('.character-details')?.classList.remove('active');
                        o.classList.remove('expanded');
                    });
                }

                details.classList.toggle('active', opening);
                card.classList.toggle('expanded', opening);

                /* Scroll suave para o card no mobile */
                if (opening && window.innerWidth < 768) {
                    setTimeout(() => {
                        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 80);
                }
            });
        });
    }

    /* ── Tabs ── */
    function initTabs() {
        const buttons = document.querySelectorAll('.tab-button');
        const panes   = document.querySelectorAll('.tab-pane');
        if (!buttons.length) return;

        buttons.forEach((btn, i) => {
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-selected', btn.classList.contains('active'));

            btn.addEventListener('click', () => {
                const target = btn.dataset.tab;
                buttons.forEach(b => {
                    b.classList.toggle('active', b === btn);
                    b.setAttribute('aria-selected', b === btn);
                });
                panes.forEach(p => p.classList.toggle('active', p.id === `tab-${target}`));

                /* Fecha qualquer card aberto ao trocar de aba */
                document.querySelectorAll('.character-card.expanded').forEach(c => {
                    c.querySelector('.character-details')?.classList.remove('active');
                    c.classList.remove('expanded');
                });

                document.getElementById(`tab-${target}`)
                    ?.querySelectorAll('.reveal-stagger')
                    .forEach(el => el.classList.add('visible'));

                /* Scroll do tab header para deixar o botão visível */
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            });

            btn.addEventListener('keydown', e => {
                let idx = i;
                if (e.key === 'ArrowRight') idx = (i + 1) % buttons.length;
                if (e.key === 'ArrowLeft')  idx = (i - 1 + buttons.length) % buttons.length;
                if (idx !== i) { buttons[idx].focus(); buttons[idx].click(); }
            });
        });
    }

    /* ── Zanpakutō section ── */
    function initZanpakuto() {
        document.querySelectorAll('.zp-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.zptab;
                document.querySelectorAll('.zp-tab-btn').forEach(b => b.classList.toggle('active', b === btn));
                document.querySelectorAll('.zp-pane').forEach(p => p.classList.toggle('active', p.id === `zp-${target}`));
            });
        });

        document.querySelectorAll('.zp-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const pane = btn.closest('.zp-pane');
                if (!pane) return;
                pane.querySelectorAll('.zp-filter-btn').forEach(b => b.classList.toggle('active', b === btn));
                const filter = btn.dataset.filter;
                pane.querySelectorAll('.zp-card').forEach(card => {
                    const match = filter === 'all' || card.dataset.type === filter;
                    card.classList.toggle('zp-hidden', !match);
                    if (!match) card.classList.remove('expanded');
                });
            });
        });

        document.querySelectorAll('.zp-card').forEach(card => {
            card.addEventListener('click', () => {
                const open = !card.classList.contains('expanded');
                card.closest('.zp-grid')?.querySelectorAll('.zp-card').forEach(o => {
                    if (o !== card) o.classList.remove('expanded');
                });
                card.classList.toggle('expanded', open);
            });
        });
    }

    /* ── Smooth anchor scroll ── */
    function initSmoothScroll() {
        const header = document.querySelector('.header');
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                const target = document.querySelector(a.getAttribute('href'));
                if (!target) return;
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight ?? 0) - 16;
                window.scrollTo({ top, behavior: 'smooth' });
            });
        });
    }

    /* ── Boot ── */
    document.addEventListener('DOMContentLoaded', () => {
        injectComponents();
        initNav();
        initHeaderScroll();
        initReveal();
        initArcRows();
        initFillerCards();
        initCharacterCards();
        initTabs();
        initZanpakuto();
        initSmoothScroll();
    });
})();