const fetch = globalThis.fetch;

(async () => {
  const homeRes = await fetch('https://www.nesports3.com/?nocache=' + Date.now());
  const homeHtml = await homeRes.text();
  console.log('Homepage status:', homeRes.status);
  console.log('Login icon present on homepage:', homeHtml.includes('hb-auth-icon-trigger'));
  console.log('Auth drawer present on homepage:', homeHtml.includes('hb-side-drawer'));

  const prodRes = await fetch('https://www.nesports3.com/product/elbow-wrap/?nocache=' + Date.now());
  const prodHtml = await prodRes.text();
  console.log('Product page status:', prodRes.status);
  console.log('Product add-to-cart has /checkout/ redirect:', prodHtml.includes('/checkout/'));
  console.log('Login icon present on product page:', prodHtml.includes('hb-auth-icon-trigger'));

  const checkRes = await fetch('https://www.nesports3.com/checkout/?nocache=' + Date.now());
  const checkHtml = await checkRes.text();
  console.log('Checkout page status:', checkRes.status);
  console.log('Checkout has Direct Payment Methods:', checkHtml.includes('Direct Payment Method'));
  console.log('Checkout has Credit Card Option:', checkHtml.includes('Credit or Debit Card'));
  console.log('Checkout has PayPal Option:', checkHtml.includes('PayPal'));
  console.log('Checkout has Guest Express:', checkHtml.includes('No Account or Login Required'));
})();
