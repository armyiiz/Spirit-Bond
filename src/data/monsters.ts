import { Monster } from '../types';

// Helper for Stats
// Pattern: (hp, atk, def, spd, luk)
const stats = (hp: number, atk: number, def: number, spd: number, luk: number) => ({ hp, maxHp: hp, atk, def, spd, luk });
const vitals = () => ({ hunger: 100, mood: 100, energy: 100 });

// ==========================================
// 🐣 STARTERS (Species ID: 1-6)
// ==========================================
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
  {
    id: 'starter_tori', speciesId: 4, name: 'โทริ', element: 'Neutral', stage: 1,
    level: 1, exp: 0, maxExp: 100,
    stats: stats(90, 18, 8, 20, 10), vitals: vitals(),
    appearance: { emoji: '🐥', color: 'bg-yellow-200' }
  },
  {
    id: 'starter_sprout', speciesId: 5, name: 'สเปราท์', element: 'Neutral', stage: 1,
    level: 1, exp: 0, maxExp: 100,
    stats: stats(110, 12, 20, 8, 10), vitals: vitals(),
    appearance: { emoji: '🌱', color: 'bg-green-200' }
  },
  {
    id: 'starter_robo', speciesId: 6, name: 'โรโบ', element: 'Neutral', stage: 1,
    level: 1, exp: 0, maxExp: 100,
    stats: stats(90, 15, 12, 12, 20), vitals: vitals(),
    appearance: { emoji: '🤖', color: 'bg-slate-300' }
  },
];

// ==========================================
// 🧬 EVOLUTIONS (Species ID: 101+)
// ==========================================
export const EVOLUTIONS: Monster[] = [
  // 🐶 PUPPER EVOLUTIONS (Balance)
  {
    id: 'evo_pupper_terra', speciesId: 101, parentSpeciesId: 1,
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

  // 🐲 DRAGO EVOLUTIONS (High ATK)
  {
    id: 'evo_drago_terra', speciesId: 201, parentSpeciesId: 2,
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

  // 🧊 JELLY EVOLUTIONS (High HP)
  {
    id: 'evo_jelly_terra', speciesId: 301, parentSpeciesId: 3,
    name: 'มัดสไลม์', element: 'Terra', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(220, 25, 30, 10, 15), vitals: vitals(),
    appearance: { emoji: '💩', color: 'bg-amber-800' }
  },
  {
    id: 'evo_jelly_pyro', speciesId: 302, parentSpeciesId: 3,
    name: 'ลาวาสไลม์', element: 'Pyro', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(200, 40, 20, 15, 15), vitals: vitals(),
    appearance: { emoji: '🌋', color: 'bg-red-500' }
  },
  {
    id: 'evo_jelly_aero', speciesId: 303, parentSpeciesId: 3,
    name: 'คลาวด์สไลม์', element: 'Aero', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(180, 30, 20, 35, 20), vitals: vitals(),
    appearance: { emoji: '☁️', color: 'bg-sky-200' }
  },
  {
    id: 'evo_jelly_aqua', speciesId: 304, parentSpeciesId: 3,
    name: 'คิงเจลลี่', element: 'Aqua', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(250, 25, 35, 10, 20), vitals: vitals(),
    appearance: { emoji: '👑', color: 'bg-blue-400' }
  },

  // 🐥 TORI EVOLUTIONS (High SPD)
  {
    id: 'evo_tori_terra', speciesId: 401, parentSpeciesId: 4,
    name: 'นกกระจอกเทศหิน', element: 'Terra', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(140, 35, 30, 45, 10), vitals: vitals(),
    appearance: { emoji: '🦤', color: 'bg-amber-500' }
  },
  {
    id: 'evo_tori_pyro', speciesId: 402, parentSpeciesId: 4,
    name: 'ฟีนิกซ์น้อย', element: 'Pyro', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(120, 50, 15, 55, 15), vitals: vitals(),
    appearance: { emoji: '🐦‍🔥', color: 'bg-red-400' }
  },
  {
    id: 'evo_tori_aero', speciesId: 403, parentSpeciesId: 4,
    name: 'ธันเดอร์เบิร์ด', element: 'Aero', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(110, 40, 15, 70, 15), vitals: vitals(),
    appearance: { emoji: '🦅', color: 'bg-yellow-400' }
  },
  {
    id: 'evo_tori_aqua', speciesId: 404, parentSpeciesId: 4,
    name: 'เพนกวินจักรพรรดิ', element: 'Aqua', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(160, 30, 25, 40, 20), vitals: vitals(),
    appearance: { emoji: '🐧', color: 'bg-blue-300' }
  },

  // 🌱 SPROUT EVOLUTIONS (High DEF)
  {
    id: 'evo_sprout_terra', speciesId: 501, parentSpeciesId: 5,
    name: 'โกเลมไม้', element: 'Terra', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(180, 25, 60, 10, 15), vitals: vitals(),
    appearance: { emoji: '🪵', color: 'bg-amber-900' }
  },
  {
    id: 'evo_sprout_pyro', speciesId: 502, parentSpeciesId: 5,
    name: 'พริกปีศาจ', element: 'Pyro', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(140, 45, 40, 20, 15), vitals: vitals(),
    appearance: { emoji: '🌶️', color: 'bg-red-600' }
  },
  {
    id: 'evo_sprout_aero', speciesId: 503, parentSpeciesId: 5,
    name: 'ดอกไม้บิน', element: 'Aero', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(130, 30, 35, 40, 20), vitals: vitals(),
    appearance: { emoji: '🌻', color: 'bg-green-300' }
  },
  {
    id: 'evo_sprout_aqua', speciesId: 504, parentSpeciesId: 5,
    name: 'บัวยักษ์', element: 'Aqua', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(190, 20, 50, 15, 20), vitals: vitals(),
    appearance: { emoji: '🪷', color: 'bg-teal-600' }
  },

  // 🤖 ROBO EVOLUTIONS (High LUK)
  {
    id: 'evo_robo_terra', speciesId: 601, parentSpeciesId: 6,
    name: 'ดริลบอท', element: 'Terra', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(140, 35, 40, 15, 40), vitals: vitals(),
    appearance: { emoji: '🚜', color: 'bg-amber-400' }
  },
  {
    id: 'evo_robo_pyro', speciesId: 602, parentSpeciesId: 6,
    name: 'เตาปฏิกรณ์เดินได้', element: 'Pyro', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(130, 50, 25, 20, 35), vitals: vitals(),
    appearance: { emoji: '🚂', color: 'bg-orange-600' }
  },
  {
    id: 'evo_robo_aero', speciesId: 603, parentSpeciesId: 6,
    name: 'โดรนจู่โจม', element: 'Aero', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(110, 40, 20, 55, 35), vitals: vitals(),
    appearance: { emoji: '🛸', color: 'bg-slate-400' }
  },
  {
    id: 'evo_robo_aqua', speciesId: 604, parentSpeciesId: 6,
    name: 'เรือดำน้ำจิ๋ว', element: 'Aqua', stage: 2,
    level: 10, exp: 0, maxExp: 500,
    stats: stats(150, 30, 35, 25, 40), vitals: vitals(),
    appearance: { emoji: '🛥️', color: 'bg-blue-600' }
  },
];

export const MONSTER_DB: Monster[] = [...STARTERS, ...EVOLUTIONS];
