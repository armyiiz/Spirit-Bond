import { Enemy } from '../types';

const baseStats = (hp: number, atk: number, def: number, spd: number) => ({ hp, maxHp: hp, atk, def, spd, luk: 10 });

export const ENEMIES: Record<string, Enemy> = {
  // 🪨 TERRA Route 1 (Lv.1)
  'terra_1_m1': { id: 'terra_1_m1', name: 'ก้อนหินเดินได้', element: 'Terra', levelRange: [-2, 0], stats: baseStats(80, 15, 25, 5), drops: [], emoji: '🪨' },
  'terra_1_m2': { id: 'terra_1_m2', name: 'สไลม์โคลน', element: 'Terra', levelRange: [-2, 0], stats: baseStats(90, 12, 20, 8), drops: [], emoji: '💩' },
  'terra_1_m3': { id: 'terra_1_m3', name: 'ค้างคาวทราย', element: 'Terra', levelRange: [-2, 0], stats: baseStats(60, 20, 10, 20), drops: [], emoji: '🦇' },
  'terra_1_mini': { id: 'terra_1_mini', name: 'องครักษ์หิน', element: 'Terra', levelRange: [0, 0], stats: baseStats(150, 25, 40, 10), drops: [], emoji: '💂' },
  'terra_1_boss': { id: 'terra_1_boss', name: 'ราชันย์ศิลาแลง', element: 'Terra', levelRange: [0, 0], stats: baseStats(300, 40, 50, 5), drops: [{ itemId: 'evo_shard_terra', chance: 0.5 }], emoji: '🗿', isBoss: true },

  // 🪨 TERRA Route 2 (Lv.5)
  'terra_2_m1': { id: 'terra_2_m1', name: 'เศษอัญมณี', element: 'Terra', levelRange: [-2, 0], stats: baseStats(100, 25, 30, 10), drops: [], emoji: '💎' },
  'terra_2_m2': { id: 'terra_2_m2', name: 'แมงมุมแก้ว', element: 'Terra', levelRange: [-2, 0], stats: baseStats(110, 30, 15, 15), drops: [], emoji: '🕷️' },
  'terra_2_m3': { id: 'terra_2_m3', name: 'ตุ๊กตาหินงอก', element: 'Terra', levelRange: [-2, 0], stats: baseStats(130, 20, 35, 5), drops: [], emoji: '👺' },
  'terra_2_mini': { id: 'terra_2_mini', name: 'ปูผลึก', element: 'Terra', levelRange: [0, 0], stats: baseStats(200, 35, 45, 12), drops: [], emoji: '🦀' },
  'terra_2_boss': { id: 'terra_2_boss', name: 'หนอนยักษ์คริสตัล', element: 'Terra', levelRange: [0, 0], stats: baseStats(400, 50, 40, 15), drops: [{ itemId: 'evo_gem_terra', chance: 0.5 }], emoji: '🐛', isBoss: true },

  // 🍃 AERO Route 1 (Lv.1)
  'aero_1_m1': { id: 'aero_1_m1', name: 'ภูตลมจิ๋ว', element: 'Aero', levelRange: [-2, 0], stats: baseStats(60, 18, 10, 25), drops: [], emoji: '🍃' },
  'aero_1_m2': { id: 'aero_1_m2', name: 'เมล็ดลอยฟ้า', element: 'Aero', levelRange: [-2, 0], stats: baseStats(50, 15, 5, 30), drops: [], emoji: '🌰' },
  'aero_1_m3': { id: 'aero_1_m3', name: 'ตั๊กแตนยักษ์', element: 'Aero', levelRange: [-2, 0], stats: baseStats(70, 20, 15, 20), drops: [], emoji: '🦗' },
  'aero_1_mini': { id: 'aero_1_mini', name: 'หมาป่าสายลม', element: 'Aero', levelRange: [0, 0], stats: baseStats(140, 30, 20, 35), drops: [], emoji: '🐺' },
  'aero_1_boss': { id: 'aero_1_boss', name: 'กริฟฟินเวหา', element: 'Aero', levelRange: [0, 0], stats: baseStats(280, 45, 30, 45), drops: [{ itemId: 'evo_feather_aero', chance: 0.5 }], emoji: '🦅', isBoss: true },

  // 🍃 AERO Route 2 (Lv.5)
  'aero_2_m1': { id: 'aero_2_m1', name: 'วิญญาณหมอก', element: 'Aero', levelRange: [-2, 0], stats: baseStats(90, 25, 15, 25), drops: [], emoji: '🌫️' },
  'aero_2_m2': { id: 'aero_2_m2', name: 'ปลากระเบนฟ้า', element: 'Aero', levelRange: [-2, 0], stats: baseStats(100, 28, 18, 22), drops: [], emoji: '🪁' },
  'aero_2_m3': { id: 'aero_2_m3', name: 'ลูกนกสายฟ้า', element: 'Aero', levelRange: [-2, 0], stats: baseStats(80, 35, 10, 30), drops: [], emoji: '🐣' },
  'aero_2_mini': { id: 'aero_2_mini', name: 'ฮาร์ปี้', element: 'Aero', levelRange: [0, 0], stats: baseStats(180, 45, 15, 40), drops: [], emoji: '🧛‍♀️' },
  'aero_2_boss': { id: 'aero_2_boss', name: 'ภูตเมฆา', element: 'Aero', levelRange: [0, 0], stats: baseStats(350, 60, 25, 45), drops: [{ itemId: 'evo_cloud_aero', chance: 0.5 }], emoji: '🧞', isBoss: true },

  // 💧 AQUA Route 1 (Lv.1)
  'aqua_1_m1': { id: 'aqua_1_m1', name: 'ฟองน้ำมีชีวิต', element: 'Aqua', levelRange: [-2, 0], stats: baseStats(70, 15, 15, 15), drops: [], emoji: '🫧' },
  'aqua_1_m2': { id: 'aqua_1_m2', name: 'กบใบไม้', element: 'Aqua', levelRange: [-2, 0], stats: baseStats(75, 18, 18, 18), drops: [], emoji: '🐸' },
  'aqua_1_m3': { id: 'aqua_1_m3', name: 'ภูตดอกบัว', element: 'Aqua', levelRange: [-2, 0], stats: baseStats(80, 16, 20, 10), drops: [], emoji: '🪷' },
  'aqua_1_mini': { id: 'aqua_1_mini', name: 'งูแม่น้ำ', element: 'Aqua', levelRange: [0, 0], stats: baseStats(150, 28, 28, 20), drops: [], emoji: '🐍' },
  'aqua_1_boss': { id: 'aqua_1_boss', name: 'เต่ามรกตโบราณ', element: 'Aqua', levelRange: [0, 0], stats: baseStats(320, 35, 55, 10), drops: [{ itemId: 'evo_shell_aqua', chance: 0.5 }], emoji: '🐢', isBoss: true },

  // 💧 AQUA Route 2 (Lv.5)
  'aqua_2_m1': { id: 'aqua_2_m1', name: 'วุ้นน้ำแข็ง', element: 'Aqua', levelRange: [-2, 0], stats: baseStats(100, 25, 30, 10), drops: [], emoji: '🧊' },
  'aqua_2_m2': { id: 'aqua_2_m2', name: 'ทหารเพนกวิน', element: 'Aqua', levelRange: [-2, 0], stats: baseStats(110, 30, 25, 15), drops: [], emoji: '🐧' },
  'aqua_2_m3': { id: 'aqua_2_m3', name: 'ปีศาจแท่งน้ำแข็ง', element: 'Aqua', levelRange: [-2, 0], stats: baseStats(90, 32, 20, 18), drops: [], emoji: '🥶' },
  'aqua_2_mini': { id: 'aqua_2_mini', name: 'ไซเรน', element: 'Aqua', levelRange: [0, 0], stats: baseStats(190, 45, 25, 28), drops: [], emoji: '🧜‍♀️' },
  'aqua_2_boss': { id: 'aqua_2_boss', name: 'ปูน้ำแข็งยักษ์', element: 'Aqua', levelRange: [0, 0], stats: baseStats(400, 50, 50, 15), drops: [{ itemId: 'evo_ice_aqua', chance: 0.5 }], emoji: '🦞', isBoss: true },

  // 🔥 PYRO Route 1 (Lv.1)
  'pyro_1_m1': { id: 'pyro_1_m1', name: 'วิญญาณถ่าน', element: 'Pyro', levelRange: [-2, 0], stats: baseStats(60, 25, 10, 15), drops: [], emoji: '🔥' },
  'pyro_1_m2': { id: 'pyro_1_m2', name: 'ค้างคาวไฟ', element: 'Pyro', levelRange: [-2, 0], stats: baseStats(50, 22, 12, 25), drops: [], emoji: '🦇' },
  'pyro_1_m3': { id: 'pyro_1_m3', name: 'สไลม์ลาวา', element: 'Pyro', levelRange: [-2, 0], stats: baseStats(70, 20, 18, 10), drops: [], emoji: '🌋' },
  'pyro_1_mini': { id: 'pyro_1_mini', name: 'โกเลมลาวา', element: 'Pyro', levelRange: [0, 0], stats: baseStats(160, 35, 30, 8), drops: [], emoji: '👹' },
  'pyro_1_boss': { id: 'pyro_1_boss', name: 'ซาลาแมนเดอร์เพลิง', element: 'Pyro', levelRange: [0, 0], stats: baseStats(280, 50, 25, 20), drops: [{ itemId: 'evo_tail_pyro', chance: 0.5 }], emoji: '🦎', isBoss: true },

  // 🔥 PYRO Route 2 (Lv.5)
  'pyro_2_m1': { id: 'pyro_2_m1', name: 'งูทราย', element: 'Pyro', levelRange: [-2, 0], stats: baseStats(80, 35, 15, 22), drops: [], emoji: '🐍' },
  'pyro_2_m2': { id: 'pyro_2_m2', name: 'มดไฟ', element: 'Pyro', levelRange: [-2, 0], stats: baseStats(70, 40, 20, 20), drops: [], emoji: '🐜' },
  'pyro_2_m3': { id: 'pyro_2_m3', name: 'สุนัขมัมมี่', element: 'Pyro', levelRange: [-2, 0], stats: baseStats(90, 32, 25, 15), drops: [], emoji: '🐕' },
  'pyro_2_mini': { id: 'pyro_2_mini', name: 'นายพลกระบองเพชร', element: 'Pyro', levelRange: [0, 0], stats: baseStats(190, 50, 35, 15), drops: [], emoji: '🌵' },
  'pyro_2_boss': { id: 'pyro_2_boss', name: 'ราชาแมงป่องเพลิง', element: 'Pyro', levelRange: [0, 0], stats: baseStats(380, 65, 40, 18), drops: [{ itemId: 'evo_stinger_pyro', chance: 0.5 }], emoji: '🦂', isBoss: true },
};
