<?php
/**
 * NESPORTS3 - About Us Page Template
 * Extracted directly from official website reference
 */
$current_page = 'about';
include NESPORTS_PLUGIN_DIR . 'templates/header-nesports.php';

$page_id = get_queried_object_id();
if (!$page_id) {
    $page_id = get_the_ID();
}
if (!$page_id) {
    $page_id = 30090;
}

$rendered = false;
$is_elementor = false;
if (class_exists('\Elementor\Plugin')) {
    if (\Elementor\Plugin::$instance->preview->is_preview_mode() 
        || \Elementor\Plugin::$instance->editor->is_edit_mode() 
        || isset($_GET['elementor-preview']) 
        || isset($_GET['preview'])) {
        $is_elementor = true;
    } elseif (\Elementor\Plugin::$instance->db->is_built_with_elementor($page_id)) {
        $is_elementor = true;
    } elseif (\Elementor\Plugin::$instance->db->is_built_with_elementor(30090)) {
        $is_elementor = true;
        $page_id = 30090;
    }
}

if ($is_elementor) {
    ?>
    <main class="hb-about-page elementor-entry-content">
        <?php
        $target_post = get_post($page_id);
        if (!$target_post && $page_id != 30090) {
            $target_post = get_post(30090);
        }

        if ($target_post) {
            global $post;
            $orig_post = $post;
            $post = $target_post;
            setup_postdata($target_post);
            the_content();
            $post = $orig_post;
            wp_reset_postdata();
            $rendered = true;
        } elseif (have_posts()) {
            while (have_posts()) {
                the_post();
                the_content();
            }
            $rendered = true;
        }
        ?>
    </main>
    <?php
}

if (!$rendered) :
?>
<main class="hb-about-page">
    <!-- Top Black Header Banner Matching Screenshot -->
    <section class="hb-about-hero-banner">
        <h1 class="hb-about-banner-title"><?php echo esc_html(nesports_setting('about_banner_title', 'About Us')); ?></h1>
    </section>

    <!-- Main About Content Grid -->
    <section class="hb-about-content-section">
        <div class="hb-about-container">
            <div class="hb-about-two-col">
                <!-- Left: Athlete Photo -->
                <div class="hb-about-media-col">
                    <?php 
                    $about_img = nesports_setting('about_feature_img', 'WhatsApp-Image-2024-07-08-at-19.17.50_f9c47d7b-800x530.jpg');
                    ?>
                    <img src="<?php echo esc_url(nesports_img($about_img)); ?>" alt="NE Sports3 Athletes" class="hb-about-feature-img" loading="lazy">
                </div>

                <!-- Right: Official Extracted Story Text -->
                <div class="hb-about-text-col">
                    <?php 
                    $story_title = nesports_setting('about_story_title', '');
                    if (!empty($story_title)): ?>
                        <h2 style="font-size: 28px; font-weight: 700; color: #111111; margin: 0 0 16px;"><?php echo esc_html($story_title); ?></h2>
                    <?php endif; ?>

                    <?php 
                    $default_story = "At NE Sports3, we believe sports and fitness are more than just activities – they are a lifestyle. Our mission is to empower athletes, fitness enthusiasts, and everyday champions with the highest-quality sports and gym products that inspire performance, strength, and confidence.\n\nFrom durable gym equipment and training accessories to premium sports gear, we carefully select every product to ensure it meets the needs of both beginners and professionals. Whether you’re building strength in the gym, training for competition, or simply staying active, NE Sports3 is here to support your journey.\n\nWe are passionate about helping our community stay fit, healthy, and motivated. That’s why we combine top-notch products, affordable prices, and reliable service – because your goals matter to us.\n\nAt NE Sports3, it’s not just about products, it’s about progress. Let us be your trusted partner in achieving your fitness and sports ambitions.";
                    $story_text = nesports_setting('about_story_text', nesports_setting('about_story_desc', $default_story));
                    $paras = explode("\n\n", str_replace("\r\n", "\n", $story_text));
                    foreach ($paras as $p):
                        if (trim($p) !== ''):
                    ?>
                        <p><?php echo wp_kses_post(nl2br(trim($p))); ?></p>
                    <?php 
                        endif;
                    endforeach; 
                    ?>

                    <?php 
                    $motto = nesports_setting('about_motto', 'Train harder. Play stronger. Live better – with NE Sports3.');
                    if (!empty($motto)): ?>
                        <p class="hb-about-motto"><?php echo esc_html($motto); ?></p>
                    <?php endif; ?>
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

.hb-about-motto {
    font-size: 16.5px;
    color: #111827;
    padding-top: 8px;
    font-weight: 600;
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

<?php
include NESPORTS_PLUGIN_DIR . 'templates/footer-nesports.php';
