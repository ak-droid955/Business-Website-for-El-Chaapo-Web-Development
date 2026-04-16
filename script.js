(function () {
  'use strict';

  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dots .dot');
  let current  = 0;
  let slideTimer;

  function goToSlide(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function nextSlide() { goToSlide(current + 1); }
  function startAutoplay() { slideTimer = setInterval(nextSlide, 5000); }
  function resetAutoplay()  { clearInterval(slideTimer); startAutoplay(); }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.idx, 10));
      resetAutoplay();
    });
  });

  let touchStartX = 0;
  const heroEl = document.querySelector('.hero');
  if (heroEl) {
    heroEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    heroEl.addEventListener('touchend',   e => {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 50) { goToSlide(delta < 0 ? current + 1 : current - 1); resetAutoplay(); }
    }, { passive: true });
  }

  startAutoplay();

  const header = document.getElementById('site-header');
  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  const navToggle = document.getElementById('navToggle');
  const mainNav   = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', mainNav.classList.contains('open'));
    });
    mainNav.querySelectorAll('a').forEach(l => l.addEventListener('click', () => mainNav.classList.remove('open')));
    document.addEventListener('click', e => { if (!header.contains(e.target)) mainNav.classList.remove('open'); });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' });
      }
    });
  });

  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    window.addEventListener('scroll', () => {
      const s = window.scrollY;
      if (s < window.innerHeight) {
        heroContent.style.transform = `translateY(${s * 0.25}px)`;
        heroContent.style.opacity   = Math.max(0, 1 - s / (window.innerHeight * 0.6));
      }
    }, { passive: true });
  }


  const spotSection  = document.getElementById('spotlight');
  const spotBg       = document.getElementById('spotlightBg');
  const spotImgFront = document.getElementById('spotImgFront');
  const spotImgBack  = document.getElementById('spotImgBack');

  function updateSpotlightParallax() {
    if (!spotSection || !spotBg) return;

    const rect    = spotSection.getBoundingClientRect();
    const vpH     = window.innerHeight;

   
    const offset  = (rect.top + rect.height / 2) - vpH / 2;

    
    spotBg.style.transform = `translateY(${offset * 0.40}px)`;

    
    if (spotImgFront) spotImgFront.style.transform = `rotate(2.5deg)  translateY(${offset * -0.12}px)`;
    if (spotImgBack)  spotImgBack.style.transform  = `rotate(-3deg)   translateY(${offset * -0.22}px)`;
  }

  window.addEventListener('scroll', updateSpotlightParallax, { passive: true });
  window.addEventListener('resize', updateSpotlightParallax, { passive: true });
  // Initialise immediately — prevents a visible jump on first interaction
  updateSpotlightParallax();

  const revealSelectors = [
    '.so-cheesy .section-inner',
    '.dest-title', '.dest-body', '.btn-outline',
    '.insta-grid',
    '.spotlight-content',
    '.truck-inner',
    '.footer-cols',
  ];
  revealSelectors.forEach(sel =>
    document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'))
  );

  document.querySelectorAll('.insta-item').forEach((item, i) => {
    item.classList.add('reveal');
    item.style.transitionDelay = `${i * 0.06}s`;
  });

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => revealObserver.observe(el));

})();