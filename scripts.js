
// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    /* =====================================================
       1. Theme Toggle Functionality
       ===================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(currentTheme);
    
    themeToggleBtn.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    /**
     * Sets the theme of the website
     * @param {string} theme - The theme to set ('light' or 'dark')
     */
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        themeToggleBtn.innerHTML = theme === 'dark' 
            ? '<i class="fas fa-sun"></i>' // Use the Font Awesome sun icon for light mode
            : '<i class="fas fa-moon"></i>'; // Use the Font Awesome moon icon for dark mode
    }
    
    
    /* =====================================================
       2. Responsive Navigation Menu
       ===================================================== */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });
    
    // Close menu when a link is clicked (for mobile)
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    /* =====================================================
       3. GSAP Animations with ScrollTrigger
       ===================================================== */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Animate sections on scroll
        gsap.utils.toArray('.animate-section').forEach(section => {
            gsap.from(section, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                }
            });
        });
    
        // Staggered animations for service and benefit cards
        gsap.utils.toArray('.service-card, .benefits-list li').forEach((card, index) => {
            gsap.from(card, {
                opacity: 0,
                scale: 0.9,
                duration: 1,
                delay: index * 0.2,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                }
            });
        });
    }
    
    /* =====================================================
       4. VanillaTilt.js Initialization
       ===================================================== */
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.glass-card, .service-card'), {
            max: 25,
            speed: 400,
            glare: true,
            "max-glare": 0.3,
            scale: 1.05,
            transition: true,
        });
    }
    
    /* =====================================================
       5. Accordion Functionality
       ===================================================== */
    const accordionButtons = document.querySelectorAll('.accordion-button');

    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            
            // Close all accordion items
            accordionButtons.forEach(btn => {
                btn.setAttribute('aria-expanded', 'false');
                btn.nextElementSibling.style.maxHeight = null;
            });
            
            // Toggle the clicked accordion
            if (!isExpanded) {
                button.setAttribute('aria-expanded', 'true');
                const accordionContent = button.nextElementSibling;
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            }
        });

        // Accessibility: Allow toggling accordion with keyboard
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
    
    /* =====================================================
  /* =====================================================
   6. Service and Benefit Cards Interactivity
   ===================================================== */
    const serviceCards = document.querySelectorAll('.service-card');
    const benefitCards = document.querySelectorAll('.benefits-list li');

    // Function to open modal based on card
    function openModalByCard(card) {
        const titleText = card.querySelector('h3').textContent.trim();
        const modalId = `${titleText.toLowerCase().replace(/\s+/g, '')}-modal`; // Use template literals for modalId
        const modal = document.getElementById(modalId);
        if (modal) openModal(modal, card);
    }

    // Add click event to service and benefit cards
    serviceCards.forEach(card => {
        card.addEventListener('click', () => openModalByCard(card));
        card.setAttribute('tabindex', '0'); // Make focusable
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModalByCard(card);
            }
        });
    });

    benefitCards.forEach(card => {
        card.addEventListener('click', () => openModalByCard(card));
        card.setAttribute('tabindex', '0'); // Make focusable
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModalByCard(card);
            }
        });
    });

    /* =====================================================
    7. Modal Functionality with Enhanced Accessibility
    ===================================================== */
    const modals = document.querySelectorAll('.modal');
    const closeModalButtons = document.querySelectorAll('.modal-close');

    // Open Modal Function
    function openModal(modal, triggerElement) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.setAttribute('tabindex', '-1');
            modalContent.focus();
        }
        // Store the triggering element to return focus later
        modal.dataset.triggerId = triggerElement.id || '';
        // Add event listener to trap focus within modal
        document.addEventListener('focus', trapFocus, true);
    }

    // Close Modal Function
    function closeModal(modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        const triggerId = modal.dataset.triggerId;
        if (triggerId) {
            const triggerElement = document.querySelector(`[data-trigger-id="${triggerId}"]`) || document.getElementById(triggerId); // Corrected selector syntax
            if (triggerElement) triggerElement.focus();
            delete modal.dataset.triggerId;
        }
        // Remove focus trap
        document.removeEventListener('focus', trapFocus, true);
    }

    // Close Modals on Close Button Click
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) closeModal(modal);
        });
    });

    // Close Modals on Click Outside Content
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

  // Close All Modals on Escape Key Press
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modals.forEach(modal => {
            if (modal.classList.contains('active')) {
                closeModal(modal);
            }
        });
    }
});

