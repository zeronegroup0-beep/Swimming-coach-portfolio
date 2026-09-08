// Theme Toggle & State Management (Light / Dark Mode with Aqua Blue accents)
const THEME_STORAGE_KEY = 'zerone_theme';
let themeTransitionTimeout = null;

function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
        return saved;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function updateThemeUI(theme) {
    const isDark = theme === 'dark';
    const toggleBtns = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile, #theme-toggle-drawer');

    toggleBtns.forEach(btn => {
        btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        btn.setAttribute('title', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme (Aqua)');
        const label = btn.querySelector('.theme-text');
        if (label) {
            label.textContent = isDark ? 'Light' : 'Dark';
        }
    });
}

function applyTheme(theme, animate = false) {
    if (animate) {
        document.documentElement.classList.add('theme-transitioning');
        clearTimeout(themeTransitionTimeout);
        themeTransitionTimeout = setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
        }, 400);
    }

    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {}

    updateThemeUI(theme);
}

function toggleTheme() {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    const nextTheme = isCurrentlyDark ? 'light' : 'dark';
    applyTheme(nextTheme, true);
}

// Bind click events on all theme toggles
['theme-toggle', 'theme-toggle-mobile', 'theme-toggle-drawer'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('click', toggleTheme);
    }
});

// Initial UI sync
updateThemeUI(document.documentElement.classList.contains('dark') ? 'dark' : 'light');

// Listen to OS system theme changes if user hasn't explicitly chosen
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light', true);
        }
    });
}

// Mobile Side Drawer Toggle Logic
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-item, #mobile-menu .btn-primary');
const navbar = document.getElementById('navbar');

function openMobileMenu() {
    if (mobileMenu && mobileMenuOverlay) {
        mobileMenu.classList.add('menu-open');
        mobileMenuOverlay.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
        const wa = document.getElementById('whatsappFloat');
        if (wa) wa.classList.add('hidden-by-menu');
    }
}

function closeMobileMenu() {
    if (mobileMenu && mobileMenuOverlay) {
        mobileMenu.classList.remove('menu-open');
        mobileMenuOverlay.classList.remove('menu-open');
        document.body.style.overflow = '';
        const wa = document.getElementById('whatsappFloat');
        if (wa) wa.classList.remove('hidden-by-menu');
    }
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
}

if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
}

if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

// Close mobile drawer when a link is clicked
mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Sticky Navbar on Scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('nav-scrolled', 'py-2');
        navbar.classList.remove('py-4');
    } else {
        navbar.classList.remove('nav-scrolled', 'py-2');
        navbar.classList.add('py-4');
    }
});

// Update Copyright Year
document.getElementById('year').textContent = new Date().getFullYear();

// Simple smooth scroll for anchor links (if scroll-behavior: smooth isn't supported)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Only prevent default if it's not the mobile menu toggle logic
        if(this.getAttribute('href') !== '#') {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Account for fixed header height
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    });
});

// Active Link Highlighting using Intersection Observer
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-item, .mobile-nav-link');

const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // Trigger when section is in the middle of the viewport
    threshold: 0
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active', 'text-aqua'));
            
            // Add active class to corresponding link
            const activeId = entry.target.getAttribute('id');
            if (activeId) {
                const activeLinks = document.querySelectorAll(`.nav-link[href="#${activeId}"], .mobile-nav-item[href="#${activeId}"], .mobile-nav-link[href="#${activeId}"]`);
                activeLinks.forEach(link => {
                    link.classList.add('active');
                });
            }
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Contact Form Success State Effect
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Add success class and change text
        submitBtn.classList.add('success-state');
        submitBtn.innerHTML = '<span class="flex items-center gap-2"><i class="fa-solid fa-check"></i> Message Sent Successfully</span>';
        
        // Reset form
        this.reset();
        
        // Revert button after 3 seconds
        setTimeout(() => {
            submitBtn.classList.remove('success-state');
            submitBtn.innerHTML = originalText;
        }, 3000);
    });
}

// Draggable Floating WhatsApp Icon (Touch & Mouse Support)
const whatsappFloat = document.getElementById('whatsappFloat');
if (whatsappFloat) {
    let isPointerDown = false;
    let isDragging = false;
    let hasMoved = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    const dragThreshold = 6; // px to distinguish click from drag
    let preventNextClick = false;

    const onPointerMove = (e) => {
        if (!isPointerDown) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (!hasMoved) {
            if (Math.hypot(dx, dy) > dragThreshold) {
                hasMoved = true;
                isDragging = true;
                whatsappFloat.classList.add('is-dragging');
            }
        }

        if (isDragging) {
            // Prevent page scrolling on touch devices while dragging the button
            if (e.cancelable) {
                e.preventDefault();
            }

            let newLeft = startLeft + dx;
            let newTop = startTop + dy;

            // Clamping within viewport boundaries
            const padding = 10;
            const maxLeft = window.innerWidth - whatsappFloat.offsetWidth - padding;
            const maxTop = window.innerHeight - whatsappFloat.offsetHeight - padding;

            newLeft = Math.max(padding, Math.min(newLeft, maxLeft));
            newTop = Math.max(padding, Math.min(newTop, maxTop));

            whatsappFloat.style.left = `${newLeft}px`;
            whatsappFloat.style.top = `${newTop}px`;
            whatsappFloat.style.right = 'auto';
            whatsappFloat.style.bottom = 'auto';
        }
    };

    const onPointerUp = (e) => {
        if (!isPointerDown) return;
        isPointerDown = false;

        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);

        if (hasMoved) {
            whatsappFloat.classList.remove('is-dragging');
            preventNextClick = true;
            setTimeout(() => {
                preventNextClick = false;
                hasMoved = false;
                isDragging = false;
            }, 100);
        } else {
            whatsappFloat.classList.remove('is-dragging');
            isDragging = false;
            hasMoved = false;
        }
    };

    whatsappFloat.addEventListener('pointerdown', (e) => {
        // Only respond to primary click (left button for mouse, or touch)
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        isPointerDown = true;
        isDragging = false;
        hasMoved = false;

        startX = e.clientX;
        startY = e.clientY;

        const rect = whatsappFloat.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;

        window.addEventListener('pointermove', onPointerMove, { passive: false });
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
    });

    // Prevent link navigation if the user was dragging
    whatsappFloat.addEventListener('click', (e) => {
        if (preventNextClick || hasMoved || isDragging) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

    // Keep button inside screen on window resize or device orientation change
    window.addEventListener('resize', () => {
        if (whatsappFloat.style.left && whatsappFloat.style.left !== 'auto') {
            const rect = whatsappFloat.getBoundingClientRect();
            const padding = 10;
            const maxLeft = window.innerWidth - whatsappFloat.offsetWidth - padding;
            const maxTop = window.innerHeight - whatsappFloat.offsetHeight - padding;

            const clampedLeft = Math.max(padding, Math.min(rect.left, maxLeft));
            const clampedTop = Math.max(padding, Math.min(rect.top, maxTop));

            whatsappFloat.style.left = `${clampedLeft}px`;
            whatsappFloat.style.top = `${clampedTop}px`;
        }
    });
}
