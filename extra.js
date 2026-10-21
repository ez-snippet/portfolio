(function () {
    var d = document, root = d.documentElement;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var canObserve = 'IntersectionObserver' in window;
    var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;

    var dark = false;
    try { dark = localStorage.getItem('theme') === 'dark'; } catch (e) { }
    function applyTheme() {
        root.setAttribute('data-theme', dark ? 'dark' : 'light');
        var i = d.querySelector('#themeToggle i');
        if (i) i.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    }
    applyTheme();
    var tb = d.getElementById('themeToggle');
    if (tb) tb.addEventListener('click', function () {
        dark = !dark; applyTheme();
        try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) { }
    });

    var btns = d.querySelectorAll('.filter-btn'), cards = d.querySelectorAll('.project-card');
    btns.forEach(function (b) {
        b.addEventListener('click', function () {
            btns.forEach(function (x) { x.classList.remove('active'); });
            b.classList.add('active');
            var f = b.getAttribute('data-filter'), n = 0;
            cards.forEach(function (c) {
                var ok = f === 'all' || (c.getAttribute('data-cat') || '').split(' ').indexOf(f) > -1;
                c.classList.toggle('hide', !ok);
                if (ok && !reduce) {
                    c.classList.remove('pop');
                    void c.offsetWidth;
                    c.style.animationDelay = (n++ * 0.08) + 's';
                    c.classList.add('pop');
                    setTimeout(function () { c.classList.remove('pop'); c.style.animationDelay = ''; }, 900);
                }
            });
        });
    });

    function countUp(el) {
        var end = parseInt(el.getAttribute('data-count'), 10), suf = el.getAttribute('data-suffix') || '';
        if (reduce) { el.textContent = end + suf; return; }
        var start = null;
        function step(t) {
            if (!start) start = t;
            var p = Math.min((t - start) / 1200, 1);
            el.textContent = Math.round(end * p) + suf;
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    if (canObserve) {
        var co = new IntersectionObserver(function (es) {
            es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); co.unobserve(e.target); } });
        }, { threshold: .6 });
        d.querySelectorAll('[data-count]').forEach(function (el) { co.observe(el); });
    }

    if (canObserve && !reduce) {
        root.classList.add('js');
        var rules = [
            ['.sec-title', 'up', 0, 1],
            ['.contact-intro,.filters', 'up', 0, 1],
            ['.techbar', 'up', 0, 1],
            ['.oval-wrap', 'left', 0, 1],
            ['.about-text > :not(.sec-title)', 'up', .1, 99],
            ['.svc-card,.project-card,.step', 'zoom', .12, 3],
            ['.contact-info', 'left', 0, 1],
            ['.contact-form', 'right', 0, 1],
            ['.footer > *', 'up', .1, 99]
        ];
        var io = new IntersectionObserver(function (es) {
            es.forEach(function (e) {
                if (!e.isIntersecting) return;
                var t = e.target, dl = parseFloat(t.style.getPropertyValue('--d')) || 0;
                io.unobserve(t);
                t.classList.add('show', 'in-view');
                setTimeout(function () {
                    t.classList.remove('anim', 'show');
                    t.removeAttribute('data-a');
                    t.style.removeProperty('--d');
                }, 900 + dl * 1000);
            });
        }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
        rules.forEach(function (r) {
            d.querySelectorAll(r[0]).forEach(function (el) {
                var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
                el.classList.add('anim');
                el.setAttribute('data-a', r[1]);
                el.style.setProperty('--d', ((idx % r[3]) * r[2]) + 's');
                io.observe(el);
            });
        });
    }

    d.querySelectorAll('.svc-card,.project-card,.info,.step').forEach(function (c) {
        var tilt = !reduce && c.matches('.svc-card,.project-card,.step');
        c.addEventListener('mousemove', function (e) {
            var r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
            c.style.setProperty('--mx', x + 'px');
            c.style.setProperty('--my', y + 'px');
            if (tilt) {
                c.style.setProperty('--ry', ((x / r.width - .5) * 8) + 'deg');
                c.style.setProperty('--rx', ((.5 - y / r.height) * 8) + 'deg');
            }
        });
        c.addEventListener('mouseleave', function () {
            c.style.setProperty('--rx', '0deg');
            c.style.setProperty('--ry', '0deg');
        });
    });

    if (fine && !reduce) {
        d.querySelectorAll('.btn-grad,.btn-out,.btn-dark-pill,.social-btn,.theme-toggle,.go,.scroll-top').forEach(function (b) {
            b.addEventListener('mousemove', function (e) {
                var r = b.getBoundingClientRect();
                b.style.translate = ((e.clientX - r.left - r.width / 2) * .3) + 'px ' + ((e.clientY - r.top - r.height / 2) * .3) + 'px';
            });
            b.addEventListener('mouseleave', function () { b.style.translate = ''; });
        });
    }

    d.querySelectorAll('.btn-grad,.btn-out,.btn-dark-pill,.filter-btn').forEach(function (b) {
        b.addEventListener('click', function (e) {
            if (reduce) return;
            var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2, o = d.createElement('span');
            o.className = 'ripple';
            o.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) + 'px;top:' + (e.clientY - r.top - s / 2) + 'px';
            b.appendChild(o);
            setTimeout(function () { o.remove(); }, 650);
        });
    });

    var hero = d.getElementById('home'), orbit = d.querySelector('.orbit');
    if (fine && !reduce && hero && orbit) {
        var icos = d.querySelectorAll('.ico'), photo = d.querySelector('.ring-photo');
        hero.addEventListener('mousemove', function (e) {
            var nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
            orbit.style.transform = 'perspective(900px) rotateY(' + (nx * 10) + 'deg) rotateX(' + (-ny * 10) + 'deg)';
            if (photo) photo.style.translate = (nx * -14) + 'px ' + (ny * -14) + 'px';
            icos.forEach(function (c, i) {
                var k = 18 + (i % 3) * 10;
                c.style.translate = (nx * k) + 'px ' + (ny * k) + 'px';
            });
        });
        hero.addEventListener('mouseleave', function () {
            orbit.style.transform = '';
            if (photo) photo.style.translate = '';
            icos.forEach(function (c) { c.style.translate = ''; });
        });
    }

    if (fine) {
        var mk = function (c) { var n = d.createElement('div'); n.className = c; d.body.appendChild(n); return n; };
        var dot = mk('cur-dot'), ring = mk('cur-ring'), glow = mk('cur-glow');
        var mx = 0, my = 0, rx = 0, ry = 0, gx = 0, gy = 0, seen = false;
        root.classList.add('has-cursor');
        d.addEventListener('mousemove', function (e) {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
            if (!seen) { seen = true; rx = gx = mx; ry = gy = my; root.classList.add('cur-on'); }
        });
        root.addEventListener('mouseleave', function () { root.classList.remove('cur-on'); });
        root.addEventListener('mouseenter', function () { if (seen) root.classList.add('cur-on'); });
        d.addEventListener('mouseover', function (e) {
            var t = e.target;
            if (!t.closest) return;
            var h = !!t.closest('a,button,.filter-btn,label'), x = !!t.closest('input,textarea');
            [dot, ring].forEach(function (n) {
                n.classList.toggle('is-hover', h);
                n.classList.toggle('is-text', x);
            });
        });
        d.addEventListener('mousedown', function () { ring.classList.add('is-down'); });
        d.addEventListener('mouseup', function () { ring.classList.remove('is-down'); });
        (function loop() {
            rx += (mx - rx) * .16; ry += (my - ry) * .16;
            gx += (mx - gx) * .08; gy += (my - gy) * .08;
            ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
            glow.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0)';
            requestAnimationFrame(loop);
        })();
    }

    var f = d.getElementById('contactForm'), note = d.getElementById('formNote');
    if (f) f.addEventListener('submit', function (e) {
        e.preventDefault();
        var n = f.elements.fname.value.trim(), m = f.elements.femail.value.trim(),
            s = f.elements.fsubject.value.trim() || 'Portfolio enquiry', msg = f.elements.fmessage.value.trim();
        if (!n || !m || !msg) { note.textContent = 'Please fill in your name, email and message.'; return; }
        location.href = 'mailto:ayazshk61@gmail.com?subject=' + encodeURIComponent(s) +
            '&body=' + encodeURIComponent(msg + '\n\n— ' + n + ' (' + m + ')');
        note.textContent = 'Opening your email app… if nothing opens, write to ayazshk61@gmail.com directly.';
    });

    d.querySelectorAll('.year').forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();