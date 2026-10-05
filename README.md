# Premium Dental Care

A responsive multi-page dental clinic demo for Lahore, Pakistan. The site is
frontend-only and can be hosted on GitHub Pages, Netlify, or another static host.

## Pages and assets

- `index.html` — home page, hero slider, treatment carousel, image comparison,
  illustrative review carousel, and map
- `services.html` — treatment information and enquiry links
- `about.html` — clinic introduction and image gallery
- `contact.html` — location details, map, and directions
- `appointment.html` — validated appointment form that prepares a WhatsApp draft
- `premium.css` — shared responsive visual system
- `clinic-config.js` — central demo clinic details and runtime content values
- `script.js` — navigation, animations, carousels, and enquiry behavior
- `assets/premium-dental-logo.svg` — generic clinic logo

## Customize the demo

Edit `clinic-config.js` to change the clinic name and tagline, city, address,
phone, WhatsApp number, email, opening hours, doctor and service lists, social
links, logo, map, and directions. Replace the clearly fictional contact values
before using the site for a real clinic. The sample phone and WhatsApp number do
not route to a real business; the email uses the reserved `example.com` domain.

The doctor and social-link values are starter configuration examples. Add them
to the design only after supplying verified clinic details.

## Run locally

From the project folder:

```bash
python -m http.server 8000
```

Open http://localhost:8000.

## Demo content

The review cards, patient quotes, and contact details are illustrative demo
content, not real patient testimonials or a real clinic contact channel. The
before/after comparison is explicitly illustrative stock photography. Confirm
services, hours, address, contact details, and treatment suitability with the
clinic before publishing a customized copy.
