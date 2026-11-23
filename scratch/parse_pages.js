const { execFileSync } = require('child_process');

try {
    const raw = execFileSync('curl.exe', ['-s', 'https://www.nesports3.com/wp-json/wp/v2/pages?per_page=50'], { encoding: 'utf8' });
    const pages = JSON.parse(raw);
    console.log("Pages list:");
    for (const p of pages) {
        console.log(`- ID: ${p.id} | Title: "${p.title.rendered}" | Slug: /${p.slug}/ | Status: ${p.status} | Template: ${p.template}`);
    }
} catch(e) {
    console.error(e.message);
}
