const fs = require('fs');
const path = require('path');

console.log('=== Preparing V36: Static Fixed Adaptive Header ===');

// 1. UPDATE header-nesports.php
const headerPath = 'nesports-pro-store/templates/header-nesports.php';
let headerContent = fs.readFileSync(headerPath, 'utf8');

const styleTarget = /<style id="nesports-mobile-nav-fix">[\s\S]*?<\/style>/;
const newHeaderStyle = `<style id="nesports-mobile-nav-fix">
    /* Global Transparent Fixed Header Architecture */
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
        /* No top transition to guarantee 100% rock-solid static tracking */
        transition: background 0.2s ease, border-color 0.2s ease !important;
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
       1. ON DARK BACKGROUND (Hero, Dark Banners)
       Text & Icons WHITE, Logo Letters WHITE, Red stays Red
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

    /* Logo on Dark Background: Letters "N" and "S3" are White */
    .hb-header.is-on-dark .hb-logo .hb-logo-letters,
    .hb-header.is-on-dark .hb-logo g[fill="#080808"],
    .hb-header.is-on-dark .hb-logo g.hb-logo-letters {
        fill: #ffffff !important;
    }

    /* ========================================================
       2. ON LIGHT BACKGROUND (Top Sellers, Bundles, Clothing, etc.)
       Text & Icons DARK BLACK, Logo Letters BLACK, Red stays Red
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

    /* Logo on Light Background: Letters "N" and "S3" are Deep Black */
    .hb-header.is-on-light .hb-logo .hb-logo-letters,
    .hb-header.is-on-light .hb-logo g[fill="#080808"],
    .hb-header.is-on-light .hb-logo g.hb-logo-letters {
        fill: #080808 !important;
    }

    /* Shared Red Logo Accents & Cart Badge */
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
    function updateHeaderOnScroll() {
        var header = document.getElementById('hb-main-header');
        if (!header) return;

        var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        
        // 1. Rock-solid static & fixed position tracking
        var topbar = document.querySelector('.hb-topbar');
        var topbarHeight = topbar ? topbar.offsetHeight : 36;
        var adminBar = document.getElementById('wpadminbar');
        var adminBarHeight = adminBar ? adminBar.offsetHeight : (document.body.classList.contains('admin-bar') ? (window.innerWidth <= 782 ? 46 : 32) : 0);
        
        var offsetTop = Math.max(0, topbarHeight - scrollY) + adminBarHeight;
        header.style.top = offsetTop + 'px';
        
        if (scrollY > topbarHeight) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }

        // 2. High-precision Dark vs Light Background detection
        var hero = document.getElementById('hb-hero') || document.querySelector('.hb-hero');
        var heroBottom = hero ? (hero.offsetTop + hero.offsetHeight) : 0;
        
        var banner = document.querySelector('.hb-static-banner');
        var bannerTop = banner ? banner.offsetTop : 999999;
        var bannerBottom = banner ? (banner.offsetTop + banner.offsetHeight) : 999999;

        var headerHeight = header.offsetHeight || 60;
        var probePoint = scrollY + offsetTop + (headerHeight / 2);

        var isDark = false;
        // Check if header is over Hero
        if (hero && probePoint <= heroBottom) {
            isDark = true;
        }
        // Check if header is over mid-page Dark Banner
        else if (banner && probePoint >= bannerTop && probePoint <= bannerBottom) {
            isDark = true;
        }

        if (isDark) {
            header.classList.add('is-on-dark');
            header.classList.remove('is-on-light');
        } else {
            header.classList.add('is-on-light');
            header.classList.remove('is-on-dark');
        }
    }

    window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
    window.addEventListener('resize', updateHeaderOnScroll);
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateHeaderOnScroll);
    } else {
        updateHeaderOnScroll();
    }
    setTimeout(updateHeaderOnScroll, 50);
    setTimeout(updateHeaderOnScroll, 200);
})();
</script>`;

headerContent = headerContent.replace(/<script id="hb-header-adaptive-script">[\s\S]*?<\/script>/, newScript);
fs.writeFileSync(headerPath, headerContent, 'utf8');
console.log('Updated header-nesports.php');


// 3. UPDATE nesports-frontend.css
const cssPath = 'nesports-pro-store/assets/css/nesports-frontend.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Remove rogue lines:
cssContent = cssContent.replace(
    /\.hb-header \.hb-nav \.hb-menu > li > a,\s*\.hb-header \.hb-cart-total-text,\s*\.hb-header \.hb-icon-btn,\s*\.hb-header \.hb-mobile-btn\s*\{[\s\S]*?text-shadow:\s*0 1px 3px rgba\(0,0,0,0\.5\) !important;\s*\}\s*\.hb-header \.hb-nav \.hb-menu > li > a\.hb-nav-active\s*\{[\s\S]*?color:\s*#e11d48 !important;\s*\}/,
    `/* Cleaned up rogue white overrides */`
);

cssContent = cssContent.replace(
    /\.hb-logo \.hb-logo-letters\s*\{\s*fill:\s*#FFFFFF !important;\s*\}/,
    `/* Cleaned up rogue white logo fill */`
);

// Replace end-of-file overrides
const endOverrideTarget = /\/\* ========================================================\s*V35 ENFORCED RULES[\s\S]*$/;
const newEndOverrides = `/* ========================================================
   V36 ENFORCED RULES: STATIC FIXED ADAPTIVE HEADER & 1-ROW BUNDLES
   ======================================================== */
.hb-header,
.hb-header--fixed,
.hb-header--static {
    position: fixed !important;
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

console.log('=== V36 Preparation Complete ===');
