'use strict';

/* ============================================================
   script.js — interações globais (todas as páginas)
   ============================================================ */

/* ── Nav toggle (mobile) ── */
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
            toggle.setAttribute('aria-expanded', false);
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
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => observer.observe(el));
    document.querySelectorAll('.tab-pane.active .reveal-stagger').forEach(el => el.classList.add('visible'));
}

/* ── Arc timeline rows ── */
function initArcRows() {
    document.querySelectorAll('.arc-row:not(.coming-soon)').forEach(row => {
        row.addEventListener('click', () => {
            const open = row.classList.contains('arc-open');
            const timeline = row.closest('.arcs-timeline');
            if (timeline) timeline.querySelectorAll('.arc-row.arc-open').forEach(o => {
                if (o !== row) o.classList.remove('arc-open');
            });
            row.classList.toggle('arc-open', !open);
        });
    });
}

/* ── Filler cards ── */
function initFillerCards() {
    document.querySelectorAll('.filler-card').forEach(card => {
        card.addEventListener('click', () => {
            const open = card.classList.contains('filler-open');
            document.querySelectorAll('.filler-card.filler-open').forEach(o => {
                if (o !== card) o.classList.remove('filler-open');
            });
            card.classList.toggle('filler-open', !open);
        });
    });
}

/* ── Character cards ── */
function initCharacterCards() {
    document.querySelectorAll('.character-card').forEach(card => {
        card.addEventListener('click', () => {
            const details = card.querySelector('.character-details');
            if (!details) return;
            const open = !details.classList.contains('active');
            const grid = card.closest('.characters-grid');
            if (grid) grid.querySelectorAll('.character-card').forEach(o => {
                if (o !== card) {
                    o.querySelector('.character-details')?.classList.remove('active');
                    o.classList.remove('expanded');
                }
            });
            details.classList.toggle('active', open);
            card.classList.toggle('expanded', open);
        });
    });
}

/* ── Tabs (personagens) ── */
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

            const activePane = document.getElementById(`tab-${target}`);
            activePane?.querySelectorAll('.reveal-stagger').forEach(el => el.classList.add('visible'));
        });

        btn.addEventListener('keydown', e => {
            let idx = i;
            if (e.key === 'ArrowRight') idx = (i + 1) % buttons.length;
            if (e.key === 'ArrowLeft')  idx = (i - 1 + buttons.length) % buttons.length;
            if (idx !== i) { buttons[idx].focus(); buttons[idx].click(); }
        });
    });
}

/* ── Zanpakutō section (sub-tabs + filtros + cards) ── */
function initZanpakuto() {
    /* Sub-abas */
    document.querySelectorAll('.zp-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.zptab;
            document.querySelectorAll('.zp-tab-btn').forEach(b => b.classList.toggle('active', b === btn));
            document.querySelectorAll('.zp-pane').forEach(p => p.classList.toggle('active', p.id === `zp-${target}`));
        });
    });

    /* Filtros */
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

    /* Cards */
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

function initTransformationCards() {
    document.querySelectorAll('.transformation-card').forEach(card => {
        card.addEventListener('click', () => {
            const open = card.classList.contains('expanded');

            document.querySelectorAll('.transformation-card.expanded').forEach(other => {
                if (other !== card) {
                    other.classList.remove('expanded');
                }
            });

            card.classList.toggle('expanded', !open);
        });
    });
}

/* ── initPage — chamado pelo components.js após injetar header/footer ── */
function initPage() {
    initNav();
    initHeaderScroll();
    initReveal();
    initArcRows();
    initFillerCards();
    initCharacterCards();
    initTabs();
    initZanpakuto();
    initTransformationCards();
    initSmoothScroll();
}