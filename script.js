// DOM Content Loaded - Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initTestimonialSlider();
    initContactForm();
    initScrollAnimations();
    initSmoothScrolling();
    initLoadingAnimations();
    initAccessibility();
    initImageErrorHandling();
    enhanceFloatingCards();
    initParallaxEffect();
    
    // Console welcome message
    console.log('🎨 EB Studios Website loaded successfully! 🚀');
});

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Check if required elements exist
    if (!navbar || !hamburger || !navMenu) {
        console.warn('Navigation elements not found');
        return;
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active nav link highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Testimonial slider functionality - with null checks
function initTestimonialSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const navDots = document.querySelectorAll('.nav-dot');
    
    // Check if testimonial elements exist (they might be commented out)
    if (testimonialCards.length === 0 || navDots.length === 0) {
        console.log('Testimonial elements not found - skipping testimonial slider initialization');
        return;
    }
    
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        // Hide all cards
        testimonialCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Remove active class from all dots
        navDots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Show current card and activate dot
        if (testimonialCards[index]) {
            testimonialCards[index].classList.add('active');
        }
        if (navDots[index]) {
            navDots[index].classList.add('active');
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonialCards.length;
        showSlide(currentSlide);
    }

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    // Initialize first slide
    showSlide(0);

    // Add click event to navigation dots
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            stopAutoSlide();
            startAutoSlide(); // Restart auto-slide
        });
    });

    // Start automatic sliding
    startAutoSlide();

    // Pause auto-slide on hover
    const testimonialSlider = document.querySelector('.testimonials-slider');
    if (testimonialSlider) {
        testimonialSlider.addEventListener('mouseenter', stopAutoSlide);
        testimonialSlider.addEventListener('mouseleave', startAutoSlide);
    }
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.warn('Contact form not found');
        return;
    }

    // Initialize EmailJS with proper error handling
    try {
        if (typeof emailjs !== 'undefined') {
            emailjs.init("Y6paP4GjU1pLC0PfE");
        } else {
            console.error('EmailJS library not loaded');
            return;
        }
    } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
        return;
    }
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formObject = {};
        
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        // Validate form
        if (validateForm(formObject)) {
            // Show loading message
            showFormMessage('Sending your message...', 'loading');
            
            // Send email using EmailJS
            sendEmail(formObject);
        }
    });

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Send email using EmailJS
function sendEmail(formData) {
    // Check if EmailJS is available
    if (typeof emailjs === 'undefined') {
        showFormMessage('Email service is not available. Please contact us directly at edy.belingher@gmail.com', 'error');
        return;
    }

    // Prepare template parameters for EmailJS
    const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        company: formData.company || 'Not specified',
        project_type: formData.project,
        budget_range: formData.budget,
        message: formData.message,
        to_email: 'edy.belingher@gmail.com'
    };
    
    // Use your actual EmailJS Service ID and Template ID
    const serviceConfigs = [
        { serviceId: 'service_syekurr', templateId: 'template_3afo6aa' }
    ];
    
    async function tryEmailService(configIndex = 0) {
        if (configIndex >= serviceConfigs.length) {
            // All service attempts failed, show fallback message
            showFormMessage('Unable to send email automatically. Please contact us directly at edy.belingher@gmail.com or call 0204 169 0307', 'error');
            return;
        }
        
        const config = serviceConfigs[configIndex];
        
        try {
            const response = await emailjs.send(config.serviceId, config.templateId, templateParams);
            console.log('Email sent successfully:', response);
            showFormMessage('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
            const form = document.getElementById('contactForm');
            if (form) {
                form.reset();
            }
        } catch (error) {
            console.warn(`EmailJS service ${config.serviceId} failed:`, error);
            
            // If this was a 404 error, try the next configuration
            if (error.status === 404 || error.text === 'Account not found') {
                tryEmailService(configIndex + 1);
            } else {
                // For other errors, show the fallback message
                showFormMessage('Unable to send email automatically. Please contact us directly at edy.belingher@gmail.com or call 0204 169 0307', 'error');
            }
        }
    }
    
    // Start trying email services
    tryEmailService();
}

