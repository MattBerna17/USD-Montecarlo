/* =========================================================
   U.S.D. Montecarlo - Script
   Per aggiornare i contenuti modifica solo i DATI qui sotto.
   ========================================================= */

/* ---------------- DATI MODIFICABILI ---------------- */

// Foto di gruppo mostrata sopra gli atleti.
// Metti il file in img/squadra.jpg (o cambia il percorso). Se "src" è vuoto compare un segnaposto.
const TEAM_PHOTO = {
  src: 'img/squadra.JPG',                       // es. 'img/squadra.jpg'
  alt: 'Foto di gruppo della U.S.D. Montecarlo',
  caption: 'La U.S.D. Montecarlo al completo',
};

// Atleti: "photo" è opzionale (es. 'img/atleti/rossi.jpg'). Senza foto compare il numero di maglia.
const ATHLETES = [
  { name: 'Pietro Del Nista', number: "G1",  category: 'Giovanissimi', photo: "img/atleti/del_nista_pietro.JPG" },
  // { name: 'Nome Cognome', number: 2,  category: 'Élite / Amatori', role: 'Scalatore', photo: "img/atleti/" },
  // { name: 'Nome Cognome', number: 3,  category: 'Élite / Amatori', role: 'Velocista', photo: "img/atleti/" },
];

// Primi posti: "photo" è opzionale (es. 'img/vittorie/gara1.jpg'). Senza foto compare un segnaposto.
// Per aggiungerne una basta copiare una riga. Data nel formato AAAA-MM-GG.
const WINS = [
  { race: 'Nome della gara', athlete: 'Nome Cognome', date: '2026-09-27', place: 'Località', photo: '' },
  { race: 'Nome della gara', athlete: 'Nome Cognome', date: '2026-06-14', place: 'Località', photo: '' },
  { race: 'Nome della gara', athlete: 'Nome Cognome', date: '2025-10-05', place: 'Località', photo: '' },
];

// Galleria: "src" opzionale (es. 'img/galleria/foto1.jpg'). Senza src compare un segnaposto.
// "size" opzionale: 'tall' (alta) oppure 'wide' (larga).
const GALLERY = [
  { src: 'img/galleria/foto1.JPG', caption: 'In salita', size: 'tall' },
  { src: 'img/galleria/foto2.JPG', caption: 'Durante il passaggio della borraccia' },
  { src: 'img/galleria/foto4.JPG', caption: 'Durante l\'allenamento' },
  { src: 'img/galleria/foto3.JPG', caption: 'Volata finale', size: "tall" },
  // { src: '', caption: 'Volata finale' },
  // { src: '', caption: 'Festa di squadra',        size: 'wide' },
  // { src: '', caption: 'I più piccoli' },
  // { src: '', caption: 'Uscita domenicale' },
];

// Modulo contatti: i messaggi arrivano a questo indirizzo email.
// Il servizio usato è FormSubmit (gratuito, senza registrazione): al PRIMO invio riceverai
// una email di attivazione a questo indirizzo, clicca il link di conferma e da lì in poi funziona.
const CONTACT_EMAIL = 'info@usdmontecarlo.it';
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/' + CONTACT_EMAIL;

// Contatore visite (GoatCounter, gratuito, senza cookie). Come attivarlo:
//  1. registrati su https://www.goatcounter.com e scegli un "codice" (es. 'usdmontecarlo')
//  2. in Settings, spunta "Allow adding visitor counts on your website"
//  3. scrivi qui sotto il codice. Finché resta vuoto, il contatore non viene mostrato.
const GOATCOUNTER_CODE = 'usdmontecarlo';

