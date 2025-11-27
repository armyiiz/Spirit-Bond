// src/hooks/useBattle.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { MONSTER_DB } from '../data/monsters';
import { ENEMIES } from '../data/enemies';
import { ROUTES } from '../data/routes';
import { Monster } from '../types';
import { ITEMS } from '../data/items';

// ... (Types เหมือนเดิม) ...
export type BattleState = 'idle' | 'fighting' | 'victory' | 'defeat';
export interface LogEntry { id: number; text: string; color: string; }
export type BattleResult = 'win' | 'lose' | 'fled' | null;

export const useBattle = () => {
  // ✅ 1. ใช้ Selector แบบเจาะจง (Atomic Selectors) เพื่อป้องกัน Re-render loop
  const myMonster = useGameStore(state => state.myMonster);
  const updateVitals = useGameStore(state => state.updateVitals);
  const gainRewards = useGameStore(state => state.gainRewards);
  const setMyMonster = useGameStore(state => state.setMyMonster);
  const addItem = useGameStore(state => state.addItem);
  const advanceExploration = useGameStore(state => state.advanceExploration);
  const resetExploration = useGameStore(state => state.resetExploration);

  // ✅ ดึงแยกกัน เพื่อไม่ให้สร้าง Object ใหม่ทุก render
  const activeRouteId = useGameStore(state => state.activeRouteId);
  const explorationStep = useGameStore(state => state.explorationStep || 0);

  const [isActive, setIsActive] = useState(false);
  // ... (State อื่นๆ เหมือนเดิม)
  const [result, setResult] = useState<BattleResult>(null);
  const [enemy, setEnemy] = useState<Monster | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false); // [NEW] Pause State

  const playerHpRef = useRef(0);
  const enemyHpRef = useRef(0);
  const playerGaugeRef = useRef(0);
  const enemyGaugeRef = useRef(0);

  const [playerHp, setPlayerHp] = useState(0);
  const [enemyHp, setEnemyHp] = useState(0);
  const [playerGauge, setPlayerGauge] = useState(0);
  const [enemyGauge, setEnemyGauge] = useState(0);

  const addLog = useCallback((text: string, color: string = 'text-slate-400') => {
    setLogs(prev => [...prev.slice(-4), { id: Date.now(), text, color }]);
  }, []);

  const startBattle = useCallback((routeId?: string) => {
    // ✅ Fetch fresh state directly to avoid stale closures
    const state = useGameStore.getState();
    const currentMonster = state.myMonster;
    const currentStep = state.explorationStep;

    // Use passed routeId if available, otherwise fallback to store
    const currentRouteId = routeId || state.activeRouteId;

    if (!currentMonster) return;
    let randomBase: Monster | null = null;

    if (currentRouteId) {
        const route = ROUTES.find(r => r.id === currentRouteId);
        if (route) {
            let enemyId: string | undefined;

            // ⚔️ Encounter Logic (Fixed Progression)
            if (currentStep < 3) {
                // Steps 0-2: Minions (Indices 0, 1, 2)
                const minions = route.enemies.slice(0, 3);
                if (minions.length > 0) {
                   enemyId = minions[Math.floor(Math.random() * minions.length)];
                }
            } else if (currentStep === 3) {
                // Step 3: Mini-Boss (Index 3)
                enemyId = route.enemies[3];
            } else if (currentStep >= 4) {
                // Step 4: Boss
                enemyId = route.bossId;
            }

            if (enemyId && ENEMIES[enemyId]) {
                 const enemyData = ENEMIES[enemyId];
                 // Fix crash prevention logic
                 randomBase = {
                    id: enemyData.id,
                    speciesId: 0,
                    name: enemyData.name,
                    element: enemyData.element,
                    stage: 1,
                    level: 1,
                    exp: 0,
                    maxExp: 100,
                    stats: { ...enemyData.stats },
                    vitals: { hunger: 100, mood: 100, energy: 100 },
                    appearance: { emoji: enemyData.emoji, color: 'bg-slate-800' },
                    poopCount: 0
                };
            }
        }
    }

    if (!randomBase) {
        const possibleEnemies = MONSTER_DB.filter(m => m.stage === currentMonster.stage);
        const enemyPool = possibleEnemies.length > 0 ? possibleEnemies : MONSTER_DB;
        randomBase = JSON.parse(JSON.stringify(enemyPool[Math.floor(Math.random() * enemyPool.length)]));
    }

    if (!randomBase) return;

    // Balancing Logic (Updated to use absolute level range)
    let minLevel = 1;
    let maxLevel = 1;

    if (currentRouteId && randomBase.id && ENEMIES[randomBase.id]) {
      // Use defined absolute range from enemy data
      [minLevel, maxLevel] = ENEMIES[randomBase.id].levelRange;
    } else {
      // Fallback for random encounters not in route (should rarely happen)
      minLevel = Math.max(1, (currentMonster.level || 1) - 1);
      maxLevel = Math.max(1, (currentMonster.level || 1) + 1);
    }

    const enemyLevel = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
    const scale = 1 + ((enemyLevel - 1) * 0.1);

    const newEnemy: Monster = {
      ...randomBase,
      level: enemyLevel,
      stats: {
        hp: Math.floor(randomBase.stats.hp * scale),
        maxHp: Math.floor(randomBase.stats.maxHp * scale),
        atk: Math.floor(randomBase.stats.atk * scale),
        def: Math.floor(randomBase.stats.def * scale),
        spd: Math.floor(randomBase.stats.spd * scale),
        luk: Math.floor(randomBase.stats.luk * scale),
      },
      vitals: randomBase.vitals || { hunger: 100, mood: 100, energy: 100 },
      poopCount: 0
    };

    setEnemy(newEnemy);
    playerHpRef.current = currentMonster.stats.hp || 0;
    setPlayerHp(currentMonster.stats.hp || 0);
    playerGaugeRef.current = 0;
    setPlayerGauge(0);
    enemyHpRef.current = newEnemy.stats.maxHp;
    setEnemyHp(newEnemy.stats.maxHp);
    enemyGaugeRef.current = 0;
    setEnemyGauge(0);
    setLogs([]);
    setResult(null);
    setIsActive(true);

    const stepText = currentRouteId ? `(ด่าน ${currentStep + 1}/5)` : '';
    addLog(`⚔️ พบศัตรู${stepText}: ${newEnemy.name} (Lv.${newEnemy.level})`, 'text-red-400');

  }, [addLog]); // Dependencies reduced to stable addLog

  const endBattle = useCallback((finalResult: 'win' | 'lose' | 'fled') => {
     // ... (Logic เดิม) ...
     setIsActive(false);
     setResult(finalResult);
     if (finalResult === 'win' && enemy) {
          const gold = enemy.level * 10;
          const exp = enemy.level * 20;

          // --- [FIX 1] Drop Item Logic ---
          const droppedItems: string[] = [];
          if (enemy.drops) {
            enemy.drops.forEach(drop => {
              // สุ่ม Drop ตามโอกาส (Chance)
              if (Math.random() <= drop.chance) {
                addItem(drop.itemId, 1);
                // หาชื่อไอเทมมาแสดงใน Log (Optional)
                const itemName = ITEMS[drop.itemId]?.name || drop.itemId;
                droppedItems.push(itemName);
              }
            });
          }

          // สร้าง Log รางวัล
          let rewardText = `🏆 ชนะ! ได้รับ ${gold}G, ${exp}EXP`;
          if (droppedItems.length > 0) {
            rewardText += ` และไอเทม: ${droppedItems.join(', ')}`;
          }
          addLog(rewardText, 'text-yellow-400');

          gainRewards(exp, gold, playerHpRef.current);
          updateVitals({ hunger: -2, energy: -5 });

          // --- [FIX 2 & 3] Progression Logic ---
          if (activeRouteId) {
             // เช็คว่าชนะบอส (Step 4) หรือยัง?
             if (explorationStep >= 4) {
                addLog('🎉 เคลียร์ดันเจี้ยนสำเร็จ! กลับสู่เมือง...', 'text-purple-400');
                // จบด่าน: รีเซ็ต Step และ Route
                resetExploration();
             } else {
                // ยังไม่จบบอส: ไปด่านถัดไป
                addLog('👣 มุ่งหน้าสู่พื้นที่ถัดไป...', 'text-blue-300');
                advanceExploration();
             }
          }

     } else if (finalResult === 'lose') {
         addLog('💀 พ่ายแพ้... ถูกส่งกลับเมืองเพื่อรักษาตัว', 'text-red-600');
         updateVitals({ mood: -20, energy: -10 });
         if (myMonster) {
             setMyMonster({ ...myMonster, stats: { ...myMonster.stats, hp: 1 } });
         }
         // แพ้แล้วต้องกลับบ้าน!
         resetExploration();
     } else {
         addLog('💨 หนีสำเร็จ!', 'text-slate-400');
         updateVitals({ energy: -5 });
     }
  }, [enemy, gainRewards, updateVitals, myMonster, setMyMonster, addLog, addItem, advanceExploration, resetExploration, activeRouteId, explorationStep]);

  // useEffect สำหรับ Battle Loop (เหมือนเดิม)
  useEffect(() => {
    if (!isActive || !myMonster || !enemy) return;

    const interval = setInterval(() => {
       if (isPaused) return; // [NEW] Pause Check

       // [NEW] Strict HP Checks (Race Condition Fix)
       if (playerHpRef.current <= 0) { endBattle('lose'); return; }
       if (enemyHpRef.current <= 0) { endBattle('win'); return; }

       // ... (Logic ตีกันเหมือนเดิม) ...
       playerGaugeRef.current += (myMonster.stats.spd * 0.1);
       if (playerGaugeRef.current >= 100) {
          playerGaugeRef.current = 0;
          const dmg = Math.max(1, Math.floor(myMonster.stats.atk - (enemy.stats.def * 0.5)));
          enemyHpRef.current -= dmg;
          setEnemyHp(enemyHpRef.current);
          addLog(`${myMonster.name} โจมตี! (-${dmg})`, 'text-emerald-400');
       }

       // Check enemy HP again before they attack
       if (enemyHpRef.current <= 0) return;

       enemyGaugeRef.current += (enemy.stats.spd * 0.1);
       if (enemyGaugeRef.current >= 100) {
          enemyGaugeRef.current = 0;
          const dmg = Math.max(1, Math.floor(enemy.stats.atk - (myMonster.stats.def * 0.5)));
          playerHpRef.current -= dmg;
          setPlayerHp(playerHpRef.current);
          addLog(`${enemy.name} สวนกลับ! (-${dmg})`, 'text-orange-400');
       }
       setPlayerGauge(playerGaugeRef.current);
       setEnemyGauge(enemyGaugeRef.current);
    }, 100);
    return () => clearInterval(interval);
  }, [isActive, myMonster, enemy, endBattle, addLog, isPaused]);

  return {
    isActive, result, enemy, playerHp, enemyHp, logs, startBattle,
    fleeBattle: () => endBattle('fled'),
    resetBattle: () => { setIsActive(false); setResult(null); setEnemy(null); },
    pauseBattle: () => setIsPaused(true),
    resumeBattle: () => setIsPaused(false),
    healPlayer: (amount: number) => {
        if (!myMonster) return;
        playerHpRef.current = Math.min(myMonster.stats.maxHp, playerHpRef.current + amount);
        setPlayerHp(playerHpRef.current);
        addLog(`❤️ ฟื้นฟู ${amount} HP`, 'text-pink-400');
    },
    isPaused
  };
};
