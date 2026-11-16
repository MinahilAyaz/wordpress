const fs = require('fs');

['section-hero.php', 'section-trustbar.php', 'section-banner.php', 'section-categories.php', 'section-bundles.php'].forEach(f => {
    const p = 'nesports-pro-store/templates/sections/' + f;
    if (fs.existsSync(p)) {
        const c = fs.readFileSync(p, 'utf8');
        const lines = c.split('\n');
        for (let i = 0; i < 25; i++) {
            if (lines[i] && (lines[i].includes('<section') || lines[i].includes('<div class="hb-'))) {
                console.log(f, ':', lines[i].trim());
                break;
            }
        }
    }
});
