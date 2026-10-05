// Shared navigation, motion, carousel, and enquiry interactions.
const yearElements = document.querySelectorAll('[data-year]');
yearElements.forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const pageIsVisible = () => document.visibilityState === 'visible';
const clinic = window.CLINIC_CONFIG;

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

// Animate only the editable demo metrics; no patient or outcome figures are implied.
document.querySelectorAll('[data-count-target]').forEach((counter) => {
  const target = Number(counter.dataset.countTarget);
  const suffix = counter.dataset.countSuffix || '';
  const renderCount = (value) => {
    const formatted = target < 10 ? String(value).padStart(2, '0') : String(value);
    counter.textContent = `${formatted}${suffix}`;
  };

  if (!Number.isFinite(target) || target < 0) return;
  if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
    renderCount(target);
    return;
  }

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const start = performance.now();
      const duration = 900;
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        renderCount(Math.round(target * (1 - (1 - progress) ** 3)));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      observer.unobserve(counter);
    });
  }, { threshold: 0.7 });
  counterObserver.observe(counter);
});

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
    eyebrow: 'A PERSONAL APPROACH TO COSMETIC CARE',
    title: 'A smile shaped<br /><em>around you.</em>',
    intro: 'Explore a considered approach to smile design, with a conversation about your goals and the options that may suit you.',
    caption: 'SMILE MAKEOVER · ILLUSTRATIVE',
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1000&q=85',
    alt: 'Illustrative dental-care photography for the smile makeover demo slide',
    primary: 'Discuss your goals',
    secondary: 'Explore smile care',
    secondaryHref: 'services.html'
  },
  {
    eyebrow: 'RESTORATIVE OPTIONS, EXPLAINED CLEARLY',
    title: 'Restore function.<br /><em>Explore your options.</em>',
    intro: 'Ask the dental team about restorative care, what an assessment involves and which next steps may be appropriate.',
    caption: 'DENTAL IMPLANTS · DEMO CONTENT',
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1000&q=85',
    alt: 'Illustrative dental consultation photography for the dental implants demo slide',
    primary: 'Ask about implants',
    secondary: 'Visit the clinic',
    secondaryHref: 'contact.html'
  },
  {
    eyebrow: 'A THOUGHTFUL PLACE TO BEGIN',
    title: 'Complete care<br /><em>starts with listening.</em>',
    intro: `From routine questions to a new concern, start a conversation with ${clinic.name} and plan a visit that feels right for you.`,
    caption: 'COMPLETE DENTAL CARE · DEMO',
    image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1000&q=85',
    alt: 'Illustrative dental clinic photography for the complete care demo slide',
    primary: 'Book a consultation',
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
const clinicWhatsAppNumber = clinic.whatsappNumber;
const whatsappUrl = (message) => `https://wa.me/${clinicWhatsAppNumber}?text=${encodeURIComponent(message)}`;
document.querySelectorAll('.whatsapp-float').forEach((link) => {
  link.href = whatsappUrl(`Hello ${clinic.name}, I have an enquiry.`);
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
    const email = String(formData.get('email') || '').trim();
    const date = String(formData.get('date') || '');
    const service = String(formData.get('service') || 'Not specified');
    const details = String(formData.get('details') || '').trim();
    const message = [
      `Hello ${clinic.name}, I would like to enquire about an appointment.`,
      '',
      `Name: ${name}`,
      `Contact number: ${phone}`,
      email ? `Email: ${email}` : '',
      `Preferred date: ${date || 'Flexible'}`,
      `Treatment / enquiry: ${service}`,
      details ? `Message: ${details}` : '',
      '',
      'Please let me know about availability. Thank you.'
    ].filter(Boolean).join('\n');

    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
    if (successModal?.showModal) successModal.showModal();
  });
}
