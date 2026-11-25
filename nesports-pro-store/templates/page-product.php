<?php
/**
 * NESPORTS3 - Single Product Page Template
 * Minimal Scandinavian D2C Layout
 */
$current_page = 'product';
include NESPORTS_PLUGIN_DIR . 'templates/header-nesports.php';

$all_products = nesports_catalog();

// Lookup current product by slug or current post in WordPress
$slug = isset($_GET['slug']) ? sanitize_text_field($_GET['slug']) : (getenv('NES_SLUG') ?: '');
if (!$slug && function_exists('is_singular') && is_singular('product')) {
    global $post;
    if ($post && !empty($post->post_name)) {
        $slug = $post->post_name;
    }
}
if (!$slug) {
    $slug = 'pro-leather-weightlifting-lever-belt-10mm';
}

$product = null;
foreach ($all_products as $p) {
    if ($p['slug'] === $slug) {
        $product = $p;
        break;
    }
}

// Fallback to real WooCommerce product if not in array
$custom_gallery = null;
if (!$product && function_exists('wc_get_product')) {
    $wc_id = function_exists('get_the_ID') ? get_the_ID() : 0;
    $wc_p  = $wc_id ? wc_get_product($wc_id) : null;
    if ($wc_p) {
        $terms = get_the_terms($wc_id, 'product_cat');
        $cat_slug = (!empty($terms) && !is_wp_error($terms)) ? $terms[0]->slug : 'all';
        $image_id = $wc_p->get_image_id();
        $main_img = $image_id ? wp_get_attachment_image_url($image_id, 'large') : '';
        $reg_price  = (float) $wc_p->get_regular_price();
        $curr_price = (float) $wc_p->get_price();
        $old_price  = ($reg_price > $curr_price) ? $reg_price : $curr_price;

        $g_ids = $wc_p->get_gallery_image_ids();
        $custom_gallery = array();
        if ($main_img) $custom_gallery[] = $main_img;
        foreach ($g_ids as $gid) {
            $custom_gallery[] = wp_get_attachment_image_url($gid, 'large');
        }

        $product = array(
            'id'      => $wc_id,
            'name'    => $wc_p->get_name(),
            'slug'    => $wc_p->get_slug(),
            'cat'     => $cat_slug,
            'price'   => $curr_price,
            'old'     => $old_price,
            'reviews' => (int) $wc_p->get_rating_count(),
            'main'    => $main_img,
            'hover'   => !empty($custom_gallery[1]) ? $custom_gallery[1] : $main_img,
        );
    }
}

if (!$product) {
    $product = $all_products[0];
}

$categories = nesports_categories();
$cat_name   = isset($categories[$product['cat']]) ? $categories[$product['cat']] : 'WEIGHTLIFTING BELTS';
$on_sale    = $product['old'] > $product['price'];
$pct        = $on_sale ? round((1 - $product['price'] / $product['old']) * 100) : 0;

// Curated profile strictly for THIS product (images, colors, selectors & specs)
$profile        = nesports_product_profile($product);
$gallery_images = !empty($custom_gallery) ? $custom_gallery : (!empty($profile['gallery']) ? $profile['gallery'] : array($product['main']));
$color_options  = !empty($profile['colors']) ? $profile['colors'] : array();

// Related gear
$related = array_filter($all_products, function($p) use ($product) {
    return $p['slug'] !== $product['slug'];
});
$related = array_slice($related, 0, 4);
?>

