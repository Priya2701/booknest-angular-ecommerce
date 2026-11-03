/**
 * Generates original, self-contained SVG book covers into public/covers.
 * Run with: node scripts/generate-covers.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../public/covers/', import.meta.url));
mkdirSync(OUT, { recursive: true });

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/'/g, '&#39;');

/** Deterministic pseudo-random so covers are stable between runs. */
function rng(seed) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

function wrap(text, max) {
  const lines = [];
  let cur = '';
  for (const w of text.split(' ')) {
    if ((cur + ' ' + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

const stars = (seed, n, color, area = [40, 40, 520, 520]) => {
  const r = rng(seed);
  return Array.from({ length: n }, () => {
    const x = area[0] + r() * area[2];
    const y = area[1] + r() * area[3];
    return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(0.8 + r() * 2).toFixed(1)}" fill="${color}" opacity="${(0.4 + r() * 0.6).toFixed(2)}"/>`;
  }).join('');
};

const motifs = {
  lighthouse: () => `
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14284b"/><stop offset="1" stop-color="#3b6a9c"/></linearGradient></defs>
    <rect width="600" height="620" fill="url(#sky)"/>
    ${stars(3, 40, '#fff', [30, 30, 540, 300])}
    <polygon points="300,262 600,170 600,330" fill="#ffe7a0" opacity=".28"/>
    <polygon points="300,262 0,170 0,330" fill="#ffe7a0" opacity=".18"/>
    <polygon points="262,560 338,560 322,285 278,285" fill="#f7f1e6"/>
    <polygon points="268,500 332,500 328,455 272,455" fill="#b3261e"/>
    <polygon points="276,410 324,410 321,365 279,365" fill="#b3261e"/>
    <polygon points="281,335 319,335 322,300 278,300" fill="#b3261e"/>
    <rect x="272" y="268" width="56" height="20" fill="#2b2118"/>
    <rect x="280" y="236" width="40" height="34" fill="#ffd36b"/>
    <polygon points="272,238 328,238 300,206" fill="#b3261e"/>
    <path d="M0 540 Q75 505 150 540 T300 540 T450 540 T600 540 V620 H0Z" fill="#102a43"/>
    <path d="M0 575 Q75 545 150 575 T300 575 T450 575 T600 575 V620 H0Z" fill="#0b1d33"/>`,

  moons: () => `
    <rect width="600" height="620" fill="#ecd9b8"/>
    <circle cx="300" cy="300" r="210" fill="#e1c593"/>
    <circle cx="150" cy="300" r="62" fill="#1d3557"/>
    <circle cx="300" cy="300" r="62" fill="#1d3557"/>
    <circle cx="318" cy="288" r="58" fill="#e1c593"/>
    <circle cx="450" cy="300" r="62" fill="#1d3557"/>
    <circle cx="414" cy="300" r="62" fill="#e1c593"/>
    <path d="M60 420 Q300 330 540 420" fill="none" stroke="#a8441c" stroke-width="3" stroke-dasharray="3 10" stroke-linecap="round"/>
    <circle cx="300" cy="150" r="16" fill="#a8441c"/>
    <polygon points="90,540 150,500 210,540 150,580" fill="#f7efe0" opacity=".9"/>
    <polygon points="390,540 450,500 510,540 450,580" fill="#f7efe0" opacity=".9"/>`,

  archive: () => {
    const r = rng(11);
    const cols = ['#7fa8a0', '#c9a45c', '#4d7c78', '#d9cdb4', '#a05a44', '#2f5d62'];
    let rows = '';
    [110, 270, 430].forEach((y, ri) => {
      let x = 60;
      while (x < 520) {
        const w = 22 + r() * 26;
        const h = 90 + r() * 50;
        rows += `<rect x="${x.toFixed(0)}" y="${(y + 130 - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${cols[Math.floor(r() * cols.length)]}" opacity=".92"/>`;
        x += w + 3;
      }
      rows += `<rect x="50" y="${y + 130}" width="500" height="10" fill="#0f2224"/>`;
      if (ri === 1) rows += `<rect x="296" y="${y - 6}" width="30" height="140" fill="#e9c46a" transform="rotate(12 311 ${y + 64})"/>`;
    });
    return `<rect width="600" height="620" fill="#1b3335"/>${rows}`;
  },

  ridge: () => `
    <defs><linearGradient id="glow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1519"/><stop offset="1" stop-color="#8a2f2a"/></linearGradient></defs>
    <rect width="600" height="620" fill="url(#glow)"/>
    <circle cx="300" cy="260" r="95" fill="#f0a35e" opacity=".85"/>
    <polygon points="0,420 110,300 200,390 300,280 400,400 500,310 600,420 600,620 0,620" fill="#4a1d22"/>
    <polygon points="0,500 90,410 190,480 300,390 410,490 520,420 600,500 600,620 0,620" fill="#2e1216"/>
    <path d="M300 520 C262 480 270 440 296 410 C292 440 318 440 322 410 C350 450 338 490 300 520Z" fill="#f4b942"/>
    <path d="M300 520 C282 498 288 478 300 462 C308 480 318 492 300 520Z" fill="#fde9b0"/>
    ${stars(5, 18, '#f7d9b0', [20, 20, 560, 180])}`,

  cosmos: () => `
    <defs><radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff3c4"/><stop offset=".6" stop-color="#f4b942"/><stop offset="1" stop-color="#f4b942" stop-opacity="0"/></radialGradient></defs>
    <rect width="600" height="620" fill="#0b1636"/>
    ${stars(8, 90, '#fff', [10, 10, 580, 600])}
    <g fill="none" stroke="#7fa6ff" stroke-opacity=".5" stroke-width="1.5">
      <ellipse cx="300" cy="320" rx="120" ry="52" transform="rotate(-18 300 320)"/>
      <ellipse cx="300" cy="320" rx="190" ry="84" transform="rotate(-18 300 320)"/>
      <ellipse cx="300" cy="320" rx="255" ry="116" transform="rotate(-18 300 320)"/>
    </g>
    <circle cx="300" cy="320" r="70" fill="url(#sun)"/>
    <circle cx="300" cy="320" r="26" fill="#ffe08a"/>
    <circle cx="205" cy="288" r="12" fill="#5aa9e6"/>
    <circle cx="470" cy="262" r="20" fill="#e07a5f"/>
    <circle cx="140" cy="392" r="9" fill="#cdb4db"/>`,

  mind: () => {
    let dots = '';
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const d = Math.hypot(i - 4, j - 4);
        const rad = Math.max(2, 17 - d * 3.2);
        const color = d < 2 ? '#f4a6c8' : d < 3.5 ? '#c9a7f2' : '#8d73c9';
        dots += `<circle cx="${80 + i * 55}" cy="${90 + j * 55}" r="${rad.toFixed(1)}" fill="${color}"/>`;
      }
    }
    return `<rect width="600" height="620" fill="#2e2150"/>${dots}`;
  },

  salt: () => `
    <rect width="600" height="620" fill="#dcc6a1"/>
    <rect y="470" width="600" height="150" fill="#c9ad7f"/>
    <g stroke="#1d3557" stroke-width="3" stroke-linejoin="round">
      <polygon points="300,120 380,220 300,420 220,220" fill="#fbf7ee"/>
      <polygon points="300,120 380,220 300,230 220,220" fill="#ffffff"/>
      <polygon points="160,330 215,395 160,500 105,395" fill="#f2ecdf"/>
      <polygon points="440,300 505,380 440,510 375,380" fill="#f2ecdf"/>
      <polygon points="470,190 500,225 470,270 440,225" fill="#fbf7ee"/>
      <polygon points="105,200 130,232 105,275 80,232" fill="#fbf7ee"/>
    </g>
    <path d="M60 560 H540" stroke="#1d3557" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>`,

  road: () => `
    <defs><linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1c27d"/><stop offset="1" stop-color="#e9a15a"/></linearGradient></defs>
    <rect width="600" height="620" fill="url(#dusk)"/>
    <circle cx="300" cy="250" r="78" fill="#fff1c9"/>
    <polygon points="0,320 120,260 260,330 380,250 520,320 600,280 600,620 0,620" fill="#6b7a3a"/>
    <polygon points="0,400 140,340 280,410 420,350 600,420 600,620 0,620" fill="#4a5a2a"/>
    <path d="M190 620 C430 540 170 470 285 392 C330 360 312 338 302 330 L316 330 C330 342 356 366 334 396 C240 480 500 540 440 620Z" fill="#efe1bd"/>`,

  moonbus: () => `
    <rect width="600" height="620" fill="#1f3f8f"/>
    ${stars(21, 55, '#fff3c4', [20, 20, 560, 330])}
    <circle cx="300" cy="215" r="125" fill="#ffe08a"/>
    <circle cx="255" cy="180" r="22" fill="#f0c95c"/>
    <circle cx="345" cy="245" r="30" fill="#f0c95c"/>
    <circle cx="320" cy="150" r="12" fill="#f0c95c"/>
    <rect x="130" y="400" width="340" height="110" rx="26" fill="#ef6f3c"/>
    <rect x="130" y="470" width="340" height="14" fill="#c9511f"/>
    <g fill="#fdf2d0"><rect x="160" y="424" width="62" height="44" rx="8"/><rect x="236" y="424" width="62" height="44" rx="8"/><rect x="312" y="424" width="62" height="44" rx="8"/><rect x="388" y="424" width="56" height="44" rx="8"/></g>
    <circle cx="205" cy="518" r="30" fill="#14213d"/><circle cx="205" cy="518" r="13" fill="#cfd8e8"/>
    <circle cx="400" cy="518" r="30" fill="#14213d"/><circle cx="400" cy="518" r="13" fill="#cfd8e8"/>`,

  atlas: () => `
    <rect width="600" height="620" fill="#17594a"/>
    <circle cx="300" cy="300" r="190" fill="#1f7a66"/>
    <g fill="#f4e4b8"><path d="M200 230 C230 190 290 200 300 240 C310 280 260 300 240 340 C215 330 180 280 200 230Z"/><path d="M340 190 C390 170 440 200 430 250 C420 290 380 280 360 320 C335 300 320 220 340 190Z"/><path d="M330 360 C370 340 410 370 395 420 C380 450 340 440 330 400Z"/></g>
    <g fill="none" stroke="#f4e4b8" stroke-opacity=".55" stroke-width="2">
      <ellipse cx="300" cy="300" rx="190" ry="70"/><ellipse cx="300" cy="300" rx="190" ry="140"/>
      <ellipse cx="300" cy="300" rx="70" ry="190"/><ellipse cx="300" cy="300" rx="140" ry="190"/>
      <line x1="110" y1="300" x2="490" y2="300"/><line x1="300" y1="110" x2="300" y2="490"/>
      <circle cx="300" cy="300" r="190"/>
    </g>
    <g transform="translate(470 500)"><circle r="46" fill="#f4e4b8"/><polygon points="0,-36 9,0 0,36 -9,0" fill="#b3261e"/><polygon points="-36,0 0,-9 36,0 0,9" fill="#17594a"/></g>`,
};

const books = [
  { slug: 'the-last-lighthouse', title: 'The Last Lighthouse', author: 'Elena Marsh', motif: 'lighthouse', bg: '#14284b', fg: '#f7f1e6', accent: '#ffd36b' },
  { slug: 'paper-moons', title: 'Paper Moons', author: 'Daniel Okoye', motif: 'moons', bg: '#1d3557', fg: '#f7efe0', accent: '#f4b942' },
  { slug: 'the-quiet-archive', title: 'The Quiet Archive', author: 'Rhea Kapoor', motif: 'archive', bg: '#1b3335', fg: '#f3ead6', accent: '#e9c46a' },
  { slug: 'ashes-at-ridgemont', title: 'Ashes at Ridgemont', author: 'Tom Lindqvist', motif: 'ridge', bg: '#2e1216', fg: '#fbe9d0', accent: '#f4b942' },
  { slug: 'the-living-cosmos', title: 'The Living Cosmos', author: 'Dr. Amara Nwosu', motif: 'cosmos', bg: '#0b1636', fg: '#f4f1e8', accent: '#ffe08a' },
  { slug: 'patterns-of-the-mind', title: 'Patterns of the Mind', author: 'Jonas Weber', motif: 'mind', bg: '#2e2150', fg: '#f6eefc', accent: '#f4a6c8' },
  { slug: 'empires-of-salt', title: 'Empires of Salt', author: 'Clara Dubois', motif: 'salt', bg: '#1d3557', fg: '#fbf7ee', accent: '#e9c46a' },
  { slug: 'the-forgotten-road', title: 'The Forgotten Road', author: 'Samuel Ortiz', motif: 'road', bg: '#3a4a1f', fg: '#f6efd8', accent: '#f1c27d' },
  { slug: 'benny-and-the-moon-bus', title: 'Benny and the Moon Bus', author: 'Lila Hart', motif: 'moonbus', bg: '#1f3f8f', fg: '#fff8e1', accent: '#ffe08a' },
  { slug: 'the-tiny-explorers-atlas', title: "The Tiny Explorer's Atlas", author: 'Lila Hart', motif: 'atlas', bg: '#17594a', fg: '#fbf3dc', accent: '#f4e4b8' },
];

for (const b of books) {
  const lines = wrap(b.title, 14);
  const size = lines.length > 3 ? 46 : 54;
  const lh = size * 1.12;
  const startY = 690 - ((lines.length - 1) * lh) / 2 + (lines.length > 2 ? 0 : 14);
  const text = lines
    .map(
      (l, i) =>
        `<text x="300" y="${(startY + i * lh).toFixed(0)}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${size}" font-weight="700" fill="${b.fg}">${esc(l)}</text>`,
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900" role="img" aria-label="${esc(b.title)} by ${esc(b.author)}">
<rect width="600" height="900" fill="${b.bg}"/>
<svg x="0" y="0" width="600" height="620" viewBox="0 0 600 620">${motifs[b.motif]()}</svg>
<rect x="0" y="618" width="600" height="282" fill="${b.bg}"/>
<rect x="260" y="628" width="80" height="3" fill="${b.accent}"/>
${text}
<text x="300" y="852" text-anchor="middle" font-family="-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="22" letter-spacing="5" fill="${b.accent}">${esc(b.author.toUpperCase())}</text>
<rect x="0" y="0" width="26" height="900" fill="#000" opacity=".16"/>
<rect x="26" y="0" width="3" height="900" fill="#fff" opacity=".12"/>
</svg>
`;
  writeFileSync(`${OUT}${b.slug}.svg`, svg);
}
console.log(`Wrote ${books.length} covers to ${OUT}`);
