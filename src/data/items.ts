import { Item } from '../types';

export const ITEMS: Record<string, Item> = {
  'food_meat': {
    id: 'food_meat',
    type: 'consumable',
    name: 'เนื้อติดกระดูก',
    description: 'เนื้อชิ้นโต เพิ่มความอิ่มได้มาก',
    effect: { hunger: 20, hp: 10 },
    emoji: '🍖'
  },
  'food_apple': {
    id: 'food_apple',
    type: 'consumable',
    name: 'แอปเปิ้ลป่า',
    description: 'ผลไม้สดชื่น เพิ่มอารมณ์ดี',
    effect: { hunger: 10, mood: 5, hp: 5 },
    emoji: '🍎'
  },
  'potion_hp': {
    id: 'potion_hp',
    type: 'consumable',
    name: 'น้ำยาฟื้นฟู',
    description: 'ฟื้นฟูพลังชีวิต 50 หน่วย',
    effect: { hp: 50 },
    emoji: '🧪'
  },
  'stone_terra': {
    id: 'stone_terra',
    type: 'evo_material',
    name: 'หินปฐพี',
    description: 'ใช้สำหรับวิวัฒนาการเป็นสายดิน',
    emoji: '🪨'
  },
  'stone_aero': {
    id: 'stone_aero',
    type: 'evo_material',
    name: 'หินวายุ',
    description: 'ใช้สำหรับวิวัฒนาการเป็นสายลม',
    emoji: '⚡'
  },
  'stone_aqua': {
    id: 'stone_aqua',
    type: 'evo_material',
    name: 'หินวารี',
    description: 'ใช้สำหรับวิวัฒนาการเป็นสายน้ำ',
    emoji: '💧'
  },
  'stone_pyro': {
    id: 'stone_pyro',
    type: 'evo_material',
    name: 'หินอัคคี',
    description: 'ใช้สำหรับวิวัฒนาการเป็นสายไฟ',
    emoji: '🔥'
  }
};