<main class="hb-single-product-page">
    <div class="hb-product-container">
        
        <!-- Breadcrumbs -->
        <nav class="hb-breadcrumbs" aria-label="Breadcrumb">
            <a href="<?php echo esc_url(home_url('/')); ?>">Home</a>
            <span class="hb-bc-sep">/</span>
            <a href="<?php echo esc_url(home_url('/shop/')); ?>">Shop</a>
            <span class="hb-bc-sep">/</span>
            <a href="<?php echo esc_url(home_url('/product-category/' . $product['cat'] . '/')); ?>"><?php echo esc_html(ucwords(strtolower($cat_name))); ?></a>
            <span class="hb-bc-sep">/</span>
            <span class="hb-bc-current"><?php echo esc_html($product['name']); ?></span>
        </nav>

        <!-- 1. MAIN HERO GRID: Vertical Gallery on Left + Clean Minimal Buying Box on Right -->
        <div class="hb-pdp-hero-grid">
            
            <!-- Left: Vertical Thumbnails Strip + Main Active Viewport -->
            <div class="hb-pdp-gallery-wrap">
                <div class="hb-pdp-vertical-strip" id="hb-pdp-vertical-strip" aria-label="Product thumbnails">
                    <?php foreach ($gallery_images as $idx => $img_file): ?>
                        <button type="button" class="hb-pdp-vthumb<?php echo $idx === 0 ? ' is-active' : ''; ?>" data-src="<?php echo esc_url(nesports_img($img_file)); ?>" aria-label="View photo <?php echo $idx + 1; ?>">
                            <img src="<?php echo esc_url(nesports_img($img_file)); ?>" alt="">
                        </button>
                    <?php endforeach; ?>
                </div>

                <div class="hb-pdp-main-viewport">
                    <img id="hb-pdp-active-img" src="<?php echo esc_url(nesports_img($gallery_images[0])); ?>" alt="<?php echo esc_attr($product['name']); ?>" class="hb-pdp-active-img">
                </div>
            </div>

            <!-- Right: Streamlined Minimal Buying Box (Brand Colors) -->
            <div class="hb-pdp-info-wrap">
                
                <!-- Badge & Title -->
                <div class="hb-pdp-badge-tag">LIFETIME WARRANTY</div>
                <h1 class="hb-pdp-product-title"><?php echo esc_html($product['name']); ?></h1>

                <!-- Reviews Row -->
                <div class="hb-pdp-review-row">
                    <div class="hb-pdp-stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <span class="hb-pdp-review-score">4.9 / 5.0</span>
                    <span class="hb-pdp-review-count">(128 Verified Lifters)</span>
                </div>

                <!-- Price Row -->
                <!-- Price Row (Hardbody Red Accent & Strikethrough) -->
                <div class="hb-pdp-price-row" style="display: flex; align-items: baseline; gap: 10px; margin: 4px 0 8px;">
                    <span class="hb-pdp-price-current" id="hb-pdp-price-display" style="color: #e11d48; font-size: 24px; font-weight: 700;"><?php echo esc_html(nesports_money($product['price'])); ?></span>
                    <?php if ($on_sale): ?>
                        <s class="hb-pdp-price-was" style="color: #e11d48; opacity: 0.75; font-size: 16px; text-decoration: line-through;"><?php echo esc_html(nesports_money($product['old'])); ?></s>
                    <?php endif; ?>
                </div>
                <div class="hb-pdp-tax-notice" style="font-size: 12px; color: #71717a; margin-bottom: 12px;">Taxes included. Free shipping on all orders over &euro;150.</div>

                <div class="hb-pdp-divider"></div>

                <!-- Color Swatches (Hardbody Square Thumbnail Swatches) -->
                <?php if (!empty($color_options)): ?>
                <div class="hb-pdp-section-opt">
                    <div class="hb-pdp-opt-title-bar">
                        <span class="hb-pdp-opt-label">Color:</span>
                        <span class="hb-pdp-opt-selected" id="hb-color-val"><?php echo esc_html($color_options[0]['name']); ?></span>
                    </div>
                    <div class="hb-pdp-color-swatches" style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px;">
                        <?php foreach ($color_options as $idx => $opt): 
                            $opt_img = !empty($opt['img']) ? nesports_img($opt['img']) : '';
                        ?>
                            <button type="button" class="hb-color-circle-btn hb-color-thumb-btn<?php echo $idx === 0 ? ' is-active' : ''; ?>" 
                                data-color="<?php echo esc_attr($opt['name']); ?>" 
                                data-src="<?php echo esc_url($opt_img ? $opt_img : nesports_img($gallery_images[0])); ?>"
                                title="<?php echo esc_attr($opt['name']); ?>"
                                aria-label="<?php echo esc_attr($opt['name']); ?>">
                                <?php if (!empty($opt_img)): ?>
                                    <img src="<?php echo esc_url($opt_img); ?>" alt="<?php echo esc_attr($opt['name']); ?>">
                                <?php else: ?>
                                    <span class="hb-color-dot" style="background: <?php echo esc_attr($opt['color']); ?>;"></span>
                                <?php endif; ?>
                            </button>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?>

                <!-- Width / Thickness Selector (Belts Only) -->
                <?php if (!empty($profile['has_thickness']) && !empty($profile['thickness_options'])): ?>
                <div class="hb-pdp-section-opt">
                    <div class="hb-pdp-opt-title-bar">
                        <span class="hb-pdp-opt-label">Thickness:</span>
                        <span class="hb-pdp-opt-selected" id="hb-thickness-val"><?php echo esc_html($profile['thickness_options'][0]); ?></span>
                    </div>
                    <div class="hb-pdp-pills-row">
                        <?php foreach ($profile['thickness_options'] as $t_idx => $t_val): ?>
                            <button type="button" class="hb-opt-pill<?php echo $t_idx === 0 ? ' is-active' : ''; ?>" data-group="thickness" data-val="<?php echo esc_attr($t_val); ?>"><?php echo esc_html($t_val); ?></button>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?>

                <!-- Size / Dimension Selector (Hardbody Minimal Clean Boxes) -->
                <?php if (!empty($profile['has_size']) && !empty($profile['sizes'])): ?>
                <div class="hb-pdp-section-opt">
                    <div class="hb-pdp-opt-title-bar">
                        <div>
                            <span class="hb-pdp-opt-label"><?php echo esc_html(!empty($profile['size_label']) ? $profile['size_label'] : 'Size:'); ?></span>
                            <span class="hb-pdp-opt-selected" id="hb-size-val"><?php echo esc_html($profile['sizes'][0]['val']); ?></span>
                        </div>
                        <?php if (!empty($profile['has_size_guide'])): ?>
                        <button type="button" class="hb-size-guide-link" id="hb-open-size-modal">
                            <i class="fa-solid fa-ruler-horizontal"></i> Size Guide
                        </button>
                        <?php endif; ?>
                    </div>
                    <div class="hb-pdp-pills-row hb-pills-sizes" style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px;">
                        <?php foreach ($profile['sizes'] as $s_idx => $s_item): ?>
                            <button type="button" class="hb-opt-pill<?php echo $s_idx === 0 ? ' is-active' : ''; ?>" data-group="size" data-val="<?php echo esc_attr($s_item['val']); ?>"><?php echo esc_html($s_item['label']); ?></button>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?>

                <!-- Hardbody Primary Buy Action: Full-Width Clean Black Pill Button -->
                <div class="hb-pdp-buy-actions" style="margin: 16px 0 12px; display: block;">
                    <button type="button" class="hb-pdp-main-add-btn" id="hb-pdp-add-to-cart"
                        data-id="<?php echo esc_attr($product['slug']); ?>"
                        data-name="<?php echo esc_attr($product['name']); ?>"
                        data-price="<?php echo esc_attr($product['price']); ?>"
                        data-img="<?php echo esc_url(nesports_img($gallery_images[0])); ?>">
                        ADD TO CART
                    </button>
                </div>

                <!-- Hardbody Guarantee & Trust Badges -->
                <div class="hb-pdp-trust-pills-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 22px;">
                    <div class="hb-trust-pill-box">
                        Free Shipping Over &euro;150
                    </div>
                    <div class="hb-trust-pill-box">
                        30 Day Money Back Guarantee
                    </div>
                </div>

                <!-- Hardbody Minimal Accordions (Collapsible Information) -->
                <div class="hb-pdp-accordions">
                    
                    <!-- Accordion 1: This Item Includes -->
                    <?php if (!empty($profile['pack_includes'])): ?>
                    <div class="hb-pdp-acc is-open">
                        <button type="button" class="hb-pdp-acc-trigger">
                            <span>This Item Includes:</span>
                            <i class="fa-solid fa-chevron-down hb-acc-arrow"></i>
                        </button>
                        <div class="hb-pdp-acc-panel">
                            <ul class="hb-pack-list">
                                <?php foreach ($profile['pack_includes'] as $inc_item): ?>
                                    <li><i class="fa-solid fa-check"></i> <?php echo esc_html($inc_item); ?></li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    </div>
                    <?php endif; ?>

                    <!-- Accordion 2: Product Specifications -->
                    <?php if (!empty($profile['specs'])): ?>
                    <div class="hb-pdp-acc">
                        <button type="button" class="hb-pdp-acc-trigger">
                            <span>Product Details &amp; Materials:</span>
                            <i class="fa-solid fa-chevron-down hb-acc-arrow"></i>
                        </button>
                        <div class="hb-pdp-acc-panel">
                            <div class="hb-pdp-spec-grid">
                                <?php foreach ($profile['specs'] as $spec_key => $spec_val): ?>
                                    <div class="hb-spec-item"><strong><?php echo esc_html($spec_key); ?>:</strong> <?php echo esc_html($spec_val); ?></div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>
                    <?php endif; ?>

                    <!-- Accordion 3: Shipping & Returns -->
                    <div class="hb-pdp-acc">
                        <button type="button" class="hb-pdp-acc-trigger">
                            <span>Shipping &amp; 30-Day Returns:</span>
                            <i class="fa-solid fa-chevron-down hb-acc-arrow"></i>
                        </button>
                        <div class="hb-pdp-acc-panel">
                            <p>Orders placed before 2:00 PM CET are dispatched the same day. All deliveries are fully tracked with signature on arrival.</p>
                            <p style="margin-top: 8px;">If you need a different size or exchange, return it within 30 days for a prompt exchange or full refund.</p>
                        </div>
                    </div>
                </div>

                <!-- 4 Trust Badges in a Row -->
                <div class="hb-pdp-trust-grid">
                    <div class="hb-trust-card">
                        <div class="hb-trust-icon"><i class="fa-solid fa-shield-halved"></i></div>
                        <span>Lifetime Warranty</span>
                    </div>
                    <div class="hb-trust-card">
                        <div class="hb-trust-icon"><i class="fa-solid fa-arrows-rotate"></i></div>
                        <span>Free Exchanges</span>
                    </div>
                    <div class="hb-trust-card">
                        <div class="hb-trust-icon"><i class="fa-solid fa-award"></i></div>
                        <span>100% Steerhide</span>
                    </div>
                    <div class="hb-trust-card">
                        <div class="hb-trust-icon"><i class="fa-solid fa-dumbbell"></i></div>
                        <span>Pro Athlete Tested</span>
                    </div>
                </div>

            </div>
        </div>

        <!-- 2. RECENTLY VIEWED / RECOMMENDED GEAR -->
        <section class="hb-pdp-recent-section">
            <div class="hb-section-header" style="text-align: left; margin: 0 0 24px;">
                <h2 class="hb-section-title" style="font-size: 24px;">Recently Viewed</h2>
            </div>
            <div class="hb-product-grid hb-product-grid--4">
                <?php foreach ($related as $r):
                    $r_url     = home_url('/product/' . $r['slug'] . '/');
                    $r_sale    = $r['old'] > $r['price']; ?>
                <article class="hb-card">
                    <div class="hb-card-top-wrap">
                        <a class="hb-card-media" href="<?php echo esc_url($r_url); ?>">
                            <img class="hb-img-main" src="<?php echo esc_url(nesports_img($r['main'])); ?>" alt="<?php echo esc_attr($r['name']); ?>" loading="lazy">
                            <img class="hb-img-hover" src="<?php echo esc_url(nesports_img($r['hover'])); ?>" alt="" loading="lazy">
                        </a>
                        <button type="button" class="hb-card-quick-add" data-id="<?php echo esc_attr($r['slug']); ?>" data-name="<?php echo esc_attr($r['name']); ?>" data-price="<?php echo esc_attr($r['price']); ?>" data-img="<?php echo esc_url(nesports_img($r['main'])); ?>" aria-label="Add to cart">
                            Add to cart
                        </button>
                    </div>
                    <div class="hb-card-body">
                        <h3 class="hb-card-title"><a href="<?php echo esc_url($r_url); ?>"><?php echo esc_html($r['name']); ?></a></h3>
                        <div class="hb-card-price<?php echo $r_sale ? ' is-sale' : ''; ?>">
                            <span class="now"><?php echo esc_html(nesports_money($r['price'])); ?></span>
                            <?php if ($r_sale): ?><s><?php echo esc_html(nesports_money($r['old'])); ?></s><?php endif; ?>
                        </div>
                        <?php if (!empty($r['desc'])): ?>
                            <p class="hb-card-desc"><?php echo esc_html($r['desc']); ?></p>
                        <?php endif; ?>
                    </div>
                </article>
                <?php endforeach; ?>
            </div>
        </section>

        <!-- 3. VALUE PROPOSITION BANNER (4 COLUMNS) -->
        <section class="hb-pdp-props-section">
            <div class="hb-props-grid">
                <div class="hb-prop-item">
                    <div class="hb-prop-icon"><i class="fa-solid fa-headset"></i></div>
                    <div class="hb-prop-content">
                        <h4>CUSTOMER SERVICE</h4>
                        <p>Dedicated lifters ready to answer gear &amp; sizing questions.</p>
                    </div>
                </div>
                <div class="hb-prop-item">
                    <div class="hb-prop-icon"><i class="fa-solid fa-truck-fast"></i></div>
                    <div class="hb-prop-content">
                        <h4>WORLDWIDE SHIPPING</h4>
                        <p>Tracked delivery direct to your gym locker or doorstep.</p>
                    </div>
                </div>
                <div class="hb-prop-item">
                    <div class="hb-prop-icon"><i class="fa-solid fa-arrows-rotate"></i></div>
                    <div class="hb-prop-content">
                        <h4>30-DAY POLICY</h4>
                        <p>Hassle-free 30-day exchange and returns on all gear.</p>
                    </div>
                </div>
                <div class="hb-prop-item">
                    <div class="hb-prop-icon"><i class="fa-solid fa-lock"></i></div>
                    <div class="hb-prop-content">
                        <h4>SECURE CHECKOUT</h4>
                        <p>Bank-grade SSL 256-bit encrypted secure checkout.</p>
                    </div>
                </div>
            </div>
        </section>

    </div>
