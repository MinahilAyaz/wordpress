<?php
/**
 * NESPORTS3 - Header (matches nesports3.com & hardbody.store layout)
 */
$settings = get_option('nesports_store_settings', array());
$announcement = !empty($settings['announcement_text']) ? $settings['announcement_text'] : 'Free shipping on all orders';
$current_page = basename($_SERVER['REQUEST_URI'] ?? '');
$request_path = trim(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH), '/');
$is_home_page = getenv('NES_PAGE') !== false ? (getenv('NES_PAGE') === 'home') : (empty($request_path) || $request_path === 'home' || $request_path === 'wordpress' || (function_exists('is_front_page') && (is_front_page() || is_home())));
if (function_exists('nocache_headers') && !headers_sent()) {
    nocache_headers();
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php wp_title('|', true, 'right'); ?></title>
    <?php wp_head(); ?>
    <style id="nesports-mobile-nav-fix">
    @media (max-width: 820px) {
        .hb-nav .hb-menu > li > a,
        .hb-header--overlay:not(.is-scrolled) .hb-nav .hb-menu > li > a,
        body.hb-theme .hb-header .hb-nav .hb-menu > li > a {
            color: #111111 !important;
            font-weight: 500 !important;
        }
        .hb-nav .hb-menu > li > a.hb-nav-active,
        .hb-header--overlay:not(.is-scrolled) .hb-nav .hb-menu > li > a.hb-nav-active,
        body.hb-theme .hb-header .hb-nav .hb-menu > li > a.hb-nav-active {
            color: var(--hb-accent, #e11d48) !important;
        }
        .hb-nav .hb-dropdown a,
        .hb-header--overlay:not(.is-scrolled) .hb-nav .hb-dropdown a {
            color: #334155 !important;
        }
    }
    </style>
</head>
<body <?php body_class('hb-theme'); ?>>

<!-- 1. Top Announcement Bar -->
<div class="hb-topbar">
    <div class="hb-topbar-inner">
        <div class="hb-topbar-left">
            <a href="https://instagram.com/nesports3" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
        </div>
        <div class="hb-topbar-center">
            <i class="fa-solid fa-truck-fast"></i>
            <span><?php echo esc_html($announcement); ?></span>
        </div>
        <div class="hb-topbar-right">
            <div class="hb-currency-pill">
                <i class="fa-solid fa-money-bill-1"></i>
                <select id="hb-currency-select" aria-label="Country / currency">
                    <option>Europe (EUR €)</option>
                    <option>United States (USD $)</option>
                    <option>United Kingdom (GBP £)</option>
                    <option>Pakistan (PKR Rs)</option>
                </select>
                <i class="fa-solid fa-chevron-down hb-currency-arrow"></i>
            </div>
        </div>
    </div>
</div>

<!-- 2. Main Navigation Header -->
<header class="hb-header<?php echo $is_home_page ? ' hb-header--overlay' : ''; ?>" id="hb-main-header">
    <div class="hb-header-inner">
        <a class="hb-logo" href="<?php echo esc_url(home_url('/')); ?>" aria-label="NESPORTS3">
            <img src="<?php echo esc_url(nesports_img('logo-1.svg')); ?>" alt="NESPORTS3" width="180" height="64">
        </a>

        <nav class="hb-nav" id="hb-primary-nav" aria-label="Primary">
            <ul class="hb-menu">
                <li>
                    <a href="<?php echo esc_url(home_url('/')); ?>" class="<?php echo ($current_page === '' || $current_page === 'home' || $current_page === 'wordpress') ? 'hb-nav-active' : ''; ?>">HOME</a>
                </li>
                <li class="hb-has-dropdown">
                    <a href="<?php echo esc_url(home_url('/#shop')); ?>">CATEGORIES <i class="fa-solid fa-chevron-down hb-arrow-sm"></i></a>
                    <div class="hb-dropdown">
                        <a href="<?php echo esc_url(home_url('/product-category/weightlifting-belts/')); ?>">Weightlifting Belts</a>
                        <a href="<?php echo esc_url(home_url('/product-category/lifting-straps/')); ?>">Lifting Straps</a>
                        <a href="<?php echo esc_url(home_url('/product-category/knee-wrap/')); ?>">Knee Wraps</a>
                        <a href="<?php echo esc_url(home_url('/product-category/elbow-wrap/')); ?>">Elbow Wraps</a>
                        <a href="<?php echo esc_url(home_url('/product-category/wrist-straps/')); ?>">Wrist Straps</a>
                        <a href="<?php echo esc_url(home_url('/product-category/gym-bag/')); ?>">Gym Bags</a>
                        <a href="<?php echo esc_url(home_url('/product-category/speed-ball/')); ?>">Speed Ball Sets</a>
                        <a href="<?php echo esc_url(home_url('/product-category/ankle-straps/')); ?>">Ankle Straps</a>
                        <a href="<?php echo esc_url(home_url('/product-category/barbell-pads/')); ?>">Barbell Pads</a>
                    </div>
                </li>
                <li>
                    <a href="<?php echo esc_url(home_url('/shop/')); ?>" class="<?php echo ($current_page === 'category' || $current_page === 'shop') ? 'hb-nav-active' : ''; ?>">SHOP</a>
                </li>
                <li>
                    <a href="<?php echo esc_url(home_url('/our-story/')); ?>" class="<?php echo (strpos($current_page, 'story') !== false || strpos($current_page, 'about') !== false) ? 'hb-nav-active' : ''; ?>">ABOUT US</a>
                </li>
                <li>
                    <a href="<?php echo esc_url(home_url('/contact-us/')); ?>" class="<?php echo (strpos($current_page, 'contact') !== false) ? 'hb-nav-active' : ''; ?>">CONTACT US</a>
                </li>
            </ul>
        </nav>

        <div class="hb-header-actions">
            <button type="button" class="hb-icon-btn" id="hb-search-trigger" aria-label="Search"><i class="fa-solid fa-magnifying-glass"></i></button>
            <button type="button" class="hb-icon-btn" id="hb-auth-icon-trigger" aria-label="Account" title="Sign in / My Account"><i class="fa-regular fa-user"></i></button>
            <button type="button" class="hb-icon-btn hb-cart" id="hb-cart-trigger" aria-label="Open Shopping Cart">
                <span class="hb-cart-icon-box">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span class="hb-cart-badge" id="hb-cart-badge"><?php echo (function_exists('WC') && WC()->cart) ? (int) WC()->cart->get_cart_contents_count() : 0; ?></span>
                </span>
                <span class="hb-cart-total-text" id="hb-cart-total-text">€0.00</span>
            </button>
            <button class="hb-mobile-btn" id="hb-mobile-toggle" aria-label="Menu"><span></span><span></span><span></span></button>
        </div>
    </div>
</header>

<!-- 3. Search Slide-Out Drawer (Matched to Hardbody Screenshot) -->
<div class="hb-search-overlay" id="hb-search-overlay"></div>

<aside class="hb-search-drawer" id="hb-search-drawer" aria-label="Search">
    <div class="hb-search-drawer-inner">
        <div class="hb-search-header">
            <h2 class="hb-search-title">Search</h2>
            <button type="button" class="hb-search-close-btn" id="hb-search-close" aria-label="Close search">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>

        <div class="hb-search-input-box">
            <input type="text" id="hb-search-input" placeholder="Search for ..." autocomplete="off">
            <button type="button" class="hb-search-clear-btn" id="hb-search-clear-btn" aria-label="Clear input" style="display: none;">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>

        <div class="hb-search-body">
            <!-- Popular searches chips when empty -->
            <div class="hb-search-suggestions" id="hb-search-suggestions">
                <span class="hb-suggest-label">POPULAR SEARCHES</span>
                <div class="hb-suggest-tags">
                    <button type="button" class="hb-suggest-chip" data-query="Strap">Lifting Straps</button>
                    <button type="button" class="hb-suggest-chip" data-query="Knee">Knee Wraps</button>
                    <button type="button" class="hb-suggest-chip" data-query="Speed Ball">Speed Ball</button>
                    <button type="button" class="hb-suggest-chip" data-query="Bag">Gym Bag</button>
                    <button type="button" class="hb-suggest-chip" data-query="Wrist">Wrist Bandages</button>
                </div>
            </div>

            <!-- Live instant results container -->
            <div class="hb-search-results-list" id="hb-search-results-list"></div>
        </div>
    </div>
</aside>

<script>
window.nesportsCatalog = <?php echo json_encode(array_map(function($p) {
    return array(
        'name'  => $p['name'],
        'slug'  => $p['slug'],
        'url'   => home_url('/product/' . $p['slug'] . '/'),
        'cat'   => $p['cat'],
        'price' => nesports_money($p['price']),
        'old'   => ($p['old'] > $p['price']) ? nesports_money($p['old']) : '',
        'img'   => nesports_img($p['main'])
    );
}, nesports_catalog())); ?>;
</script>

<!-- 3. Slide-Out Sign In & Account Drawer (Clean & Fully Functional) -->
<div class="hb-drawer-overlay" id="hb-drawer-overlay"></div>

<aside class="hb-side-drawer" id="hb-side-drawer" aria-label="Account">
    <div class="hb-drawer-header">
        <div class="hb-drawer-header-left">
            <button type="button" class="hb-drawer-back-btn" id="hb-auth-back-btn" aria-label="Go back" style="display: none;">
                <i class="fa-solid fa-arrow-left"></i>
            </button>
            <h2 id="hb-drawer-title">Sign in</h2>
        </div>
        <button type="button" class="hb-drawer-close" id="hb-drawer-close" aria-label="Close drawer">
            <i class="fa-solid fa-xmark"></i> Close
        </button>
    </div>
    
    <div class="hb-drawer-body">
        <!-- Notification Alert Banner -->
        <div class="hb-auth-alert" id="hb-auth-alert" style="display: none;" role="alert"></div>

        <!-- VIEW 1: SIGN IN -->
        <div class="hb-auth-view" id="hb-view-login">
            <form class="hb-auth-form" id="hb-login-form">
                <div class="hb-field-group">
                    <label for="hb-auth-user">Username or email address</label>
                    <input type="text" id="hb-auth-user" placeholder="Enter your username or email" required autocomplete="username">
                </div>

                <div class="hb-field-group">
                    <label for="hb-auth-pass">Password</label>
                    <div class="hb-pass-field-wrap">
                        <input type="password" id="hb-auth-pass" placeholder="Enter your password" required autocomplete="current-password">
                        <button type="button" class="hb-eye-btn" id="hb-toggle-pass-visibility" aria-label="Toggle password visibility">
                            <i class="fa-regular fa-eye" id="hb-eye-icon"></i>
                        </button>
                    </div>
                </div>

                <button type="submit" class="hb-btn-login" id="hb-login-submit-btn">LOG IN</button>

                <div class="hb-auth-helpers">
                    <label class="hb-checkbox-label">
                        <input type="checkbox" id="hb-remember-me" checked> Remember me
                    </label>
                    <button type="button" class="hb-lost-link-btn" id="hb-goto-forgot">Lost your password?</button>
                </div>
            </form>

            <div class="hb-drawer-register-callout">
                <div class="hb-reg-avatar-icon">
                    <i class="fa-regular fa-user"></i>
                </div>
                <p class="hb-reg-question">No account yet?</p>
                <button type="button" class="hb-reg-link-btn" id="hb-goto-register">CREATE AN ACCOUNT</button>
            </div>
        </div>

        <!-- VIEW 2: REGISTER -->
        <div class="hb-auth-view" id="hb-view-register" style="display: none;">
            <p class="hb-auth-subtitle">Create an athlete account for order tracking, express checkout, and exclusive gear updates.</p>
            <form class="hb-auth-form" id="hb-register-form">
                <div class="hb-field-group">
                    <label for="hb-reg-name">Full name</label>
                    <input type="text" id="hb-reg-name" placeholder="e.g. John Doe" required autocomplete="name">
                </div>

                <div class="hb-field-group">
                    <label for="hb-reg-email">Email address</label>
                    <input type="email" id="hb-reg-email" placeholder="name@example.com" required autocomplete="email">
                </div>

                <div class="hb-field-group">
                    <label for="hb-reg-pass">Create password</label>
                    <div class="hb-pass-field-wrap">
                        <input type="password" id="hb-reg-pass" placeholder="Minimum 8 characters (letters & numbers)" required autocomplete="new-password">
                        <button type="button" class="hb-eye-btn" id="hb-toggle-reg-pass" aria-label="Toggle password visibility">
                            <i class="fa-regular fa-eye" id="hb-reg-eye-icon"></i>
                        </button>
                    </div>
                    <span class="hb-field-hint" style="font-size: 11.5px; color: #71717a; margin-top: 2px;">At least 8 characters including letters and numbers</span>
                </div>

                <button type="submit" class="hb-btn-login" id="hb-reg-submit-btn">CREATE ACCOUNT</button>
            </form>

            <div class="hb-switch-auth-bottom">
                <span>Already have an account?</span>
                <button type="button" class="hb-switch-text-btn" id="hb-switch-to-login">Sign in here</button>
            </div>
        </div>

        <!-- VIEW 3: FORGOT PASSWORD -->
        <div class="hb-auth-view" id="hb-view-forgot" style="display: none;">
            <p class="hb-auth-subtitle">Enter your email address and we will send you a secure link to reset your password.</p>
            <form class="hb-auth-form" id="hb-forgot-form">
                <div class="hb-field-group">
                    <label for="hb-forgot-email">Email address</label>
                    <input type="email" id="hb-forgot-email" placeholder="name@example.com" required autocomplete="email">
                </div>

                <button type="submit" class="hb-btn-login" id="hb-forgot-submit-btn">RESET PASSWORD</button>
            </form>

            <div class="hb-switch-auth-bottom">
                <button type="button" class="hb-switch-text-btn" id="hb-forgot-to-login">
                    <i class="fa-solid fa-arrow-left"></i> Back to Sign in
                </button>
            </div>
        </div>

        <!-- VIEW 4: LOGGED IN ACCOUNT DASHBOARD -->
        <div class="hb-auth-view" id="hb-view-account" style="display: none;">
            <div class="hb-acc-profile-card">
                <div class="hb-acc-avatar" id="hb-acc-avatar-letter">A</div>
                <div class="hb-acc-info">
                    <h3 class="hb-acc-name" id="hb-acc-name">Alex Miller</h3>
                    <p class="hb-acc-email" id="hb-acc-email">alex@nesports3.com</p>
                    <span class="hb-acc-badge">PRO ATHLETE MEMBER</span>
                </div>
            </div>

            <div class="hb-acc-menu">
                <button type="button" class="hb-acc-menu-item" id="hb-btn-open-orders">
                    <div class="hb-acc-menu-left">
                        <i class="fa-solid fa-bag-shopping"></i>
                        <span>Order History</span>
                    </div>
                    <span class="hb-acc-count" id="hb-acc-orders-count">1 Order</span>
                </button>
                <button type="button" class="hb-acc-menu-item" id="hb-btn-open-address">
                    <div class="hb-acc-menu-left">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>Saved Address</span>
                    </div>
                    <span class="hb-acc-count" id="hb-acc-address-status">Default Saved</span>
                </button>

            </div>

            <button type="button" class="hb-btn-logout" id="hb-logout-btn">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> LOG OUT
            </button>
        </div>

        <!-- VIEW 5: ORDER HISTORY (Fully Functional) -->
        <div class="hb-auth-view" id="hb-view-orders" style="display: none;">
            <p class="hb-auth-subtitle">Track your recent shipments, carrier delivery status, and order receipts.</p>
            <div class="hb-orders-list-wrap" id="hb-orders-list-wrap"></div>
        </div>

        <!-- VIEW 6: SAVED ADDRESS (Fully Functional) -->
        <div class="hb-auth-view" id="hb-view-address" style="display: none;">
            <p class="hb-auth-subtitle">Manage your default shipping address for accelerated one-click checkout.</p>
            <form class="hb-auth-form" id="hb-address-form">
                <div class="hb-field-group">
                    <label for="hb-addr-name">Full recipient name</label>
                    <input type="text" id="hb-addr-name" placeholder="Full name" required>
                </div>
                <div class="hb-field-group">
                    <label for="hb-addr-street">Street address</label>
                    <input type="text" id="hb-addr-street" placeholder="Street and house number" required>
                </div>
                <div class="hb-field-row-2">
                    <div class="hb-field-group">
                        <label for="hb-addr-city">City</label>
                        <input type="text" id="hb-addr-city" placeholder="City" required>
                    </div>
                    <div class="hb-field-group">
                        <label for="hb-addr-zip">Postal code</label>
                        <input type="text" id="hb-addr-zip" placeholder="Postal code" required>
                    </div>
                </div>
                <div class="hb-field-group">
                    <label for="hb-addr-country">Country</label>
                    <select id="hb-addr-country" class="hb-select-input">
                        <option value="Germany">Germany</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="France">France</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="Spain">Spain</option>
                        <option value="Italy">Italy</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                    </select>
                </div>
                <div class="hb-field-group">
                    <label for="hb-addr-phone">Phone number</label>
                    <input type="tel" id="hb-addr-phone" placeholder="+1 (555) 019-2834" required>
                </div>
                <button type="submit" class="hb-btn-login" id="hb-save-address-btn">SAVE ADDRESS</button>
            </form>
        </div>


    </div>
</aside>

<!-- 4. Slide-Out Cart Drawer (Matched to Screenshot: Cart • 0 / Your cart is empty) -->
<div class="hb-cart-overlay" id="hb-cart-overlay"></div>

<aside class="hb-cart-drawer" id="hb-cart-drawer" aria-label="Shopping Cart">
    <div class="hb-cart-header">
        <h2 class="hb-cart-title">Cart &bull; <span id="hb-cart-counter">0</span></h2>
        <button type="button" class="hb-cart-close" id="hb-cart-close" aria-label="Close cart">
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>

    <div class="hb-cart-body" id="hb-cart-body">
        <!-- Empty state matching user screenshot -->
        <div class="hb-cart-empty" id="hb-cart-empty">
            <p>Your cart is empty</p>
        </div>

        <!-- Populated cart items container -->
        <div class="hb-cart-items" id="hb-cart-items" style="display: none;"></div>
    </div>

    <!-- Sticky footer when cart has items -->
    <div class="hb-cart-footer" id="hb-cart-footer" style="display: none;">
        <div class="hb-cart-subtotal-row">
            <span class="hb-cart-subtotal-label">Subtotal</span>
            <span class="hb-cart-subtotal-val" id="hb-cart-subtotal-val">€0.00</span>
        </div>
        <p class="hb-cart-shipping-note">Taxes and shipping calculated at checkout</p>
        <button type="button" class="hb-cart-checkout-btn" id="hb-cart-checkout-btn">CHECKOUT</button>
    </div>
</aside>
