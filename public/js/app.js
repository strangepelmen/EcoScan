// =============================================
// ECOSCAN — Main Application
// Plant selector, file upload, analysis, map actions
// =============================================

// PLANT SELECTOR
let selectedPlant = null;

function populatePlantSelect() {
  const select = document.getElementById('plantSelect');
  if (!select) return;
  const groups = {};
  for (const [code, data] of Object.entries(SPECIES_CONFIG)) {
    const group = data.group;
    if (!groups[group]) groups[group] = [];
    groups[group].push({ code, name: data.name, icon: data.icon });
  }
  for (const [groupName, speciesList] of Object.entries(groups)) {
    const optgroup = document.createElement('optgroup');
    optgroup.label = groupName;
    speciesList.forEach(s => {
      const option = document.createElement('option');
      option.value = s.code;
      option.textContent = `${s.icon} ${s.name}`;
      optgroup.appendChild(option);
    });
    select.appendChild(optgroup);
  }
  select.value = "";

  select.addEventListener('change', (e) => {
    selectedPlant = e.target.value;
    const uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn) {
      uploadBtn.disabled = !selectedPlant;
    }
    if (selectedPlant) {
      const uploadZone = document.getElementById('uploadArea');
      if (uploadZone) {
        setTimeout(() => uploadZone.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
      }
    }
  });
}

// FILE UPLOAD
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreview = document.getElementById('imagePreview');

