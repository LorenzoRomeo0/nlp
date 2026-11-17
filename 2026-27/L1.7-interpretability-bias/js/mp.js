/* Slide interattive con selettore di regioni (profilo morale 26, profilo culturale 27). Dati in js/mp_data.js e js/mk_data.js (conteggi per regione);
   le quote si ricalcolano qui. Barre = quota con le regioni selezionate; tacca = quota con tutte le regioni; piccolo numero = differenza in punti.
   Ogni dato ha `prefix` (es. 'mp-'): gli elementi della slide hanno id <prefix><sezione>, <prefix>regions, <prefix>nline. */
(() => {
  const fmt = n => n.toLocaleString('en-US');
  const off = (new URLSearchParams(location.search).get('mpoff') || '').split(',').filter(Boolean).map(Number);  // utilita' di test: ?mpoff=4,5,9
  const init = D => {
    if (!D) return;
    const q = id => document.querySelector('#' + D.prefix + id), slide = q('regions') && q('regions').closest('section'); if (!slide) return;
    const on = D.groups.map((g, i) => !off.includes(i));
    const secs = D.sections.map(s => {
      const host = q(s.id); host.innerHTML = '';
      const rows = s.items.map(it => {
        const b = document.createElement('div'); b.className = 'mp-b';
        b.innerHTML = '<div class="mp-l"></div><div class="mp-t"><div class="tr"><i></i><b class="base"></b></div><span></span></div>';
        b.querySelector('.mp-l').textContent = it.label; host.appendChild(b);
        return { it, fill: b.querySelector('i'), base: b.querySelector('.base'), val: b.querySelector('span') };
      });
      return { s, rows };
    });
    const tot = (mask, s, key) => D.groups.reduce((a, g, i) => a + (mask[i] ? (key === null ? g[s.den] : (g[s.id][key] || 0)) : 0), 0);
    const allOn = D.groups.map(() => true);
    const render = () => {
      secs.forEach(({ s, rows }) => {
        const den = tot(on, s, null), den0 = tot(allOn, s, null);
        rows.forEach(r => {
          const p0 = tot(allOn, s, r.it.key) / den0 * 100, p = den ? tot(on, s, r.it.key) / den * 100 : 0, d = p - p0;
          r.fill.style.width = p.toFixed(1) + '%'; r.base.style.left = p0.toFixed(1) + '%';
          r.val.innerHTML = den ? p.toFixed(1) + '%' + (Math.abs(d) >= 0.05 ? '<small class="' + (d > 0 ? 'up' : 'dn') + '">' + (d > 0 ? '+' : '−') + Math.abs(d).toFixed(1) + '</small>' : '') : '–';
          r.val.title = den ? 'All regions: ' + p0.toFixed(1) + '%' : '';
        });
      });
      const n = D.groups.reduce((a, g, i) => a + (on[i] ? g.n : 0), 0), nr = on.filter(Boolean).length;
      q('nline').innerHTML = n ? '<b>' + fmt(n) + '</b> stories from ' + nr + ' of ' + D.groups.length + ' groups · 95% interval up to ±' + (1.96 * Math.sqrt(0.25 / n) * 100).toFixed(1) + ' points'
                               : 'Select at least one region';
      q('regions').querySelectorAll('button').forEach((b, i) => b.classList.toggle('off', !on[i]));
    };
    const rl = q('regions'); rl.innerHTML = '';
    D.groups.forEach((g, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'mp-chip';
      b.innerHTML = '<span class="bx"></span><span class="nm"></span><span class="cn"></span>';
      b.querySelector('.nm').textContent = g.name; b.querySelector('.cn').textContent = fmt(g.n);
      b.addEventListener('click', () => { on[i] = !on[i]; b.blur(); render(); });
      rl.appendChild(b);
    });
    slide.querySelectorAll('.mp-all button').forEach(b => b.addEventListener('click', () => { on.fill(b.dataset.act === 'all'); b.blur(); render(); }));
    render();
  };
  init(window.MP_DATA); init(window.MK_DATA);
})();
