// src/hooks/useBattle.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { MONSTER_DB } from '../data/monsters';
import { ENEMIES } from '../data/enemies';
import { RAID_BOSSES } from '../data/raid_bosses';
import { ROUTES } from '../data/routes';
import { Monster, ElementType } from '../types';
import { ITEMS } from '../data/items';

export type BattleState = 'idle' | 'fighting' | 'victory' | 'defeat';
export interface LogEntry { id: number; text: string; color: string; }
export type BattleResult = 'win' | 'lose' | 'fled' | null;

export const useBattle = () => {
  const myMonster = useGameStore(state => state.myMonster);
  const updateVitals = useGameStore(state => state.updateVitals);
  const gainRewards = useGameStore(state => state.gainRewards);
  const setMyMonster = useGameStore(state => state.setMyMonster);
  const addItem = useGameStore(state => state.addItem);
  const advanceExploration = useGameStore(state => state.advanceExploration);
  const resetExploration = useGameStore(state => state.resetExploration);
  const recordRaidDamage = useGameStore(state => state.recordRaidDamage);

  const activeRouteId = useGameStore(state => state.activeRouteId);
  const explorationStep = useGameStore(state => state.explorationStep || 0);

  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState<BattleResult>(null);
  const [enemy, setEnemy] = useState<Monster | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  // New Raid State
  const [isRaid, setIsRaid] = useState(false);
  const turnCountRef = useRef(0);
  const totalDamageRef = useRef(0);

  const logIdCounter = useRef(0);
  const playerHpRef = useRef(0);
  const enemyHpRef = useRef(0);
  const playerGaugeRef = useRef(0);
  const enemyGaugeRef = useRef(0);

  const [playerHp, setPlayerHp] = useState(0);
  const [enemyHp, setEnemyHp] = useState(0);
  const [playerGauge, setPlayerGauge] = useState(0);
  const [enemyGauge, setEnemyGauge] = useState(0);

  const getElementalMultiplier = (attacker: ElementType, defender: ElementType): number => {
    if (attacker === 'Terra' && defender === 'Aero') return 1.5;
    if (attacker === 'Aero' && defender === 'Aqua') return 1.5;
    if (attacker === 'Aqua' && defender === 'Pyro') return 1.5;
    if (attacker === 'Pyro' && defender === 'Terra') return 1.5;

    if (attacker === 'Terra' && defender === 'Pyro') return 0.5;
    if (attacker === 'Aero' && defender === 'Terra') return 0.5;
    if (attacker === 'Aqua' && defender === 'Aero') return 0.5;
    if (attacker === 'Pyro' && defender === 'Aqua') return 0.5;

    return 1.0;
  };

  const addLog = useCallback((text: string, color: string = 'text-slate-400') => {
    const newId = Date.now() + logIdCounter.current++;
    setLogs(prev => [...prev.slice(-4), { id: newId, text, color }]);
  }, []);

  const startBattle = useCallback((routeId?: string, raidBossId?: string) => {
    const state = useGameStore.getState();
    const currentMonster = state.myMonster;
    const currentStep = state.explorationStep;
    const currentRouteId = routeId || state.activeRouteId;

    if (!currentMonster) return;
    let randomBase: Monster | null = null;
    let isRaidBattle = false;

    // 1. Raid Battle Logic
    if (raidBossId && RAID_BOSSES[raidBossId]) {
        const bossData = RAID_BOSSES[raidBossId];
        randomBase = {
            id: bossData.id,
            speciesId: 0,
            name: bossData.name,
            element: bossData.element,
            stage: 4, // Boss Stage
            level: 99,
            exp: 0,
            maxExp: 100,
            stats: { ...bossData.stats },
            vitals: { hunger: 100, mood: 100, energy: 100 },
            appearance: { emoji: bossData.emoji, color: 'bg-red-950' },
            poopCount: 0
        };
        isRaidBattle = true;
    }
    // 2. Adventure/Route Logic
    else if (currentRouteId) {
        const route = ROUTES.find(r => r.id === currentRouteId);
        if (route) {
            let enemyId: string | undefined;
            if (currentStep < 3) {
                const minions = route.enemies.slice(0, 3);
                if (minions.length > 0) enemyId = minions[Math.floor(Math.random() * minions.length)];
            } else if (currentStep === 3) {
                enemyId = route.enemies[3];
            } else if (currentStep >= 4) {
                enemyId = route.bossId;
            }

            if (enemyId && ENEMIES[enemyId]) {
                 const enemyData = ENEMIES[enemyId];
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

    // 3. Fallback / Arena Logic
    if (!randomBase) {
        const possibleEnemies = MONSTER_DB.filter(m => m.stage === currentMonster.stage);
        const enemyPool = possibleEnemies.length > 0 ? possibleEnemies : MONSTER_DB;
        randomBase = JSON.parse(JSON.stringify(enemyPool[Math.floor(Math.random() * enemyPool.length)]));
    }

    if (!randomBase) return;

    // Balancing Logic
    let minLevel = 1;
    let maxLevel = 1;

    if (isRaidBattle) {
        minLevel = 99; maxLevel = 99;
    } else if (currentRouteId && randomBase.id && ENEMIES[randomBase.id]) {
      [minLevel, maxLevel] = ENEMIES[randomBase.id].levelRange;
    } else {
      minLevel = Math.max(1, (currentMonster.level || 1) - 1);
      maxLevel = Math.max(1, (currentMonster.level || 1) + 1);
    }

    const enemyLevel = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
    const scale = isRaidBattle ? 1 : (1 + ((enemyLevel - 1) * 0.1));

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
      poopCount: 0,
      drops: randomBase.drops
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

    // Reset Battle State
    setLogs([]);
    setResult(null);
    setIsActive(true);
    setIsRaid(isRaidBattle);
    turnCountRef.current = 0;
    totalDamageRef.current = 0;

    const stepText = (currentRouteId && !isRaidBattle) ? `(ด่าน ${currentStep + 1}/5)` : '';
    const raidText = isRaidBattle ? '👹 RAID BOSS APPEARED!' : '⚔️ พบศัตรู';
    addLog(`${raidText}${stepText}: ${newEnemy.name} (Lv.${newEnemy.level})`, isRaidBattle ? 'text-purple-400 font-bold' : 'text-red-400');

  }, [addLog]);

  const endBattle = useCallback((finalResult: 'win' | 'lose' | 'fled') => {
     setIsActive(false);
     setResult(finalResult);

     if (isRaid) {
         // --- RAID END LOGIC ---
         const dmg = totalDamageRef.current;
         recordRaidDamage(dmg);

         if (finalResult === 'lose') { // Player died
             addLog(`💀 พ่ายแพ้... (Damage: ${dmg})`, 'text-red-500');
             updateVitals({ energy: -10 });
             if (myMonster) setMyMonster({ ...myMonster, stats: { ...myMonster.stats, hp: 1 } });
         } else if (finalResult === 'win') { // Boss died (Unlikely)
             addLog(`🏆 ปาฏิหาริย์! คุณชนะบอส! (Damage: ${dmg})`, 'text-yellow-400 font-bold');
         } else { // Fled or Time Out (Treated as 'win' contextually for rewards?)
             // Fled/Timeout -> Just record damage
             addLog(`⏱️ จบการต่อสู้! (Damage: ${dmg})`, 'text-blue-300');
         }

         const tokens = Math.floor(dmg / 100);
         addLog(`💎 ได้รับ ${tokens} Spirit Tokens`, 'text-purple-300');
         addLog(`(นำไปแลกอุปกรณ์สวมใส่ได้ที่ Shop!)`, 'text-slate-500 text-[10px]');

     } else {
         // --- NORMAL BATTLE END LOGIC ---
         if (finalResult === 'win' && enemy) {
              const gold = enemy.level * 10;
              const exp = enemy.level * 20;

              const droppedItems: string[] = [];
              if (enemy.drops) {
                enemy.drops.forEach(drop => {
                  if (Math.random() <= drop.chance) {
                    addItem(drop.itemId, 1);
                    const itemName = ITEMS[drop.itemId]?.name || drop.itemId;
                    droppedItems.push(itemName);
                  }
                });
              }

              let rewardText = `🏆 ชนะ! ได้รับ ${gold}G, ${exp}EXP`;
              if (droppedItems.length > 0) {
                rewardText += ` และไอเทม: ${droppedItems.join(', ')}`;
              }
              addLog(rewardText, 'text-yellow-400');

              gainRewards(exp, gold, playerHpRef.current);
              updateVitals({ hunger: -2, energy: -5 });

              if (activeRouteId) {
                 if (explorationStep >= 4) {
                    addLog('🎉 เคลียร์ดันเจี้ยนสำเร็จ! กลับสู่เมือง...', 'text-purple-400');
                    resetExploration();
                 } else {
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
             resetExploration();
         } else {
             addLog('💨 หนีสำเร็จ!', 'text-slate-400');
             updateVitals({ energy: -5 });
         }
     }
  }, [enemy, isRaid, gainRewards, updateVitals, myMonster, setMyMonster, addLog, addItem, advanceExploration, resetExploration, activeRouteId, explorationStep, recordRaidDamage]);

  useEffect(() => {
    if (!isActive || !myMonster || !enemy) return;

    const interval = setInterval(() => {
       if (isPaused) return;

       if (playerHpRef.current <= 0) { endBattle('lose'); return; }
       if (enemyHpRef.current <= 0) { endBattle('win'); return; }

       // RAID Turn Limit Check
       if (isRaid && turnCountRef.current >= 10) {
           endBattle('fled'); // Treat timeout as 'fled'/'end'
           return;
       }

       // Player Turn
       playerGaugeRef.current += (myMonster.stats.spd * 0.1);
       if (playerGaugeRef.current >= 100) {
          playerGaugeRef.current = 0;

          if (isRaid) turnCountRef.current += 1; // Count turns only on player action? Or Global? Let's do player action = 1 turn.

          const multiplier = getElementalMultiplier(myMonster.element, enemy.element);
          const rawDmg = Math.max(1, myMonster.stats.atk - (enemy.stats.def * 0.5));
          const dmg = Math.floor(rawDmg * multiplier);
          enemyHpRef.current -= dmg;
          setEnemyHp(enemyHpRef.current);

          const typeText = multiplier > 1 ? ' (ชนะธาตุ!)' : (multiplier < 1 ? ' (แพ้ธาตุ...)' : '');

          if (isRaid) {
              totalDamageRef.current += dmg;
              addLog(`Turn ${turnCountRef.current}/10: โจมตี! (-${dmg})${typeText}`, 'text-emerald-400');
          } else {
              addLog(`${myMonster.name} โจมตี! (-${dmg})${typeText}`, 'text-emerald-400');
          }
       }

       if (enemyHpRef.current <= 0) return;

       // Enemy Turn
       enemyGaugeRef.current += (enemy.stats.spd * 0.1);
       if (enemyGaugeRef.current >= 100) {
          enemyGaugeRef.current = 0;

          const multiplier = getElementalMultiplier(enemy.element, myMonster.element);
          const rawDmg = Math.max(1, enemy.stats.atk - (myMonster.stats.def * 0.5));
          const dmg = Math.floor(rawDmg * multiplier);

          playerHpRef.current -= dmg;
          setPlayerHp(playerHpRef.current);

          const typeText = multiplier > 1 ? ' (แรงมาก!)' : (multiplier < 1 ? ' (เบาหวิว)' : '');
          addLog(`${enemy.name} สวนกลับ! (-${dmg})${typeText}`, 'text-orange-400');
       }
       setPlayerGauge(playerGaugeRef.current);
       setEnemyGauge(enemyGaugeRef.current);
    }, 100);
    return () => clearInterval(interval);
  }, [isActive, myMonster, enemy, endBattle, addLog, isPaused, isRaid]);

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
