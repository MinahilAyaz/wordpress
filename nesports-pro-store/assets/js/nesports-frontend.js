/* NESPORTS3 storefront interactions */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    /* ---------- Hero carousel with peeking neighbours ---------- */
    var track = document.getElementById('hb-hero-track');
    var dots = document.querySelectorAll('#hb-hero-dots button');
    var hero = document.getElementById('hb-hero');
    var idx = 0, timer = null;

    function goTo(i) {
        var s = track.children;
        if (!s.length) return;
        idx = (i + s.length) % s.length;
        var w = s[0].getBoundingClientRect().width;
        var gap = parseFloat(getComputedStyle(track).columnGap) || 14;
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
        window.addEventListener('load', function () { goTo(idx); });
        goTo(0); auto();
    }

    /* ---------- Sliders: every [data-slider] section works on its own ---------- */
    document.querySelectorAll('[data-slider]').forEach(function (section) {
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
                pills.forEach(function (p) { p.classList.remove('is-active'); });
                pill.classList.add('is-active');
                var f = pill.dataset.filter;
                var visibleCount = 0;
                Array.prototype.forEach.call(items, function (c) {
                    var match = (f === 'all' || c.dataset.cat === f);
                    c.classList.toggle('is-hidden', !match);
                    if (match) {
                        c.style.animation = 'none';
                        void c.offsetHeight; /* trigger reflow */
                        c.style.animation = 'fadeInLeft 1.1s cubic-bezier(0.22, 1, 0.36, 1) both';
                        c.style.animationDelay = (visibleCount * 0.14) + 's';
                        visibleCount++;
                    }
                });
                wrap.scrollTo({ left: 0, behavior: 'smooth' });
            });
        });

        if (prev) prev.addEventListener('click', function () { wrap.scrollBy({ left: -step() * 2 }); });
        if (next) next.addEventListener('click', function () { wrap.scrollBy({ left: step() * 2 }); });
    });

    /* ---------- Scroll Observer: Trigger Fade-In-Left on ALL Cards (Slightly Slow & Fluid) ---------- */
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
                            c.style.animation = 'fadeInLeft 1.1s cubic-bezier(0.22, 1, 0.36, 1) both';
                            c.style.animationDelay = (count * 0.14) + 's';
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

    /* ---------- Mobile nav ---------- */
    var btn = document.getElementById('hb-mobile-toggle');
    var nav = document.getElementById('hb-primary-nav');
    if (btn && nav) btn.addEventListener('click', function () { nav.classList.toggle('is-open'); });

    /* ---------- Sign In Drawer (Matched to Screenshot 2) ---------- */
    var drawer = document.getElementById('hb-side-drawer');
    var overlay = document.getElementById('hb-drawer-overlay');
    var closeBtn = document.getElementById('hb-drawer-close');
    var textTrigger = document.getElementById('hb-auth-text-trigger');
    var iconTrigger = document.getElementById('hb-auth-icon-trigger');

    function openDrawer() {
        if (drawer && overlay) {
            drawer.classList.add('is-open');
            overlay.classList.add('is-visible');
            document.body.style.overflow = 'hidden';
            var u = document.getElementById('hb-auth-user');
            if (u) setTimeout(function() { u.focus(); }, 150);
        }
    }

    function closeDrawer() {
        if (drawer && overlay) {
            drawer.classList.remove('is-open');
            overlay.classList.remove('is-visible');
            document.body.style.overflow = '';
        }
    }

    if (textTrigger) textTrigger.addEventListener('click', openDrawer);
    if (iconTrigger) iconTrigger.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

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
        var existing = cart.find(function(item) { return item.id === product.id; });
        if (existing) {
            existing.qty += (product.qty || 1);
        } else {
            cart.push({
                id: product.id || product.slug,
                name: product.name,
                price: parseFloat(product.price) || 0,
                img: product.img || '',
                qty: product.qty || 1
            });
        }
        saveCart();
        renderCart();
        openCart();
    };

    // Bind quick add buttons on cards with instant interactive feedback
    document.querySelectorAll('.hb-card-quick-add').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var self = this;
            var originalHTML = self.innerHTML;

            // Visual feedback
            self.classList.add('is-added');
            self.innerHTML = '<i class="fa-solid fa-check"></i> ADDED';

            window.nesportsAddToCart({
                id: self.dataset.id,
                name: self.dataset.name,
                price: parseFloat(self.dataset.price) || 0,
                img: self.dataset.img || '',
                qty: 1
            });

            setTimeout(function() {
                self.classList.remove('is-added');
                self.innerHTML = originalHTML;
            }, 1200);
        });
    });

    // Initial render of cart
    renderCart();
});
