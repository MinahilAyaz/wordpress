(async () => {
    const res = await fetch('https://www.nesports3.com/?nocache=' + Date.now());
    const html = await res.text();
    const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    console.log("HEAD CONTENT:");
    console.log(head ? head[1].substring(0, 2000) : "NO HEAD FOUND");
})();
