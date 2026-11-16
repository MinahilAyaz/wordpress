const fs = require('fs');

console.log('=== Preparing V34: Transparent Header ===');

// 1. Update header-nesports.php
const headerPath = 'nesports-pro-store/templates/header-nesports.php';
let headerContent = fs.readFileSync(headerPath, 'utf8');

// Replace header background rules
headerContent = headerContent.replace(
    /\.hb-header,\s*\.hb-header--static,\s*\.hb-header\.hb-header--static,\s*\.hb-header--fixed,\s*\.hb-header--overlay\s*\{[\s\S]*?z-index:\s*1000 !important;\s*transition:\s*top 0\.25s ease,\s*box-shadow 0\.25s ease !important;\s*\}/,
    `.hb-header,
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
        border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
        box-shadow: none !important;
        z-index: 1000 !important;
        transition: top 0.25s ease, box-shadow 0.25s ease !important;
    }`
);

headerContent = headerContent.replace(
    /\.hb-header\.is-scrolled\s*\{[\s\S]*?box-shadow:\s*0 2px 10px rgba\(0,\s*0,\s*0,\s*0\.08\) !important;\s*\}/,
    `.hb-header.is-scrolled {
        top: 0 !important;
        background: transparent !important;
        background-color: transparent !important;
        backdrop-filter: blur(16px) !important;
        -webkit-backdrop-filter: blur(16px) !important;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
        box-shadow: none !important;
    }`
);

fs.writeFileSync(headerPath, headerContent, 'utf8');
console.log('Updated header-nesports.php');

// 2. Update nesports-frontend.css
const cssPath = 'nesports-pro-store/assets/css/nesports-frontend.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Replace lines 167-178
cssContent = cssContent.replace(
    /\.hb-header,\s*\.hb-header--static,\s*\.hb-header\.hb-header--static,\s*\.hb-header--overlay,\s*\.hb-header\.is-sticky,\s*\.hb-header\.is-scrolled\s*\{[\s\S]*?z-index:\s*1000 !important;\s*\}/,
    `.hb-header,
.hb-header--static,
.hb-header.hb-header--static,
.hb-header--overlay,
.hb-header--fixed,
.hb-header.is-sticky,
.hb-header.is-scrolled {
    position: fixed !important;
    top: 36px !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    background: transparent !important;
    background-color: transparent !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
    box-shadow: none !important;
    z-index: 1000 !important;
}`
);

// Replace end-of-file overrides
cssContent = cssContent.replace(
    /\.hb-header,\s*\.hb-header--fixed,\s*\.hb-header--static\s*\{[\s\S]*?z-index:\s*1000 !important;\s*\}\s*\.hb-header\.is-scrolled\s*\{[\s\S]*?box-shadow:\s*0 2px 10px rgba\(0,\s*0,\s*0,\s*0\.08\) !important;\s*\}/,
    `.hb-header,
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
    border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
    box-shadow: none !important;
    z-index: 1000 !important;
}
.hb-header.is-scrolled {
    top: 0 !important;
    background: transparent !important;
    background-color: transparent !important;
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
    box-shadow: none !important;
}`
);

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log('Updated nesports-frontend.css');

console.log('=== V34 Preparation Complete ===');
