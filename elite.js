(function () {
    var FORM_ENDPOINT = '';
    var d = document, root = d.documentElement;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var canObserve = 'IntersectionObserver' in window;

    var termHTML = '<section id="terminal"><div class="wrap"><h2 class="sec-title">Developer <span class="ul">Console</span></h2>' +
        '<div class="term" id="term"><div class="term-bar"><i></i><i></i><i></i><span>ali@portfolio: ~</span></div>' +
        '<div class="term-body" id="termBody" aria-live="polite"></div>' +
        '<form class="term-in" id="termForm"><span>$</span><input id="termInput" type="text" autocomplete="off" spellcheck="false" aria-label="Terminal command" placeholder="type help and press Enter"></form></div></div></section>';

    var steps = [
        ['Understand', 'I start by understanding your goals, users and requirements so the right thing gets built.'],
        ['Design', 'Database structure, API flow and page layout are planned before any code is written.'],
        ['Build', 'Clean, secure and responsive code using PHP, Laravel, MySQL and JavaScript.'],
        ['Test &amp; Launch', 'Everything is tested on real devices, deployed and supported after launch.']
    ];
    var procHTML = '<section id="process"><div class="wrap"><h2 class="sec-title">How I <span class="ul">Work</span></h2><div class="steps">' +
        steps.map(function (s, i) { return '<div class="step"><b>' + (i + 1) + '</b><h3>' + s[0] + '</h3><p>' + s[1] + '</p></div>'; }).join('') +
        '</div></div></section>';

    var skillsSec = d.getElementById('skills'), contactSec = d.getElementById('contact');
    if (skillsSec) skillsSec.insertAdjacentHTML('afterend', termHTML);
    if (contactSec) contactSec.insertAdjacentHTML('beforebegin', procHTML);

    if (root.classList.contains('js') && canObserve) {
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
        d.querySelectorAll('#terminal .sec-title,#process .sec-title,#term,#process .step').forEach(function (el, i) {
            var isStep = el.classList.contains('step');
            el.classList.add('anim');
            el.setAttribute('data-a', isStep ? 'zoom' : 'up');
            el.style.setProperty('--d', isStep ? (Array.prototype.indexOf.call(el.parentNode.children, el) * .12) + 's' : '0s');
            io.observe(el);
        });
    }

    var foot = d.querySelector('.foot-links a[href="#services"]');
    if (foot) { foot.setAttribute('href', '#process'); foot.textContent = 'Process'; }

    var copy = d.querySelector('.footer-copy');
    if (copy) {
        var tm = d.createElement('p');
        tm.className = 'footer-time';
        tm.innerHTML = '<i class="far fa-clock"></i> Local time in Pakistan: <b></b> PKT';
        copy.parentNode.insertBefore(tm, copy);
        var tick = function () {
            tm.querySelector('b').textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit' });
        };
        tick();
        setInterval(tick, 20000);
    }

    var body = d.getElementById('termBody'), form = d.getElementById('termForm'), inp = d.getElementById('termInput');
    if (body && form && inp) {
        var hist = [], hi = 0, locked = true;
        var cards = function (sel, label) {
            return Array.prototype.map.call(d.querySelectorAll(sel), function (c) {
                var h = c.querySelector('h3'), chips = Array.prototype.map.call(c.querySelectorAll('.chips span'), function (s) { return s.textContent.trim(); });
                return label(h ? h.textContent.trim() : '', chips.join(', '));
            });
        };
        var print = function (t, cls) {
            var l = d.createElement('div');
            l.className = cls || 't-out';
            l.textContent = t;
            body.appendChild(l);
            body.scrollTop = body.scrollHeight;
        };
        var cmdLine = function (txt) {
            var l = d.createElement('div'), b = d.createElement('b'), s = d.createElement('span');
            l.className = 't-cmd'; b.textContent = '$ ';
            l.appendChild(b); l.appendChild(s); body.appendChild(l);
            if (txt) s.textContent = txt;
            body.scrollTop = body.scrollHeight;
            return s;
        };
        var link = function (href) { var a = d.createElement('a'); a.href = href; a.target = '_blank'; a.rel = 'noopener'; a.click(); };
        var cmds = {
            help: function () {
                ['whoami      who am I', 'skills      my tech stack', 'projects    things I have built', 'contact     how to reach me', 'github      open my GitHub', 'cv          download my CV', 'theme       switch dark / light', 'clear       clear the screen'].forEach(function (x) { print(x); });
            },
            whoami: function () { print('M Ali, Full Stack Web Developer from Pakistan.'); print('I build clean, fast and secure web apps with PHP, Laravel, MySQL and JavaScript.'); },
            skills: function () { cards('#skills .svc-card', function (a, b) { return a + ': ' + b; }).forEach(function (x) { print(x); }); },
            projects: function () { cards('.project-card', function (a, b) { return '- ' + a + '  [' + b + ']'; }).forEach(function (x) { print(x); }); },
            contact: function () { print('email     ayazshk61@gmail.com'); print('phone     +92 3171310655'); print('linkedin  linkedin.com/in/m-ali-782a52403'); print('github    github.com/ez-snippet'); },
            github: function () { print('Opening github.com/ez-snippet ...'); link('https://github.com/ez-snippet'); },
            cv: function () { print('Downloading portfolio.pdf ...'); var a = d.createElement('a'); a.href = 'portfolio.pdf'; a.download = ''; a.click(); },
            theme: function () { var b = d.getElementById('themeToggle'); if (b) b.click(); print('Theme switched.'); },
            'sudo hire me': function () { print('Permission granted. Opening your mail app ...'); setTimeout(function () { location.href = 'mailto:ayazshk61@gmail.com?subject=' + encodeURIComponent('Let\'s work together'); }, 900); }
        };
        var run = function (raw) {
            var c = raw.trim().toLowerCase().replace(/\s+/g, ' ');
            if (!c) return;
            if (hist[hist.length - 1] !== c) hist.push(c);
            hi = hist.length;
            if (c === 'clear') { body.textContent = ''; return; }
            if (cmds.hasOwnProperty(c)) cmds[c](); else print('command not found: ' + c + '. Type help.', 't-err');
        };
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (locked) return;
            var v = inp.value;
            inp.value = '';
            cmdLine(v);
            run(v);
        });
        inp.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowUp' && hist.length) { e.preventDefault(); hi = Math.max(0, hi - 1); inp.value = hist[hi] || ''; }
            else if (e.key === 'ArrowDown' && hist.length) { e.preventDefault(); hi = Math.min(hist.length, hi + 1); inp.value = hist[hi] || ''; }
        });
        d.getElementById('term').addEventListener('click', function () { inp.focus({ preventScroll: true }); });

        var demo = ['whoami', 'skills'], started = false;
        var typeNext = function () {
            if (!demo.length) { locked = false; print("Type 'help' to see all commands. Try it yourself.", 't-out'); return; }
            var c = demo.shift(), span = cmdLine(''), i = 0;
            var go = function () {
                if (i < c.length) { span.textContent += c[i++]; setTimeout(go, reduce ? 0 : 55); }
                else { run(c); setTimeout(typeNext, reduce ? 0 : 500); }
            };
            go();
        };
        var start = function () { if (started) return; started = true; typeNext(); };
        if (canObserve) {
            var to = new IntersectionObserver(function (es) {
                if (es[0].isIntersecting) { to.disconnect(); start(); }
            }, { threshold: .5 });
            to.observe(d.getElementById('term'));
        } else start();
    }

    var f = d.getElementById('contactForm'), note = d.getElementById('formNote');
    if (f && FORM_ENDPOINT) {
        f.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var btn = f.querySelector('button[type="submit"]');
            btn.disabled = true;
            note.textContent = 'Sending...';
            fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
                .then(function (r) { if (!r.ok) throw new Error('fail'); f.reset(); note.textContent = 'Thank you! Your message was sent. I will reply soon.'; })
                .catch(function () { note.textContent = 'Could not send. Please email ayazshk61@gmail.com directly.'; })
                .then(function () { btn.disabled = false; });
        }, true);
    }
})();