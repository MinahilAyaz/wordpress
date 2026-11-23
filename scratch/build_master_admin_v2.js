const fs = require('fs');
const path = require('path');

const adminClassFile = path.join(__dirname, '..', 'nesports-pro-store', 'includes', 'class-nesports-admin.php');

// Let's read the current file and insert the Pages Manager tab cleanly
let content = fs.readFileSync(adminClassFile, 'utf8');

// 1. Add hook for page actions
if (!content.includes('handle_page_actions')) {
    content = content.replace(
        "add_action('admin_init', array($this, 'handle_product_actions'));",
        "add_action('admin_init', array($this, 'handle_product_actions'));\n        add_action('admin_init', array($this, 'handle_page_actions'));"
    );
}

// 2. Add handle_page_actions method
const pageActionsMethod = `
    /**
     * Handle Pages Manager Actions (Save Page Content, Create Page)
     */
    public function handle_page_actions() {
        if (!isset($_POST['nesports_page_action'])) {
            return;
        }

        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized user', 'nesports-pro-store'));
        }

        check_admin_referer('nesports_page_action_nonce');
        $action = sanitize_text_field($_POST['nesports_page_action']);

        if ($action === 'save_page_content') {
            $pid     = intval($_POST['edit_page_id'] ?? 0);
            $title   = sanitize_text_field($_POST['edit_page_title'] ?? '');
            $content = wp_kses_post($_POST['edit_page_content'] ?? '');

            if ($pid > 0) {
                wp_update_post(array(
                    'ID'           => $pid,
                    'post_title'   => $title,
                    'post_content' => $content
                ));
                wp_redirect(admin_url('admin.php?page=nesports-pro-store&tab=pages_mgr&selected_page=' . $pid . '&msg=page_saved'));
                exit;
            }
        }

        if ($action === 'create_page') {
            $new_title = sanitize_text_field($_POST['new_page_title'] ?? '');
            if (!empty($new_title)) {
                $new_pid = wp_insert_post(array(
                    'post_title'   => $new_title,
                    'post_status'  => 'publish',
                    'post_type'    => 'page',
                    'post_content' => ''
                ));
                wp_redirect(admin_url('admin.php?page=nesports-pro-store&tab=pages_mgr&selected_page=' . $new_pid . '&msg=page_created'));
                exit;
            }
        }
    }
`;

if (!content.includes('function handle_page_actions')) {
    content = content.replace("public function handle_product_actions() {", pageActionsMethod + "\n    public function handle_product_actions() {");
}

// 3. Add tab button to navigation
const oldTabNav = `<button type="button" class="nes-tab-btn <?php echo $active_tab === 'home' ? 'active' : ''; ?>" onclick="nesSwitchTab('home')" style="padding: 12px 20px; font-size: 14px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 3px solid transparent; color: #64748b; display: flex; align-items: center; gap: 8px;">
                    <span class="dashicons dashicons-admin-home"></span> 1. Home Page Sections
                </button>`;

const newTabNav = `<button type="button" class="nes-tab-btn <?php echo $active_tab === 'home' ? 'active' : ''; ?>" onclick="nesSwitchTab('home')" style="padding: 12px 20px; font-size: 14px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 3px solid transparent; color: #64748b; display: flex; align-items: center; gap: 8px;">
                    <span class="dashicons dashicons-admin-home"></span> 1. Home Page Sections
                </button>
                <button type="button" class="nes-tab-btn <?php echo $active_tab === 'pages_mgr' ? 'active' : ''; ?>" onclick="nesSwitchTab('pages_mgr')" style="padding: 12px 20px; font-size: 14px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 3px solid transparent; color: #64748b; display: flex; align-items: center; gap: 8px; background: #fff0f3; border-radius: 8px 8px 0 0;">
                    <span class="dashicons dashicons-admin-page" style="color: #e11d48;"></span> <strong>2. All Pages Manager & Editor</strong>
                </button>`;

content = content.replace(oldTabNav, newTabNav);

// 4. Renumber other tab labels for clarity
content = content.replace("2. About Us Page", "3. About Us Page");
content = content.replace("3. Contact Us Page", "4. Contact Us Page");
content = content.replace("4. Products & Variations", "5. Products & Variations");
content = content.replace("5. Colors & Styling", "6. Colors & Styling");
content = content.replace("6. SEO Keywords & Meta", "7. SEO Keywords & Meta");
content = content.replace("7. Header & Footer", "8. Header & Footer");

