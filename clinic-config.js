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
    'Routine dental care',
    'Restorative treatment',
    'Cosmetic dentistry',
    'Urgent dental enquiry',
    'Other / not sure yet'
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

  const serviceSelect = document.querySelector('#appointmentForm select[name="service"]');
  if (serviceSelect) {
    serviceSelect.replaceChildren(new Option('Choose an option', ''));
    config.services.forEach((service) => serviceSelect.add(new Option(service, service)));
  }
})();
