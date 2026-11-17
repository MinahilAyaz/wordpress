const fs = require('fs');
const path = require('path');

console.log('=== Preparing V37: Fixed Top Bar + Static Fixed Header ===');

// 1. UPDATE header-nesports.php
const headerPath = 'nesports-pro-store/templates/header-nesports.php';
let headerContent = fs.readFileSync(headerPath, 'utf8');

const styleTarget = /<style id="nesports-mobile-nav-fix">[\s\S]*?<\/style>/;
const newHeaderStyle = `<style id="nesports-mobile-nav-fix">
    /* 1. Permanent Fixed Top Announcement Bar across overall page */
    .hb-topbar {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        height: 36px !important;
        min-height: 36px !important;
        max-height: 36px !important;
        z-index: 1002 !important;
        background: #141518 !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
        box-sizing: border-box !important;
        margin: 0 !important;
    }
    body.admin-bar .hb-topbar {
        top: 32px !important;
    }
    @media screen and (max-width: 782px) {
        body.admin-bar .hb-topbar {
            top: 46px !important;
        }
    }

    /* 2. Permanent Fixed Main Header directly below Top Bar */
    .hb-header,
    .hb-header--static,
    .hb-header.hb-header--static,
    .hb-header--fixed,
    .hb-header--overlay {
        position: fixed !important;
        top: 36px !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        background: transparent !important;
        background-color: transparent !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
        box-shadow: none !important;
        z-index: 1000 !important;
        transition: background 0.2s ease, border-color 0.2s ease !important;
    }
    body.admin-bar .hb-header,
    body.admin-bar .hb-header--static,
    body.admin-bar .hb-header--fixed {
        top: calc(36px + 32px) !important;
    }
    @media screen and (max-width: 782px) {
        body.admin-bar .hb-header,
        body.admin-bar .hb-header--static,
        body.admin-bar .hb-header--fixed {
            top: calc(36px + 46px) !important;
        }
    }

    .hb-header.is-on-light {
        border-bottom-color: rgba(0, 0, 0, 0.08) !important;
    }
    .hb-header.is-on-dark {
        border-bottom-color: rgba(255, 255, 255, 0.08) !important;
    }

    /* Base Nav & Transition */
    .hb-header .hb-nav .hb-menu > li > a {
        font-weight: 500 !important;
        font-size: 14px !important;
        transition: color 0.2s ease !important;
    }
    .hb-header .hb-logo svg path,
    .hb-header .hb-logo svg g {
        transition: fill 0.2s ease !important;
    }

    /* ========================================================
       DARK BACKGROUND: Text & Icons WHITE, Logo Letters WHITE
       ======================================================== */
    .hb-header.is-on-dark .hb-nav .hb-menu > li > a {
        color: #ffffff !important;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
    }
    .hb-header.is-on-dark .hb-nav .hb-menu > li > a:hover,
    .hb-header.is-on-dark .hb-nav .hb-menu > li > a.hb-nav-active {
        color: #e11d48 !important;
    }
    .hb-header.is-on-dark .hb-nav .hb-menu > li.hb-has-dropdown > a,
    .hb-header.is-on-dark .hb-nav .hb-menu > li.hb-has-dropdown > a i {
        color: #ffffff !important;
    }
    .hb-header.is-on-dark .hb-cart-total-text {
        color: #ffffff !important;
        font-weight: 600 !important;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
    }
    .hb-header.is-on-dark .hb-icon-btn,
    .hb-header.is-on-dark .hb-icon-btn i,
    .hb-header.is-on-dark .hb-cart-icon-box i {
        color: #ffffff !important;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
    }
    .hb-header.is-on-dark .hb-mobile-btn span {
        background-color: #ffffff !important;
    }
    .hb-header.is-on-dark .hb-logo .hb-logo-letters,
    .hb-header.is-on-dark .hb-logo g[fill="#080808"],
    .hb-header.is-on-dark .hb-logo g.hb-logo-letters {
        fill: #ffffff !important;
    }

    /* ========================================================
       LIGHT BACKGROUND: Text & Icons DARK BLACK, Logo Letters BLACK
       ======================================================== */
    .hb-header.is-on-light .hb-nav .hb-menu > li > a {
        color: #111111 !important;
        text-shadow: none !important;
    }
    .hb-header.is-on-light .hb-nav .hb-menu > li > a:hover,
    .hb-header.is-on-light .hb-nav .hb-menu > li > a.hb-nav-active {
        color: #e11d48 !important;
    }
    .hb-header.is-on-light .hb-nav .hb-menu > li.hb-has-dropdown > a,
    .hb-header.is-on-light .hb-nav .hb-menu > li.hb-has-dropdown > a i {
        color: #111111 !important;
    }
    .hb-header.is-on-light .hb-cart-total-text {
        color: #111111 !important;
        font-weight: 600 !important;
        text-shadow: none !important;
    }
    .hb-header.is-on-light .hb-icon-btn,
    .hb-header.is-on-light .hb-icon-btn i,
    .hb-header.is-on-light .hb-cart-icon-box i {
        color: #111111 !important;
        text-shadow: none !important;
    }
    .hb-header.is-on-light .hb-mobile-btn span {
        background-color: #111111 !important;
    }
    .hb-header.is-on-light .hb-logo .hb-logo-letters,
    .hb-header.is-on-light .hb-logo g[fill="#080808"],
    .hb-header.is-on-light .hb-logo g.hb-logo-letters {
        fill: #080808 !important;
    }

    /* Red accents */
    .hb-logo .hb-logo-red,
    .hb-logo g[fill="#F00012"],
    .hb-logo g.hb-logo-red {
        fill: #F00012 !important;
    }
    .hb-header .hb-cart-badge {
        background: #e11d48 !important;
        color: #ffffff !important;
    }

    /* Hero Section */
    .hb-hero {
        margin-top: 0 !important;
        padding-top: 0 !important;
    }

    /* Razor Sharp Vector Logo Styling */
    .hb-logo {
        display: inline-flex !important;
        align-items: center !important;
        line-height: 1 !important;
    }
    .hb-logo svg {
        height: 44px !important;
        width: auto !important;
        max-width: 175px !important;
        display: block !important;
        filter: none !important;
        shape-rendering: geometricPrecision !important;
        text-rendering: geometricPrecision !important;
    }
    .hb-logo img {
        height: 44px !important;
        width: auto !important;
        max-width: 175px !important;
        display: block !important;
        object-fit: contain !important;
        filter: none !important;
    }

    /* Mobile Header Layout */
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

        .hb-header-inner { 
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 8px 16px !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }
        .hb-logo svg,
        .hb-logo img { 
            height: 36px !important;
            width: auto !important;
            max-width: 145px !important;
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
        .hb-nav .hb-dropdown a {
            color: #334155 !important;
        }
    }

    @media (max-width: 400px) {
        .hb-header-actions {
            gap: 11px !important;
        }
        .hb-cart-total-text {
            display: none !important;
        }
        .hb-logo svg,
        .hb-logo img {
            height: 30px !important;
            max-width: 120px !important;
        }
        .hb-topbar-center {
            font-size: 10.5px !important;
        }
    }

    /* Completely remove Login / Auth options from entire site */
    #hb-auth-icon-trigger,
    #hb-auth-text-trigger,
    #hb-side-drawer,
    #hb-drawer-overlay,
    .hb-side-drawer,
    .hb-drawer-overlay,
    .hb-auth-drawer,
    .hb-auth-overlay {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
        height: 0 !important;
        width: 0 !important;
        opacity: 0 !important;
    }
</style>`;

