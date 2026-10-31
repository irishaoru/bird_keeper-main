import { clamp, difficulty, baseSpeed, CONFIG } from './config.js';
import { eligibleSpecies, SPECIES } from './species.js';

export function addCreature(game, speciesId, x, forward, options = {}) {
  const creature = { id: game.nextId++, speciesId, x, forward, spent: false,
    baseX: x, drift: 0, phase: 0, route: false, ...options };
  game.creatures.push(creature);
  return creature;
}

function chooseSpecies(game) {
  const pool = eligibleSpecies(game.distance);
  let roll = game.random() * pool.reduce((sum, species) => sum + species.weight, 0);
  return pool.find((species) => (roll -= species.weight) < 0)?.id ?? pool.at(-1).id;
}

// Formation phrases after the opening. Every phrase still places a route member ahead.
const PATTERNS = [
  { id: 'sweep', from: 0, weight: 3 },
  { id: 'cluster', from: .12, weight: 2 },
  { id: 'stretch', from: .2, weight: 2 },
  { id: 'zigzag', from: .35, weight: 2 },
];

function choosePattern(game, level) {
  const pool = PATTERNS.filter((pattern) => level >= pattern.from);
  let roll = game.random() * pool.reduce((sum, pattern) => sum + pattern.weight, 0);
  return pool.find((pattern) => (roll -= pattern.weight) < 0)?.id ?? 'sweep';
}

export function seedFlock(game) {
  game.route = { x: 290, forward: 135, speciesId: 'gull', heading: 1, remaining: 3, count: 0, pattern: 'sweep' };
  addCreature(game, 'gull', game.route.x, game.route.forward, { route: true });
  extendFlock(game);
}

export function extendFlock(game) {
  const level = difficulty(game.distance);
  // A moving cursor follows the newest route member's speed, not the player's mount.
  // Sweeps change direction in short phrases; alternate targets form occasional forks.
  while (game.route.forward < game.player.forward + 1100) {
    if (--game.route.remaining <= 0) {
      game.route.heading *= -1;
      // The opening stays a gentle sweep; later phrases vary the formation.
      const pattern = game.route.pattern = level < .12 ? 'sweep' : choosePattern(game, level);
      game.route.remaining = pattern === 'cluster' || pattern === 'stretch' ? 1 : 2 + Math.floor(game.random() * 3);
    }
    // Zigzags swing hard every member; stretches add one long gap the mount must close before tiring.
    const zigzag = game.route.pattern === 'zigzag';
    if (zigzag) game.route.heading *= -1;
    const stride = zigzag ? 140 + 60 * level + game.random() * 50 : 25 + 75 * level + game.random() * (40 + 25 * level);
    const nextX = game.route.x + game.route.heading * stride;
    if (nextX < 85 || nextX > 455) game.route.heading *= -1;
    game.route.x = clamp(game.route.x + game.route.heading * stride, 85, 455);
    game.route.forward += 115 + 30 * level + game.random() * (25 + 20 * level) + (game.route.pattern === 'stretch' ? 120 + 180 * level : 0);
    game.route.speciesId = chooseSpecies(game);
    game.route.count++;
    addCreature(game, game.route.speciesId, game.route.x, game.route.forward, {
      route: true, drift: (zigzag ? 30 : 12) * level, phase: game.random() * Math.PI * 2,
    });
    if (game.route.pattern === 'cluster') {
      // An offset group: several rides at once, so the decision is which species to take.
      for (const side of [-1, 1]) {
        let x = game.route.x + side * 110;
        if (x < 65 || x > 475) x = game.route.x - side * 220;
        addCreature(game, chooseSpecies(game), clamp(x, 65, 475), game.route.forward + 20 + game.random() * 40, {
          drift: 10 * level, phase: game.random() * Math.PI * 2,
        });
      }
    } else if (game.route.pattern === 'sweep' && level > .12 && game.route.count % 3 === 0) {
      const side = game.route.x < 270 ? 1 : -1;
      addCreature(game, chooseSpecies(game), clamp(game.route.x + side * (100 + level * 60), 65, 475), game.route.forward + 25, {
        drift: 28 * level, phase: game.random() * Math.PI * 2,
      });
    }
  }
  // Threshold introductions are immediate, visible, and reachable from the rider.
  // This is an opportunity only: discovery still requires an actual catch.
  for (const species of SPECIES) {
    if (game.distance >= species.threshold && !game.introduced.has(species.id)) {
      game.introduced.add(species.id);
      // Keep the newcomer clear of other targets so catching it is a deliberate choice.
      const forward = game.player.forward + 180;
      const clear = (x) => !game.creatures.some((bird) => Math.abs(bird.x - x) < 70 && Math.abs(bird.forward - forward) < 70);
      const x = [45, -45, 120, -120].map((dx) => clamp(game.player.x + dx, 65, 475)).find(clear) ?? clamp(game.player.x + 45, 65, 475);
      addCreature(game, species.id, x, forward);
    }
  }
  game.creatures = game.creatures.filter((bird) => bird.id === game.mountId || bird.forward > game.player.forward - 260);
}

export function flockSpeed(game, speciesId) {
  return baseSpeed(game.distance) * CONFIG.flockMultiplier * SPECIES.find((species) => species.id === speciesId).speedMultiplier;
}
