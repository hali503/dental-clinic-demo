// Shared navigation, motion, carousel, and enquiry interactions.
const yearElements = document.querySelectorAll('[data-year]');
yearElements.forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const pageIsVisible = () => document.visibilityState === 'visible';

// Sticky navigation and accessible mobile menu.
const siteHeader = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

function updateHeaderState() {
  if (siteHeader) siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
}

updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

if (navToggle && mainNav) {
  const closeNavigation = () => {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNavigation));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNavigation();
  });
  document.addEventListener('click', (event) => {
    if (!siteHeader.contains(event.target)) closeNavigation();
  });
}

// Reveal major content as it enters the viewport.
const revealTargets = document.querySelectorAll(
  '.section, .trust-strip, .quote-section, .appointment-cta, .values-section, .page-hero, .contact-bottom'
);
revealTargets.forEach((element) => element.classList.add('reveal'));
document.querySelectorAll('.treatment-card, .service-detail, .values-grid article').forEach((element, index) => {
  element.classList.add('reveal');
  element.style.setProperty('--reveal-delay', `${Math.min(index, 3) * 75}ms`);
});

const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealElements.forEach((element) => revealObserver.observe(element));
}

// Premium, pauseable home-page carousel.
const hero = document.querySelector('.hero');
const heroVisual = document.querySelector('.hero-visual');
const heroPhoto = document.querySelector('.hero-photo');
const heroImage = document.querySelector('.hero-image img');
const heroEyebrow = document.querySelector('.hero-copy .eyebrow');
const heroTitle = document.getElementById('hero-title');
const heroIntro = document.getElementById('hero-intro');
const heroPrimary = document.getElementById('hero-primary');
const heroSecondary = document.getElementById('hero-secondary');
const slideCaption = document.getElementById('slide-caption');
const slideCount = document.getElementById('slide-count');
const slideDots = document.querySelectorAll('[data-slide-to]');
const heroSlides = [
  {
    eyebrow: 'TARIQ DENTAL CARE · PAKPATTAN',
    title: 'A healthier smile<br />starts <em>with care.</em>',
    intro: 'Thoughtful dental care should feel personal, reassuring and easy to ask about. Start a conversation with Tariq Dental Care.',
    caption: 'PERSONAL CARE, EVERY STEP',
    image: 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9QjL6z1ytFLc066qC0e2NU75ImWpoRW-0AiHt_QAAKyiEaATZW-NobKOqJRJr1hnDQ5PmyYkucOT6OwDn-Ji18GPuru-BfBB4FcuHfXCalxY1lvs8tyh3jDFoO5AElVpO5mLNzIN2AA1JDW=w900-h1200-k-no',
    alt: 'Interior of Tariq Dental Care, from its Google Maps photo gallery',
    primary: 'Request a visit',
    secondary: 'Explore treatments',
    secondaryHref: 'services.html'
  },
  {
    eyebrow: 'A THOUGHTFUL APPROACH TO CARE',
    title: 'Feel at ease<br />with your <em>next step.</em>',
    intro: 'A clear conversation can help you feel more prepared. Tell the clinic what is on your mind and ask about your options.',
    caption: 'A CONVERSATION THAT STARTS WITH YOU',
    image: 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9SZEYcLJUtwT1NhFuMaj8TA-zorFHKl4Qdd4H_lDt65SxVGVwLqJtGgOCYADu3Up3hZxo2NcWNFJ4PHNuDggQWXB6FnWUi91V-Ckzj6KP5tSKpjHcXLOHVeM_LFyAit4x2Jk8fnQyPQPTJ_=w900-h1200-k-no',
    alt: 'Tariq Dental Care logo on the reception wall, from its Google Maps photo gallery',
    primary: 'Start a conversation',
    secondary: 'Visit the clinic',
    secondaryHref: 'contact.html'
  },
  {
    eyebrow: 'YOUR LOCAL CLINIC · PAKPATTAN',
    title: 'Care that feels<br /><em>closer to home.</em>',
    intro: 'Find Tariq Dental Care in Pakpattan, Punjab. Check the shared map location and get in touch before planning your visit.',
    caption: 'YOUR LOCAL CLINIC IN PAKPATTAN',
    image: 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9QjL6z1ytFLc066qC0e2NU75ImWpoRW-0AiHt_QAAKyiEaATZW-NobKOqJRJr1hnDQ5PmyYkucOT6OwDn-Ji18GPuru-BfBB4FcuHfXCalxY1lvs8tyh3jDFoO5AElVpO5mLNzIN2AA1JDW=w900-h1200-k-no',
    alt: 'Reception and waiting area at Tariq Dental Care, from its Google Maps photo gallery',
    primary: 'Plan your visit',
    secondary: 'Open directions',
    secondaryHref: 'contact.html'
  }
];

let activeHeroSlide = 0;
let heroTimer = 0;
let heroTransitionTimer = 0;
let heroPaused = false;

function setHeroAutoplay() {
  window.clearTimeout(heroTimer);
  if (heroSlides.length < 2 || heroPaused || !pageIsVisible() || prefersReducedMotion.matches) return;
  heroTimer = window.setTimeout(() => {
    showHeroSlide(activeHeroSlide + 1);
  }, 6500);
}

