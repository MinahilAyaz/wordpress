const fs = require('fs');
let html = fs.readFileSync('nesports-pro-store/templates/header-nesports.php', 'utf8');

// Remove auth drawer section
const startStr = '<!-- 3. Slide-Out Sign In & Account Drawer';
const endStr = '<!-- 4. Slide-Out Cart Drawer';

const startIdx = html.indexOf(startStr);
const endIdx = html.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
    html = html.substring(0, startIdx) + html.substring(endIdx);
    console.log('Removed Sign in drawer block successfully');
} else {
    console.log('Indices not found:', startIdx, endIdx);
}

// Add CSS to force hide any remaining auth elements
const cssInjection = `
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
`;

html = html.replace('</style>', cssInjection + '\n    </style>');

fs.writeFileSync('nesports-pro-store/templates/header-nesports.php', html, 'utf8');
console.log('Saved header-nesports.php');
