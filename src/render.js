import { CONFIG } from './config.js';
import { speciesById } from './species.js';
import { project, modelPoint, polygon, prism, block, shade } from './projection.js';

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

// Original low-poly meshes: wings have thickness and articulate in model-space height.
export function drawBird(ctx, id, x, y, time = 0, scale = 1) {
  const species = speciesById(id);
  const flap = Math.sin(time * (id === 'bat' ? 11 : 7)) * 13;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * species.size, scale * species.size);
  ellipse(ctx, 14, 23, 40, 10, '#205e6426');
  prism(ctx, [[-6,-18,16],[-12,-39,12],[0,-33,12],[12,-39,12],[6,-18,16]], 5, species.wing);
  for (const side of [-1, 1]) {
    let outline;
    if (id === 'bat') outline = [[6,12],[30,28],[61,0],[42,4],[36,-13],[24,-6],[13,-24],[5,-15]];
    else if (id === 'pterodactyl') outline = [[5,12],[62,32],[39,-18],[8,-22]];
    else if (id === 'owl') outline = [[6,12],[30,26],[52,20],[60,6],[54,-8],[38,-16],[12,-20]];
    else if (id === 'eagle') outline = [[6,12],[31,23],[59,14],[59,4],[51,6],[51,-3],[43,0],[42,-10],[31,-7],[12,-19]];
    else outline = [[5,12],[29,23],[55,4],[43,-10],[23,-4],[5,-15]];
    const vertices = outline.map(([wx, wy]) => [wx * side, wy, 22 + wx / 60 * flap]);
    prism(ctx, vertices, 5, species.wing);
    prism(ctx, [[7*side,10,24],[28*side,20,24+flap*.45],[37*side,3,24+flap*.6],[9*side,-10,24]], 2, shade(species.wing, 1.1));
    if (id === 'gull') prism(ctx, [[42*side,12,23+flap*.7],[55*side,4,23+flap],[43*side,-10,23+flap*.7],[35*side,-4,23+flap*.6]], 4, '#5b7985');
  }
  const bodyColor = id === 'eagle' ? '#9e714d' : species.color;
  prism(ctx, [[-8,-24,24],[8,-24,24],[12,-12,30],[11,14,30],[7,20,26],[-7,20,26],[-11,14,30],[-12,-12,30]], 15, bodyColor);
  block(ctx, 0, 18, 40, 17, 19, 17, species.color);
  if (id === 'bat') {
    for (const side of [-1, 1]) prism(ctx, [[side*4,18,40],[side*9,19,54],[side*11,9,40]], 4, species.color);
  } else {
    const beak = id === 'pterodactyl' ? 59 : id === 'owl' ? 31 : 42;
    prism(ctx, [[-7,26,35],[7,26,35],[2,beak,30],[-2,beak,30]], 7, '#efb746');
    if (id === 'pterodactyl') prism(ctx, [[-3,15,42],[0,-3,55],[4,10,40]], 5, '#b44b3e');
    // Owl: short beak, pale face disc, and ear tufts.
    if (id === 'owl') {
      polygon(ctx, [[-9,14,41],[9,14,41],[11,24,41],[0,28,41],[-11,24,41]].map(modelPoint), '#f3e6c8');
      for (const side of [-1, 1]) prism(ctx, [[side*5,14,40],[side*10,12,53],[side*12,6,40]], 4, species.wing);
    }
  }
  polygon(ctx, [[9,17,35],[9,22,35],[9,22,31],[9,17,31]].map(modelPoint), '#213946');
  polygon(ctx, [[-9,20,35],[-9,24,35],[-9,24,31],[-9,20,31]].map(modelPoint), '#213946');
  ctx.restore();
}

function drawRider(ctx, x, y, time, scale = 1, alpha = 1, mountSize = 1) {
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.translate(x, y - (mountSize - 1) * 28);
  ctx.scale(scale, scale);
  block(ctx, -10, -10, 29, 8, 18, 9, '#2f5264');
  block(ctx, 10, -10, 29, 8, 18, 9, '#2f5264');
  block(ctx, 0, -6, 48, 18, 15, 21, '#e57248');
  block(ctx, 11, -1, 44, 6, 15, 8, '#eebe8e');
  block(ctx, -11, -1, 44, 6, 15, 8, '#f7d4a2');
  prism(ctx, [[-5,-14,46],[6,-14,46],[16+Math.sin(time*12)*4,-33,38],[6,-40,35]], 2, '#f9c544');
  block(ctx, 0, -3, 65, 17, 16, 16, '#f2c796');
  block(ctx, 0, -4, 72, 21, 19, 9, '#925b3b');
  block(ctx, 0, -5, 65, 23, 23, 3, '#f4d58d');
  ctx.restore();
}

