// =============================================
// ECOSCAN — Map Module
// Leaflet map, markers, layers, comparison
// =============================================

let map, faMarkersLayer, chlMarkersLayer;
let currentLayer = 'all';

function getQualityStyle(score) {
  const s = {
    1: { color:'#22c55e', label:'I — Normal',           emoji:'🟢' },
    2: { color:'#84cc16', label:'II — Minor',           emoji:'🟡' },
    3: { color:'#eab308', label:'III — Moderate',        emoji:'🟠' },
    4: { color:'#f97316', label:'IV — Significant',      emoji:'🔴' },
    5: { color:'#ef4444', label:'V — Critical',          emoji:'⛔' },
  };
  return s[score] || s[3];
}

function getChlColor(chl) {
  if (chl > 0.15)  return { color: '#1a7a2e', label: 'High' };
  if (chl > 0.05)  return { color: '#a3c94a', label: 'Medium' };
  if (chl > -0.05) return { color: '#f0c040', label: 'Low' };
  return              { color: '#e05c2a', label: 'Very Low' };
}

function createCustomIcon(score, type = 'fa') {
  if (type === 'fa') {
    const st = getQualityStyle(score);
    const c = st.color;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="60" viewBox="0 0 48 60">
      <defs>
        <filter id="fa-shadow-${score}" x="-40%" y="-30%" width="180%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="${c}" flood-opacity="0.45"/>
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="rgba(0,0,0,0.3)" flood-opacity="1"/>
        </filter>
        <radialGradient id="fa-body-${score}" cx="38%" cy="28%" r="70%">
          <stop offset="0%" stop-color="white" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.15"/>
        </radialGradient>
        <radialGradient id="fa-shine-${score}" cx="35%" cy="25%" r="55%">
          <stop offset="0%" stop-color="white" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
        <clipPath id="fa-clip-${score}">
          <path d="M24 1C12.40 1 3 10.40 3 22c0 16.5 21 37 21 37S45 38.5 45 22C45 10.40 35.60 1 24 1z"/>
        </clipPath>
      </defs>
      <ellipse cx="24" cy="22" rx="19" ry="19" fill="${c}" opacity="0.18"/>
      <path d="M24 1C12.40 1 3 10.40 3 22c0 16.5 21 37 21 37S45 38.5 45 22C45 10.40 35.60 1 24 1z"
        fill="${c}" filter="url(#fa-shadow-${score})"/>
      <path d="M24 1C12.40 1 3 10.40 3 22c0 16.5 21 37 21 37S45 38.5 45 22C45 10.40 35.60 1 24 1z"
        fill="url(#fa-body-${score})" clip-path="url(#fa-clip-${score})"/>
      <circle cx="24" cy="21" r="11.5" fill="white" opacity="0.95"/>
      <circle cx="24" cy="21" r="10" fill="none" stroke="${c}" stroke-width="1" opacity="0.25"/>
      <ellipse cx="20" cy="17" rx="4" ry="3" fill="url(#fa-shine-${score})" opacity="0.6"/>
      <text x="24" y="26" text-anchor="middle" font-size="13" font-weight="800"
        font-family="Georgia,serif" fill="${c}" letter-spacing="-0.5">${score}</text>
      <ellipse cx="24" cy="54" rx="2.5" ry="1.5" fill="white" opacity="0.3"/>
    </svg>`;
    return L.divIcon({
      html: svg,
      className: '',
      iconSize: [48, 60],
      iconAnchor: [24, 60],
      popupAnchor: [0, -64]
    });
  } else {
    const st = getChlColor(score);
    const c = st.color;
    const label = st.label === 'High' ? '🌿' : st.label === 'Medium' ? '🍃' : st.label === 'Low' ? '🍂' : '🟡';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="50" viewBox="0 0 44 50">
      <defs>
        <filter id="chl-shadow-${Math.abs(Math.round(score*1000))}" x="-50%" y="-40%" width="200%" height="220%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="${c}" flood-opacity="0.5"/>
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="rgba(0,0,0,0.25)" flood-opacity="1"/>
        </filter>
        <radialGradient id="chl-grad-${Math.abs(Math.round(score*1000))}" cx="35%" cy="25%" r="70%">
          <stop offset="0%" stop-color="white" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.2"/>
        </radialGradient>
        <radialGradient id="chl-shine-${Math.abs(Math.round(score*1000))}" cx="32%" cy="22%" r="50%">
          <stop offset="0%" stop-color="white" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <polygon points="22,2 40,13 40,35 22,46 4,35 4,13" fill="${c}" opacity="0.2"/>
      <polygon points="22,4 38,13 38,33 22,44 6,33 6,13"
        fill="${c}" filter="url(#chl-shadow-${Math.abs(Math.round(score*1000))})"/>
      <polygon points="22,4 38,13 38,33 22,44 6,33 6,13"
        fill="url(#chl-grad-${Math.abs(Math.round(score*1000))})"/>
      <circle cx="22" cy="24" r="10" fill="white" opacity="0.93"/>
      <circle cx="22" cy="24" r="8.5" fill="none" stroke="${c}" stroke-width="1" opacity="0.3"/>
      <ellipse cx="18" cy="19" rx="4" ry="2.5" fill="url(#chl-shine-${Math.abs(Math.round(score*1000))})" opacity="0.7"/>
      <text x="22" y="29" text-anchor="middle" font-size="12" fill="${c}" font-family="sans-serif">Chl</text>
    </svg>`;
    return L.divIcon({
      html: svg,
      className: '',
      iconSize: [44, 50],
      iconAnchor: [22, 50],
      popupAnchor: [0, -54]
    });
  }
}

