'use strict';

/* ============================================================
   components.js — injeta header e footer em todas as páginas
   ============================================================
   Detecta se a página está na raiz ou em /pages/ e ajusta os
   caminhos de href/src automaticamente.
   ============================================================ */

(function () {
    const isSubpage = window.location.pathname.includes('/pages/');
    const root      = isSubpage ? '../' : './';

    /* ── Nav links ── */
    const navLinks = [
        { href: `${root}index.html`,              label: 'Início'      },
        { href: `${root}pages/arcos.html`,        label: 'Arcos'       },
        { href: `${root}pages/fillers.html`,      label: 'Fillers'     },
        { href: `${root}pages/personagens.html`,  label: 'Personagens' },
        { href: `${root}pages/zanpakuto.html`,    label: 'Zanpakutō'   },
        { href: `${root}pages/ichigo.html`,       label: 'Ichigo'      },
        { href: `${root}pages/sobre.html`,        label: 'Sobre'       },
    ];

    /* Marca o link ativo comparando o pathname */
    function isActive(href) {
        const target = new URL(href, window.location.href).pathname
            .replace(/\/index\.html$/, '/');
        const current = window.location.pathname
            .replace(/\/index\.html$/, '/');
        return current === target || current.endsWith(target);
    }

    /* ── Renderiza header ── */
    function renderHeader() {
        const liItems = navLinks.map(link => `
            <li>
                <a href="${link.href}"
                   class="nav-link${isActive(link.href) ? ' nav-link--active' : ''}">
                    ${link.label}
                </a>
            </li>`).join('');

        return `
        <header class="header">
            <div class="container">
                <a href="${root}index.html" class="logo">
                    <i class="fas fa-skull-crossbones"></i> Bleach
                </a>
                <nav class="nav">
                    <button class="nav-toggle" aria-label="Abrir menu" aria-expanded="false">
                        <i class="fas fa-bars"></i>
                    </button>
                    <ul class="nav-menu">
                        ${liItems}
                    </ul>
                </nav>
            </div>
        </header>`;
    }

    /* ── Renderiza footer ── */
    function renderFooter() {
        return `
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-logo">
                        <i class="fas fa-skull-crossbones"></i> Bleach Guide
                    </div>
                    <p class="footer-text">Site criado com ❤️ para Lisa</p>
                    <p class="footer-copyright">© 2026 Ruan Dias. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>`;
    }

    /* ── Injeção no DOM ── */
    document.addEventListener('DOMContentLoaded', () => {
        /* Header */
        const headerEl = document.getElementById('site-header');
        if (headerEl) headerEl.outerHTML = renderHeader();
        else document.body.insertAdjacentHTML('afterbegin', renderHeader());

        /* Footer */
        const footerEl = document.getElementById('site-footer');
        if (footerEl) footerEl.outerHTML = renderFooter();
        else document.body.insertAdjacentHTML('beforeend', renderFooter());

        /* Dispara o script principal após injeção */
        if (typeof initPage === 'function') initPage();
    });
})();