function showHeroSlide(index) {
  if (!heroImage || !heroTitle || !heroIntro || !slideCaption || !slideCount || !slideDots.length) return;
  window.clearTimeout(heroTransitionTimer);
  activeHeroSlide = (index + heroSlides.length) % heroSlides.length;
  const slide = heroSlides[activeHeroSlide];
  heroVisual?.classList.add('is-changing');
  document.querySelector('.hero-copy')?.classList.add('is-changing');
  heroTransitionTimer = window.setTimeout(() => {
    heroTitle.innerHTML = slide.title;
    heroIntro.textContent = slide.intro;
    heroImage.src = slide.image;
    heroImage.alt = slide.alt;
    heroVisual?.classList.remove('shape-slide-0', 'shape-slide-1', 'shape-slide-2');
    heroVisual?.classList.add(`shape-slide-${activeHeroSlide}`);
    if (heroPhoto) {
      const overlay = window.matchMedia('(max-width: 860px)').matches
        ? 'linear-gradient(180deg,rgba(246,245,239,.97),rgba(246,245,239,.7) 60%,rgba(246,245,239,.2))'
        : 'linear-gradient(90deg,rgba(246,245,239,.97) 0%,rgba(246,245,239,.88) 38%,rgba(246,245,239,.25) 73%,rgba(20,36,28,.08) 100%)';
      heroPhoto.style.backgroundImage = `${overlay},url("${slide.image}")`;
    }
    slideCaption.textContent = slide.caption;
    slideCount.textContent = `${String(activeHeroSlide + 1).padStart(2, '0')} — ${String(heroSlides.length).padStart(2, '0')}`;
    if (heroEyebrow) heroEyebrow.innerHTML = `<span></span> ${slide.eyebrow}`;
    if (heroPrimary) heroPrimary.firstChild.textContent = `${slide.primary} `;
    if (heroSecondary) {
      heroSecondary.href = slide.secondaryHref;
      heroSecondary.firstChild.textContent = `${slide.secondary} `;
    }
    slideDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeHeroSlide;
      dot.classList.toggle('is-active', isActive);
      if (isActive) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    requestAnimationFrame(() => {
      heroVisual?.classList.remove('is-changing');
      document.querySelector('.hero-copy')?.classList.remove('is-changing');
    });
    setHeroAutoplay();
  }, prefersReducedMotion.matches ? 0 : 190);
}

if (hero) {
  document.querySelectorAll('[data-slide-step]').forEach((button) => {
    button.addEventListener('click', () => showHeroSlide(activeHeroSlide + Number(button.dataset.slideStep)));
  });
  slideDots.forEach((dot) => {
    dot.addEventListener('click', () => showHeroSlide(Number(dot.dataset.slideTo)));
  });
  hero.addEventListener('mouseenter', () => { heroPaused = true; window.clearTimeout(heroTimer); });
  hero.addEventListener('mouseleave', () => { heroPaused = false; setHeroAutoplay(); });
  hero.addEventListener('focusin', () => { heroPaused = true; window.clearTimeout(heroTimer); });
  hero.addEventListener('focusout', (event) => {
    if (!hero.contains(event.relatedTarget)) {
      heroPaused = false;
      setHeroAutoplay();
    }
  });
  let touchStartX = 0;
  heroVisual?.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  heroVisual?.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 50) showHeroSlide(activeHeroSlide + (distance < 0 ? 1 : -1));
  }, { passive: true });
  document.addEventListener('visibilitychange', setHeroAutoplay);
  setHeroAutoplay();
}

// Mobile-only horizontal treatment carousel; desktop keeps its three-column grid.
const treatmentGrid = document.getElementById('treatment-grid');
const treatmentButtons = document.querySelectorAll('[data-treatment-step]');
const treatmentPage = document.querySelector('.treatment-page');
const mobileTreatments = window.matchMedia('(max-width: 600px)');

function updateTreatmentCarousel() {
  if (!treatmentGrid) return;
  treatmentGrid.classList.toggle('is-carousel', mobileTreatments.matches);
  if (treatmentPage && treatmentGrid.firstElementChild) {
    const visibleIndex = Math.round(treatmentGrid.scrollLeft / treatmentGrid.firstElementChild.getBoundingClientRect().width);
    treatmentPage.textContent = `${String(visibleIndex + 1).padStart(2, '0')} / ${String(treatmentGrid.children.length).padStart(2, '0')}`;
  }
}

