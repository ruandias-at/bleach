/* ============================================
   BLEACH GUIDE — script.js
   ============================================ */

'use strict';

/* ── Nav Toggle ── */
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen);
        navToggle.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    });

    // Close menu on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', false);
            navToggle.querySelector('i').className = 'fas fa-bars';
        });
    });
}

/* ── Header shadow on scroll ── */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (header) {
        header.style.boxShadow = window.scrollY > 10
            ? '0 2px 32px rgba(0,0,0,0.7)'
            : 'none';
    }
}, { passive: true });

/* ── Arc accordion (botão legado) ── */
document.querySelectorAll('.arc-toggle:not(:disabled)').forEach(btn => {
    btn.addEventListener('click', () => {
        const card    = btn.closest('.arc-card');
        const details = card.querySelector('.arc-details');
        if (!details) return;

        const isOpen = details.classList.toggle('active');
        btn.setAttribute('aria-expanded', isOpen);

        const icon = btn.querySelector('i');
        if (icon) icon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    });
});

/* ── Arc / Filler timeline rows — clique na linha inteira ── */
document.querySelectorAll('.arc-row:not(.coming-soon)').forEach(row => {
    row.addEventListener('click', () => {
        const isOpen = row.classList.contains('arc-open');

        // Fecha todos os outros na mesma timeline
        const timeline = row.closest('.arcs-timeline');
        if (timeline) {
            timeline.querySelectorAll('.arc-row.arc-open').forEach(other => {
                if (other !== row) other.classList.remove('arc-open');
            });
        }

        row.classList.toggle('arc-open', !isOpen);
    });
});

/* ── Character accordion — click anywhere on the card ── */
document.querySelectorAll('.character-card').forEach(card => {
    card.addEventListener('click', () => {
        const details = card.querySelector('.character-details');
        if (!details) return;

        const isOpen = !details.classList.contains('active');

        // Close others in the same grid
        const grid = card.closest('.characters-grid');
        if (grid) {
            grid.querySelectorAll('.character-card').forEach(other => {
                if (other !== card) {
                    other.querySelector('.character-details')?.classList.remove('active');
                    other.classList.remove('expanded');
                }
            });
        }

        details.classList.toggle('active', isOpen);
        card.classList.toggle('expanded', isOpen);
    });
});

/* ── Tabs ── */
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes   = document.querySelectorAll('.tab-pane');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        // Update buttons
        tabButtons.forEach(b => {
            b.classList.toggle('active', b === btn);
            b.setAttribute('aria-selected', b === btn);
        });

        // Update panes
        tabPanes.forEach(pane => {
            const isTarget = pane.id === `tab-${target}`;
            pane.classList.toggle('active', isTarget);
        });

        // Trigger stagger on newly visible grids
        const activePane = document.getElementById(`tab-${target}`);
        if (activePane) {
            activePane.querySelectorAll('.reveal-stagger').forEach(el => {
                if (!el.classList.contains('visible')) {
                    el.classList.add('visible');
                }
            });
        }
    });
});

/* ── Scroll-reveal (IntersectionObserver) ── */
function initReveal() {
    // Add classes to target elements
    document.querySelectorAll('.arc-card').forEach(el => el.classList.add('reveal'));
    document.querySelectorAll('.arcs-grid').forEach(el => el.classList.add('reveal-stagger'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once visible, stop observing
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => observer.observe(el));
}

/* ── Smooth anchor scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();

        const headerH = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;

        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ══════════════════════════════════════════
   ZANPAKUTŌ SECTION
══════════════════════════════════════════ */
function initZanpakutoSection() {

    /* ── Sub-abas (Zanpakutō | Ressurreições) ── */
    document.querySelectorAll('.zp-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.zptab;

            document.querySelectorAll('.zp-tab-btn').forEach(b =>
                b.classList.toggle('active', b === btn)
            );
            document.querySelectorAll('.zp-pane').forEach(pane =>
                pane.classList.toggle('active', pane.id === `zp-${target}`)
            );
        });
    });

    /* ── Filtros por tipo ── */
    document.querySelectorAll('.zp-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const pane = btn.closest('.zp-pane');
            if (!pane) return;

            // Toggle active button
            pane.querySelectorAll('.zp-filter-btn').forEach(b =>
                b.classList.toggle('active', b === btn)
            );

            const filter = btn.dataset.filter;

            pane.querySelectorAll('.zp-card').forEach(card => {
                const match = filter === 'all' || card.dataset.type === filter;
                card.classList.toggle('zp-hidden', !match);
                // Close expanded card if it's being hidden
                if (!match) card.classList.remove('expanded');
            });
        });
    });

    /* ── Cards clicáveis (expand/collapse) ── */
    document.querySelectorAll('.zp-card').forEach(card => {
        card.addEventListener('click', () => {
            const isOpen = !card.classList.contains('expanded');

            // Fecha os outros cards da mesma grade
            const grid = card.closest('.zp-grid');
            if (grid) {
                grid.querySelectorAll('.zp-card').forEach(other => {
                    if (other !== card) other.classList.remove('expanded');
                });
            }

            card.classList.toggle('expanded', isOpen);
        });
    });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initZanpakutoSection();

    // Make initial tab's stagger grids visible immediately
    document.querySelectorAll('.tab-pane.active .reveal-stagger').forEach(el => {
        el.classList.add('visible');
    });

    // Keyboard nav for tabs
    tabButtons.forEach((btn, i) => {
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', btn.classList.contains('active'));

        btn.addEventListener('keydown', e => {
            let newIndex = i;
            if (e.key === 'ArrowRight') newIndex = (i + 1) % tabButtons.length;
            if (e.key === 'ArrowLeft')  newIndex = (i - 1 + tabButtons.length) % tabButtons.length;
            if (newIndex !== i) {
                tabButtons[newIndex].focus();
                tabButtons[newIndex].click();
            }
        });
    });
});