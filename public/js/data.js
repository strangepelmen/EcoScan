// =============================================
// ECOSCAN — Species Configuration & Default Data
// =============================================

const SPECIES_CONFIG = {
  'salix-alba':            { name: 'White Willow',          tolerance: 0.85, faRange: [0.035, 0.058], icon: '🌳', group: 'Willows' },
  'salix-caprea':          { name: 'Goat Willow',           tolerance: 0.80, faRange: [0.036, 0.060], icon: '🍃', group: 'Willows' },
  'salix-fragilis':        { name: 'Crack Willow',          tolerance: 0.78, faRange: [0.036, 0.061], icon: '🌿', group: 'Willows' },
  'salix-viminalis':       { name: 'Osier Willow',          tolerance: 0.82, faRange: [0.034, 0.057], icon: '🌿', group: 'Willows' },
  'populus-balsamifera':   { name: 'Balsam Poplar',         tolerance: 0.90, faRange: [0.033, 0.056], icon: '🌲', group: 'Poplars' },
  'populus-tremula':       { name: 'European Aspen',       tolerance: 0.72, faRange: [0.036, 0.062], icon: '🍃', group: 'Poplars' },
  'populus-nigra':         { name: 'Black Poplar',          tolerance: 0.88, faRange: [0.034, 0.057], icon: '🌲', group: 'Poplars' },
  'populus-alba':          { name: 'White Poplar',          tolerance: 0.86, faRange: [0.034, 0.058], icon: '🌲', group: 'Poplars' },
  'betula-pendula':        { name: 'Silver Birch',          tolerance: 0.60, faRange: [0.036, 0.062], icon: '🌿', group: 'Birches' },
  'betula-pubescens':      { name: 'Downy Birch',           tolerance: 0.62, faRange: [0.036, 0.061], icon: '🌿', group: 'Birches' },
  'acer-platanoides':      { name: 'Norway Maple',          tolerance: 0.55, faRange: [0.037, 0.063], icon: '🍁', group: 'Maples' },
  'acer-negundo':          { name: 'Box Elder',             tolerance: 0.70, faRange: [0.036, 0.061], icon: '🍁', group: 'Maples' },
  'acer-campestre':        { name: 'Field Maple',           tolerance: 0.58, faRange: [0.037, 0.062], icon: '🍁', group: 'Maples' },
  'tilia-cordata':         { name: 'Small-leaved Lime',     tolerance: 0.65, faRange: [0.035, 0.060], icon: '🌸', group: 'Lindens' },
  'tilia-platyphyllos':    { name: 'Large-leaved Lime',     tolerance: 0.63, faRange: [0.036, 0.061], icon: '🌸', group: 'Lindens' },
  'quercus-robur':         { name: 'Pedunculate Oak',       tolerance: 0.50, faRange: [0.038, 0.065], icon: '🌰', group: 'Oaks' },
  'quercus-petraea':       { name: 'Sessile Oak',           tolerance: 0.52, faRange: [0.037, 0.064], icon: '🌰', group: 'Oaks' },
  'ulmus-laevis':          { name: 'European White Elm',   tolerance: 0.75, faRange: [0.035, 0.059], icon: '🍂', group: 'Elms' },
  'ulmus-minor':           { name: 'Field Elm',             tolerance: 0.73, faRange: [0.036, 0.060], icon: '🍂', group: 'Elms' },
  'fraxinus-excelsior':    { name: 'European Ash',          tolerance: 0.68, faRange: [0.036, 0.061], icon: '🌿', group: 'Ashes' },
  'prunus-padus':          { name: 'Bird Cherry',           tolerance: 0.60, faRange: [0.037, 0.062], icon: '🌺', group: 'Other' },
  'sorbus-aucuparia':      { name: 'Rowan',                 tolerance: 0.58, faRange: [0.037, 0.063], icon: '🍒', group: 'Other' },
  'malus-sylvestris':      { name: 'European Crab Apple',   tolerance: 0.55, faRange: [0.038, 0.064], icon: '🍎', group: 'Other' },
  'alnus-glutinosa':       { name: 'Black Alder',           tolerance: 0.76, faRange: [0.035, 0.059], icon: '🌿', group: 'Alders' },
  'alnus-incana':          { name: 'Grey Alder',            tolerance: 0.74, faRange: [0.036, 0.060], icon: '🌿', group: 'Alders' },
  'corylus-avellana':      { name: 'Common Hazel',          tolerance: 0.62, faRange: [0.037, 0.062], icon: '🌰', group: 'Alders' },
};

function getPlantName(p) {
  return (SPECIES_CONFIG[p] || {}).name || 'Unknown';
}

