(async () => {
    const res = await fetch('https://www.nesports3.com/');
    const t = await res.text();
    const idx = t.indexOf('id="hb-clothing-track"');
    console.log(t.substring(idx, idx + 1400));
})();
