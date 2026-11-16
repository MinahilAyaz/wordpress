const fs = require('fs');
const p = 'nesports-pro-store/includes/elementor-widgets/widget-trustbar.php';
let c = fs.readFileSync(p, 'utf8');

// Remove subtitle output from render()
c = c.replace(
  /<\?php if \(!empty\(\$item\['subtitle'\]\)\) : \?>[\s\S]*?<\?php endif; \?>/,
  ''
);

// Add inline critical CSS inside render()
c = c.replace(
  '<section class="hb-trustbar" aria-label="Store Guarantees">',
  `<section class="hb-trustbar" aria-label="Store Guarantees">
        <style>
        .hb-trustbar-sub { display: none !important; }
        .hb-trustbar-item { justify-content: center !important; }
        .hb-trustbar { padding: 16px 32px !important; }
        </style>`
);

fs.writeFileSync(p, c, 'utf8');
console.log('widget-trustbar.php updated successfully!');
