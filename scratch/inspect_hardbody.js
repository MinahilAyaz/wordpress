(async () => {
    const res = await fetch('https://hardbody.store/', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    const html = await res.text();
    const mediaCssRes = await fetch('https://hardbody.store/cdn/shop/t/126/assets/theme.css?v=175869218086145453181793238064');
    const css = await mediaCssRes.text();
    const matches = css.match(/\.media[^{]*\{[^}]*\}/gi) || [];
    console.log("Media matches:", matches.slice(0, 10));
    
    // Check background of product card media
    const pcmMatches = css.match(/\.product-card__media[^{]*\{[^}]*\}/gi) || [];
    console.log("product-card__media matches:", pcmMatches);
})();
