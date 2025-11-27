// ... (Imports & Interfaces อื่นๆ เหมือนเดิม: Stats, Vitals, Monster, Item, etc.)
export type ElementType = 'Terra' | 'Aero' | 'Aqua' | 'Pyro' | 'Neutral';

export interface Stats {
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  spd: number;
  luk: number;
}

export interface Vitals {
  hunger: number;
  mood: number;
  energy: number;
}

export interface Monster {
  id: string;
  speciesId: number;
  name: string;
  element: ElementType;
  stage: number;
  level: number;
  exp: number;
  maxExp: number;
  stats: Stats;
  vitals: Vitals;
  poopCount?: number;
  appearance: {
    emoji: string;
    color: string;
  };
}

export type ItemType = 'consumable' | 'evo_material' | 'material';

export interface ItemEffect {
  hunger?: number;
  mood?: number;
  hp?: number;        // Flat heal
  hpPercent?: number; // % heal (Stackable)
}

export interface Item {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  effect?: ItemEffect;
  emoji: string;
  price?: number; // For Shop
  craftReq?: { itemId: string; count: number }[]; // For Crafting/Trading
}

export interface InventoryItem {
  item: Item;
  count: number;
}

export interface Player {
  name: string;
  gold: number;
  level: number;
}

export interface SleepSummary {
  duration: number; // in seconds
  hpGained: number;
  energyGained: number;
}

export interface GameState {
  player: Player;
  myMonster: Monster | null;
  inventory: InventoryItem[];
  lastSaveTime: number;
  isSleeping: boolean;
  sleepTimestamp: number | null;
  sleepSummary: SleepSummary | null;

  // Exploration State
  activeRouteId: string | null;
  explorationStep: number; // [NEW] ตัวนับด่าน (0-4)

  // Actions
  startGame: (starterId: number) => void;
  tick: () => void;
  updateVitals: (delta: Partial<Vitals>) => void;
  addItem: (itemId: string, count: number) => void;
  useItem: (itemId: string) => void;
  buyItem: (itemId: string) => void;
  craftItem: (itemId: string) => void;
  evolveMonster: (targetSpeciesId: number, requiredItem: string) => void;
  trainMonster: () => { stat: string; value: number } | undefined;
  feedGeneric: () => void;
  bathMonster: () => void;
  cleanPoop: () => void;
  gainRewards: (exp: number, gold: number, remainingHp?: number) => void;
  setLastSaveTime: (time: number) => void;
  toggleSleep: () => void;
  wakeUp: () => { duration: number, hpGained: number, energyGained: number } | null;
  clearSleepSummary: () => void;
  resetSave: () => void;
  setMyMonster: (monster: Monster) => void;

  // Exploration Actions
  setActiveRoute: (routeId: string | null) => void;
  advanceExploration: () => void; // [NEW]
  resetExploration: () => void;   // [NEW]
}

export interface LootTable {
  itemId: string;
  chance: number; // 0-1 (e.g., 0.5 = 50%)
}

export interface Enemy {
  id: string;
  name: string;
  element: ElementType;
  levelRange: [number, number]; // [min, max] relative to player
  stats: Stats;
  drops: LootTable[];
  isBoss?: boolean;
  emoji: string;
}

export interface Route {
  id: string;
  name: string;
  description: string;
  element: ElementType;
  requiredLevel: number;
  enemies: string[]; // Enemy IDs
  bossId?: string;
  color: string; // Tailwind class
}
