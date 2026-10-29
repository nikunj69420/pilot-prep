# Pilot Preparation Academy — redesign

A static rebuild of pilotpreparationacademy.com: 19 pages in the "colour chapters" direction. Every section is a full-width block of one flat colour, set in a single typeface (Epilogue), with Lenis smooth scroll and GSAP motion.

## Edit and build

All copy is in `src/content.mjs`, and the page layouts are in `src/build.mjs`. After changing either file, regenerate the HTML:

```bash
node src/build.mjs
```

Styles live in `assets/css/main.css` (colour and type tokens sit at the top), and behaviour and motion live in `assets/js/main.js`. You can edit both directly; they don't need a rebuild.

## Preview

```bash
python -m http.server 5173
```

Then open http://localhost:5173.

## Design rules

- **Colours:** paper `#eef0ec`, slate `#a6b3bc`, sage `#b7c8be`, sand `#d6c4b8`, olive `#2c3620` and the logo orange `#e65d1b`. One colour per section, with no lines, gradients or shadows between them.
- **Type:** Epilogue only, in five sizes (small, body, lead, heading, display). No italics and no second typeface.
- **Header:** takes the colour of the section underneath it as you scroll.
- **Motion:** with reduced motion on, everything is shown without animation. If the scripts fail to load, all content shows after 3 seconds.

## Before going live

- **Enquiry forms:** both the quick form at the bottom of each page and the contact form open WhatsApp with the message filled in, sent to +91 93016 57163. To receive enquiries by email, connect the forms to a backend or a form service.
- **World clocks:** each destination's clock uses a reference city (Florida, Toronto, Central Europe, Auckland, Sydney, Johannesburg, Manila). Change these in `clocks` in `src/content.mjs` if your partner schools sit elsewhere.
- **Testimonials:** the old site's reviews were template placeholders ("Aviatora"), so they were removed. Add real student reviews when you have them.
- **SEO landing pages** (pilot course in Mumbai, cabin crew institute, etc.) were not rebuilt. Either redirect those URLs or add the pages.
- **Libraries:** GSAP 3.13.0 and Lenis 1.3.11 load from jsDelivr.
