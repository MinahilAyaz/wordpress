<?php
/**
 * NESPORTS3 - Single Product Page Template
 */
$current_page = 'product';
include NESPORTS_PLUGIN_DIR . 'templates/header-nesports.php';

$all_products = nesports_catalog();

// Lookup current product by slug
$slug = isset($_GET['slug']) ? sanitize_text_field($_GET['slug']) : (getenv('NES_SLUG') ?: 'lifting-strap-padded-blue');

$product = null;
foreach ($all_products as $p) {
    if ($p['slug'] === $slug) {
        $product = $p;
        break;
    }
}

// Fallback to first product if not found
if (!$product) {
    $product = $all_products[0];
}

$categories = nesports_categories();
$cat_name   = isset($categories[$product['cat']]) ? $categories[$product['cat']] : 'TRAINING GEAR';
$on_sale    = $product['old'] > $product['price'];
$pct        = $on_sale ? round((1 - $product['price'] / $product['old']) * 100) : 0;

// Related products
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

        <div class="hb-product-hero-grid">
            <!-- Left: Gallery -->
            <div class="hb-pdp-gallery">
                <div class="hb-pdp-main-img-wrap">
                    <?php if ($on_sale): ?>
                        <span class="hb-pdp-badge">Save <?php echo (int) $pct; ?>%</span>
                    <?php endif; ?>
                    <img id="hb-pdp-active-img" src="<?php echo esc_url(nesports_img($product['main'])); ?>" alt="<?php echo esc_attr($product['name']); ?>" class="hb-pdp-active-img">
                </div>

                <div class="hb-pdp-thumbs">
                    <button type="button" class="hb-pdp-thumb is-active" data-src="<?php echo esc_url(nesports_img($product['main'])); ?>">
                        <img src="<?php echo esc_url(nesports_img($product['main'])); ?>" alt="">
                    </button>
                    <?php if (!empty($product['hover'])): ?>
                    <button type="button" class="hb-pdp-thumb" data-src="<?php echo esc_url(nesports_img($product['hover'])); ?>">
                        <img src="<?php echo esc_url(nesports_img($product['hover'])); ?>" alt="">
                    </button>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Right: Details & Buying Box -->
            <div class="hb-pdp-info">
                <span class="hb-pdp-cat-eyebrow"><?php echo esc_html($cat_name); ?></span>
                <h1 class="hb-pdp-title"><?php echo esc_html($product['name']); ?></h1>

                <div class="hb-pdp-reviews-row">
                    <div class="hb-stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <span class="hb-pdp-rating-score">4.9 / 5.0</span>
                    <span class="hb-pdp-review-count">(54 verified reviews)</span>
                </div>

                <div class="hb-pdp-price-wrap">
                    <span class="hb-pdp-price-now"><?php echo esc_html(nesports_money($product['price'])); ?></span>
                    <?php if ($on_sale): ?>
                        <s class="hb-pdp-price-old"><?php echo esc_html(nesports_money($product['old'])); ?></s>
                        <span class="hb-pdp-save-pill">Save <?php echo esc_html(nesports_money($product['old'] - $product['price'])); ?></span>
                    <?php endif; ?>
                </div>

                <div class="hb-pdp-stock-status">
                    <span class="hb-stock-dot"></span>
                    <span>In stock &bull; Dispatches within 24 hours</span>
                </div>

                <div class="hb-pdp-description">
                    <p>Engineered for maximum power and brutal gym sessions. Built using reinforced competition-grade materials with heavy-duty bar grip, ergonomic support, and industrial stitching to prevent tearing under extreme poundages.</p>
                </div>

                <div class="hb-pdp-highlights">
                    <div class="hb-pdp-hl"><i class="fa-solid fa-check"></i> Heavy-duty industrial reinforced construction</div>
                    <div class="hb-pdp-hl"><i class="fa-solid fa-check"></i> Tested and approved by competitive lifters</div>
                    <div class="hb-pdp-hl"><i class="fa-solid fa-check"></i> Sweat-resistant, non-slip ergonomic finish</div>
                </div>

                <!-- Add to Cart Form -->
                <div class="hb-pdp-actions">
                    <div class="hb-pdp-qty">
                        <button type="button" class="hb-qty-btn" id="hb-pdp-qty-minus">-</button>
                        <input type="number" id="hb-pdp-qty-input" value="1" min="1" max="99" readonly>
                        <button type="button" class="hb-qty-btn" id="hb-pdp-qty-plus">+</button>
                    </div>

                    <button type="button" class="hb-pdp-add-btn" id="hb-pdp-add-to-cart"
                        data-id="<?php echo esc_attr($product['slug']); ?>"
                        data-name="<?php echo esc_attr($product['name']); ?>"
                        data-price="<?php echo esc_attr($product['price']); ?>"
                        data-img="<?php echo esc_url(nesports_img($product['main'])); ?>">
                        <i class="fa-solid fa-cart-shopping"></i> ADD TO CART
                    </button>
                </div>
            </div>
        </div>

        <!-- Specifications & Details Tab -->
        <div class="hb-pdp-specs-section">
            <h2 class="hb-pdp-specs-heading">SPECIFICATIONS &amp; DETAILS</h2>
            <div class="hb-specs-table">
                <div class="hb-spec-row">
                    <span class="hb-spec-k">Brand</span>
                    <span class="hb-spec-v">NESPORTS3 Official</span>
                </div>
                <div class="hb-spec-row">
                    <span class="hb-spec-k">Category</span>
                    <span class="hb-spec-v"><?php echo esc_html(ucwords(strtolower($cat_name))); ?></span>
                </div>
                <div class="hb-spec-row">
                    <span class="hb-spec-k">Recommended For</span>
                    <span class="hb-spec-v">Powerlifting, Bodybuilding, Heavy Compound Training</span>
                </div>
                <div class="hb-spec-row">
                    <span class="hb-spec-k">Closure / Fastening</span>
                    <span class="hb-spec-v">Reinforced Hook-and-Loop / Double Stitching</span>
                </div>
                <div class="hb-spec-row">
                    <span class="hb-spec-k">Care Instructions</span>
                    <span class="hb-spec-v">Hand wash in cold water with mild detergent, air dry out of direct sunlight</span>
                </div>
            </div>
        </div>

        <!-- Related Gear -->
        <div class="hb-pdp-related-section">
            <h2 class="hb-pdp-specs-heading">YOU MAY ALSO LIKE</h2>
            <div class="hb-product-grid hb-product-grid--4">
                <?php foreach ($related as $r):
                    $r_url     = home_url('/product/' . $r['slug'] . '/');
                    $r_sale    = $r['old'] > $r['price'];
                    $r_pct     = $r_sale ? round((1 - $r['price'] / $r['old']) * 100) : 0; ?>
                <article class="hb-card">
                    <a class="hb-card-media" href="<?php echo esc_url($r_url); ?>">
                        <?php if ($r_sale): ?><span class="hb-save">Save <?php echo (int) $r_pct; ?>%</span><?php endif; ?>
                        <img class="hb-img-main" src="<?php echo esc_url(nesports_img($r['main'])); ?>" alt="<?php echo esc_attr($r['name']); ?>" loading="lazy">
                        <img class="hb-img-hover" src="<?php echo esc_url(nesports_img($r['hover'])); ?>" alt="" loading="lazy">
                    </a>
                    <div class="hb-card-body">
                        <div class="hb-card-meta">
                            <h3><a href="<?php echo esc_url($r_url); ?>"><?php echo esc_html($r['name']); ?></a></h3>
                            <div class="hb-card-price<?php echo $r_sale ? ' is-sale' : ''; ?>">
                                <span class="now"><?php echo esc_html(nesports_money($r['price'])); ?></span>
                                <?php if ($r_sale): ?><s><?php echo esc_html(nesports_money($r['old'])); ?></s><?php endif; ?>
                            </div>
                        </div>
                        <button type="button" class="hb-card-quick-add" data-id="<?php echo esc_attr($r['slug']); ?>" data-name="<?php echo esc_attr($r['name']); ?>" data-price="<?php echo esc_attr($r['price']); ?>" data-img="<?php echo esc_url(nesports_img($r['main'])); ?>" aria-label="Add to cart">
                            <i class="fa-solid fa-plus"></i> Quick Add
                        </button>
                    </div>
                </article>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</main>

<script>
// Thumbnail gallery switcher
document.querySelectorAll('.hb-pdp-thumb').forEach(function(thumb) {
    thumb.addEventListener('click', function() {
        document.querySelectorAll('.hb-pdp-thumb').forEach(function(t) { t.classList.remove('is-active'); });
        thumb.classList.add('is-active');
        var activeImg = document.getElementById('hb-pdp-active-img');
        if (activeImg) activeImg.src = thumb.dataset.src;
    });
});

// Quantity controls
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

// Add to Cart
var addBtn = document.getElementById('hb-pdp-add-to-cart');
if (addBtn) {
    addBtn.addEventListener('click', function() {
        var qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
        if (window.nesportsAddToCart) {
            window.nesportsAddToCart({
                id: this.dataset.id,
                name: this.dataset.name,
                price: parseFloat(this.dataset.price) || 0,
                img: this.dataset.img || '',
                qty: qty
            });
        }
    });
}
</script>

<?php include NESPORTS_PLUGIN_DIR . 'templates/footer-nesports.php'; ?>

