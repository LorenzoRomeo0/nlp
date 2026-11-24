/* Slide 35: steering interattivo, tutto precalcolato (js/steer_data.js). Scelte: direzione, prompt, alpha. */
(() => {
  const D = window.STEER_DATA, slide = document.querySelector('.s-st'); if (!D || !slide) return;
  const $ = id => slide.querySelector('#' + id); let st = { dir: 'decision', prompt: 'Morocco', alpha: 0, k: 0 };
  const cell = (p, d, a) => D.cells[p + '|' + (a === 0 ? 'decision' : d) + '|' + (a >= 0 ? '+' : '') + a] || D.cells[p + '|decision|+0'];
  const fmt = a => (a > 0 ? '+' : a < 0 ? '−' : '') + Math.abs(a);
  const mkBars = (host, items) => items.map(it => { const b = document.createElement('div'); b.className = 'sb ' + (it.cls || ''); b.innerHTML = '<div class="l"></div><div class="t"><div class="tr"><i></i><b></b></div><span></span></div>'; b.querySelector('.l').textContent = it.label; host.appendChild(b); return { it, fill: b.querySelector('i'), base: b.querySelector('b'), val: b.querySelector('span') }; });
  const groups = {
    decision: mkBars($('st-decision'), [{ key: 'tells', label: 'Tells the friend', cls: 'tel' }, { key: 'silent', label: 'Stays silent', cls: 'sil' }, { key: 'waits', label: 'Waits or investigates' }, { key: 'other', label: 'Other' }]),
    gender: mkBars($('st-gender'), [{ key: 'female', label: 'Woman' }, { key: 'male', label: 'Man' }, { key: 'unspec', label: 'Not specified' }]),
    themes: mkBars($('st-themes'), D.themes.map(t => ({ key: t[0], label: t[1] })))
  };
  const text = [{ label: 'Coherent stories' }, { label: 'Words per story' }].map(it => { const b = document.createElement('div'); b.className = 'sv'; b.innerHTML = '<span class="l"></span><b></b>'; b.querySelector('.l').textContent = it.label; $('st-text').appendChild(b); return b.querySelector('b'); });
  const setBars = (g, vals, base, cur) => g.forEach(r => { const v = (vals[r.it.key] || 0) * 100, b = (base[r.it.key] || 0) * 100, d = v - b; r.fill.style.width = v.toFixed(1) + '%'; r.base.style.left = b.toFixed(1) + '%';
    r.val.innerHTML = v.toFixed(0) + '%' + (Math.abs(d) >= 0.5 ? '<small class="' + (d > 0 ? 'up' : 'dn') + '">' + (d > 0 ? '+' : '−') + Math.abs(d).toFixed(0) + '</small>' : ''); });
  const chips = (host, items, cur, on) => { host.innerHTML = ''; items.forEach(([k, l]) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip' + (String(k) === String(cur) ? ' on' : ''); b.textContent = l; b.addEventListener('click', () => { on(k); b.blur(); }); host.appendChild(b); }); };
  const render = () => {
    if (!D.alphas[st.dir].includes(st.alpha)) st.alpha = D.alphas[st.dir].reduce((a, b) => Math.abs(b - st.alpha) < Math.abs(a - st.alpha) ? b : a);
    chips($('st-dirs'), D.directions, st.dir, k => { st.dir = k; st.k = 0; render(); });
    chips($('st-prompts'), D.prompts, st.prompt, k => { st.prompt = k; st.k = 0; render(); });
    chips($('st-alphas'), D.alphas[st.dir].map(a => [a, fmt(a)]), st.alpha, k => { st.alpha = +k; st.k = 0; render(); });
    const c = cell(st.prompt, st.dir, st.alpha), b = D.cells[st.prompt + '|decision|+0'];
    setBars(groups.decision, c.decision, b.decision); setBars(groups.gender, c.gender, b.gender); setBars(groups.themes, c.themes, b.themes);
    text[0].textContent = (c.coherent * 100).toFixed(0) + '%'; text[1].textContent = c.words.toFixed(0);
    const s = c.stories[st.k % Math.max(c.stories.length, 1)]; $('st-story').textContent = s ? s.t : '';
    $('st-warn').textContent = c.coherent < 0.9 ? 'At this strength ' + Math.round((1 - c.coherent) * 100) + '% of the stories are no longer coherent: the text starts to break.' : '';
    $('st-nline').innerHTML = '<b>' + c.valid + '</b> valid stories of ' + c.n + (st.alpha === 0 ? ' · no intervention' : ' · ' + D.directions.find(d => d[0] === st.dir)[1].toLowerCase() + ', α = ' + fmt(st.alpha));
  };
  { const q = (new URLSearchParams(location.search).get('st') || '').split(','); if (q.length === 3) st = { dir: q[1], prompt: q[0], alpha: +q[2], k: 0 }; }   // utilita' di test: ?st=Morocco,decision,4
  $('st-next').addEventListener('click', e => { st.k++; e.target.blur(); render(); }); render();
})();
