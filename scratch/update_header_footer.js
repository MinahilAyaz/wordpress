const fs = require('fs');
const path = require('path');

// 1. Update header-nesports.php
const headerPath = path.join(__dirname, '..', 'nesports-pro-store', 'templates', 'header-nesports.php');
let headerContent = fs.readFileSync(headerPath, 'utf8');

headerContent = headerContent.replace(
    /\$announcement\s*=\s*'Free shipping on All DE orders over 150€';/,
    `$announcement = nesports_setting('announcement_text', 'Free shipping on All DE orders over 150€');`
);

const headMetaBlock = `    <title><?php $seo_t = nesports_setting('seo_site_title', ''); echo !empty($seo_t) ? esc_html($seo_t) : wp_title('|', false, 'right'); ?></title>
    <?php $seo_d = nesports_setting('seo_meta_desc', ''); if (!empty($seo_d)): ?><meta name="description" content="<?php echo esc_attr($seo_d); ?>"><?php endif; ?>
    <?php $seo_k = nesports_setting('seo_keywords', ''); if (!empty($seo_k)): ?><meta name="keywords" content="<?php echo esc_attr($seo_k); ?>"><?php endif; ?>
    <style>:root{--hb-accent:<?php echo esc_attr(nesports_setting('accent_color', '#e11d48')); ?> !important;--hb-heading-color:<?php echo esc_attr(nesports_setting('heading_color', '#111111')); ?> !important;--hb-text-color:<?php echo esc_attr(nesports_setting('text_color', '#4b5563')); ?> !important;}.hb-topbar{background:<?php echo esc_attr(nesports_setting('topbar_bg', '#141518')); ?> !important;}</style>`;

headerContent = headerContent.replace(
    /<title><\?php wp_title\('\|', true, 'right'\); \?><\/title>/,
    headMetaBlock
);

fs.writeFileSync(headerPath, headerContent, 'utf8');
console.log('Updated header-nesports.php successfully!');

// 2. Update footer-nesports.php
const footerPath = path.join(__dirname, '..', 'nesports-pro-store', 'templates', 'footer-nesports.php');
let footerContent = fs.readFileSync(footerPath, 'utf8');

footerContent = footerContent.replace(
    /\$phone\s*=\s*!empty\(\$settings\['support_phone'\]\)\s*\?\s*\$settings\['support_phone'\]\s*:\s*'\+1 \(800\) 555-0199';/,
    `$phone = nesports_setting('support_phone', '+1 (800) 555-0199');`
);

footerContent = footerContent.replace(
    /\$email\s*=\s*!empty\(\$settings\['support_email'\]\)\s*\?\s*\$settings\['support_email'\]\s*:\s*'support@nesports3\.com';/,
    `$email = nesports_setting('support_email', 'support@nesports3.com');`
);

footerContent = footerContent.replace(
    /<span>&copy;\s*<\?php echo date\('Y'\);\s*\?>\s*NESPORTS3\.\s*All rights reserved\.<\/span>/,
    `<span><?php echo esc_html(nesports_setting('footer_copyright', '© ' . date('Y') . ' NESPORTS3. All rights reserved.')); ?></span>`
);

fs.writeFileSync(footerPath, footerContent, 'utf8');
console.log('Updated footer-nesports.php successfully!');
