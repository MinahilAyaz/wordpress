(async () => {
    const res = await fetch('https://www.nesports3.com/');
    const html = await res.text();

    console.log('--- RED TAB CHECK ---');
    console.log('norm-lift-the-world-red.jpg:', html.includes('norm-lift-the-world-red.jpg'));
    console.log('norm-pro-coach-red.jpg:', html.includes('norm-pro-coach-red.jpg'));
    console.log('norm-strength-club-red.jpg:', html.includes('norm-strength-club-red.jpg'));
    console.log('model-lift-the-world-red-sq.jpg:', html.includes('model-lift-the-world-red-sq.jpg'));
    console.log('model-pro-coach-red-sq.jpg:', html.includes('model-pro-coach-red-sq.jpg'));
    console.log('Strength-Club-Red-Model.jpg:', html.includes('Strength-Club-Red-Model.jpg'));
    console.log('hero-knee-wrap.png:', html.includes('hero-knee-wrap.png'));
    console.log('hero-lifting-straps.png:', html.includes('hero-lifting-straps.png'));

    console.log('\n--- GREEN TAB CHECK ---');
    console.log('norm-pro-coach-green.jpg:', html.includes('norm-pro-coach-green.jpg'));
    console.log('norm-pro-coach-green-front.jpg:', html.includes('norm-pro-coach-green-front.jpg'));
    console.log('model-pro-coach-green-sq.jpg:', html.includes('model-pro-coach-green-sq.jpg'));

    console.log('\n--- GREY TAB CHECK ---');
    const greyBagIdx = html.indexOf('water-proof-gym-bag-gray');
    if (greyBagIdx !== -1) {
        // Look ahead 2000 characters within this product card
        const snippet = html.substring(greyBagIdx, greyBagIdx + 2000);
        console.log('Has Gym-Bag-9-800x800.jpg (Grey):', snippet.includes('Gym-Bag-9-800x800.jpg'));
        console.log('Has Gym-Bag-1-2-800x800.jpg (Grey):', snippet.includes('Gym-Bag-1-2-800x800.jpg'));
        console.log('Has Gym-Bag-3-scaled.jpg (Grey):', snippet.includes('Gym-Bag-3-scaled.jpg'));
        console.log('Has BLUE bag (Gym-Bag-8-800x800.jpg):', snippet.includes('Gym-Bag-8-800x800.jpg'));
    } else {
        console.log('water-proof-gym-bag-gray not found');
    }
})();