</main>

<?php if (!empty($profile['has_size_guide'])): ?>
<!-- SIZE GUIDE MODAL (Slide-up / Fade-in) -->
<div class="hb-modal-overlay" id="hb-size-modal-overlay"></div>
<div class="hb-size-modal" id="hb-size-modal" role="dialog" aria-modal="true" aria-label="Size Guide">
    <div class="hb-modal-header">
        <h3>Weightlifting Belt Sizing Chart</h3>
        <button type="button" class="hb-modal-close" id="hb-close-size-modal" aria-label="Close size guide">&times;</button>
    </div>
    <div class="hb-modal-body">
        <p style="font-size:13.5px; color:#52525b; margin-bottom:16px;">
            <strong>Important:</strong> Do NOT measure your pant size. Use a flexible tape measure around your navel (belly button) while bracing your core.
        </p>
        <table class="hb-size-table">
            <thead>
                <tr>
                    <th>Size</th>
                    <th>Waist (Inches)</th>
                    <th>Waist (CM)</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>S</td><td>28" - 32"</td><td>71 - 81 cm</td></tr>
                <tr class="hb-tr-recommended"><td>M (Recommended)</td><td>32" - 36"</td><td>81 - 91 cm</td></tr>
                <tr><td>L</td><td>36" - 40"</td><td>91 - 102 cm</td></tr>
                <tr><td>XL</td><td>40" - 44"</td><td>102 - 112 cm</td></tr>
            </tbody>
        </table>
    </div>
