import { Monster } from '../types';

// Base vitals for all monsters
const BASE_VITALS = {
  hunger: 100,
  mood: 100,
  energy: 100
};

// --- STARTERS (Stage 1) ---
export const STARTERS: Monster[] = [
  {
    id: 'starter_pupper',
    speciesId: 1,
    name: 'พัพเปอร์',
    element: 'Neutral',
    stage: 1,
    level: 1,
    exp: 0,
    maxExp: 100,
    stats: { hp: 100, maxHp: 100, atk: 20, def: 20, spd: 20, luk: 10 },
    vitals: { ...BASE_VITALS },
    appearance: { emoji: '🐶', color: 'bg-amber-200' }
  },
  {
    id: 'starter_drago',
    speciesId: 2,
    name: 'ดราโก้',
    element: 'Neutral',
    stage: 1,
    level: 1,
    exp: 0,
    maxExp: 100,
    stats: { hp: 80, maxHp: 80, atk: 30, def: 15, spd: 25, luk: 10 },
    vitals: { ...BASE_VITALS },
    appearance: { emoji: '🐲', color: 'bg-red-200' }
  },
  {
    id: 'starter_jelly',
    speciesId: 3,
    name: 'เจลลี่',
    element: 'Neutral',
    stage: 1,
    level: 1,
    exp: 0,
    maxExp: 100,
    stats: { hp: 150, maxHp: 150, atk: 15, def: 15, spd: 15, luk: 10 },
    vitals: { ...BASE_VITALS },
    appearance: { emoji: '💧', color: 'bg-blue-200' }
  },
  {
    id: 'starter_tori',
    speciesId: 4,
    name: 'โทริ',
    element: 'Neutral',
    stage: 1,
    level: 1,
    exp: 0,
    maxExp: 100,
    stats: { hp: 90, maxHp: 90, atk: 25, def: 10, spd: 35, luk: 15 },
    vitals: { ...BASE_VITALS },
    appearance: { emoji: '🐣', color: 'bg-yellow-200' }
  },
  {
    id: 'starter_sprout',
    speciesId: 5,
    name: 'สเปราท์',
    element: 'Neutral',
    stage: 1,
    level: 1,
    exp: 0,
    maxExp: 100,
    stats: { hp: 110, maxHp: 110, atk: 15, def: 30, spd: 15, luk: 10 },
    vitals: { ...BASE_VITALS },
    appearance: { emoji: '🌱', color: 'bg-green-200' }
  },
  {
    id: 'starter_robo',
    speciesId: 6,
    name: 'โรโบ',
    element: 'Neutral',
    stage: 1,
    level: 1,
    exp: 0,
    maxExp: 100,
    stats: { hp: 100, maxHp: 100, atk: 20, def: 20, spd: 20, luk: 25 },
    vitals: { ...BASE_VITALS },
    appearance: { emoji: '🤖', color: 'bg-gray-300' }
  }
];

// --- EVOLUTIONS (Stage 2) ---
// Logic: Stat total increases significantly.
// Terra: +HP/Def, Aero: +Spd, Aqua: Balance, Pyro: +Atk