function drawCloud(ctx, x, y, scale) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  polygon(ctx, [[-88,4],[-67,-20],[-33,-18],[-18,-38],[25,-39],[43,-20],[72,-18],[93,4],[74,24],[-57,27]], '#bde7e7');
  polygon(ctx, [[-88,4],[-67,-20],[-33,-18],[-18,-38],[25,-39],[43,-20],[72,-18],[93,4],[37,11],[2,2],[-31,12]], '#eff9ee');
  polygon(ctx, [[-18,-38],[25,-39],[43,-20],[7,-12],[-33,-18]], '#fffdf0');
  ctx.restore();
}

function drawIsland(ctx, x, y, scale, variant) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  polygon(ctx, [[-95,-12],[3,-42],[90,-5],[64,66],[10,104],[-62,60]], '#b57b55');
  polygon(ctx, [[-95,-12],[-19,12],[10,104],[-62,60]], '#8c6352');
  polygon(ctx, [[-19,12],[90,-5],[64,66],[10,104]], '#d09964');
  polygon(ctx, [[-95,-12],[3,-42],[90,-5],[10,25]], '#8fbd78');
  polygon(ctx, [[-95,-12],[3,-42],[15,-14],[-19,12]], '#bad381');
  polygon(ctx, [[-95,-12],[-19,12],[10,25],[10,36],[-19,23],[-95,-2]], '#679975');
  if (variant % 2 === 0) {
    block(ctx, 10, 10, 35, 9, 9, 34, '#926e51');
    block(ctx, 10, 10, 57, 45, 36, 26, '#73a980');
    block(ctx, 2, 12, 66, 32, 30, 14, '#98c889');
  } else {
    block(ctx, -14, 8, 24, 27, 20, 23, '#e1d8b0');
    block(ctx, 13, 15, 15, 18, 18, 14, '#bcb89e');
  }
  ctx.restore();
}

// Day → dusk → night → dawn every minute of active flight. Driven by game.elapsed,
// so pausing freezes the cycle and every new run starts in daylight.
const DAY_LENGTH = 60;
const SKY = {
  day: { colors: ['#82c9d6', '#a5ddd9', '#c7e9d7'], night: 0 },
  dusk: { colors: ['#6f7fb8', '#e9a27f', '#f6d3a1'], night: .4 },
  night: { colors: ['#22305a', '#34497a', '#56709a'], night: 1 },
};
const CYCLE = [[0, 'day'], [.33, 'day'], [.45, 'dusk'], [.55, 'night'], [.75, 'night'], [.85, 'dusk'], [.95, 'day'], [1, 'day']];

function mix(a, b, k) {
  const channel = (hex, i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  return `rgb(${[0, 1, 2].map((i) => Math.round(channel(a, i) + (channel(b, i) - channel(a, i)) * k)).join()})`;
}

export function skyAt(elapsed) {
  const t = (elapsed / DAY_LENGTH) % 1;
  const i = CYCLE.findIndex(([at]) => at > t);
  const [fromAt, from] = CYCLE[i - 1], [toAt, to] = CYCLE[i];
  const k = (t - fromAt) / (toAt - fromAt);
  return {
    colors: SKY[from].colors.map((color, j) => mix(color, SKY[to].colors[j], k)),
    night: SKY[from].night + (SKY[to].night - SKY[from].night) * k,
  };
}

function drawBackground(ctx, game) {
  const light = skyAt(game.elapsed);
  const sky = ctx.createLinearGradient(0, 0, 0, 900);
  sky.addColorStop(0, light.colors[0]); sky.addColorStop(.4, light.colors[1]); sky.addColorStop(1, light.colors[2]);
  ctx.fillStyle = sky; ctx.fillRect(0, 0, 540, 900);
  if (light.night > .4) {
    ctx.fillStyle = `rgba(255, 250, 225, ${(light.night - .4) * 1.3})`;
    for (let i = 0; i < 40; i++) ctx.fillRect((i * 97) % 540, (i * 61 + game.player.forward * .04) % 900, 2, 2);
  }
  // Separate parallax layers, all derived from distance (frozen while paused).
  for (let i = 0; i < 7; i++) {
    const y = ((i * 191 + game.player.forward * .16) % 1250) - 140;
    drawCloud(ctx, i % 2 ? 510 : 10, y, .55 + (i % 3) * .2);
  }
  for (let i = 0; i < 6; i++) {
    const y = ((i * 223 + game.player.forward * .28) % 1400) - 220;
    drawIsland(ctx, i % 2 ? 565 : -34, y, .45 + (y + 220) / 1800, i);
  }
  // Dim the scenery at night; creatures, rings, and labels are drawn afterwards at full brightness.
  ctx.fillStyle = `rgba(20, 30, 70, ${light.night * .35})`; ctx.fillRect(0, 0, 540, 900);
  ctx.strokeStyle = '#f6fff65c'; ctx.lineWidth = 2;
  for (let i = 0; i < 12; i++) {
    const y = ((i * 107 + game.player.forward * .7) % 1100) - 100;
    const x = (i * 137) % 500 + 20;
    ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-3,y+12); ctx.stroke();
  }
}

