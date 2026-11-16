const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootSvg = fs.readFileSync('header_logo.svg', 'utf8');

// Extract path 0 (red) and path 1 (black)
const d0Match = rootSvg.match(/<path\s+fill="#E0002A"[^>]*d="([^"]+)"/);
const d1Match = rootSvg.match(/<path\s+fill="#000000"[^>]*d="([^"]+)"/);

if (!d0Match || !d1Match) {
  console.error('Failed to extract paths from header_logo.svg');
  process.exit(1);
}

const dRed = d0Match[1];
const dBlack = d1Match[1];

// Math scaling: map [248, 261, 2750, 990] to [0, 0, 2048, 682]
const s = 682 / 990;
const padLeft = (2048 - (2750 * s)) / 2;

const finalSvg = `<svg xmlns="http://www.w3.org/2000/svg"
     width="2048"
     height="682"
     viewBox="0 0 2048 682">

  <title>NESPORTS3 Sports Logo</title>

  <!-- RED RUNNER AND SPORTS LETTERS -->
  <g class="hb-logo-red" fill="#F00012" fill-rule="evenodd" transform="translate(${padLeft.toFixed(2)}, 0) scale(${s.toFixed(6)}) translate(-248, -261)">
    <path d="${dRed}" />
  </g>

  <!-- BLACK / CONTRAST LETTERS (WHITE ON DARK HEADER) -->
  <g class="hb-logo-letters" fill="#FFFFFF" fill-rule="evenodd" transform="translate(${padLeft.toFixed(2)}, 0) scale(${s.toFixed(6)}) translate(-248, -261)">
    <path d="${dBlack}" />
  </g>
</svg>`;

// Save SVGs
const storeImagesDir = path.join(__dirname, '../nesports-pro-store/assets/images');
fs.writeFileSync(path.join(storeImagesDir, 'header-logo.svg'), finalSvg, 'utf8');
fs.writeFileSync(path.join(storeImagesDir, 'logo-1.svg'), finalSvg, 'utf8');
console.log('Saved header-logo.svg and logo-1.svg');

