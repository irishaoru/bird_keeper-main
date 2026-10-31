export const SPECIES = [
  { id: 'gull', name: 'Gull', threshold: 0, weight: 5, rideDuration: 5, speedMultiplier: 1, steering: 260, size: 1, color: '#fff6dd', wing: '#e4ede9', flavor: 'A familiar friend for the first leap.' },
  { id: 'eagle', name: 'Eagle', threshold: 150, weight: 3, rideDuration: 7, speedMultiplier: 1.18, steering: 240, size: 1.28, color: '#fff0c7', wing: '#986243', flavor: 'Powerful wings. A faster, longer ride.' },
  { id: 'bat', name: 'Bat', threshold: 400, weight: 2, rideDuration: 8, speedMultiplier: 1.32, steering: 290, size: 1.08, color: '#685680', wing: '#9580b2', flavor: 'A tiny speedster with surprising staying power.' },
  { id: 'owl', name: 'Owl', threshold: 600, weight: 1.5, rideDuration: 9, speedMultiplier: 1.05, steering: 250, size: 1.2, color: '#d8bc8c', wing: '#8a6a4a', flavor: 'A silent night glider with nine seconds of patience.' },
  { id: 'pterodactyl', name: 'Pterodactyl', threshold: 800, weight: 1, rideDuration: 10, speedMultiplier: 1.12, steering: 220, size: 1.62, color: '#df8052', wing: '#ecaa69', flavor: 'Ten seconds on a prehistoric pair of wings.' },
];
// Arcade ratios inspired by flight data, not measured cruising speeds. See README.
export const speciesById = (id) => SPECIES.find((species) => species.id === id);
export const eligibleSpecies = (metres) => SPECIES.filter((species) => metres >= species.threshold);
