# Tariq Dental Care

A responsive multi-page clinic website for Tariq Dental Care in Pakpattan, Punjab.

## Pages

- `index.html` — home page, accessible hero slider, treatment carousel, image comparison, and Google-review highlights
- `services.html` — treatment information and enquiry links
- `about.html` — clinic introduction and photos from the Google Maps listing
- `contact.html` — map, location details, and Google Maps directions
- `appointment.html` — appointment enquiry form that drafts a WhatsApp message
- `premium.css` — shared responsive visual system and interaction states
- `script.js` — shared accessible, reduced-motion-aware interactions
- `assets/tariq-dental-logo.png` — logo crop from the clinic reception photo

## Run locally

From this folder, run:

```bash
python -m http.server 8000
```

Open http://localhost:8000.

## Listing details and WhatsApp

The Google Maps listing identifies Tariq Dental Care near Al-Shafa Hospital,
Mandi Mor, Pakpattan, Pakistan, at 30.3541484, 73.3812023. When checked on
October 5, 2026, the listing showed 4.9/5 from 205 reviews, 22 photos, and
"Open · Closes 9 PM". Opening hours may vary; check the listing before visiting.
The site uses the temporary contact number supplied for this preview:
0309130600. Update the `clinicPhone` constant in `script.js` when the clinic
confirms its preferred contact number. The Google Maps listing itself displays
+92 313 7284758, which differs from the temporary number; confirm which number
should be published. The temporary number is also used to form the WhatsApp
link with Pakistan's +92 country code.

The appointment form validates the visitor's details and opens WhatsApp with a
prefilled message addressed to the temporary number. Requests open WhatsApp as
a draft and are not submitted or booked until the visitor sends the message and
the clinic confirms it.

The treatment sections are enquiry categories only. Confirm availability,
opening hours, and treatment suitability directly with the clinic.

## Review and photo sources

The homepage rating, review count, and attributed review summaries were checked
against the Google Maps listing. Summaries paraphrase public reviews; dates,
rating, and count can change. The clinic gallery and hero use images from the
listing's Google Maps photo gallery; original images and attribution remain with
their respective contributors. The before/after comparison still uses clearly
labelled illustrative photography, not Tariq Dental Care patient results.
