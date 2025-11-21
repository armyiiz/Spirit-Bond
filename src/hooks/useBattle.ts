import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { Monster, ElementType } from '../types';
import { MONSTER_DB } from '../data/monsters';

export interface LogEntry {
  id: number;
  text: string;
  color: string;
}

export type BattleResult = 'win' | 'lose' | 'fled' | null;

export const useBattle = () => {
  const { myMonster, updateVitals, gainRewards } = useGameStore();

  // Battle State
  const [isActive, setIsActive] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const [playerGauge, setPlayerGauge] = useState(0);
  const [enemyGauge, setEnemyGauge] = useState(0);
  const [playerHp, setPlayerHp] = useState(0);

  // Enemy State
  const [enemy, setEnemy] = useState<Monster | null>(null);
  const [enemyHp, setEnemyHp] = useState(0);

  const [result, setResult] = useState<BattleResult>(null);

  // Refs for interval management
  const battleInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const addLog = (text: string, color: string = 'text-slate-300') => {
    setLogs(prev => [...prev, { id: Date.now(), text, color }]);
  };

  const startBattle = () => {
    if (!myMonster) return;

    setIsActive(true);
    setResult(null);
    setLogs([]);
    setPlayerGauge(0);
    setEnemyGauge(0);
    setPlayerHp(myMonster.stats.hp);

    // 1. Pick Random Enemy from Pool
    const randomIndex = Math.floor(Math.random() * MONSTER_DB.length);
    const baseEnemy = MONSTER_DB[randomIndex];

    // 2. Determine Level (Player Level +/- 3, min 1)
    const levelDiff = Math.floor(Math.random() * 7) - 3; // -3 to +3
    const enemyLevel = Math.max(1, myMonster.level + levelDiff);

    // 3. Scale Stats
    // Formula: BaseStat * (1 + ((Level - 1) * 0.1))
    const scale = 1 + ((enemyLevel - 1) * 0.1);

    const scaledStats = {
      hp: Math.floor(baseEnemy.stats.hp * scale),
      maxHp: Math.floor(baseEnemy.stats.maxHp * scale),
      atk: Math.floor(baseEnemy.stats.atk * scale),
      def: Math.floor(baseEnemy.stats.def * scale),
      spd: Math.floor(baseEnemy.stats.spd * scale),
      luk: Math.floor(baseEnemy.stats.luk * scale),
    };

    const finalEnemy: Monster = {
      ...baseEnemy,
      level: enemyLevel,
      stats: scaledStats,
      // Vitals and exp don't matter much for enemy AI currently
    };

    setEnemy(finalEnemy);
    setEnemyHp(finalEnemy.stats.maxHp);

    addLog(`ศัตรูปรากฏตัว! ${finalEnemy.name} (Lv.${finalEnemy.level})`, 'text-red-400 font-bold');
  };

  const fleeBattle = () => {
    if (!isActive) return;
    stopBattle();
    setResult('fled');
    addLog('คุณหนีจากการต่อสู้!', 'text-slate-400');
    // Apply penalty for fleeing? Maybe slight mood/energy loss?
    // Keeping it simple for now as per request "Run Button allows player to escape".
  };

  const stopBattle = () => {
    setIsActive(false);
    if (battleInterval.current) {
      clearInterval(battleInterval.current);
      battleInterval.current = null;
    }
  };

  // Battle Loop
  useEffect(() => {
    if (!isActive || !myMonster || !enemy) return;

    const tickRate = 100; // 100ms per tick
    const gaugeMax = 100;

    battleInterval.current = setInterval(() => {
      // Check end conditions
      if (playerHp <= 0) {
        stopBattle();
        setResult('lose');
        addLog('พ่ายแพ้...', 'text-red-500 font-bold text-lg');
        updateVitals({ hunger: -10, energy: -10, mood: -10 });
        return;
      }

      if (enemyHp <= 0) {
        stopBattle();
        setResult('win');
        addLog('ชนะการต่อสู้!', 'text-yellow-400 font-bold text-lg');

        // Calculate Rewards
        const goldReward = enemy.level * 10;
        const expReward = enemy.level * 20;

        addLog(`ได้รับ: ${goldReward} Gold, ${expReward} EXP`, 'text-emerald-400');
        gainRewards(expReward, goldReward);
        updateVitals({ hunger: -5, energy: -5 });
        return;
      }

      // Increase Gauges based on SPD
      setPlayerGauge(prev => {
        const next = prev + (myMonster.stats.spd * 0.15);
        if (next >= gaugeMax) {
          // Player Attack
          const rawDmg = Math.max(1, myMonster.stats.atk - (enemy.stats.def * 0.5));
          const finalDmg = Math.floor(rawDmg);

          setEnemyHp(h => h - finalDmg);
          addLog(`${myMonster.name} โจมตี! (${finalDmg} dmg)`, 'text-emerald-400');
          return 0;
        }
        return next;
      });

      setEnemyGauge(prev => {
        const next = prev + (enemy.stats.spd * 0.15);
        if (next >= gaugeMax) {
          // Enemy Attack
          const rawDmg = Math.max(1, enemy.stats.atk - (myMonster.stats.def * 0.5));
          const finalDmg = Math.floor(rawDmg);

          setPlayerHp(h => h - finalDmg);
          addLog(`${enemy.name} โจมตีสวนกลับ! (${finalDmg} dmg)`, 'text-red-400');
          return 0;
        }
        return next;
      });

    }, tickRate);

    return () => {
      if (battleInterval.current) {
        clearInterval(battleInterval.current);
      }
    };
  }, [isActive, myMonster, enemy, playerHp, enemyHp, updateVitals, gainRewards]);

  return {
    isActive,
    result,
    logs,
    playerHp,
    enemyHp,
    playerGauge,
    enemyGauge,
    enemy,
    startBattle,
    fleeBattle
  };
};