// Also save 4K high-res PNGs
(async () => {
  const pngBuf = await sharp(Buffer.from(finalSvg)).png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(storeImagesDir, 'header-logo.png'), pngBuf);
  fs.writeFileSync(path.join(storeImagesDir, 'logo-1.png'), pngBuf);
  console.log('Saved high-res header-logo.png and logo-1.png (2048x682)');

  // 1. Update header-nesports.php
  const headerPhpPath = path.join(__dirname, '../nesports-pro-store/templates/header-nesports.php');
  let headerPhp = fs.readFileSync(headerPhpPath, 'utf8');

  // Replace <style id="nesports-mobile-nav-fix"> content with transparent fixed architecture
  const styleStart = headerPhp.indexOf('<style id="nesports-mobile-nav-fix">');
  const styleEnd = headerPhp.indexOf('</style>', styleStart);

  if (styleStart !== -1 && styleEnd !== -1) {
    const newStyle = `<style id="nesports-mobile-nav-fix">
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
        backdrop-filter: blur(8px) !important;
        -webkit-backdrop-filter: blur(8px) !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
        box-shadow: none !important;
        z-index: 1000 !important;
        transition: background 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                    top 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                    box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                    border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    /* Fixed Scrolled State (Ultra-premium dark glass over white body content) */
    .hb-header.is-scrolled {
        top: 0 !important;
        background: rgba(10, 12, 16, 0.88) !important;
        background-color: rgba(10, 12, 16, 0.88) !important;
        backdrop-filter: blur(20px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35) !important;
    }

    /* Admin Bar Offsets */
    body.admin-bar .hb-header {
        top: calc(36px + 32px) !important;
    }
    body.admin-bar .hb-header.is-scrolled {
        top: 32px !important;
    }
    @media screen and (max-width: 782px) {
        body.admin-bar .hb-header {
            top: calc(36px + 46px) !important;
        }
        body.admin-bar .hb-header.is-scrolled {
            top: 46px !important;
        }
    }

    /* Nav Links, Icons, Cart text on Transparent/Dark Header */
    .hb-header .hb-nav .hb-menu > li > a,
    .hb-header .hb-cart-total-text,
    .hb-header .hb-icon-btn,
    .hb-header .hb-mobile-btn {
        color: #ffffff !important;
        text-shadow: 0 1px 3px rgba(0,0,0,0.5) !important;
    }
    .hb-header .hb-nav .hb-menu > li > a.hb-nav-active {
        color: #e11d48 !important;
    }

    /* Hero Section: sits under transparent header */
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
        height: 46px !important;
        width: auto !important;
        max-width: 175px !important;
        display: block !important;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35)) !important;
        shape-rendering: geometricPrecision !important;
        text-rendering: geometricPrecision !important;
    }
    .hb-logo img {
        height: 46px !important;
        width: auto !important;
        max-width: 175px !important;
        display: block !important;
        object-fit: contain !important;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35)) !important;
    }
    .hb-logo .hb-logo-red {
        fill: #F00012 !important;
    }
    .hb-logo .hb-logo-letters {
        fill: #FFFFFF !important;
    }

    /* Mobile Header Layout (Prevents Overlap) */
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
    }`;

    headerPhp = headerPhp.slice(0, styleStart) + newStyle + headerPhp.slice(styleEnd);
    console.log('Updated <style id="nesports-mobile-nav-fix"> in header-nesports.php');
  }

  // Update <header> tag to be hb-header--fixed
  headerPhp = headerPhp.replace(
    /<header class="hb-header[^"]*" id="hb-main-header">/,
    '<header class="hb-header hb-header--fixed" id="hb-main-header">'
  );

  // Update logo inside <a class="hb-logo">
  const logoAnchorStart = headerPhp.indexOf('<a class="hb-logo"');
  const logoAnchorEnd = headerPhp.indexOf('</a>', logoAnchorStart);

  if (logoAnchorStart !== -1 && logoAnchorEnd !== -1) {
    const newLogoAnchor = `<a class="hb-logo" href="<?php echo esc_url(home_url('/')); ?>" aria-label="NESPORTS3">
            ${finalSvg}
        </a>`;
    headerPhp = headerPhp.slice(0, logoAnchorStart) + newLogoAnchor + headerPhp.slice(logoAnchorEnd + 4);
    console.log('Inlined exact high-resolution vector SVG inside .hb-logo');
  }

  fs.writeFileSync(headerPhpPath, headerPhp, 'utf8');
  console.log('Saved header-nesports.php');

  // 2. Update nesports-frontend.css
  const cssPath = path.join(__dirname, '../nesports-pro-store/assets/css/nesports-frontend.css');
  let css = fs.readFileSync(cssPath, 'utf8');

  // Add the transparent fixed header rules
  css += `
/* ==========================================================================
   TRANSPARENT FIXED HEADER ARCHITECTURE (V32)
   ========================================================================== */
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
    backdrop-filter: blur(8px) !important;
    -webkit-backdrop-filter: blur(8px) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
    box-shadow: none !important;
    z-index: 1000 !important;
}

.hb-header.is-scrolled {
    top: 0 !important;
    background: rgba(10, 12, 16, 0.88) !important;
    background-color: rgba(10, 12, 16, 0.88) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35) !important;
}

body.admin-bar .hb-header {
    top: calc(36px + 32px) !important;
}
body.admin-bar .hb-header.is-scrolled {
    top: 32px !important;
}
@media screen and (max-width: 782px) {
    body.admin-bar .hb-header {
        top: calc(36px + 46px) !important;
    }
    body.admin-bar .hb-header.is-scrolled {
        top: 46px !important;
    }
}

.hb-header .hb-nav .hb-menu > li > a,
.hb-header .hb-cart-total-text,
.hb-header .hb-icon-btn,
.hb-header .hb-mobile-btn {
    color: #ffffff !important;
    text-shadow: 0 1px 3px rgba(0,0,0,0.5) !important;
}
.hb-header .hb-nav .hb-menu > li > a.hb-nav-active {
    color: #e11d48 !important;
}

.hb-hero {
    margin-top: 0 !important;
    padding-top: 0 !important;
}

.hb-logo {
    display: inline-flex !important;
    align-items: center !important;
    line-height: 1 !important;
}
.hb-logo svg {
    height: 46px !important;
    width: auto !important;
    max-width: 175px !important;
    display: block !important;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35)) !important;
    shape-rendering: geometricPrecision !important;
    text-rendering: geometricPrecision !important;
}
.hb-logo img {
    height: 46px !important;
    width: auto !important;
    max-width: 175px !important;
    display: block !important;
    object-fit: contain !important;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35)) !important;
}
.hb-logo .hb-logo-red {
    fill: #F00012 !important;
}
.hb-logo .hb-logo-letters {
    fill: #FFFFFF !important;
}
`;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Saved nesports-frontend.css');

  // 3. Update nesports-frontend.js (Enable fixed scroll state)
  const jsPath = path.join(__dirname, '../nesports-pro-store/assets/js/nesports-frontend.js');
  let js = fs.readFileSync(jsPath, 'utf8');

  const scrollHandlerJs = `    // Transparent Fixed Header on Scroll (V32)
    var header = document.getElementById('hb-main-header');
    if (header) {
        var handleScroll = function () {
            var scrollY = window.scrollY || window.pageYOffset || 0;
            if (scrollY > 36) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }`;

  if (js.includes('Header is static - no sticky fixed scroll listener needed')) {
    js = js.replace(
      /\/\/ Header is static - no sticky fixed scroll listener needed[\s\S]*?header\.classList\.remove\('is-sticky', 'is-scrolled'\);\s*\}/,
      scrollHandlerJs
    );
    console.log('Updated scroll listener in nesports-frontend.js');
  } else {
    js += '\n' + scrollHandlerJs + '\n';
  }

  fs.writeFileSync(jsPath, js, 'utf8');
  console.log('Saved nesports-frontend.js');
})();
