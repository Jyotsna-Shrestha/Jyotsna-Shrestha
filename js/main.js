/* ── Starfield ── */

class Star {
  constructor(w, h, depth) {
    this.reset(w, h, depth);
  }

  reset(w, h, depth) {
    this.depth = depth;
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 1.5 + 0.3 + (1 - depth) * 1.2;
    this.speed = (Math.random() * 0.15 + 0.05) * (1 + (1 - depth) * 2);
    this.opacity = Math.random() * 0.5 + 0.3;
    this.twinkleSpeed = Math.random() * 0.008 + 0.002;
    this.twinklePhase = Math.random() * Math.PI * 2;
    // color tint: 0=white, 1=blue, 2=purple
    this.tint = Math.floor(Math.random() * 3);
  }

  update(w, h) {
    this.y -= this.speed;
    if (this.y < -5) {
      this.y = h + 5;
      this.x = Math.random() * w;
    }
    this.twinklePhase += this.twinkleSpeed;
  }

  draw(ctx) {
    const opacity = this.opacity * (0.7 + 0.3 * Math.sin(this.twinklePhase));
    const r = this.size;
    let color;
    switch (this.tint) {
      case 0: color = `rgba(255, 255, 255, ${opacity})`; break;
      case 1: color = `rgba(160, 200, 255, ${opacity})`; break;
      case 2: color = `rgba(200, 180, 255, ${opacity})`; break;
      default: color = `rgba(255, 255, 255, ${opacity})`;
    }

    if (r < 0.8) {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, 1, 1);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      // glow on larger stars
      if (r > 1.2) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(/[\d.]+\)$/, '0.1)');
        ctx.fill();
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initStarfield();

  function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, stars;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function initStars() {
      resize();
      stars = [];
      const count = Math.min(Math.floor((w * h) / 4000), 350);
      for (let i = 0; i < count; i++) {
        stars.push(new Star(w, h, Math.random()));
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      stars.forEach(s => {
        s.update(w, h);
        s.draw(ctx);
      });
      requestAnimationFrame(animate);
    }

    initStars();
    animate();
    window.addEventListener('resize', () => {
      resize();
      stars.forEach(s => { if (s.x > w) s.x = Math.random() * w; if (s.y > h) s.y = Math.random() * h; });
    });
  }
  const header = document.getElementById('header');
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav__link');
  const themeToggle = document.getElementById('theme-toggle');
  const scrollUp = document.getElementById('scroll-up');
  const sections = document.querySelectorAll('.section');
  const contactForm = document.getElementById('contact-form');

  let lastScroll = 0;

  function getTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  setTheme(getTheme());

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  navToggle.addEventListener('click', () => {
    navMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  navClose.addEventListener('click', closeMenu);

  function closeMenu() {
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)) {
      closeMenu();
    }
  });

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (currentScroll > 400) {
      scrollUp.classList.add('show');
    } else {
      scrollUp.classList.remove('show');
    }

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active-link');
          }
        });
      }
    });

    lastScroll = currentScroll;
  });

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section__title, .section__subtitle, .about__container, .skills__category, .project-card, .timeline__item, .contact__container').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn');
      const originalText = btn.textContent;
      btn.textContent = 'Message Sent!';
      btn.style.background = '#22c55e';
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 3000);
    });
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }
});