function moveTreatmentCarousel(step) {
  if (!treatmentGrid || !treatmentGrid.firstElementChild) return;
  const cardWidth = treatmentGrid.firstElementChild.getBoundingClientRect().width;
  treatmentGrid.scrollBy({ left: step * (cardWidth + 12), behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
}

treatmentButtons.forEach((button) => {
  button.addEventListener('click', () => moveTreatmentCarousel(Number(button.dataset.treatmentStep)));
});
treatmentGrid?.addEventListener('scroll', updateTreatmentCarousel, { passive: true });
mobileTreatments.addEventListener('change', updateTreatmentCarousel);
window.addEventListener('resize', updateTreatmentCarousel, { passive: true });
updateTreatmentCarousel();

// Accessible, draggable illustrative image comparison.
document.querySelectorAll('[data-before-after]').forEach((frame) => {
  const range = frame.querySelector('.comparison-range');
  const updateFrameSize = () => {
    frame.style.setProperty('--comparison-frame-width', `${frame.getBoundingClientRect().width}px`);
  };
  updateFrameSize();
  if ('ResizeObserver' in window) new ResizeObserver(updateFrameSize).observe(frame);
  else window.addEventListener('resize', updateFrameSize, { passive: true });
  range?.addEventListener('input', () => {
    frame.style.setProperty('--comparison-position', `${range.value}%`);
  });
});

// Rotate paraphrased public review highlights and keep their source attribution visible.
const testimonialStage = document.querySelector('.testimonial-stage');
const testimonialSlides = document.querySelectorAll('[data-testimonial]');
const testimonialDots = document.querySelectorAll('[data-testimonial-to]');
let activeTestimonial = 0;
let testimonialTimer = 0;
let testimonialsPaused = false;

function setTestimonialAutoplay() {
  window.clearTimeout(testimonialTimer);
  if (testimonialSlides.length < 2 || testimonialsPaused || !pageIsVisible() || prefersReducedMotion.matches) return;
  testimonialTimer = window.setTimeout(() => showTestimonial(activeTestimonial + 1), 7000);
}

function showTestimonial(index) {
  if (!testimonialSlides.length) return;
  activeTestimonial = (index + testimonialSlides.length) % testimonialSlides.length;
  testimonialSlides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeTestimonial;
    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', String(!isActive));
  });
  testimonialDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeTestimonial;
    dot.classList.toggle('is-active', isActive);
    if (isActive) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
  setTestimonialAutoplay();
}

document.querySelectorAll('[data-testimonial-step]').forEach((button) => {
  button.addEventListener('click', () => showTestimonial(activeTestimonial + Number(button.dataset.testimonialStep)));
});
testimonialDots.forEach((dot) => {
  dot.addEventListener('click', () => showTestimonial(Number(dot.dataset.testimonialTo)));
});
testimonialStage?.addEventListener('mouseenter', () => { testimonialsPaused = true; window.clearTimeout(testimonialTimer); });
testimonialStage?.addEventListener('mouseleave', () => { testimonialsPaused = false; setTestimonialAutoplay(); });
testimonialStage?.addEventListener('focusin', () => { testimonialsPaused = true; window.clearTimeout(testimonialTimer); });
testimonialStage?.addEventListener('focusout', (event) => {
  if (!testimonialStage.contains(event.relatedTarget)) {
    testimonialsPaused = false;
    setTestimonialAutoplay();
  }
});
document.addEventListener('visibilitychange', setTestimonialAutoplay);
setTestimonialAutoplay();

// Appointment form validates locally and prepares a draft the visitor sends themselves.
const appointmentForm = document.getElementById('appointmentForm');
const clinicPhone = '0309130600';
const clinicWhatsAppNumber = `92${clinicPhone.replace(/^0/, '')}`;
const whatsappUrl = (message) => `https://wa.me/${clinicWhatsAppNumber}?text=${encodeURIComponent(message)}`;
document.querySelectorAll('.whatsapp-float').forEach((link) => {
  link.href = whatsappUrl('Hello Tariq Dental Care, I have an enquiry.');
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});
if (appointmentForm) {
  const queryService = new URLSearchParams(window.location.search).get('service');
  const serviceSelect = appointmentForm.elements.service;
  if (queryService && serviceSelect) {
    const matchingOption = Array.from(serviceSelect.options).find(
      (option) => option.text.toLowerCase() === queryService.toLowerCase()
    );
    if (matchingOption) serviceSelect.value = matchingOption.value;
  }

  const dateField = appointmentForm.elements.date;
  if (dateField) {
    const today = new Date();
    dateField.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  }

  const successModal = document.getElementById('successModal');
  const closeSuccessModal = () => {
    if (successModal?.open) successModal.close();
  };
  successModal?.querySelector('.modal-done')?.addEventListener('click', closeSuccessModal);
  successModal?.addEventListener('click', (event) => {
    if (event.target === successModal) closeSuccessModal();
  });

  appointmentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!appointmentForm.reportValidity()) return;

    const formData = new FormData(appointmentForm);
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const date = String(formData.get('date') || '');
    const service = String(formData.get('service') || 'Not specified');
    const details = String(formData.get('details') || '').trim();
    const message = [
      'Hello Tariq Dental Care, I would like to enquire about an appointment.',
      '',
      `Name: ${name}`,
      `Contact number: ${phone}`,
      `Preferred date: ${date || 'Flexible'}`,
      `Treatment / enquiry: ${service}`,
      details ? `Additional details: ${details}` : '',
      '',
      'Please let me know about availability. Thank you.'
    ].filter(Boolean).join('\n');

    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
    if (successModal?.showModal) successModal.showModal();
  });
}
