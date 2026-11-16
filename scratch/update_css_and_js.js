const fs = require('fs');
const path = require('path');

// 1. Update nesports-frontend.css
const cssPath = path.join(__dirname, '../nesports-pro-store/assets/css/nesports-frontend.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace header block
const headerStart = css.indexOf('/* Header - Modern Properly Transparent Frosted Glass Architecture */');
const headerEnd = css.indexOf('.hb-menu {');

if (headerStart !== -1 && headerEnd !== -1) {
  const replacement = `/* Header - Static Header Architecture */
.hb-header,
.hb-header--static,
.hb-header.hb-header--static,
.hb-header--overlay,
.hb-header.is-sticky,
.hb-header.is-scrolled {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    width: 100% !important;
    background: #ffffff !important;
    background-color: #ffffff !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border-bottom: 1px solid #eef2f6 !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
    z-index: 1000 !important;
}

.hb-header-inner {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 16px 32px;
}
.hb-logo {
    display: inline-flex;
    align-items: center;
}
.hb-logo svg {
    height: 48px;
    width: auto;
    max-width: 180px;
    display: block;
}
.hb-logo img {
    height: 48px;
    width: auto;
    max-width: 180px;
    display: block;
    object-fit: contain;
    filter: none !important;
    transition: filter 0.25s ease;
}
.hb-header--overlay:not(.is-scrolled) .hb-logo img,
.hb-header--overlay:not(.is-scrolled) .hb-logo svg {
    filter: none !important;
}

`;
  css = css.slice(0, headerStart) + replacement + css.slice(headerEnd);
  console.log('Replaced header section in CSS');
} else {
  console.warn('Could not find header boundaries in CSS');
}

// Ensure menu items and icons are dark on white static header
css = css.replace(
  /\.hb-header--overlay:not\(\.is-scrolled\)\s+\.hb-menu\s*>\s*li\s*>\s*a\s*\{[^}]+\}/g,
  '.hb-header--overlay:not(.is-scrolled) .hb-menu > li > a { color: #111111 !important; }'
);
css = css.replace(
  /\.hb-header--overlay:not\(\.is-scrolled\)\s+\.hb-icon-btn\s*\{[^}]+\}/g,
  '.hb-header--overlay:not(.is-scrolled) .hb-icon-btn { color: #111111 !important; }'
);
css = css.replace(
  /\.hb-header--overlay:not\(\.is-scrolled\)\s+\.hb-cart-total-text\s*\{[^}]+\}/g,
  '.hb-header--overlay:not(.is-scrolled) .hb-cart-total-text { color: #111111 !important; }'
);

// Append static overrides at the very end to guarantee precedence
css += `
/* ==========================================================================
   STATIC HEADER ENFORCEMENT & PURE VECTOR LOGO STYLES
   ========================================================================== */
.hb-header,
.hb-header--static,
.hb-header.hb-header--static,
.hb-header--overlay,
.hb-header.is-sticky,
.hb-header.is-scrolled {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    width: 100% !important;
    background: #ffffff !important;
    background-color: #ffffff !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border-bottom: 1px solid #eef2f6 !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important;
    z-index: 1000 !important;
}

.hb-hero {
    margin-top: 0 !important;
    padding-top: 0 !important;
}

.hb-logo svg {
    height: 48px !important;
    width: auto !important;
    max-width: 180px !important;
    display: block !important;
}

.hb-logo img {
    height: 48px !important;
    width: auto !important;
    max-width: 180px !important;
    display: block !important;
    object-fit: contain !important;
    filter: none !important;
}

.hb-logo svg,
.hb-logo img {
    filter: none !important;
}

@media (max-width: 820px) {
    .hb-header,
    .hb-header--static,
    .hb-header--overlay,
    .hb-header.is-sticky,
    .hb-header.is-scrolled {
        position: relative !important;
        top: auto !important;
        background: #ffffff !important;
    }
    .hb-logo svg,
    .hb-logo img {
        height: 34px !important;
        max-width: 140px !important;
    }
}

@media (max-width: 400px) {
    .hb-logo svg,
    .hb-logo img {
        height: 29px !important;
        max-width: 115px !important;
    }
}
`;

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Saved updated nesports-frontend.css');

// 2. Update nesports-frontend.js
const jsPath = path.join(__dirname, '../nesports-pro-store/assets/js/nesports-frontend.js');
let js = fs.readFileSync(jsPath, 'utf8');

// Disable sticky scroll listener
const stickyCode = `    // Sticky Transparent / Frosted Header on Scroll
    var header = document.getElementById('hb-main-header');
    if (header) {
        var heroEl = document.getElementById('hb-hero');
        var handleScroll = function () {
            var scrollY = window.scrollY || window.pageYOffset || 0;
            if (scrollY > 39) {
                header.classList.add('is-sticky');
            } else {
                header.classList.remove('is-sticky');
            }
            var scrollThreshold = heroEl ? Math.max(heroEl.offsetHeight - 90, 420) : 39;
            if (scrollY > scrollThreshold) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }`;

const staticCode = `    // Header is static - no sticky fixed scroll listener needed
    var header = document.getElementById('hb-main-header');
    if (header) {
        header.classList.remove('is-sticky', 'is-scrolled');
    }`;

if (js.includes('Sticky Transparent / Frosted Header on Scroll')) {
  js = js.replace(stickyCode, staticCode);
  console.log('Replaced sticky header scroll listener in JS');
} else {
  console.log('Sticky listener already replaced or not found');
}

fs.writeFileSync(jsPath, js, 'utf8');
console.log('Saved updated nesports-frontend.js');
