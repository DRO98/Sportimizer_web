// ========== CONFIGURATION ==========
const CONFIG = {
    demoUrl: '#contact', // Redirige a contacto por ahora
    signupUrl: '#contact', // Redirige a contacto por ahora
    loginUrl: '/login', // Cambia esto a tu URL de login real
    appUrl: '/', // Cambia esto a tu URL de la app real
    contactEmail: 'info@sportimizer.com',
    contactPhone: '+34 900 123 456',
    // API URL: usar URL absoluta para desarrollo, relativa para producción
    apiUrl: window.location.protocol === 'file:' 
        ? 'http://127.0.0.1:8000' 
        : ''  // En producción usará el mismo dominio
};

// ========== SMOOTH SCROLLING ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Cerrar menú móvil si está abierto
            closeMobileMenu();
        }
    });
});

// ========== NAVBAR SCROLL EFFECT ==========
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ========== MOBILE MENU TOGGLE ==========
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

function closeMobileMenu() {
    if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger?.classList.remove('active');
        
        const spans = hamburger?.querySelectorAll('span');
        if (spans) {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
}

hamburger?.addEventListener('click', () => {
    navLinks?.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = hamburger.querySelectorAll('span');
    if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// ========== SCROLL ANIMATIONS ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .module-item, .pricing-card');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
});

// ========== STATS COUNTER ANIMATION ==========
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Trigger counter animation on scroll
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const statNumbers = document.querySelectorAll('.stat-number');
            
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                
                if (!isNaN(number)) {
                    stat.textContent = '0';
                    setTimeout(() => {
                        animateCounter(stat, number, 1500);
                        
                        // Add back the suffix
                        const checkInterval = setInterval(() => {
                            const currentValue = parseInt(stat.textContent);
                            if (currentValue === number) {
                                if (text.includes('+')) {
                                    stat.textContent = text;
                                } else if (text.includes('%')) {
                                    stat.textContent = number + '%';
                                } else if (text.includes('K')) {
                                    stat.textContent = (number / 1000).toFixed(0) + 'K+';
                                }
                                clearInterval(checkInterval);
                            }
                        }, 100);
                    }, 200);
                }
            });
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ========== BUTTON HANDLERS ==========

// Función para mostrar modal de información
function showModal(title, message) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary modal-ok">Entendido</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Mostrar modal con animación
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Cerrar modal
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-ok').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Función para scroll suave a sección
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeMobileMenu();
    }
}

// ========== CTA BUTTONS (NAVBAR) ==========
document.querySelector('.navbar .cta-button')?.addEventListener('click', () => {
    scrollToSection('#contact');
    showModal(
        '¡Comienza tu prueba gratuita!',
        'Completa el formulario de contacto y te enviaremos las credenciales de acceso para tu prueba de 14 días sin compromiso.'
    );
});

// ========== HERO BUTTONS ==========
document.querySelectorAll('.hero-buttons .btn-primary').forEach(btn => {
    btn.addEventListener('click', () => {
        scrollToSection('#contact');
        showModal(
            'Bienvenido a Sportimizer',
            '¡Estamos emocionados de que quieras unirte! Completa el formulario y nuestro equipo te contactará en menos de 24 horas.'
        );
    });
});

document.querySelectorAll('.hero-buttons .btn-secondary').forEach(btn => {
    btn.addEventListener('click', () => {
        scrollToSection('#features');
        showModal(
            'Demo de Sportimizer ERP',
            'Explora todas nuestras características navegando por esta página. Para una demo personalizada, contáctanos a través del formulario.'
        );
    });
});

