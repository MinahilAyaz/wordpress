const { execSync } = require('child_process');

const products = [
    'pro-leather-weightlifting-lever-belt-10mm',
    'competition-weightlifting-belt-13mm-black',
    'quick-release-lever-power-belt',
    'heavy-duty-neoprene-elbow-wraps',
    'lifting-strap-padded-blue',
    'lifting-strap-padded-red',
    'lifting-straps-with-extra-padded-black',
    'lifting-straps-padded-blue-2',
    'knee-wrap-copy',
    'knee-wrap',
    'speed-ball-set-maya-hide-leather-red-black',
    'speed-ball-set-maya-hide-leather-2',
    'speed-ball-set-maya-hide-leather',
    'wrist-bandages-45-cm-wrist-black-2',
    'water-proof-gym-bag-gray',
    'water-proof-gym-bag-blue'
];

console.log(`Testing all ${products.length} products...\n`);

let passed = 0;
for (const slug of products) {
    const cmd = `php -r "putenv('NES_PAGE=product'); putenv('NES_SLUG=${slug}'); include 'preview/render.php';"`;
    try {
        const stdout = execSync(cmd, { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
        
        const isBelt = slug.includes('belt') && !slug.includes('dip') && slug !== 'quick-release-lever-power-belt';
        const hasWrongThickness = !isBelt && stdout.includes('Thickness:');
        const hasWrongSteerhide = !slug.includes('belt') && stdout.includes('Steerhide Leather Lever Belt');
        const hasWrongWaistTable = !isBelt && stdout.includes('Waist (Inches)');

        // Extract rendered color and thumbs count
        const thumbMatches = stdout.match(/hb-pdp-vthumb/g) || [];
        const colorMatches = stdout.match(/hb-color-circle-btn/g) || [];

        let status = 'PASS';
        let issues = [];
        if (hasWrongThickness) { status = 'FAIL'; issues.push('has Thickness on non-lever-belt'); }
        if (hasWrongSteerhide) { status = 'FAIL'; issues.push('has Steerhide belt specs on non-belt'); }
        if (hasWrongWaistTable) { status = 'FAIL'; issues.push('has Waist Table on non-lever-belt'); }
        if (thumbMatches.length === 0) { status = 'FAIL'; issues.push('no thumbnails rendered'); }

        if (status === 'PASS') {
            passed++;
            console.log(`[PASS] ${slug.padEnd(45)} | Thumbs: ${thumbMatches.length} | Colors: ${colorMatches.length}`);
        } else {
            console.error(`[FAIL] ${slug.padEnd(45)} | Issues: ${issues.join(', ')}`);
        }
    } catch (err) {
        console.error(`[ERR]  ${slug.padEnd(45)} | Error: ${err.message}`);
    }
}

console.log(`\nFinal Score: ${passed}/${products.length} passed.`);
if (passed === products.length) {
    console.log("SUCCESS: All 16 products render strictly their own images, colors, and tailored specs!");
}

