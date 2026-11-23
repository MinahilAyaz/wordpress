const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'build_admin_class.js');
let content = fs.readFileSync(srcFile, 'utf8');

// 1. Replace the hardcoded 3-page table with the All Pages table
const oldTableBlock = `                                <?php
                                $page_list = array(
                                    'home' => array('name' => 'Flagship Home Page', 'slug' => 'home'),
                                    'our-story' => array('name' => 'The NE Sports Story', 'slug' => 'our-story'),
                                    'contact' => array('name' => 'Contact & Help Center', 'slug' => 'contact-us')
                                );

                                foreach ($page_list as $key => $pinfo):
                                    $pid = isset($pages[$key]) ? $pages[$key] : 0;
                                    $page_exists = $pid && get_post($pid) && get_post_status($pid) !== 'trash';
                                    $is_front = ($pid && $pid === $front_page_id);
                                ?>
                                <tr>
                                    <td>
                                        <strong><?php echo esc_html($pinfo['name']); ?></strong>
                                        <?php if ($is_front): ?>
                                            <span class="nesports-badge-front">Front Page</span>
                                        <?php endif; ?>
                                    </td>
                                    <td><code>/<?php echo esc_html($pinfo['slug']); ?>/</code></td>
                                    <td>
                                        <?php if ($page_exists): ?>
                                            <span class="status-dot status-active"></span> Published
                                        <?php else: ?>
                                            <span class="status-dot status-missing"></span> Not Deployed
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php if ($page_exists): ?>
                                            <a href="<?php echo esc_url(get_permalink($pid)); ?>" target="_blank" class="button button-small">View</a>
                                            <a href="<?php echo esc_url(admin_url('post.php?post=' . $pid . '&action=edit')); ?>" class="button button-small">Edit in WP</a>
                                        <?php else: ?>
                                            <button type="button" class="button button-small btn-single-gen" data-page="<?php echo esc_attr($key); ?>">Create</button>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                                <?php endforeach; ?>`;

const newTableBlock = `                                <?php
                                $all_wp_pages = get_pages(array(
                                    'post_status' => 'publish,draft,private',
                                    'sort_column' => 'post_date',
                                    'sort_order'  => 'DESC'
                                ));
                                $front_page_id = (int) get_option('page_on_front');

                                foreach ($all_wp_pages as $p):
                                    $pid = $p->ID;
                                    $is_front = ($pid === $front_page_id || $p->post_name === 'home');
                                    $is_story = ($pid === 30090 || $p->post_name === 'our-story');
                                    $is_contact = ($pid === 4439 || $p->post_name === 'contact-us');
                                    $is_shop = ($pid === 47 || $p->post_name === 'shop');
                                    $is_cart = ($p->post_name === 'cart');
                                    $is_checkout = ($p->post_name === 'checkout');
                                    $is_account = ($p->post_name === 'my-account');
                                    $is_draft = ($p->post_status === 'draft');
                                    $title = !empty(trim($p->post_title)) ? $p->post_title : '(Untitled Page #' . $pid . ')';
                                ?>
                                <tr class="nes-page-item-row" data-name="<?php echo esc_attr(strtolower($title)); ?>" data-slug="<?php echo esc_attr(strtolower($p->post_name)); ?>">
                                    <td style="padding: 10px 12px; vertical-align: middle;">
                                        <strong style="color: #0f172a; font-size: 13.5px;"><?php echo esc_html($title); ?></strong>
                                        <?php if ($is_front): ?>
                                            <span style="margin-left: 6px; font-size: 10.5px; background: #e0f2fe; color: #0369a1; padding: 2px 7px; border-radius: 999px; font-weight: 700;">Front Page</span>
                                        <?php elseif ($is_story): ?>
                                            <span style="margin-left: 6px; font-size: 10.5px; background: #ecfdf5; color: #047857; padding: 2px 7px; border-radius: 999px; font-weight: 700;">About Story</span>
                                        <?php elseif ($is_contact): ?>
                                            <span style="margin-left: 6px; font-size: 10.5px; background: #ecfdf5; color: #047857; padding: 2px 7px; border-radius: 999px; font-weight: 700;">Contact Us</span>
                                        <?php elseif ($is_shop): ?>
                                            <span style="margin-left: 6px; font-size: 10.5px; background: #fef3c7; color: #b45309; padding: 2px 7px; border-radius: 999px; font-weight: 700;">Shop</span>
                                        <?php elseif ($is_cart || $is_checkout || $is_account): ?>
                                            <span style="margin-left: 6px; font-size: 10.5px; background: #f1f5f9; color: #475569; padding: 2px 7px; border-radius: 999px; font-weight: 600;">WooCommerce</span>
                                        <?php endif; ?>
                                    </td>
                                    <td style="padding: 10px 12px; vertical-align: middle;">
                                        <code style="font-size: 12px; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">/<?php echo esc_html($p->post_name); ?>/</code>
                                    </td>
                                    <td style="padding: 10px 12px; vertical-align: middle;">
                                        <?php if ($is_draft): ?>
                                            <span style="background: #f1f5f9; color: #64748b; font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 4px;">Draft</span>
                                        <?php else: ?>
                                            <span class="status-dot status-active" style="display: inline-block; width: 7px; height: 7px; background: #10b981; border-radius: 50%; margin-right: 4px;"></span>
                                            <span style="color: #059669; font-weight: 600; font-size: 12px;">Published</span>
                                        <?php endif; ?>
                                    </td>
                                    <td style="padding: 10px 12px; vertical-align: middle; text-align: right; white-space: nowrap;">
                                        <a href="<?php echo esc_url(get_permalink($pid)); ?>" target="_blank" class="button button-small" style="font-size: 12px; height: 28px; line-height: 26px; padding: 0 8px;" title="View Live Page">View</a>
                                        <a href="<?php echo esc_url(admin_url('post.php?post=' . $pid . '&action=edit')); ?>" class="button button-small" style="font-size: 12px; height: 28px; line-height: 26px; padding: 0 8px;" title="Edit in WordPress standard editor">Edit in WP</a>
                                        <a href="<?php echo esc_url(admin_url('post.php?post=' . $pid . '&action=elementor')); ?>" target="_blank" class="button button-small button-primary" style="font-size: 12px; height: 28px; line-height: 26px; padding: 0 8px; background: #e11d48; border-color: #be123c;" title="Edit in Elementor">Elementor</a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>`;