/* ---------------- UTILITÀ ---------------- */

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const MONTHS = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
const parseDate = (s) => new Date(s + 'T12:00:00');
const fmtShort = (s) => { const d = parseDate(s); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------------- HEADER E MENU ---------------- */

const header = $('#header');
const burger = $('#burger');
const menu   = $('#menu');

function onScroll() { header.classList.toggle('scrolled', window.scrollY > 40); }
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
$$('a', menu).forEach((a) => a.addEventListener('click', () => {
  menu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}));

// Evidenzia la voce di menu della sezione visibile
const navLinks = $$('.menu a');
const sections = $$('main section[id]');
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach((s) => spy.observe(s));

/* ---------------- FOTO DI GRUPPO ---------------- */

$('#team-photo').innerHTML = `
  <div class="frame">
    ${TEAM_PHOTO.src
      ? `<img src="${esc(TEAM_PHOTO.src)}" alt="${esc(TEAM_PHOTO.alt)}" loading="lazy">`
      : '<div class="ph"><div><span>📸</span>Qui la foto di gruppo</div></div>'}
  </div>
  <figcaption>${esc(TEAM_PHOTO.caption)}</figcaption>`;

/* ---------------- ATLETI ---------------- */

const athletesGrid = $('#athletes-grid');

function renderAthletes(filter = 'all') {
  const list = ATHLETES.filter((a) => filter === 'all' || a.category === filter);
  athletesGrid.innerHTML = list.map((a) => `
    <article class="card athlete">
      <div class="athlete-photo">
        ${a.photo ? `<img src="${esc(a.photo)}" alt="${esc(a.name)}" loading="lazy">` : `<span class="athlete-number">${esc(a.number)}</span>`}
      </div>
      <div class="athlete-body">
        <h3>${esc(a.name)}</h3>
        <p>${esc(a.role)}</p>
        <span class="tag">${esc(a.category)}</span>
      </div>
    </article>`).join('');
}
renderAthletes();

$('#athlete-filters').addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  $$('#athlete-filters .chip').forEach((c) => c.classList.toggle('active', c === btn));
  renderAthletes(btn.dataset.filter);
});

/* ---------------- RISULTATI (PRIMI POSTI) ---------------- */

const sortedWins = [...WINS].sort((a, b) => parseDate(b.date) - parseDate(a.date));
$('#wins-grid').innerHTML = sortedWins.map((w) => `
  <article class="card win reveal">
    <div class="win-photo">
      <span class="win-badge">1°</span>
      ${w.photo ? `<img src="${esc(w.photo)}" alt="${esc(w.race)} - ${esc(w.athlete)}" loading="lazy">` : '<span aria-hidden="true">🏆</span>'}
    </div>
    <div class="win-body">
      <h3>${esc(w.race)}</h3>
      <p>${esc(w.athlete)}</p>
      <p class="win-meta">📍 ${esc(w.place)} · ${fmtShort(w.date)}</p>
    </div>
  </article>`).join('');

/* ---------------- GALLERIA + LIGHTBOX ---------------- */

const gallery = $('#gallery');
gallery.innerHTML = GALLERY.map((g, i) => `
  <button class="gallery-item ${g.size || ''} reveal" data-index="${i}" aria-label="Apri: ${esc(g.caption)}">
    ${g.src ? `<img src="${esc(g.src)}" alt="${esc(g.caption)}" loading="lazy">` : '<span class="ph">🚴</span>'}
    <span class="cap">${esc(g.caption)}</span>
  </button>`).join('');

const lightbox = $('#lightbox');
const lbFigure = $('#lb-figure');
let lbIndex = 0;

function showLightbox(i) {
  lbIndex = (i + GALLERY.length) % GALLERY.length;
  const g = GALLERY[lbIndex];
  lbFigure.innerHTML = (g.src
    ? `<img src="${esc(g.src)}" alt="${esc(g.caption)}">`
    : '<div class="lb-ph">🚴</div>') + `<figcaption>${esc(g.caption)}</figcaption>`;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

gallery.addEventListener('click', (e) => {
  const item = e.target.closest('.gallery-item');
  if (item) showLightbox(+item.dataset.index);
});
$('#lb-close').addEventListener('click', closeLightbox);
$('#lb-prev').addEventListener('click', () => showLightbox(lbIndex - 1));
$('#lb-next').addEventListener('click', () => showLightbox(lbIndex + 1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showLightbox(lbIndex - 1);
  if (e.key === 'ArrowRight') showLightbox(lbIndex + 1);
});

/* ---------------- MODULO CONTATTI ---------------- */

const form = $('#contact-form');
const statusEl = $('#form-status');
const submitBtn = $('button[type="submit"]', form);

function setStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = 'form-status ' + (type || '');
}

