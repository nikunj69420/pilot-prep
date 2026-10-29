// Static site generator for Pilot Preparation Academy.
// Run: node src/build.mjs  → writes every page as plain HTML into the project root.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  site, countries, amenities, clocks, featureGroups, services, facilities, faqs,
  subjects, kit, courses, courseCats, posts, gallery,
} from './content.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(ROOT, 'assets', 'img');

const CDN = {
  gsap: 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js',
  st: 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js',
  flip: 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/Flip.min.js',
  lenis: 'https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.min.js',
};

/* ---------- helpers ---------- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (s) => parseInt(s, 10);
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

function imageSize(file) {
  const b = readFileSync(file);
  if (b.toString('ascii', 1, 4) === 'PNG') return [b.readUInt32BE(16), b.readUInt32BE(20)];
  const chunk = b.toString('ascii', 12, 16);
  if (chunk === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (chunk === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  if (chunk === 'VP8L') {
    const b0 = b[21], b1 = b[22], b2 = b[23], b3 = b[24];
    return [1 + (b0 | ((b1 & 0x3f) << 8)), 1 + ((b1 >> 6) | (b2 << 2) | ((b3 & 0x0f) << 10))];
  }
  throw new Error('Unknown image format: ' + file);
}

function img(name, alt, { cls = '', eager = false, ext = 'webp', attrs = '' } = {}) {
  const file = join(IMG, `${name}.${ext}`);
  if (!existsSync(file)) throw new Error('Missing image: ' + file);
  const [w, h] = imageSize(file);
  return `<img src="assets/img/${name}.${ext}" width="${w}" height="${h}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''}${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"${attrs ? ' ' + attrs : ''}>`;
}

const ICONS = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true" focusable="false"><path d="M4 12h15M13 5.5l6.5 6.5-6.5 6.5"/></svg>',
  bigArrow: '<svg viewBox="0 0 72 72" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="square" aria-hidden="true" focusable="false"><path d="M16 56L56 16M24 16h32v32"/></svg>',
  wideArrow: '<svg viewBox="0 0 96 48" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="square" aria-hidden="true" focusable="false"><path d="M4 24h84M66 4l22 20-22 20"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true" focusable="false"><path d="M5 5l14 14M19 5L5 19"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M6 3.5v17l15-8.5z"/></svg>',
};

const btn = (label, href, variant = '', extra = '') =>
  `<a class="btn${variant ? ' btn--' + variant : ''}" href="${href}"${extra ? ' ' + extra : ''}>${label}${ICONS.arrow}</a>`;

// A heading whose lines rise from behind their own baseline. Lines are authored, never more than two.
const lines = (parts) => parts.map((p, i) => `<span class="line-mask"><span style="--i:${i}">${p}</span></span>`).join('');
const heading = (tag, cls, parts, attrs = '') => `<${tag} class="${cls}" data-lines${attrs ? ' ' + attrs : ''}>${lines(parts)}</${tag}>`;

const countryHref = (c) => `training-${c.slug}.html`;
const fieldOf = (i) => ['sky', 'sage', 'sand'][i % 3];
const mapsUrl = `https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(site.mapsQuery)}`;

/* ---------- shared chrome ---------- */
const navLinks = [
  ['become-a-pilot.html', 'Become a pilot'],
  ['dgca-ground-classes.html', 'DGCA classes'],
  ['flight-training.html', 'Flight training'],
  ['courses.html', 'Courses'],
  ['about.html', 'About'],
];
const allPages = [
  ['index.html', 'Home'], ['become-a-pilot.html', 'Become a pilot'], ['dgca-ground-classes.html', 'DGCA ground classes'],
  ['flight-training.html', 'Flight training'], ['services.html', 'Services'], ['courses.html', 'Courses'],
  ['about.html', 'About'], ['gallery.html', 'Gallery'], ['blog.html', 'Blog'], ['contact.html', 'Contact'],
];

