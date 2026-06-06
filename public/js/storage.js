// =============================================
// ECOSCAN — Local Storage
// =============================================

const STORAGE_KEY = 'ecoScanPins';

function loadPins() {
  const stored = localStorage.getItem(STORAGE_KEY);
  const userPins = stored ? JSON.parse(stored) : [];
  return [...DEFAULT_PINS, ...userPins];
}

function saveUserPin(pin) {
  const stored = localStorage.getItem(STORAGE_KEY);
  const existing = stored ? JSON.parse(stored) : [];
  existing.push(pin);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

function exportPins() {
  const pins = loadPins();
  const blob = new Blob([JSON.stringify({ pins }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ecoscan-pins.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Pins exported successfully', 'success');
}

function importPins(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      const newPins = data.pins || [];
      const stored = localStorage.getItem(STORAGE_KEY);
      const existing = stored ? JSON.parse(stored) : [];
      const merged = [...existing, ...newPins];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      renderPins(loadPins());
      showToast(`Imported ${newPins.length} pins`, 'success');
    } catch (err) {
      showToast('Invalid file format', 'error');
    }
  };
  reader.readAsText(file);
}

function clearLocalPins() {
  localStorage.removeItem(STORAGE_KEY);
  renderPins(DEFAULT_PINS);
  showToast('Local data cleared', 'success');
}