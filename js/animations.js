// GSAP Animations - Advanced Website Animations
gsap.registerPlugin(ScrollTrigger);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPreloader();
    initHeroAnimations();
    initScrollAnimations();
    initParallaxEffects();
    initBookCardAnimations();
    initNavbarAnimations();
    initFooterAnimations();
    initMagneticButtons();
    initSmoothScroll();
    initTextRevealAnimations();
});

// Preloader Animation
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">
                <i class="fas fa-book-open"></i>
            </div>
            <div class="preloader-text">StoryVerse</div>
        </div>
    `;
    document.body.prepend(preloader);

    const tl = gsap.timeline();
    tl.to('.preloader-logo', {
        duration: 0.8,
        scale: 1.2,
        rotation: 360,
        ease: 'power2.out'
    })
    .to('.preloader-text', {
        duration: 0.6,
        opacity: 1,
        y: 0,
        ease: 'power2.out'
    }, '-=0.4')
    .to('.preloader', {
        duration: 0.8,
        opacity: 0,
        ease: 'power2.inOut',
        onComplete: () => {
            preloader.remove();
            document.body.style.overflow = 'visible';
        }
    }, '+=0.5');

    document.body.style.overflow = 'hidden';
}

function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Background image zoom in
    tl.from('.hero-bg-image', {
        duration: 1.5,
        scale: 1.2,
        ease: 'power2.out'
    })
    // Overlay fade in
    .from('.hero-overlay', {
        duration: 1,
        opacity: 0
    }, '-=1')
    // Badge animation
    .from('.hero-badge', {
        duration: 0.8,
        y: -30,
        opacity: 0,
        scale: 0.8
    }, '-=0.5')
    // Title animation - split by lines
    .add(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && !heroTitle.querySelector('.hero-line')) {
            const lines = heroTitle.innerHTML.split('<br>');
            heroTitle.innerHTML = lines.map(line => 
                `<span class="hero-line" style="display: inline-block; overflow: hidden;">
                    <span style="display: inline-block;">${line}</span>
                </span>`
            ).join('<br>');
        }
    })
    .from('.hero-line span', {
        duration: 1,
        y: 100,
        opacity: 0,
        stagger: 0.15,
        ease: 'power4.out'
    }, '-=0.3')
    // Description animation
    .from('.hero-description', {
        duration: 0.8,
        y: 30,
        opacity: 0
    }, '-=0.5')
    // Buttons animation
    .from('.hero-buttons button', {
        duration: 0.6,
        y: 30,
        opacity: 0,
        stagger: 0.15,
        scale: 0.9
    }, '-=0.4')
    // Stats animation
    .from('.stat-item', {
        duration: 0.8,
        y: 40,
        opacity: 0,
        stagger: 0.1
    }, '-=0.3');

    // Animate stat numbers counting up
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat, index) => {
        const text = stat.textContent;
        const hasPlus = text.includes('+');
        const hasDollar = text.includes('$');
        const number = parseFloat(text.replace(/[^0-9.]/g, ''));
        
        gsap.from(stat, {
            duration: 2,
            textContent: 0,
            snap: { textContent: number / 20 },
            ease: 'power2.out',
            delay: 2 + (index * 0.1),
            onUpdate: function() {
                const current = parseFloat(this.targets()[0].textContent);
                let formatted = current.toFixed(text.includes('.') ? 1 : 0);
                if (hasDollar) formatted = '$' + formatted;
                if (text.includes('K')) formatted += 'K';
                if (text.includes('M')) formatted += 'M';
                if (hasPlus) formatted += '+';
                this.targets()[0].textContent = formatted;
            }
        });
    });

    // Floating shapes animation
    gsap.to('.shape-1', {
        duration: 4,
        y: 40,
        x: 30,
        rotation: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    gsap.to('.shape-2', {
        duration: 5,
        y: -50,
        x: -40,
        rotation: -20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    gsap.to('.shape-3', {
        duration: 4.5,
        y: 35,
        x: -25,
        rotation: 25,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

function initScrollAnimations() {
    // Section titles animation
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            },
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
    });

    // Steps animation
    gsap.utils.toArray('.step').forEach((step, index) => {
        gsap.from(step, {
            scrollTrigger: {
                trigger: step,
                start: 'top 85%',
                end: 'top 60%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.8,
            y: 60,
            opacity: 0,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });

    // Step icons rotation on scroll
    gsap.utils.toArray('.step-icon').forEach(icon => {
        gsap.from(icon, {
            scrollTrigger: {
                trigger: icon,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            },
            duration: 1,
            rotation: -180,
            scale: 0,
            ease: 'back.out(1.7)'
        });
    });
}

function initParallaxEffects() {
    // Parallax effect for hero background image
    gsap.to('.hero-bg-image', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 200,
        scale: 1.1,
        ease: 'none'
    });

    // Parallax for hero content
    gsap.to('.hero-content', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5
        },
        y: 100,
        opacity: 0.5,
        ease: 'none'
    });

    // Parallax for shapes
    gsap.to('.shape-1', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 2
        },
        y: 250,
        ease: 'none'
    });

    gsap.to('.shape-2', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5
        },
        y: -180,
        ease: 'none'
    });

    gsap.to('.shape-3', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.8
        },
        y: 150,
        ease: 'none'
    });
}

function initBookCardAnimations() {
    // Animate book cards on scroll
    gsap.utils.toArray('.book-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                end: 'top 65%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.6,
            y: 50,
            opacity: 0,
            delay: (index % 6) * 0.08,
            ease: 'power2.out'
        });

        // Hover animation enhancement
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                y: -10,
                boxShadow: 'rgba(0, 0, 0, 0.2) 0px 8px 20px 0px',
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                y: 0,
                boxShadow: 'none',
                ease: 'power2.out'
            });
        });
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: target,
                ease: 'power3.inOut'
            });
        }
    });
});

// Button hover animations
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('mouseenter', function() {
        gsap.to(this, {
            duration: 0.3,
            scale: 1.05,
            ease: 'power2.out'
        });
    });

    button.addEventListener('mouseleave', function() {
        gsap.to(this, {
            duration: 0.3,
            scale: 1,
            ease: 'power2.out'
        });
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const navbar = document.querySelector('.navbar');
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Cursor follow effect (optional - like hypefluency)
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        duration: 0.3,
        x: e.clientX,
        y: e.clientY,
        ease: 'power2.out'
    });
});

// Add cursor glow on interactive elements
document.querySelectorAll('a, button, .book-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
    });
});


// Navbar Animations
function initNavbarAnimations() {
    // Navbar links hover effect
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                y: -3,
                ease: 'power2.out'
            });
        });
        
        link.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                y: 0,
                ease: 'power2.out'
            });
        });
    });

    // Navbar scroll effect with animation
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const navbar = document.querySelector('.navbar');
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
            gsap.to(navbar, {
                duration: 0.3,
                y: 0,
                ease: 'power2.out'
            });
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide navbar on scroll down, show on scroll up
        if (currentScroll > lastScroll && currentScroll > 500) {
            gsap.to(navbar, {
                duration: 0.3,
                y: -100,
                ease: 'power2.out'
            });
        } else {
            gsap.to(navbar, {
                duration: 0.3,
                y: 0,
                ease: 'power2.out'
            });
        }
        
        lastScroll = currentScroll;
    });
}

// Footer Animations
function initFooterAnimations() {
    gsap.from('.footer-col', {
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.out'
    });

    gsap.from('.footer-bottom', {
        scrollTrigger: {
            trigger: '.footer-bottom',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.6,
        opacity: 0,
        ease: 'power2.out'
    });
}

// Magnetic Buttons Effect
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(this, {
                duration: 0.3,
                x: x * 0.3,
                y: y * 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.5,
                x: 0,
                y: 0,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    ease: 'power3.inOut'
                });
            }
        });
    });
}

// Text Reveal Animations
function initTextRevealAnimations() {
    // Animate all headings on scroll
    gsap.utils.toArray('h1, h2, h3, h4').forEach(heading => {
        if (!heading.closest('.hero')) {
            gsap.from(heading, {
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 30,
                opacity: 0,
                ease: 'power3.out'
            });
        }
    });

    // Animate paragraphs
    gsap.utils.toArray('p').forEach(para => {
        if (!para.closest('.hero') && !para.closest('.footer')) {
            gsap.from(para, {
                scrollTrigger: {
                    trigger: para,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.6,
                y: 20,
                opacity: 0,
                ease: 'power2.out'
            });
        }
    });
}

// Enhanced Cursor Effect
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
const cursorFollower = document.createElement('div');
cursorFollower.className = 'custom-cursor-follower';
document.body.appendChild(cursor);
document.body.appendChild(cursorFollower);

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    gsap.to(cursor, {
        duration: 0.2,
        x: mouseX,
        y: mouseY,
        ease: 'power2.out'
    });
});

// Smooth follower animation
gsap.ticker.add(() => {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    gsap.set(cursorFollower, {
        x: followerX,
        y: followerY
    });
});

// Cursor interactions
document.querySelectorAll('a, button, .book-card, .step').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        cursorFollower.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        cursorFollower.classList.remove('cursor-hover');
    });
});

// Page transition effect
window.addEventListener('beforeunload', () => {
    gsap.to('body', {
        duration: 0.5,
        opacity: 0,
        ease: 'power2.inOut'
    });
});
