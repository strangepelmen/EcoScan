# 🌿 EcoScan

### Environmental Quality Assessment Using Leaf Symmetry Analysis

> A beautiful, client-side web application that analyzes leaf fluctuating asymmetry and chlorophyll index to assess environmental quality — no server required.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-brightgreen)](https://strangepelmen.github.io/EcoScan)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Leaflet.js](https://img.shields.io/badge/Maps-Leaflet.js-87B979)](https://leafletjs.com/)

---

## Features

### 🔬 Scientific Analysis
- **Fluctuating Asymmetry (FA)** — Measures random deviations from perfect leaf symmetry
- **Chlorophyll Index** — Calculates plant health from photograph color channels
- **Stress Index** — Combined metric for overall environmental quality

### 🗺️ Interactive Mapping
- Global map with 30+ pre-loaded sample locations worldwide
- Two independent layers: FA (chronic pollution) and Chlorophyll (current status)
- Custom SVG markers with color-coded severity levels

### 📊 Beautiful Visualization
- Real-time analysis progress with animated steps
- Species comparison charts with visual metrics
- Fully responsive (mobile, tablet, desktop)


---

## How to Use

1. **Select a Plant Species** — Choose from 24+ species (Willows, Poplars, Birches, Maples...)
2. **Photograph a Leaf** — Use a white background for best accuracy
3. **Upload & Analyze** — Get FA Index, Chlorophyll Index, and Stress Score
4. **Add to Map** — Share results anonymously on the global map

---

## Tech Stack

| | |
|---|---|
| **Frontend** | Vanilla HTML5, CSS3, ES6+ JavaScript |
| **Maps** | Leaflet.js 1.9.4 |
| **Image Processing** | Canvas API |
| **Data Storage** | LocalStorage (client-side only) |
| **Typography** | Cormorant Garamond + DM Sans |

---

## Project Structure

```
EcoScan/
├── public/
│   ├── css/
│   │   ├── variables.css    # Design tokens
│   │   ├── base.css         # Reset, typography
│   │   ├── layout.css       # Header, hero, footer
│   │   ├── components.css   # Buttons, cards, UI
│   │   └── sections.css     # Page sections
│   └── js/
│       ├── data.js          # Species config, default pins
│       ├── storage.js       # LocalStorage persistence
│       ├── ui.js            # Header, menu, toasts
│       ├── analysis.js     # Image processing
│       ├── map.js           # Leaflet map, markers
│       └── app.js           # Main application
├── index.html
├── .gitignore
├── LICENSE
└── README.md
```

---

## License

MIT License — see [`LICENSE`](LICENSE) file.

---

*Built with 🌿 and scientific precision*
