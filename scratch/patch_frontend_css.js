const fs = require('fs');
let css = fs.readFileSync('nesports-pro-store/assets/css/nesports-frontend.css', 'utf8');

// 1. Update .hb-header-actions gap
css = css.replace(
  /\.hb-header-actions\s*\{\s*display:\s*flex;\s*gap:\s*18px;/g,
  '.hb-header-actions {\r\n    display: flex;\r\n    gap: 22px !important;'
);

// 2. Append mobile header layout and admin bar fix
const additions = `
/* ==========================================================================
   MOBILE HEADER OVERLAP & ICON SPACING & CRISP LOGO FIX
   ========================================================================== */
.hb-logo img,
.hb-footer-logo img {
    image-rendering: -webkit-optimize-contrast !important;
    image-rendering: crisp-edges !important;
    transform: translateZ(0);
    backface-visibility: hidden;
}

@media (max-width: 820px) {
    .hb-topbar {
        height: 36px !important;
        min-height: 36px !important;
        max-height: 36px !important;
        padding: 0 12px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        overflow: hidden !important;
        position: relative !important;
        z-index: 1002 !important;
        box-sizing: border-box !important;
    }
    .hb-topbar-inner { 
        padding: 0 !important; 
        display: flex !important; 
        justify-content: center !important; 
        align-items: center !important;
        text-align: center !important;
        width: 100% !important;
        height: 100% !important;
    }
    .hb-topbar-right,
    .hb-topbar-left { 
        display: none !important; 
    }
    .hb-topbar-center { 
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;
        font-size: 11.5px !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        max-width: 100% !important;
        margin: 0 !important;
        line-height: 1 !important;
    }
    .hb-topbar-center span {
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
    }

    .hb-header {
        position: relative;
        z-index: 1000;
    }
    .hb-header--overlay:not(.is-scrolled):not(.is-sticky) {
        position: absolute !important;
        top: 36px !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
    }
    .hb-header-inner { 
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        padding: 8px 16px !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }
    .hb-logo {
        display: inline-flex !important;
        align-items: center !important;
        flex-shrink: 0 !important;
    }
    .hb-logo img { 
        height: 34px !important;
        width: auto !important;
        max-width: 140px !important;
        object-fit: contain !important;
    }
    .hb-header-actions {
        display: flex !important;
        align-items: center !important;
        gap: 15px !important;
        flex-shrink: 0 !important;
        margin-left: auto !important;
    }
    .hb-icon-btn {
        padding: 6px !important;
        font-size: 17px !important;
        line-height: 1 !important;
        background: none !important;
        border: none !important;
        cursor: pointer !important;
    }
    .hb-cart {
        gap: 6px !important;
        padding: 6px !important;
    }
    .hb-cart-icon-box i {
        font-size: 17px !important;
    }
    .hb-cart-badge {
        font-size: 10px !important;
        min-width: 17px !important;
        height: 17px !important;
        top: -7px !important;
        right: -8px !important;
    }
    .hb-cart-total-text {
        font-size: 12.5px !important;
    }
    .hb-mobile-btn { 
        display: flex !important; 
        padding: 6px 2px !important;
        margin-left: 2px !important;
    }
}

@media (max-width: 400px) {
    .hb-header-actions {
        gap: 11px !important;
    }
    .hb-cart-total-text {
        display: none !important;
    }
    .hb-logo img {
        height: 29px !important;
        max-width: 115px !important;
    }
    .hb-topbar-center {
        font-size: 10.5px !important;
    }
}

/* Admin Bar Offsets */
body.admin-bar .hb-header.is-sticky,
body.admin-bar .hb-header.is-scrolled {
    top: 32px !important;
}
body.admin-bar .hb-header--overlay:not(.is-scrolled):not(.is-sticky) {
    top: calc(39px + 32px) !important;
}
@media screen and (max-width: 782px) {
    body.admin-bar .hb-header.is-sticky,
    body.admin-bar .hb-header.is-scrolled {
        top: 46px !important;
    }
    body.admin-bar .hb-header--overlay:not(.is-scrolled):not(.is-sticky) {
        top: calc(36px + 46px) !important;
    }
}
`;

css += '\r\n' + additions;
fs.writeFileSync('nesports-pro-store/assets/css/nesports-frontend.css', css, 'utf8');
console.log('Successfully updated nesports-frontend.css');
