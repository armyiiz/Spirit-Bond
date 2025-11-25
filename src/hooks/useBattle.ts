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

  const startBattle = useCallback(() => {
    if (!myMonster) return;

    const possibleEnemies = MONSTER_DB.filter(m => m.stage === myMonster.stage);
    const enemyPool = possibleEnemies.length > 0 ? possibleEnemies : MONSTER_DB;
    const randomBase = enemyPool[Math.floor(Math.random() * enemyPool.length)];

    // BALANCING UPDATE:
    // 35% Weak (-1), 60% Equal (0), 5% Strong (+1)
    const rand = Math.random();
    let levelDiff = 0;
    if (rand < 0.35) levelDiff = -1;
    else if (rand < 0.95) levelDiff = 0;
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
      vitals: { ...randomBase.vitals },
      poopCount: 0
    };

    setEnemy(newEnemy);

    playerHpRef.current = myMonster.stats.hp;
    setPlayerHp(myMonster.stats.hp);
    playerGaugeRef.current = 0;
    setPlayerGauge(0);

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
       if (enemy) {
          const gold = enemy.level * 10;
          const exp = enemy.level * 20;
          addLog(`🏆 ชนะ! ได้รับ ${gold}G, ${exp}EXP`, 'text-yellow-400');
          gainRewards(exp, gold, playerHpRef.current);
          updateVitals({ hunger: -2, energy: -5 });
       }
    } else if (finalResult === 'lose') {
       addLog('💀 พ่ายแพ้... (HP เหลือ 1)', 'text-red-600');
       updateVitals({ mood: -20, energy: -10 });
       if (myMonster) {
          setMyMonster({
             ...myMonster,
             stats: { ...myMonster.stats, hp: 1 }
          });
       }
    } else {
        addLog('💨 หนีสำเร็จ!', 'text-slate-400');
        updateVitals({ energy: -5 });
    }
  }, [enemy, gainRewards, updateVitals, myMonster, setMyMonster, addLog]);

  useEffect(() => {
    if (!isActive || !myMonster || !enemy) return;

    const interval = setInterval(() => {
       if (playerHpRef.current <= 0) {
         endBattle('lose');
         return;
       }
       if (enemyHpRef.current <= 0) {
         endBattle('win');
         return;
       }

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
