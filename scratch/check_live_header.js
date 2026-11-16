(async () => {
    const res = await fetch('https://www.nesports3.com/?nocache=' + Date.now());
    const html = await res.text();
    const headerStart = html.indexOf('<header');
    const headerEnd = html.indexOf('</header>');
    if (headerStart !== -1 && headerEnd !== -1) {
        console.log('--- LIVE HEADER SNIPPET ---');
        console.log(html.slice(headerStart, headerStart + 600));
        console.log('...');
    } else {
        console.log('Header tag not found');
    }
})();