function renderPins(pins) {
  if (!faMarkersLayer || !chlMarkersLayer) return;
  faMarkersLayer.clearLayers();
  chlMarkersLayer.clearLayers();
  (pins || []).forEach(pin => {
    if (!pin.lat || !pin.lng) return;
    const st = getQualityStyle(pin.score);
    const date = pin.date ? new Date(pin.date).toLocaleDateString('en-US') : '—';
    const chlValue = pin.chlIndex !== undefined ? Number(pin.chlIndex).toFixed(3) : '—';
    const stressValue = pin.stressIndex !== undefined ? (Number(pin.stressIndex) * 100).toFixed(0) + '%' : '—';
    const chlSt = pin.chlIndex !== undefined ? getChlColor(pin.chlIndex) : { color: '#999', label: '—' };
    const faMarker = L.marker([pin.lat, pin.lng], { icon: createCustomIcon(pin.score, 'fa') });
    faMarker.bindPopup(`
      <div style="font-family:'DM Sans',system-ui,sans-serif;min-width:230px;overflow:hidden;border-radius:18px">
        <div style="background:linear-gradient(135deg,${st.color},${st.color}dd);color:white;padding:14px 18px;font-weight:700;font-size:13px;letter-spacing:0.2px;display:flex;align-items:center;gap:8px">
          <span style="font-size:18px">${st.emoji}</span>
          <span>${st.label}</span>
          <span style="margin-left:auto;font-size:10px;font-weight:600;background:rgba(255,255,255,0.2);padding:2px 8px;border-radius:20px;letter-spacing:0.5px">FA Layer</span>
        </div>
        <div style="padding:14px 16px;background:#ffffff;font-size:13px;line-height:2;color:#374151">
          <div style="display:grid;grid-template-columns:auto 1fr;gap:0 12px;align-items:center">
            <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">Plant</span>
            <span style="font-weight:600;color:#111827">${pin.plant || '—'}</span>
            <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">FA</span>
            <span style="font-family:monospace;font-weight:700;color:${st.color}">${pin.asymmetry !== undefined ? Number(pin.asymmetry).toFixed(4) : '—'}</span>
            <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">Chlorophyll</span>
            <span style="font-weight:700;color:${chlSt.color}">${chlValue} <span style="font-weight:500;color:#6b7280">(${chlSt.label})</span></span>
            <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">Stress</span>
            <span style="font-weight:700;color:#374151">${stressValue}</span>
            <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">Date</span>
            <span style="color:#6b7280">${date}</span>
          </div>
        </div>
      </div>
    `, { maxWidth: 280, className: 'eco-popup' });
    faMarkersLayer.addLayer(faMarker);
    if (pin.chlIndex !== undefined) {
      const offset = 0.0005;
      const chlMarker = L.marker([pin.lat + offset, pin.lng + offset], { icon: createCustomIcon(pin.chlIndex, 'chl') });
      chlMarker.bindPopup(`
        <div style="font-family:'DM Sans',system-ui,sans-serif;min-width:230px;overflow:hidden;border-radius:18px">
          <div style="background:linear-gradient(135deg,${chlSt.color},${chlSt.color}dd);color:white;padding:14px 18px;font-weight:700;font-size:13px;display:flex;align-items:center;gap:8px">
            <span style="font-size:18px">🌿</span>
            <span>${chlSt.label}</span>
            <span style="margin-left:auto;font-size:10px;font-weight:600;background:rgba(255,255,255,0.2);padding:2px 8px;border-radius:20px;letter-spacing:0.5px">Chlorophyll</span>
          </div>
          <div style="padding:14px 16px;background:#ffffff;font-size:13px;line-height:2;color:#374151">
            <div style="display:grid;grid-template-columns:auto 1fr;gap:0 12px;align-items:center">
              <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">Plant</span>
              <span style="font-weight:600;color:#111827">${pin.plant || '—'}</span>
              <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">ChI</span>
              <span style="font-family:monospace;font-weight:700;color:${chlSt.color}">${chlValue}</span>
              <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">FA Score</span>
              <span style="font-weight:600;color:#374151">${st.emoji} ${st.label}</span>
              <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">Stress</span>
              <span style="font-weight:700;color:#374151">${stressValue}</span>
              <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">Date</span>
              <span style="color:#6b7280">${date}</span>
            </div>
          </div>
        </div>
      `, { maxWidth: 280, className: 'eco-popup' });
      chlMarkersLayer.addLayer(chlMarker);
    }
  });
  applyLayerVisibility();
  updateComparison(pins);
  updateDynamicRecommendations(pins);

  const statPins = document.getElementById('statPinsCount');
  const statSpecies = document.getElementById('statSpeciesCount');
  if (statPins) statPins.textContent = (pins || []).length;
  if (statSpecies) {
    const uniqueSpecies = new Set((pins || []).map(p => p.plant).filter(Boolean));
    statSpecies.textContent = uniqueSpecies.size;
  }
}

