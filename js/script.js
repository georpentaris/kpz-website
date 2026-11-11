
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


// =====================================
// SELECTED WORKS — MOBILE CAROUSEL
// =====================================

const worksGrid = document.querySelector('.works-grid');
const worksCards = worksGrid
    ? [...worksGrid.querySelectorAll('.work-card')]
    : [];

const prevWork = document.querySelector('.works-prev');
const nextWork = document.querySelector('.works-next');
const worksDots = document.querySelector('.works-dots');

if (
    worksGrid &&
    worksCards.length > 0 &&
    prevWork &&
    nextWork &&
    worksDots
) {
    let currentWork = 0;

    const dots = worksCards.map((_, index) => {
        const dot = document.createElement('button');

        dot.type = 'button';
        dot.className = 'works-dot';
        dot.setAttribute(
            'aria-label',
            `Go to work ${index + 1}`
        );

        dot.addEventListener('click', () => {
            goToWork(index);
        });

        worksDots.appendChild(dot);
        return dot;
    });

    const updateControls = () => {
        prevWork.disabled = currentWork === 0;
        nextWork.disabled =
            currentWork === worksCards.length - 1;

        dots.forEach((dot, index) => {
            const active = index === currentWork;

            dot.classList.toggle('active', active);
            dot.setAttribute('aria-pressed', String(active));
        });
    };

    const goToWork = (index) => {
        currentWork = Math.max(
            0,
            Math.min(index, worksCards.length - 1)
        );

        worksGrid.scrollTo({
            left: worksCards[currentWork].offsetLeft
                - worksCards[0].offsetLeft,
            behavior: prefersReducedMotion.matches
                ? 'instant'
                : 'smooth'
        });

        updateControls();
    };

    prevWork.addEventListener('click', () => {
        goToWork(currentWork - 1);
    });

    nextWork.addEventListener('click', () => {
        goToWork(currentWork + 1);
    });

    // Update active dot when the user swipes.

    let scrollFrame = null;

    worksGrid.addEventListener('scroll', () => {
        if (scrollFrame !== null) {
            cancelAnimationFrame(scrollFrame);
        }

        scrollFrame = requestAnimationFrame(() => {
            const cardWidth =
                worksCards[0].getBoundingClientRect().width;

            const step =
                cardWidth +
                parseFloat(getComputedStyle(worksGrid).gap || 0);

            if (step > 0) {
                currentWork = Math.max(
                    0,
                    Math.min(
                        Math.round(worksGrid.scrollLeft / step),
                        worksCards.length - 1
                    )
                );

                updateControls();
            }

            scrollFrame = null;
        });
    }, { passive: true });

    updateControls();
}
