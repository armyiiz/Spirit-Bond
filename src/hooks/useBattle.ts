import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { MONSTER_DB } from '../data/monsters';
import { Monster } from '../types';

export type BattleState = 'idle' | 'fighting' | 'victory' | 'defeat';
export interface LogEntry { id: number; text: string; color: string; }
export type BattleResult = 'win' | 'lose' | 'fled' | null;

export const useBattle = () => {
  const { myMonster, updateVitals, gainRewards, setMyMonster } = useGameStore();

  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState<BattleResult>(null);
  const [enemy, setEnemy] = useState<Monster | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Use Refs for Logic Loop
  const playerHpRef = useRef(0);
  const enemyHpRef = useRef(0);
  const playerGaugeRef = useRef(0);
  const enemyGaugeRef = useRef(0);

  // UI State (Sync with Refs for display)
  const [playerHp, setPlayerHp] = useState(0);
  const [enemyHp, setEnemyHp] = useState(0);
  const [playerGauge, setPlayerGauge] = useState(0); // Added for UI
  const [enemyGauge, setEnemyGauge] = useState(0); // Added for UI

  const addLog = useCallback((text: string, color: string = 'text-slate-400') => {
    setLogs(prev => [...prev.slice(-4), { id: Date.now(), text, color }]);
  }, []);

  const startBattle = useCallback(() => {
    if (!myMonster) return;

    // 1. Logic: Filter ศัตรูเฉพาะ Stage เดียวกัน (User Request #4)
    const possibleEnemies = MONSTER_DB.filter(m => m.stage === myMonster.stage);
    // Fallback ถ้าไม่เจอ (กันเหนียว) ใช้ DB ทั้งหมด
    const enemyPool = possibleEnemies.length > 0 ? possibleEnemies : MONSTER_DB;

    const randomBase = enemyPool[Math.floor(Math.random() * enemyPool.length)];

    // 2. Level Logic (User Request: เท่ากัน 50%, -1 30%, +1 20%)
    const rand = Math.random();
    let levelDiff = 0;
    if (rand < 0.5) levelDiff = 0;
    else if (rand < 0.8) levelDiff = -1;
    else levelDiff = 1;

    const enemyLevel = Math.max(1, myMonster.level + levelDiff);

    // Scale Stats
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
      vitals: { ...randomBase.vitals }, // Important fix for structure
      poopCount: 0
    };

    // Setup Battle
    setEnemy(newEnemy);

    // Player setup
    playerHpRef.current = myMonster.stats.hp; // ใช้ HP ปัจจุบัน (ไม่เต็มก็สู้ต่อได้)
    setPlayerHp(myMonster.stats.hp);
    playerGaugeRef.current = 0;
    setPlayerGauge(0);

    // Enemy setup
    enemyHpRef.current = newEnemy.stats.maxHp;
    setEnemyHp(newEnemy.stats.maxHp);
    enemyGaugeRef.current = 0;
    setEnemyGauge(0);

    setLogs([]);
    setResult(null);
    setIsActive(true);

    addLog(`⚔️ พบศัตรู: ${newEnemy.name} (Lv.${newEnemy.level})`, 'text-red-400');
  }, [myMonster, addLog]);

  const endBattle = useCallback((finalResult: 'win' | 'lose' | 'fled') => {
    setIsActive(false);
    setResult(finalResult);

    if (finalResult === 'win') {
       // Win Logic
       if (enemy) {
          const gold = enemy.level * 10;
          const exp = enemy.level * 20;
          addLog(`🏆 ชนะ! ได้รับ ${gold}G, ${exp}EXP`, 'text-yellow-400');
          gainRewards(exp, gold);
          updateVitals({ hunger: -2, energy: -5 });

          // Update Real HP back to store
          if (myMonster) {
             setMyMonster({
                ...myMonster,
                stats: { ...myMonster.stats, hp: playerHpRef.current }
             });
          }
       }
    } else if (finalResult === 'lose') {
       // Lose Logic
       addLog('💀 พ่ายแพ้... (HP เหลือ 1)', 'text-red-600');
       updateVitals({ mood: -20, energy: -10 });
       // Fix #1: ไม่ฮีลเต็มแล้ว! ให้เหลือ 1 HP พอให้เดินกลับบ้าน
       if (myMonster) {
          setMyMonster({
             ...myMonster,
             stats: { ...myMonster.stats, hp: 1 }
          });
       }
    } else {
        // Fled
        addLog('💨 หนีสำเร็จ!', 'text-slate-400');
        updateVitals({ energy: -5 }); // Cost for fleeing
    }
  }, [enemy, gainRewards, updateVitals, myMonster, setMyMonster, addLog]);

  // Battle Loop
  useEffect(() => {
    if (!isActive || !myMonster || !enemy) return;

    const interval = setInterval(() => {
       // Check End
       if (playerHpRef.current <= 0) {
         endBattle('lose');
         return;
       }
       if (enemyHpRef.current <= 0) {
         endBattle('win');
         return;
       }

       // Logic Tick
       // Player Gauge
       playerGaugeRef.current += (myMonster.stats.spd * 0.1);
       if (playerGaugeRef.current >= 100) {
          playerGaugeRef.current = 0;
          // Attack
          const dmg = Math.max(1, Math.floor(myMonster.stats.atk - (enemy.stats.def * 0.5)));
          enemyHpRef.current -= dmg;
          setEnemyHp(enemyHpRef.current); // Update UI
          addLog(`${myMonster.name} โจมตี! (-${dmg})`, 'text-emerald-400');
       }

       // Enemy Gauge
       enemyGaugeRef.current += (enemy.stats.spd * 0.1);
       if (enemyGaugeRef.current >= 100) {
          enemyGaugeRef.current = 0;
          // Enemy Attack
          const dmg = Math.max(1, Math.floor(enemy.stats.atk - (myMonster.stats.def * 0.5)));
          playerHpRef.current -= dmg;
          setPlayerHp(playerHpRef.current); // Update UI
          addLog(`${enemy.name} สวนกลับ! (-${dmg})`, 'text-orange-400');
       }

       // Sync Gauges to UI (optional, for smoother bars might want requestAnimationFrame but this is fine)
       setPlayerGauge(playerGaugeRef.current);
       setEnemyGauge(enemyGaugeRef.current);

    }, 100);

    return () => clearInterval(interval);
  }, [isActive, myMonster, enemy, endBattle, addLog]);

  return {
    isActive,
    result,
    enemy,
    playerHp,
    enemyHp,
    logs,
    startBattle,
    fleeBattle: () => endBattle('fled'),
    resetBattle: () => {
      setIsActive(false);
      setResult(null);
      setEnemy(null);
    }
  };
};