function applyLayerVisibility() {
  if (!map) return;
  if (currentLayer === 'all') {
    if (!map.hasLayer(faMarkersLayer))  map.addLayer(faMarkersLayer);
    if (!map.hasLayer(chlMarkersLayer)) map.addLayer(chlMarkersLayer);
  } else if (currentLayer === 'fa') {
    if (!map.hasLayer(faMarkersLayer))   map.addLayer(faMarkersLayer);
    if (map.hasLayer(chlMarkersLayer))   map.removeLayer(chlMarkersLayer);
  } else {
    if (map.hasLayer(faMarkersLayer))    map.removeLayer(faMarkersLayer);
    if (!map.hasLayer(chlMarkersLayer))  map.addLayer(chlMarkersLayer);
  }
  updateLegendForLayer();
}

function updateLegendForLayer() {
  const chlElements = ['chlLegendDivider','chlLegendTitle','chlLeg1','chlLeg2','chlLeg3','chlLeg4'];
  const legendTitle = document.getElementById('legendTitle');
  if (currentLayer === 'fa') {
    if (legendTitle) legendTitle.textContent = 'FA Index';
    chlElements.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
  } else if (currentLayer === 'chl') {
    if (legendTitle) legendTitle.textContent = 'Chlorophyll';
    chlElements.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = ''; });
    const divider = document.getElementById('chlLegendDivider');
    if (divider) divider.style.display = 'none';
  } else {
    if (legendTitle) legendTitle.textContent = 'FA Index / Stress';
    chlElements.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = ''; });
  }
}