// =============================================
// DEFAULT PINS — 30 realistic global pins
// =============================================
const DEFAULT_PINS = [
  // EUROPE (8 pins)
  { lat: 51.5074, lng: -0.1278,   score: 3, asymmetry: 0.047, chlIndex: 0.08,  stressIndex: 0.52, plant: 'London Plane', date: '2025-03-15' },
  { lat: 52.5200, lng: 13.4050,   score: 4, asymmetry: 0.052, chlIndex: -0.02, stressIndex: 0.71, plant: 'Small-leaved Lime', date: '2025-04-02' },
  { lat: 48.8566, lng: 2.3522,    score: 2, asymmetry: 0.042, chlIndex: 0.14,  stressIndex: 0.35, plant: 'White Willow', date: '2025-03-28' },
  { lat: 55.7558, lng: 37.6173,   score: 4, asymmetry: 0.051, chlIndex: 0.03,  stressIndex: 0.65, plant: 'Silver Birch', date: '2025-04-10' },
  { lat: 40.4168, lng: -3.7038,   score: 2, asymmetry: 0.041, chlIndex: 0.12,  stressIndex: 0.38, plant: 'Holm Oak', date: '2025-03-20' },
  { lat: 50.0755, lng: 14.4378,   score: 3, asymmetry: 0.046, chlIndex: 0.07,  stressIndex: 0.55, plant: 'Norway Maple', date: '2025-04-05' },
  { lat: 59.3293, lng: 18.0686,   score: 1, asymmetry: 0.038, chlIndex: 0.18,  stressIndex: 0.22, plant: 'European Ash', date: '2025-03-12' },
  { lat: 53.3498, lng: -6.2603,   score: 2, asymmetry: 0.043, chlIndex: 0.11,  stressIndex: 0.41, plant: 'Pedunculate Oak', date: '2025-04-01' },

  // NORTH AMERICA (6 pins)
  { lat: 40.7128, lng: -74.0060,   score: 4, asymmetry: 0.053, chlIndex: -0.03, stressIndex: 0.74, plant: 'Box Elder', date: '2025-03-25' },
  { lat: 34.0522, lng: -118.2437, score: 3, asymmetry: 0.048, chlIndex: 0.06,  stressIndex: 0.58, plant: 'California Walnut', date: '2025-04-08' },
  { lat: 41.8781, lng: -87.6298,   score: 3, asymmetry: 0.047, chlIndex: 0.05,  stressIndex: 0.56, plant: 'Green Ash', date: '2025-03-30' },
  { lat: 45.5017, lng: -73.5673,   score: 2, asymmetry: 0.044, chlIndex: 0.10,  stressIndex: 0.43, plant: 'Sugar Maple', date: '2025-04-03' },
  { lat: 47.6062, lng: -122.3321,  score: 1, asymmetry: 0.037, chlIndex: 0.19,  stressIndex: 0.20, plant: 'Red Alder', date: '2025-03-18' },
  { lat: 33.4484, lng: -112.0740,  score: 4, asymmetry: 0.050, chlIndex: 0.01,  stressIndex: 0.68, plant: 'Desert Willow', date: '2025-04-11' },

  // ASIA (6 pins)
  { lat: 35.6762, lng: 139.6503,   score: 3, asymmetry: 0.046, chlIndex: 0.09,  stressIndex: 0.51, plant: 'Ginkgo', date: '2025-04-06' },
  { lat: 31.2304, lng: 121.4737,   score: 4, asymmetry: 0.052, chlIndex: -0.01, stressIndex: 0.69, plant: 'Chinese Palm', date: '2025-03-27' },
  { lat: 37.5665, lng: 126.9780,   score: 3, asymmetry: 0.049, chlIndex: 0.04,  stressIndex: 0.62, plant: 'Korean Pine', date: '2025-04-09' },
  { lat: 28.6139, lng: 77.2090,    score: 5, asymmetry: 0.055, chlIndex: -0.06, stressIndex: 0.82, plant: 'Neem', date: '2025-03-22' },
  { lat: 25.2048, lng: 55.2708,    score: 4, asymmetry: 0.051, chlIndex: 0.02,  stressIndex: 0.67, plant: 'Date Palm', date: '2025-04-04' },
  { lat: 35.0116, lng: 135.7681,   score: 1, asymmetry: 0.039, chlIndex: 0.16,  stressIndex: 0.28, plant: 'Japanese Maple', date: '2025-03-14' },

  // SOUTH AMERICA (4 pins)
  { lat: -23.5505, lng: -46.6333,   score: 4, asymmetry: 0.050, chlIndex: 0.02,  stressIndex: 0.64, plant: 'Pink Trumpet Tree', date: '2025-04-07' },
  { lat: -34.6037, lng: -58.3816,  score: 3, asymmetry: 0.047, chlIndex: 0.08,  stressIndex: 0.54, plant: 'Ombu Tree', date: '2025-03-29' },
  { lat: -0.1807, lng: -78.4678,   score: 2, asymmetry: 0.042, chlIndex: 0.13,  stressIndex: 0.39, plant: 'Andean Alder', date: '2025-03-16' },
  { lat: -33.4489, lng: -70.6693,  score: 3, asymmetry: 0.045, chlIndex: 0.07,  stressIndex: 0.53, plant: 'Chilean Palm', date: '2025-04-02' },

  // AFRICA (3 pins)
  { lat: -1.2921, lng: 36.8219,    score: 3, asymmetry: 0.048, chlIndex: 0.06,  stressIndex: 0.57, plant: 'Fever Tree', date: '2025-03-24' },
  { lat: 30.0444, lng: 31.2357,    score: 4, asymmetry: 0.051, chlIndex: 0.01,  stressIndex: 0.66, plant: 'Sissoo', date: '2025-04-10' },
  { lat: -4.0435, lng: 39.6682,    score: 2, asymmetry: 0.043, chlIndex: 0.11,  stressIndex: 0.42, plant: 'Baobab', date: '2025-03-31' },

  // OCEANIA (3 pins)
  { lat: -33.8688, lng: 151.2093,   score: 3, asymmetry: 0.045, chlIndex: 0.09,  stressIndex: 0.50, plant: 'Sydney Blue Gum', date: '2025-04-05' },
  { lat: -36.8485, lng: 174.7633,  score: 1, asymmetry: 0.038, chlIndex: 0.17,  stressIndex: 0.25, plant: 'Kauri', date: '2025-03-21' },
  { lat: -31.9505, lng: 115.8605,  score: 2, asymmetry: 0.041, chlIndex: 0.14,  stressIndex: 0.36, plant: 'Marri', date: '2025-04-01' },
];