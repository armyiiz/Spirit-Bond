import { Enemy } from '../types';

export const RAID_BOSSES: Record<string, Enemy> = {
  raid_terra: {
    id: 'raid_terra',
    name: 'Terra Titan',
    element: 'Terra',
    levelRange: [99, 99], // Raid Bosses are fixed level
    stats: {
      hp: 1000000,
      maxHp: 1000000,
      atk: 100,
      def: 200,
      spd: 10,
      luk: 0
    },
    drops: [], // Raid bosses don't drop items directly
    emoji: '🗿'
  },
  raid_pyro: {
    id: 'raid_pyro',
    name: 'Pyro Titan',
    element: 'Pyro',
    levelRange: [99, 99],
    stats: {
      hp: 1000000,
      maxHp: 1000000,
      atk: 250,
      def: 50,
      spd: 40,
      luk: 0
    },
    drops: [],
    emoji: '🔥'
  },
  raid_aqua: {
    id: 'raid_aqua',
    name: 'Aqua Titan',
    element: 'Aqua',
    levelRange: [99, 99],
    stats: {
      hp: 1000000,
      maxHp: 1000000,
      atk: 150,
      def: 150,
      spd: 30,
      luk: 0
    },
    drops: [],
    emoji: '🌊'
  },
  raid_aero: {
    id: 'raid_aero',
    name: 'Aero Titan',
    element: 'Aero',
    levelRange: [99, 99],
    stats: {
      hp: 1000000,
      maxHp: 1000000,
      atk: 180,
      def: 80,
      spd: 100,
      luk: 0
    },
    drops: [],
    emoji: '🌪️'
  }
};