function head({ title, description, file, needs = [] }) {
  const scripts = [CDN.gsap, CDN.st, ...needs.map((n) => CDN[n]), CDN.lenis]
    .map((s) => `<script src="${s}" defer></script>`).join('\n  ');
  const url = `${site.url}/${file === 'index.html' ? '' : file}`;
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#eef0ec">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${site.url}/assets/img/hero-cockpit.webp">
  <link rel="icon" type="image/png" href="assets/img/logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;900&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/main.css">
  <script>
    (function (h) {
      h.classList.remove('no-js'); h.classList.add('js');
      if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      h.classList.add('anim');
      // Never leave content hidden if the motion libraries fail to load.
      setTimeout(function () { if (!window.__ppaReady) h.classList.remove('anim'); }, 3000);
    })(document.documentElement);
  </script>
  ${scripts}
  <script src="assets/js/main.js" defer></script>
</head>`;
}

function header(active) {
  const isCountry = active.startsWith('training-');
  const cur = (h) => (h === active || (isCountry && h === 'flight-training.html') ? ' aria-current="page"' : '');
  return `
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="header" id="top">
    <a class="brand" href="index.html" aria-label="${site.name}, home">
      <img src="assets/img/logo.png" width="400" height="174" alt="">
      <span>Pilot Preparation Academy</span>
    </a>
    <nav class="nav" aria-label="Primary">
      ${navLinks.map(([h, l]) => `<a href="${h}"${cur(h)}>${l}</a>`).join('\n      ')}
    </nav>
    <div class="header__end">
      <button class="menu-word" type="button" aria-expanded="false" aria-controls="menu">Menu</button>
      ${btn('Free counselling', 'contact.html#enquire', 'sm')}
    </div>
  </header>

  <div class="menu f-olive" id="menu" role="dialog" aria-modal="true" aria-label="Site menu" hidden>
    <div class="menu__top">
      <a class="brand" href="index.html" aria-label="${site.name}, home"><img src="assets/img/logo.png" width="400" height="174" alt=""><span>Pilot Preparation Academy</span></a>
      <button class="menu-word" type="button" data-menu-close>Close</button>
    </div>
    <div class="menu__body">
      <nav class="menu__main" aria-label="All pages">
        ${allPages.map(([h, l], i) => `<a href="${h}" style="--i:${i}"${cur(h)}>${l}</a>`).join('\n        ')}
      </nav>
      <div class="menu__side">
        <div style="--i:4">
          <h2>Flight training in</h2>
          <div class="menu__countries">${countries.map((c) => `<a href="${countryHref(c)}"${c.slug && countryHref(c) === active ? ' aria-current="page"' : ''}>${c.name}</a>`).join('')}</div>
        </div>
        <div style="--i:6">${btn('Book free counselling', 'contact.html#enquire')}</div>
      </div>
    </div>
    <div class="menu__foot">
      <a href="${site.phoneHref}">${site.phone}</a>
      <a href="mailto:${site.email}">${site.email}</a>
      <span>Andheri West, Mumbai</span>
    </div>
  </div>
`;
}

// The closing chapter on every page: a strip of photographs and a three-cell enquiry bar.
function strip({ title = ['Talk to a', 'counsellor'], text = 'Free, honest counselling. Leave your name and number, and your message opens in WhatsApp ready to send.' } = {}) {
  const pics = ['g-01', 'g-09', 'g-16', 'g-05', 'g-10', 'g-17', 'g-02', 'g-14', 'g-13', 'g-07', 'g-18', 'g-11', 'g-20', 'g-06'];
  const set = pics.map((p) => img(p, '')).join('');
  return `
    <section class="strip f-olive" data-chapter aria-labelledby="strip-title">
      <div class="strip__photos" aria-hidden="true"><div class="strip__track" data-marquee>${set}${set}</div></div>
      <div class="strip__body">
        <div class="strip__top">
          ${heading('h2', 'head', title, 'id="strip-title"')}
          <p class="lead" data-rise>${text}</p>
        </div>
        <form class="bar" data-enquiry data-quick novalidate data-rise style="--d:80ms">
          <div class="bar__cell field"><label class="sr-only" for="q-name">Your name</label><input id="q-name" name="name" type="text" autocomplete="name" placeholder="Your name" required></div>
          <div class="bar__cell field"><label class="sr-only" for="q-phone">Phone number</label><input id="q-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="Phone number" required></div>
          <div class="bar__cell"><button type="submit">Send on WhatsApp ${ICONS.arrow}</button></div>
        </form>
        <div class="bar__notes">
          <p>Or call ${site.phoneName} on <a href="${site.phoneHref}">${site.phone}</a></p>
          <p class="form-status" role="status" aria-live="polite" data-status></p>
          <p>Prefer email? <a href="mailto:${site.email}">${site.email}</a></p>
        </div>
      </div>
    </section>`;
}

function footer() {
  return `
  <footer class="foot" data-chapter>
    <div class="ftile ftile--about f-sky">
      <p>The most genuine ground classes in India, founded by Capt. Guru Chaudhary to keep aviation training honest and affordable.</p>
      <p class="legal">© 2026 ${site.name}. All rights reserved.</p>
    </div>
    <nav class="ftile ftile--nav f-sage" aria-label="Footer">
      <h2>Pages</h2>
      <ul>${allPages.slice(1).map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ul>
    </nav>
    <div class="ftile ftile--city f-sand">
      <h2>Andheri West, Mumbai</h2>
      <p>It is now <b data-clock="Asia/Kolkata">&nbsp;</b>in Mumbai</p>
      <a href="${mapsUrl}" target="_blank" rel="noopener">Wing A, 2nd Floor, Best Building</a>
    </div>
    <div class="ftile ftile--mail f-paper" style="--bg-2:var(--paper-2);background:var(--paper-2)">
      <div><h2>Write or call</h2><a class="big" href="mailto:${site.email}">${site.email}</a></div>
      <div class="socials"><a href="${site.phoneHref}">${site.phone}</a><a href="${site.instagram}" target="_blank" rel="noopener">Instagram</a><a href="${site.facebook}" target="_blank" rel="noopener">Facebook</a><a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></div>
    </div>
    <div class="ftile ftile--word f-ink" aria-hidden="true"><p>Pilot Preparation<br>Academy</p></div>
    <a class="ftile ftile--go f-flame" href="contact.html#enquire"><span>Book your free counselling</span>${ICONS.bigArrow}</a>
  </footer>
`;
}

function page({ file, title, description, body, needs = [], active = file, closer = true }) {
  const html = `${head({ title, description, file, needs })}
${header(active)}
  <main id="main">
${body}
${closer ? strip(typeof closer === 'object' ? closer : {}) : ''}
  </main>
${footer()}
</body>
</html>
`;
  writeFileSync(join(ROOT, file), html);
  console.log('built', file);
}

// Inner-page opener: one field of colour, the title bottom-left, one photograph on the right.
function opener({ field, title, lead, pic, alt = '', facts = '', display = false }) {
  return `
    <section class="opener f-${field}${pic ? '' : ' opener--nopic'}" data-chapter>
      <div class="opener__text">
        ${heading('h1', display ? 'display' : 'head', title)}
        ${lead ? `<p class="lead" data-rise style="--d:200ms">${lead}</p>` : ''}
        ${facts ? `<div class="opener__facts" data-rise style="--d:300ms">${facts}</div>` : ''}
      </div>
      ${pic ? `<figure class="opener__pic" data-shutter>${img(pic, alt, { eager: true })}</figure>` : ''}
    </section>`;
}

/* ---------- reusable sections ---------- */
const steps = [
  ['Check eligibility', 'You need to be 17 or older, with 10+2 in Physics and Maths and good English. From commerce or arts? Clear Maths and Physics through an open school such as NIOS.', 'g-15', 'Student pilots in uniform'],
  ['Clear your medicals', 'Class 2 first, anywhere in India with DGCA-appointed doctors. Then Class 1, in Mumbai, Bengaluru, Delhi, Chennai or Jorhat.', 'medical', 'Pilots and crew walking through a terminal'],
  ['Get your computer number', 'Your DGCA ID for every licensing exam. Our team checks your documents, files the application and follows it up until it is issued.', 'computer-number', 'Trainee pilot at a simulator'],
  ['DGCA ground classes', 'Navigation, Regulations, Meteorology, RTR and Technical, then the exams. Live or recorded, in Hindi or English, online or in Mumbai.', 'ground-classes', 'Students in a ground class'],
  ['Flight training', 'Build your hours at a verified flight school in India, or in one of seven other countries we work with.', 'g-17', 'Student flying with an instructor'],
  ['Commercial licence', 'Earn your CPL, then prepare for airline selection, cadet programmes and type rating with us.', 'cockpit-pilot', 'Two pilots at the controls of an airliner'],
];

function stepsSection({ field = 'paper', title = ['Six steps to', 'the cockpit'], text = 'From your first medical to your commercial licence. Choose a step to see what it involves.' } = {}) {
  return `
    <section class="steps f-${field}" data-chapter aria-labelledby="steps-title">
      <div class="steps__intro">
        ${heading('h2', 'head', title, 'id="steps-title"')}
        <p class="lead" data-rise>${text}</p>
      </div>
      <div class="acc" data-acc data-rise style="--d:100ms">
        ${steps.map(([t, d, p, a], i) => `<div class="acc__panel${i === 0 ? ' is-open' : ''}">
          <button class="acc__btn" type="button" aria-expanded="${i === 0}" aria-controls="step-${i}"><span class="acc__sliver">${t}</span></button>
          <div class="acc__open" id="step-${i}">
            <div class="acc__text"><h3>${t}</h3><p>${d}</p></div>
            <div class="acc__pic">${img(p, a)}</div>
          </div>
        </div>`).join('\n        ')}
      </div>
    </section>`;
}

function faqBands({ withHead = true } = {}) {
  return `
    <section class="bands f-paper" id="faq" data-chapter aria-labelledby="faq-title">
      ${withHead ? `<div class="band__head f-flame">
        ${heading('h2', 'head', ['Straight', 'answers'], 'id="faq-title"')}
        <p data-rise>Still unsure? <a class="link" href="contact.html#enquire">Ask a counsellor</a>. It is free.</p>
      </div>` : ''}
      ${faqs.map((f) => `<div class="band">
        <h3 class="band__q" data-rise>${f.q}</h3>
        <div class="band__a" data-rise style="--d:80ms">${f.a.map((p) => `<p>${p}</p>`).join('')}${f.list ? `<ul>${f.list.map((l) => `<li>${l}</li>`).join('')}</ul>` : ''}</div>
      </div>`).join('\n      ')}
    </section>`;
}

function clockBoard({ field = 'sky' } = {}) {
  return `
    <section class="clocks f-${field}" data-chapter aria-labelledby="clocks-title">
      <div class="clocks__head">
        ${heading('h2', 'head', ['Time there,', 'right now'], 'id="clocks-title"')}
        <p class="lead" data-rise>Training abroad means calls home. Here is the local time at each destination.</p>
        <p class="clocks__now" data-rise style="--d:80ms">In Mumbai it is <b data-clock="Asia/Kolkata">&nbsp;</b></p>
      </div>
      <table class="clocks__table" data-rise style="--d:120ms">
        <caption class="sr-only">Local time at each training destination</caption>
        <thead class="sr-only"><tr><th scope="col">Destination</th><th scope="col">Local time</th><th scope="col" class="clocks__diff">Against Mumbai</th></tr></thead>
        <tbody>
          ${countries.map((c) => `<tr><td><a href="${countryHref(c)}">${c.name}</a></td><td class="clocks__time"><span data-clock="${clocks[c.slug].tz}">&nbsp;</span><small>in ${clocks[c.slug].city}</small></td><td class="clocks__diff" data-diff="${clocks[c.slug].tz}">&nbsp;</td></tr>`).join('\n          ')}
        </tbody>
      </table>
    </section>`;
}

function servicesMenu({ field = 'sand', title = ['From first call', 'to first flight'] } = {}) {
  const tags = { counselling: 'Free', 'ground-classes': 'Hindi or English', 'computer-number': 'First attempt', 'flight-schools': '8 countries', cpp: 'IndiGo, Air India', 'type-rating': 'B737, A320, ATR', 'airline-prep': 'Mock interviews' };
  const groups = [['On the ground', services.slice(0, 3)], ['Into the air', services.slice(3)]];
  return `
    <section class="menu-list f-${field}" data-chapter aria-labelledby="svc-title">
      <div class="menu-list__head">
        ${heading('h2', 'head', title, 'id="svc-title"')}
        <p class="lead" data-rise>Seven services and one team that stays with you, from the first counselling call to the airline interview.</p>
      </div>
      ${groups.map(([name, list]) => `<div class="menu-cat">
        <div class="menu-cat__title" data-rise><h3 class="h-lead" style="font-size:var(--step-head);letter-spacing:-0.04em;line-height:.95">${name}</h3><span>${plural(list.length, 'service')}</span></div>
        <div class="menu-items">
          ${list.map((s, i) => `<a class="mitem" href="services.html#${s.slug}" data-rise style="--d:${(i % 2) * 70}ms">
            <span class="mitem__pic">${img(s.img, '')}</span>
            <span><span class="mitem__top"><h3>${s.title}</h3><span>${tags[s.slug]}</span></span><p>${s.text}</p></span>
          </a>`).join('\n          ')}
        </div>
      </div>`).join('\n      ')}
    </section>`;
}

/* ======================================================================
   PAGES
   ====================================================================== */

/* ---------- Home ---------- */
function home() {
  const title = ['Ground school', 'for pilots'];
  const titleLines = title.map((t, i) => `<span class="line-mask"><span style="--i:${i}">${t}</span></span>`).join('');
  const cardTones = ['sky', 'sage', 'sand'];

  const body = `
    <section class="hero" data-chapter data-hero>
      <div class="hero__ground" aria-hidden="true"></div>
      <h1 class="hero__title" data-hero-title><span class="hero__copy hero__copy--sky">${titleLines}</span><span class="hero__copy hero__copy--ground" aria-hidden="true">${titleLines}</span></h1>
      <div class="hero__intro">
        <p style="--d:520ms">DGCA ground classes in Andheri West, Mumbai, in Hindi or English, and the way into flight schools in eight countries.</p>
        <div style="--d:620ms">${btn('Book free counselling', 'contact.html#enquire', 'ink')}</div>
      </div>
      <div class="hero__after">
        <span>Live and recorded classes, online or in Mumbai</span>
        <span>Counselling is always free</span>
      </div>
    </section>

    <section class="tiles" data-chapter aria-labelledby="value-title">
      <div class="tile tile--a f-olive">
        ${heading('h2', 'tile__big', ['Value', 'over hype'], 'id="value-title"')}
      </div>
      <div class="tile tile--b f-sand" data-rise>
        <p class="tile__big">50%</p>
        <p class="tile__note">Fees up to 50% lower than other academies, and payable in two instalments.</p>
      </div>
      <figure class="tile tile--c" data-shutter>${img('classroom', 'Students in a live ground class at the academy in Mumbai')}</figure>
      <div class="tiles__text">
        <div class="tiles__who" data-rise>
          ${img('team-guru', 'Capt. Guru Chaudhary')}
          <p><b>Capt. Guru Chaudhary</b>Founder, AFI, TR A320</p>
        </div>
        <div class="tiles__body" data-rise style="--d:80ms">
          <p>Prices in pilot training often climb on hype. Pilot Preparation Academy was founded to protect aspiring pilots from that, with honest fees, real mentorship and teaching that genuinely prepares you for the exams and the cockpit.</p>
          <p class="tiles__aside">To bridge the gap between ground classes and actual flying, we bring Microsoft Flight Simulator into training, so theory turns into feel.</p>
          <a class="arrow-link" href="about.html">More about the academy ${ICONS.arrow}</a>
        </div>
      </div>
    </section>

    <section class="pinrows f-sage" data-chapter aria-labelledby="why-title">
      <div class="pinrows__head">
        ${heading('h2', 'head', ['Built to', 'pass'], 'id="why-title"')}
        <p class="lead" data-rise>We have students from every major academy. Many of them simply found us late.</p>
      </div>
      <div class="pinrows__list">
        ${featureGroups.map((g) => `<div class="prow">
          <h3 class="h-lead" data-rise>${g.title}</h3>
          <div class="prow__body">
            <figure class="prow__pic" data-shutter>${img(g.img, g.alt)}</figure>
            <ul data-rise style="--d:80ms">${g.items.map((it) => `<li>${it}</li>`).join('')}</ul>
          </div>
        </div>`).join('\n        ')}
      </div>
    </section>

    <section class="held" data-chapter data-held aria-labelledby="dest-title">
      <div class="held__stage">
        <div class="held__bg" aria-hidden="true">${img('cockpit-pilot', '')}</div>
        <div class="held__track" data-held-track>
          <div class="held__intro">
            ${heading('h2', 'head', ['Eight', 'countries'], 'id="dest-title"')}
            <p data-rise>Fly where it suits your budget, time and goals. We only send students to verified schools, and we tell you the honest pros and cons of each.</p>
            <a class="arrow-link" href="flight-training.html" data-rise style="--d:80ms">Compare all eight ${ICONS.arrow}</a>
          </div>
          ${countries.map((c, i) => `<a class="card f-${cardTones[i % 3]}" href="${countryHref(c)}">
            <span class="card__pic">${img(`${c.slug}-1`, `Flight training in ${c.name}`)}</span>
            <span class="card__panel"><h3>${c.name}</h3><p>Licence <b>${c.authority}</b>${plural(num(c.schools), 'partner school')}</p></span>
          </a>`).join('\n          ')}
        </div>
        <p class="held__count" aria-hidden="true" data-held-count>1 of ${countries.length}</p>
      </div>
    </section>
${clockBoard()}
${stepsSection()}
${servicesMenu()}
${faqBands()}`;

  page({
    file: 'index.html',
    title: 'Pilot Preparation Academy: DGCA Ground Classes and Pilot Training in Mumbai',
    description: 'The most genuine DGCA ground classes in India. Live and recorded lectures in Hindi and English, free aviation counselling, computer number support and partner flight schools in 8 countries.',
    body,
  });
}

/* ---------- About ---------- */
function about() {
  const values = [
    ['Our vision', 'To empower aspiring pilots with world-class training, knowledge and discipline for successful, safe and global aviation careers, fostering leadership, resilience and a passion for excellence in every flight.'],
    ['Our mission', 'To deliver exceptional aviation education, hands-on experience and personalised mentorship that shape confident, competent and industry-ready pilots, with integrity, adaptability and a lifelong commitment to safety.'],
    ['Our motto', 'Fly with purpose, embrace excellence in training, and soar as a leader in the skies, with integrity, discipline and determination guiding every flight.'],
  ];
  const body = `${opener({ field: 'sand', title: ['About the', 'academy'], lead: 'The leading aviation ground class provider in India, built on genuine value, real mentorship and transparency.', pic: 'pilot-salute', alt: 'Pilot in uniform saluting' })}

    <section class="duo f-paper" data-chapter aria-labelledby="who-title">
      <figure class="duo__pic" data-shutter>${img('classroom', 'Students in a ground class at Pilot Preparation Academy')}</figure>
      <div class="duo__text">
        ${heading('h2', 'head', ['A home for', 'future pilots'], 'id="who-title"')}
        <div class="prose" data-rise>
          <p>Pilot Preparation Academy was founded by <strong>Capt. Guru Chaudhary</strong> in response to the need for high-quality, affordable aviation knowledge. We give aspiring pilots top-notch training and honest guidance.</p>
          <p>Our mission is simple: detailed learning and free counselling for future pilots, with the skills and values they need to excel in their careers. Every student should feel valued and supported, all the way to the cockpit.</p>
        </div>
        <div data-rise>${btn('Talk to us', 'contact.html#enquire')}</div>
      </div>
    </section>

    <section class="bands f-paper" data-chapter aria-labelledby="values-title">
      <div class="band__head f-sage">
        ${heading('h2', 'head', ['What we', 'stand for'], 'id="values-title"')}
        <p data-rise>Three lines we hold ourselves to, in every class and every call.</p>
      </div>
      ${values.map(([t, d]) => `<div class="band"><h3 class="band__q" data-rise>${t}</h3><div class="band__a" data-rise style="--d:80ms"><p class="lead" style="max-width:none">${d}</p></div></div>`).join('\n      ')}
    </section>

    <section class="team f-sky" data-chapter aria-labelledby="team-title">
      ${heading('h2', 'head', ['The people', 'in your corner'], 'id="team-title"')}
      <div class="team__grid">
        <article class="person" data-rise><figure class="person__pic">${img('team-guru', 'Guru Chaudhary')}</figure><div><h3>Guru Chaudhary</h3><p>Co-founder and CEO</p></div></article>
        <article class="person" data-rise style="--d:90ms"><figure class="person__pic">${img('team-rishi', 'Rishi Chaudhary')}</figure><div><h3>Rishi Chaudhary</h3><p>Co-founder and Head of Academics</p></div></article>
      </div>
    </section>`;
  page({ file: 'about.html', title: 'About Us | Pilot Preparation Academy', description: 'Meet Pilot Preparation Academy: founded by Capt. Guru Chaudhary to make aviation training honest and affordable. Our vision, mission and team.', body });
}

/* ---------- Become a pilot ---------- */
function becomePilot() {
  const medical = [
    ['Class 2 medical', 'Done anywhere in India with DGCA-appointed doctors. You receive a CA-35 form as fitness certification, your reports go to the DGCA, and the DGCA issues your final medical assessment.', 'medical', 'Pilots and crew walking through a terminal'],
    ['Class 1 medical', 'The initial Class 1 assessment is available in five cities: Mumbai, Bengaluru, Delhi, Chennai and Jorhat. You can request it only after the DGCA issues your Class 2 assessment.', 'g-05', 'Pilot in a flight helmet in the cockpit'],
    ['Your file number', 'A permanent, unique number printed on your Class 2 assessment. Every document you send to the DGCA is filed against it for the rest of your career.', 'dgca-process', 'DGCA paperwork for a pilot licence'],
  ];
  const body = `${opener({ field: 'sage', title: ['Become', 'a pilot'], lead: 'Commercial airliner or private jet, the road to the cockpit takes dedication, training and the right guidance. Here is the route.', pic: 'crew-smiling', alt: 'Smiling pilot with cabin crew', display: true })}
${stepsSection({ field: 'paper', text: 'From medical checks to your licence, each step shapes a skilled, responsible pilot.' })}

    <section class="board f-paper" data-chapter aria-labelledby="req-title">
      <div class="board__tile board__tile--head f-olive" style="grid-column:1/7;grid-row:span 2">
        ${heading('h2', 'head', ['What it', 'takes'], 'id="req-title"')}
        <p class="lead" data-rise>The minimum to enrol for CPL training. Not sure you qualify? Free counselling will tell you honestly.</p>
      </div>
      <div class="board__tile f-sand" style="grid-column:7/10" data-rise><p class="tile__big">17</p><div><h3>Minimum age</h3><p>Start training at 17. The CPL is issued at 18, about a year later.</p></div></div>
      <div class="board__tile f-sky" style="grid-column:10/13" data-rise><p class="tile__big">50%</p><div><h3>In 10+2</h3><p>The usual minimum score, which may vary by institute.</p></div></div>
      <div class="board__tile f-sage" style="grid-column:7/10" data-rise><p class="tile__big">PCM</p><div><h3>Physics and Maths</h3><p>Or pass them separately through an open school such as NIOS.</p></div></div>
      <div class="board__tile f-paper" style="grid-column:10/13;background:var(--paper-2)" data-rise><p class="tile__big">Cl. 2</p><div><h3>Medical</h3><p>A Class 2, then a Class 1 medical, from DGCA-approved examiners.</p></div></div>
      <div class="board__tile f-sky" style="grid-column:1/9" data-rise><h3 style="font-size:var(--step-head);letter-spacing:-.04em;line-height:.95">English</h3><p>Reading, writing and understanding English is essential to enrol in a CPL course, and to talk to air traffic control every day after it.</p></div>
      <figure class="board__tile board__tile--pic" style="grid-column:9/13" data-shutter>${img('g-15', 'Student pilots in uniform')}</figure>
    </section>

    <section class="pinrows f-sky" data-chapter aria-labelledby="med-title">
      <div class="pinrows__head">
        ${heading('h2', 'head', ['Fit to fly,', 'first'], 'id="med-title"')}
        <p class="lead" data-rise>Be sure you are medically fit before you spend on a pilot course. It is mandatory, and it comes in two steps.</p>
      </div>
      <div class="pinrows__list">
        ${medical.map(([t, d, p, a]) => `<div class="prow">
          <h3 class="h-lead" data-rise>${t}</h3>
          <div class="prow__body"><figure class="prow__pic" data-shutter>${img(p, a)}</figure><p data-rise style="--d:80ms">${d}</p></div>
        </div>`).join('\n        ')}
      </div>
    </section>`;
  page({ file: 'become-a-pilot.html', title: 'How to Become a Pilot in India | Pilot Preparation Academy', description: 'The step-by-step roadmap to becoming a commercial pilot in India: eligibility, Class 2 and Class 1 medicals, computer number, DGCA ground classes and flight training.', body, closer: { title: ['Not sure where', 'to start?'], text: 'At school, in college or changing careers? We will map your route to the cockpit, free.' } });
}

/* ---------- DGCA ground classes ---------- */
function dgca() {
  const tones = { NAV: ['sage', 'grid-column:7/13'], MET: ['sand', 'grid-column:7/10'], REG: ['sky', 'grid-column:10/13'], RTR: ['sand', 'grid-column:1/5'], TECH: ['sky', 'grid-column:5/9'] };
  const short = { NAV: 'Nav', MET: 'Met', REG: 'Regs', RTR: 'RTR', TECH: 'Tech' };
  const order = ['NAV', 'MET', 'REG', 'RTR', 'TECH'];
  const byCode = Object.fromEntries(subjects.map((s) => [s.code, s]));
  const body = `${opener({ field: 'sky', title: ['DGCA ground', 'classes'], lead: 'Live and recorded classes in Hindi or English, online or in Mumbai, built around exactly what the DGCA exams test.', pic: 'simulator-class', alt: 'Instructor teaching with a model aircraft', facts: '<span><b>2 languages</b>Hindi and English</span><span><b>Live + recorded</b>Rewatch every lecture</span><span><b>2.5 months</b>Offline in Mumbai</span>' })}

    <section class="board f-paper" data-chapter aria-labelledby="syl-title">
      <div class="board__tile board__tile--head f-ink" style="grid-column:1/7;grid-row:span 2">
        ${heading('h2', 'head', ['Five subjects,', 'one syllabus'], 'id="syl-title"')}
        <p class="lead" data-rise>Master these and you walk into every exam with confidence, and into the cockpit with real understanding.</p>
      </div>
      ${order.map((code, i) => { const s = byCode[code]; return `<div class="board__tile f-${tones[code][0]}" style="${tones[code][1]};--d:${i * 60}ms" data-rise><p class="tile__big" aria-hidden="true">${short[code]}</p><div><h3>${s.title}</h3><p>${s.text}</p></div></div>`; }).join('\n      ')}
      <figure class="board__tile board__tile--pic" style="grid-column:9/13" data-shutter>${img('ground-classes', 'Students in a DGCA ground class')}</figure>
    </section>

    <section class="biglist f-olive" data-chapter aria-labelledby="kit-title">
      <div class="biglist__head">
        ${heading('h2', 'head', ['In every', 'enrolment'], 'id="kit-title"')}
        <p class="lead" data-rise>No hidden extras. Every student gets the full kit.</p>
      </div>
      <ul class="stack-words" data-rise>${kit.map((k) => `<li>${k.title}</li>`).join('')}</ul>
    </section>

    <section class="duo duo--flip f-paper" data-chapter aria-labelledby="cn-title">
      <figure class="duo__pic" data-shutter>${img('computer-number', 'Trainee pilot at the controls of a simulator')}</figure>
      <div class="duo__text">
        ${heading('h2', 'head', ['Computer', 'number'], 'id="cn-title"')}
        <p data-rise>A unique ID issued by the DGCA, and mandatory before you can apply for any pilot licensing exam in India. Our team takes you through the whole application, without the usual confusion or delays.</p>
        <ol class="olist" data-rise style="--d:80ms">
          <li><strong>Document check</strong><span>We verify every certificate before anything is filed.</span></li>
          <li><strong>Application</strong><span>We prepare and submit your application correctly.</span></li>
          <li><strong>Tracking</strong><span>We follow up until your computer number is issued.</span></li>
        </ol>
      </div>
    </section>

    <a class="next f-sand" href="courses.html" data-chapter>
      <span class="next__label">Subject courses, boosters, tests and papers</span>
      <span class="next__name display" data-lines>${lines(['See the', 'courses'])}</span>
      <span class="next__go">${ICONS.wideArrow}</span>
    </a>`;
  page({ file: 'dgca-ground-classes.html', title: 'DGCA Ground Classes in Mumbai | Pilot Preparation Academy', description: 'DGCA ground classes for Air Navigation, Air Regulations, Meteorology, RTR and Technical General: live and recorded, in Hindi and English, with books, question bank and mock tests.', body, closer: { title: ['Book a free', 'demo class'], text: 'See how we teach Nav, Regs or Met before you enrol. No pressure, no hype.' } });
}

/* ---------- Courses ---------- */
function coursesPage() {
  const count = (id) => (id === 'all' ? courses.length : courses.filter((c) => c.cat === id).length);
  const mark = { navigation: 'Nav', regulations: 'Regs', meteorology: 'Met', technical: 'Tech', tests: 'Test', demo: 'Demo' };
  const body = `${opener({ field: 'sand', title: ['Courses'], lead: 'Subject courses, boosters, tests and previous-month papers, in English and Hindi. Start with a free demo.', pic: 'ground-school', alt: 'Student pilots in a ground class', display: true })}

    <section class="menu-list f-paper" data-chapter aria-labelledby="courses-title">
      <div class="menu-list__head">
        ${heading('h2', 'head', ['Pick a', 'subject'], 'id="courses-title"')}
        <p class="lead" data-rise>Every course is taught live and recorded. Ask for a demo of any subject before you pay.</p>
      </div>
      <div class="filters" role="group" aria-label="Filter courses" data-rise>
        ${courseCats.map((c, i) => `<button class="filter" type="button" data-filter="${c.id}" aria-pressed="${i === 0}">${c.label}<sup>${count(c.id)}</sup></button>`).join('\n        ')}
      </div>
      <div class="courses" data-courses>
        ${courses.map((c) => `<article class="mitem course" data-cat="${c.cat}">
          <span class="mitem__mark" aria-hidden="true">${mark[c.cat]}</span>
          <span><span class="mitem__top"><h3>${c.title}</h3><span>${c.lang}</span></span><p>${c.text}</p><a class="arrow-link" href="contact.html#enquire">${c.cat === 'demo' ? 'Book this demo' : 'Enquire'} ${ICONS.arrow}</a></span>
        </article>`).join('\n        ')}
      </div>
    </section>`;
  page({ file: 'courses.html', title: 'Courses: DGCA Navigation, Regulations and Meteorology | Pilot Preparation Academy', description: 'Air Navigation, Air Regulations, Meteorology, General Navigation ATPL, boosters, tests and previous-month papers, in English and Hindi.', body, needs: ['flip'] });
}

/* ---------- Services ---------- */
function servicesPage() {
  const body = `${opener({ field: 'sand', title: ['Our', 'services'], lead: 'From your first counselling call to your airline interview: seven services, one team that stays with you.', pic: 'sim-a320', alt: 'Airbus A320 simulator cockpit', display: true })}

    <section class="pinrows f-paper" data-chapter aria-labelledby="svc-list-title">
      <div class="pinrows__head">
        ${heading('h2', 'head', ['Seven ways', 'we help'], 'id="svc-list-title"')}
        <p class="lead" data-rise>Take one, or let us take you through all seven.</p>
      </div>
      <div class="pinrows__list">
        ${services.map((s) => `<div class="prow" id="${s.slug}">
          <h3 class="h-lead" data-rise>${s.title}</h3>
          <div class="prow__body"><figure class="prow__pic" data-shutter>${img(s.img, s.alt)}</figure><div data-rise style="--d:80ms"><p>${s.text}</p><a class="arrow-link" href="contact.html#enquire">Ask about this ${ICONS.arrow}</a></div></div>
        </div>`).join('\n        ')}
      </div>
    </section>

    <section class="menu-list f-sage" data-chapter aria-labelledby="fac-title">
      <div class="menu-list__head">
        ${heading('h2', 'head', ['Around the', 'classroom'], 'id="fac-title"')}
        <p class="lead" data-rise>Everything around the lessons is there to keep you focused on one thing: becoming a confident, capable pilot.</p>
      </div>
      <div class="menu-cat">
        <div class="menu-items">
          ${facilities.map((f, i) => `<div class="mitem" style="grid-template-columns:1fr;--d:${(i % 2) * 70}ms" data-rise><span><span class="mitem__top"><h3>${f.title}</h3></span><p>${f.text}</p></span></div>`).join('\n          ')}
        </div>
      </div>
    </section>`;
  page({ file: 'services.html', title: 'Services: Counselling, Ground Classes, CPP and Type Rating | Pilot Preparation Academy', description: 'Free aviation counselling, DGCA ground classes, computer number, verified flight schools in 8 countries, cadet pilot program assistance, type rating and airline preparation.', body, closer: { title: ['Try the', 'simulator'], text: 'Ask for a Microsoft Flight Simulator session and see how theory turns into feel.' } });
}

/* ---------- Flight training hub ---------- */
function flightTraining() {
  const body = `${opener({ field: 'sky', title: ['Flight', 'training'], lead: 'Prepared here, flying anywhere. Verified partner schools in eight countries, matched to your goals, lifestyle and budget.', pic: 'canada-1', alt: 'Training aircraft on an airfield', display: true })}

    <section class="duo f-paper" data-chapter aria-labelledby="match-title">
      <figure class="duo__pic" data-shutter>${img('g-18', 'Student pilot beside a training aircraft')}</figure>
      <div class="duo__text">
        ${heading('h2', 'head', ['The right', 'sky for you'], 'id="match-title"')}
        <p data-rise>We weigh three things with you before we suggest a single school.</p>
        <ul class="olist" data-rise style="--d:80ms">
          <li><strong>Career goals</strong><span>Airline or private aviation: training paths that match your ambitions.</span></li>
          <li><strong>Budget</strong><span>Options across a range of prices, without compromising on quality.</span></li>
          <li><strong>Lifestyle and environment</strong><span>From sunny Florida to simulation centres in Europe, we find what suits you.</span></li>
        </ul>
      </div>
    </section>

    <section class="index f-sand" data-chapter aria-labelledby="dest-list-title">
      <div class="index__head">
        ${heading('h2', 'head', ['Eight', 'destinations'], 'id="dest-list-title"')}
        <p class="lead" data-rise>Choose a country to see how training, weather and life compare.</p>
      </div>
      <div class="index__list" data-index>
        <div class="index__preview" aria-hidden="true">${countries.map((c) => img(`${c.slug}-1`, '', { attrs: `data-for="${c.slug}"` })).join('')}</div>
        ${countries.map((c) => `<a class="irow" href="${countryHref(c)}" data-slug="${c.slug}" data-rise>
          ${img(`${c.slug}-1`, '', { cls: 'irow__thumb' })}
          <span class="irow__name">${c.name}</span>
          <span class="irow__auth">${c.authority}<small>${c.authorityFull}</small></span>
          <span class="irow__schools">${plural(num(c.schools), 'school')}</span>
          <span class="irow__go">${ICONS.arrow}</span>
        </a>`).join('\n        ')}
      </div>
    </section>
${clockBoard({ field: 'sky' })}`;
  page({ file: 'flight-training.html', title: 'Flight Training Abroad in 8 Countries | Pilot Preparation Academy', description: 'Commercial pilot training with verified partner flight schools in India, USA, Canada, Europe, New Zealand, Australia, South Africa and the Philippines.', body, closer: { title: ['Which country', 'fits you?'], text: 'Tell us your budget and timeline. We will lay out the pros and cons of each destination, honestly.' } });
}

/* ---------- Country pages ---------- */
function countryPage(c, i) {
  const next = countries[(i + 1) % countries.length];
  const field = fieldOf(i);
  const n = num(c.schools);
  const chapters = [
    [`Training in ${c.name}`, c.training, `${c.slug}-1`, 'paper'],
    ['The weather', c.weather, `${c.slug}-2`, field],
    [`Living in ${c.name}`, c.living, `${c.slug}-3`, 'ink'],
  ];
  const title = c.name.includes(' ') ? c.name.split(' ') : [c.name];
  const body = `${opener({ field, title, lead: c.intro, pic: `${c.slug}-1`, alt: `Flight training in ${c.name}`, display: true, facts: `<span><b>${c.authority}</b>Licence authority</span><span><b>${plural(n, 'school')}</b>Verified partners</span><span><b>${c.location}</b>Location</span>` })}

    <div class="sheets">
      ${chapters.map(([t, d, p, f]) => `<div class="sheets__group">
        <figure class="sheets__pic" data-chapter>${img(p, `${t}`)}<figcaption>${t}</figcaption></figure>
        <section class="sheet f-${f}" data-chapter>
          ${heading('h2', 'head', t.length > 12 ? [t.split(' ').slice(0, 2).join(' '), t.split(' ').slice(2).join(' ')] : [t])}
          <p class="sheet__text" data-rise>${d}</p>
        </section>
      </div>`).join('\n      ')}
    </div>

    <section class="biglist f-paper" data-chapter aria-labelledby="adv-title">
      <div class="biglist__head">
        ${heading('h2', 'head', ['Why fly in', c.name], 'id="adv-title"')}
        <p class="lead" data-rise>${c.advIntro}</p>
      </div>
      <ul class="biglist__items" data-rise>${c.adv.map((a) => `<li>${a}</li>`).join('')}</ul>
      <div class="biglist__extra" data-rise>
        <p>Life at partner schools</p>
        <p>${amenities.map((a) => a.label).join(', ')}. Facilities vary by school, and we walk you through each one.</p>
      </div>
    </section>

    <a class="next f-${fieldOf(i + 1)}" href="${countryHref(next)}" data-chapter>
      <span class="next__label">Next destination</span>
      <span class="next__name display">${next.name}</span>
      <span class="next__go">${ICONS.wideArrow}</span>
    </a>`;
  page({
    file: countryHref(c),
    active: countryHref(c),
    title: `Commercial Pilot Training in ${c.name} | Pilot Preparation Academy`,
    description: `Commercial pilot training in ${c.name} with verified partner flight schools. ${c.authority} licence, training environment, weather, living and advantages.`,
    body,
    closer: { title: ['Fly in', `${c.name}?`], text: `Talk to us about partner schools in ${c.name}: costs, timelines and the honest pros and cons.` },
  });
}

/* ---------- Gallery ---------- */
function galleryPage() {
  const body = `${opener({ field: 'olive', title: ['Gallery'], lead: 'Classrooms, simulators, hangars and first solos: moments from our students’ journeys.', pic: 'g-01', alt: 'Pilot and cabin crew in front of an aircraft', display: true })}

    <section class="f-paper" data-chapter aria-label="Photographs">
      <div class="masonry" data-gallery>
        ${gallery.map(([f, a], i) => `<button class="masonry__item" type="button" data-index="${i}" data-full="assets/img/${f}.webp" aria-label="Open photo: ${esc(a)}" data-rise>${img(f, a)}</button>`).join('\n        ')}
      </div>
    </section>

    <section class="watch f-sky" data-chapter aria-labelledby="watch-title">
      <div class="watch__text">
        ${heading('h2', 'head', ['Inside the', 'academy'], 'id="watch-title"')}
        <p data-rise>See how we teach, train and prepare future captains.</p>
      </div>
      <button class="video" type="button" data-video="${site.youtubeId}" aria-label="Play the video about Pilot Preparation Academy" data-shutter>
        ${img('sim-a320', '')}
        <span class="video__play">${ICONS.play} Play the film</span>
      </button>
    </section>

    <div class="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" data-lightbox>
      <p class="lightbox__count" data-lb-count></p>
      <img alt="">
      <button class="lightbox__close" type="button" aria-label="Close">${ICONS.close}</button>
      <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous photo">${ICONS.arrow}</button>
      <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next photo">${ICONS.arrow}</button>
    </div>`;
  page({ file: 'gallery.html', title: 'Gallery | Pilot Preparation Academy', description: 'Photos and video from Pilot Preparation Academy: ground classes, simulators, partner flight schools and student pilots.', body });
}

/* ---------- Blog ---------- */
function blogPage() {
  const fmt = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const body = `${opener({ field: 'sage', title: ['Notes for', 'future pilots'], lead: 'Guides and honest advice, from choosing a course to landing the career.', pic: 'g-04', alt: 'Pilot with a headset in the cockpit' })}

    <section class="posts f-paper" data-chapter aria-labelledby="posts-title">
      ${heading('h2', 'head', ['Latest'], 'id="posts-title"')}
      ${posts.map((p) => `<a class="post" href="${p.href}" data-rise>
        <span class="post__pic">${img(p.img, '')}</span>
        <span class="post__body"><span><h3>${p.title}</h3><p style="margin-top:16px">${p.text}</p></span><span class="post__meta"><time datetime="${p.date}">${fmt(p.date)}</time><span class="arrow-link">Read the article ${ICONS.arrow}</span></span></span>
      </a>`).join('\n      ')}
    </section>`;
  page({ file: 'blog.html', title: 'Blog | Pilot Preparation Academy', description: 'Guides for aspiring pilots: pilot training in Mumbai, aviation courses and airline pilot careers.', body });
}

/* ---------- Contact ---------- */
function contactPage() {
  const interests = ['Free counselling', 'DGCA ground classes', 'Flight training abroad', 'Computer number', 'CPP / airline preparation', 'Type rating', 'Something else'];
  const body = `${opener({ field: 'sage', title: ['Contact'], lead: 'Call, write or visit us in Andheri West. Counselling is always free, and always honest.', pic: 'facility-room', alt: 'Classroom at the academy', display: true })}

    <section class="contact f-paper" id="enquire" data-chapter>
      <div class="contact__ways">
        ${heading('h2', 'head', ['Reach us'])}
        <a class="way" href="${site.phoneHref}" data-rise><strong>${site.phone}</strong><small>Call ${site.phoneName}</small></a>
        <a class="way way--long" href="mailto:${site.email}" data-rise style="--d:60ms"><strong>${site.email}</strong><small>Email</small></a>
        <a class="way" href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener" data-rise style="--d:120ms"><strong>Message us directly</strong><small>WhatsApp</small></a>
        <a class="way way--long" href="${mapsUrl}" target="_blank" rel="noopener" data-rise style="--d:180ms"><strong>${site.address}</strong><small>Visit</small></a>
      </div>
      <form class="form" data-enquiry novalidate>
        ${heading('h2', 'head', ['Send a', 'message'])}
        <div class="form__row" data-rise>
          <div class="field"><label for="f-name">Full name</label><input id="f-name" name="name" type="text" autocomplete="name" required><span class="field__err">Please tell us your name.</span></div>
          <div class="field"><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required><span class="field__err">Please enter a valid phone number.</span></div>
        </div>
        <div class="form__row" data-rise>
          <div class="field"><label for="f-email">Email (optional)</label><input id="f-email" name="email" type="email" autocomplete="email"><span class="field__err">Please check your email address.</span></div>
          <div class="field"><label for="f-interest">I am interested in</label><select id="f-interest" name="interest">${interests.map((o) => `<option>${o}</option>`).join('')}</select><span class="field__chev">${ICONS.chevron}</span></div>
        </div>
        <div class="field" data-rise><label for="f-msg">Message (optional)</label><textarea id="f-msg" name="message" rows="4"></textarea></div>
        <div class="form__foot" data-rise>
          <p>Your enquiry opens in WhatsApp, ready to send to our team. Prefer email? Write to <a href="mailto:${site.email}">${site.email}</a>.</p>
          <button class="btn" type="submit">Send enquiry ${ICONS.arrow}</button>
        </div>
        <p class="form-status" role="status" aria-live="polite" data-status></p>
      </form>
    </section>

    <section class="visit f-sand" data-chapter aria-labelledby="visit-title">
      <div class="visit__head">
        ${heading('h2', 'head', ['Visit the', 'academy'], 'id="visit-title"')}
        <p class="lead" data-rise>Wing A, 2nd Floor, Best Building, Andheri West. Come for a free counselling session or a demo class.</p>
      </div>
      <div class="visit__pics">
        <figure data-shutter>${img('g-09', 'Briefing room at the academy')}<figcaption>Briefing room</figcaption></figure>
        <figure data-shutter>${img('g-10', 'Classroom at the academy')}<figcaption>Classroom</figcaption></figure>
        <figure data-shutter>${img('g-11', 'Study space at the academy')}<figcaption>Study space</figcaption></figure>
      </div>
    </section>

    <section class="map" data-chapter aria-label="Map">
      <iframe title="Map: ${esc(site.address)}" src="https://www.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </section>
${faqBands()}`;
  page({ file: 'contact.html', title: 'Contact | Pilot Preparation Academy, Andheri West, Mumbai', description: `Contact Pilot Preparation Academy: ${site.phone}, ${site.email}. ${site.address}.`, body, closer: false });
}

/* ---------- 404 ---------- */
function notFound() {
  const body = `
    <section class="lost f-flame" data-chapter>
      <p class="lost__code" aria-hidden="true">404</p>
      <div class="lost__row">
        <h1 class="head">Off the chart</h1>
        <div><p class="lead">The page you are looking for does not exist any more. Let us get you back on course.</p>${btn('Back to home', 'index.html', 'ink')}</div>
      </div>
    </section>`;
  page({ file: '404.html', title: 'Page not found | Pilot Preparation Academy', description: 'This page could not be found.', body, closer: false });
}

home();
about();
becomePilot();
dgca();
coursesPage();
servicesPage();
flightTraining();
countries.forEach(countryPage);
galleryPage();
blogPage();
contactPage();
notFound();
