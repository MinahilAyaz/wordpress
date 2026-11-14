<?php
/**
 * NESPORTS3 - About Us Page Template
 * Extracted directly from official website reference
 */
$current_page = 'about';
include NESPORTS_PLUGIN_DIR . 'templates/header-nesports.php';

if (function_exists('the_content') && did_action('elementor/loaded') && (isset($_GET['elementor-preview']) || get_post_meta(get_the_ID(), '_nesports_elementor_seeded', true))) :
?>
<main class="hb-about-page">
    <?php
    while (have_posts()) :
        the_post();
        the_content();
    endwhile;
    ?>
</main>
<?php else : ?>
<main class="hb-about-page">
    <!-- Top Black Header Banner Matching Screenshot -->
    <section class="hb-about-hero-banner">
        <h1 class="hb-about-banner-title">About Us</h1>
    </section>

    <!-- Main About Content Grid -->
    <section class="hb-about-content-section">
        <div class="hb-about-container">
            <div class="hb-about-two-col">
                <!-- Left: Athlete Photo -->
                <div class="hb-about-media-col">
                    <img src="<?php echo esc_url(nesports_img('WhatsApp-Image-2024-07-08-at-19.17.50_f9c47d7b-800x530.jpg')); ?>" alt="NE Sports3 Athletes" class="hb-about-feature-img" loading="lazy">
                </div>

                <!-- Right: Official Extracted Story Text -->
                <div class="hb-about-text-col">
                    <p>At NE Sports3, we believe sports and fitness are more than just activities – they are a lifestyle. Our mission is to empower athletes, fitness enthusiasts, and everyday champions with the highest-quality sports and gym products that inspire performance, strength, and confidence.</p>

                    <p>From durable gym equipment and training accessories to premium sports gear, we carefully select every product to ensure it meets the needs of both beginners and professionals. Whether you’re building strength in the gym, training for competition, or simply staying active, NE Sports3 is here to support your journey.</p>

                    <p>We are passionate about helping our community stay fit, healthy, and motivated. That’s why we combine top-notch products, affordable prices, and reliable service – because your goals matter to us.</p>

                    <p>At NE Sports3, it’s not just about products, it’s about progress. Let us be your trusted partner in achieving your fitness and sports ambitions.</p>

                    <p class="hb-about-motto">Train harder. Play stronger. Live better – with NE Sports3.</p>
                </div>
            </div>
        </div>
    </section>
</main>
<?php endif; ?>

<style>
.hb-about-page {
    background: #ffffff;
    min-height: 70vh;
}

.hb-about-hero-banner {
    background: #000000;
    color: #ffffff;
    padding: 56px 20px;
    text-align: center;
}

.hb-about-banner-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 400;
    color: #ffffff;
    margin: 0;
    font-family: var(--hb-font);
    letter-spacing: -0.01em;
}

.hb-about-content-section {
    padding: 70px 24px 100px;
}

.hb-about-container {
    max-width: 1160px;
    margin: 0 auto;
}

.hb-about-two-col {
    display: grid;
    grid-template-columns: 1fr 1.15fr;
    gap: 56px;
    align-items: center;
}

.hb-about-media-col {
    position: relative;
}

.hb-about-feature-img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
    object-fit: cover;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.hb-about-text-col {
    display: flex;
    flex-direction: column;
    gap: 18px;
    font-size: 15.5px;
    line-height: 1.75;
    color: #374151;
    font-family: var(--hb-font);
}

.hb-about-text-col p {
    margin: 0;
}

.hb-about-text-col strong {
    color: #111827;
    font-weight: 400;
}

.hb-about-motto {
    font-size: 16.5px;
    color: #111827;
    padding-top: 8px;
}

@media (max-width: 900px) {
    .hb-about-two-col {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .hb-about-content-section {
        padding: 50px 20px 70px;
    }
    .hb-about-hero-banner {
        padding: 44px 20px;
    }
}
</style>

<?php include NESPORTS_PLUGIN_DIR . 'templates/footer-nesports.php'; ?>
