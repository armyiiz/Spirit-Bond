import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Monster } from '../types';
import { STARTERS, EVOLUTIONS } from '../data/monsters'; // Import EVOLUTIONS
import { ITEMS } from '../data/items';

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: {
        name: 'Player',
        gold: 100,
        level: 1
      },
      myMonster: null,
      inventory: [
         { item: ITEMS['food_meat'], count: 3 },
         { item: ITEMS['food_apple'], count: 2 }
      ],
      lastSaveTime: Date.now(),
      isSleeping: false,
      sleepTimestamp: null,
      sleepSummary: null,
      activeRouteId: null,

      setActiveRoute: (routeId) => set({ activeRouteId: routeId }),

      startGame: (starterSpeciesId: number) => {
        const starter = STARTERS.find(m => m.speciesId === starterSpeciesId);
        if (starter) {
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
        const state = get();
        if (!state.isSleeping) {
          set({ isSleeping: true, sleepTimestamp: Date.now() });
        } else {
          state.wakeUp();
        }
      },

      wakeUp: () => {
        const state = get();
        const { myMonster, isSleeping, sleepTimestamp } = state;

        if (myMonster && isSleeping && sleepTimestamp) {
          const now = Date.now();
          const secondsAsleep = (now - sleepTimestamp) / 1000;
          const maxHp = myMonster.stats.maxHp;
          const maxEnergy = 100;

          const hpRecoveryRate = maxHp / 7200;
          const energyRecoveryRate = maxEnergy / 7200;

          const hpGained = Math.floor(secondsAsleep * hpRecoveryRate);
          const energyGained = Math.floor(secondsAsleep * energyRecoveryRate);

          const newHp = Math.min(maxHp, myMonster.stats.hp + hpGained);
          const newEnergy = Math.min(maxEnergy, myMonster.vitals.energy + energyGained);

          set({
            myMonster: {
              ...myMonster,
              stats: { ...myMonster.stats, hp: newHp },
              vitals: { ...myMonster.vitals, energy: newEnergy },
            },
            isSleeping: false,
            sleepTimestamp: null,
            sleepSummary: {
              duration: secondsAsleep,
              hpGained: newHp - myMonster.stats.hp,
              energyGained: newEnergy - myMonster.vitals.energy,
            },
          });
        }
      },

      clearSleepSummary: () => {
        set({ sleepSummary: null });
      },

      tick: () => {
        const state = get();
        const monster = state.myMonster;
        if (!monster) return;

        let newVitals = { ...monster.vitals };
        let newHp = monster.stats.hp;
        let newPoopCount = monster.poopCount || 0;

        if (state.isSleeping) {
           const hpGain = monster.stats.maxHp / 7200;
           const energyGain = 100 / 7200;
           newHp = Math.min(monster.stats.maxHp, newHp + hpGain);
           newVitals.energy = Math.min(100, newVitals.energy + energyGain);
        } else {
           if (newVitals.energy < 100) newVitals.energy += 0.5;
           if (newVitals.hunger > 0) newVitals.hunger -= 0.2;
           if (newPoopCount > 0) {
              if (newVitals.mood > 0) newVitals.mood -= 0.5 * newPoopCount;
           }
           if (Math.random() < 0.005) {
               newPoopCount = Math.min(5, newPoopCount + 1);
           }
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
        set({ myMonster: { ...monster, vitals: newVitals } });
      },

      resetSave: () => {
         localStorage.removeItem('spirit-bond-storage');
         window.location.reload();
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

      buyItem: (itemId) => {
         const state = get();
         const item = ITEMS[itemId];
         if (!item || !item.price) return;

         if (state.player.gold >= item.price) {
            set({ player: { ...state.player, gold: state.player.gold - item.price } });
            state.addItem(itemId, 1);
         }
      },

      craftItem: (itemId) => {
        const state = get();
        const item = ITEMS[itemId];
        if (!item || !item.recipe) return;

        const recipe = item.recipe;
        if (state.player.gold < recipe.gold) return;

        const hasIngredients = recipe.ingredients.every(req => {
            const found = state.inventory.find(i => i.item.id === req.itemId);
            return found && found.count >= req.count;
        });

        if (!hasIngredients) return;

        let newInventory = [...state.inventory];
        recipe.ingredients.forEach(req => {
            const idx = newInventory.findIndex(i => i.item.id === req.itemId);
            if (idx !== -1) {
                newInventory[idx].count -= req.count;
            }
        });
        newInventory = newInventory.filter(i => i.count > 0);

        set({
            player: { ...state.player, gold: state.player.gold - recipe.gold },
            inventory: newInventory
        });
        state.addItem(itemId, 1);
      },

      evolveMonster: (targetSpeciesId, requiredItemId) => {
          const state = get();
          const monster = state.myMonster;
          if (!monster) return;

          const invIdx = state.inventory.findIndex(i => i.item.id === requiredItemId);
          if (invIdx === -1) return;

          const targetData = EVOLUTIONS.find(e => e.speciesId === targetSpeciesId);
          if (!targetData) return;

          const newInventory = [...state.inventory];
          newInventory[invIdx].count -= 1;
          if (newInventory[invIdx].count <= 0) newInventory.splice(invIdx, 1);

          const newMonster: Monster = {
              ...targetData,
              level: monster.level,
              exp: monster.exp,
              maxExp: monster.maxExp,
              poopCount: monster.poopCount,
              vitals: { hunger: 100, mood: 100, energy: 100 },
              stats: { ...targetData.stats }, // Full stats overwrite
          };

          set({
              myMonster: newMonster,
              inventory: newInventory
          });
      },

      useItem: (itemId) => {
        const state = get();
        const inventory = [...state.inventory];
        const itemIndex = inventory.findIndex(i => i.item.id === itemId);
        const monster = state.myMonster;

        if (itemIndex >= 0 && inventory[itemIndex].count > 0 && monster) {
           const itemDef = inventory[itemIndex].item;

           if (itemDef.effect) {
             state.updateVitals({
               hunger: itemDef.effect.hunger || 0,
               mood: itemDef.effect.mood || 0
             });

             let healAmount = 0;
             if (itemDef.effect.hp) healAmount += itemDef.effect.hp;
             if (itemDef.effect.hpPercent) {
                 healAmount += Math.floor(monster.stats.maxHp * (itemDef.effect.hpPercent / 100));
             }

             if (healAmount > 0) {
               const newHp = Math.min(monster.stats.maxHp, monster.stats.hp + healAmount);
               set(s => ({
                 myMonster: s.myMonster ? { ...s.myMonster, stats: { ...s.myMonster.stats, hp: newHp } } : null
               }));
             }
           }

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

         state.updateVitals({ energy: -20 });

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
        if (state.player.gold >= 1 && state.myMonster) {
          state.updateVitals({ hunger: 10 });
          set({ player: { ...state.player, gold: state.player.gold - 1 } });
        }
      },

      bathMonster: () => {
         const state = get();
         const monster = state.myMonster;
         if (!monster) return;

         if (monster.vitals.mood < 100 && monster.vitals.energy >= 5) {
             state.updateVitals({ mood: 10, energy: -5 });
         }
      },

      cleanPoop: () => {
        const state = get();
        if (state.myMonster) {
          set({ myMonster: { ...state.myMonster, poopCount: 0 } as Monster });
          state.updateVitals({ mood: 10 });
        }
      },

      gainRewards: (exp, gold, remainingHp) => {
        const state = get();
        const monster = state.myMonster;
        if (!monster) return;

        const newPlayer = { ...state.player, gold: state.player.gold + gold };
        let newExp = monster.exp + exp;
        let newLevel = monster.level;
        let newMaxExp = monster.maxExp;
        let newStats = { ...monster.stats };

        if (remainingHp !== undefined) newStats.hp = remainingHp;

        while (newExp >= newMaxExp) {
           newExp -= newMaxExp;
           newLevel += 1;
           newMaxExp = Math.floor(newMaxExp * 1.2);
           newStats = {
             hp: Math.floor(newStats.hp * 1.1),
             maxHp: Math.floor(newStats.maxHp * 1.1),
             atk: Math.floor(newStats.atk * 1.1),
             def: Math.floor(newStats.def * 1.1),
             spd: Math.floor(newStats.spd * 1.1),
             luk: Math.floor(newStats.luk * 1.1),
           };
        }
        if (newLevel > monster.level) newStats.hp = newStats.maxHp;

        set({
           player: newPlayer,
           myMonster: { ...monster, level: newLevel, exp: newExp, maxExp: newMaxExp, stats: newStats }
        });
      }
    }),
    { name: 'spirit-bond-storage' }
  )
);
