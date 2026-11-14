(async () => {
    const res = await fetch('https://www.nesports3.com/?nocache=' + Date.now());
    const html = await res.text();
    const cssLinks = [...html.matchAll(/<link[^>]*href="([^"]*nesports-frontend\.css[^"]*)"/g)].map(m => m[1]);
    console.log("CSS Links:", cssLinks);

    for (const link of cssLinks) {
        const cssRes = await fetch(link);
        const cssText = await cssRes.text();
        console.log("Fetched CSS link:", link);
        console.log("CSS length:", cssText.length);
        console.log("Has hb-category-track:", cssText.includes('hb-category-track'));
        console.log("Has flex in hb-category-track:", cssText.includes('.hb-category-track'));
        const trackRule = cssText.match(/\.hb-category-track\s*\{[^}]*\}/);
        console.log("Rule for .hb-category-track:", trackRule ? trackRule[0] : 'NOT FOUND');
    }
})();
