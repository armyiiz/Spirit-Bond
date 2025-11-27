// src/hooks/useBattle.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { MONSTER_DB } from '../data/monsters';
import { ENEMIES } from '../data/enemies';
import { ROUTES } from '../data/routes';
import { Monster } from '../types';

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

  // ✅ ดึงแยกกัน เพื่อไม่ให้สร้าง Object ใหม่ทุก render
  const activeRouteId = useGameStore(state => state.activeRouteId);
  const explorationStep = useGameStore(state => state.explorationStep || 0);

  const [isActive, setIsActive] = useState(false);
  // ... (State อื่นๆ เหมือนเดิม)
  const [result, setResult] = useState<BattleResult>(null);
  const [enemy, setEnemy] = useState<Monster | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

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
    // ... (Logic เดิมข้างในปลอดภัยแล้ว) ...
    // Copy โค้ดเดิมมาใส่ตรงนี้ได้เลยครับ (ส่วนที่ random enemy)
    if (!myMonster) return;
    let randomBase: Monster | null = null;

    // Use passed routeId if available, otherwise fallback to store
    const currentRouteId = routeId || activeRouteId;

    // ... (Logic random enemy เดิม) ...
    // ย่อเพื่อความกระชับ แต่ให้คง logic เดิมไว้นะครับ
    if (currentRouteId) {
        const route = ROUTES.find(r => r.id === currentRouteId);
        if (route) {
            let enemyId: string | undefined;
            if (explorationStep >= 4 && route.bossId) {
                enemyId = route.bossId;
            } else {
                enemyId = route.enemies[Math.floor(Math.random() * route.enemies.length)];
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
        const possibleEnemies = MONSTER_DB.filter(m => m.stage === myMonster?.stage);
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
      minLevel = Math.max(1, (myMonster?.level || 1) - 1);
      maxLevel = Math.max(1, (myMonster?.level || 1) + 1);
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
    playerHpRef.current = myMonster?.stats.hp || 0;
    setPlayerHp(myMonster?.stats.hp || 0);
    playerGaugeRef.current = 0;
    setPlayerGauge(0);
    enemyHpRef.current = newEnemy.stats.maxHp;
    setEnemyHp(newEnemy.stats.maxHp);
    enemyGaugeRef.current = 0;
    setEnemyGauge(0);
    setLogs([]);
    setResult(null);
    setIsActive(true);

    const stepText = currentRouteId ? `(ด่าน ${explorationStep + 1}/5)` : '';
    addLog(`⚔️ พบศัตรู${stepText}: ${newEnemy.name} (Lv.${newEnemy.level})`, 'text-red-400');

  }, [myMonster, addLog, activeRouteId, explorationStep]); // Dependencies

  const endBattle = useCallback((finalResult: 'win' | 'lose' | 'fled') => {
     // ... (Logic เดิม) ...
     setIsActive(false);
     setResult(finalResult);
     if (finalResult === 'win' && enemy) {
          const gold = enemy.level * 10;
          const exp = enemy.level * 20;
          addLog(`🏆 ชนะ! ได้รับ ${gold}G, ${exp}EXP`, 'text-yellow-400');
          gainRewards(exp, gold, playerHpRef.current);
          updateVitals({ hunger: -2, energy: -5 });
     } else if (finalResult === 'lose') {
         addLog('💀 พ่ายแพ้... (HP เหลือ 1)', 'text-red-600');
         updateVitals({ mood: -20, energy: -10 });
         if (myMonster) {
             setMyMonster({ ...myMonster, stats: { ...myMonster.stats, hp: 1 } });
         }
     } else {
         addLog('💨 หนีสำเร็จ!', 'text-slate-400');
         updateVitals({ energy: -5 });
     }
  }, [enemy, gainRewards, updateVitals, myMonster, setMyMonster, addLog]);

  // useEffect สำหรับ Battle Loop (เหมือนเดิม)
  useEffect(() => {
    if (!isActive || !myMonster || !enemy) return;

    const interval = setInterval(() => {
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
  }, [isActive, myMonster, enemy, endBattle, addLog]);

  return {
    isActive, result, enemy, playerHp, enemyHp, logs, startBattle, fleeBattle: () => endBattle('fled'),
    resetBattle: () => { setIsActive(false); setResult(null); setEnemy(null); }
  };
};
