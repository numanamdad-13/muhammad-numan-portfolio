/* ==========================================================================
   Muhammad Numan Portfolio - Core Interactivity Script
   ========================================================================== */
   document.addEventListener('DOMContentLoaded', () => {

    emailjs.init({
      publicKey: "QkGsh0JqpnDkSNPIi",
    });
  
    document.getElementById("current-year").textContent = new Date().getFullYear();

  /* --------------------------------------------------------------------------
     1. Preloader Screen
     -------------------------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      // Small timeout to show animation
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }, 600);
    });
  }

  /* --------------------------------------------------------------------------
     2. Scroll Progress Bar & Back to Top Button
     -------------------------------------------------------------------------- */
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    }

    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. Light/Dark Theme Toggler
     -------------------------------------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');

  // Load saved theme
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    
    if (isLight) {
      themeIcon.classList.replace('fa-moon', 'fa-sun');
      localStorage.setItem('portfolio-theme', 'light');
    } else {
      themeIcon.classList.replace('fa-sun', 'fa-moon');
      localStorage.setItem('portfolio-theme', 'dark');
    }
  });

  /* --------------------------------------------------------------------------
     4. Navigation Drawer & Mobile Menu
     -------------------------------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    menuToggle.classList.add('open');
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    menuToggle.classList.remove('open');
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Active navigation link tracking on scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 100; // Offset for sticky navbar

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  /* --------------------------------------------------------------------------
     5. Typing Animation (Hero Subtitle)
     -------------------------------------------------------------------------- */
  const typedTextSpan = document.getElementById('typed-text');
  const phrases = [
    "Software Engineering Student",
    "C++ Developer",
    "Frontend Web Developer",
    "Problem Solver"
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typedTextSpan.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deleting is faster
    } else {
      typedTextSpan.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at end of phrase
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500; // Small pause before typing next
    }

    setTimeout(typeEffect, typingSpeed);
  }

  if (typedTextSpan) {
    setTimeout(typeEffect, 1000);
  }

  /* --------------------------------------------------------------------------
     6. Stats Counters
     -------------------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  function animateCounters() {
    statNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000; // Animation duration in ms
      const stepTime = Math.max(Math.floor(duration / target), 15);
      let currentVal = 0;

      const timer = setInterval(() => {
        currentVal += Math.ceil(target / (duration / stepTime));
        if (currentVal >= target) {
          counter.textContent = target + (target === 6 ? '+' : target === 15 ? '+' : target === 200 ? '+' : '+');
          clearInterval(timer);
        } else {
          counter.textContent = currentVal;
        }
      }, stepTime);
    });
  }

  /* --------------------------------------------------------------------------
     7. Scroll Reveal & Intersection Observers
     -------------------------------------------------------------------------- */
  const elementsToReveal = document.querySelectorAll(
    '.reveal-slide-left, .reveal-slide-right, .reveal-slide-up, .reveal-fade-in'
  );

  const observerOptions = {
    root: null, // Viewport
    threshold: 0.15, // Trigger when 15% visible
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        
        // Trigger statistics count if stats section is in view
        if (entry.target.classList.contains('stats-section') || entry.target.querySelector('.stat-number')) {
          if (!countersAnimated) {
            animateCounters();
            countersAnimated = true;
          }
        }

        // Trigger skill fills if skills category card is in view
        if (entry.target.classList.contains('skills-category-card')) {
          const fills = entry.target.querySelectorAll('.skill-fill');
          fills.forEach(fill => {
            const width = fill.style.width; // Grab hardcoded inline style
            // Momentarily set width to 0 and expand for animating effect
            fill.style.width = '0%';
            setTimeout(() => {
              fill.style.width = width;
            }, 100);
          });
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elementsToReveal.forEach(el => revealObserver.observe(el));
  
  // Also observe stats container explicitly
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) revealObserver.observe(statsSection);

  /* --------------------------------------------------------------------------
     8. Project Filtering Logic
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
  
  /* --------------------------------------------------------------------------
     9. Contact Form Handling
     -------------------------------------------------------------------------- */
  /*const contactForm = document.getElementById('contact-form');
  const formSubmit = document.getElementById('form-submit');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Submit feedback styling
      formSubmit.disabled = true;
      formSubmit.querySelector('span').textContent = 'Sending...';
      formSubmit.querySelector('i').className = 'fa-solid fa-spinner fa-spin';

      emailjs.sendForm(
        "service_a75q6nv",
        "template_8bse1nh",
        contactForm
    )
    .then(() => {
    
        formFeedback.textContent = "✅ Thank you! Your message has been sent successfully!";
        formFeedback.className = "form-feedback success";
    
        contactForm.reset();
    
        formSubmit.disabled = false;
        formSubmit.querySelector("span").textContent = "Send Message";
        formSubmit.querySelector("i").className = "fa-solid fa-paper-plane";
    
        setTimeout(() => {
            formFeedback.textContent = "";
            formFeedback.className = "form-feedback";
        }, 5000);
    
    })
    .catch((error) => {
    
      console.log("Status:", error.status);
      console.log("Text:", error.text);
      console.log(error);
      alert("Status: " + error.status + "\nMessage: " + error.text);
    
        formFeedback.textContent = "❌ Failed to send message.";
        formFeedback.className = "form-feedback error";
    
        formSubmit.disabled = false;
        formSubmit.querySelector("span").textContent = "Send Message";
        formSubmit.querySelector("i").className = "fa-solid fa-paper-plane";
    
    });
    });
  }
      */
});
