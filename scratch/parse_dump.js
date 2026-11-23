const fs = require('fs');
const html = fs.readFileSync('scratch/install_dump.html', 'utf8');
const formMatch = html.match(/<form[^>]*action="[^"]*update\.php[^"]*"[^>]*>([\s\S]*?)<\/form>/i);
if (formMatch) {
    console.log('Upload form found:');
    console.log(formMatch[0]);
} else {
    console.log('Searching form with upload-plugin:');
    const f = html.match(/<form[^>]*class="upload-plugin-form"[^>]*>([\s\S]*?)<\/form>/i);
    console.log(f ? f[0] : 'no form found');
}