// In caso di errore propone di scrivere direttamente via email, con i dati già compilati
function setErrorWithMailto(name, email, subject, message) {
  const body = `Nome: ${name}\nEmail: ${email}\nMotivo: ${subject}\n\n${message}`;
  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('[Sito] ' + subject)}&body=${encodeURIComponent(body)}`;
  statusEl.className = 'form-status err';
  statusEl.textContent = 'Invio non riuscito. Riprova tra poco oppure ';
  const a = document.createElement('a');
  a.href = href;
  a.textContent = 'scrivici con il tuo programma di posta';
  a.style.textDecoration = 'underline';
  statusEl.append(a, '.');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const subject = form.subject.value;

  // Campo trappola compilato = è un bot: finge successo senza inviare nulla
  if (form.website.value) { form.reset(); return setStatus('Messaggio inviato! 🚴', 'ok'); }

  // validazione
  $$('.field', form).forEach((f) => f.classList.remove('invalid'));
  let ok = true;
  if (!name)    { form.name.parentElement.classList.add('invalid'); ok = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { form.email.parentElement.classList.add('invalid'); ok = false; }
  if (!message) { form.message.parentElement.classList.add('invalid'); ok = false; }
  if (!ok) return setStatus('Controlla i campi evidenziati.', 'err');
  if (!$('#privacy').checked) return setStatus('Per inviare devi accettare il trattamento dei dati.', 'err');

  submitBtn.disabled = true;
  setStatus('Invio in corso...');

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        // campi che arrivano nella email
        name,
        email,                       // usato anche come "Rispondi a"
        motivo: subject,
        messaggio: message,
        consenso_privacy: 'Sì',
        // opzioni del servizio
        _subject: `[Sito] ${subject} - ${name}`,
        _template: 'table',
        _captcha: 'false',
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !(data.success === true || data.success === 'true')) throw new Error(data.message || 'send failed');
    form.reset();
    setStatus('Messaggio inviato! Ti risponderemo il prima possibile. 🚴', 'ok');
  } catch (err) {
    setErrorWithMailto(name, email, subject, message);
  } finally {
    submitBtn.disabled = false;
  }
});

/* ---------------- ANIMAZIONI ALLO SCROLL ---------------- */

const reveal = new IntersectionObserver((entries, obs) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 90 + 'ms';
  reveal.observe(el);
});

// Contatori della hero
const counters = $$('[data-count]');
const countObs = new IntersectionObserver((entries, obs) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const dur = 1600;
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(tick);
    })(start);
    obs.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach((c) => countObs.observe(c));

/* ---------------- CONTATORE VISITE ---------------- */

if (GOATCOUNTER_CODE) {
  const base = `https://${GOATCOUNTER_CODE}.goatcounter.com`;

  // 1) registra la visita corrente
  window.goatcounter = Object.assign(window.goatcounter || {}, { endpoint: base + '/count' });
  const gc = document.createElement('script');
  gc.async = true;
  gc.src = 'https://gc.zgo.at/count.js';
  gc.dataset.goatcounter = base + '/count';
  document.head.appendChild(gc);

  // 2) legge e mostra il totale (il servizio lo aggiorna con qualche ora di ritardo)
  fetch(base + '/counter/TOTAL.json', { headers: { Accept: 'application/json' } })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('counter unavailable'))))
    .then((d) => {
      if (!d || d.count == null) throw new Error('bad counter data');
      $('#visitors-count').textContent = d.count;
      $('#visitors').hidden = false;
    })
    .catch(() => { /* se il servizio non risponde o è bloccato, il contatore resta nascosto */ });
}

/* ---------------- VARIE ---------------- */

$('#year').textContent = new Date().getFullYear();