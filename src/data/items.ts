import { Item } from '../types';

export const ITEMS: Record<string, Item> = {
  'food_meat': {
    id: 'food_meat',
    type: 'consumable',
    name: 'เนื้อติดกระดูก',
    description: 'เนื้อชิ้นโต เพิ่มความอิ่มได้มาก',
    effect: { hunger: 20, hp: 10 },
    emoji: '🍖',
    price: 5
  },
  'food_apple': {
    id: 'food_apple',
    type: 'consumable',
    name: 'แอปเปิ้ลป่า',
    description: 'ผลไม้สดชื่น เพิ่มอารมณ์ดี',
    effect: { hunger: 10, mood: 5, hp: 5 },
    emoji: '🍎',
    price: 3
  },
  'potion_hp': {
    id: 'potion_hp',
    type: 'consumable',
    name: 'น้ำยาฟื้นฟู',
    description: 'ฟื้นฟูพลังชีวิต 50 หน่วย',
    effect: { hp: 50 },
    emoji: '🧪',
    price: 2
  },
  'potion_super': {
    id: 'potion_super',
    type: 'consumable',
    name: 'น้ำยาฟื้นฟู (ใหญ่)',
    description: 'ฟื้นฟู 50% ของ HP สูงสุด',
    effect: { hpPercent: 50 },
    emoji: '⚗️',
    price: 5
  },
  'stone_terra': {
    id: 'stone_terra',
    type: 'evo_material',
    name: 'หินปฐพี',
    description: 'ใช้สำหรับวิวัฒนาการเป็นสายดิน',
    emoji: '🪨',
    price: 500,
    craftReq: [{ itemId: 'evo_shard_terra', count: 1 }, { itemId: 'evo_gem_terra', count: 1 }]
  },
  'stone_aero': {
    id: 'stone_aero',
    type: 'evo_material',
    name: 'หินวายุ',
    description: 'ใช้สำหรับวิวัฒนาการเป็นสายลม',
    emoji: '⚡',
    price: 500,
    craftReq: [{ itemId: 'evo_feather_aero', count: 1 }, { itemId: 'evo_cloud_aero', count: 1 }]
  },
  'stone_aqua': {
    id: 'stone_aqua',
    type: 'evo_material',
    name: 'หินวารี',
    description: 'ใช้สำหรับวิวัฒนาการเป็นสายน้ำ',
    emoji: '💧',
    price: 500,
    craftReq: [{ itemId: 'evo_shell_aqua', count: 1 }, { itemId: 'evo_ice_aqua', count: 1 }]
  },
  'stone_pyro': {
    id: 'stone_pyro',
    type: 'evo_material',
    name: 'หินอัคคี',
    description: 'ใช้สำหรับวิวัฒนาการเป็นสายไฟ',
    emoji: '🔥',
    price: 500,
    craftReq: [{ itemId: 'evo_tail_pyro', count: 1 }, { itemId: 'evo_stinger_pyro', count: 1 }]
  },

  // --- Boss Drops (Materials: Terra) ---
  'evo_shard_terra': {
    id: 'evo_shard_terra',
    type: 'material',
    name: 'เศษศิลาแห่งความพินาศ',
    description: 'ชิ้นส่วนจากราชันย์หิน ใช้สร้าง Terra Stone',
    emoji: '🗿',
    price: 100
  },
  'evo_gem_terra': {
    id: 'evo_gem_terra',
    type: 'material',
    name: 'ผลึกแก้วกัดกิน',
    description: 'ชิ้นส่วนจากหนอนคริสตัล ใช้สร้าง Terra Stone',
    emoji: '🐛',
    price: 150
  },

  // --- Boss Drops (Materials: Aero) ---
  'evo_feather_aero': {
    id: 'evo_feather_aero',
    type: 'material',
    name: 'ขนนกกริฟฟิน',
    description: 'ขนศักดิ์สิทธิ์จากเจ้าเวหา ใช้สร้าง Aero Stone',
    emoji: '🪶',
    price: 100
  },
  'evo_cloud_aero': {
    id: 'evo_cloud_aero',
    type: 'material',
    name: 'ก้อนเมฆต้องสาป',
    description: 'ไอหมอกจากภูตเมฆา ใช้สร้าง Aero Stone',
    emoji: '☁️',
    price: 150
  },

  // --- Boss Drops (Materials: Aqua) ---
  'evo_shell_aqua': {
    id: 'evo_shell_aqua',
    type: 'material',
    name: 'กระดองมรกต',
    description: 'กระดองแข็งแกร่งของเต่าโบราณ ใช้สร้าง Aqua Stone',
    emoji: '🐢',
    price: 100
  },
  'evo_ice_aqua': {
    id: 'evo_ice_aqua',
    type: 'material',
    name: 'เกล็ดน้ำแข็งยักษ์',
    description: 'ชิ้นส่วนเย็นยะเยือกจากปูน้ำแข็ง ใช้สร้าง Aqua Stone',
    emoji: '🧊',
    price: 150
  },

  // --- Boss Drops (Materials: Pyro) ---
  'evo_tail_pyro': {
    id: 'evo_tail_pyro',
    type: 'material',
    name: 'หางซาลาแมนเดอร์',
    description: 'อวัยวะที่ยังลุกไหม้ ใช้สร้าง Pyro Stone',
    emoji: '🦎',
    price: 100
  },
  'evo_stinger_pyro': {
    id: 'evo_stinger_pyro',
    type: 'material',
    name: 'เหล็กในราชาแมงป่อง',
    description: 'พิษร้ายแรงที่ถูกสกัดออก ใช้สร้าง Pyro Stone',
    emoji: '🦂',
    price: 150
  }
};
