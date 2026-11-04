<?php
/**
 * NESPORTS3 - Sizing Guide Page Template
 */
$current_page = 'sizing';
include NESPORTS_PLUGIN_DIR . 'templates/header-nesports.php';
?>

<main class="hb-page-contact hb-page-sizing">
    <div class="hb-contact-wrapper">
        <span class="hb-contact-eyebrow">FIT &amp; SPECIFICATIONS</span>
        <h1 class="hb-contact-heading">OFFICIAL SIZING GUIDE</h1>
        <p class="hb-sizing-lead">Find your ideal fit across our competition gear. When measuring for weightlifting belts, measure around your navel (belly button) with your core relaxed, NOT your pant waist size.</p>

        <!-- Sizing Section: Weightlifting Belts -->
        <section class="hb-sizing-section">
            <div class="hb-sizing-head">
                <h2><i class="fa-solid fa-shield-halved"></i> Weightlifting Belts (10mm &amp; 13mm)</h2>
                <p>Designed for powerlifting and heavy compound movements.</p>
            </div>
            <div class="hb-specs-table">
                <div class="hb-spec-row hb-spec-row--head">
                    <span class="hb-spec-k">Size</span>
                    <span class="hb-spec-v">Waist Measurement (Navel Level)</span>
                </div>
                <div class="hb-spec-row">
                    <span class="hb-spec-k">Small (S)</span>
                    <span class="hb-spec-v">26" – 32" (66cm – 81cm)</span>
                </div>
                <div class="hb-spec-row">
                    <span class="hb-spec-k">Medium (M)</span>
                    <span class="hb-spec-v">30" – 36" (76cm – 91cm)</span>
                </div>
                <div class="hb-spec-row">
                    <span class="hb-spec-k">Large (L)</span>
                    <span class="hb-spec-v">34" – 40" (86cm – 102cm)</span>
                </div>
                <div class="hb-spec-row">
                    <span class="hb-spec-k">X-Large (XL)</span>
                    <span class="hb-spec-v">38" – 44" (97cm – 112cm)</span>
                </div>
                <div class="hb-spec-row">
                    <span class="hb-spec-k">2X-Large (2XL)</span>
                    <span class="hb-spec-v">42" – 48" (107cm – 122cm)</span>
                </div>
            </div>
        </section>

        <!-- Sizing Section: Knee Wraps & Sleeves -->
        <section class="hb-sizing-section" style="margin-top: 40px;">
            <div class="hb-sizing-head">
                <h2><i class="fa-solid fa-tape"></i> Knee Wraps &amp; Sleeves</h2>
                <p>Measure the circumference of your knee joint at the center of the kneecap with leg locked straight.</p>
            </div>
            <div class="hb-specs-table">
                <div class="hb-spec-row hb-spec-row--head">
                    <span class="hb-spec-k">Size</span>
                    <span class="hb-spec-v">Knee Circumference (Straight Leg)</span>
                </div>
                <div class="hb-spec-row">
                    <span class="hb-spec-k">Small (S)</span>
                    <span class="hb-spec-v">12.0" – 13.5" (30cm – 34cm)</span>
                </div>
                <div class="hb-spec-row">
                    <span class="hb-spec-k">Medium (M)</span>
                    <span class="hb-spec-v">13.5" – 15.0" (34cm – 38cm)</span>
                </div>
                <div class="hb-spec-row">
                    <span class="hb-spec-k">Large (L)</span>
                    <span class="hb-spec-v">15.0" – 16.5" (38cm – 42cm)</span>
                </div>
                <div class="hb-spec-row">
                    <span class="hb-spec-k">X-Large (XL)</span>
                    <span class="hb-spec-v">16.5" – 18.0" (42cm – 46cm)</span>
                </div>
                <div class="hb-spec-row">
                    <span class="hb-spec-k">Heavy Knee Wraps (2.0m &amp; 2.5m)</span>
                    <span class="hb-spec-v">One Size Fits All (Fully Adjustable Tension)</span>
                </div>
            </div>
        </section>

        <!-- Sizing Section: Wrist Straps & Bandages -->
        <section class="hb-sizing-section" style="margin-top: 40px;">
            <div class="hb-sizing-head">
                <h2><i class="fa-solid fa-hand-fist"></i> Wrist Bandages &amp; Lifting Straps</h2>
                <p>Standard universal sizes engineered for all lifters.</p>
            </div>
            <div class="hb-specs-table">
                <div class="hb-spec-row hb-spec-row--head">
                    <span class="hb-spec-k">Gear Type</span>
                    <span class="hb-spec-v">Dimensions &amp; Fit</span>
                </div>
                <div class="hb-spec-row">
                    <span class="hb-spec-k">Wrist Bandages</span>
                    <span class="hb-spec-v">45 cm (18") &amp; 60 cm (24") Length &bull; Heavy-duty thumb loop</span>
                </div>
                <div class="hb-spec-row">
                    <span class="hb-spec-k">Padded Lifting Straps</span>
                    <span class="hb-spec-v">24" Length x 1.5" Width &bull; 5mm Neoprene wrist cushion</span>
                </div>
            </div>
        </section>

        <div style="margin-top: 50px; text-align: center;">
            <a href="<?php echo esc_url(home_url('/shop/')); ?>" class="hb-btn-red" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 400; border-radius: 8px; text-decoration: none;">EXPLORE THE COLLECTION</a>
        </div>
    </div>
</main>

<style>
.hb-sizing-lead {
    font-size: 15.5px;
    color: #52525b;
    line-height: 1.6;
    margin: 0 0 36px;
    max-width: 800px;
}
.hb-sizing-head h2 {
    font-size: 19px;
    font-weight: 400;
    color: #111827;
    margin: 0 0 6px;
    display: flex;
    align-items: center;
    gap: 10px;
}
.hb-sizing-head h2 i {
    color: var(--hb-accent);
    font-size: 18px;
}
.hb-sizing-head p {
    font-size: 13.5px;
    color: #6b7280;
    margin: 0 0 16px;
}
.hb-spec-row--head {
    background: #111827 !important;
    color: #ffffff;
    font-weight: 400;
    font-size: 13px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}
.hb-spec-row--head .hb-spec-k,
.hb-spec-row--head .hb-spec-v {
    color: #ffffff !important;
}
</style>

<?php include NESPORTS_PLUGIN_DIR . 'templates/footer-nesports.php'; ?>

