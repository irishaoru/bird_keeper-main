import { SPECIES } from './species.js';

// One versioned entry holding only discoveries and best distance; never a live run.
// Storage is a convenience: any read/write failure falls back to an in-memory session.
const KEY = 'birdKeeperSaveV1';

export function loadSave(storage) {
  try {
    const data = JSON.parse((storage ?? localStorage).getItem(KEY)) ?? {};
    const ids = Array.isArray(data.discovered) ? data.discovered : [];
    return {
      discovered: ids.filter((id) => SPECIES.some((species) => species.id === id)),
      best: Number.isFinite(data.best) && data.best >= 0 ? data.best : 0,
    };
  } catch {
    return { discovered: [], best: 0 };
  }
}

export function writeSave(save, storage) {
  try {
    (storage ?? localStorage).setItem(KEY, JSON.stringify({ discovered: [...save.discovered], best: save.best }));
  } catch {
    // Blocked or full storage: keep playing with in-memory progress.
  }
}
