import { Item } from '../types';

export const ITEMS: Record<string, Item> = {
  // --- Consumables ---
  'food_meat': { id: 'food_meat', type: 'consumable', name: 'เนื้อติดกระดูก', description: 'เนื้อชิ้นโต เพิ่มความอิ่มได้มาก', effect: { hunger: 20, hp: 10 }, emoji: '🍖', price: 5 },
  'food_apple': { id: 'food_apple', type: 'consumable', name: 'แอปเปิ้ลป่า', description: 'ผลไม้สดชื่น เพิ่มอารมณ์ดี', effect: { hunger: 10, mood: 5, hp: 5 }, emoji: '🍎', price: 3 },
  'potion_hp': { id: 'potion_hp', type: 'consumable', name: 'น้ำยาฟื้นฟู', description: 'ฟื้นฟูพลังชีวิต 50 หน่วย', effect: { hp: 50 }, emoji: '🧪', price: 20 },
  'potion_super': { id: 'potion_super', type: 'consumable', name: 'น้ำยาฟื้นฟู (ใหญ่)', description: 'ฟื้นฟู 50% ของ HP สูงสุด', effect: { hpPercent: 50 }, emoji: '⚗️', price: 50 },

  // --- Boss Drops (Ingredients) ---
  'evo_shard_terra': { id: 'evo_shard_terra', type: 'evo_material', name: 'เศษศิลาแลง', description: 'ชิ้นส่วนจากโกเลม', emoji: '🪨', price: 50 },
  'evo_gem_terra': { id: 'evo_gem_terra', type: 'evo_material', name: 'เกล็ดคริสตัล', description: 'แร่หายากจากถ้ำลึก', emoji: '💎', price: 100 },
  'evo_feather_aero': { id: 'evo_feather_aero', type: 'evo_material', name: 'ขนนกวายุ', description: 'ขนที่เบาหวิว', emoji: '🪶', price: 50 },
  'evo_cloud_aero': { id: 'evo_cloud_aero', type: 'evo_material', name: 'ละอองเมฆา', description: 'ก้อนเมฆที่จับต้องได้', emoji: '☁️', price: 100 },
  'evo_shell_aqua': { id: 'evo_shell_aqua', type: 'evo_material', name: 'กระดองมรกต', description: 'กระดองแข็งแกร่ง', emoji: '🐢', price: 50 },
  'evo_ice_aqua': { id: 'evo_ice_aqua', type: 'evo_material', name: 'เกล็ดน้ำแข็ง', description: 'ความเย็นยะเยือก', emoji: '🧊', price: 100 },
  'evo_tail_pyro': { id: 'evo_tail_pyro', type: 'evo_material', name: 'หางเพลิง', description: 'ชิ้นส่วนที่ยังร้อนอยู่', emoji: '🦎', price: 50 },
  'evo_stinger_pyro': { id: 'evo_stinger_pyro', type: 'evo_material', name: 'เข็มพิษร้อน', description: 'อาวุธร้ายของแมงป่อง', emoji: '🦂', price: 100 },

  // --- Evolution Stones (Craftable) ---
  'stone_terra': {
    id: 'stone_terra',
    type: 'evo_material',
    name: 'หินปฐพี',
    description: 'หินธาตุดินบริสุทธิ์',
    emoji: '🟤',
    price: 500,
    recipe: {
      gold: 200,
      ingredients: [
        { itemId: 'evo_shard_terra', count: 1 },
        { itemId: 'evo_gem_terra', count: 1 }
      ]
    }
  },
  'stone_aero': {
    id: 'stone_aero',
    type: 'evo_material',
    name: 'หินวายุ',
    description: 'หินธาตุลมบริสุทธิ์',
    emoji: '🟢',
    price: 500,
    recipe: {
      gold: 200,
      ingredients: [
        { itemId: 'evo_feather_aero', count: 1 },
        { itemId: 'evo_cloud_aero', count: 1 }
      ]
    }
  },
  'stone_aqua': {
    id: 'stone_aqua',
    type: 'evo_material',
    name: 'หินวารี',
    description: 'หินธาตุน้ำบริสุทธิ์',
    emoji: '🔵',
    price: 500,
    recipe: {
      gold: 200,
      ingredients: [
        { itemId: 'evo_shell_aqua', count: 1 },
        { itemId: 'evo_ice_aqua', count: 1 }
      ]
    }
  },
  'stone_pyro': {
    id: 'stone_pyro',
    type: 'evo_material',
    name: 'หินอัคคี',
    description: 'หินธาตุไฟบริสุทธิ์',
    emoji: '🔴',
    price: 500,
    recipe: {
      gold: 200,
      ingredients: [
        { itemId: 'evo_tail_pyro', count: 1 },
        { itemId: 'evo_stinger_pyro', count: 1 }
      ]
    }
  }
};
