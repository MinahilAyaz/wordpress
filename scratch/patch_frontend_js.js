const fs = require('fs');

let js = fs.readFileSync('nesports-pro-store/assets/js/nesports-frontend.js', 'utf8');

// 1. Remove openCart from nesportsAddToCart if navigating
js = js.replace(
    /saveCart\(\);\s*renderCart\(\);\s*openCart\(\);/g,
    'saveCart();\r\n        renderCart();'
);

// 2. Update cartCheckoutBtn listener to direct redirect to /checkout/
const checkoutOld = `    // Checkout Button Action with Login Restriction & Order Creation
    var cartCheckoutBtn = document.getElementById('hb-cart-checkout-btn');
    if (cartCheckoutBtn) {
        cartCheckoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            var user = getStoredUser();
            if (!user) {
                // If not logged in, prevent checkout and open Sign In drawer
                closeCart();
                openDrawer();
                switchAuthView('login');
                showAuthAlert('Please sign in or create an account to proceed to checkout.', 'error');
                return;
            }

            if (cart.length === 0) return;

            cartCheckoutBtn.disabled = true;
            cartCheckoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> PLACING ORDER...';

            setTimeout(function() {
                var orderId = 'NES-' + Math.floor(1000 + Math.random() * 9000);
                var subtotal = 0;
                var orderItems = [];
                cart.forEach(function(ci) {
                    subtotal += ci.price * ci.qty;
                    orderItems.push({
                        name: ci.name,
                        price: ci.price,
                        qty: ci.qty,
                        img: ci.img
                    });
                });

                var now = new Date();
                var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                var dateStr = months[now.getMonth()] + ' ' + String(now.getDate()).padStart(2, '0') + ', ' + now.getFullYear();

                var newOrder = {
                    id: orderId,
                    date: dateStr,
                    status: 'Dispatched',
                    tracking: 'DHL Express #' + Math.floor(10000000 + Math.random() * 90000000),
                    items: orderItems,
                    total: subtotal
                };

                user.orders = user.orders || [];
                user.orders.unshift(newOrder);
                setStoredUser(user);

                // Update users database
                var users = getRegisteredUsers();
                for (var i = 0; i < users.length; i++) {
                    if (users[i].email.toLowerCase() === user.email.toLowerCase()) {
                        users[i].orders = user.orders;
                        break;
                    }
                }
                saveRegisteredUsers(users);

                // Clear Cart
                cart = [];
                saveCart();
                renderCart();

                cartCheckoutBtn.disabled = false;
                cartCheckoutBtn.textContent = 'CHECKOUT';

                // Close cart and open Account Order History with Success banner
                closeCart();
                openDrawer();
                switchAuthView('orders');
                showAuthAlert('Order #' + orderId + ' placed successfully! Your tracking details are active below.', 'success');
            }, 600);
        });
    }`;

const checkoutNew = `    // Checkout Button Action - Direct Payment Method (No Login)
    var cartCheckoutBtn = document.getElementById('hb-cart-checkout-btn');
    if (cartCheckoutBtn) {
        cartCheckoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/checkout/';
        });
    }`;

if (js.includes('var cartCheckoutBtn = document.getElementById(\'hb-cart-checkout-btn\');')) {
    const idx = js.indexOf('var cartCheckoutBtn = document.getElementById(\'hb-cart-checkout-btn\');');
    const endIdx = js.indexOf('document.querySelectorAll(\'.hb-card-quick-add\')', idx);
    if (idx !== -1 && endIdx !== -1) {
        js = js.substring(0, idx) + checkoutNew.trim() + '\r\n\r\n    // ' + js.substring(endIdx);
        console.log('Replaced checkout button logic with direct redirect');
    }
}

// 3. Update quick add buttons to redirect directly to /checkout/
const quickAddOld = `        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var self = this;
            var originalHTML = self.innerHTML;

            // Visual feedback
            self.classList.add('is-added');
            self.innerHTML = '<i class="fa-solid fa-check"></i> ADDED';

            window.nesportsAddToCart({
                id: self.dataset.id,
                name: self.dataset.name,
                price: parseFloat(self.dataset.price) || 0,
                img: self.dataset.img || '',
                qty: 1
            });

            setTimeout(function() {
                self.classList.remove('is-added');
                self.innerHTML = originalHTML;
            }, 1200);
        });`;

const quickAddNew = `        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var self = this;
            self.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> PROCEEDING...';

            window.nesportsAddToCart({
                id: self.dataset.id,
                name: self.dataset.name,
                price: parseFloat(self.dataset.price) || 0,
                img: self.dataset.img || '',
                qty: 1
            });

            window.location.href = '/checkout/';
        });`;

if (js.includes('self.classList.add(\'is-added\');')) {
    js = js.replace(quickAddOld.replace(/\r?\n/g, '\r\n'), quickAddNew.replace(/\r?\n/g, '\r\n'));
    console.log('Updated quick-add buttons to redirect to /checkout/');
}

fs.writeFileSync('nesports-pro-store/assets/js/nesports-frontend.js', js, 'utf8');
console.log('Saved nesports-frontend.js');