function catchRing(ctx, bird, game) {
  // Sample the WORLD ellipse through the camera so the displayed catch area stays honest.
  ctx.beginPath();
  for (let i = 0; i <= 40; i++) {
    const angle = i / 40 * Math.PI * 2;
    const point = project(bird.x + Math.cos(angle) * CONFIG.catchX, bird.forward + Math.sin(angle) * CONFIG.catchForward, game.player.forward);
    if (!i) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
  }
  ctx.fillStyle = '#f8ffc12e'; ctx.strokeStyle = skyAt(game.elapsed).night > .5 ? '#d8fff4b0' : '#397f7780'; ctx.lineWidth = 1.5;
  ctx.fill(); ctx.stroke();
}

export function render(ctx, game) {
  drawBackground(ctx, game);
  if (game.screen === 'title' || (game.screen === 'guide' && game.guideFrom === 'title')) {
    drawBird(ctx, 'eagle', 115, 146, .3, 1.1);
    drawBird(ctx, 'pterodactyl', 432, 266, 1, .7);
    drawBird(ctx, 'gull', 270, 807, 2, 1.8);
    drawRider(ctx, 270, 807, 0, 1.8);
    return;
  }
  const drawables = game.creatures.map((bird) => ({ ...bird, kind: 'bird' }));
  if (game.mode !== 'mounted') drawables.push({ ...game.player, kind: 'rider' });
  drawables.sort((a, b) => b.forward - a.forward);
  for (const entity of drawables) {
    const point = project(entity.x, entity.forward, game.player.forward);
    if (point.y < -100 || point.y > 1040) continue;
    if (entity.kind === 'rider') {
      if (game.mode === 'airborne') {
        ctx.strokeStyle = '#244958'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.ellipse(point.x, point.y, 14, 10, 0, 0, Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
        const lift = Math.sin(Math.PI * game.airTime / CONFIG.jumpDuration) * 65;
        drawRider(ctx, point.x, point.y - lift, game.elapsed);
      } else {
        const progress = Math.min(1, game.fallTime / CONFIG.fallDuration);
        drawRider(ctx, point.x, point.y + progress * 90, game.elapsed, 1-progress*.6, 1-progress);
      }
      continue;
    }
    const mounted = entity.id === game.mountId;
    const species = speciesById(entity.speciesId);
    ctx.save();
    if (entity.spent) ctx.globalAlpha = .3;
    if (!entity.spent && !mounted) catchRing(ctx, entity, game);
    drawBird(ctx, entity.speciesId, point.x, point.y, game.elapsed + entity.id, point.scale);
    if (mounted) {
      drawRider(ctx, point.x, point.y, game.elapsed, point.scale, 1, species.size);
      if (game.rideTime < CONFIG.warningTime) {
        ctx.fillStyle = '#a3452a'; ctx.font = '900 16px sans-serif'; ctx.textAlign = 'center';
        ctx.lineWidth = 3; ctx.strokeStyle = '#fff6ddd0';
        ctx.strokeText(game.rideTime < .6 ? 'JUMP!' : 'TIRED', point.x, point.y + 57);
        ctx.fillText(game.rideTime < .6 ? 'JUMP!' : 'TIRED', point.x, point.y + 57);
      }
    } else if (!entity.spent && point.y > 220) {
      ctx.font = `800 ${Math.max(11, 13 * point.scale)}px sans-serif`;
      ctx.textAlign = 'center'; ctx.fillStyle = '#275765';
      // A pale halo keeps labels readable against the night sky.
      const label = species.name + (game.discovered.has(entity.speciesId) ? '' : ' · NEW');
      ctx.lineWidth = 3; ctx.strokeStyle = '#fff6ddc0';
      ctx.strokeText(label, point.x, point.y + 41 * point.scale);
      ctx.fillText(label, point.x, point.y + 41 * point.scale);
    }
    ctx.restore();
  }
}
