const fetch = globalThis.fetch;

(async () => {
  const res = await fetch('https://www.nesports3.com/checkout/?nocache=' + Date.now());
  console.log('Checkout page HTTP status:', res.status);
  const html = await res.text();
  console.log('Has Payment Methods Box:', html.includes('Direct Payment Method'));
  console.log('Has Credit Card:', html.includes('Credit or Debit Card'));
  console.log('Has PayPal:', html.includes('PayPal'));
  console.log('Has Pay Now button:', html.includes('PAY NOW'));
  console.log('Has Order Summary:', html.includes('Order Summary'));
})();