document.querySelectorAll('.layer-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.layer-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentLayer = this.dataset.layer;
    applyLayerVisibility();
    const hints = {
      all: 'Showing both indices (FA markers = teardrop, chlorophyll = hexagon)',
      fa: 'FA Layer: chronic/accumulated pollution',
      chl: 'Chlorophyll Layer: current/acute status',
    };
    const hint = document.getElementById('layerHint');
    if (hint) hint.textContent = hints[currentLayer] || '';
  });
});

// MAP INITIALIZATION
function initMap() {
  if (map) return;
  map = L.map('mapContainer', {
    center: [20, 0],
    zoom: 2,
    zoomControl: false,
    attributionControl: true,
  });

  const lightTile = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  const tileLayer = L.tileLayer(lightTile, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);
  faMarkersLayer  = L.layerGroup().addTo(map);
  chlMarkersLayer = L.layerGroup().addTo(map);
  renderPins(loadPins());
}

const mapSection = document.getElementById('map');
if (mapSection) {
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) initMap();
  }, { threshold: 0.1 }).observe(mapSection);
}

// COMPARISON CHART
function updateComparison(pins) {
  const container = document.getElementById('comparisonChart');
  if (!container) return;
  const groups = {};
  (pins || []).forEach(pin => {
    if (!pin.plant) return;
    if (!groups[pin.plant]) groups[pin.plant] = { fa: [], chl: [], stress: [] };
    if (pin.asymmetry !== undefined) groups[pin.plant].fa.push(Number(pin.asymmetry));
    if (pin.chlIndex !== undefined)  groups[pin.plant].chl.push(Number(pin.chlIndex));
    if (pin.stressIndex !== undefined) groups[pin.plant].stress.push(Number(pin.stressIndex));
  });
  const species = Object.keys(groups);
  if (species.length === 0) {
    container.innerHTML = '<div class="comparison-empty">No data yet — add analysis results to the map</div>';
    return;
  }
  const avg = arr => arr.length ? arr.reduce((a,b) => a+b, 0) / arr.length : null;
  const rows = species.map(sp => ({
    name: sp,
    avgFa: avg(groups[sp].fa),
    avgChl: avg(groups[sp].chl),
    avgStress: avg(groups[sp].stress),
    count: Math.max(groups[sp].fa.length, groups[sp].stress.length),
  })).sort((a, b) => (a.avgStress || 0) - (b.avgStress || 0));

  const allStress = rows.map(r => r.avgStress).filter(v => v !== null);
  const overallAvgStress = allStress.length ? avg(allStress) : null;
  const bestSpecies = rows.length ? rows[0] : null;
  const totalSamples = rows.reduce((sum, r) => sum + r.count, 0);

  let html = '';

  html += `<div class="comp-overall-stats">
    <div class="comp-stat">
      <div class="comp-stat-value">${rows.length}</div>
      <div class="comp-stat-label">Species Tracked</div>
    </div>
    <div class="comp-stat">
      <div class="comp-stat-value">${overallAvgStress !== null ? (overallAvgStress * 100).toFixed(0) + '%' : '—'}</div>
      <div class="comp-stat-label">Avg Stress Level</div>
    </div>
    <div class="comp-stat">
      <div class="comp-stat-value">${totalSamples}</div>
      <div class="comp-stat-label">Total Samples</div>
    </div>
  </div>`;

  html += '<div class="comp-species-grid">';

  rows.forEach(row => {
    const stressPct = row.avgStress !== null ? (row.avgStress * 100).toFixed(0) : '0';
    const stressLevel = row.avgStress !== null
      ? (row.avgStress < 0.3 ? 'low' : row.avgStress < 0.5 ? 'medium' : 'high')
      : 'medium';
    const faPct = row.avgFa !== null ? Math.min(100, ((row.avgFa - 0.030) / (0.065 - 0.030)) * 100).toFixed(0) : 0;
    const chlPct = row.avgChl !== null ? Math.min(100, ((row.avgChl + 0.15) / (0.40)) * 100).toFixed(0) : 50;

    const stressIcon = stressLevel === 'low' ? '🌿' : stressLevel === 'medium' ? '⚠️' : '🔴';
    const stressLabel = stressLevel === 'low' ? 'Low Stress' : stressLevel === 'medium' ? 'Moderate' : 'High Stress';

    html += `<div class="comp-species-card">
      <div class="comp-species-header">
        <span class="comp-species-name">${row.name}</span>
        <span class="comp-species-icon">🌱</span>
      </div>
      <span class="comp-species-count">${row.count} sample${row.count !== 1 ? 's' : ''}</span>
      <div class="comp-metrics">
        <div class="comp-metric">
          <div class="comp-metric-header">
            <span class="comp-metric-label">Fluctuating Asymmetry</span>
            <span class="comp-metric-value">${row.avgFa !== null ? row.avgFa.toFixed(4) : '—'}</span>
          </div>
          <div class="comp-metric-bar">
            <div class="comp-metric-bar-fill ${faPct < 30 ? 'low' : faPct < 55 ? 'medium' : 'high'}" style="width: ${faPct}%"></div>
          </div>
        </div>
        <div class="comp-metric">
          <div class="comp-metric-header">
            <span class="comp-metric-label">Chlorophyll Index</span>
            <span class="comp-metric-value">${row.avgChl !== null ? row.avgChl.toFixed(3) : '—'}</span>
          </div>
          <div class="comp-metric-bar">
            <div class="comp-metric-bar-fill ${chlPct > 70 ? 'low' : chlPct > 45 ? 'medium' : 'high'}" style="width: ${chlPct}%"></div>
          </div>
        </div>
        <div class="comp-metric">
          <div class="comp-metric-header">
            <span class="comp-metric-label">Overall Stress</span>
            <span class="comp-metric-value">${stressPct}%</span>
          </div>
          <div class="comp-metric-bar">
            <div class="comp-metric-bar-fill ${stressLevel}" style="width: ${stressPct}%"></div>
          </div>
        </div>
      </div>
      <div class="comp-stress-badge ${stressLevel}">
        ${stressIcon} ${stressLabel}
      </div>
    </div>`;
  });

  html += '</div>';

  container.innerHTML = html;
}

