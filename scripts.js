'use strict';

document.addEventListener('DOMContentLoaded', () => {
    /* =====================================================
       1. Theme Toggle Functionality
       ===================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        try {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
            setTheme(currentTheme);

            themeToggleBtn.addEventListener('click', () => {
                const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
                localStorage.setItem('theme', newTheme);
            });
        } catch (error) {
            console.error('Error initializing theme toggle:', error);
            notifyUser('Failed to load theme preferences.', 'error');
        }
    } else {
        console.error('Theme toggle button not found in the DOM.');
    }

    /**
     * Sets the theme of the website
     * @param {string} theme - The theme to set ('light' or 'dark')
     */
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeToggleBtn) {
            themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    /* =====================================================
       2. Responsive Navigation Menu
       ===================================================== */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        try {
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('active');
            });

            // Close menu when a link is clicked (for mobile)
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                });
            });
        } catch (error) {
            console.error('Error initializing navigation menu:', error);
            notifyUser('Failed to load navigation menu.', 'error');
        }
    } else {
        console.error('Navigation toggle button or menu not found in the DOM.');
    }

    /* =====================================================
       3. Three.js 3D Graphics Initialization
       ===================================================== */
    // Initialize Three.js Scene for Hero Section
    function initializeThreeJS() {
        try {
            if (typeof THREE === 'undefined') {
                throw new Error('Three.js library is not loaded.');
            }

            const canvas = document.getElementById('three-canvas');
            if (!canvas) {
                throw new Error('Three.js canvas element with ID "three-canvas" not found.');
            }

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.position.z = 50;

            // Create a rotating AI-themed 3D object (e.g., a torus knot)
            const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
            const material = new THREE.MeshStandardMaterial({ color: 0xff6f3c, metalness: 0.5, roughness: 0.1 });
            const torusKnot = new THREE.Mesh(geometry, material);
            scene.add(torusKnot);

            // Add lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            const pointLight = new THREE.PointLight(0xff6f3c, 1);
            pointLight.position.set(50, 50, 50);
            scene.add(pointLight);

            // Animate the 3D object using requestAnimationFrame
            function animate() {
                requestAnimationFrame(animate);
                torusKnot.rotation.x += 0.01;
                torusKnot.rotation.y += 0.01;
                renderer.render(scene, camera);
            }
            animate();

            // Handle window resize
            window.addEventListener('resize', () => {
                const width = window.innerWidth;
                const height = window.innerHeight;
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            });
        } catch (error) {
            console.error('Error initializing Three.js:', error);
            notifyUser('3D graphics failed to load.', 'error');
        }
    }
    initializeThreeJS();

    /* =====================================================
       4. GSAP Animations with ScrollTrigger
       ===================================================== */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        try {
            gsap.registerPlugin(ScrollTrigger);

            // Animate sections on scroll
            const animateSections = document.querySelectorAll('.animate-section');
            if (animateSections.length > 0) {
                gsap.utils.toArray(animateSections).forEach(section => {
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
            } else {
                console.warn('No elements with class "animate-section" found for GSAP animations.');
            }

            // Staggered animations for service and benefit cards
            const animatedCards = document.querySelectorAll('.service-card, .benefits-list li');
            if (animatedCards.length > 0) {
                gsap.utils.toArray(animatedCards).forEach((card, index) => {
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
            } else {
                console.warn('No service or benefit cards found for GSAP staggered animations.');
            }

            // Animate AI Quotes
            const aiQuotes = document.querySelectorAll('#ai-quotes blockquote');
            if (aiQuotes.length > 0) {
                gsap.utils.toArray(aiQuotes).forEach((quote, index) => {
                    gsap.from(quote, {
                        opacity: 0,
                        y: 20,
                        duration: 1,
                        delay: index * 0.5,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: quote,
                            start: 'top 90%',
                            toggleActions: 'play none none reverse',
                        }
                    });
                });
            } else {
                console.warn('No blockquotes found within #ai-quotes for GSAP animations.');
            }
        } catch (error) {
            console.error('Error initializing GSAP animations:', error);
            notifyUser('Animations failed to load.', 'error');
        }
    } else {
        console.warn('GSAP or ScrollTrigger is not loaded. Animations may not work as expected.');
    }

    /* =====================================================
       5. Lottie Animations Initialization
       ===================================================== */
    /**
     * Initializes Lottie animations for specified containers
     * Ensure that the container IDs and JSON paths are correctly set in the HTML
     */
    function initializeLottieAnimations() {
        try {
            if (typeof lottie !== 'undefined') {
                const lottieContainers = document.querySelectorAll('.lottie-animation');
                if (lottieContainers.length > 0) {
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
                        } else {
                            console.warn('Lottie animation container is missing "data-animation-path" attribute.');
                        }
                    });
                } else {
                    console.warn('No elements with class "lottie-animation" found for Lottie animations.');
                }
            } else {
                throw new Error('Lottie library is not loaded.');
            }
        } catch (error) {
            console.error('Error initializing Lottie animations:', error);
            notifyUser('Animations failed to load.', 'error');
        }
    }
    initializeLottieAnimations();
        /* =====================================================
           6. Particles.js Initialization for Hero Section
           ===================================================== */
       function initializeParticles() {
        try {
            if (typeof particlesJS === 'undefined') {
                throw new Error('Particles.js library is not loaded.');
            }

            const particleContainer = document.getElementById('particles-js');
            if (particleContainer) {
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
                            }
                        },
                        "opacity": {
                            "value": 0.5,
                            "random": false,
                            "anim": {
                                "enable": false,
                                "speed": 1,
                                "opacity_min": 0.1,
                                "sync": false
                            }
                        },
                        "size": {
                            "value": 3,
                            "random": true,
                            "anim": {
                                "enable": false,
                                "speed": 40,
                                "size_min": 0.1,
                                "sync": false
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
                            "speed": 6,
                            "direction": "none",
                            "random": false,
                            "straight": false,
                            "out_mode": "out",
                            "bounce": false,
                            "attract": {
                                "enable": false,
                                "rotateX": 600,
                                "rotateY": 1200
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
                            "grab": {
                                "distance": 400,
                                "line_linked": {
                                    "opacity": 1
                                }
                            },
                            "bubble": {
                                "distance": 400,
                                "size": 40,
                                "duration": 2,
                                "opacity": 8,
                                "speed": 3
                            },
                            "repulse": {
                                "distance": 100,
                                "duration": 0.4
                            },
                            "push": {
                                "particles_nb": 4
                            },
                            "remove": {
                                "particles_nb": 2
                            }
                        }
                    },
                    "retina_detect": true
                });
            } else {
                console.warn('Particle container with ID "particles-js" not found.');
            }
        } catch (error) {
            console.error('Error initializing Particles.js:', error);
            notifyUser('Background effects failed to load.', 'error');
        }
    }
    initializeParticles();
    
        /* =====================================================
           7. Modal Functionality with Enhanced Accessibility
           ===================================================== */
        const modals = document.querySelectorAll('.modal');
        const closeModalButtons = document.querySelectorAll('.modal-close');
        const serviceCards = document.querySelectorAll('.service-card');
        const benefitCards = document.querySelectorAll('.benefits-list li');
    
        // Function to open modal based on card
        function openModalByCard(card) {
            const titleElement = card.querySelector('h3');
            if (!titleElement) {
                console.warn('No <h3> element found within the card to determine modal ID.');
                return;
            }
            const titleText = titleElement.textContent.trim().toLowerCase().replace(/\s+/g, '-');
            const modalId = `${titleText}-modal`;
            const modal = document.getElementById(modalId);
            if (modal) openModal(modal, card);
            else console.warn(`Modal with ID "${modalId}" not found.`);
        }
    
        // Add click and keypress events to service and benefit cards
        [...serviceCards, ...benefitCards].forEach(card => {
            card.setAttribute('tabindex', '0'); // Make focusable
            card.addEventListener('click', () => openModalByCard(card));
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModalByCard(card);
                }
            });
        });
    
        /**
         * Opens the specified modal and manages focus
         * @param {HTMLElement} modal - The modal element to open
         * @param {HTMLElement} triggerElement - The element that triggered the modal
         */
        function openModal(modal, triggerElement) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
            const focusableElements = modal.querySelectorAll('a, button, textarea, input, select');
            const firstFocusableElement = focusableElements[0];
            const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
            function trapTabKey(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) { // Shift + Tab
                        if (document.activeElement === firstFocusableElement) {
                            e.preventDefault();
                            lastFocusableElement.focus();
                        }
                    } else { // Tab
                        if (document.activeElement === lastFocusableElement) {
                            e.preventDefault();
                            firstFocusableElement.focus();
                        }
                    }
                } else if (e.key === 'Escape') {
                    closeModal(modal);
                }
            }
    
            modal.addEventListener('keydown', trapTabKey);
    
            // Store the triggering element to return focus later
            modal.dataset.triggerId = triggerElement.id || '';
            firstFocusableElement.focus();
        }
    
        /**
         * Closes the specified modal and restores focus to the triggering element
         * @param {HTMLElement} modal - The modal element to close
         */
        function closeModal(modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            const triggerId = modal.dataset.triggerId;
            if (triggerId) {
                const triggerElement = document.getElementById(triggerId);
                if (triggerElement) triggerElement.focus();
                delete modal.dataset.triggerId;
            }
        }
    
        // Close Modals on Close Button Click
        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                if (modal) closeModal(modal);
                else console.warn('Close button is not within a modal.');
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
    
        /* =====================================================
           8. Form Validation and User Feedback
           ===================================================== */
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        } else {
            console.warn('Contact form with ID "contact-form" not found.');
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
                errorElement.style.opacity = '1';
            } else {
                console.warn('Error message element not found for the field:', field);
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
                error.style.opacity = '0';
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
            // Simulate an AJAX request delay
            setTimeout(() => {
                // Show success message
                showMessage('Your message has been sent successfully!', 'success');
                // Reset form fields
                contactForm.reset();
            }, 1000);
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
            const mainContent = document.getElementById('main-content') || document.body;
            mainContent.insertBefore(messageContainer, mainContent.firstChild);
    
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
           9. Quote Slider Functionality
           ===================================================== */
        function initializeQuoteSlider() {
            const quotes = document.querySelectorAll('#ai-quotes blockquote');
            if (quotes.length === 0) {
                console.warn('No blockquotes found within #ai-quotes for the quote slider.');
                return;
            }
    
            let currentQuote = 0;
            const totalQuotes = quotes.length;
            const intervalTime = 5000; // 5 seconds
    
            // Initialize first quote
            quotes.forEach((quote, index) => {
                quote.style.opacity = index === 0 ? '1' : '0';
                quote.classList.toggle('active', index === 0);
            });
    
            // Function to show the next quote with fade transition
            function showNextQuote() {
                const prevQuote = quotes[currentQuote];
                prevQuote.classList.remove('active');
                gsap.to(prevQuote, { opacity: 0, duration: 1 });
    
                currentQuote = (currentQuote + 1) % totalQuotes;
                const nextQuote = quotes[currentQuote];
                gsap.to(nextQuote, { opacity: 1, duration: 1 });
                nextQuote.classList.add('active');
            }
    
            // Automatically change quote every interval
            let quoteInterval = setInterval(showNextQuote, intervalTime);
    
            // Pause slider on hover
            const aiQuotesSection = document.getElementById('ai-quotes');
            if (aiQuotesSection) {
                aiQuotesSection.addEventListener('mouseenter', () => clearInterval(quoteInterval));
                aiQuotesSection.addEventListener('mouseleave', () => {
                    quoteInterval = setInterval(showNextQuote, intervalTime);
                });
            }
        }
        initializeQuoteSlider();
    
        /* =====================================================
           10. Back-to-Top Button Functionality
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
        } else {
            console.warn('Back-to-Top button with ID "back-to-top" not found.');
        }
    
        /* =====================================================
           11. Accessibility Enhancements
           ===================================================== */
        // Ensure that all interactive elements are accessible via keyboard
        function ensureAccessibility() {
            const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
            interactiveElements.forEach(element => {
                if (!element.hasAttribute('tabindex')) {
                    element.setAttribute('tabindex', '0');
                }
            });
        }
        ensureAccessibility();
    
        /* =====================================================
           12. Custom Cursor Effect
           ===================================================== */
        function initializeCustomCursor() {
            const cursor = document.createElement('div');
            cursor.id = 'custom-cursor';
            document.body.appendChild(cursor);
    
            cursor.style.position = 'fixed';
            cursor.style.width = '15px';
            cursor.style.height = '15px';
            cursor.style.borderRadius = '50%';
            cursor.style.backgroundColor = 'rgba(255, 111, 60, 0.7)';
            cursor.style.pointerEvents = 'none';
            cursor.style.transition = 'transform 0.1s ease-out';
            cursor.style.zIndex = '9999';
    
            document.addEventListener('mousemove', (e) => {
                cursor.style.transform = `translate(${e.clientX - 7.5}px, ${e.clientY - 7.5}px)`;
            });
    
            // Cursor effects on interactive elements
            const hoverElements = document.querySelectorAll('a, button, .service-card, .benefits-list li');
            hoverElements.forEach(elem => {
                elem.addEventListener('mouseenter', () => {
                    cursor.style.transform += ' scale(1.5)';
                });
                elem.addEventListener('mouseleave', () => {
                    cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
                });
            });
        }
        initializeCustomCursor();
    
        /* =====================================================
           13. Audio Feedback on Button Clicks
           ===================================================== */
        function initializeAudioFeedback() {
            const clickSound = new Audio('assets/sounds/click.mp3'); // Ensure the audio file exists
            const buttons = document.querySelectorAll('button, .btn, .btn-secondary');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    clickSound.currentTime = 0;
                    clickSound.play().catch(error => {
                        console.warn('Audio playback failed:', error);
                    });
                });
            });
        }
        initializeAudioFeedback();
    
        /* =====================================================
           14. Lazy Loading Images
           ===================================================== */
        function initializeLazyLoading() {
            if ('IntersectionObserver' in window) {
                const lazyImages = document.querySelectorAll('img.lazy');
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    });
                });
    
                lazyImages.forEach(img => {
                    imageObserver.observe(img);
                });
            } else {
                // Fallback for browsers without IntersectionObserver
                const lazyImages = document.querySelectorAll('img.lazy');
                lazyImages.forEach(img => {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                });
            }
        }
        initializeLazyLoading();
    
        /* =====================================================
           15. Utility Functions
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
            return function (...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func.apply(this, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    
        /**
         * Notifies the user with a temporary message
         * @param {string} message - The message to display
         * @param {string} type - The type of message ('success' or 'error')
         */
        function notifyUser(message, type) {
            showMessage(message, type);
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
            const mainContent = document.getElementById('main-content') || document.body;
            mainContent.insertBefore(messageContainer, mainContent.firstChild);
    
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
           16. Focus Management for Dynamic Content
           ===================================================== */
        // Ensure that dynamically added content is focusable and accessible
        function observeDynamicContent() {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches('a, button, input, textarea, select')) {
                                node.setAttribute('tabindex', '0');
                            }
                        }
                    });
                });
            });
    
            observer.observe(document.body, { childList: true, subtree: true });
        }
        observeDynamicContent();
    
        /* =====================================================
           17. Remove Console Logs in Production
           ===================================================== */
        // Remove console logs in production environment
        if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            console.log = function () {};
            console.warn = function () {};
            console.error = function () {};
        }
    
    });