export const EVOLUTIONS: Monster[] = [
  // 1. Pupper Evolutions
  {
    id: 'evo_pupper_terra', speciesId: 11, name: 'บูลด็อก', element: 'Terra', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 200, maxHp: 200, atk: 40, def: 60, spd: 20, luk: 15 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🐕', color: 'bg-stone-400' }
  },
  {
    id: 'evo_pupper_aero', speciesId: 12, name: 'โบลท์พัพ', element: 'Aero', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 140, maxHp: 140, atk: 45, def: 30, spd: 70, luk: 15 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '⚡', color: 'bg-yellow-400' }
  },
  {
    id: 'evo_pupper_aqua', speciesId: 13, name: 'ซีด็อก', element: 'Aqua', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 160, maxHp: 160, atk: 45, def: 45, spd: 45, luk: 15 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🦭', color: 'bg-blue-400' }
  },
  {
    id: 'evo_pupper_pyro', speciesId: 14, name: 'ฮอทด็อก', element: 'Pyro', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 150, maxHp: 150, atk: 70, def: 30, spd: 40, luk: 15 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🌭', color: 'bg-red-500' }
  },

  // 2. Drago Evolutions
  {
    id: 'evo_drago_terra', speciesId: 21, name: 'เอิร์ธเดรค', element: 'Terra', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 180, maxHp: 180, atk: 50, def: 50, spd: 30, luk: 15 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🦖', color: 'bg-amber-700' }
  },
  {
    id: 'evo_drago_aero', speciesId: 22, name: 'ไวเวิร์น', element: 'Aero', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 140, maxHp: 140, atk: 60, def: 20, spd: 65, luk: 15 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🦅', color: 'bg-sky-400' }
  },
  {
    id: 'evo_drago_aqua', speciesId: 23, name: 'ซีเซอร์เพนท์', element: 'Aqua', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 160, maxHp: 160, atk: 50, def: 40, spd: 50, luk: 15 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🐍', color: 'bg-cyan-500' }
  },
  {
    id: 'evo_drago_pyro', speciesId: 24, name: 'ไฟร์ลอร์ด', element: 'Pyro', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 150, maxHp: 150, atk: 80, def: 30, spd: 35, luk: 15 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '👺', color: 'bg-rose-600' }
  },

  // 3. Jelly Evolutions
  {
    id: 'evo_jelly_terra', speciesId: 31, name: 'สโตนเจล', element: 'Terra', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 250, maxHp: 250, atk: 30, def: 40, spd: 10, luk: 15 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🧱', color: 'bg-stone-500' }
  },
  {
    id: 'evo_jelly_aero', speciesId: 32, name: 'คลาวด์สไลม์', element: 'Aero', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 180, maxHp: 180, atk: 30, def: 20, spd: 50, luk: 30 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '☁️', color: 'bg-slate-200' }
  },
  {
    id: 'evo_jelly_aqua', speciesId: 33, name: 'ไอซ์คิวบ์', element: 'Aqua', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 200, maxHp: 200, atk: 35, def: 35, spd: 25, luk: 15 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🧊', color: 'bg-cyan-300' }
  },
  {
    id: 'evo_jelly_pyro', speciesId: 34, name: 'ลาวาบล็อบ', element: 'Pyro', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 190, maxHp: 190, atk: 50, def: 25, spd: 20, luk: 15 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🌋', color: 'bg-orange-500' }
  },

  // 4. Tori Evolutions
  {
    id: 'evo_tori_terra', speciesId: 41, name: 'ออสตริชร็อค', element: 'Terra', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 150, maxHp: 150, atk: 45, def: 40, spd: 50, luk: 15 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🦃', color: 'bg-brown-500' }
  },
  {
    id: 'evo_tori_aero', speciesId: 42, name: 'ฟอลคอนเจ็ท', element: 'Aero', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 120, maxHp: 120, atk: 55, def: 20, spd: 90, luk: 15 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🚀', color: 'bg-sky-500' }
  },
  {
    id: 'evo_tori_aqua', speciesId: 43, name: 'เพนกวินไดฟ์', element: 'Aqua', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 140, maxHp: 140, atk: 40, def: 30, spd: 60, luk: 20 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🐧', color: 'bg-indigo-400' }
  },
  {
    id: 'evo_tori_pyro', speciesId: 44, name: 'ฟีนิกซ์ชิค', element: 'Pyro', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 130, maxHp: 130, atk: 65, def: 25, spd: 60, luk: 20 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🔥', color: 'bg-orange-400' }
  },

  // 5. Sprout Evolutions
  {
    id: 'evo_sprout_terra', speciesId: 51, name: 'รูทโกเลม', element: 'Terra', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 180, maxHp: 180, atk: 40, def: 70, spd: 15, luk: 10 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🪵', color: 'bg-green-800' }
  },
  {
    id: 'evo_sprout_aero', speciesId: 52, name: 'ลีฟไกลเดอร์', element: 'Aero', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 140, maxHp: 140, atk: 35, def: 30, spd: 65, luk: 20 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🍃', color: 'bg-lime-300' }
  },
  {
    id: 'evo_sprout_aqua', speciesId: 53, name: 'เคลป์สปิริต', element: 'Aqua', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 160, maxHp: 160, atk: 35, def: 40, spd: 40, luk: 25 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🌿', color: 'bg-teal-400' }
  },
  {
    id: 'evo_sprout_pyro', speciesId: 54, name: 'เบิร์นนิ่งบุช', element: 'Pyro', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 150, maxHp: 150, atk: 55, def: 35, spd: 35, luk: 15 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🍂', color: 'bg-red-800' }
  },

  // 6. Robo Evolutions
  {
    id: 'evo_robo_terra', speciesId: 61, name: 'แทงค์บอท', element: 'Terra', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 170, maxHp: 170, atk: 45, def: 65, spd: 20, luk: 20 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🚜', color: 'bg-gray-500' }
  },
  {
    id: 'evo_robo_aero', speciesId: 62, name: 'โดรนยูนิต', element: 'Aero', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 130, maxHp: 130, atk: 40, def: 25, spd: 70, luk: 30 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🛸', color: 'bg-slate-400' }
  },
  {
    id: 'evo_robo_aqua', speciesId: 63, name: 'ซับมารีนบอท', element: 'Aqua', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 150, maxHp: 150, atk: 40, def: 45, spd: 35, luk: 25 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🚤', color: 'bg-blue-600' }
  },
  {
    id: 'evo_robo_pyro', speciesId: 64, name: 'เฟอร์เนซเมค', element: 'Pyro', stage: 2, level: 10, exp: 0, maxExp: 200,
    stats: { hp: 160, maxHp: 160, atk: 60, def: 40, spd: 25, luk: 20 }, vitals: { ...BASE_VITALS }, appearance: { emoji: '🚂', color: 'bg-orange-700' }
  }
];

// Combine for the master list
export const MONSTER_DB: Monster[] = [...STARTERS, ...EVOLUTIONS];
