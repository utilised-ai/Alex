// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add active class to nav links based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    function highlightNavLink() {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        // If at the top of the page, highlight home
        if (scrollPosition < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#') {
                    link.classList.add('active');
                }
            });
        }
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    // Initialize the active link on page load
    highlightNavLink();
    
    // Add animation to adventure cards when they come into view
    const adventureCards = document.querySelectorAll('.adventure-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'perspective(1000px) rotateY(0deg) translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    adventureCards.forEach((card, index) => {
        card.style.opacity = 0;
        card.style.transform = 'perspective(1000px) rotateY(20deg) translateY(50px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            if (scrollPosition < 600) {
                hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
            }
        });
    }

    // Add sparkle effect to buttons
    const buttons = document.querySelectorAll('.btn, .btn-small');
    buttons.forEach(button => {
        button.addEventListener('mouseover', function() {
            this.style.boxShadow = '0 0 15px var(--primary-color)';
            
            // Create sparkle animation
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.position = 'absolute';
            sparkle.style.width = '100%';
            sparkle.style.height = '100%';
            sparkle.style.top = '0';
            sparkle.style.left = '0';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)';
            sparkle.style.opacity = '0';
            sparkle.style.transition = 'opacity 0.3s ease';
            
            this.appendChild(sparkle);
            setTimeout(() => {
                sparkle.style.opacity = '0.5';
                setTimeout(() => {
                    sparkle.remove();
                }, 300);
            }, 10);
        });
        
        button.addEventListener('mouseout', function() {
            this.style.boxShadow = '';
        });
    });

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero h2');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                // Add a heart at the end
                const heart = document.createElement('span');
                heart.innerHTML = ' ❤️';
                heart.style.fontSize = '0.8em';
                heart.style.animation = 'pulse 1.5s infinite';
                heroTitle.appendChild(heart);
                
                // Add the keyframes to the document
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.2); }
                        100% { transform: scale(1); }
                    }
                `;
                document.head.appendChild(style);
            }
        };
        
        // Start the typing effect after a short delay
        setTimeout(typeWriter, 500);
    }

    // Add floating animation to logo
    const logo = document.querySelector('.logo h1');
    if (logo) {
        logo.style.animation = 'float 3s ease-in-out infinite';
        
        // Add the keyframes to the document
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
                100% { transform: translateY(0px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add rainbow text effect to the tagline
    const tagline = document.querySelector('.tagline');
    if (tagline) {
        const text = tagline.textContent;
        tagline.textContent = '';
        
        // Create a wrapper for the rainbow text
        const wrapper = document.createElement('span');
        wrapper.className = 'rainbow-text';
        tagline.appendChild(wrapper);
        
        // Add each letter with a different color
        for (let i = 0; i < text.length; i++) {
            const letter = document.createElement('span');
            letter.textContent = text[i];
            letter.style.animationDelay = `${i * 0.1}s`;
            letter.style.animation = 'rainbow 3s infinite';
            wrapper.appendChild(letter);
        }
        
        // Add the keyframes to the document
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { color: var(--primary-color); }
                33% { color: var(--secondary-color); }
                66% { color: var(--accent-color); }
                100% { color: var(--primary-color); }
            }
        `;
        document.head.appendChild(style);
    }
}); 