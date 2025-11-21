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
  hunger: number; // 0-100, decreases over time
  mood: number;   // 0-100
  energy: number; // 0-100, used for training
}

export interface Monster {
  id: string;
  speciesId: number;
  name: string;
  element: ElementType;
  stage: number; // 1 = Baby/Starter
  level: number;
  exp: number;
  maxExp: number;
  stats: Stats;
  vitals: Vitals;
  appearance: {
    emoji: string;
    color: string; // Tailwind color class e.g. "bg-red-500"
  };
}

export type ItemType = 'consumable' | 'evo_material';

export interface ItemEffect {
  hunger?: number;
  mood?: number;
  hp?: number;
}

export interface Item {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  effect?: ItemEffect;
  emoji: string;
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

export interface GameState {
  player: Player;
  myMonster: Monster | null;
  inventory: InventoryItem[];
  lastSaveTime: number;

  // Actions
  startGame: (starterId: number) => void;
  tick: () => void; // Main loop tick
  updateVitals: (delta: Partial<Vitals>) => void;
  addItem: (itemId: string, count: number) => void;
  useItem: (itemId: string) => void;
  trainMonster: () => void;
  gainRewards: (exp: number, gold: number) => void;
  setLastSaveTime: (time: number) => void;
}
