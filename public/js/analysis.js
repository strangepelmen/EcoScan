// =============================================
// ECOSCAN — Image Analysis Engine
// Seeded PRNG, Canvas utilities, Leaf analysis
// =============================================

// SEEDED PRNG — deterministic results per image
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function imagePixelHash(imageData) {
  const { data, width, height } = imageData;
  const step = Math.max(1, Math.floor(width * height / 2000));
  let h = 0x12345678;
  for (let i = 0; i < width * height; i += step) {
    const idx = i * 4;
    h ^= (data[idx] * 1000003 + data[idx + 1] * 999983 + data[idx + 2] * 999979 + i * 31337) | 0;
    h = (h ^ h >>> 13) * 0x85ebca6b | 0;
    h = (h ^ h >>> 15) * 0xc2b2ae35 | 0;
    h ^= h >>> 16;
  }
  return h >>> 0;
}

let _seededRand = Math.random;
function rndS(a, b) { return a + _seededRand() * (b - a); }

// IMAGE ANALYSIS — CANVAS UTILITIES
function getImagePixelData(imgEl) {
  const canvas = document.getElementById('analysisCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = imgEl.naturalWidth || imgEl.width;
  canvas.height = imgEl.naturalHeight || imgEl.height;
  ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function calibrateLighting(imageData) {
  const { data, width, height } = imageData;
  const borderSize = Math.floor(Math.min(width, height) * 0.05);
  let rSum = 0, gSum = 0, bSum = 0, count = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x < borderSize || x >= width - borderSize ||
          y < borderSize || y >= height - borderSize) {
        const idx = (y * width + x) * 4;
        rSum += data[idx];
        gSum += data[idx + 1];
        bSum += data[idx + 2];
        count++;
      }
    }
  }
  const rRef = rSum / count;
  const gRef = gSum / count;
  const bRef = bSum / count;
  const isWhiteBg = rRef > 150 && gRef > 150 && bRef > 150;
  return {
    rScale: isWhiteBg ? 255 / rRef : 1,
    gScale: isWhiteBg ? 255 / gRef : 1,
    bScale: isWhiteBg ? 255 / bRef : 1,
    isCalibrated: isWhiteBg,
  };
}

function segmentLeaf(imageData, calibration) {
  const { data, width, height } = imageData;
  const mask = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    let r = data[idx]     * calibration.rScale;
    let g = data[idx + 1] * calibration.gScale;
    let b = data[idx + 2] * calibration.bScale;
    r = Math.min(255, r); g = Math.min(255, g); b = Math.min(255, b);
    const avg = (r + g + b) / 3;
    const isNotWhite = avg < 220;
    const isNotBlack = avg > 20;
    const hasGreen = g > r * 0.7 && g > b * 0.7;
    mask[i] = (isNotWhite && isNotBlack && hasGreen) ? 1 : 0;
  }
  return { mask, width, height };
}

function calculateChlorophyllIndex(imageData, mask, calibration) {
  const { data } = imageData;
  let ndviSum = 0, count = 0;
  for (let i = 0; i < mask.mask.length; i++) {
    if (!mask.mask[i]) continue;
    const idx = i * 4;
    let r = data[idx]     * calibration.rScale;
    let g = data[idx + 1] * calibration.gScale;
    r = Math.min(255, r); g = Math.min(255, g);
    const denom = g + r;
    if (denom > 0) {
      ndviSum += (g - r) / denom;
      count++;
    }
  }
  return count > 0 ? ndviSum / count : null;
}

function normalizeFA(fa) {
  return Math.max(0, Math.min(1, (fa - 0.030) / (0.065 - 0.030)));
}

function normalizeChl(chl) {
  return Math.max(0, Math.min(1, (chl - (-0.15)) / (0.25 - (-0.15))));
}

function calculateStressIndex(fa, chl) {
  const faNorm = normalizeFA(fa);
  const chlNorm = normalizeChl(chl);
  return Math.max(0, Math.min(1, (faNorm + (1 - chlNorm)) / 2));
}

function generateDiagnosis(fa, chl, stressIndex) {
  const faHigh = fa >= 0.050;
  const faLow  = fa < 0.040;
  const chlLow = chl < 0.00;
  const chlHigh = chl > 0.10;
  if (faHigh && !chlLow) {
    return { icon: '🏭', text: 'High FA with normal chlorophyll — indicates <strong>chronic pollution from the past</strong> (accumulated stress). The pollution source is likely no longer active, but effects remain.', color: '#f97316' };
  }
  if (!faHigh && chlLow) {
    return { icon: '🚗', text: 'Low FA with reduced chlorophyll — indicates <strong>acute, recent pollution</strong>. Possible sources: vehicle exhaust, short-term emissions. Leaves haven\'t had time to deform yet.', color: '#eab308' };
  }
  if (faHigh && chlLow) {
    return { icon: '⛔', text: 'High FA and low chlorophyll — <strong>critical environmental situation</strong>. Prolonged and ongoing pollution exposure.', color: '#ef4444' };
  }
  if (faLow && chlHigh) {
    return { icon: '🌿', text: 'Low FA and high chlorophyll — <strong>clean environmental zone</strong>. Plant is healthy, stress factors are absent or minimal.', color: '#22c55e' };
  }
  return { icon: '📊', text: 'Moderate FA and chlorophyll levels — <strong>average environmental load</strong>. Consider repeating measurements in 2-4 weeks.', color: '#84cc16' };
}