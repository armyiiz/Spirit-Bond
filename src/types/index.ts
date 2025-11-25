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

export type ItemType = 'consumable' | 'evo_material';

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

  // Actions
  startGame: (starterId: number) => void;
  tick: () => void;
  updateVitals: (delta: Partial<Vitals>) => void;
  addItem: (itemId: string, count: number) => void;
  useItem: (itemId: string) => void;
  buyItem: (itemId: string) => void; // New Shop Action
  trainMonster: () => { stat: string; value: number } | undefined;
  feedGeneric: () => void;
  bathMonster: () => void; // New Bath Action
  cleanPoop: () => void;
  gainRewards: (exp: number, gold: number, remainingHp?: number) => void;
  setLastSaveTime: (time: number) => void;
  toggleSleep: () => void;
  wakeUp: () => void;
  clearSleepSummary: () => void;
  resetSave: () => void;
  setMyMonster: (monster: Monster) => void;
}