// 5. Add notifications for page save & create
const oldNotices = `<?php elseif ($msg === 'added'): ?>`;
const newNotices = `<?php elseif ($msg === 'page_saved'): ?>
                <div class="notice notice-success is-dismissible" style="padding: 14px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; background: #ecfdf5; border-left: 4px solid #10b981; color: #065f46; margin-bottom: 22px;">
                    Page content and title have been updated successfully!
                </div>
            <?php elseif ($msg === 'page_created'): ?>
                <div class="notice notice-success is-dismissible" style="padding: 14px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; background: #ecfdf5; border-left: 4px solid #10b981; color: #065f46; margin-bottom: 22px;">
                    New page created successfully and published!
                </div>
            <?php elseif ($msg === 'added'): ?>`;

content = content.replace(oldNotices, newNotices);

// 6. Build the Pages Manager tab pane HTML
const pagesManagerTabHtml = `
                <!-- ==========================================
                     TAB 2: ALL PAGES MANAGER & EDITOR
                     ========================================== -->
                <div id="nes-tab-pages_mgr" class="nes-tab-pane" style="<?php echo $active_tab === 'pages_mgr' ? 'display:block;' : 'display:none;'; ?>">
                    <div style="background: #ffffff; border-radius: 12px; padding: 24px 30px; box-shadow: 0 1px 6px rgba(0,0,0,0.06); margin-bottom: 24px;">
                        
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 14px;">
                            <div>
                                <h2 style="margin: 0 0 6px; font-size: 20px; font-weight: 700; color: #0f172a;">Website Pages Manager & Quick Editor</h2>
                                <p style="margin: 0; color: #64748b; font-size: 14px;">
                                    View, edit, or launch Elementor for all store pages in one place without digging through confusing lists.
                                </p>
                            </div>
                            <div>
                                <button type="button" onclick="document.getElementById('nes-new-page-modal').style.display='flex';" class="button button-primary" style="background: #e11d48; border-color: #be123c; font-size: 13.5px; height: 40px; padding: 0 18px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; border-radius: 8px;">
                                    <span class="dashicons dashicons-plus-alt2" style="margin-top: 2px;"></span> + Create New Page
                                </button>
                            </div>
                        </div>

                        <!-- CORE STORE PAGES GRID -->
                        <h3 style="font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 14px;">Primary Store Pages</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px; margin-bottom: 32px;">
                            
                            <!-- 1. Home Page -->
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 20px; border-left: 4px solid #e11d48;">
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                                    <strong style="font-size: 16px; color: #0f172a;">Flagship Home Page</strong>
                                    <span style="background: #e0f2fe; color: #0369a1; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px;">FRONT PAGE</span>
                                </div>
                                <p style="font-size: 13px; color: #64748b; margin: 0 0 14px;">URL: <code>/</code> (ID: 1038)</p>
                                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                    <button type="button" class="button" onclick="nesSwitchTab('home')" style="font-size: 12.5px; height: 32px; font-weight: 600; color: #e11d48;">
                                        ⚡ Edit Sections
                                    </button>
                                    <a href="<?php echo esc_url(admin_url('post.php?post=1038&action=elementor')); ?>" target="_blank" class="button button-primary" style="font-size: 12.5px; height: 32px; font-weight: 600;">
                                        🎨 Edit in Elementor
                                    </a>
                                    <a href="<?php echo esc_url(home_url('/')); ?>" target="_blank" class="button" style="font-size: 12.5px; height: 32px;">
                                        👁️ View Live
                                    </a>
                                </div>
                            </div>

                            <!-- 2. The NE Sports Story (About Us) -->
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 20px; border-left: 4px solid #3b82f6;">
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                                    <strong style="font-size: 16px; color: #0f172a;">The Story & Mission</strong>
                                    <span style="background: #ecfdf5; color: #047857; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px;">LIVE ABOUT US</span>
                                </div>
                                <p style="font-size: 13px; color: #64748b; margin: 0 0 14px;">URL: <code>/our-story/</code> (ID: 30090)</p>
                                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                    <button type="button" class="button" onclick="nesSwitchTab('about')" style="font-size: 12.5px; height: 32px; font-weight: 600; color: #3b82f6;">
                                        ⚡ Edit Story
                                    </button>
                                    <a href="<?php echo esc_url(admin_url('post.php?post=30090&action=elementor')); ?>" target="_blank" class="button button-primary" style="font-size: 12.5px; height: 32px; font-weight: 600;">
                                        🎨 Edit in Elementor
                                    </a>
                                    <a href="<?php echo esc_url(home_url('/our-story/')); ?>" target="_blank" class="button" style="font-size: 12.5px; height: 32px;">
                                        👁️ View Live
                                    </a>
                                </div>
                            </div>

                            <!-- 3. Contact Us -->
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 20px; border-left: 4px solid #10b981;">
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                                    <strong style="font-size: 16px; color: #0f172a;">Contact & Helpdesk</strong>
                                    <span style="background: #ecfdf5; color: #047857; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px;">LIVE CONTACT</span>
                                </div>
                                <p style="font-size: 13px; color: #64748b; margin: 0 0 14px;">URL: <code>/contact-us/</code> (ID: 4439)</p>
                                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                    <button type="button" class="button" onclick="nesSwitchTab('contact')" style="font-size: 12.5px; height: 32px; font-weight: 600; color: #10b981;">
                                        ⚡ Edit Details
                                    </button>
                                    <a href="<?php echo esc_url(admin_url('post.php?post=4439&action=elementor')); ?>" target="_blank" class="button button-primary" style="font-size: 12.5px; height: 32px; font-weight: 600;">
                                        🎨 Edit in Elementor
                                    </a>
                                    <a href="<?php echo esc_url(home_url('/contact-us/')); ?>" target="_blank" class="button" style="font-size: 12.5px; height: 32px;">
                                        👁️ View Live
                                    </a>
                                </div>
                            </div>

                            <!-- 4. Shop / Catalog -->
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 20px; border-left: 4px solid #f59e0b;">
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                                    <strong style="font-size: 16px; color: #0f172a;">Shop / All Products</strong>
                                    <span style="background: #fef3c7; color: #b45309; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px;">CATALOG</span>
                                </div>
                                <p style="font-size: 13px; color: #64748b; margin: 0 0 14px;">URL: <code>/shop/</code> (ID: 47)</p>
                                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                    <button type="button" class="button" onclick="nesSwitchTab('products')" style="font-size: 12.5px; height: 32px; font-weight: 600; color: #f59e0b;">
                                        ⚡ Manage Products
                                    </button>
                                    <a href="<?php echo esc_url(admin_url('post.php?post=47&action=elementor')); ?>" target="_blank" class="button button-primary" style="font-size: 12.5px; height: 32px; font-weight: 600;">
                                        🎨 Edit in Elementor
                                    </a>
                                    <a href="<?php echo esc_url(home_url('/shop/')); ?>" target="_blank" class="button" style="font-size: 12.5px; height: 32px;">
                                        👁️ View Live
                                    </a>
                                </div>
                            </div>

                        </div>

                        <!-- ALL PAGES QUICK CONTENT EDITOR -->
                        <div style="border-top: 2px solid #e2e8f0; padding-top: 24px;">
                            <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 6px;">
                                ✍️ Edit Any Page Content Directly From Dashboard
                            </h3>
                            <p style="margin: 0 0 16px; color: #64748b; font-size: 13.5px;">
                                Select any page from your website below to edit its Title and Content paragraphs instantly without opening Elementor:
                            </p>

                            <?php
                            $all_wp_pages = function_exists('get_pages') ? get_pages(array('post_status' => 'publish,draft')) : array();
                            $sel_pid = intval($_GET['selected_page'] ?? (isset($all_wp_pages[0]) ? $all_wp_pages[0]->ID : 0));
                            $curr_edit_page = $sel_pid ? get_post($sel_pid) : null;
                            ?>

                            <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                                <label style="font-weight: 600; color: #334155;">Select Page to Edit:</label>
                                <select onchange="window.location.href='<?php echo esc_url(admin_url('admin.php?page=nesports-pro-store&tab=pages_mgr&selected_page=')); ?>' + this.value;" style="height: 40px; border-radius: 6px; padding: 0 14px; font-size: 14px; border: 1px solid #cbd5e1; min-width: 280px;">
                                    <?php foreach ($all_wp_pages as $wp_p): ?>
                                        <option value="<?php echo esc_attr($wp_p->ID); ?>" <?php selected($sel_pid, $wp_p->ID); ?>>
                                            <?php echo esc_html($wp_p->post_title); ?> (Slug: /<?php echo esc_html($wp_p->post_name); ?>/) [<?php echo esc_html(strtoupper($wp_p->post_status)); ?>]
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                                <?php if ($curr_edit_page): ?>
                                    <a href="<?php echo esc_url(admin_url('post.php?post=' . $curr_edit_page->ID . '&action=elementor')); ?>" target="_blank" class="button" style="height: 40px; display: inline-flex; align-items: center; gap: 6px;">
                                        <span class="dashicons dashicons-art"></span> Open in Elementor
                                    </a>
                                    <a href="<?php echo esc_url(get_permalink($curr_edit_page->ID)); ?>" target="_blank" class="button" style="height: 40px; display: inline-flex; align-items: center; gap: 6px;">
                                        <span class="dashicons dashicons-external"></span> View Page
                                    </a>
                                <?php endif; ?>
                            </div>

                            <?php if ($curr_edit_page): ?>
                                <form method="post" action="<?php echo esc_url(admin_url('admin.php?page=nesports-pro-store')); ?>" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 22px;">
                                    <?php wp_nonce_field('nesports_page_action_nonce'); ?>
                                    <input type="hidden" name="nesports_page_action" value="save_page_content" />
                                    <input type="hidden" name="edit_page_id" value="<?php echo esc_attr($curr_edit_page->ID); ?>" />

                                    <div style="margin-bottom: 16px;">
                                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Page Title:</label>
                                        <input type="text" name="edit_page_title" value="<?php echo esc_attr($curr_edit_page->post_title); ?>" class="widefat" style="height: 40px; border-radius: 6px; font-weight: 600;" required />
                                    </div>

                                    <div style="margin-bottom: 18px;">
                                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Page Content (Text & Descriptions):</label>
                                        <textarea name="edit_page_content" rows="10" class="widefat" style="border-radius: 6px; padding: 12px; font-size: 14px; line-height: 1.6;"><?php echo esc_textarea($curr_edit_page->post_content); ?></textarea>
                                        <p class="description">HTML tags and formatting are preserved.</p>
                                    </div>

                                    <button type="submit" class="button button-primary" style="height: 42px; padding: 0 24px; font-size: 14px; font-weight: 700; background: #e11d48; border-color: #be123c; border-radius: 6px;">
                                        Save Page Changes
                                    </button>
                                </form>
                            <?php endif; ?>

                        </div>

                    </div>
                </div>

                <!-- CREATE NEW PAGE MODAL -->
                <div id="nes-new-page-modal" style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(15,23,42,0.6); backdrop-filter:blur(4px); z-index:99999; align-items:center; justify-content:center; padding:20px;">
                    <div style="background:#ffffff; border-radius:12px; width:100%; max-width:520px; box-shadow:0 20px 40px rgba(0,0,0,0.25); padding:28px 32px;">
                        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; border-bottom:1px solid #e2e8f0; padding-bottom:12px;">
                            <h2 style="margin:0; font-size:18px; font-weight:700; color:#0f172a;">Create New Website Page</h2>
                            <button type="button" onclick="document.getElementById('nes-new-page-modal').style.display='none';" style="background:none; border:none; font-size:24px; cursor:pointer; color:#94a3b8;">&times;</button>
                        </div>
                        <form method="post" action="<?php echo esc_url(admin_url('admin.php?page=nesports-pro-store')); ?>">
                            <?php wp_nonce_field('nesports_page_action_nonce'); ?>
                            <input type="hidden" name="nesports_page_action" value="create_page" />
                            <div style="margin-bottom:18px;">
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Page Name / Title *</label>
                                <input type="text" name="new_page_title" placeholder="e.g. Size & Fit Guide, FAQ, Wholesale" required class="widefat" style="height:40px; border-radius:6px;" />
                            </div>
                            <div style="display:flex; justify-content:flex-end; gap:10px; border-top:1px solid #e2e8f0; padding-top:16px;">
                                <button type="button" onclick="document.getElementById('nes-new-page-modal').style.display='none';" class="button button-secondary" style="height:38px;">Cancel</button>
                                <button type="submit" class="button button-primary" style="height:38px; padding:0 20px; background:#e11d48; border-color:#be123c; font-weight:700;">Create & Publish Page</button>
                            </div>
                        </form>
                    </div>
                </div>
`;

// Insert pagesManagerTabHtml right before TAB 2: ABOUT US PAGE
content = content.replace("<!-- ==========================================\n                     TAB 2: ABOUT US PAGE", pagesManagerTabHtml + "\n                <!-- ==========================================\n                     TAB 3: ABOUT US PAGE");

fs.writeFileSync(adminClassFile, content, 'utf8');
console.log('Successfully added Pages Manager & Quick Editor to class-nesports-admin.php!');
