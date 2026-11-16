(async () => {
    const res = await fetch('https://www.nesports3.com/?v=' + Date.now());
    const html = await res.text();
    const hStart = html.indexOf('<header');
    const hEnd = html.indexOf('</header>');
    console.log(html.slice(hStart, hStart + 800));
})();
