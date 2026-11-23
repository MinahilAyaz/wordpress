/* NESPORTS3 storefront interactions */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    /* ---------- Hero carousel with peeking neighbours ---------- */
    window.initNESportsHero = function(root) {
        root = root || document;
        var heroes = root.querySelectorAll ? root.querySelectorAll('.hb-hero') : [root];
        heroes.forEach(function(hero) {
            if (!hero) return;
            var track = hero.querySelector('.hb-hero-track');
            var dots = hero.querySelectorAll('.hb-hero-dots button');
            var idx = 0, timer = null;

            function goTo(i) {
                var s = track ? track.children : [];
                if (!s.length) return;
                idx = (i + s.length) % s.length;
                var w = s[0].getBoundingClientRect().width;
                var cs = getComputedStyle(track);
                var gap = parseFloat(cs.gap) || parseFloat(cs.columnGap) || 0;
                track.style.transform = 'translateX(' + ((hero.clientWidth - w) / 2 - idx * (w + gap)) + 'px)';
                Array.prototype.forEach.call(s, function (el, n) { el.classList.toggle('is-active', n === idx); });
                dots.forEach(function (d, n) { d.classList.toggle('is-active', n === idx); });
            }
            function auto() { clearInterval(timer); timer = setInterval(function () { goTo(idx + 1); }, 6000); }

            if (track && hero) {
                dots.forEach(function (d) {
                    d.addEventListener('click', function () { goTo(parseInt(d.dataset.slide, 10)); auto(); });
                });
                var startX = null;
                hero.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
                hero.addEventListener('touchend', function (e) {
                    if (startX === null) return;
                    var dx = e.changedTouches[0].clientX - startX;
                    if (Math.abs(dx) > 40) { goTo(idx + (dx < 0 ? 1 : -1)); auto(); }
                    startX = null;
                });
                window.addEventListener('resize', function () { goTo(idx); });
                goTo(0); auto();
            }
        });
    };
    window.initNESportsHero();

    /* ---------- Sliders: every [data-slider] section works on its own ---------- */
    window.initNESportsSliders = function(root) {
        root = root || document;
        var sections = root.querySelectorAll ? root.querySelectorAll('[data-slider]') : [root];
        sections.forEach(function (section) {
            if (!section) return;
            var wrap = section.querySelector('.hb-cards');
            if (!wrap) return;
            var items = wrap.children;
            var pills = section.querySelectorAll('.hb-pill');
            var prev = section.querySelector('.hb-prev');
            var next = section.querySelector('.hb-next');

            function step() {
                var first = null;
                for (var i = 0; i < items.length; i++) { if (!items[i].classList.contains('is-hidden')) { first = items[i]; break; } }
                return first ? first.getBoundingClientRect().width + 16 : 240;
            }

            pills.forEach(function (pill) {
                pill.addEventListener('click', function () {
                    if (pill.classList.contains('is-active')) return;
                    pills.forEach(function (p) { p.classList.remove('is-active'); });
                    pill.classList.add('is-active');

                    // Smoothly bring the active pill into view if needed
                    if (typeof pill.scrollIntoView === 'function') {
                        pill.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
                    }

                    var f = pill.dataset.filter;
                    var visibleCount = 0;
                    Array.prototype.forEach.call(items, function (c) {
                        var match = (f === 'all' || c.dataset.cat === f);
                        c.classList.toggle('is-hidden', !match);
                        if (match) {
                            c.style.animation = 'none';
                            void c.offsetHeight; /* trigger reflow */
                            c.style.animation = 'hbCardReveal 0.45s cubic-bezier(0.16, 1, 0.3, 1) both';
                            c.style.animationDelay = (visibleCount * 0.045) + 's';
                            visibleCount++;
                        }
                    });
                    wrap.scrollTo({ left: 0, behavior: 'smooth' });
                });
            });

            if (prev) prev.addEventListener('click', function () { wrap.scrollBy({ left: -step() * 2 }); });
            if (next) next.addEventListener('click', function () { wrap.scrollBy({ left: step() * 2 }); });
        });
    };
    window.initNESportsSliders();

    /* ---------- Scroll Observer: Trigger Minimal Card Reveal on ALL Cards ---------- */
    if ('IntersectionObserver' in window) {
        var cardSectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var cards = entry.target.querySelectorAll('.hb-card');
                    var count = 0;
                    cards.forEach(function (c) {
                        if (!c.classList.contains('is-hidden')) {
                            c.style.animation = 'none';
                            void c.offsetHeight; /* trigger reflow */
                            c.style.animation = 'hbCardReveal 0.55s cubic-bezier(0.16, 1, 0.3, 1) both';
                            c.style.animationDelay = (count * 0.05) + 's';
                            count++;
                        }
                    });
                }
            });
        }, { threshold: 0.12 });

        ['shop', 'bundles'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) cardSectionObserver.observe(el);
        });
        document.querySelectorAll('.hb-cat-grid-section, .hb-pdp-related-section').forEach(function(el) {
            cardSectionObserver.observe(el);
        });
    }

    /* ---------- Mobile nav & accordion dropdown ---------- */
    var btn = document.getElementById('hb-mobile-toggle');
    var nav = document.getElementById('hb-primary-nav');
    if (btn && nav) {
        btn.addEventListener('click', function () { 
            nav.classList.toggle('is-open'); 
        });
    }

    var dropdownItems = document.querySelectorAll('.hb-has-dropdown');
    dropdownItems.forEach(function (item) {
        var trigger = item.querySelector('a');
        if (trigger) {
            trigger.addEventListener('click', function (e) {
                if (window.innerWidth <= 820) {
                    e.preventDefault();
                    e.stopPropagation();
                    item.classList.toggle('is-open');
                }
            });
        }
    });

    /* ---------- Sign In & Account Drawer (Fully Functional with Real Restrictions) ---------- */
    var drawer = document.getElementById('hb-side-drawer');
    var overlay = document.getElementById('hb-drawer-overlay');
    var closeBtn = document.getElementById('hb-drawer-close');
    var textTrigger = document.getElementById('hb-auth-text-trigger');
    var iconTrigger = document.getElementById('hb-auth-icon-trigger');
    var backBtn = document.getElementById('hb-auth-back-btn');
    var drawerTitle = document.getElementById('hb-drawer-title');
    var authAlert = document.getElementById('hb-auth-alert');

    // Views
    var viewLogin    = document.getElementById('hb-view-login');
    var viewRegister = document.getElementById('hb-view-register');
    var viewForgot   = document.getElementById('hb-view-forgot');
    var viewAccount  = document.getElementById('hb-view-account');
    var viewOrders   = document.getElementById('hb-view-orders');
    var viewAddress  = document.getElementById('hb-view-address');
    var currentView = 'login';

    // 1. Validation Rules
    function isValidEmail(email) {
        if (!email) return false;
        var re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).trim());
    }

    function isValidPassword(pass) {
        if (!pass) return false;
        var p = String(pass);
        // At least 8 characters, must have at least 1 letter and 1 number
        return p.length >= 8 && /[a-zA-Z]/.test(p) && /[0-9]/.test(p);
    }

    // 2. Database of Registered Users in localStorage
    function getRegisteredUsers() {
        try {
            var raw = localStorage.getItem('nesports_registered_users');
            if (raw) return JSON.parse(raw);
        } catch (e) {}

        // Initial default demo user
        var defaultUsers = [
            {
                name: "Alex Miller",
                email: "alex@nesports3.com",
                password: "Password123",
                phone: "+49 30 123456",
                address: {
                    name: "Alex Miller",
                    street: "24 Olympic Way, Suite 4B",
                    city: "Berlin",
                    zip: "10115",
                    country: "Germany",
                    phone: "+49 30 123456"
                },
                orders: [
                    {
                        id: "NES-8492",
                        date: "Nov 04, 2026",
                        status: "Dispatched",
                        tracking: "DHL Express #NE849201",
                        items: [
                            { name: "Classic Weightlifting Belt Leather (M)", price: 59.99, qty: 1, img: "/nesports-pro-store/assets/images/DSC_0166-scaled-1.jpg" }
                        ],
                        total: 59.99
                    }
                ]
            }
        ];
        try {
            localStorage.setItem('nesports_registered_users', JSON.stringify(defaultUsers));
        } catch (e) {}
        return defaultUsers;
    }

    function saveRegisteredUsers(users) {
        try {
            localStorage.setItem('nesports_registered_users', JSON.stringify(users));
        } catch (e) {}
    }

    function getStoredUser() {
        try {
            var raw = localStorage.getItem('nesports_user');
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function setStoredUser(user) {
        try {
            localStorage.setItem('nesports_user', JSON.stringify(user));
        } catch (e) {}
    }

    // 3. Wishlist Storage — removed (Saved Gear feature removed)
    // 4. Alerts
    function showAuthAlert(msg, type) {
        if (!authAlert) return;
        type = type || 'error';
        authAlert.className = 'hb-auth-alert hb-auth-alert--' + type;
        var icon = type === 'success' ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-exclamation"></i>';
        authAlert.innerHTML = icon + ' <span>' + msg + '</span>';
        authAlert.style.display = 'flex';
    }

    function hideAuthAlert() {
        if (authAlert) authAlert.style.display = 'none';
    }

    // 5. Views Switcher
    function switchAuthView(viewName) {
        hideAuthAlert();
        currentView = viewName;

        var allViews = [viewLogin, viewRegister, viewForgot, viewAccount, viewOrders, viewAddress];
        allViews.forEach(function(v) { if (v) v.style.display = 'none'; });

        var user = getStoredUser();

        if (viewName === 'register') {
            if (viewRegister) viewRegister.style.display = 'block';
            if (drawerTitle) drawerTitle.textContent = 'Create account';
            if (backBtn) backBtn.style.display = 'flex';
            var n = document.getElementById('hb-reg-name');
            if (n) setTimeout(function() { n.focus(); }, 120);
        } else if (viewName === 'forgot') {
            if (viewForgot) viewForgot.style.display = 'block';
            if (drawerTitle) drawerTitle.textContent = 'Reset password';
            if (backBtn) backBtn.style.display = 'flex';
            var em = document.getElementById('hb-forgot-email');
            if (em) setTimeout(function() { em.focus(); }, 120);
        } else if (viewName === 'account') {
            if (viewAccount) viewAccount.style.display = 'block';
            if (drawerTitle) drawerTitle.textContent = 'My Account';
            if (backBtn) backBtn.style.display = 'none';
            renderAccountDashboard();
        } else if (viewName === 'orders') {
            if (viewOrders) viewOrders.style.display = 'block';
            if (drawerTitle) drawerTitle.textContent = 'Order History';
            if (backBtn) backBtn.style.display = 'flex';
            renderOrdersList();
        } else if (viewName === 'address') {
            if (viewAddress) viewAddress.style.display = 'block';
            if (drawerTitle) drawerTitle.textContent = 'Saved Address';
            if (backBtn) backBtn.style.display = 'flex';
            renderAddressForm();
        } else {
            // Default: login
            if (viewLogin) viewLogin.style.display = 'block';
            if (drawerTitle) drawerTitle.textContent = 'Sign in';
            if (backBtn) backBtn.style.display = 'none';
            var u = document.getElementById('hb-auth-user');
            if (u) setTimeout(function() { u.focus(); }, 120);
        }
    }

    // 6. Sub-view Renderers
    function renderAccountDashboard() {
        var user = getStoredUser();
        if (!user) {
            switchAuthView('login');
            return;
        }

        var nameEl = document.getElementById('hb-acc-name');
        var emailEl = document.getElementById('hb-acc-email');
        var avatarEl = document.getElementById('hb-acc-avatar-letter');
        var ordersCountEl = document.getElementById('hb-acc-orders-count');
        var addressStatusEl = document.getElementById('hb-acc-address-status');

        if (nameEl) nameEl.textContent = user.name || 'Athlete Member';
        if (emailEl) emailEl.textContent = user.email || 'user@nesports3.com';
        if (avatarEl) avatarEl.textContent = (user.name ? user.name.charAt(0).toUpperCase() : 'A');

        var orders = user.orders || [];
        if (ordersCountEl) ordersCountEl.textContent = orders.length + (orders.length === 1 ? ' Order' : ' Orders');

        if (addressStatusEl) {
            addressStatusEl.textContent = (user.address && user.address.street) ? 'Default Saved' : 'Not Set';
        }
    }

    function renderOrdersList() {
        var wrap = document.getElementById('hb-orders-list-wrap');
        if (!wrap) return;

        var user = getStoredUser();
        var orders = (user && user.orders) ? user.orders : [];

        if (orders.length === 0) {
            wrap.innerHTML = ''
                + '<div class="hb-empty-subview">'
                + '  <i class="fa-solid fa-box-open"></i>'
                + '  <h4>No orders placed yet</h4>'
                + '  <p>When you checkout with competition gear, tracking details and delivery receipts will appear here.</p>'
                + '  <a href="/shop/" class="hb-empty-subview-btn">EXPLORE SHOP</a>'
                + '</div>';
            return;
        }

        var html = '';
        orders.forEach(function(ord) {
            html += '<div class="hb-order-card">';
            html += '  <div class="hb-order-header">';
            html += '    <div>';
            html += '      <span class="hb-order-num">Order #' + ord.id + '</span>';
            html += '      <span class="hb-order-date">' + ord.date + '</span>';
            html += '    </div>';
            html += '    <span class="hb-order-badge hb-order-badge--shipped">' + ord.status + '</span>';
            html += '  </div>';

            ord.items.forEach(function(it) {
                html += '  <div class="hb-order-item-row">';
                html += '    <img src="' + it.img + '" alt="" class="hb-order-item-img">';
                html += '    <div class="hb-order-item-info">';
                html += '      <div class="hb-order-item-title">' + it.name + '</div>';
                html += '      <div class="hb-order-item-meta">Qty: ' + it.qty + ' &bull; €' + parseFloat(it.price).toFixed(2) + '</div>';
                html += '    </div>';
                html += '  </div>';
            });

            html += '  <div class="hb-order-footer">';
            html += '    <span class="hb-order-total">Total: €' + parseFloat(ord.total).toFixed(2) + '</span>';
            html += '    <span class="hb-order-track-tag"><i class="fa-solid fa-truck-fast"></i> ' + (ord.tracking || 'Tracked Delivery') + '</span>';
            html += '  </div>';
            html += '</div>';
        });

        wrap.innerHTML = html;
    }

    function renderAddressForm() {
        var user = getStoredUser();
        var addr = (user && user.address) ? user.address : {};

        var nameInput = document.getElementById('hb-addr-name');
        var streetInput = document.getElementById('hb-addr-street');
        var cityInput = document.getElementById('hb-addr-city');
        var zipInput = document.getElementById('hb-addr-zip');
        var countryInput = document.getElementById('hb-addr-country');
        var phoneInput = document.getElementById('hb-addr-phone');

        if (nameInput) nameInput.value = addr.name || user.name || '';
        if (streetInput) streetInput.value = addr.street || '';
        if (cityInput) cityInput.value = addr.city || '';
        if (zipInput) zipInput.value = addr.zip || '';
        if (countryInput && addr.country) countryInput.value = addr.country;
        if (phoneInput) phoneInput.value = addr.phone || user.phone || '';
    }


    // 7. Global Header Sync
    function syncAuthUI() {
        var user = getStoredUser();
        if (user) {
            if (textTrigger) textTrigger.textContent = (user.name ? user.name.toUpperCase().split(' ')[0] : 'MY ACCOUNT');
            renderAccountDashboard();
        } else {
            if (textTrigger) textTrigger.textContent = 'LOGIN / REGISTER';
        }
    }

    function openDrawer() {
        if (drawer && overlay) {
            drawer.classList.add('is-open');
            overlay.classList.add('is-visible');
            document.body.style.overflow = 'hidden';

            var user = getStoredUser();
            if (user) {
                switchAuthView('account');
            } else {
                switchAuthView('login');
            }
        }
    }

    function closeDrawer() {
        if (drawer && overlay) {
            drawer.classList.remove('is-open');
            overlay.classList.remove('is-visible');
            document.body.style.overflow = '';
            hideAuthAlert();
        }
    }

    if (textTrigger) textTrigger.addEventListener('click', openDrawer);
    if (iconTrigger) iconTrigger.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    // Back button routing
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            if (currentView === 'orders' || currentView === 'address') {
                switchAuthView('account');
            } else {
                switchAuthView('login');
            }
        });
    }

    // Sub-view button listeners
    var btnOpenOrders = document.getElementById('hb-btn-open-orders');
    if (btnOpenOrders) btnOpenOrders.addEventListener('click', function() { switchAuthView('orders'); });

    var btnOpenAddress = document.getElementById('hb-btn-open-address');
    if (btnOpenAddress) btnOpenAddress.addEventListener('click', function() { switchAuthView('address'); });

    // Switch buttons
    var gotoRegister = document.getElementById('hb-goto-register');
    if (gotoRegister) gotoRegister.addEventListener('click', function() { switchAuthView('register'); });

    var switchToLogin = document.getElementById('hb-switch-to-login');
    if (switchToLogin) switchToLogin.addEventListener('click', function(e) { e.preventDefault(); switchAuthView('login'); });

    var gotoForgot = document.getElementById('hb-goto-forgot');
    if (gotoForgot) gotoForgot.addEventListener('click', function(e) { e.preventDefault(); switchAuthView('forgot'); });

    var forgotToLogin = document.getElementById('hb-forgot-to-login');
    if (forgotToLogin) forgotToLogin.addEventListener('click', function(e) { e.preventDefault(); switchAuthView('login'); });

    // Password visibility toggles
    var togglePassBtn = document.getElementById('hb-toggle-pass-visibility');
    var passInput = document.getElementById('hb-auth-pass');
    var eyeIcon = document.getElementById('hb-eye-icon');
    if (togglePassBtn && passInput && eyeIcon) {
        togglePassBtn.addEventListener('click', function() {
            var isPass = passInput.type === 'password';
            passInput.type = isPass ? 'text' : 'password';
            eyeIcon.className = isPass ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
        });
    }

    var toggleRegPassBtn = document.getElementById('hb-toggle-reg-pass');
    var regPassInput = document.getElementById('hb-reg-pass');
    var regEyeIcon = document.getElementById('hb-reg-eye-icon');
    if (toggleRegPassBtn && regPassInput && regEyeIcon) {
        toggleRegPassBtn.addEventListener('click', function() {
            var isPass = regPassInput.type === 'password';
            regPassInput.type = isPass ? 'text' : 'password';
            regEyeIcon.className = isPass ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
        });
    }

    // 8. LOGIN FORM SUBMIT (Strict Restrictions & Validation)
    var loginForm = document.getElementById('hb-login-form');
    var loginBtn = document.getElementById('hb-login-submit-btn');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var userInput = document.getElementById('hb-auth-user');
            var passInput = document.getElementById('hb-auth-pass');

            var userVal = userInput ? userInput.value.trim() : '';
            var passVal = passInput ? passInput.value.trim() : '';

            // Rule 1: Email Restriction
            if (!isValidEmail(userVal)) {
                showAuthAlert('Please enter a valid email address (e.g. name@example.com).', 'error');
                if (userInput) userInput.focus();
                return;
            }

            // Rule 2: Password Restriction
            if (!isValidPassword(passVal)) {
                showAuthAlert('Password must be at least 8 characters long and contain both letters and numbers.', 'error');
                if (passInput) passInput.focus();
                return;
            }

            // Rule 3: Check against registered accounts database
            var users = getRegisteredUsers();
            var matchedUser = null;
            for (var i = 0; i < users.length; i++) {
                if (users[i].email.toLowerCase() === userVal.toLowerCase()) {
                    matchedUser = users[i];
                    break;
                }
            }

            if (!matchedUser) {
                showAuthAlert('No account found with this email. Please check your spelling or click "CREATE AN ACCOUNT" below.', 'error');
                return;
            }

            if (matchedUser.password !== passVal) {
                showAuthAlert('Incorrect password. Please verify your credentials or click "Lost your password?".', 'error');
                return;
            }

            // Successful Login
            if (loginBtn) {
                loginBtn.disabled = true;
                loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> LOGGING IN...';
            }

            setTimeout(function() {
                setStoredUser(matchedUser);
                syncAuthUI();

                if (loginBtn) {
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'LOG IN';
                }

                showAuthAlert('Welcome back, ' + matchedUser.name + '!', 'success');

                setTimeout(function() {
                    switchAuthView('account');
                }, 500);
            }, 400);
        });
    }

    // 9. REGISTER FORM SUBMIT (Strict Restrictions & Validation)
    var registerForm = document.getElementById('hb-register-form');
    var registerBtn = document.getElementById('hb-reg-submit-btn');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var nameInput = document.getElementById('hb-reg-name');
            var emailInput = document.getElementById('hb-reg-email');
            var passInput = document.getElementById('hb-reg-pass');

            var nameVal = nameInput ? nameInput.value.trim() : '';
            var emailVal = emailInput ? emailInput.value.trim() : '';
            var passVal = passInput ? passInput.value.trim() : '';

            // Rule 1: Full Name Check
            if (nameVal.length < 2) {
                showAuthAlert('Please enter your full name (at least 2 characters).', 'error');
                if (nameInput) nameInput.focus();
                return;
            }

            // Rule 2: Strict Email Validation
            if (!isValidEmail(emailVal)) {
                showAuthAlert('Please enter a valid email address (e.g. name@example.com).', 'error');
                if (emailInput) emailInput.focus();
                return;
            }

            // Rule 3: Existing Email Check
            var users = getRegisteredUsers();
            for (var i = 0; i < users.length; i++) {
                if (users[i].email.toLowerCase() === emailVal.toLowerCase()) {
                    showAuthAlert('An account with this email already exists. Please sign in.', 'error');
                    return;
                }
            }

            // Rule 4: Strict Password Strength Validation
            if (!isValidPassword(passVal)) {
                showAuthAlert('Password must be at least 8 characters long and contain both letters and numbers.', 'error');
                if (passInput) passInput.focus();
                return;
            }

            if (registerBtn) {
                registerBtn.disabled = true;
                registerBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> CREATING ACCOUNT...';
            }

            setTimeout(function() {
                var newUser = {
                    name: nameVal,
                    email: emailVal,
                    password: passVal,
                    phone: '',
                    address: {
                        name: nameVal,
                        street: '',
                        city: '',
                        zip: '',
                        country: 'Germany',
                        phone: ''
                    },
                    orders: []
                };

                users.push(newUser);
                saveRegisteredUsers(users);
                setStoredUser(newUser);
                syncAuthUI();

                if (registerBtn) {
                    registerBtn.disabled = false;
                    registerBtn.textContent = 'CREATE ACCOUNT';
                }

                showAuthAlert('Account created successfully! Welcome to NESPORTS3.', 'success');

                setTimeout(function() {
                    switchAuthView('account');
                }, 500);
            }, 500);
        });
    }

    // 10. SAVED ADDRESS FORM SUBMIT
    var addressForm = document.getElementById('hb-address-form');
    var addressBtn = document.getElementById('hb-save-address-btn');
    if (addressForm) {
        addressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var user = getStoredUser();
            if (!user) return;

            var nameVal = document.getElementById('hb-addr-name').value.trim();
            var streetVal = document.getElementById('hb-addr-street').value.trim();
            var cityVal = document.getElementById('hb-addr-city').value.trim();
            var zipVal = document.getElementById('hb-addr-zip').value.trim();
            var countryVal = document.getElementById('hb-addr-country').value;
            var phoneVal = document.getElementById('hb-addr-phone').value.trim();

            if (!nameVal || !streetVal || !cityVal || !zipVal || !phoneVal) {
                showAuthAlert('Please complete all address fields.', 'error');
                return;
            }

            if (addressBtn) {
                addressBtn.disabled = true;
                addressBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SAVING...';
            }

            setTimeout(function() {
                user.address = {
                    name: nameVal,
                    street: streetVal,
                    city: cityVal,
                    zip: zipVal,
                    country: countryVal,
                    phone: phoneVal
                };
                user.phone = phoneVal;

                setStoredUser(user);

                // Also update in registered users database
                var users = getRegisteredUsers();
                for (var i = 0; i < users.length; i++) {
                    if (users[i].email.toLowerCase() === user.email.toLowerCase()) {
                        users[i].address = user.address;
                        users[i].phone = user.phone;
                        break;
                    }
                }
                saveRegisteredUsers(users);

                if (addressBtn) {
                    addressBtn.disabled = false;
                    addressBtn.textContent = 'SAVE ADDRESS';
                }

                showAuthAlert('Default shipping address updated successfully!', 'success');
                renderAccountDashboard();
            }, 400);
        });
    }

    // 11. FORGOT PASSWORD FORM SUBMIT
    var forgotForm = document.getElementById('hb-forgot-form');
    var forgotBtn = document.getElementById('hb-forgot-submit-btn');
    if (forgotForm) {
        forgotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var emailInput = document.getElementById('hb-forgot-email');
            var emailVal = emailInput ? emailInput.value.trim() : '';

            if (!isValidEmail(emailVal)) {
                showAuthAlert('Please enter a valid email address.', 'error');
                return;
            }

            if (forgotBtn) {
                forgotBtn.disabled = true;
                forgotBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SENDING LINK...';
            }

            setTimeout(function() {
                if (forgotBtn) {
                    forgotBtn.disabled = false;
                    forgotBtn.textContent = 'RESET PASSWORD';
                }
                showAuthAlert('A secure password reset link has been dispatched to ' + emailVal + '.', 'success');
                if (emailInput) emailInput.value = '';
            }, 450);
        });
    }

    // 12. LOGOUT BUTTON
    var logoutBtn = document.getElementById('hb-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('nesports_user');
            syncAuthUI();
            switchAuthView('login');
            showAuthAlert('You have been logged out successfully.', 'success');
        });
    }

    // Initialize Auth UI state on load
    syncAuthUI();

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
            closeDrawer();
        }
    });

    // Initialize Auth UI state on load
    syncAuthUI();

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
            closeDrawer();
        }
    });

    /* ---------- Search Slide-Out Drawer (Matched to Screenshot) ---------- */
    var searchDrawer = document.getElementById('hb-search-drawer');
    var searchOverlay = document.getElementById('hb-search-overlay');
    var searchTrigger = document.getElementById('hb-search-trigger');
    var searchClose = document.getElementById('hb-search-close');
    var searchInput = document.getElementById('hb-search-input');
    var searchClear = document.getElementById('hb-search-clear-btn');
    var searchSuggest = document.getElementById('hb-search-suggestions');
    var searchResults = document.getElementById('hb-search-results-list');

    function openSearch() {
        if (searchDrawer && searchOverlay) {
            searchDrawer.classList.add('is-open');
            searchOverlay.classList.add('is-visible');
            document.body.style.overflow = 'hidden';
            if (searchInput) {
                setTimeout(function() { searchInput.focus(); }, 150);
            }
        }
    }

    function closeSearch() {
        if (searchDrawer && searchOverlay) {
            searchDrawer.classList.remove('is-open');
            searchOverlay.classList.remove('is-visible');
            document.body.style.overflow = '';
        }
    }

    if (searchTrigger) searchTrigger.addEventListener('click', openSearch);
    if (searchClose) searchClose.addEventListener('click', closeSearch);
    if (searchOverlay) searchOverlay.addEventListener('click', closeSearch);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchDrawer && searchDrawer.classList.contains('is-open')) {
            closeSearch();
        }
    });

    function performSearch(query) {
        var q = (query || '').trim().toLowerCase();
        if (!q) {
            if (searchSuggest) searchSuggest.style.display = 'block';
            if (searchClear) searchClear.style.display = 'none';
            if (searchResults) searchResults.innerHTML = '';
            return;
        }

        if (searchSuggest) searchSuggest.style.display = 'none';
        if (searchClear) searchClear.style.display = 'block';

        var catalog = window.nesportsCatalog || [];
        var matches = catalog.filter(function(item) {
            return item.name.toLowerCase().indexOf(q) !== -1 || (item.cat || '').toLowerCase().indexOf(q) !== -1;
        });

        if (!searchResults) return;

        if (!matches.length) {
            searchResults.innerHTML = '<div class="hb-search-no-results">No products found matching "' + q.replace(/</g, '&lt;') + '".</div>';
            return;
        }

        var html = '';
        matches.forEach(function(item) {
            html += '<a href="' + item.url + '" class="hb-search-item">';
            html += '  <img src="' + item.img + '" alt="" class="hb-search-thumb">';
            html += '  <div class="hb-search-item-info">';
            html += '    <h4 class="hb-search-item-title">' + item.name + '</h4>';
            html += '    <div class="hb-search-item-price">';
            html += '      <span class="hb-search-price-now">' + item.price + '</span>';
            if (item.old) {
                html += '    <span class="hb-search-price-old">' + item.old + '</span>';
            }
            html += '    </div>';
            html += '  </div>';
            html += '  <i class="fa-solid fa-chevron-right hb-search-arrow"></i>';
            html += '</a>';
        });
        searchResults.innerHTML = html;
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            performSearch(this.value);
        });
    }

    if (searchClear) {
        searchClear.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
                performSearch('');
            }
        });
    }

    // Suggestion chips
    document.querySelectorAll('.hb-suggest-chip').forEach(function(chip) {
        chip.addEventListener('click', function() {
            var term = this.dataset.query || this.textContent;
            if (searchInput) {
                searchInput.value = term;
                searchInput.focus();
                performSearch(term);
            }
        });
    });

    /* ---------- Slide-Out Cart Drawer (Matched to Screenshot: Cart • 0) ---------- */
    var cartDrawer = document.getElementById('hb-cart-drawer');
    var cartOverlay = document.getElementById('hb-cart-overlay');
    var cartTrigger = document.getElementById('hb-cart-trigger');
    var cartClose = document.getElementById('hb-cart-close');
    var cartCounter = document.getElementById('hb-cart-counter');
    var cartBadge = document.getElementById('hb-cart-badge');
    var cartTotalText = document.getElementById('hb-cart-total-text');
    var cartEmpty = document.getElementById('hb-cart-empty');
    var cartItems = document.getElementById('hb-cart-items');
    var cartFooter = document.getElementById('hb-cart-footer');
    var cartSubtotalVal = document.getElementById('hb-cart-subtotal-val');

    // Cart State
    var cart = [];
    try {
        var saved = localStorage.getItem('nesports_cart');
        if (saved) cart = JSON.parse(saved);
    } catch (e) {
        cart = [];
    }

    function saveCart() {
        try {
            localStorage.setItem('nesports_cart', JSON.stringify(cart));
        } catch (e) {}
    }

    function formatMoney(num) {
        return '€' + Number(num).toFixed(2);
    }

    function renderCart() {
        var totalQty = 0;
        var subtotal = 0;

        cart.forEach(function(item) {
            totalQty += item.qty;
            subtotal += item.price * item.qty;
        });

        if (cartCounter) cartCounter.textContent = totalQty;
        if (cartBadge) cartBadge.textContent = totalQty;
        if (cartTotalText) cartTotalText.textContent = formatMoney(subtotal);
        if (cartSubtotalVal) cartSubtotalVal.textContent = formatMoney(subtotal);

        if (totalQty === 0) {
            if (cartEmpty) cartEmpty.style.display = 'flex';
            if (cartItems) { cartItems.style.display = 'none'; cartItems.innerHTML = ''; }
            if (cartFooter) cartFooter.style.display = 'none';
        } else {
            if (cartEmpty) cartEmpty.style.display = 'none';
            if (cartItems) {
                cartItems.style.display = 'flex';
                var html = '';
                cart.forEach(function(item, index) {
                    html += '<div class="hb-cart-row" data-index="' + index + '">';
                    html += '  <img src="' + item.img + '" alt="" class="hb-cart-thumb">';
                    html += '  <div class="hb-cart-row-details">';
                    html += '    <h4 class="hb-cart-row-title">' + item.name + '</h4>';
                    html += '    <div class="hb-cart-row-price">' + formatMoney(item.price) + '</div>';
                    html += '    <div class="hb-cart-qty-ctrl">';
                    html += '      <button type="button" class="hb-cart-qty-btn hb-cart-minus" data-index="' + index + '">-</button>';
                    html += '      <span class="hb-cart-qty-val">' + item.qty + '</span>';
                    html += '      <button type="button" class="hb-cart-qty-btn hb-cart-plus" data-index="' + index + '">+</button>';
                    html += '    </div>';
                    html += '  </div>';
                    html += '  <button type="button" class="hb-cart-remove-btn" data-index="' + index + '" aria-label="Remove item"><i class="fa-regular fa-trash-can"></i></button>';
                    html += '</div>';
                });
                cartItems.innerHTML = html;

                // Bind quantity and remove events
                cartItems.querySelectorAll('.hb-cart-minus').forEach(function(b) {
                    b.addEventListener('click', function() {
                        var i = parseInt(this.dataset.index, 10);
                        if (cart[i].qty > 1) {
                            cart[i].qty -= 1;
                        } else {
                            cart.splice(i, 1);
                        }
                        saveCart();
                        renderCart();
                    });
                });

                cartItems.querySelectorAll('.hb-cart-plus').forEach(function(b) {
                    b.addEventListener('click', function() {
                        var i = parseInt(this.dataset.index, 10);
                        cart[i].qty += 1;
                        saveCart();
                        renderCart();
                    });
                });

                cartItems.querySelectorAll('.hb-cart-remove-btn').forEach(function(b) {
                    b.addEventListener('click', function() {
                        var i = parseInt(this.dataset.index, 10);
                        cart.splice(i, 1);
                        saveCart();
                        renderCart();
                    });
                });
            }
            if (cartFooter) cartFooter.style.display = 'flex';
        }
    }

    function openCart() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.add('is-open');
            cartOverlay.classList.add('is-visible');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeCart() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.remove('is-open');
            cartOverlay.classList.remove('is-visible');
            document.body.style.overflow = '';
        }
    }

    if (cartTrigger) cartTrigger.addEventListener('click', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartDrawer && cartDrawer.classList.contains('is-open')) {
            closeCart();
        }
    });

    // Expose addToCart globally for products
    window.nesportsAddToCart = function(product) {
        if (!product) return;
        var id = product.id || product.slug;
        var existing = cart.find(function(item) { return item.id === id; });
        var addQty = parseInt(product.qty, 10) || 1;
        if (existing) {
            existing.qty += addQty;
        } else {
            cart.push({
                id: id,
                name: product.name,
                price: parseFloat(product.price) || 0,
                img: product.img || '',
                qty: addQty
            });
        }
        saveCart();
        renderCart();
    };

    window.hbAddToCart = function(id, name, price, img, qty) {
        if (typeof id === 'object' && id !== null) {
            window.nesportsAddToCart(id);
        } else {
            window.nesportsAddToCart({
                id: id,
                name: name,
                price: parseFloat(price) || 0,
                img: img || '',
                qty: parseInt(qty, 10) || 1
            });
        }
    };

    // Checkout Button Action with Login Restriction & Order Creation
    // Checkout Button Action - Direct Payment Method (No Login)
    var cartCheckoutBtn = document.getElementById('hb-cart-checkout-btn');
    if (cartCheckoutBtn) {
        cartCheckoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/checkout/';
        });
    }

    document.querySelectorAll('.hb-card-quick-add').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var self = this;
            self.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> PROCEEDING...';

            window.nesportsAddToCart({
                id: self.dataset.id,
                name: self.dataset.name,
                price: parseFloat(self.dataset.price) || 0,
                img: self.dataset.img || '',
                qty: 1
            });

            window.location.href = '/checkout/';
        });
    });

    // Sticky Transparent / Frosted Header on Scroll
    var header = document.getElementById('hb-main-header');
    if (header) {
        var heroEl = document.getElementById('hb-hero');
        var handleScroll = function () {
            var scrollY = window.scrollY || window.pageYOffset || 0;
            if (scrollY > 39) {
                header.classList.add('is-sticky');
            } else {
                header.classList.remove('is-sticky');
            }
            var scrollThreshold = heroEl ? Math.max(heroEl.offsetHeight - 90, 420) : 39;
            if (scrollY > scrollThreshold) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    /* ---------- Top Sellers Carousel Slider (Hardbody Scandinavian) ---------- */
    function initTopSellersSliders(container) {
        var root = container || document;
        root.querySelectorAll('.hb-collections-section').forEach(function(sec) {
            var track = sec.querySelector('.hb-category-track');
            var prevBtn = sec.querySelector('.hb-carousel-prev');
            var nextBtn = sec.querySelector('.hb-carousel-next');
            if (!track || !prevBtn || !nextBtn) return;

            function getScrollStep() {
                var card = track.querySelector('.hb-category-card');
                if (card) {
                    var gap = 20;
                    return (card.offsetWidth + gap) * 2;
                }
                return 320;
            }

            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
            });

            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
            });
        });
    }
    initTopSellersSliders();

    // Initial render of cart
    renderCart();

    /* ---------- Elementor Frontend Live Preview Hooks ---------- */
    if (typeof jQuery !== 'undefined') {
        jQuery(window).on('elementor/frontend/init', function () {
            if (window.elementorFrontend && window.elementorFrontend.hooks) {
                elementorFrontend.hooks.addAction('frontend/element_ready/nesports_hero_widget.default', function ($scope) {
                    if (window.initNESportsHero) window.initNESportsHero($scope[0]);
                });
                elementorFrontend.hooks.addAction('frontend/element_ready/nesports_categories_widget.default', function ($scope) {
                    initTopSellersSliders($scope[0]);
                });
                elementorFrontend.hooks.addAction('frontend/element_ready/nesports_bundles_widget.default', function ($scope) {
                    if (window.initNESportsSliders) window.initNESportsSliders($scope[0]);
                });
                elementorFrontend.hooks.addAction('frontend/element_ready/nesports_products_widget.default', function ($scope) {
                    if (window.initNESportsSliders) window.initNESportsSliders($scope[0]);
                });
            }
        });
    }
});

    // Transparent Fixed Header on Scroll (V32)
    var header = document.getElementById('hb-main-header');
    if (header) {
        var handleScroll = function () {
            var scrollY = window.scrollY || window.pageYOffset || 0;
            if (scrollY > 36) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }
