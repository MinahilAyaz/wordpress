(async () => {
    const res = await fetch('https://www.nesports3.com');
    const data = await res.text();
    const colorIdx = data.indexOf('id="shop-by-color"');
    const colorHtml = data.substring(colorIdx, data.indexOf('</section>', colorIdx));
    const dotsWrapCount = (colorHtml.match(/class="hb-card-dots-wrap"/g) || []).length;
    const dotCount = (colorHtml.match(/class="hb-card-dot/g) || []).length;
    const cardsCount = (colorHtml.match(/class="hb-color-card/g) || []).length;
    console.log("Total cards in Shop by Color:", cardsCount);
    console.log("Total dots wraps in Shop by Color:", dotsWrapCount);
    console.log("Total individual dots in Shop by Color:", dotCount);
})();
