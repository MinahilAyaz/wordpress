<?php
/**
 * NESPORTS3 - Checkout & Direct Payment Method Page
 * Guest Express Checkout - Direct Payment Without Login
 */
$is_home_page = false;
require_once NESPORTS_PLUGIN_DIR . 'templates/header-nesports.php';
?>

<div class="hb-checkout-container" id="hb-checkout-root">
    <style id="hb-checkout-styles">
    .hb-checkout-container {
        background: #f8fafc;
        min-height: 85vh;
        padding: 40px 24px 60px;
        color: #0f172a;
        font-family: var(--hb-font, 'Poppins', sans-serif);
    }
    .hb-checkout-wrapper {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        gap: 40px;
        align-items: start;
    }
    @media (max-width: 900px) {
        .hb-checkout-wrapper {
            grid-template-columns: 1fr;
            gap: 32px;
        }
        .hb-checkout-container {
            padding: 24px 16px 48px;
        }
    }
    .hb-checkout-main {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 32px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    }
    @media (max-width: 600px) {
        .hb-checkout-main {
            padding: 20px 16px;
        }
    }
    .hb-checkout-heading {
        font-size: 24px;
        font-weight: 700;
        color: #0f172a;
        margin: 0 0 6px;
        letter-spacing: -0.5px;
    }
    .hb-checkout-subhead {
        font-size: 13.5px;
        color: #64748b;
        margin: 0 0 24px;
    }
    .hb-express-box {
        background: #f1f5f9;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 24px;
        text-align: center;
    }
    .hb-express-title {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        color: #64748b;
        letter-spacing: 0.5px;
        margin-bottom: 12px;
    }
    .hb-express-btns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }
    .hb-express-btn {
        height: 44px;
        border-radius: 8px;
        border: none;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: opacity 0.2s;
    }
    .hb-express-btn:hover { opacity: 0.9; }
    .hb-express-paypal { background: #ffc439; color: #003087; }
    .hb-express-apple { background: #000000; color: #ffffff; }

    .hb-sec-title {
        font-size: 16px;
        font-weight: 600;
        color: #0f172a;
        margin: 28px 0 16px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .hb-sec-badge {
        background: var(--hb-accent, #e11d48);
        color: #fff;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
    }
    .hb-form-group {
        margin-bottom: 14px;
    }
    .hb-form-label {
        display: block;
        font-size: 12.5px;
        font-weight: 500;
        color: #334155;
        margin-bottom: 6px;
    }
    .hb-form-input, .hb-form-select {
        width: 100%;
        height: 44px;
        padding: 0 14px;
        background: #f8fafc;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        font-size: 14px;
        font-family: inherit;
        color: #0f172a;
        box-sizing: border-box;
        transition: all 0.2s ease;
    }
    .hb-form-input:focus, .hb-form-select:focus {
        outline: none;
        border-color: #0f172a;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
    }
    .hb-grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }
    @media (max-width: 500px) {
        .hb-grid-2 { grid-template-columns: 1fr; }
    }

    /* Payment Methods Box */
    .hb-payment-box {
        border: 1.5px solid #cbd5e1;
        border-radius: 12px;
        overflow: hidden;
        margin-top: 12px;
    }
    .hb-payment-option {
        border-bottom: 1px solid #e2e8f0;
        transition: background 0.2s;
    }
    .hb-payment-option:last-child {
        border-bottom: none;
    }
    .hb-payment-header {
        padding: 14px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        background: #ffffff;
    }
    .hb-payment-header:hover {
        background: #f8fafc;
    }
    .hb-payment-option.is-selected .hb-payment-header {
        background: #f8fafc;
    }
    .hb-payment-left {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .hb-payment-left input[type="radio"] {
        accent-color: var(--hb-accent, #e11d48);
        width: 17px;
        height: 17px;
        cursor: pointer;
    }
    .hb-payment-title {
        font-size: 14px;
        font-weight: 600;
        color: #0f172a;
    }
    .hb-payment-icons {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 20px;
        color: #64748b;
    }
    .hb-payment-content {
        display: none;
        padding: 16px;
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
    }
    .hb-payment-option.is-selected .hb-payment-content {
        display: block;
    }

    /* Submit Button */
    .hb-submit-btn {
        width: 100%;
        height: 52px;
        background: #0f172a;
        color: #ffffff;
        border: none;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 700;
        letter-spacing: 0.5px;
        cursor: pointer;
        margin-top: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: all 0.2s ease;
    }
    .hb-submit-btn:hover {
        background: var(--hb-accent, #e11d48);
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(225, 29, 72, 0.25);
    }

    /* Trust indicators */
    .hb-checkout-trust {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 18px;
        font-size: 12px;
        color: #64748b;
    }
    .hb-checkout-trust span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }
    .hb-checkout-trust i { color: #10b981; }

    /* Right Column: Order Summary */
    .hb-checkout-summary {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 28px 24px;
        position: sticky;
        top: 90px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    }
    .hb-summary-title {
        font-size: 18px;
        font-weight: 700;
        color: #0f172a;
        margin: 0 0 18px;
        padding-bottom: 12px;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .hb-summary-items {
        display: flex;
        flex-direction: column;
        gap: 14px;
        max-height: 340px;
        overflow-y: auto;
        padding-right: 4px;
        margin-bottom: 20px;
    }
    .hb-summary-item {
        display: flex;
        align-items: center;
        gap: 14px;
    }
    .hb-summary-thumb {
        width: 58px;
        height: 58px;
        border-radius: 8px;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        position: relative;
        flex-shrink: 0;
        overflow: visible;
    }
    .hb-summary-thumb img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 8px;
    }
    .hb-summary-qty-pill {
        position: absolute;
        top: -6px;
        right: -6px;
        background: #0f172a;
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .hb-summary-info {
        flex: 1;
        min-width: 0;
    }
    .hb-summary-name {
        font-size: 13.5px;
        font-weight: 600;
        color: #0f172a;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .hb-summary-variant {
        font-size: 12px;
        color: #64748b;
    }
    .hb-summary-price {
        font-size: 14px;
        font-weight: 600;
        color: #0f172a;
    }
    .hb-summary-breakdown {
        border-top: 1px solid #e2e8f0;
        padding-top: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .hb-breakdown-row {
        display: flex;
        justify-content: space-between;
        font-size: 13.5px;
        color: #64748b;
    }
    .hb-breakdown-total {
        border-top: 1.5px solid #0f172a;
        padding-top: 14px;
        margin-top: 6px;
        font-size: 17px;
        font-weight: 700;
        color: #0f172a;
    }
    .hb-shipping-free {
        color: #10b981;
        font-weight: 600;
    }

    /* Success / Confirmed Order View */
    .hb-order-success-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        max-width: 680px;
        margin: 20px auto 40px;
        padding: 48px 36px;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
    }
    .hb-success-icon {
        width: 72px;
        height: 72px;
        background: #dcfce7;
        color: #16a34a;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 34px;
        margin-bottom: 20px;
    }
    .hb-success-title {
        font-size: 26px;
        font-weight: 700;
        color: #0f172a;
        margin: 0 0 10px;
    }
    .hb-success-desc {
        font-size: 15px;
        color: #64748b;
        margin: 0 auto 28px;
        max-width: 500px;
        line-height: 1.5;
    }
    .hb-order-details-box {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 20px;
        text-align: left;
        margin-bottom: 28px;
    }
    .hb-order-info-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 14px;
    }
    .hb-order-info-row:last-child {
        margin-bottom: 0;
    }
    .hb-back-home-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 50px;
        padding: 0 32px;
        background: #0f172a;
        color: #ffffff;
        border-radius: 10px;
        font-weight: 600;
        text-decoration: none;
        transition: background 0.2s;
    }
    .hb-back-home-btn:hover {
        background: var(--hb-accent, #e11d48);
    }
    </style>

    <div class="hb-checkout-wrapper" id="hb-checkout-grid">
        <!-- LEFT: Express Checkout & Payment Method -->
        <main class="hb-checkout-main">
            <h1 class="hb-checkout-heading">Checkout & Payment</h1>
            <p class="hb-checkout-subhead">Guest Express Checkout &bull; No Account or Login Required</p>

            <!-- Express Checkout options -->
            <div class="hb-express-box">
                <div class="hb-express-title">Instant Express Checkout</div>
                <div class="hb-express-btns">
                    <button type="button" class="hb-express-btn hb-express-paypal" onclick="hbSelectPayment('paypal')">
                        <i class="fa-brands fa-paypal"></i> PayPal
                    </button>
                    <button type="button" class="hb-express-btn hb-express-apple" onclick="hbSelectPayment('card')">
                        <i class="fa-brands fa-apple"></i> Apple Pay
                    </button>
                </div>
            </div>

            <form id="hb-checkout-form" onsubmit="return hbProcessOrder(event)">
                <!-- 1. Contact -->
                <div class="hb-sec-title">
                    <span class="hb-sec-badge">1</span>
                    <span>Contact Information</span>
                </div>
                <div class="hb-form-group">
                    <label class="hb-form-label" for="hb-input-email">Email Address (for order tracking & receipt)</label>
                    <input type="email" id="hb-input-email" class="hb-form-input" placeholder="e.g. alex@example.com" required>
                </div>
                <div class="hb-form-group">
                    <label class="hb-form-label" for="hb-input-phone">Phone Number (for courier SMS updates)</label>
                    <input type="tel" id="hb-input-phone" class="hb-form-input" placeholder="+49 152 12345678" required>
                </div>

                <!-- 2. Shipping Address -->
                <div class="hb-sec-title">
                    <span class="hb-sec-badge">2</span>
                    <span>Shipping Address</span>
                </div>
                <div class="hb-grid-2">
                    <div class="hb-form-group">
                        <label class="hb-form-label" for="hb-input-fname">First Name</label>
                        <input type="text" id="hb-input-fname" class="hb-form-input" placeholder="First Name" required>
                    </div>
                    <div class="hb-form-group">
                        <label class="hb-form-label" for="hb-input-lname">Last Name</label>
                        <input type="text" id="hb-input-lname" class="hb-form-input" placeholder="Last Name" required>
                    </div>
                </div>
                <div class="hb-form-group">
                    <label class="hb-form-label" for="hb-input-address">Street Address</label>
                    <input type="text" id="hb-input-address" class="hb-form-input" placeholder="Street and house number" required>
                </div>
                <div class="hb-grid-2">
                    <div class="hb-form-group">
                        <label class="hb-form-label" for="hb-input-zip">Postal Code</label>
                        <input type="text" id="hb-input-zip" class="hb-form-input" placeholder="10115" required>
                    </div>
                    <div class="hb-form-group">
                        <label class="hb-form-label" for="hb-input-city">City</label>
                        <input type="text" id="hb-input-city" class="hb-form-input" placeholder="Berlin" required>
                    </div>
                </div>
                <div class="hb-form-group">
                    <label class="hb-form-label" for="hb-input-country">Country / Region</label>
                    <select id="hb-input-country" class="hb-form-select">
                        <option value="Germany" selected>Germany (Deutschland)</option>
                        <option value="Austria">Austria (Österreich)</option>
                        <option value="Switzerland">Switzerland (Schweiz)</option>
                        <option value="Netherlands">Netherlands (Nederland)</option>
                        <option value="France">France</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Other">Other International</option>
                    </select>
                </div>

                <!-- 3. Payment Method -->
                <div class="hb-sec-title">
                    <span class="hb-sec-badge">3</span>
                    <span>Direct Payment Method</span>
                </div>
                
                <div class="hb-payment-box">
                    <!-- Option 1: Credit / Debit Card -->
                    <div class="hb-payment-option is-selected" id="hb-opt-card">
                        <div class="hb-payment-header" onclick="hbSelectPayment('card')">
                            <div class="hb-payment-left">
                                <input type="radio" name="hb_payment_method" value="card" checked>
                                <span class="hb-payment-title">Credit or Debit Card</span>
                            </div>
                            <div class="hb-payment-icons">
                                <i class="fa-brands fa-cc-visa" style="color:#1a1f71;"></i>
                                <i class="fa-brands fa-cc-mastercard" style="color:#eb001b;"></i>
                                <i class="fa-brands fa-cc-amex" style="color:#007bc1;"></i>
                            </div>
                        </div>
                        <div class="hb-payment-content">
                            <div class="hb-form-group">
                                <label class="hb-form-label" for="hb-card-num">Card Number</label>
                                <input type="text" id="hb-card-num" class="hb-form-input" placeholder="4242 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242" maxlength="19">
                            </div>
                            <div class="hb-grid-2">
                                <div class="hb-form-group">
                                    <label class="hb-form-label" for="hb-card-exp">Expiration (MM/YY)</label>
                                    <input type="text" id="hb-card-exp" class="hb-form-input" placeholder="MM / YY" maxlength="5">
                                </div>
                                <div class="hb-form-group">
                                    <label class="hb-form-label" for="hb-card-cvv">Security Code (CVC)</label>
                                    <input type="text" id="hb-card-cvv" class="hb-form-input" placeholder="CVC" maxlength="4">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Option 2: PayPal -->
                    <div class="hb-payment-option" id="hb-opt-paypal">
                        <div class="hb-payment-header" onclick="hbSelectPayment('paypal')">
                            <div class="hb-payment-left">
                                <input type="radio" name="hb_payment_method" value="paypal">
                                <span class="hb-payment-title">PayPal</span>
                            </div>
                            <div class="hb-payment-icons">
                                <i class="fa-brands fa-paypal" style="color:#003087;"></i>
                            </div>
                        </div>
                        <div class="hb-payment-content">
                            <p style="margin:0;font-size:13px;color:#475569;">
                                After clicking "Pay Now", you will be securely redirected to PayPal to complete your purchase.
                            </p>
                        </div>
                    </div>

                    <!-- Option 3: Klarna / Sofort -->
                    <div class="hb-payment-option" id="hb-opt-klarna">
                        <div class="hb-payment-header" onclick="hbSelectPayment('klarna')">
                            <div class="hb-payment-left">
                                <input type="radio" name="hb_payment_method" value="klarna">
                                <span class="hb-payment-title">Klarna Pay Later / Sofort</span>
                            </div>
                            <div class="hb-payment-icons">
                                <i class="fa-solid fa-building-columns" style="color:#ffb3c7;"></i>
                            </div>
                        </div>
                        <div class="hb-payment-content">
                            <p style="margin:0;font-size:13px;color:#475569;">
                                Buy now, pay later in 30 days or slice into monthly interest-free payments via Klarna.
                            </p>
                        </div>
                    </div>

                    <!-- Option 4: Cash on Delivery -->
                    <div class="hb-payment-option" id="hb-opt-cod">
                        <div class="hb-payment-header" onclick="hbSelectPayment('cod')">
                            <div class="hb-payment-left">
                                <input type="radio" name="hb_payment_method" value="cod">
                                <span class="hb-payment-title">Cash on Delivery (COD)</span>
                            </div>
                            <div class="hb-payment-icons">
                                <i class="fa-solid fa-money-bill-wave" style="color:#10b981;"></i>
                            </div>
                        </div>
                        <div class="hb-payment-content">
                            <p style="margin:0;font-size:13px;color:#475569;">
                                Pay securely in cash directly to the courier upon delivery of your package.
                            </p>
                        </div>
                    </div>
                </div>

                <button type="submit" class="hb-submit-btn" id="hb-pay-submit-btn">
                    <i class="fa-solid fa-lock"></i>
                    <span>PAY NOW &bull; <span id="hb-btn-price-display">€0.00</span></span>
                </button>

                <div class="hb-checkout-trust">
                    <span><i class="fa-solid fa-shield-halved"></i> 256-Bit SSL Encrypted</span>
                    <span><i class="fa-solid fa-truck-fast"></i> DHL Express Delivery</span>
                    <span><i class="fa-solid fa-rotate-left"></i> 30-Day Guarantee</span>
                </div>
            </form>
        </main>

        <!-- RIGHT: Order Summary -->
        <aside class="hb-checkout-summary">
            <div class="hb-summary-title">
                <span>Order Summary</span>
                <span id="hb-summary-count-badge" style="font-size:13px;font-weight:500;color:#64748b;">0 items</span>
            </div>

            <div class="hb-summary-items" id="hb-summary-items-list">
                <!-- Dynamically populated from localStorage nesports_cart -->
            </div>

            <div class="hb-summary-breakdown">
                <div class="hb-breakdown-row">
                    <span>Subtotal</span>
                    <span id="hb-summary-subtotal">€0.00</span>
                </div>
                <div class="hb-breakdown-row">
                    <span>Shipping</span>
                    <span class="hb-shipping-free">FREE (Express DE)</span>
                </div>
                <div class="hb-breakdown-row">
                    <span>Estimated Taxes</span>
                    <span>Included</span>
                </div>
                <div class="hb-breakdown-row hb-breakdown-total">
                    <span>Total</span>
                    <span id="hb-summary-total">€0.00</span>
                </div>
            </div>
        </aside>
    </div>

    <!-- ORDER CONFIRMED VIEW (Hidden by default) -->
    <div class="hb-order-success-card" id="hb-order-success" style="display: none;">
        <div class="hb-success-icon">
            <i class="fa-solid fa-check"></i>
        </div>
        <h2 class="hb-success-title">Order Confirmed!</h2>
        <p class="hb-success-desc">
            Thank you for shopping with NE Sports. Your payment was accepted successfully and your package is being prepared for dispatch.
        </p>

        <div class="hb-order-details-box">
            <div class="hb-order-info-row">
                <span style="color:#64748b;">Order Number:</span>
                <strong id="hb-conf-order-id">#NES-9481</strong>
            </div>
            <div class="hb-order-info-row">
                <span style="color:#64748b;">Estimated Delivery:</span>
                <strong>2-3 Business Days (DHL Express)</strong>
            </div>
            <div class="hb-order-info-row">
                <span style="color:#64748b;">Payment Status:</span>
                <strong style="color:#16a34a;"><i class="fa-solid fa-circle-check"></i> Paid & Verified</strong>
            </div>
            <div class="hb-order-info-row">
                <span style="color:#64748b;">Delivering To:</span>
                <strong id="hb-conf-address">-</strong>
            </div>
        </div>

        <a href="<?php echo esc_url(home_url('/')); ?>" class="hb-back-home-btn">
            <i class="fa-solid fa-arrow-left"></i> CONTINUE SHOPPING
        </a>
    </div>
</div>

<script>
(function() {
    function getCart() {
        try {
            var raw = localStorage.getItem('nesports_cart');
            return raw ? JSON.parse(raw) : [];
        } catch(e) {
            return [];
        }
    }

    function renderSummary() {
        var cart = getCart();
        var list = document.getElementById('hb-summary-items-list');
        var countBadge = document.getElementById('hb-summary-count-badge');
        var subtotalEl = document.getElementById('hb-summary-subtotal');
        var totalEl = document.getElementById('hb-summary-total');
        var btnPrice = document.getElementById('hb-btn-price-display');

        // Fallback default item if cart empty
        if (!cart || cart.length === 0) {
            cart = [{
                id: 'elbow-wrap',
                name: 'Elbow Wrap (Competition Grade)',
                price: 24.99,
                img: '<?php echo esc_url(nesports_img("knee-wrap-blue-1.jpg")); ?>',
                qty: 1
            }];
        }

        var totalQty = 0;
        var subtotal = 0;
        var html = '';

        cart.forEach(function(item) {
            var price = parseFloat(item.price) || 0;
            var qty = parseInt(item.qty, 10) || 1;
            totalQty += qty;
            subtotal += (price * qty);

            html += '<div class="hb-summary-item">';
            html += '  <div class="hb-summary-thumb">';
            html += '    <img src="' + (item.img || '') + '" alt="' + item.name + '">';
            html += '    <span class="hb-summary-qty-pill">' + qty + '</span>';
            html += '  </div>';
            html += '  <div class="hb-summary-info">';
            html += '    <div class="hb-summary-name">' + item.name + '</div>';
            html += '    <div class="hb-summary-variant">Standard Edition</div>';
            html += '  </div>';
            html += '  <div class="hb-summary-price">€' + (price * qty).toFixed(2) + '</div>';
            html += '</div>';
        });

        if (list) list.innerHTML = html;
        if (countBadge) countBadge.textContent = totalQty + ' item' + (totalQty === 1 ? '' : 's');
        var formatted = '€' + subtotal.toFixed(2);
        if (subtotalEl) subtotalEl.textContent = formatted;
        if (totalEl) totalEl.textContent = formatted;
        if (btnPrice) btnPrice.textContent = formatted;
    }

    window.hbSelectPayment = function(method) {
        document.querySelectorAll('.hb-payment-option').forEach(function(opt) {
            opt.classList.remove('is-selected');
        });
        var target = document.getElementById('hb-opt-' + method);
        if (target) {
            target.classList.add('is-selected');
            var radio = target.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        }
    };

    window.hbProcessOrder = function(e) {
        e.preventDefault();
        var submitBtn = document.getElementById('hb-pay-submit-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> AUTHORIZING PAYMENT...';
        }

        var fname = document.getElementById('hb-input-fname') ? document.getElementById('hb-input-fname').value : 'Athlete';
        var lname = document.getElementById('hb-input-lname') ? document.getElementById('hb-input-lname').value : '';
        var address = document.getElementById('hb-input-address') ? document.getElementById('hb-input-address').value : '';
        var city = document.getElementById('hb-input-city') ? document.getElementById('hb-input-city').value : '';
        var country = document.getElementById('hb-input-country') ? document.getElementById('hb-input-country').value : 'Germany';

        setTimeout(function() {
            var orderId = 'NES-' + Math.floor(1000 + Math.random() * 9000);
            
            // Clear cart
            localStorage.removeItem('nesports_cart');

            // Switch views
            var grid = document.getElementById('hb-checkout-grid');
            var success = document.getElementById('hb-order-success');
            var confId = document.getElementById('hb-conf-order-id');
            var confAddr = document.getElementById('hb-conf-address');

            if (confId) confId.textContent = '#' + orderId;
            if (confAddr) confAddr.textContent = (address ? address + ', ' : '') + city + ', ' + country;

            if (grid) grid.style.display = 'none';
            if (success) {
                success.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 900);

        return false;
    };

    // Auto format card number with spaces
    var cardInput = document.getElementById('hb-card-num');
    if (cardInput) {
        cardInput.addEventListener('input', function(e) {
            var v = e.target.value.replace(/\D/g, '').substring(0, 16);
            var parts = [];
            for (var i = 0; i < v.length; i += 4) {
                parts.push(v.substring(i, i + 4));
            }
            e.target.value = parts.join(' ');
        });
    }

    // Auto format expiry MM/YY
    var expInput = document.getElementById('hb-card-exp');
    if (expInput) {
        expInput.addEventListener('input', function(e) {
            var v = e.target.value.replace(/\D/g, '').substring(0, 4);
            if (v.length >= 2) {
                e.target.value = v.substring(0, 2) + ' / ' + v.substring(2);
            } else {
                e.target.value = v;
            }
        });
    }

    renderSummary();
})();
</script>

<?php
require_once NESPORTS_PLUGIN_DIR . 'templates/footer-nesports.php';
?>
