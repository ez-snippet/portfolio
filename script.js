/* ============================================================
   PORTFOLIO — CUSTOM JAVASCRIPT
   - Scroll Progress Bar
   - Active Navbar Link on Scroll
   - Scroll-to-Top Arrow Show/Hide
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ==========================================================
       A) SCROLL PROGRESS BAR
    ========================================================== */
    const progressBar = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (progressBar) {
            progressBar.style.width = percent + '%';
        }
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    updateScrollProgress();


    /* ==========================================================
       B) ACTIVE NAVBAR LINK ON SCROLL
    ========================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    function activateNavLink() {
        const scrollY = window.scrollY + 130; // offset for fixed navbar
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', activateNavLink, { passive: true });
    window.addEventListener('resize', activateNavLink);
    activateNavLink();


    /* ==========================================================
       C) SCROLL-TO-TOP ARROW SHOW / HIDE
    ========================================================== */
    const scrollTopBtn = document.getElementById('scrollTop');

    function toggleScrollTop() {
        if (!scrollTopBtn) return;
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    }

    window.addEventListener('scroll', toggleScrollTop, { passive: true });
    toggleScrollTop();


    /* ==========================================================
       D) CLOSE MOBILE MENU ON LINK CLICK
    ========================================================== */
    const navbarCollapse = document.getElementById('navbarMenu');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                } else {
                    new bootstrap.Collapse(navbarCollapse).hide();
                }
            }
        });
    });

    /* ==========================================================
   E) TYPING EFFECT FOR ROLE TEXT
========================================================== */
    const roleEl = document.getElementById('role');
    const roles = [
        'Web Developer',
        'PHP Developer',
        'Laravel Developer',
        'Full Stack Developer',
        'WordPress Developer',
        'Backend Developer'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeRole() {
        const word = roles[roleIndex];

        if (!isDeleting) {
            charIndex++;
            roleEl.textContent = word.slice(0, charIndex);
            if (charIndex === word.length) {
                isDeleting = true;
                return setTimeout(typeRole, 1500);   // word poora hone par ruke
            }
            return setTimeout(typeRole, 100);        // typing speed
        }

        charIndex--;
        roleEl.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            return setTimeout(typeRole, 400);        // agla word shuru hone se pehle wait
        }
        return setTimeout(typeRole, 50);             // delete speed
    }

    if (roleEl) typeRole();
});