/* ===== Particle Background ===== */
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;
    const CONNECT_DIST = 140;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.r = Math.random() * 2 + 0.5;
            this.color = Math.random() > 0.5 ? '0,240,255' : '123,47,255';
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color},0.6)`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0,240,255,${0.08 * (1 - dist / CONNECT_DIST)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
})();

/* ===== Typing Effect ===== */
(function initTyping() {
    const el = document.getElementById('typed-text');
    const words = ['Cybersecurity Enthusiast', 'Penetration Tester', 'CTF Player', 'Backend Developer', 'Ethical Hacker'];
    let wordIndex = 0, charIndex = 0, deleting = false;

    function type() {
        const current = words[wordIndex];
        el.textContent = deleting ? current.substring(0, charIndex--) : current.substring(0, charIndex++);

        if (!deleting && charIndex > current.length) {
            setTimeout(() => { deleting = true; type(); }, 2000);
            return;
        }
        if (deleting && charIndex < 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
        setTimeout(type, deleting ? 40 : 80);
    }
    type();
})();

/* ===== Navigation ===== */
(function initNav() {
    const nav = document.getElementById('main-nav');
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    const links = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('open');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('open');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('.section, .hero');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 100;
            if (window.scrollY >= top) current = sec.getAttribute('id');
        });
        links.forEach(link => {
            link.classList.toggle('active', link.dataset.section === current);
        });
    });
})();

/* ===== Counter Animation ===== */
(function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let counted = false;

    function animateCounters() {
        if (counted) return;
        const trigger = document.querySelector('.hero-stats');
        if (!trigger) return;
        const rect = trigger.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            counted = true;
            counters.forEach(counter => {
                const target = +counter.dataset.target;
                const duration = 1500;
                const start = performance.now();
                function step(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.floor(eased * target);
                    if (progress < 1) requestAnimationFrame(step);
                    else counter.textContent = target;
                }
                requestAnimationFrame(step);
            });
        }
    }
    window.addEventListener('scroll', animateCounters);
    animateCounters();
})();

/* ===== Scroll Reveal ===== */
(function initReveal() {
    const items = document.querySelectorAll(
        '.project-card, .cert-card, .skill-category, .info-card, .timeline-item'
    );
    items.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    items.forEach(el => observer.observe(el));
})();

/* ===== Form Handler ===== */
function handleFormSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('form-submit');
    btn.innerHTML = '<span class="btn-icon">✓</span> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #00c853, #00e676)';
    setTimeout(() => {
        btn.innerHTML = '<span class="btn-icon">🚀</span> Send Message';
        btn.style.background = '';
        e.target.reset();
    }, 3000);
}

/* ===== Smooth anchor scroll ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});
