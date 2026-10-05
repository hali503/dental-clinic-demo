window.CLINIC_CONFIG = {
  name: 'Premium Dental Care',
  tagline: 'Advanced Dentistry & Smile Care',
  city: 'Lahore',
  country: 'Pakistan',
  location: 'Lahore, Pakistan',
  address: 'Gulberg III, Lahore, Pakistan',
  phoneDisplay: '0000 0000000',
  phoneLink: 'tel:+920000000000',
  whatsappNumber: '920000000000',
  email: 'hello@example.com',
  openingHours: 'By appointment (demo hours)',
  doctors: ['Demo clinician'],
  services: [
    'General Dentistry',
    'Dental Implants',
    'Cosmetic Dentistry',
    'Teeth Whitening',
    'Root Canal Treatment',
    'Orthodontics',
    'Smile Makeover',
    'Pediatric Dentistry',
    'Restorative Treatment',
    'Urgent dental enquiry',
    'Dental concerns & urgent enquiries',
    'Other / not sure yet'
  ],
  doctors: [
    {
      name: 'Dr. Areeba Ahmed',
      qualification: 'BDS · sample profile',
      specialty: 'Preventive & restorative care',
      description: 'An illustrative clinician profile. Replace with verified team details before launch.',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85',
      imageAlt: 'Illustrative portrait used for a demo clinician profile'
    },
    {
      name: 'Dr. Hamza Rahman',
      qualification: 'BDS · sample profile',
      specialty: 'Family dental care',
      description: 'A sample introduction showing how a clinic can present its team and approach.',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=85',
      imageAlt: 'Illustrative portrait used for a demo clinician profile'
    },
    {
      name: 'Dr. Zara Malik',
      qualification: 'BDS · sample profile',
      specialty: 'Cosmetic dentistry',
      description: 'Demo copy only. Add the clinician’s confirmed qualifications and specialty here.',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=85',
      imageAlt: 'Illustrative portrait used for a demo clinician profile'
    }
  ],
  gallery: [
    {
      image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=85',
      alt: 'Illustrative dental-care scene used in the customizable clinic gallery'
    },
    {
      image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1000&q=85',
      alt: 'Illustrative dental consultation used in the customizable clinic gallery'
    },
    {
      image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1000&q=85',
      alt: 'Illustrative dental equipment used in the customizable clinic gallery'
    },
    {
      image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=85',
      alt: 'Illustrative healthcare-professional portrait used in the customizable clinic gallery'
    },
    {
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=85',
      alt: 'Illustrative dental-clinician portrait used in the customizable clinic gallery'
    }
  ],
  socialLinks: {
    instagram: 'https://example.com/instagram',
    facebook: 'https://example.com/facebook',
    linkedin: 'https://example.com/linkedin'
  },
  logo: 'assets/premium-dental-logo.svg',
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Gulberg%20III%2C%20Lahore%2C%20Pakistan',
  mapEmbedUrl: 'https://maps.google.com/maps?q=Gulberg%20III%2C%20Lahore%2C%20Pakistan&z=13&output=embed',
  demoNote: 'Customizable clinic demo · sample content for illustration'
};