/**
 * Traps focus within the currently open modal
 * @param {FocusEvent} e - The focus event
 */
function trapFocus(e) {
    modals.forEach(modal => {
        if (modal.classList.contains('active')) {
            if (!modal.contains(e.target)) {
                e.stopPropagation();
                modal.querySelector('.modal-content').focus();
            }
        }
    });
}

/* =====================================================
   8. Back-to-Top Button Functionality
   ===================================================== */
const backToTopButton = document.getElementById('back-to-top');

if (backToTopButton) {
    // Show or Hide Back-to-Top Button based on scroll position
    window.addEventListener('scroll', debounce(() => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }, 100));

    // Scroll smoothly to the top when Back-to-Top Button is clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* =====================================================
   9. Smooth Scrolling for Anchor Links
   ===================================================== */
const internalLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            e.preventDefault();
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 0;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Update URL hash without default jump
            history.pushState(null, null, `#${targetId}`); // Corrected syntax
        }
    });
});


    /* =====================================================
       10. Form Validation and User Feedback
       ===================================================== */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    /**
     * Handles form submission with validation and user feedback
     * @param {Event} e - The submit event
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        const name = contactForm.querySelector('#name');
        const email = contactForm.querySelector('#email');
        const subject = contactForm.querySelector('#subject');
        const message = contactForm.querySelector('#message');
        let isValid = true;

        // Clear previous errors
        clearErrors(contactForm);

        // Validate Name
        if (!name.value.trim()) {
            showError(name, 'Please enter your name.');
            isValid = false;
        }

        // Validate Email
        if (!email.value.trim()) {
            showError(email, 'Please enter your email.');
            isValid = false;
        } else if (!validateEmail(email.value.trim())) {
            showError(email, 'Please enter a valid email address.');
            isValid = false;
        }

        // Validate Subject
        if (!subject.value.trim()) {
            showError(subject, 'Please enter a subject.');
            isValid = false;
        }

        // Validate Message
        if (!message.value.trim()) {
            showError(message, 'Please enter your message.');
            isValid = false;
        }

        if (isValid) {
            // Simulate form submission (e.g., AJAX request)
            simulateFormSubmission();
        }
    }

    /**
     * Displays an error message for a specific form field
     * @param {HTMLElement} field - The form field element
     * @param {string} message - The error message to display
     */
    function showError(field, message) {
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.setAttribute('aria-live', 'assertive');
        }
        field.classList.add('invalid');
        // Shake animation for error feedback using GSAP
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(field, { x: -10 }, { x: 10, duration: 0.1, repeat: 4, yoyo: true });
        }
    }

    /**
     * Clears all error messages and invalid classes from the form
     * @param {HTMLFormElement} form - The form element
     */
    function clearErrors(form) {
        form.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
            error.removeAttribute('aria-live');
        });
        form.querySelectorAll('.invalid').forEach(field => field.classList.remove('invalid'));
    }

    /**
     * Validates an email address using a regular expression
     * @param {string} email - The email address to validate
     * @returns {boolean} - Returns true if valid, false otherwise
     */
    function validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    /**
     * Simulates form submission and provides user feedback
     */
    function simulateFormSubmission() {
        // Show success message
        showMessage('Your message has been sent successfully!', 'success');
        // Reset form fields
        contactForm.reset();
    }

    /**
     * Displays a temporary message to the user
     * @param {string} message - The message to display
     * @param {string} type - The type of message ('success' or 'error')
     */
    function showMessage(message, type) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message', type);
        messageContainer.setAttribute('role', 'alert');
        messageContainer.textContent = message;

        // Insert message at the top of the main content
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.insertBefore(messageContainer, mainContent.firstChild);
        } else {
            document.body.insertBefore(messageContainer, document.body.firstChild);
        }

        // Animate the message appearance using GSAP
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(messageContainer, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 });
        }

        // Automatically remove the message after 5 seconds with fade out
        setTimeout(() => {
            if (typeof gsap !== 'undefined') {
                gsap.to(messageContainer, {
                    opacity: 0,
                    y: -20,
                    duration: 0.5,
                    onComplete: () => {
                        if (messageContainer && messageContainer.parentElement) {
                            messageContainer.parentElement.removeChild(messageContainer);
                        }
                    }
                });
            } else {
                // Fallback if GSAP is not available
                messageContainer.remove();
            }
        }, 5000);
    }

    /* =====================================================
       11. Lottie Animations Initialization
       ===================================================== */
    /**
     * Initializes Lottie animations for specified containers
     * Ensure that the container IDs and JSON paths are correctly set in the HTML
     */
    function initializeLottieAnimations() {
        if (typeof lottie !== 'undefined') {
            const lottieContainers = document.querySelectorAll('.lottie-animation');
            lottieContainers.forEach(container => {
                const animationPath = container.getAttribute('data-animation-path');
                if (animationPath) {
                    lottie.loadAnimation({
                        container: container, // the dom element
                        renderer: 'svg',
                        loop: true,
                        autoplay: true,
                        path: animationPath // the path to the animation json
                    });
                }
            });
        } else {
            console.warn('Lottie is not loaded. Please include the Lottie library for animations.');
        }
    }
    initializeLottieAnimations();

    /* =====================================================
       12. Particles.js Initialization for Hero Section
       ===================================================== */
    /**
     * Initializes Particles.js for the hero banner
     * Ensures particles and interactivity are correctly set up
     */
    function initializeHeroParticles() {
        const particleContainer = document.getElementById('particles-js');
        if (typeof particlesJS !== 'undefined' && particleContainer) {
            particlesJS('particles-js', {
                "particles": {
                    "number": {
                        "value": 80,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#FF6F3C"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        },
                    },
                    "opacity": {
                        "value": 0.5,
                        "random": false,
                        "anim": {
                            "enable": false
                        }
                    },
                    "size": {
                        "value": 3,
                        "random": true,
                        "anim": {
                            "enable": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": "#FF6F3C",
                        "opacity": 0.4,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 3,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "repulse"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "repulse": {
                            "distance": 100,
                            "duration": 0.4
                        },
                        "push": {
                            "particles_nb": 4
                        }
                    }
                },
                "retina_detect": true
            });
        } else if (particleContainer) {
            console.warn('Particles.js is not loaded. Please include the Particles.js library for the hero background.');
        }
    }
    initializeHeroParticles();

    /* =====================================================
       13. Enhanced Tooltip Accessibility
       ===================================================== */
    /**
     * Ensures tooltips are accessible via keyboard and screen readers
     * Tooltips are primarily handled via CSS, but additional JS can be added for enhanced accessibility if needed
     */

    /* =====================================================
       14. Additional Event Listeners and Features
       ===================================================== */
    /**
     * Placeholder for any additional event listeners or features
     * Future enhancements can be added here
     */

    /* =====================================================
       15. Initialize Custom Scripts or Plugins
       ===================================================== */
    /**
     * Any custom scripts or third-party plugins can be initialized here
     */

    /* =====================================================
       16. Focus Management for Dynamic Content
       ===================================================== */
    /**
     * Ensures that dynamic content like modals or tooltips manage focus appropriately
     * This can include returning focus to the triggering element after closing a modal
     * or managing focus within tooltips
     */

    /* =====================================================
       17. Logging and Debugging Tools
       ===================================================== */
    /**
     * Incorporate logging or debugging tools during development
     * Remove or disable in production to enhance performance
     */
});

/* =====================================================
   18. Utility Functions
   ===================================================== */

/**
 * Debounce function to limit the rate at which a function can fire.
 * Useful for optimizing scroll and resize event listeners.
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce interval in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(func, wait = 20) {
    let timeout;
    return function(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}