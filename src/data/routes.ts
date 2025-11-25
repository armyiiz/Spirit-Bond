import { Route } from '../types';

export const ROUTES: Route[] = [
  // 🪨 TERRA
  { id: 'terra_1', name: 'หุบเขาศิลาแลง', description: 'พื้นที่รกร้างเต็มไปด้วยหินแข็ง', element: 'Terra', requiredLevel: 1, enemies: ['terra_1_m1', 'terra_1_m2', 'terra_1_m3', 'terra_1_mini'], bossId: 'terra_1_boss', color: 'bg-amber-900' },
  { id: 'terra_2', name: 'ถ้ำคริสตัล', description: 'ถ้ำลึกลับที่ส่องแสงระยิบระยับ', element: 'Terra', requiredLevel: 5, enemies: ['terra_2_m1', 'terra_2_m2', 'terra_2_m3', 'terra_2_mini'], bossId: 'terra_2_boss', color: 'bg-purple-900' },

  // 🍃 AERO
  { id: 'aero_1', name: 'ทุ่งหญ้าสายลม', description: 'ทุ่งกว้างที่มีลมกรรโชกแรง', element: 'Aero', requiredLevel: 1, enemies: ['aero_1_m1', 'aero_1_m2', 'aero_1_m3', 'aero_1_mini'], bossId: 'aero_1_boss', color: 'bg-sky-300 text-slate-900' },
  { id: 'aero_2', name: 'ยอดเขาเมฆหมอก', description: 'ยอดเขาสูงเทียมเมฆ', element: 'Aero', requiredLevel: 5, enemies: ['aero_2_m1', 'aero_2_m2', 'aero_2_m3', 'aero_2_mini'], bossId: 'aero_2_boss', color: 'bg-slate-400 text-slate-900' },

  // 💧 AQUA
  { id: 'aqua_1', name: 'ทะเลสาบมรกต', description: 'แหล่งน้ำเงียบสงบ', element: 'Aqua', requiredLevel: 1, enemies: ['aqua_1_m1', 'aqua_1_m2', 'aqua_1_m3', 'aqua_1_mini'], bossId: 'aqua_1_boss', color: 'bg-cyan-800' },
  { id: 'aqua_2', name: 'ถ้ำน้ำแข็งใต้สมุทร', description: 'ความหนาวเหน็บที่แช่แข็งวิญญาณ', element: 'Aqua', requiredLevel: 5, enemies: ['aqua_2_m1', 'aqua_2_m2', 'aqua_2_m3', 'aqua_2_mini'], bossId: 'aqua_2_boss', color: 'bg-blue-900' },

  // 🔥 PYRO
  { id: 'pyro_1', name: 'ปล่องภูเขาไฟ', description: 'ความร้อนระอุที่แผดเผา', element: 'Pyro', requiredLevel: 1, enemies: ['pyro_1_m1', 'pyro_1_m2', 'pyro_1_m3', 'pyro_1_mini'], bossId: 'pyro_1_boss', color: 'bg-red-900' },
  { id: 'pyro_2', name: 'ทะเลทรายระอุ', description: 'ดินแดนไร้น้ำที่มีแต่สัตว์มีพิษ', element: 'Pyro', requiredLevel: 5, enemies: ['pyro_2_m1', 'pyro_2_m2', 'pyro_2_m3', 'pyro_2_mini'], bossId: 'pyro_2_boss', color: 'bg-orange-700' }
];
