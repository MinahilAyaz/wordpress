<?php
/**
 * NESPORTS3 - Contact Us Page
 * Matched 1:1 with nesports3.com/contact-us/
 */
include NESPORTS_PLUGIN_DIR . 'templates/header-nesports.php';

if (function_exists('the_content') && did_action('elementor/loaded') && (isset($_GET['elementor-preview']) || get_post_meta(get_the_ID(), '_nesports_elementor_seeded', true))) :
?>
<main class="hb-main hb-page-contact">
    <?php
    while (have_posts()) :
        the_post();
        the_content();
    endwhile;
    ?>
</main>
<?php else : ?>
<main class="hb-main hb-page-contact">
    <div class="hb-container">
        <div class="hb-contact-wrapper">
            <span class="hb-contact-eyebrow">INFORMATION ABOUT US</span>
            <h1 class="hb-contact-heading">CONTACT US FOR ANY QUESTIONS</h1>

            <form class="hb-contact-form" id="hb-contact-form" onsubmit="handleContactSubmit(event)">
                <div class="hb-form-row">
                    <div class="hb-form-col">
                        <label for="contact_name">Your Name</label>
                        <input type="text" id="contact_name" name="contact_name" required>
                    </div>
                    <div class="hb-form-col">
                        <label for="contact_email">Your Email</label>
                        <input type="email" id="contact_email" name="contact_email" required>
                    </div>
                </div>

                <div class="hb-form-row">
                    <div class="hb-form-col">
                        <label for="contact_phone">Phone Number</label>
                        <input type="tel" id="contact_phone" name="contact_phone">
                    </div>
                    <div class="hb-form-col">
                        <label for="contact_company">Company</label>
                        <input type="text" id="contact_company" name="contact_company">
                    </div>
                </div>

                <div class="hb-form-row hb-form-row-full">
                    <div class="hb-form-col">
                        <label for="contact_message">Your Message</label>
                        <textarea id="contact_message" name="contact_message" rows="8" required></textarea>
                    </div>
                </div>

                <div class="hb-form-actions">
                    <button type="submit" class="hb-btn-ask" id="hb-btn-ask">ASK A QUESTION</button>
                </div>

                <div class="hb-form-success" id="hb-form-success" style="display: none;">
                    <i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully. We will get back to you shortly.
                </div>
            </form>
        </div>
    </div>
</main>

<script>
function handleContactSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('hb-btn-ask');
    const successMsg = document.getElementById('hb-form-success');
    btn.disabled = true;
    btn.textContent = 'SENDING...';

    setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'ASK A QUESTION';
        document.getElementById('hb-contact-form').reset();
        successMsg.style.display = 'block';
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 5000);
    }, 800);
}
</script>
<?php endif; ?>

<?php include NESPORTS_PLUGIN_DIR . 'templates/footer-nesports.php'; ?>
