import { Monster } from '../types';

// Helper for Stats
const stats = (hp: number, atk: number, def: number, spd: number, luk: number) => ({ hp, maxHp: hp, atk, def, spd, luk });
const vitals = () => ({ hunger: 100, mood: 100, energy: 100 });

// --- STARTERS (Species ID: 1-6) ---
export const STARTERS: Monster[] = [
  {
    id: 'starter_pupper', speciesId: 1, name: 'พัพเปอร์', element: 'Neutral', stage: 1,
    level: 1, exp: 0, maxExp: 100,
    stats: stats(100, 15, 10, 15, 10), vitals: vitals(),
    appearance: { emoji: '🐶', color: 'bg-amber-200' }
  },
  {
    id: 'starter_drago', speciesId: 2, name: 'ดราโก้', element: 'Neutral', stage: 1,
    level: 1, exp: 0, maxExp: 100,
    stats: stats(80, 20, 10, 12, 10), vitals: vitals(),
    appearance: { emoji: '🐲', color: 'bg-red-200' }
  },
  {
    id: 'starter_jelly', speciesId: 3, name: 'เจลลี่', element: 'Neutral', stage: 1,
    level: 1, exp: 0, maxExp: 100,
    stats: stats(120, 10, 10, 8, 10), vitals: vitals(),
    appearance: { emoji: '🧊', color: 'bg-blue-200' }
  },
];

// --- EVOLUTIONS (Species ID: 101+) ---
// เชื่อมโยงด้วย parentSpeciesId
export const EVOLUTIONS: Monster[] = [
  // --- PUPPER EVOLUTIONS (Parent: 1) ---
  {
    id: 'evo_pupper_terra', speciesId: 101, parentSpeciesId: 1, // [FIXED] Link to Pupper
    name: 'การ์ดด็อก', element: 'Terra', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(150, 30, 40, 20, 15), vitals: vitals(),
    appearance: { emoji: '🐕‍🦺', color: 'bg-amber-600' }
  },
  {
    id: 'evo_pupper_pyro', speciesId: 102, parentSpeciesId: 1,
    name: 'เฮลฮาวด์', element: 'Pyro', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(120, 50, 20, 35, 15), vitals: vitals(),
    appearance: { emoji: '🐺', color: 'bg-red-600' }
  },
  {
    id: 'evo_pupper_aero', speciesId: 103, parentSpeciesId: 1,
    name: 'วินด์ไรเดอร์', element: 'Aero', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(130, 35, 25, 45, 15), vitals: vitals(),
    appearance: { emoji: '🌪️', color: 'bg-green-400' }
  },
  {
    id: 'evo_pupper_aqua', speciesId: 104, parentSpeciesId: 1,
    name: 'ซีฮาวเลอร์', element: 'Aqua', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(140, 30, 35, 25, 15), vitals: vitals(),
    appearance: { emoji: '🌊', color: 'bg-blue-500' }
  },


  // --- DRAGO EVOLUTIONS (Parent: 2) ---
  {
    id: 'evo_drago_terra', speciesId: 201, parentSpeciesId: 2, // [FIXED] Link to Drago
    name: 'เอิร์ธเดรค', element: 'Terra', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(180, 40, 50, 15, 20), vitals: vitals(),
    appearance: { emoji: '🦕', color: 'bg-amber-700' }
  },
  {
    id: 'evo_drago_pyro', speciesId: 202, parentSpeciesId: 2,
    name: 'อินเฟอร์โนเดรค', element: 'Pyro', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(150, 60, 30, 40, 20), vitals: vitals(),
    appearance: { emoji: '🔥', color: 'bg-red-700' }
  },
  {
    id: 'evo_drago_aero', speciesId: 203, parentSpeciesId: 2,
    name: 'สกายเดรค', element: 'Aero', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(160, 45, 35, 55, 20), vitals: vitals(),
    appearance: { emoji: '🪁', color: 'bg-green-500' }
  },
  {
    id: 'evo_drago_aqua', speciesId: 204, parentSpeciesId: 2,
    name: 'มิสต์เดรค', element: 'Aqua', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(170, 40, 45, 30, 20), vitals: vitals(),
    appearance: { emoji: '🐉', color: 'bg-blue-600' }
  },
];

export const MONSTER_DB: Monster[] = [...STARTERS, ...EVOLUTIONS];
