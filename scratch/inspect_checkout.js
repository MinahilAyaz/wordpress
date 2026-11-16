const fetch = globalThis.fetch;

(async () => {
    const res = await fetch('https://www.nesports3.com/checkout/');
    const html = await res.text();
    console.log('Status:', res.status);
    console.log('Has cart-empty:', html.includes('cart-empty'));
    console.log('Has payment:', html.includes('payment_methods') || html.includes('order_review'));
    const formMatch = html.match(/<form[^>]+class="[^"]*checkout[^"]*"[^>]*>/i);
    console.log('Checkout form:', formMatch ? formMatch[0] : 'None');
})();