content = content.replace(oldTableBlock, newTableBlock);

// 2. Replace card header
const oldHeader = `<div class="nesports-card-header">
                        <h2><span class="dashicons dashicons-admin-page"></span> Deployed Pages Status</h2>
                        <span class="nesports-pill-live">3 Pages Connected</span>
                    </div>`;

const newHeader = `<?php
                $all_wp_pages_count = function_exists('wp_count_posts') ? (wp_count_posts('page')->publish + wp_count_posts('page')->draft) : 15;
                ?>
                <div class="nesports-card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <h2><span class="dashicons dashicons-admin-page"></span> All Website Pages (WordPress Pages)</h2>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="nesports-pill-live"><?php echo $all_wp_pages_count; ?> Pages Available</span>
                        <a href="<?php echo esc_url(admin_url('post-new.php?post_type=page')); ?>" target="_blank" class="button button-small button-primary" style="background: #e11d48; border-color: #be123c; font-weight: 700; height: 30px; display: inline-flex; align-items: center; gap: 4px;">
                            <span class="dashicons dashicons-plus-alt2" style="font-size: 14px; width: 14px; height: 14px; margin-top: 1px;"></span> + Add Page
                        </a>
                    </div>
                </div>`;

content = content.replace(oldHeader, newHeader);

// 3. Add search input inside the card body before the table
const oldCardBodyStart = `<div class="nesports-card-body">
                        <table class="nesports-table">`;

const newCardBodyStart = `<div class="nesports-card-body" style="padding: 16px 20px;">
                        <!-- Quick Search Filter -->
                        <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                            <span class="dashicons dashicons-search" style="color: #94a3b8;"></span>
                            <input type="text" id="nes-pages-search" onkeyup="nesFilterPagesTable()" placeholder="Quick filter pages by name or slug..." style="width: 100%; height: 36px; border-radius: 6px; padding: 0 12px; border: 1px solid #cbd5e1; font-size: 13.5px;" />
                        </div>
                        <div style="max-height: 540px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <table class="nesports-table" style="margin: 0; width: 100%;">`;

content = content.replace(oldCardBodyStart, newCardBodyStart);

// 4. Close the scroll container and add script before closing card-body
const oldCardBodyEnd = `                        </table>
                    </div>
                </div>`;

const newCardBodyEnd = `                        </table>
                        </div>
                        <script>
                        function nesFilterPagesTable() {
                            var search = (document.getElementById('nes-pages-search').value || '').toLowerCase();
                            var rows = document.querySelectorAll('.nes-page-item-row');
                            rows.forEach(function(r) {
                                var name = (r.getAttribute('data-name') || '').toLowerCase();
                                var slug = (r.getAttribute('data-slug') || '').toLowerCase();
                                if (!search || name.indexOf(search) !== -1 || slug.indexOf(search) !== -1) {
                                    r.style.display = '';
                                } else {
                                    r.style.display = 'none';
                                }
                            });
                        }
                        </script>
                    </div>
                </div>`;

content = content.replace(oldCardBodyEnd, newCardBodyEnd);

// Extract the PHP code inside const adminPhp = ` ... `;
const startIdx = content.indexOf('const adminPhp = `') + 'const adminPhp = `'.length;
const endIdx = content.lastIndexOf('`;');
const phpSource = content.substring(startIdx, endIdx);

const targetFile = path.join(__dirname, '..', 'nesports-pro-store', 'includes', 'class-nesports-admin.php');
fs.writeFileSync(targetFile, phpSource, 'utf8');
console.log("Successfully extracted and wrote pure PHP to class-nesports-admin.php!");
