(async () => {
    const list = [
        'clothing/Lift-The-World-T-Shirt-Red-Detail.jpg',
        'clothing/Lift-The-World-T-Shirt-Red-Lower.jpg',
        'clothing/Red Pro Coach Iron Tee Back Print.png',
        'clothing/Procoach-Red-Detail.jpg',
        'clothing/Procoach-Red-Lower.jpg',
        'clothing/Lift-The-World-T-Shirt-Black-Detail.jpg',
        'clothing/Lift-The-World-T-Shirt-Black-Lower.jpg',
        'clothing/Vintage Navy Pro Coach T-Shirt Graphic.png',
        'clothing/Procoach-Navy-Detail.jpg',
        'clothing/Procoach-Navy-Lower.jpg',
        'clothing/Procoach-T-Shirt-Green.png',
        'clothing/Procoach-Green-Detail.jpg',
    ];
    for (const f of list) {
        const url = 'https://www.nesports3.com/wp-content/plugins/nesports-pro/assets/images/' + encodeURI(f);
        const res = await fetch(url, { method: 'HEAD' });
        console.log(f, res.status);
    }
})();
