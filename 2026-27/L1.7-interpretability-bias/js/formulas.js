/* Rende con KaTeX ogni elemento .tex (il sorgente LaTeX e' il testo dell'elemento; .block = formula a riga propria). */
(function () {
  if (!window.katex) return;
  document.querySelectorAll('.tex').forEach(function (el) {
    var src = el.textContent;
    katex.render(src, el, { displayMode: el.classList.contains('block'), throwOnError: false, strict: false });
  });
})();
