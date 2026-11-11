
// =====================================
// KPZ — INTERACTIVE EXPERIENCE
// =====================================

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const backToTop = document.querySelector('.back-to-top');
const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
);

// =====================================
// MOBILE MENU
// =====================================

if (menuToggle && navLinks) {
    const menuLabel = menuToggle.querySelector('.menu-label');

    const setMenuOpen = (open) => {
        navLinks.classList.toggle('active', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute(
            'aria-label',
            open ? 'Close navigation' : 'Open navigation'
        );

        if (menuLabel) {
            menuLabel.textContent = open ? 'CLOSE' : 'MENU';
        }
    };

    menuToggle.addEventListener('click', () => {
        const isOpen =
            menuToggle.getAttribute('aria-expanded') === 'true';

        setMenuOpen(!isOpen);
    });

    navLinks.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
            setMenuOpen(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (
            event.key === 'Escape' &&
            menuToggle.getAttribute('aria-expanded') === 'true'
        ) {
            setMenuOpen(false);
            menuToggle.focus();
        }
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.site-header')) {
            setMenuOpen(false);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            setMenuOpen(false);
        }
    });
}

// =====================================
// SMART HEADER + BACK TO TOP
// =====================================

const updateScrollUI = () => {
    const isScrolled = window.scrollY > 40;

    header?.classList.toggle('scrolled', isScrolled);

    if (backToTop) {
        const showButton = window.scrollY > 500;

        backToTop.classList.toggle('visible', showButton);
        backToTop.tabIndex = showButton ? 0 : -1;
    }
};

window.addEventListener('scroll', updateScrollUI, {
    passive: true
});

updateScrollUI();

// =====================================
// SCROLL REVEAL
// =====================================

const revealElements = document.querySelectorAll('.reveal');

if (
    'IntersectionObserver' in window &&
    !prefersReducedMotion.matches
) {
    document.documentElement.classList.add('js-ready');

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.08,
            rootMargin: '0px 0px 30px 0px'
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}

// =====================================
// ACTIVE NAVIGATION LINK
// =====================================

const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const updateActiveSection = () => {
    const scrollPosition = window.scrollY + 150;
    let activeId = 'home';

    sections.forEach((section) => {
        if (section.offsetTop <= scrollPosition) {
            activeId = section.id;
        }
    });

    navAnchors.forEach((link) => {
        const isActive =
            link.getAttribute('href') === `#${activeId}`;

        link.classList.toggle('active', isActive);

        if (isActive) {
            link.setAttribute('aria-current', 'location');
        } else {
            link.removeAttribute('aria-current');
        }
    });
};

window.addEventListener('scroll', updateActiveSection, {
    passive: true
});

window.addEventListener('resize', updateActiveSection);
updateActiveSection();