// DYNAMIC RECOMMENDATIONS
function updateDynamicRecommendations(pins) {
  const block = document.getElementById('recDynamic');
  const content = document.getElementById('recDynamicContent');
  if (!block || !content || !pins || pins.length === 0) {
    block?.classList.add('hidden');
    return;
  }
  const avgStress = pins.reduce((s, p) => s + (p.stressIndex || 0), 0) / pins.length;
  const chlPins = pins.filter(p => p.chlIndex !== undefined);
  const avgChl = chlPins.length ? chlPins.reduce((s, p) => s + p.chlIndex, 0) / chlPins.length : null;
  let recs = [];
  if (avgStress > 0.6) {
    recs.push({ icon: '🏭', text: 'High average stress level. Consider planting pollution-tolerant species: <strong>Balsam Poplar</strong>, <strong>White Willow</strong>.' });
    recs.push({ icon: '🚫', text: 'Not recommended: <strong>Norway Maple</strong>, <strong>Silver Birch</strong> — sensitive to pollution.' });
  } else if (avgStress > 0.35) {
    recs.push({ icon: '🌳', text: 'Moderate pollution level. <strong>Small-leaved Lime</strong> and <strong>Goat Willow</strong> are suitable.' });
    recs.push({ icon: '📊', text: 'Use <strong>Silver Birch</strong> as a bioindicator to monitor environmental changes.' });
  } else {
    recs.push({ icon: '🌿', text: 'Favorable environmental conditions. You can plant any species, including <strong>Norway Maple</strong> and <strong>Silver Birch</strong>.' });
    recs.push({ icon: '✨', text: 'For maximum biodiversity, consider mixed plantings of various species.' });
  }
  if (avgChl !== null && avgChl < 0.02) {
    recs.push({ icon: '⚠️', text: 'Low chlorophyll index indicates <strong>acute pollution</strong>. Check for emission sources within 500m radius.' });
  }
  content.innerHTML = recs.map(r => `<div class="rec-dynamic__item"><span class="rec-dynamic__icon">${r.icon}</span><span>${r.text}</span></div>`).join('');
  block.classList.remove('hidden');
}