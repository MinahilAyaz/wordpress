const fs = require('fs');

// 1. section-bundles.php
let bundles = fs.readFileSync('nesports-pro-store/templates/sections/section-bundles.php', 'utf8');
const bundlesCss = `
    @media (max-width: 991px) {
        .hb-bundles-header {
            text-align: center !important;
            width: 100% !important;
        }
        .hb-bundles-title {
            text-align: center !important;
            width: 100% !important;
            margin: 0 auto 16px auto !important;
        }
        .hb-bundles-pills {
            justify-content: center !important;
        }
    }
    </style>`;
bundles = bundles.replace('</style>', bundlesCss);
fs.writeFileSync('nesports-pro-store/templates/sections/section-bundles.php', bundles, 'utf8');
console.log('section-bundles.php updated with center heading CSS!');

// 2. section-clothing.php
let clothing = fs.readFileSync('nesports-pro-store/templates/sections/section-clothing.php', 'utf8');
const clothingCss = `
    @media (max-width: 991px) {
        .hb-clothing-header {
            justify-content: center !important;
            text-align: center !important;
            width: 100% !important;
        }
        .hb-clothing-title {
            text-align: center !important;
            width: 100% !important;
            margin: 0 auto !important;
        }
    }
    </style>`;
clothing = clothing.replace('</style>', clothingCss);
fs.writeFileSync('nesports-pro-store/templates/sections/section-clothing.php', clothing, 'utf8');
console.log('section-clothing.php updated with center heading CSS!');

// 3. section-categories.php
let categories = fs.readFileSync('nesports-pro-store/templates/sections/section-categories.php', 'utf8');
const categoriesCss = `
    @media (max-width: 991px) {
        .hb-top-sellers-title {
            text-align: center !important;
            width: 100% !important;
            grid-column: 1 / -1 !important;
            margin: 0 auto 12px auto !important;
        }
        .hb-top-sellers-header {
            justify-content: center !important;
            text-align: center !important;
        }
    }
    </style>`;
categories = categories.replace('</style>', categoriesCss);
fs.writeFileSync('nesports-pro-store/templates/sections/section-categories.php', categories, 'utf8');
console.log('section-categories.php updated with center heading CSS!');

// 4. section-color.php
let color = fs.readFileSync('nesports-pro-store/templates/sections/section-color.php', 'utf8');
const colorCss = `
    @media (max-width: 991px) {
        .hb-color-title-wrap {
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
        }
        .hb-color-title {
            text-align: center !important;
            width: 100% !important;
            margin: 0 auto 16px auto !important;
        }
        .hb-color-nav {
            justify-content: center !important;
        }
    }
    </style>`;
color = color.replace('</style>', colorCss);
fs.writeFileSync('nesports-pro-store/templates/sections/section-color.php', color, 'utf8');
console.log('section-color.php updated with center heading CSS!');

// 5. nesports-frontend.css
let mainCss = fs.readFileSync('nesports-pro-store/assets/css/nesports-frontend.css', 'utf8');
const heroMobileCss = `
/* Mobile & Tablet Headings Center Alignment (Matching User 2nd SS Request) */
@media (max-width: 991px) {
    .hb-hero-slide .hb-hero-caption,
    .hb-hero-slide--photo .hb-hero-caption,
    .hb-hero-slide--product .hb-hero-caption,
    .hb-hero-slide--split .hb-hero-caption {
        align-items: center !important;
        text-align: center !important;
        margin: 0 auto !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        padding-left: 20px !important;
        padding-right: 20px !important;
        box-sizing: border-box !important;
    }
    .hb-hero-sub,
    .hb-hero-title,
    .hb-hero-desc {
        text-align: center !important;
        width: 100% !important;
    }
    .hb-hero-bottom-row {
        justify-content: center !important;
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 10px !important;
        width: 100% !important;
    }
    .hb-top-sellers-title {
        text-align: center !important;
        width: 100% !important;
    }
    .hb-bundles-title {
        text-align: center !important;
        width: 100% !important;
    }
    .hb-clothing-title {
        text-align: center !important;
        width: 100% !important;
    }
    .hb-color-title {
        text-align: center !important;
        width: 100% !important;
    }
    .hb-trustbar-sub {
        display: none !important;
    }
}
`;
mainCss += heroMobileCss;
fs.writeFileSync('nesports-pro-store/assets/css/nesports-frontend.css', mainCss, 'utf8');
console.log('nesports-frontend.css updated!');
