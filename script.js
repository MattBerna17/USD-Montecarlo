/* =========================================================
   U.S.D. Montecarlo - Script
   Per aggiornare i contenuti modifica solo i DATI qui sotto.
   ========================================================= */

/* ---------------- DATI MODIFICABILI ---------------- */

// Atleti: "photo" è opzionale (es. 'img/atleti/rossi.jpg'). Senza foto compare il numero di maglia.
const ATHLETES = [
  { name: 'Nome Cognome', number: 1,  category: 'Élite / Amatori', role: 'Passista' },
  { name: 'Nome Cognome', number: 2,  category: 'Élite / Amatori', role: 'Scalatore' },
  { name: 'Nome Cognome', number: 3,  category: 'Élite / Amatori', role: 'Velocista' },
  { name: 'Nome Cognome', number: 7,  category: 'Juniores',        role: 'Passista' },
  { name: 'Nome Cognome', number: 8,  category: 'Juniores',        role: 'Scalatore' },
  { name: 'Nome Cognome', number: 11, category: 'Juniores',        role: 'Velocista' },
  { name: 'Nome Cognome', number: 21, category: 'Giovanili',       role: 'Esordiente' },
  { name: 'Nome Cognome', number: 22, category: 'Giovanili',       role: 'Allievo' },
];

// Calendario gare (data formato AAAA-MM-GG)
const EVENTS = [
  { date: '2027-02-21', title: 'Gara di esempio 1', place: 'Località, Provincia', category: 'Élite / Amatori' },
  { date: '2027-03-07', title: 'Gara di esempio 2', place: 'Località, Provincia', category: 'Juniores' },
  { date: '2027-03-21', title: 'Gara di esempio 3', place: 'Località, Provincia', category: 'Giovanili' },
  { date: '2027-04-04', title: 'Gara di esempio 4', place: 'Località, Provincia', category: 'Tutte le categorie' },
];

// Risultati (pos = piazzamento numerico)
const RESULTS = [
  { date: '2026-09-27', race: 'Gara di esempio A', athlete: 'Nome Cognome', pos: 1 },
  { date: '2026-09-13', race: 'Gara di esempio B', athlete: 'Nome Cognome', pos: 2 },
  { date: '2026-08-30', race: 'Gara di esempio C', athlete: 'Nome Cognome', pos: 3 },
  { date: '2026-08-16', race: 'Gara di esempio D', athlete: 'Nome Cognome', pos: 5 },
];

// Galleria: "src" opzionale (es. 'img/galleria/foto1.jpg'). Senza src compare un segnaposto.
// "size" opzionale: 'tall' (alta) oppure 'wide' (larga).
const GALLERY = [
  { src: '', caption: 'Partenza di gara',       size: 'wide' },
  { src: '', caption: 'In salita' },
  { src: '', caption: 'Il gruppo in allenamento', size: 'tall' },
  { src: '', caption: 'Premiazione' },
  { src: '', caption: 'Volata finale' },
  { src: '', caption: 'Festa di squadra',        size: 'wide' },
  { src: '', caption: 'I più piccoli' },
  { src: '', caption: 'Uscita domenicale' },
];

// Modulo contatti: crea un modulo gratuito su https://formspree.io (o simili),
// poi incolla qui l'indirizzo. Finché resta così, il pulsante apre il programma email.
const FORM_ENDPOINT = 'https://formspree.io/f/XXXXXXXX';
const CONTACT_EMAIL = 'info@usdmontecarlo.it';

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

/* ---------------- CALENDARIO E RISULTATI ---------------- */

const today = new Date(); today.setHours(0, 0, 0, 0);

function renderEvents() {
  const upcoming = EVENTS
    .filter((ev) => parseDate(ev.date) >= today)
    .sort((a, b) => parseDate(a.date) - parseDate(b.date));

  $('#event-list').innerHTML = upcoming.length
    ? upcoming.map((ev) => {
        const d = parseDate(ev.date);
        return `
        <article class="card event">
          <div class="event-date"><strong>${d.getDate()}</strong><span>${MONTHS[d.getMonth()]} ${d.getFullYear()}</span></div>
          <div class="event-info">
            <h3>${esc(ev.title)}</h3>
            <p>📍 ${esc(ev.place)}</p>
          </div>
          <span class="tag">${esc(ev.category)}</span>
        </article>`;
      }).join('')
    : '<p style="text-align:center;color:var(--grey)">Nessuna gara in programma al momento. Torna presto!</p>';
}

function renderResults() {
  const rows = [...RESULTS].sort((a, b) => parseDate(b.date) - parseDate(a.date));
  $('#results-body').innerHTML = rows.map((r) => `
    <tr>
      <td>${fmtShort(r.date)}</td>
      <td><strong>${esc(r.race)}</strong></td>
      <td>${esc(r.athlete)}</td>
      <td><span class="pos ${r.pos <= 3 ? 'p' + r.pos : ''}">${esc(r.pos)}°</span></td>
    </tr>`).join('');
}
renderEvents();
renderResults();

$$('.tab').forEach((tab) => tab.addEventListener('click', () => {
  $$('.tab').forEach((t) => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', t === tab); });
  $('#panel-calendar').classList.toggle('active', tab.dataset.tab === 'calendar');
  $('#panel-results').classList.toggle('active', tab.dataset.tab === 'results');
}));

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

function setStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = 'form-status ' + (type || '');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const subject = form.subject.value;

  // validazione
  $$('.field', form).forEach((f) => f.classList.remove('invalid'));
  let ok = true;
  if (!name)    { form.name.parentElement.classList.add('invalid'); ok = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { form.email.parentElement.classList.add('invalid'); ok = false; }
  if (!message) { form.message.parentElement.classList.add('invalid'); ok = false; }
  if (!ok) return setStatus('Controlla i campi evidenziati.', 'err');
  if (!$('#privacy').checked) return setStatus('Per inviare devi accettare il trattamento dei dati.', 'err');

  // Se il servizio di invio non è configurato, apre il programma email
  if (FORM_ENDPOINT.includes('XXXX')) {
    const body = `Nome: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('[Sito] ' + subject)}&body=${encodeURIComponent(body)}`;
    return setStatus('Si sta aprendo il tuo programma di posta...', 'ok');
  }

  setStatus('Invio in corso...');
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name, email, subject, message }),
    });
    if (!res.ok) throw new Error();
    form.reset();
    setStatus('Messaggio inviato! Ti risponderemo il prima possibile. 🚴', 'ok');
  } catch {
    setStatus(`Invio non riuscito. Scrivici a ${CONTACT_EMAIL}.`, 'err');
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

/* ---------------- VARIE ---------------- */

$('#year').textContent = new Date().getFullYear();