headerContent = headerContent.replace(styleTarget, newHeaderStyle);

// 2. Update JavaScript in header-nesports.php
const newScript = `<script id="hb-header-adaptive-script">
(function() {
    function updateAdaptiveHeader() {
        var header = document.getElementById('hb-main-header');
        if (!header) return;

        var probeY = 36 + ((header.offsetHeight || 60) / 2);

        var isDark = false;
        var darkElements = document.querySelectorAll('#hb-hero, .hb-hero, .hb-trustbar, .hb-static-banner, [data-theme="dark"]');
        for (var i = 0; i < darkElements.length; i++) {
            var rect = darkElements[i].getBoundingClientRect();
            if (rect.top <= probeY && rect.bottom >= probeY) {
                isDark = true;
                break;
            }
        }

        if (isDark) {
            header.classList.add('is-on-dark');
            header.classList.remove('is-on-light');
        } else {
            header.classList.add('is-on-light');
            header.classList.remove('is-on-dark');
        }
    }

    window.addEventListener('scroll', updateAdaptiveHeader, { passive: true });
    window.addEventListener('resize', updateAdaptiveHeader);
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateAdaptiveHeader);
    } else {
        updateAdaptiveHeader();
    }
    setTimeout(updateAdaptiveHeader, 50);
    setTimeout(updateAdaptiveHeader, 200);
})();
</script>`;

headerContent = headerContent.replace(/<script id="hb-header-adaptive-script">[\s\S]*?<\/script>/, newScript);
fs.writeFileSync(headerPath, headerContent, 'utf8');
console.log('Updated header-nesports.php');


