(function () {
    var d = document, root = d.documentElement;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;

    var seenLoader = false;
    try { seenLoader = sessionStorage.getItem('ld') === '1'; } catch (e) { }
    if (!reduce && !seenLoader) {
        root.classList.add('loading');
        var L = d.createElement('div');
        L.className = 'loader';
        L.innerHTML = '<div class="ld-logo">EZ<b>.</b></div><div class="ld-num">0</div><div class="ld-bar"><i></i></div>';
        d.body.appendChild(L);
        var t0 = performance.now(), num = L.querySelector('.ld-num'), bar = L.querySelector('i');
        (function step(t) {
            var p = Math.min((t - t0) / 1300, 1), k = 1 - Math.pow(1 - p, 3);
            num.textContent = Math.round(k * 100);
            bar.style.width = (k * 100) + '%';
            if (p < 1) { requestAnimationFrame(step); return; }
            L.classList.add('out');
            root.classList.remove('loading');
            try { sessionStorage.setItem('ld', '1'); } catch (e) { }
            setTimeout(function () { L.remove(); }, 1000);
        })(t0);
    }

    var cv = d.createElement('canvas'), cx = cv.getContext('2d');
    cv.className = 'bg-canvas';
    d.body.insertBefore(cv, d.body.firstChild);
    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), P = [], B = [], M = { x: -999, y: -999 }, col = '255,255,255';
    var track = d.querySelector('.techbar .track'), anim = track && track.getAnimations ? track.getAnimations()[0] : null;
    var lastY = window.scrollY, rate = 1;

    function mkP() {
        return { x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, r: Math.random() * 1.4 + .7 };
    }
    function size() {
        W = innerWidth; H = innerHeight;
        cv.width = W * dpr; cv.height = H * dpr;
        cx.setTransform(dpr, 0, 0, dpr, 0, 0);
        var n = reduce ? 0 : Math.min(70, Math.floor(W * H / 22000));
        while (P.length < n) P.push(mkP());
        P.length = n;
    }
    function theme() { col = root.getAttribute('data-theme') === 'dark' ? '255,255,255' : '0,0,0'; }
    theme();
    new MutationObserver(theme).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    size();
    window.addEventListener('resize', size);
    d.addEventListener('mousemove', function (e) { M.x = e.clientX; M.y = e.clientY; });
    d.documentElement.addEventListener('mouseleave', function () { M.x = M.y = -999; });
    d.addEventListener('click', function (e) {
        if (reduce) return;
        for (var i = 0; i < 14; i++) {
            var a = Math.PI * 2 * i / 14 + Math.random() * .4, s = 1.5 + Math.random() * 2.5;
            B.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * s, vy: Math.sin(a) * s, l: 1 });
        }
    });

    function frame() {
        cx.clearRect(0, 0, W, H);
        var i, j, p, q, dx, dy, dist;
        for (i = 0; i < P.length; i++) {
            p = P[i];
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
            dx = p.x - M.x; dy = p.y - M.y; dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 160) {
                if (dist < 90) { p.x += dx / dist * .8; p.y += dy / dist * .8; }
                cx.strokeStyle = 'rgba(' + col + ',' + ((1 - dist / 160) * .35) + ')';
                cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(M.x, M.y); cx.stroke();
            }
            cx.fillStyle = 'rgba(' + col + ',.45)';
            cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill();
            for (j = i + 1; j < P.length; j++) {
                q = P[j]; dx = p.x - q.x; dy = p.y - q.y; dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    cx.strokeStyle = 'rgba(' + col + ',' + ((1 - dist / 120) * .22) + ')';
                    cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(q.x, q.y); cx.stroke();
                }
            }
        }
        for (i = B.length - 1; i >= 0; i--) {
            p = B[i]; p.x += p.vx; p.y += p.vy; p.vx *= .95; p.vy *= .95; p.l -= .025;
            if (p.l <= 0) { B.splice(i, 1); continue; }
            cx.fillStyle = 'rgba(' + col + ',' + p.l + ')';
            cx.beginPath(); cx.arc(p.x, p.y, 2.2 * p.l, 0, 6.283); cx.fill();
        }
        if (anim && !reduce) {
            var v = Math.abs(window.scrollY - lastY); lastY = window.scrollY;
            rate += ((1 + Math.min(v / 3, 6)) - rate) * .1;
            anim.playbackRate = rate;
        }
        requestAnimationFrame(frame);
    }
    if (!reduce) frame();

    var toastEl = d.createElement('div'), toastT;
    toastEl.className = 'toast';
    d.body.appendChild(toastEl);
    function toast(m) {
        toastEl.textContent = m; toastEl.classList.add('show');
        clearTimeout(toastT);
        toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
    }
    function go(s) { var el = d.querySelector(s); if (el) el.scrollIntoView({ behavior: 'smooth' }); }

    var items = [
        { t: 'Go to Home', i: 'fas fa-house', a: function () { go('#home'); } },
        { t: 'Go to About', i: 'fas fa-user', a: function () { go('#about'); } },
        { t: 'Go to Skills', i: 'fas fa-layer-group', a: function () { go('#skills'); } },
        { t: 'Go to Projects', i: 'fas fa-folder-open', a: function () { go('#projects'); } },
        { t: 'Go to Contact', i: 'fas fa-envelope', a: function () { go('#contact'); } },
        { t: 'Toggle dark / light theme', i: 'fas fa-circle-half-stroke', a: function () { var b = d.getElementById('themeToggle'); if (b) b.click(); } },
        { t: 'Download CV', i: 'fas fa-file-lines', a: function () { var a = d.createElement('a'); a.href = 'portfolio.pdf'; a.download = ''; a.click(); } },
        { t: 'Open GitHub', i: 'fab fa-github', a: function () { window.open('https://github.com/ez-snippet', '_blank', 'noopener'); } },
        { t: 'Open LinkedIn', i: 'fab fa-linkedin-in', a: function () { window.open('https://www.linkedin.com/in/m-ali-782a52403/', '_blank', 'noopener'); } },
        {
            t: 'Copy email address', i: 'far fa-copy', a: function () {
                var m = 'ayazshk61@gmail.com';
                if (navigator.clipboard) navigator.clipboard.writeText(m).then(function () { toast('Email copied'); }, function () { toast(m); });
                else toast(m);
            }
        }
    ];

    var pal = d.createElement('div');
    pal.className = 'pal';
    pal.innerHTML = '<div class="pal-box"><div class="pal-top"><i class="fas fa-magnifying-glass"></i><input type="text" placeholder="Type a command or search…" aria-label="Command search"><kbd>Esc</kbd></div><div class="pal-list"></div></div>';
    d.body.appendChild(pal);
    var inp = pal.querySelector('input'), list = pal.querySelector('.pal-list'), shown = [], sel = 0;

    function render() {
        var q = inp.value.trim().toLowerCase();
        shown = items.filter(function (x) { return x.t.toLowerCase().indexOf(q) > -1; });
        if (sel >= shown.length) sel = 0;
        list.innerHTML = '';
        if (!shown.length) { list.innerHTML = '<div class="pal-empty">No results found</div>'; return; }
        shown.forEach(function (x, n) {
            var b = d.createElement('button');
            b.type = 'button';
            b.className = 'pal-item' + (n === sel ? ' on' : '');
            b.innerHTML = '<i class="' + x.i + '"></i><span>' + x.t + '</span>';
            b.addEventListener('mouseenter', function () { sel = n; mark(); });
            b.addEventListener('click', function () { run(n); });
            list.appendChild(b);
        });
    }
    function mark() {
        Array.prototype.forEach.call(list.children, function (c, n) { c.classList.toggle('on', n === sel); });
        if (list.children[sel] && list.children[sel].scrollIntoView) list.children[sel].scrollIntoView({ block: 'nearest' });
    }
    function open() { pal.classList.add('open'); inp.value = ''; sel = 0; render(); setTimeout(function () { inp.focus(); }, 50); }
    function close() { pal.classList.remove('open'); inp.blur(); }
    function run(n) { var x = shown[n]; if (!x) return; close(); setTimeout(x.a, 200); }

    inp.addEventListener('input', function () { sel = 0; render(); });
    inp.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % Math.max(shown.length, 1); mark(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + shown.length) % Math.max(shown.length, 1); mark(); }
        else if (e.key === 'Enter') { e.preventDefault(); run(sel); }
    });
    pal.addEventListener('mousedown', function (e) { if (e.target === pal) close(); });
    d.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.classList.contains('open') ? close() : open(); }
        else if (e.key === 'Escape' && pal.classList.contains('open')) close();
    });

    var hint = d.createElement('button');
    hint.type = 'button';
    hint.className = 'k-hint';
    hint.setAttribute('aria-label', 'Open command menu');
    hint.innerHTML = '<i class="fas fa-terminal"></i><span>Quick menu</span><kbd>Ctrl K</kbd>';
    hint.addEventListener('click', open);
    d.body.appendChild(hint);
})();