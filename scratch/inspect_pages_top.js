const fs = require('fs');

['page-product.php', 'page-category.php'].forEach(f => {
    const p = 'nesports-pro-store/templates/' + f;
    if (fs.existsSync(p)) {
        const c = fs.readFileSync(p, 'utf8');
        console.log(f, c.slice(0, 300));
    }
});
