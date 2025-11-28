import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Monster, Stats } from '../types';
import { STARTERS } from '../data/monsters';
import { ITEMS } from '../data/items';

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: { name: 'Player', gold: 100, level: 1 },
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

      // Exploration State
      explorationStep: 0,

      // New Features State
      raidTickets: 3,
      spiritTokens: 0,
      totalRaidDamage: 0,
      lastLoginDate: null,
      equippedItemId: null,

      setActiveRoute: (routeId) => set({ activeRouteId: routeId, explorationStep: 0 }),
      advanceExploration: () => set((state) => ({ explorationStep: state.explorationStep + 1 })),
      resetExploration: () => set({ explorationStep: 0, activeRouteId: null }),

      // Actions
      startGame: (starterSpeciesId: number) => {
        const starter = STARTERS.find(m => m.speciesId === starterSpeciesId);
        if (starter) {
          set({
            myMonster: { ...JSON.parse(JSON.stringify(starter)), poopCount: 0 },
            lastSaveTime: Date.now(),
            raidTickets: 3,
            lastLoginDate: new Date().toISOString().split('T')[0]
          });
        }
      },
      setLastSaveTime: (time) => set({ lastSaveTime: time }),
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

        // Daily Reset Check
        state.checkDailyReset();

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

          const actualHpGained = newHp - myMonster.stats.hp;
          const actualEnergyGained = newEnergy - myMonster.vitals.energy;

          set({
            myMonster: { ...myMonster, stats: { ...myMonster.stats, hp: newHp }, vitals: { ...myMonster.vitals, energy: newEnergy } },
            isSleeping: false,
            sleepTimestamp: null,
            sleepSummary: null
          });

          return { duration: secondsAsleep, hpGained: actualHpGained, energyGained: actualEnergyGained };
        }
        return null;
      },
      clearSleepSummary: () => set({ sleepSummary: null }),
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
           if (newPoopCount > 0) { if (newVitals.mood > 0) newVitals.mood -= 0.5; }
           if (Math.random() < 0.005) { newPoopCount = Math.min(5, newPoopCount + 1); }
        }
        set({ myMonster: { ...monster, stats: { ...monster.stats, hp: newHp }, vitals: newVitals, poopCount: newPoopCount } as Monster });
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

      resetSave: () => { localStorage.removeItem('spirit-bond-storage'); window.location.reload(); },
      addItem: (itemId, count) => {
        const item = ITEMS[itemId];
        if (!item) return;
        const inventory = [...get().inventory];
        const existingIndex = inventory.findIndex(i => i.item.id === itemId);
        if (existingIndex >= 0) inventory[existingIndex].count += count;
        else inventory.push({ item, count });
        set({ inventory });
      },
      buyItem: (itemId) => {
         const state = get();
         const item = ITEMS[itemId];
         if (!item || !item.price) return;

         // Check Currency: Equipment & Material now use Tokens
         const isTokenItem = item.type === 'equipment' || item.type === 'material';

         if (isTokenItem) {
            if (state.spiritTokens < item.price) return;
         } else {
            if (state.player.gold < item.price) return;
         }

         // Check Crafting Req
         if (item.craftReq) {
            for (const req of item.craftReq) {
               const invItem = state.inventory.find(i => i.item.id === req.itemId);
               if (!invItem || invItem.count < req.count) return;
            }
         }

         let newInventory = [...state.inventory];
         // Deduct Crafting Materials
         if (item.craftReq) {
            item.craftReq.forEach(req => {
               const idx = newInventory.findIndex(i => i.item.id === req.itemId);
               if (idx >= 0) {
                  newInventory[idx].count -= req.count;
                  if (newInventory[idx].count <= 0) {
                     newInventory.splice(idx, 1);
                  }
               }
            });
         }

         // Add Item
         const existingIndex = newInventory.findIndex(i => i.item.id === itemId);
         if (existingIndex >= 0) newInventory[existingIndex].count += 1;
         else newInventory.push({ item, count: 1 });

         // Atomic Update
         if (isTokenItem) {
             set({
                 spiritTokens: state.spiritTokens - item.price,
                 inventory: newInventory
             });
         } else {
             set({
                 player: { ...state.player, gold: state.player.gold - item.price },
                 inventory: newInventory
             });
         }
      },
      useItem: (itemId) => {
        const state = get();
        const inventory = [...state.inventory];
        const itemIndex = inventory.findIndex(i => i.item.id === itemId);
        const monster = state.myMonster;

        if (itemIndex >= 0 && inventory[itemIndex].count > 0 && monster) {
           const itemDef = inventory[itemIndex].item;

           // 🛡️ Guard Clause: ถ้าไม่ใช่ของกิน (Consumable) ให้หยุดทำงานทันที!
           if (itemDef.type !== 'consumable') return;

           if (itemDef.effect) {
             state.updateVitals({ hunger: itemDef.effect.hunger || 0, mood: itemDef.effect.mood || 0 });
             let healAmount = 0;
             if (itemDef.effect.hp) healAmount += itemDef.effect.hp;
             if (itemDef.effect.hpPercent) healAmount += Math.floor(monster.stats.maxHp * (itemDef.effect.hpPercent / 100));
             if (healAmount > 0) {
               const newHp = Math.min(monster.stats.maxHp, monster.stats.hp + healAmount);
               set(s => ({ myMonster: s.myMonster ? { ...s.myMonster, stats: { ...s.myMonster.stats, hp: newHp } } : null }));
             }
           }
           inventory[itemIndex].count -= 1;
           if (inventory[itemIndex].count <= 0) inventory.splice(itemIndex, 1);
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
         if (picked === 'hp') { gainedValue = 5; newStats.maxHp += gainedValue; newStats.hp += gainedValue; }
         else { newStats[picked] += gainedValue; }
         set(s => ({ myMonster: s.myMonster ? { ...s.myMonster, stats: newStats } : null }));
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

        // Remove equipment stats before recalculating
        const equippedItem = state.equippedItemId ? ITEMS[state.equippedItemId] : null;
        if (equippedItem && equippedItem.stats) {
           if (equippedItem.stats.atk) newStats.atk -= equippedItem.stats.atk;
           if (equippedItem.stats.def) newStats.def -= equippedItem.stats.def;
           if (equippedItem.stats.spd) newStats.spd -= equippedItem.stats.spd;
           if (equippedItem.stats.maxHp) newStats.maxHp -= equippedItem.stats.maxHp;
        }

        while (newExp >= newMaxExp) {
           newExp -= newMaxExp; newLevel += 1; newMaxExp = Math.floor(newMaxExp * 1.2);
           newStats = {
             hp: Math.floor(newStats.hp * 1.1), maxHp: Math.floor(newStats.maxHp * 1.1),
             atk: Math.floor(newStats.atk * 1.1), def: Math.floor(newStats.def * 1.1),
             spd: Math.floor(newStats.spd * 1.1), luk: Math.floor(newStats.luk * 1.1),
           };
        }

        // Re-apply equipment stats
        if (equippedItem && equippedItem.stats) {
           if (equippedItem.stats.atk) newStats.atk += equippedItem.stats.atk;
           if (equippedItem.stats.def) newStats.def += equippedItem.stats.def;
           if (equippedItem.stats.spd) newStats.spd += equippedItem.stats.spd;
           if (equippedItem.stats.maxHp) newStats.maxHp += equippedItem.stats.maxHp;
        }

        if (newLevel > monster.level) newStats.hp = newStats.maxHp;
        set({ player: newPlayer, myMonster: { ...monster, level: newLevel, exp: newExp, maxExp: newMaxExp, stats: newStats } });
      },
      craftItem: (itemId) => {
        console.log(`Crafting ${itemId} - Not implemented`);
      },
      evolveMonster: (targetSpeciesId, requiredItem) => {
        console.log(`Evolving to ${targetSpeciesId} with ${requiredItem} - Not implemented`);
      },

      // --- New Actions ---
      checkDailyReset: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        if (state.lastLoginDate !== today) {
           set({ raidTickets: 3, lastLoginDate: today, totalRaidDamage: 0 });
        }
      },
      recordRaidDamage: (damage) => {
        const state = get();
        const tokens = Math.floor(damage / 100);
        set({
            totalRaidDamage: state.totalRaidDamage + damage,
            spiritTokens: state.spiritTokens + tokens
        });
      },
      equipItem: (itemId) => {
        const state = get();
        const monster = state.myMonster;
        const item = ITEMS[itemId];
        if (!monster || !item || item.type !== 'equipment' || !item.stats) return;

        // Unequip first if needed
        if (state.equippedItemId) {
            state.unequipItem();
        }

        // Apply new stats
        const newStats = { ...monster.stats };
        if (item.stats.atk) newStats.atk += item.stats.atk;
        if (item.stats.def) newStats.def += item.stats.def;
        if (item.stats.spd) newStats.spd += item.stats.spd;
        if (item.stats.maxHp) newStats.maxHp += item.stats.maxHp;

        set({
            equippedItemId: itemId,
            myMonster: { ...monster, stats: newStats }
        });
      },
      unequipItem: () => {
        const state = get();
        const monster = state.myMonster;
        const currentId = state.equippedItemId;
        if (!monster || !currentId) return;

        const item = ITEMS[currentId];
        if (!item || !item.stats) return;

        // Remove stats
        const newStats = { ...monster.stats };
        if (item.stats.atk) newStats.atk = Math.max(1, newStats.atk - item.stats.atk);
        if (item.stats.def) newStats.def = Math.max(1, newStats.def - item.stats.def);
        if (item.stats.spd) newStats.spd = Math.max(1, newStats.spd - item.stats.spd);
        if (item.stats.maxHp) newStats.maxHp = Math.max(1, newStats.maxHp - item.stats.maxHp);

        // Ensure HP doesn't exceed new MaxHP
        if (newStats.hp > newStats.maxHp) newStats.hp = newStats.maxHp;

        set({
            equippedItemId: null,
            myMonster: { ...monster, stats: newStats }
        });
      }
    }),
    { name: 'spirit-bond-storage' }
  )
);