(() => {
  const config = window.CLINIC_CONFIG;
  const values = {
    clinicName: config.name,
    tagline: config.tagline,
    city: config.city,
    country: config.country,
    location: config.location,
    address: config.address,
    phone: config.phoneDisplay,
    phoneLink: config.phoneDisplay,
    email: config.email,
    hours: config.openingHours,
    demoNote: config.demoNote
  };
  const tokenPattern = /\{\{([a-zA-Z]+)\}\}/g;
  const replaceTokens = (value) => value.replace(tokenPattern, (token, key) => values[key] ?? token);
  const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;

  while ((node = textWalker.nextNode())) {
    node.nodeValue = replaceTokens(node.nodeValue);
  }

  document.querySelectorAll('*').forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const value = replaceTokens(attribute.value);
      if (value !== attribute.value) element.setAttribute(attribute.name, value);
    });
  });

  document.title = replaceTokens(document.title);
  document.querySelectorAll('meta[name="description"]').forEach((meta) => {
    meta.content = replaceTokens(meta.content);
  });
  const description = document.querySelector('meta[name="description"]')?.content || '';
  const openGraph = {
    'og:site_name': config.name,
    'og:title': document.title,
    'og:description': description,
    'og:image': new URL(config.logo, document.baseURI).href
  };
  Object.entries(openGraph).forEach(([property, content]) => {
    const meta = document.querySelector(`meta[property="${property}"]`);
    if (meta) meta.content = content;
  });
  document.querySelectorAll('link[rel="icon"]').forEach((icon) => {
    icon.href = config.logo;
  });
  document.querySelectorAll('.brand-icon').forEach((logo) => {
    logo.src = config.logo;
  });
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.href = config.phoneLink;
  });
  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.href = `mailto:${config.email}`;
  });
  document.querySelectorAll('[data-clinic-directions]').forEach((link) => {
    link.href = config.directionsUrl;
  });
  document.querySelectorAll('[data-clinic-map]').forEach((map) => {
    map.src = config.mapEmbedUrl;
  });
  document.querySelectorAll('[data-clinic-whatsapp]').forEach((link) => {
    link.href = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(`Hello ${config.name}, I would like to enquire.`)}`;
  });

  document.querySelectorAll('img:not([loading]):not(.brand-icon)').forEach((image) => {
    if (image.closest('.hero-image')) return;
    image.loading = 'lazy';
    image.decoding = 'async';
  });

  document.querySelectorAll('.nav-cta').forEach((link) => {
    link.firstChild.textContent = 'Book Appointment ';
  });

  const contactDetails = document.querySelector('.contact-details');
  if (contactDetails) {
    const actions = contactDetails.querySelector('.button-dark');
    const emailRow = document.createElement('div');
    emailRow.className = 'detail-row';
    const emailIcon = document.createElement('span');
    emailIcon.className = 'detail-icon';
    emailIcon.setAttribute('aria-hidden', 'true');
    emailIcon.textContent = '@';
    const emailDetails = document.createElement('div');
    const emailLabel = document.createElement('strong');
    emailLabel.textContent = 'Email';
    const emailAddress = document.createElement('a');
    emailAddress.href = `mailto:${config.email}`;
    emailAddress.textContent = config.email;
    const emailText = document.createElement('p');
    emailText.append(emailAddress);
    emailDetails.append(emailLabel, emailText);
    emailRow.append(emailIcon, emailDetails);
    if (actions) contactDetails.insertBefore(emailRow, actions);
  }

  document.querySelectorAll('.footer-main > div:nth-child(3)').forEach((footerContact) => {
    const phoneLink = document.createElement('a');
    phoneLink.href = config.phoneLink;
    phoneLink.textContent = `Call ${config.phoneDisplay}`;
    const appointmentLink = document.createElement('a');
    appointmentLink.href = 'appointment.html';
    appointmentLink.className = 'footer-link';
    appointmentLink.textContent = 'Book an appointment ↗';
    const whatsappLink = document.createElement('a');
    whatsappLink.href = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(`Hello ${config.name}, I would like to enquire.`)}`;
    whatsappLink.target = '_blank';
    whatsappLink.rel = 'noopener noreferrer';
    whatsappLink.textContent = 'WhatsApp the clinic ↗';
    footerContact.append(phoneLink, appointmentLink, whatsappLink);

    const socialLinks = document.createElement('div');
    socialLinks.className = 'footer-social-links';
    socialLinks.setAttribute('aria-label', 'Social media links');
    Object.entries(config.socialLinks).forEach(([network, url]) => {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = network[0].toUpperCase() + network.slice(1);
      socialLinks.append(link);
    });
    footerContact.append(socialLinks);
  });

  const gallery = document.querySelector('.clinic-gallery-grid');
  if (gallery) {
    config.gallery.forEach((item, index) => {
      const figure = gallery.children[index] || document.createElement('figure');
      figure.className = `gallery-image gallery-image-${index + 1}`;
      const image = document.createElement('img');
      image.src = item.image;
      image.alt = item.alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      const caption = document.createElement('figcaption');
      caption.textContent = 'ILLUSTRATIVE DEMO PHOTOGRAPHY';
      figure.replaceChildren(image, caption);
      if (!figure.parentElement) gallery.append(figure);
    });
    Array.from(gallery.children).slice(config.gallery.length).forEach((figure) => figure.remove());
  }

  const doctorGrid = document.querySelector('[data-doctor-grid]');
  if (doctorGrid) {
    config.doctors.forEach((doctor, index) => {
      const card = document.createElement('article');
      card.className = 'doctor-card reveal';
      card.style.setProperty('--reveal-delay', `${index * 90}ms`);

      const imageFrame = document.createElement('div');
      imageFrame.className = 'doctor-image';
      const image = document.createElement('img');
      image.src = doctor.image;
      image.alt = doctor.imageAlt;
      image.loading = 'lazy';
      image.decoding = 'async';
      imageFrame.append(image);

      const details = document.createElement('div');
      details.className = 'doctor-details';
      const qualification = document.createElement('span');
      qualification.className = 'doctor-qualification';
      qualification.textContent = doctor.qualification;
      const name = document.createElement('h3');
      name.textContent = doctor.name;
      const specialty = document.createElement('p');
      specialty.className = 'doctor-specialty';
      specialty.textContent = doctor.specialty;
      const description = document.createElement('p');
      description.className = 'doctor-description';
      description.textContent = doctor.description;
      details.append(qualification, name, specialty, description);
      card.append(imageFrame, details);
      doctorGrid.append(card);
    });
  }

  const serviceSelect = document.querySelector('#appointmentForm select[name="service"]');
  if (serviceSelect) {
    serviceSelect.replaceChildren(new Option('Choose an option', ''));
    config.services.forEach((service) => serviceSelect.add(new Option(service, service)));
  }
})();
