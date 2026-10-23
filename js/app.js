const GOOGLE_SVG = '<svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>';
        const FB_SVG = '<svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';

        function buildReviewCard(r) {
            const stars = '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars);
            const icon = r.platform === 'google' ? GOOGLE_SVG : FB_SVG;
            return `<div class="review-card">
                <div class="text-[#D4AF37] text-sm">${stars}</div>
                <p class="text-sm text-[#4a4540] dark:text-[#c0bbb4] leading-relaxed">"${r.text}"</p>
                <div class="flex items-center justify-between mt-1">
                    <span class="text-xs font-semibold text-[#2a2a2a] dark:text-white">${r.name}</span>
                    ${icon}
                </div>
            </div>`;
        }

        function buildReviews(lang) {
            const data = translations[lang] || translations['TH'];
            const row1 = (data.reviews_row1) || translations['TH'].reviews_row1;
            const row2 = (data.reviews_row2) || translations['TH'].reviews_row2;

            function setTrack(el, cards) {
                if (!el) return;
                const html = cards.map(buildReviewCard).join('');
                el.innerHTML = html + html;
                // reset animation so new content shows immediately
                el.style.animation = 'none';
                void el.offsetWidth;
                el.style.animation = '';
            }

            setTrack(document.getElementById('marquee-row1'), row1);
            setTrack(document.getElementById('marquee-row2'), row2);
        }

        function updateLanguage(lang) {
        const langMap = {'TH':'th','EN':'en','ZH':'zh','DE':'de','RU':'ru','FR':'fr','JP':'ja','MM':'my','KH':'km','VN':'vi','MS':'ms'};
        document.documentElement.lang = langMap[lang] || lang.toLowerCase();
            const data = translations[lang] || translations['TH'];
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (key in data) el.innerText = data[key];
            });
            const langSpan = document.getElementById('lang-btn').querySelector('span');
            if (langSpan) langSpan.innerText = lang;
            localStorage.setItem('selectedLanguage', lang);
            buildReviews(lang);
            if (typeof redrawDiscountCoating === 'function') redrawDiscountCoating();
        }

        function toggleMobileNav(event) {
            event.stopPropagation();
            document.getElementById('lang-menu').classList.add('hidden');
            document.getElementById('order-menu').classList.add('hidden');
            document.getElementById('mobile-nav-menu').classList.toggle('hidden');
        }

        function toggleLangMenu(event) {
            event.stopPropagation();
            document.getElementById('mobile-nav-menu').classList.add('hidden');
            document.getElementById('order-menu').classList.add('hidden');
            document.getElementById('lang-menu').classList.toggle('hidden');
        }

        function toggleOrderMenu(event) {
            event.stopPropagation();
            document.getElementById('mobile-nav-menu').classList.add('hidden');
            document.getElementById('lang-menu').classList.add('hidden');
            document.getElementById('order-menu').classList.toggle('hidden');
        }

        function closeAllMenus() {
            document.getElementById('mobile-nav-menu').classList.add('hidden');
            document.getElementById('lang-menu').classList.add('hidden');
            document.getElementById('order-menu').classList.add('hidden');
        }

        function selectLang(code) {
            updateLanguage(code);
            closeAllMenus();
        }

        function toggleDarkMode() {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }

        function initPage() {
            const savedLang = localStorage.getItem('selectedLanguage') || 'EN';
            updateLanguage(savedLang);

            // ===== Scroll reveal observer =====
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
            }, { threshold: 0, rootMargin: '0px 0px -80px 0px' });
            document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

            initDiscountPopup();
        }

        // ===== DISCOUNT POPUP =====
        function pad2(n) { return String(n).padStart(2, '0'); }

        function getDiscountCode() {
            const d = new Date();
            return 'LHAO' + pad2(d.getMonth() + 1) + pad2(d.getDate());
        }

        function getTodayKey() {
            const d = new Date();
            return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
        }

        let discountExpandScrollY = 0;
        let redrawDiscountCoating = null;

        function expandDiscountPopup() {
            const popup = document.getElementById('discount-popup');
            const mini = document.getElementById('discount-mini');
            if (!popup || !mini) return;
            popup.classList.remove('scale-0', 'opacity-0', 'pointer-events-none');
            mini.classList.add('scale-0', 'opacity-0', 'pointer-events-none');
            localStorage.setItem('discountPopupShown', getTodayKey());
            discountExpandScrollY = window.scrollY;
        }

        function collapseDiscountPopup() {
            const popup = document.getElementById('discount-popup');
            const mini = document.getElementById('discount-mini');
            if (!popup || !mini) return;
            popup.classList.add('scale-0', 'opacity-0', 'pointer-events-none');
            mini.classList.remove('scale-0', 'opacity-0', 'pointer-events-none');
        }

        function setupDiscountScratchCard() {
            const canvas = document.getElementById('discount-scratch-canvas');
            const codeEl = document.getElementById('discount-code');
            const hint = document.getElementById('discount-scratch-hint');
            if (!canvas || !codeEl) return;

            codeEl.textContent = getDiscountCode();

            const ctx = canvas.getContext('2d');
            // offsetWidth/Height reflect layout size and are unaffected by the
            // popup's collapsed scale(0) transform, unlike getBoundingClientRect().
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            function drawCoating() {
                ctx.globalCompositeOperation = 'source-over';
                const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
                grad.addColorStop(0, '#D4AF37');
                grad.addColorStop(1, '#C41E3A');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 12px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const lang = localStorage.getItem('selectedLanguage') || 'EN';
                const data = translations[lang] || translations['EN'];
                ctx.fillText(data.discount_popup_scratch_here || 'Scratch Here', canvas.width / 2, canvas.height / 2);
            }
            drawCoating();
            redrawDiscountCoating = drawCoating;

            function posFromEvent(e) {
                const r = canvas.getBoundingClientRect();
                return { x: e.clientX - r.left, y: e.clientY - r.top };
            }

            function scratchAt(x, y) {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(x, y, 14, 0, Math.PI * 2);
                ctx.fill();
            }

            let scratching = false;

            canvas.addEventListener('pointerdown', (e) => {
                scratching = true;
                if (hint) hint.style.display = 'none';
                const p = posFromEvent(e);
                scratchAt(p.x, p.y);
            });
            canvas.addEventListener('pointermove', (e) => {
                if (!scratching) return;
                const p = posFromEvent(e);
                scratchAt(p.x, p.y);
            });
            window.addEventListener('pointerup', () => { scratching = false; });
        }

        function initDiscountPopup() {
            setupDiscountScratchCard();
            if (localStorage.getItem('discountPopupShown') !== getTodayKey()) {
                setTimeout(expandDiscountPopup, 4000);
            }
            window.addEventListener('scroll', () => {
                const popup = document.getElementById('discount-popup');
                if (!popup || popup.classList.contains('scale-0')) return;
                if (Math.abs(window.scrollY - discountExpandScrollY) > 40) collapseDiscountPopup();
            }, { passive: true });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initPage);
        } else {
            initPage();
        }

        window.addEventListener('click', (e) => {
            if (!e.target.closest('#nav-dropdown-wrapper, #lang-dropdown-wrapper, #order-dropdown-wrapper')) closeAllMenus();
        });

        // ===== DRAGGABLE NAV =====
        (function() {
            const nav    = document.getElementById('nav-container');
            const island = document.getElementById('dynamic-island');
            let dragging    = false;
            let collapsed   = false;
            let naturalW    = 0;
            let naturalH    = 0;
            let naturalNavW = 0; // nav container width (px) — ล็อคไม่ให้เปลี่ยน
            let startX, startY, origCX, origTop;
            let idleTimer   = null;
            let hasDragged  = false;
            let isAtEdge    = false;

            const PAD        = 20;
            const PAD_B      = 48;
            const EDGE_DIST  = 72;
            const EDGE_PEEK  = 32;

            function captureNavSize() {
                if (!naturalNavW) naturalNavW = nav.getBoundingClientRect().width;
            }

            function clampPos(cx, top) {
                // ใช้ height ของ island เป็น reference → ลากได้อิสระทั้งบน mobile/desktop
                const refH = naturalH || island.offsetHeight || 44;
                return {
                    cx:  Math.max(refH / 2 + PAD,  Math.min(window.innerWidth  - refH / 2 - PAD,  cx)),
                    top: Math.max(PAD,               Math.min(window.innerHeight - refH - PAD_B, top))
                };
            }

            function applyPos(cx, top) {
                nav.style.left      = cx + 'px';
                nav.style.top       = top + 'px';
                nav.style.transform = 'translateX(-50%)';
            }

            function getCX() {
                const r = nav.getBoundingClientRect();
                return r.left + r.width / 2;
            }

            // ยุบเป็นวงกลม
            function collapseIsland() {
                if (collapsed) return;
                naturalW = island.offsetWidth;
                naturalH = island.offsetHeight;
                // ล็อค width เป็น px ก่อน แล้วค่อย shrink (ต้องผ่าน 2 frame)
                island.style.width  = naturalW + 'px';
                island.style.height = naturalH + 'px';
                island.offsetWidth; // force reflow
                island.style.transition = 'width 0.28s cubic-bezier(0.4,0,0.2,1), height 0.28s cubic-bezier(0.4,0,0.2,1), border-radius 0.28s ease, padding 0.2s ease';
                island.classList.add('drag-collapsed');
                island.style.width  = naturalH + 'px'; // สี่เหลี่ยมจัตุรัส → border-radius 50% = วงกลม
                collapsed = true;
            }

            // ขยายกลับปกติ
            function expandIsland() {
                if (!collapsed) return;
                island.style.transition = 'width 0.45s cubic-bezier(0.34,1.56,0.64,1), height 0.45s cubic-bezier(0.34,1.56,0.64,1), border-radius 0.45s cubic-bezier(0.34,1.56,0.64,1), padding 0.3s ease';
                island.classList.remove('drag-collapsed');
                island.style.width  = naturalW + 'px';
                island.style.height = naturalH + 'px';
                collapsed = false;
                // คืน auto หลัง animate เสร็จ
                setTimeout(() => {
                    island.style.width      = '';
                    island.style.height     = '';
                    island.style.transition = '';
                }, 500);
            }

            function setDragging(on) {
                dragging = on;
                if (on) {
                    captureNavSize();
                    isAtEdge = false;
                    nav.classList.add('dragging');
                    nav.style.transition = 'none';
                    nav.style.cursor     = 'grabbing';
                    nav.style.width      = naturalNavW + 'px'; // ล็อค px ไม่ให้หด/ขยาย
                } else {
                    nav.classList.remove('dragging');
                    nav.style.cursor = '';
                    expandIsland();
                }
            }

            function snapToDefault() {
                isAtEdge = false;
                // ไม่ transition width เลย — position เท่านั้น
                nav.style.transition = 'left 0.55s cubic-bezier(0.34,1.56,0.64,1), top 0.55s cubic-bezier(0.34,1.56,0.64,1)';
                nav.style.left       = '50%';
                nav.style.top        = '16px';
                nav.style.transform  = 'translateX(-50%)';
                hasDragged = false;
                // คืน CSS class ควบคุม width หลัง animation เสร็จ
                setTimeout(() => { nav.style.width = ''; naturalNavW = 0; }, 600);
            }

            function snapToEdge(cx) {
                const W    = nav.getBoundingClientRect().width || naturalW || 300;
                const side = cx < window.innerWidth / 2 ? 'left' : 'right';
                const edgeCX = side === 'left'
                    ? -(W / 2 - EDGE_PEEK)
                    : window.innerWidth + W / 2 - EDGE_PEEK;
                nav.style.transition = 'left 0.4s cubic-bezier(0.4,0,0.2,1), top 0.4s cubic-bezier(0.4,0,0.2,1)';
                nav.style.left       = edgeCX + 'px';
                nav.style.transform  = 'translateX(-50%)';
                isAtEdge  = true;
                hasDragged = true;
                clearTimeout(idleTimer);
                idleTimer = setTimeout(snapToDefault, 4000);
            }

            function startIdle() {
                clearTimeout(idleTimer);
                if (!hasDragged) return;
                const cx = getCX();
                const W  = nav.getBoundingClientRect().width || 300;
                if (cx < EDGE_DIST + W / 2 || cx > window.innerWidth - EDGE_DIST - W / 2) {
                    snapToEdge(cx);
                } else {
                    idleTimer = setTimeout(snapToDefault, 3000);
                }
            }

            // ---- Touch ----
            nav.addEventListener('touchstart', (e) => {
                if (isAtEdge) { snapToDefault(); return; }
                if (e.touches.length !== 1) return;
                captureNavSize();
                const t = e.touches[0];
                startX  = t.clientX;
                startY  = t.clientY;
                origCX  = getCX();
                origTop = nav.getBoundingClientRect().top;
                setDragging(true);
                clearTimeout(idleTimer);
            }, { passive: true });

            nav.addEventListener('touchmove', (e) => {
                if (!dragging || e.touches.length !== 1) return;
                e.preventDefault();
                const t = e.touches[0];
                if (!collapsed) collapseIsland(); // ยุบเมื่อเริ่มขยับจริงๆ
                const { cx, top } = clampPos(origCX + t.clientX - startX, origTop + t.clientY - startY);
                applyPos(cx, top);
                hasDragged = true;
            }, { passive: false });

            nav.addEventListener('touchend', () => { setDragging(false); startIdle(); });

            // ---- Mouse ----
            nav.addEventListener('mousedown', (e) => {
                if (e.target.closest('a, button')) return;
                if (isAtEdge) { snapToDefault(); return; }
                captureNavSize();
                startX  = e.clientX;
                startY  = e.clientY;
                origCX  = getCX();
                origTop = nav.getBoundingClientRect().top;
                setDragging(true);
                clearTimeout(idleTimer);
            });

            document.addEventListener('mousemove', (e) => {
                if (!dragging) return;
                if (!collapsed) collapseIsland(); // ยุบเมื่อเริ่มขยับจริงๆ
                const { cx, top } = clampPos(origCX + e.clientX - startX, origTop + e.clientY - startY);
                applyPos(cx, top);
                hasDragged = true;
            });

            document.addEventListener('mouseup', () => {
                if (!dragging) return;
                setDragging(false);
                startIdle();
            });

            nav.addEventListener('mouseover', (e) => {
                if (!dragging && !e.target.closest('a, button')) nav.style.cursor = 'grab';
            });
            nav.addEventListener('mouseout', () => { if (!dragging) nav.style.cursor = ''; });
        })();

        // ===== COPY PROTECTION =====
        document.addEventListener('contextmenu', e => e.preventDefault());
        document.addEventListener('keydown', e => {
            const blocked = (
                (e.ctrlKey && ['c','a','s','u','p','x'].includes(e.key.toLowerCase())) ||
                (e.metaKey && ['c','a','s','u','p','x'].includes(e.key.toLowerCase())) ||
                e.key === 'F12' || e.key === 'PrintScreen'
            );
            if (blocked) e.preventDefault();
        });
        document.addEventListener('dragstart', e => e.preventDefault());
        document.addEventListener('copy', e => e.preventDefault());
        window.onbeforeprint = () => { document.body.style.display = 'none'; };
        window.onafterprint = () => { document.body.style.display = ''; };

        // ===== LIGHTBOX =====
        function openLightbox(src) {
            const lb  = document.getElementById('lightbox');
            const img = document.getElementById('lightbox-img');
            img.src = src;
            lb.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            document.getElementById('lightbox').classList.add('hidden');
            document.getElementById('lightbox-img').src = '';
            document.body.style.overflow = '';
        }

        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

        // Hold to open lightbox — desktop: mousedown hold, mobile: touchstart hold (450ms)
        let _lbTimer = null;

        document.addEventListener('mousedown', e => {
            const t = e.target.closest('.lightbox-trigger');
            if (!t) return;
            _lbTimer = setTimeout(() => {
                const img = t.querySelector('img');
                if (img) openLightbox(img.src);
            }, 450);
        });
        document.addEventListener('mouseup',   () => clearTimeout(_lbTimer));
        document.addEventListener('mousemove', () => clearTimeout(_lbTimer));

        document.addEventListener('touchstart', e => {
            const t = e.target.closest('.lightbox-trigger');
            if (!t) return;
            _lbTimer = setTimeout(() => {
                const img = t.querySelector('img');
                if (img) openLightbox(img.src);
            }, 450);
        }, { passive: true });
        document.addEventListener('touchend',  () => clearTimeout(_lbTimer), { passive: true });
        document.addEventListener('touchmove', () => clearTimeout(_lbTimer), { passive: true });
