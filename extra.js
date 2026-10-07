/* Extra features: dark mode, project filters, counters, reveal, contact form */
(function () {
    var d = document, root = d.documentElement;

    /* ---- Dark mode (remembers choice) ---- */
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

    /* ---- Project filters ---- */
    var btns = d.querySelectorAll('.filter-btn'), cards = d.querySelectorAll('.project-card');
    btns.forEach(function (b) {
        b.addEventListener('click', function () {
            btns.forEach(function (x) { x.classList.remove('active'); });
            b.classList.add('active');
            var f = b.getAttribute('data-filter');
            cards.forEach(function (c) {
                var ok = f === 'all' || (c.getAttribute('data-cat') || '').split(' ').indexOf(f) > -1;
                c.classList.toggle('hide', !ok);
            });
        });
    });

    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var canObserve = 'IntersectionObserver' in window;

    /* ---- Count-up numbers ---- */
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

    /* ---- Gentle reveal on scroll ---- */
    if (canObserve && !reduce) {
        root.classList.add('js');
        var els = d.querySelectorAll('.sec-title,.sec-sub,.svc-card,.step,.project-card,.info,.stats,.contact-cards a,.contact-form,.oval-wrap');
        var ro = new IntersectionObserver(function (es) {
            es.forEach(function (e) {
                if (!e.isIntersecting) return;
                var t = e.target; t.classList.add('in'); ro.unobserve(t);
                setTimeout(function () { t.classList.remove('reveal', 'in'); }, 800);
            });
        }, { threshold: .12 });
        els.forEach(function (el) { el.classList.add('reveal'); ro.observe(el); });
    }

    /* ---- Contact form: opens the visitor's email app ---- */
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

    /* ---- Footer year ---- */
    d.querySelectorAll('.year').forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();