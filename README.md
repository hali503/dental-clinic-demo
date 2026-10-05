# Premium Dental Care

A responsive multi-page dental clinic demo for Lahore, Pakistan. The site is
frontend-only and can be hosted on GitHub Pages, Netlify, or another static host.

## Pages and assets

- `index.html` — home page, three-slide hero, sample metrics, featured treatment,
  illustrative review slider, sample clinician profiles, and enquiry CTAs
- `services.html` — treatment information and preselected enquiry links
- `about.html` — clinic introduction and an editorial, responsive image gallery
- `contact.html` — address, phone, WhatsApp, email, hours, map, and directions
- `appointment.html` — validated appointment form that prepares a WhatsApp draft
- `premium.css` — shared responsive visual system
- `clinic-config.js` — central demo clinic details, sample profiles, and gallery
- `script.js` — navigation, reduced-motion-aware reveals, counters, sliders, and
  appointment enquiry behavior
- `assets/premium-dental-logo.svg` — generic clinic logo

## Customize the demo

Edit `clinic-config.js` to change the clinic name and tagline, city, address,
phone, WhatsApp number, email, opening hours, doctor profiles, services, gallery,
social links, logo, map, and directions. Replace all sample contact details and
content with clinic-approved information before using the site for a real clinic.
The sample phone and WhatsApp number do not route to a real business; the email
uses the reserved `example.com` domain.

The sample doctor names, qualifications, portraits, and clinic capabilities are
illustrative placeholders; they are not verified credentials or service claims.
The review cards and quotations are fictional examples, not Google reviews or
real patient feedback. Replace them with approved content or remove them before
launching a customized site.

## Run locally

From the project folder:

```bash
python -m http.server 8000
```

Open http://localhost:8000.

## Demo content

The counters describe the demo website itself, not patient outcomes or clinic
credentials. The before/after comparison and gallery use illustrative stock
photography. Confirm services, hours, address, contact details, clinician
credentials, testimonials, and treatment suitability with the clinic before
publishing a customized copy.