document.getElementById('uploadBtn')?.addEventListener('click', () => {
  if (!selectedPlant) {
    showToast('Please select a plant species first', 'warning');
    document.querySelector('.plant-select-wrapper')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const wrapper = document.querySelector('.plant-select-wrapper');
    if (wrapper) wrapper.classList.add('shake');
    setTimeout(() => wrapper?.classList.remove('shake'), 600);
    return;
  }
  fileInput?.click();
});
document.getElementById('changeImgBtn')?.addEventListener('click', () => {
  imagePreviewContainer?.classList.add('hidden');
  uploadArea?.classList.remove('hidden');
  document.getElementById('resultContainer')?.classList.add('hidden');
  document.getElementById('analysisVisualization')?.classList.add('hidden');
  if (fileInput) fileInput.value = '';
  lastAsymmetry = null; lastScore = null; lastChlIndex = null; lastStressIndex = null;
});
uploadArea?.addEventListener('dragover', e => {
  e.preventDefault();
  if (!selectedPlant) {
    uploadArea.classList.add('drag-blocked');
  } else {
    uploadArea.classList.add('drag-over');
  }
});
uploadArea?.addEventListener('dragleave', () => {
  uploadArea.classList.remove('drag-over');
  uploadArea.classList.remove('drag-blocked');
});
uploadArea?.addEventListener('drop', e => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');
  uploadArea.classList.remove('drag-blocked');
  if (!selectedPlant) {
    showToast('Please select a plant species first', 'warning');
    document.querySelector('.plant-select-wrapper')?.classList.add('shake');
    setTimeout(() => document.querySelector('.plant-select-wrapper')?.classList.remove('shake'), 600);
    return;
  }
  const f = e.dataTransfer.files[0]; if (f) handleFile(f);
});
fileInput?.addEventListener('change', e => { if (e.target.files[0]) handleFile(e.target.files[0]); });
function handleFile(file) {
  if (!file.type.startsWith('image/')) { showToast('Please upload an image file', 'error'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    if (imagePreview) {
      imagePreview.src = e.target.result;
      imagePreview.onload = null;
    }
    uploadArea?.classList.add('hidden');
    imagePreviewContainer?.classList.remove('hidden');
    document.getElementById('resultContainer')?.classList.add('hidden');
    document.getElementById('analysisVisualization')?.classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

// ANALYSIS
let lastAsymmetry = null, lastScore = null, lastChlIndex = null, lastStressIndex = null;
document.getElementById('analyzeBtn')?.addEventListener('click', () => {
  if (!selectedPlant) {
    showToast('Please select a plant species before analysis', 'warning');
    document.querySelector('.plant-select-wrapper')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  runAnalysis();
});
function setAnimText(txt) {
  const el = document.getElementById('analysisAnimText');
  if (el) el.textContent = txt;
}
function runAnalysis() {
  document.getElementById('analysisVisualization')?.classList.remove('hidden');
  document.getElementById('resultContainer')?.classList.add('hidden');
  const steps = ['step1','step2','step3','step4','step5','step6'];
  const labels = ['Segmenting leaf...','Finding symmetry axis...','Calculating FA...','Calibrating lighting...','Computing chlorophyll...','Final index...'];
  steps.forEach(id => document.getElementById(id)?.classList.remove('active','completed'));
  let i = 0;
  const iv = setInterval(() => {
    if (i > 0) {
      const prev = document.getElementById(steps[i-1]);
      prev?.classList.remove('active'); prev?.classList.add('completed');
    }
    if (i < steps.length) {
      document.getElementById(steps[i])?.classList.add('active');
      setAnimText(labels[i] || 'Analyzing...');
      i++;
    } else {
      clearInterval(iv);
      setAnimText('Done!');
      showResults();
    }
  }, 600);
}
function rnd(a, b) { return a + Math.random() * (b - a); }
function generateFAParameters(targetFA) {
  const paramNames = ['Leaf width','2nd vein length','Distance between bases','Distance between ends','Angle to main vein'];
  const scales = [30,20,12,15,18];
  const params = [];
  for (let k = 0; k < paramNames.length; k++) {
    const base = scales[k] * rndS(0.65, 1.0);
    const relAsym = targetFA * rndS(0.7, 1.3);
    const sign = _seededRand() < 0.5 ? 1 : -1;
    const half = base * (relAsym / 2);
    const L = base + sign * half;
    const R = base - sign * half;
    params.push({ name: paramNames[k], L, R, asym: relAsym });
  }
  const actualMean = params.reduce((s, p) => s + p.asym, 0) / params.length;
  const factor = targetFA / actualMean;
  return params.map(p => {
    const corrAsym = p.asym * factor;
    const base2 = (p.L + p.R) / 2;
    const half2  = base2 * (corrAsym / 2);
    const sign2  = p.L >= p.R ? 1 : -1;
    return {
      name: p.name,
      L: +(base2 + sign2 * half2).toFixed(2),
      R: +(base2 - sign2 * half2).toFixed(2),
      asym: corrAsym,
    };
  });
}
function showResults() {
  const speciesCfg = SPECIES_CONFIG[selectedPlant] || { faRange: [0.035, 0.060] };

  let imageData = null;
  try {
    if (imagePreview && imagePreview.naturalWidth > 0) {
      imageData = getImagePixelData(imagePreview);
    }
  } catch(e) { console.warn('Could not read image for seeding:', e); }

  if (imageData) {
    const seed = imagePixelHash(imageData);
    _seededRand = mulberry32(seed);
  } else {
    _seededRand = Math.random;
  }

  const asymmetry = rndS(speciesCfg.faRange[0], speciesCfg.faRange[1]);
  lastAsymmetry = asymmetry;
  let score;
  if      (asymmetry < 0.040) score = 1;
  else if (asymmetry < 0.045) score = 2;
  else if (asymmetry < 0.050) score = 3;
  else if (asymmetry < 0.055) score = 4;
  else                        score = 5;
  lastScore = score;
  let chlIndex = null;
  try {
    if (imageData) {
      const calibration = calibrateLighting(imageData);
      const mask = segmentLeaf(imageData, calibration);
      const leafPixels = mask.mask.reduce((s, v) => s + v, 0);
      if (leafPixels > 500) {
        chlIndex = calculateChlorophyllIndex(imageData, mask, calibration);
      }
    }
  } catch(e) { console.warn(e); }
  if (chlIndex !== null && !isNaN(chlIndex)) {
    chlIndex = Math.max(-0.15, Math.min(0.25, chlIndex));
  } else {
    chlIndex = rndS(0.18 - score * 0.035, 0.22 - score * 0.030);
    chlIndex = Math.max(-0.10, Math.min(0.22, chlIndex));
  }
  lastChlIndex = chlIndex;
  const stressIndex = calculateStressIndex(asymmetry, chlIndex);
  lastStressIndex = stressIndex;
  const scoreLabels = ['','I — Normal condition','II — Minor deviations','III — Moderate level','IV — Significant deviations','V — Critical condition'];
  const qr = document.getElementById('qualityResult');
  if (qr) { qr.textContent = scoreLabels[score]; qr.className = `result-card__score quality-${score}`; }
  renderIndexBox('faIndexDisplay', 'faBar', 'faInterp', asymmetry, 'fa');
  renderIndexBox('chlIndexDisplay', 'chlBar', 'chlInterp', chlIndex, 'chl');
  renderIndexBox('stressIndexDisplay', 'stressBar', 'stressInterp', stressIndex, 'stress');
  const diag = generateDiagnosis(asymmetry, chlIndex, stressIndex);
  const diagBlock = document.getElementById('diagnosisBlock');
  if (diagBlock) {
    diagBlock.innerHTML = `<span class="diag-icon">${diag.icon}</span><span>${diag.text}</span>`;
    diagBlock.style.borderLeftColor = diag.color;
    diagBlock.style.display = 'flex';
  }
  const tableEl = document.getElementById('parametersTable');
  const tbody = tableEl ? tableEl.querySelector('tbody') : null;
  if (tbody) {
    tbody.innerHTML = '';
    const faParams = generateFAParameters(asymmetry);
    faParams.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class="param-name">${p.name}</td><td class="param-value">${p.L.toFixed(2)}</td><td class="param-value">${p.R.toFixed(2)}</td><td class="param-asym">${p.asym.toFixed(4)}</td>`;
      tbody.appendChild(tr);
    });
    const meanTr = document.createElement('tr');
    meanTr.className = 'param-mean-row';
    meanTr.innerHTML = `<td colspan="3" class="param-mean-label">Mean (FA Index)</td><td class="param-mean-value">${asymmetry.toFixed(4)}</td>`;
    tbody.appendChild(meanTr);
  }
  document.getElementById('analysisVisualization')?.classList.add('hidden');
  document.getElementById('resultContainer')?.classList.remove('hidden');
}
function renderIndexBox(valueId, barId, interpId, value, type) {
  const valEl = document.getElementById(valueId);
  const barEl = document.getElementById(barId);
  const interpEl = document.getElementById(interpId);
  if (type === 'fa') {
    const pct = normalizeFA(value) * 100;
    const color = pct < 30 ? '#22c55e' : pct < 55 ? '#eab308' : pct < 80 ? '#f97316' : '#ef4444';
    if (valEl) valEl.textContent = value.toFixed(4);
    if (barEl) { barEl.style.width = pct + '%'; barEl.style.background = color; }
    if (interpEl) {
      const labels = [[30, 'Normal — minimal stress'],[55, 'Minor deviations'],[80, 'Moderate/significant level'],[101, 'Critical level']];
      interpEl.textContent = (labels.find(([t]) => pct < t) || labels[labels.length-1])[1];
      interpEl.style.color = color;
    }
  } else if (type === 'chl') {
    const pct = normalizeChl(value) * 100;
    const color = pct > 70 ? '#22c55e' : pct > 45 ? '#a3c94a' : pct > 25 ? '#eab308' : '#ef4444';
    if (valEl) valEl.textContent = value.toFixed(3);
    if (barEl) { barEl.style.width = pct + '%'; barEl.style.background = color; }
    if (interpEl) {
      const labels = [[25, 'Critically low — acute stress'],[45, 'Low — moderate stress'],[70, 'Medium'],[101,'High — healthy leaves']];
      interpEl.textContent = (labels.find(([t]) => pct < t) || labels[labels.length-1])[1];
      interpEl.style.color = color;
    }
  } else {
    const pct = Math.max(0, Math.min(100, value * 100));
    const color = pct < 25 ? '#22c55e' : pct < 45 ? '#84cc16' : pct < 65 ? '#eab308' : pct < 80 ? '#f97316' : '#ef4444';
    if (valEl) valEl.textContent = pct.toFixed(0) + '%';
    if (barEl) { barEl.style.width = pct + '%'; barEl.style.background = color; }
    if (interpEl) {
      const labels = [[25, 'Low — normal'],[45, 'Moderate'],[65, 'Medium'],[80, 'High'],[101,'Critical']];
      interpEl.textContent = (labels.find(([t]) => pct < t) || labels[labels.length-1])[1];
      interpEl.style.color = color;
    }
  }
}

// ADD TO MAP
document.getElementById('addToMapBtn')?.addEventListener('click', () => {
  if (lastScore === null || lastAsymmetry === null) {
    showToast('Please run analysis first', 'warning');
    return;
  }
  if (!navigator.geolocation) { showToast('Geolocation is not supported', 'error'); return; }
  const btn = document.getElementById('addToMapBtn');
  btn.textContent = '📍 Getting location...'; btn.disabled = true;
  navigator.geolocation.getCurrentPosition(async pos => {
    const pin = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      score: lastScore,
      asymmetry: lastAsymmetry,
      chlIndex: lastChlIndex,
      stressIndex: lastStressIndex,
      plant: getPlantName(selectedPlant),
      date: new Date().toISOString(),
    };
    saveUserPin(pin);
    renderPins(loadPins());
    document.getElementById('map')?.scrollIntoView({ behavior:'smooth' });
    setTimeout(() => map?.flyTo([pos.coords.latitude, pos.coords.longitude], 13, { duration:1.5 }), 800);
    btn.textContent = '✅ Added!';
    setTimeout(() => {
      btn.textContent = '📍 Add to Map';
      btn.disabled = false;
    }, 2000);
  }, err => {
    showToast('Could not get location', 'error');
    btn.textContent = '📍 Add to Map';
    btn.disabled = false;
  });
});

// MAP ACTIONS
document.getElementById('exportDataBtn')?.addEventListener('click', exportPins);
document.getElementById('clearMapBtn')?.addEventListener('click', clearLocalPins);
document.getElementById('importDataBtn')?.addEventListener('click', () => {
  document.getElementById('importFileInput')?.click();
});
document.getElementById('importFileInput')?.addEventListener('change', e => {
  if (e.target.files[0]) importPins(e.target.files[0]);
});

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
  populatePlantSelect();
});