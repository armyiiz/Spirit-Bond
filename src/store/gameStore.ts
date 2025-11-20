import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Monster } from '../types';
import { STARTERS } from '../data/monsters';
import { ITEMS } from '../data/items';

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: {
        name: 'Player',
        gold: 0,
        level: 1
      },
      myMonster: null,
      inventory: [
         { item: ITEMS['food_meat'], count: 3 },
         { item: ITEMS['food_apple'], count: 2 }
      ],
      lastSaveTime: Date.now(),

      startGame: (starterSpeciesId: number) => {
        const starter = STARTERS.find(m => m.speciesId === starterSpeciesId);
        if (starter) {
          // Create a deep copy to ensure we have a fresh instance
          set({
            myMonster: JSON.parse(JSON.stringify(starter)),
            lastSaveTime: Date.now()
          });
        }
      },

      setLastSaveTime: (time: number) => {
        set({ lastSaveTime: time });
      },

      tick: () => {
        // This function is called frequently by the game loop
        // We can handle passive regen or state checks here if needed
        // But mostly we rely on updateVitals triggered by the loop
      },

      updateVitals: (delta) => {
        const monster = get().myMonster;
        if (!monster) return;

        const newVitals = { ...monster.vitals };

        if (delta.hunger !== undefined) newVitals.hunger = Math.max(0, Math.min(100, newVitals.hunger + delta.hunger));
        if (delta.mood !== undefined) newVitals.mood = Math.max(0, Math.min(100, newVitals.mood + delta.mood));
        if (delta.energy !== undefined) newVitals.energy = Math.max(0, Math.min(100, newVitals.energy + delta.energy));

        set({
          myMonster: {
            ...monster,
            vitals: newVitals
          }
        });
      },

      addItem: (itemId, count) => {
        const item = ITEMS[itemId];
        if (!item) return;

        const inventory = [...get().inventory];
        const existingIndex = inventory.findIndex(i => i.item.id === itemId);

        if (existingIndex >= 0) {
          inventory[existingIndex].count += count;
        } else {
          inventory.push({ item, count });
        }
        set({ inventory });
      },

      useItem: (itemId) => {
        const state = get();
        const inventory = [...state.inventory];
        const itemIndex = inventory.findIndex(i => i.item.id === itemId);
        const monster = state.myMonster;

        if (itemIndex >= 0 && inventory[itemIndex].count > 0 && monster) {
           const itemDef = inventory[itemIndex].item;

           // Apply effects
           if (itemDef.effect) {
             state.updateVitals({
               hunger: itemDef.effect.hunger || 0,
               mood: itemDef.effect.mood || 0
             });
             if (itemDef.effect.hp) {
               // Heal logic
               const newHp = Math.min(monster.stats.maxHp, monster.stats.hp + itemDef.effect.hp);
               set(s => ({
                 myMonster: s.myMonster ? { ...s.myMonster, stats: { ...s.myMonster.stats, hp: newHp } } : null
               }));
             }
           }

           // Reduce count
           inventory[itemIndex].count -= 1;
           if (inventory[itemIndex].count <= 0) {
             inventory.splice(itemIndex, 1);
           }
           set({ inventory });
        }
      },

      trainMonster: () => {
         const state = get();
         const monster = state.myMonster;
         if (!monster || monster.vitals.energy < 20) return;

         // Burn 20 energy
         state.updateVitals({ energy: -20 });

         // Gain random stat
         // Simple logic: +1 to a random stat
         const stats = ['atk', 'def', 'spd', 'hp'] as const;
         const picked = stats[Math.floor(Math.random() * stats.length)];

         const newStats = { ...monster.stats };
         if (picked === 'hp') {
             newStats.maxHp += 5;
             newStats.hp += 5;
         } else {
             newStats[picked] += 1;
         }

         set(s => ({
           myMonster: s.myMonster ? { ...s.myMonster, stats: newStats } : null
         }));
      }
    }),
    {
      name: 'spirit-bond-storage', // unique name for localStorage
    }
  )
);