// 3. UPDATE nesports-frontend.css
const cssPath = 'nesports-pro-store/assets/css/nesports-frontend.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Replace end-of-file overrides
const endOverrideTarget = /\/\* ========================================================\s*V36 ENFORCED RULES[\s\S]*$/;
const newEndOverrides = `/* ========================================================
   V37 ENFORCED RULES: FIXED TOPBAR & STATIC FIXED ADAPTIVE HEADER
   ======================================================== */
.hb-topbar {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    height: 36px !important;
    min-height: 36px !important;
    max-height: 36px !important;
    z-index: 1002 !important;
    background: #141518 !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
    box-sizing: border-box !important;
}
body.admin-bar .hb-topbar {
    top: 32px !important;
}
@media screen and (max-width: 782px) {
    body.admin-bar .hb-topbar {
        top: 46px !important;
    }
}

.hb-header,
.hb-header--fixed,
.hb-header--static {
    position: fixed !important;
    top: 36px !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    background: transparent !important;
    background-color: transparent !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    box-shadow: none !important;
    z-index: 1000 !important;
    transition: background 0.2s ease, border-color 0.2s ease !important;
}
body.admin-bar .hb-header,
body.admin-bar .hb-header--fixed,
body.admin-bar .hb-header--static {
    top: calc(36px + 32px) !important;
}
@media screen and (max-width: 782px) {
    body.admin-bar .hb-header,
    body.admin-bar .hb-header--fixed,
    body.admin-bar .hb-header--static {
        top: calc(36px + 46px) !important;
    }
}

/* 1. DARK BACKGROUND: White text/icons, White logo letters */
.hb-header.is-on-dark .hb-nav .hb-menu > li > a {
    color: #ffffff !important;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
}
.hb-header.is-on-dark .hb-nav .hb-menu > li > a:hover,
.hb-header.is-on-dark .hb-nav .hb-menu > li > a.hb-nav-active {
    color: #e11d48 !important;
}
.hb-header.is-on-dark .hb-cart-total-text {
    color: #ffffff !important;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
}
.hb-header.is-on-dark .hb-icon-btn,
.hb-header.is-on-dark .hb-icon-btn i,
.hb-header.is-on-dark .hb-cart-icon-box i {
    color: #ffffff !important;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5) !important;
}
.hb-header.is-on-dark .hb-mobile-btn span {
    background-color: #ffffff !important;
}
.hb-header.is-on-dark .hb-logo .hb-logo-letters,
.hb-header.is-on-dark .hb-logo g[fill="#080808"],
.hb-header.is-on-dark .hb-logo g.hb-logo-letters {
    fill: #ffffff !important;
}

/* 2. LIGHT BACKGROUND: Dark text/icons, Black logo letters */
.hb-header.is-on-light .hb-nav .hb-menu > li > a {
    color: #111111 !important;
    text-shadow: none !important;
}
.hb-header.is-on-light .hb-nav .hb-menu > li > a:hover,
.hb-header.is-on-light .hb-nav .hb-menu > li > a.hb-nav-active {
    color: #e11d48 !important;
}
.hb-header.is-on-light .hb-cart-total-text {
    color: #111111 !important;
    text-shadow: none !important;
}
.hb-header.is-on-light .hb-icon-btn,
.hb-header.is-on-light .hb-icon-btn i,
.hb-header.is-on-light .hb-cart-icon-box i {
    color: #111111 !important;
    text-shadow: none !important;
}
.hb-header.is-on-light .hb-mobile-btn span {
    background-color: #111111 !important;
}
.hb-header.is-on-light .hb-logo .hb-logo-letters,
.hb-header.is-on-light .hb-logo g[fill="#080808"],
.hb-header.is-on-light .hb-logo g.hb-logo-letters {
    fill: #080808 !important;
}

/* Red accents preserved everywhere */
.hb-logo .hb-logo-red,
.hb-logo g[fill="#F00012"],
.hb-logo g.hb-logo-red {
    fill: #F00012 !important;
}

/* Bundles strictly 1 single horizontal row with arrows */
.hb-bundles-carousel-wrap {
    position: relative !important;
    width: 100% !important;
    overflow: hidden !important;
}
.hb-bundles-section .hb-bundles-track,
.hb-bundles-section .hb-cards {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    gap: 20px !important;
    overflow-x: auto !important;
    scroll-behavior: smooth !important;
    scroll-snap-type: x mandatory !important;
    -webkit-overflow-scrolling: touch !important;
    scrollbar-width: none !important;
    padding: 4px 2px 18px !important;
    margin: 0 !important;
    width: 100% !important;
}
.hb-bundles-section .hb-bundles-track::-webkit-scrollbar,
.hb-bundles-section .hb-cards::-webkit-scrollbar {
    display: none !important;
}
.hb-bundles-section .hb-bundles-track .hb-card,
.hb-bundles-section .hb-cards .hb-card {
    flex: 0 0 calc((100% - 80px) / 5) !important;
    min-width: 220px !important;
    max-width: 280px !important;
    width: auto !important;
    scroll-snap-align: start !important;
    box-sizing: border-box !important;
}
@media (max-width: 1200px) {
    .hb-bundles-section .hb-bundles-track .hb-card,
    .hb-bundles-section .hb-cards .hb-card {
        flex: 0 0 calc((100% - 60px) / 4) !important;
    }
}
@media (max-width: 900px) {
    .hb-bundles-section .hb-bundles-track .hb-card,
    .hb-bundles-section .hb-cards .hb-card {
        flex: 0 0 calc((100% - 40px) / 3) !important;
    }
}
@media (max-width: 650px) {
    .hb-bundles-section .hb-bundles-track .hb-card,
    .hb-bundles-section .hb-cards .hb-card {
        flex: 0 0 calc((100% - 20px) / 2) !important;
        min-width: 160px !important;
    }
}
`;

if (endOverrideTarget.test(cssContent)) {
    cssContent = cssContent.replace(endOverrideTarget, newEndOverrides);
} else {
    cssContent += '\n' + newEndOverrides;
}

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log('Updated nesports-frontend.css');

console.log('=== V37 Preparation Complete ===');
