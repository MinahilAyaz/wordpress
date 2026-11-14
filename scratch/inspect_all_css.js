(async () => {
    const res = await fetch('https://www.nesports3.com/?nocache=' + Date.now());
    const html = await res.text();
    const allLinks = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(m => m[1]);
    console.log("All Stylesheets on live page:", allLinks);
    const inlineStyles = html.match(/<style[^>]*>[\s\S]*?<\/style>/g) || [];
    console.log("Count of inline style tags:", inlineStyles.length);
})();
