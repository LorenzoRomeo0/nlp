/* Inizializzazione del deck: 16:9 a 1920x1080, nessuna nota del relatore, logo gestito via CSS (nascosto nella copertina). */
const deck = new Reveal({
  width: 1920, height: 1080, margin: 0, minScale: 0.1, maxScale: 3,
  hash: true, fragmentInURL: true, controls: true, progress: true, slideNumber: 'c/t', center: false,
  transition: 'fade', transitionSpeed: 'fast', backgroundTransition: 'none', showNotes: false, pdfSeparateFragments: false
});
const syncCover = () => { const s = deck.getCurrentSlide(); const h = document.documentElement.classList; h.toggle('is-cover', !!(s && s.hasAttribute('data-cover'))); h.toggle('on-blue', !!(s && s.hasAttribute('data-section'))); };
deck.on('ready', syncCover); deck.on('slidechanged', syncCover);
// tasto "t": tema chiaro/scuro (le figure interattive leggono le variabili CSS)
document.addEventListener('keydown', e => { if (e.key === 't' && !e.ctrlKey && !e.metaKey) { const r = document.documentElement; r.dataset.theme = r.dataset.theme === 'dark' ? 'light' : 'dark'; window.dispatchEvent(new Event('themechange')); } });
// Click-to-highlight: ogni frammento "trigger" (data-trigger="NOME") attiva/disattiva la classe NOME-on sulla slide (es. markers-on, values-on)
const setTrig = (f, on) => { const n = f.dataset && f.dataset.trigger; if (n) f.closest('section').classList.toggle(n + '-on', on); };
const syncTriggers = () => { const s = deck.getCurrentSlide(); if (!s) return; s.querySelectorAll('.fragment[data-trigger]').forEach(f => setTrig(f, f.classList.contains('visible'))); };
deck.on('fragmentshown', e => (e.fragments || [e.fragment]).forEach(f => setTrig(f, true)));
deck.on('fragmenthidden', e => (e.fragments || [e.fragment]).forEach(f => setTrig(f, false)));
const fire = () => document.dispatchEvent(new CustomEvent('triggerchange'));
deck.on('fragmentshown', fire); deck.on('fragmenthidden', fire);
deck.on('ready', () => { syncTriggers(); fire(); }); deck.on('slidechanged', () => setTimeout(() => { syncTriggers(); fire(); }, 0));
// ?static nell'URL: nasconde frecce, numero di slide e barra di avanzamento (per l'esportazione in PDF)
if (/[?&]static\b/.test(location.search)) document.documentElement.classList.add('static-export');
deck.initialize();
// utilita' di test: ?press=N preme N volte "avanti" dopo il caricamento (per le anteprime automatiche)
{ const q = new URLSearchParams(location.search), n = +(q.get('press') || 0), gap = +(q.get('gap') || 60); if (n) deck.on('ready', () => { for (let i = 0; i < n; i++) setTimeout(() => deck.next(), 150 + i * gap); }); }
// Solo in modalita' server (serve.py): se un file del deck cambia, ricarica la pagina restando sulla stessa slide e allo stesso click
if (location.protocol.startsWith('http')) {
  let v = null;
  const poll = async () => { try { const r = await fetch('/__version', { cache: 'no-store' }); if (!r.ok) return; const t = await r.text(); if (v === null) v = t; else if (t !== v) { location.reload(); return; } } catch (e) { return; } setTimeout(poll, 800); };
  poll();
}