</div>
<?php endif; ?>

<!-- Interactive PDP Script -->
<script>
(function() {
    // 1. Vertical thumbnail switcher
    var vthumbs = document.querySelectorAll('.hb-pdp-vthumb');
    var activeImg = document.getElementById('hb-pdp-active-img');

    vthumbs.forEach(function(btn) {
        btn.addEventListener('click', function() {
            vthumbs.forEach(function(b) { b.classList.remove('is-active'); });
            btn.classList.add('is-active');
            if (activeImg) {
                activeImg.style.opacity = '0.35';
                activeImg.src = btn.dataset.src;
                setTimeout(function() { activeImg.style.opacity = '1'; }, 100);
            }
        });
    });

    // 2. Color Circles
    var colorBtns = document.querySelectorAll('.hb-color-circle-btn');
    var colorVal = document.getElementById('hb-color-val');

    colorBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            colorBtns.forEach(function(b) { b.classList.remove('is-active'); });
            btn.classList.add('is-active');
            var colorName = btn.dataset.color;
            if (colorVal) colorVal.textContent = colorName;
            if (activeImg && btn.dataset.src) {
                activeImg.style.opacity = '0.35';
                activeImg.src = btn.dataset.src;
                setTimeout(function() { activeImg.style.opacity = '1'; }, 100);
            }
        });
    });

    // 3. Option Pills (Thickness & Size)
    var optPills = document.querySelectorAll('.hb-opt-pill');
    optPills.forEach(function(pill) {
        pill.addEventListener('click', function() {
            var group = pill.dataset.group;
            var val = pill.dataset.val;
            document.querySelectorAll('.hb-opt-pill[data-group="' + group + '"]').forEach(function(p) {
                p.classList.remove('is-active');
            });
            pill.classList.add('is-active');

            if (group === 'thickness') {
                var el = document.getElementById('hb-thickness-val');
                if (el) el.textContent = val;
            } else if (group === 'size') {
                var el = document.getElementById('hb-size-val');
                if (el) el.textContent = val;
            }
        });
    });

    // 4. Quantity Stepper
    var qtyInput = document.getElementById('hb-pdp-qty-input');
    var btnMinus = document.getElementById('hb-pdp-qty-minus');
    var btnPlus  = document.getElementById('hb-pdp-qty-plus');

    if (btnMinus && qtyInput) {
        btnMinus.addEventListener('click', function() {
            var v = parseInt(qtyInput.value, 10) || 1;
            if (v > 1) qtyInput.value = v - 1;
        });
    }
    if (btnPlus && qtyInput) {
        btnPlus.addEventListener('click', function() {
            var v = parseInt(qtyInput.value, 10) || 1;
            qtyInput.value = v + 1;
        });
    }

    // 5. Hardbody Accordions (Collapsible)
    var accs = document.querySelectorAll('.hb-pdp-acc');
    accs.forEach(function(acc) {
        var trigger = acc.querySelector('.hb-pdp-acc-trigger');
        if (trigger) {
            trigger.addEventListener('click', function() {
                acc.classList.toggle('is-open');
            });
        }
    });

    // 6. Add-to-cart Trigger
    var mainAddBtn = document.getElementById('hb-pdp-add-to-cart');
    if (mainAddBtn) {
        mainAddBtn.addEventListener('click', function() {
            var id = mainAddBtn.dataset.id;
            var name = mainAddBtn.dataset.name;
            var price = parseFloat(mainAddBtn.dataset.price) || 0;
            var img = activeImg ? activeImg.src : mainAddBtn.dataset.img;
            var qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;

            // Collect selected color & size variations
            var colorEl = document.getElementById('hb-color-val');
            var selectedColor = colorEl ? colorEl.textContent.trim() : '';
            var sizeEl = document.getElementById('hb-size-val');
            var selectedSize = sizeEl ? sizeEl.textContent.trim() : '';

            var itemData = {
                id: id,
                name: name,
                price: price,
                img: img,
                qty: qty,
                color: selectedColor,
                size: selectedSize
            };

            if (typeof window.nesportsAddToCart === 'function') {
                window.nesportsAddToCart(itemData);
            } else if (typeof window.hbAddToCart === 'function') {
                window.hbAddToCart(itemData);
            }

            mainAddBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> PROCEEDING TO PAYMENT...';
            window.location.href = '<?php echo esc_url(home_url("/checkout/")); ?>';
        });
    }

    // 7. Size Guide Modal
    var openSizeModal = document.getElementById('hb-open-size-modal');
    var closeSizeModal = document.getElementById('hb-close-size-modal');
    var sizeOverlay = document.getElementById('hb-size-modal-overlay');
    var sizeModal = document.getElementById('hb-size-modal');

    function toggleSizeModal(show) {
        if (sizeOverlay && sizeModal) {
            if (show) {
                sizeOverlay.classList.add('is-active');
                sizeModal.classList.add('is-active');
            } else {
                sizeOverlay.classList.remove('is-active');
                sizeModal.classList.remove('is-active');
            }
        }
    }

    if (openSizeModal) openSizeModal.addEventListener('click', function() { toggleSizeModal(true); });
    if (closeSizeModal) closeSizeModal.addEventListener('click', function() { toggleSizeModal(false); });
    if (sizeOverlay) sizeOverlay.addEventListener('click', function() { toggleSizeModal(false); });
})();
</script>

<?php include NESPORTS_PLUGIN_DIR . 'templates/footer-nesports.php'; ?>