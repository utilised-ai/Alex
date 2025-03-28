// ========================================
// Core Application Logic (Shared)
// ========================================

/**
 * Initializes core UI enhancements and interactions.
 * @param {object} config - Configuration object for theme-specific settings.
 * @param {string} config.themeName - Name of the current theme ('blasters' or 'stars').
 * @param {string} [config.heroTitleSelector='.hero h2'] - Selector for the hero title element.
 * @param {string} [config.logoSelector='.logo h1'] - Selector for the logo element.
 * @param {string} [config.navLinkSelector='nav ul li a'] - Selector for navigation links.
 * @param {string} [config.sectionSelector='section[id]'] - Selector for content sections with IDs.
 * @param {string} [config.contentCardSelector='.content-card'] - Selector for game/adventure cards.
 * @param {string} [config.buttonSelector='.btn, .btn-small'] - Selector for buttons.
 * @param {string} [config.heroSelector='.hero'] - Selector for the hero section.
 * @param {string} [config.taglineSelector='.tagline'] - Selector for the tagline element.
 * @param {number} [config.headerOffset=80] - Offset for smooth scrolling to account for sticky header.
 */
function initializeCoreApp(config = {}) {
    const defaults = {
        themeName: 'default',
        heroTitleSelector: '.hero h2',
        logoSelector: '.logo h1',
        navLinkSelector: 'nav ul li a',
        sectionSelector: 'section[id]',
        contentCardSelector: '.content-card',
        buttonSelector: '.btn, .btn-small',
        heroSelector: '.hero',
        taglineSelector: '.tagline',
        headerOffset: 80
    };
    // Merge defaults with provided config
    const settings = { ...defaults, ...config };

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Avoid scrolling for '#' links

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - settings.headerOffset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Active Nav Link Highlighting ---
    const sections = document.querySelectorAll(settings.sectionSelector);
    const navLinks = document.querySelectorAll(settings.navLinkSelector);

    function highlightNavLink() {
        const scrollPosition = window.scrollY;

        let currentSectionId = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - settings.headerOffset - 20; // Adjusted offset
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            // Highlight if href matches current section or if at top and href is '#'
            if ((linkHref === `#${currentSectionId}`) || (scrollPosition < settings.headerOffset && linkHref === '#')) {
                 link.classList.add('active');
            }
        });
         // Fallback if no section is active (e.g., bottom of page)
        if (!document.querySelector(settings.navLinkSelector + '.active') && navLinks.length > 0) {
             // Potentially highlight the last link or based on other logic if needed
        }
    }

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', highlightNavLink);
        highlightNavLink(); // Initial call
    }

    // --- Content Card Animation ---
    const contentCards = document.querySelectorAll(settings.contentCardSelector);
    if (contentCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'perspective(1000px) rotateY(0deg) translateY(0)';
                    observer.unobserve(entry.target); // Optional: stop observing once animated
                }
            });
        }, { threshold: 0.1 });

        contentCards.forEach((card, index) => {
            card.style.opacity = 0;
            card.style.transform = 'perspective(1000px) rotateY(20deg) translateY(50px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    }

    // --- Hero Parallax Effect ---
    const hero = document.querySelector(settings.heroSelector);
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            // Apply parallax only when hero is potentially visible
            if (scrollPosition < window.innerHeight) {
                // Check if background-image is set before trying to change position
                const currentBgImage = window.getComputedStyle(hero).backgroundImage;
                if (currentBgImage && currentBgImage !== 'none') {
                   hero.style.backgroundPosition = `center ${scrollPosition * 0.4}px`; // Adjusted multiplier
                }
            }
        });
    }

    // --- Button Hover Effects ---
    const buttons = document.querySelectorAll(settings.buttonSelector);
    buttons.forEach(button => {
        button.addEventListener('mouseover', function() {
            if (settings.themeName === 'stars') {
                // Stars Sparkle Effect
                this.style.boxShadow = `0 0 15px var(--color-primary)`; // Use theme color
                const sparkle = document.createElement('div');
                sparkle.style.cssText = `
                    position: absolute; width: 100%; height: 100%; top: 0; left: 0;
                    pointer-events: none; border-radius: inherit;
                    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%);
                    opacity: 0; transition: opacity 0.3s ease; z-index: 1;
                `;
                this.appendChild(sparkle);
                // Trigger transition
                requestAnimationFrame(() => {
                    sparkle.style.opacity = '0.6';
                    setTimeout(() => sparkle.remove(), 300);
                });
            } else {
                // Default/Blasters Glow Effect
                this.style.boxShadow = `0 0 15px var(--color-accent)`; // Use theme color
            }
        });

        button.addEventListener('mouseout', function() {
            this.style.boxShadow = ''; // Reset on mouseout
        });
    });

    // --- Hero Title Typing Effect ---
    const heroTitle = document.querySelector(settings.heroTitleSelector);
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = ''; // Clear existing text
        let i = 0;

        const typeWriter = () => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 60); // Slightly slower typing
            } else {
                // Theme-specific additions after typing finishes
                if (settings.themeName === 'stars') {
                    addStarsHeart(heroTitle);
                }
                // Add other theme callbacks here if needed
            }
        };

        // Start after a delay
        setTimeout(typeWriter, 500);
    }

    // --- Logo Floating Animation ---
    const logo = document.querySelector(settings.logoSelector);
    if (logo) {
        const animationName = 'coreFloat';
        logo.style.animation = `${animationName} 3s ease-in-out infinite`;

        // Inject keyframes if not already present
        if (!document.getElementById('core-animations')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'core-animations';
            styleSheet.textContent = `
                @keyframes ${animationName} {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); } /* Slightly less float */
                }
                @keyframes corePulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }

     // --- Stars Theme Specific: Rainbow Tagline ---
     if (settings.themeName === 'stars') {
        addStarsRainbowTagline(settings.taglineSelector);
     }

} // End of initializeCoreApp

// --- Helper function for Stars Heart ---
function addStarsHeart(element) {
    const heart = document.createElement('span');
    heart.innerHTML = ' ❤️'; // Add space before heart
    heart.style.fontSize = '0.8em'; // Relative size
    heart.style.display = 'inline-block'; // Needed for transform
    heart.style.animation = 'corePulse 1.5s infinite';
    element.appendChild(heart);
}

// --- Helper function for Stars Rainbow Tagline ---
function addStarsRainbowTagline(selector) {
    const tagline = document.querySelector(selector);
    if (tagline) {
        const text = tagline.textContent;
        tagline.textContent = ''; // Clear original text

        const wrapper = document.createElement('span');
        tagline.appendChild(wrapper);

        const colors = ['--color-primary', '--color-secondary', '--color-accent', '--color-accent-dark'];
        let colorIndex = 0;

        for (let i = 0; i < text.length; i++) {
            if (text[i] === ' ') { // Keep spaces as normal characters
                 wrapper.appendChild(document.createTextNode(' '));
                 continue;
            }
            const letter = document.createElement('span');
            letter.textContent = text[i];
            // Apply color directly, could also use animation like before
            letter.style.color = `var(${colors[colorIndex % colors.length]})`;
            letter.style.display = 'inline-block'; // For potential future animation
            // letter.style.animation = 'rainbow 3s infinite'; // Alternative: use animation
            // letter.style.animationDelay = `${i * 0.05}s`;
            wrapper.appendChild(letter);
            colorIndex++;
        }
         // Inject rainbow keyframes if using animation method
         /*
         if (!document.getElementById('rainbow-keyframes')) {
             const style = document.createElement('style');
             style.id = 'rainbow-keyframes';
             style.textContent = `@keyframes rainbow { ... }`; // Define keyframes
             document.head.appendChild(style);
         }
         */
    }
}

// Example Usage (This would go in the main HTML file or a theme-specific loader)
// document.addEventListener('DOMContentLoaded', () => {
//     // Determine theme (e.g., from body class, URL param, etc.)
//     const currentTheme = document.body.dataset.theme || 'blasters'; // Example
//     initializeCoreApp({ themeName: currentTheme });
// });