function validateForm(data) {
    let isValid = true;

    // Clear previous errors
    clearAllErrors();

    // Validate required fields
    if (!data.name || data.name.trim().length < 2) {
        showFieldError('name', 'Please enter a valid name (at least 2 characters)');
        isValid = false;
    }

    if (!data.email || !isValidEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }

    if (!data.project) {
        showFieldError('project', 'Please select a project type');
        isValid = false;
    }

    if (!data.budget) {
        showFieldError('budget', 'Please select a budget range');
        isValid = false;
    }

    if (!data.message || data.message.trim().length < 10) {
        showFieldError('message', 'Please provide more details about your project (at least 10 characters)');
        isValid = false;
    }

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;

    clearFieldError(field);

    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                showFieldError(fieldName, 'Name must be at least 2 characters long');
                return false;
            }
            break;
        case 'email':
            if (!isValidEmail(value)) {
                showFieldError(fieldName, 'Please enter a valid email address');
                return false;
            }
            break;
        case 'message':
            if (value.length < 10) {
                showFieldError(fieldName, 'Please provide more details (at least 10 characters)');
                return false;
            }
            break;
    }
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    // Remove existing error
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add error class to field
    field.classList.add('error');

    // Create and add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '0.9rem';
    errorElement.style.marginTop = '0.5rem';
    
    formGroup.appendChild(errorElement);
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    const errorMessage = formGroup.querySelector('.error-message');
    
    if (errorMessage) {
        errorMessage.remove();
    }
    
    field.classList.remove('error');
}

function clearAllErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    const errorFields = document.querySelectorAll('.error');
    
    errorMessages.forEach(error => error.remove());
    errorFields.forEach(field => field.classList.remove('error'));
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Style the message
    messageElement.style.padding = '1rem';
    messageElement.style.borderRadius = '8px';
    messageElement.style.marginBottom = '1rem';
    messageElement.style.fontWeight = '500';
    
    if (type === 'success') {
        messageElement.style.backgroundColor = '#d4edda';
        messageElement.style.color = '#155724';
        messageElement.style.border = '1px solid #c3e6cb';
    } else if (type === 'loading') {
        messageElement.style.backgroundColor = '#d1ecf1';
        messageElement.style.color = '#0c5460';
        messageElement.style.border = '1px solid #bee5eb';
    } else {
        messageElement.style.backgroundColor = '#f8d7da';
        messageElement.style.color = '#721c24';
        messageElement.style.border = '1px solid #f5c6cb';
    }

    // Insert message at the top of the form
    const form = document.getElementById('contactForm');
    if (form) {
        form.insertBefore(messageElement, form.firstChild);
    }

    // Auto-remove success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .contact-info, .contact-form-container');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Loading animations
function initLoadingAnimations() {
    // Add loading class to animated elements
    const animatedElements = document.querySelectorAll('.hero-content, .hero-visual, .service-card');
    
    animatedElements.forEach((el, index) => {
        el.classList.add('loading');
        el.style.animationDelay = `${index * 0.1}s`;
    });
}

// Floating cards animation enhancement
function enhanceFloatingCards() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        // Add mouse interaction
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.transition = '';
        });
    });
}

// Parallax effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Scroll-based animations can be added here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Accessibility improvements
function initAccessibility() {
    // Add keyboard navigation for testimonial slider
    const navDots = document.querySelectorAll('.nav-dot');
    
    navDots.forEach((dot, index) => {
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('role', 'button');
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        
        dot.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Add focus indicators
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-color)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

// Error handling for images
function initImageErrorHandling() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Create a placeholder if image fails to load
            this.style.backgroundColor = '#f0f0f0';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.alt = 'Image not available';
        });
    });
}
