(function () {
    var d = document, root = d.documentElement;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;

    var tb = d.getElementById('themeToggle'), passing = false;
    if (tb && d.startViewTransition && !reduce) {
        tb.addEventListener('click', function (e) {
            if (passing) return;
            e.stopImmediatePropagation();
            var r = tb.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
            var rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
            var vt = d.startViewTransition(function () { passing = true; tb.click(); passing = false; });
            vt.ready.then(function () {
                root.animate(
                    { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + rad + 'px at ' + x + 'px ' + y + 'px)'] },
                    { duration: 700, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
                );
            }, function () { });
        }, true);
    }

    var ring = d.querySelector('.cur-ring');
    if (fine && ring) {
        var lab = d.createElement('span');
        lab.className = 'cur-label';
        ring.appendChild(lab);
        d.querySelectorAll('.project-card').forEach(function (c) { c.setAttribute('data-cursor', 'Project'); });
        d.querySelectorAll('.project-links a').forEach(function (a) { a.setAttribute('data-cursor', 'Open'); });
        d.querySelectorAll('.scroll-top').forEach(function (a) { a.setAttribute('data-cursor', 'Top'); });
        d.addEventListener('mouseover', function (e) {
            var t = e.target.closest ? e.target.closest('[data-cursor]') : null;
            if (t) { lab.textContent = t.getAttribute('data-cursor'); ring.classList.add('has-label'); }
            else ring.classList.remove('has-label');
        });
    }

    var chars = '!<>-_\\/[]{}=+*^?#01', busy = new WeakMap();
    function scramble(el, text, ms) {
        if (busy.get(el)) return;
        busy.set(el, true);
        var t0 = performance.now();
        (function s(t) {
            var p = Math.min((t - t0) / ms, 1), out = '';
            for (var i = 0; i < text.length; i++) {
                out += (text[i] === ' ' || i < text.length * p) ? text[i] : chars[Math.floor(Math.random() * chars.length)];
            }
            el.textContent = out;
            if (p < 1) requestAnimationFrame(s); else busy.set(el, false);
        })(t0);
    }
    if (!reduce) {
        var ali = d.querySelector('.hero2 h1 .grad');
        if (ali) {
            var txt = ali.textContent, wait = setInterval(function () {
                if (root.classList.contains('loading')) return;
                clearInterval(wait);
                setTimeout(function () { scramble(ali, txt, 900); }, 500);
            }, 100);
            ali.addEventListener('mouseenter', function () { scramble(ali, txt, 600); });
        }
        d.querySelectorAll('.navbar-nav .nav-link,.btn-dark-pill').forEach(function (el) {
            var o = el.textContent.trim();
            el.addEventListener('mouseenter', function () { scramble(el, o, 350); });
        });
    }

    var secs = [['home', 'Home'], ['about', 'About'], ['skills', 'Skills'], ['projects', 'Projects'], ['contact', 'Contact']];
    var nav = d.createElement('nav');
    nav.className = 'side-dots';
    nav.setAttribute('aria-label', 'Sections');
    secs.forEach(function (s) {
        var a = d.createElement('a');
        a.href = '#' + s[0];
        a.setAttribute('aria-label', s[1]);
        a.innerHTML = '<span>' + s[1] + '</span>';
        nav.appendChild(a);
    });
    d.body.appendChild(nav);
    if ('IntersectionObserver' in window) {
        var dots = nav.querySelectorAll('a');
        var so = new IntersectionObserver(function (es) {
            es.forEach(function (e) {
                if (!e.isIntersecting) return;
                dots.forEach(function (x) { x.classList.toggle('on', x.getAttribute('href') === '#' + e.target.id); });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        secs.forEach(function (s) { var el = d.getElementById(s[0]); if (el) so.observe(el); });
    }

    var host = d.querySelector('.about-text .info-grid');
    function paint(g) {
        if (!host) return;
        var box = d.createElement('div');
        box.className = 'gh-live';
        box.innerHTML = '<div class="gh-h"><i class="fab fa-github"></i> Live from GitHub <span class="gh-dot"></span></div><div class="gh-row">' +
            '<div><b>' + g.repos + '</b><small>Public repos</small></div>' +
            '<div><b>' + g.stars + '</b><small>Stars earned</small></div>' +
            '<div><b>' + g.followers + '</b><small>Followers</small></div>' +
            '<div><b>' + g.lang + '</b><small>Top language</small></div></div>';
        host.parentNode.insertBefore(box, host);
    }
    var cache = null;
    try { cache = JSON.parse(sessionStorage.getItem('gh')); } catch (e) { }
    if (cache) paint(cache);
    else if (window.fetch && host) {
        Promise.all([
            fetch('https://api.github.com/users/ez-snippet').then(function (r) { return r.json(); }),
            fetch('https://api.github.com/users/ez-snippet/repos?per_page=100').then(function (r) { return r.json(); })
        ]).then(function (res) {
            var u = res[0], rp = res[1];
            if (typeof u.public_repos !== 'number' || !Array.isArray(rp)) return;
            var stars = 0, cnt = {}, top = '-', best = 0;
            rp.forEach(function (r) {
                if (r.fork) return;
                stars += r.stargazers_count || 0;
                if (r.language) { cnt[r.language] = (cnt[r.language] || 0) + 1; if (cnt[r.language] > best) { best = cnt[r.language]; top = r.language; } }
            });
            var g = { repos: u.public_repos, stars: stars, followers: u.followers, lang: top };
            try { sessionStorage.setItem('gh', JSON.stringify(g)); } catch (e) { }
            paint(g);
        }).catch(function () { });
    }
})();