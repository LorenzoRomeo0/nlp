# Last lecture: bias, narratives and mechanistic interpretability

Slides for the last lecture of the Natural Language Processing course, adapted from the deck "AI, Ethics and Language".

The lecture covers what the literature shows on representation bias and homogenisation, our own experiment on one moral dilemma written by a model for 55 countries, and the mechanistic methods (attribution, probing, interventions) used to look inside a model.

## Open the presentation

Open `index.html` in a browser. It is self-contained and works offline (reveal.js, fonts, d3 and the world map are in `vendor/`). `reports/report_final.html` and `reports/report_profiles.html` are interactive reports of the experiment (static copies, also self-contained).

Keys: arrows to move, `t` to switch light/dark theme.

## Work on the slides

```
python3 serve.py        # http://localhost:8765, rebuilds and reloads on every save
python3 build.py        # rebuild index.html from template.html + slides/*.html + css + js
```

- `slides/NN_name.html`: one slide (or group of vertical slides) per file, in order. `index.html` is **generated**: edit the files in `slides/`, `css/` and `js/`, never `index.html`.
- `css/theme.css` (theme and common layout), `css/slides.css` (slide-specific styles), `js/` (reveal setup, animations, interactive profiles), `assets/`, `figures/`, `vendor/`, `reports/`.

## What is not here

Raw generations, judgments, embeddings and the experiment code stay on the author's machine. `reports/` contains snapshots of the two reports built from them.

## Rights

All rights reserved by the author.
