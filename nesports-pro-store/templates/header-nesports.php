<?php
/**
 * NESPORTS3 - Header (matches nesports3.com & hardbody.store layout)
 */
$settings = get_option('nesports_store_settings', array());
$announcement = !empty($settings['announcement_text']) ? $settings['announcement_text'] : 'Free shipping on all orders';
$current_page = basename($_SERVER['REQUEST_URI'] ?? '');
$request_path = trim(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH), '/');
$is_home_page = getenv('NES_PAGE') !== false ? (getenv('NES_PAGE') === 'home') : (empty($request_path) || $request_path === 'home' || $request_path === 'wordpress' || (function_exists('is_front_page') && (is_front_page() || is_home())));
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php wp_title('|', true, 'right'); ?></title>
    <?php wp_head(); ?>
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
            <i class="fa-solid fa-money-bill-1"></i>
            <select id="hb-currency-select" aria-label="Country / currency">
                <option>Europe (EUR €)</option>
                <option>United States (USD $)</option>
                <option>United Kingdom (GBP £)</option>
                <option>Pakistan (PKR Rs)</option>
            </select>
        </div>
    </div>
</div>

<!-- 2. Main Navigation Header -->
<header class="hb-header<?php echo $is_home_page ? ' hb-header--overlay' : ''; ?>" id="hb-main-header">
    <div class="hb-header-inner">
        <a class="hb-logo" href="<?php echo esc_url(home_url('/')); ?>" aria-label="NESPORTS3">
            <img src="<?php echo esc_url(nesports_img('logo-1.png')); ?>" alt="NESPORTS3">
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
            <!-- LOGIN / REGISTER text button matching user screenshot -->
            <button type="button" class="hb-auth-text-btn" id="hb-auth-text-trigger">LOGIN / REGISTER</button>
            <button type="button" class="hb-icon-btn" id="hb-search-trigger" aria-label="Search"><i class="fa-solid fa-magnifying-glass"></i></button>
            <button type="button" class="hb-icon-btn" id="hb-auth-icon-trigger" aria-label="Account"><i class="fa-regular fa-user"></i></button>
            <button type="button" class="hb-icon-btn hb-cart" id="hb-cart-trigger" aria-label="Open Shopping Cart">
                <i class="fa-solid fa-cart-shopping"></i>
                <span class="hb-cart-badge" id="hb-cart-badge"><?php echo (function_exists('WC') && WC()->cart) ? (int) WC()->cart->get_cart_contents_count() : 0; ?></span>
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

<!-- 3. Slide-Out Sign In Drawer (Matched to Screenshot 2) -->
<div class="hb-drawer-overlay" id="hb-drawer-overlay"></div>

<aside class="hb-side-drawer" id="hb-side-drawer" aria-label="Sign in">
    <div class="hb-drawer-header">
        <h2>Sign in</h2>
        <button type="button" class="hb-drawer-close" id="hb-drawer-close" aria-label="Close sign in drawer">
            <i class="fa-solid fa-xmark"></i> Close
        </button>
    </div>
    
    <div class="hb-drawer-body">
        <form class="hb-auth-form" id="hb-login-form" onsubmit="handleLoginSubmit(event)">
            <div class="hb-field-group">
                <label for="hb-auth-user">Username or email address <span class="hb-req">*</span></label>
                <input type="text" id="hb-auth-user" required autocomplete="username">
            </div>

            <div class="hb-field-group">
                <label for="hb-auth-pass">Password <span class="hb-req">*</span></label>
                <div class="hb-pass-field-wrap">
                    <input type="password" id="hb-auth-pass" required autocomplete="current-password">
                    <button type="button" class="hb-eye-btn" id="hb-toggle-pass-visibility" aria-label="Toggle password visibility">
                        <i class="fa-regular fa-eye" id="hb-eye-icon"></i>
                    </button>
                </div>
            </div>

            <button type="submit" class="hb-btn-login">LOG IN</button>

            <div class="hb-auth-helpers">
                <label class="hb-checkbox-label">
                    <input type="checkbox" name="rememberme" value="forever"> Remember me
                </label>
                <a href="<?php echo esc_url(home_url('/my-account/lost-password/')); ?>" class="hb-lost-link">Lost your password?</a>
            </div>
        </form>

        <div class="hb-drawer-register-callout">
            <div class="hb-reg-avatar-icon">
                <i class="fa-regular fa-user"></i>
            </div>
            <p class="hb-reg-question">No account yet?</p>
            <a href="<?php echo esc_url(home_url('/my-account/?action=register')); ?>" class="hb-reg-link">CREATE AN ACCOUNT</a>
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
        <a href="<?php echo esc_url(home_url('/checkout/')); ?>" class="hb-cart-checkout-btn">CHECKOUT</a>
    </div>
</aside>

<script>
function handleLoginSubmit(e) {
    e.preventDefault();
    alert('Logged in successfully!');
    document.getElementById('hb-drawer-close').click();
}
</script>
