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
  parentSpeciesId?: number;
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

export type ItemType = 'consumable' | 'evo_material';

export interface ItemEffect {
  hunger?: number;
  mood?: number;
  hp?: number;
  hpPercent?: number;
}

// [NEW] Recipe System
export interface ItemRecipe {
  gold: number;
  ingredients: { itemId: string; count: number }[];
}

export interface Item {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  effect?: ItemEffect;
  emoji: string;
  price?: number; // Selling Price / Buying Price
  recipe?: ItemRecipe; // [NEW] If exists, this item is craftable
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
  duration: number;
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
  activeRouteId: string | null;

  // Actions
  startGame: (starterId: number) => void;
  tick: () => void;
  updateVitals: (delta: Partial<Vitals>) => void;
  addItem: (itemId: string, count: number) => void;
  useItem: (itemId: string) => void;
  buyItem: (itemId: string) => void;
  craftItem: (itemId: string) => void; // [NEW] Crafting Action
  evolveMonster: (targetSpeciesId: number, requiredItem: string) => void; // [NEW] Evolution Action
  trainMonster: () => { stat: string; value: number } | undefined;
  feedGeneric: () => void;
  bathMonster: () => void;
  cleanPoop: () => void;
  gainRewards: (exp: number, gold: number, remainingHp?: number) => void;
  setLastSaveTime: (time: number) => void;
  toggleSleep: () => void;
  wakeUp: () => void;
  clearSleepSummary: () => void;
  resetSave: () => void;
  setMyMonster: (monster: Monster) => void;
  setActiveRoute: (routeId: string | null) => void;
}

export interface LootTable {
  itemId: string;
  chance: number;
}

export interface Enemy {
  id: string;
  name: string;
  element: ElementType;
  levelRange: [number, number];
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
  enemies: string[];
  bossId?: string;
  color: string;
}
