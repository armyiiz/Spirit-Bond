import { Monster } from '../types';

// Base stats for starters
const BASE_VITALS = {
  hunger: 100,
  mood: 100,
  energy: 100
};

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
