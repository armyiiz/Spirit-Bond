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
        gold: 100, // Given initial gold for testing
        level: 1
      },
      myMonster: null,
      inventory: [
         { item: ITEMS['food_meat'], count: 3 },
         { item: ITEMS['food_apple'], count: 2 }
      ],
      lastSaveTime: Date.now(),
      isSleeping: false, // Initial state

      startGame: (starterSpeciesId: number) => {
        const starter = STARTERS.find(m => m.speciesId === starterSpeciesId);
        if (starter) {
          // Create a deep copy to ensure we have a fresh instance
          // Initialize poopCount to 0
          set({
            myMonster: { ...JSON.parse(JSON.stringify(starter)), poopCount: 0 },
            lastSaveTime: Date.now()
          });
        }
      },

      setLastSaveTime: (time: number) => {
        set({ lastSaveTime: time });
      },

      setMyMonster: (m) => set({ myMonster: m }),

      toggleSleep: () => {
         const current = get().isSleeping;
         set({ isSleeping: !current });
      },

      tick: () => {
        const state = get();
        const monster = state.myMonster;
        if (!monster) return;

        let newVitals = { ...monster.vitals };
        let newHp = monster.stats.hp;

        // Sleep Logic (User Request #6)
        if (state.isSleeping) {
           // Heal HP rapidly (e.g. 2% of max per tick)
           // If tick is 10s, 100% takes ~500s (approx 8.3 mins)
           const healAmount = Math.ceil(monster.stats.maxHp * 0.02);
           newHp = Math.min(monster.stats.maxHp, newHp + healAmount);

           // Energy Regen
           newVitals.energy = Math.min(100, newVitals.energy + 2);
        } else {
           // Normal Passive Logic
           if (newVitals.energy < 100) newVitals.energy += 0.5;
           if (newVitals.hunger > 0) newVitals.hunger -= 0.2; // Changed to 0.2 as per plan
        }

        // Poop Chance (0.5% per tick)
        let newPoopCount = monster.poopCount || 0;
        // Don't poop while sleeping? User didn't specify, but usually tamagotchis don't poop while sleeping.
        // I'll keep it simple and allow poop for now unless it becomes an issue, or disable it if logic dictates.
        // Actually, let's disable poop while sleeping to be nice.
        if (!state.isSleeping && Math.random() < 0.005) {
           newPoopCount = Math.min(5, newPoopCount + 1);
        }

        set({
          myMonster: {
            ...monster,
            stats: { ...monster.stats, hp: newHp },
            vitals: newVitals,
            poopCount: newPoopCount
          } as Monster
        });
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

      resetSave: () => {
         localStorage.removeItem('spirit-bond-storage');
         window.location.reload(); // Brute force reset
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
         let gainedValue = 1;

         if (picked === 'hp') {
             gainedValue = 5;
             newStats.maxHp += gainedValue;
             newStats.hp += gainedValue;
         } else {
             newStats[picked] += gainedValue;
         }

         set(s => ({
           myMonster: s.myMonster ? { ...s.myMonster, stats: newStats } : null
         }));

         return { stat: picked, value: gainedValue };
      },

      feedGeneric: () => {
        const state = get();
        // Only if player has money and monster exists
        if (state.player.gold >= 1 && state.myMonster) {
          state.updateVitals({ hunger: 10 });
          set({ player: { ...state.player, gold: state.player.gold - 1 } });
        }
      },

      cleanPoop: () => {
        const state = get();
        if (state.myMonster) {
          set({ myMonster: { ...state.myMonster, poopCount: 0 } as Monster });
          state.updateVitals({ mood: 10 });
        }
      },

      gainRewards: (exp: number, gold: number) => {
        const state = get();
        const monster = state.myMonster;
        if (!monster) return;

        // Add Gold to Player
        const newPlayer = { ...state.player, gold: state.player.gold + gold };

        // Add EXP to Monster
        let newExp = monster.exp + exp;
        let newLevel = monster.level;
        let newMaxExp = monster.maxExp;
        let newStats = { ...monster.stats };

        // Level Up Logic
        // Using while loop in case of massive EXP gain (e.g. debug or events)
        while (newExp >= newMaxExp) {
           newExp -= newMaxExp;
           newLevel += 1;
           newMaxExp = Math.floor(newMaxExp * 1.2);

           // Stat Growth: +10% to all stats
           newStats = {
             hp: Math.floor(newStats.hp * 1.1), // Current HP also scales? Or just Max? Usually Max.
             maxHp: Math.floor(newStats.maxHp * 1.1),
             atk: Math.floor(newStats.atk * 1.1),
             def: Math.floor(newStats.def * 1.1),
             spd: Math.floor(newStats.spd * 1.1),
             luk: Math.floor(newStats.luk * 1.1),
           };
        }

        // If leveled up, full heal (User request: "Heal HP เต็มหลอด")
        if (newLevel > monster.level) {
           newStats.hp = newStats.maxHp;
        }

        set({
           player: newPlayer,
           myMonster: {
             ...monster,
             level: newLevel,
             exp: newExp,
             maxExp: newMaxExp,
             stats: newStats
           }
        });
      }
    }),
    {
      name: 'spirit-bond-storage', // unique name for localStorage
    }
  )
);
