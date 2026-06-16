document.addEventListener('DOMContentLoaded', () => {

  /* ===== Sticky header ===== */
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });

  /* ===== Mobile nav toggle ===== */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const icon = navToggle.querySelector('i');
    icon.className = nav.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.querySelector('i').className = 'fa-solid fa-bars';
    });
  });

  /* ===== Scroll reveal ===== */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ===== Animated counters ===== */
  const counters = document.querySelectorAll('.stat__num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => counterObserver.observe(el));

  /* ===== Testimonial carousel ===== */
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');
  const cards = track ? Array.from(track.children) : [];

  if (track && cards.length) {
    cards.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => scrollToCard(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function getCardWidth() {
      const style = getComputedStyle(track);
      const gap = parseFloat(style.gap) || 24;
      return cards[0].getBoundingClientRect().width + gap;
    }

    function scrollToCard(index) {
      const clamped = Math.max(0, Math.min(index, cards.length - 1));
      track.scrollTo({ left: clamped * getCardWidth(), behavior: 'smooth' });
    }

    function currentIndex() {
      return Math.round(track.scrollLeft / getCardWidth());
    }

    prevBtn.addEventListener('click', () => scrollToCard(currentIndex() - 1));
    nextBtn.addEventListener('click', () => scrollToCard(currentIndex() + 1));

    let scrollTimeout;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const idx = currentIndex();
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }, 100);
    });
  }

  /* ===== FAQ accordion ===== */
  document.querySelectorAll('.faq__item').forEach(item => {
    const q = item.querySelector('.faq__q');
    const a = item.querySelector('.faq__a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq__item').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq__a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ===== Contact form (sends to support@aidroid.co.in via FormSubmit) ===== */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
      note.classList.remove('success', 'error');
      note.textContent = '';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });
        if (response.ok) {
          note.textContent = "Thanks! Your message has been sent — we'll get back to you within 24 hours.";
          note.classList.add('success');
          form.reset();
        } else {
          throw new Error('Submission failed');
        }
      } catch (err) {
        note.textContent = 'Something went wrong sending your message. Please email us directly at support@aidroid.co.in.';
        note.classList.add('error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
      }
    });
  }

  /* ===== Footer year ===== */
  document.getElementById('year').textContent = new Date().getFullYear();

});