// ========== PRICING BUTTONS ==========
document.querySelectorAll('.pricing-button').forEach((btn, index) => {
    btn.addEventListener('click', function() {
        const planName = this.closest('.pricing-card').querySelector('h3').textContent;
        const isEnterprise = planName === 'Enterprise';
        
        if (isEnterprise) {
            scrollToSection('#contact');
            showModal(
                'Plan Enterprise',
                'Para el plan Enterprise, nos pondremos en contacto contigo para crear una solución personalizada según las necesidades de tu club. Por favor, completa el formulario de contacto.'
            );
        } else {
            scrollToSection('#contact');
            showModal(
                `Plan ${planName}`,
                `Has seleccionado el plan ${planName}. Completa el formulario de contacto y te enviaremos la información de pago y acceso.`
            );
        }
    });
});

// ========== FORM HANDLING ==========
const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = {
        nombre: formData.get('nombre') || contactForm.querySelector('input[type="text"]').value,
        email: formData.get('email') || contactForm.querySelector('input[type="email"]').value,
        club: formData.get('club') || contactForm.querySelectorAll('input[type="text"]')[1]?.value || '',
        mensaje: formData.get('mensaje') || contactForm.querySelector('textarea').value
    };
    
    // Validación básica
    if (!data.nombre || !data.email || !data.mensaje) {
        showModal('Error', 'Por favor completa todos los campos requeridos.');
        return;
    }
    
    // Show loading state
    const button = contactForm.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    button.textContent = 'Enviando...';
    button.disabled = true;
    
    try {
        // Llamada real a la API de Django
        const response = await fetch(`${CONFIG.apiUrl}/api/landing/contact/`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            button.textContent = '✓ Mensaje Enviado';
            button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            
            // Reset form
            contactForm.reset();
            
            // Mostrar mensaje de éxito
            showModal(
                '¡Mensaje Enviado!',
                result.message || `Gracias ${data.nombre}, hemos recibido tu mensaje. Nuestro equipo se pondrá en contacto contigo en las próximas 24 horas.`
            );
            
            // Reset button after 3 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
                button.disabled = false;
            }, 3000);
        } else {
            // Error en la respuesta
            throw new Error(result.error || 'Error al enviar el mensaje');
        }
        
    } catch (error) {
        console.error('Error:', error);
        button.textContent = originalText;
        button.disabled = false;
        showModal(
            'Error',
            error.message || 'Hubo un problema al enviar tu mensaje. Por favor, intenta de nuevo o contáctanos directamente al ' + CONFIG.contactEmail
        );
    }
});

// ========== PRICING CARD INTERACTIONS ==========
const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        if (this.classList.contains('featured')) {
            this.style.transform = 'scale(1.05)';
        } else {
            this.style.transform = 'scale(1)';
        }
    });
});

// ========== PARALLAX EFFECT FOR HERO CIRCLES ==========
document.addEventListener('mousemove', (e) => {
    const circles = document.querySelectorAll('.circle');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    circles.forEach((circle, index) => {
        const speed = (index + 1) * 0.5;
        const x = (mouseX - 0.5) * speed * 50;
        const y = (mouseY - 0.5) * speed * 50;
        
        circle.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ========== FEATURE CARDS TILT EFFECT ==========
const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', resetTilt);
});

function handleTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
}

function resetTilt(e) {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
}

// ========== LOADING ANIMATION ==========
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-title, .hero-description, .hero-buttons, .hero-stats');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
});

// ========== PHONE MOCKUP INTERACTION ==========
const phoneMockup = document.querySelector('.phone-mockup');

if (phoneMockup) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        phoneMockup.style.transform = `translateY(${rate}px) rotate(${rate * 0.01}deg)`;
    });
}

// ========== CTA BUTTONS RIPPLE EFFECT ==========
const buttons = document.querySelectorAll('.btn, .cta-button, .pricing-button');

buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple styles
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== TYPING EFFECT FOR HERO TITLE ==========
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ========== LAZY LOADING IMAGES ==========
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========== CONSOLE MESSAGE ==========
console.log('%c🚀 Sportimizer ERP', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cDesarrollado con ❤️ para la gestión deportiva profesional', 'font-size: 12px; color: #6b7280;');
