import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { Monster } from '../types';
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

  // Refs for logic (prevent re-creating interval)
  const battleInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const playerHpRef = useRef(0);
  const enemyHpRef = useRef(0);
  const playerGaugeRef = useRef(0);
  const enemyGaugeRef = useRef(0);

  const addLog = (text: string, color: string = 'text-slate-300') => {
    setLogs(prev => [...prev, { id: Date.now(), text, color }]);
  };

  const startBattle = () => {
    if (!myMonster) return;

    // Reset State
    setResult(null);
    setLogs([]);

    // 1. Pick Random Enemy from Pool
    const randomIndex = Math.floor(Math.random() * MONSTER_DB.length);
    const baseEnemy = MONSTER_DB[randomIndex];

    // 2. Determine Level (New Logic)
    const rand = Math.random();
    let levelDiff = 0;
    if (rand < 0.5) {
      levelDiff = 0; // 50% Equal
    } else if (rand < 0.8) {
      levelDiff = -1; // 30% Weaker
    } else {
      levelDiff = 1; // 20% Stronger
    }

    const enemyLevel = Math.max(1, myMonster.level + levelDiff);

    // 3. Scale Stats
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
      poopCount: 0 // Enemy doesn't poop in battle context usually, but needed for type
    };

    setEnemy(finalEnemy);

    // Initialize Refs
    playerHpRef.current = myMonster.stats.hp;
    enemyHpRef.current = finalEnemy.stats.maxHp;
    playerGaugeRef.current = 0;
    enemyGaugeRef.current = 0;

    // Sync State
    setPlayerHp(playerHpRef.current);
    setEnemyHp(enemyHpRef.current);
    setPlayerGauge(0);
    setEnemyGauge(0);

    addLog(`ศัตรูปรากฏตัว! ${finalEnemy.name} (Lv.${finalEnemy.level})`, 'text-red-400 font-bold');

    // Start Loop
    setIsActive(true);
  };

  const stopBattle = () => {
    setIsActive(false);
    if (battleInterval.current) {
      clearInterval(battleInterval.current);
      battleInterval.current = null;
    }
  };

  const fleeBattle = () => {
    if (!isActive) return;
    stopBattle();
    setResult('fled');
    addLog('คุณหนีจากการต่อสู้!', 'text-slate-400');
  };

  // Battle Loop
  useEffect(() => {
    if (!isActive || !myMonster || !enemy) return;

    const tickRate = 100; // 100ms per tick
    const gaugeMax = 100;

    battleInterval.current = setInterval(() => {
      let currentPlayerHp = playerHpRef.current;
      let currentEnemyHp = enemyHpRef.current;
      let currentPlayerGauge = playerGaugeRef.current;
      let currentEnemyGauge = enemyGaugeRef.current;

      // Check end conditions
      if (currentPlayerHp <= 0) {
        stopBattle();
        setResult('lose');
        addLog('พ่ายแพ้...', 'text-red-500 font-bold text-lg');
        updateVitals({ hunger: -10, energy: -10, mood: -10 });
        return;
      }

      if (currentEnemyHp <= 0) {
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

      // --- Logic ---

      // 1. Player Gauge Increase
      currentPlayerGauge += (myMonster.stats.spd * 0.15);
      if (currentPlayerGauge >= gaugeMax) {
        // Player Attack
        const rawDmg = Math.max(1, myMonster.stats.atk - (enemy.stats.def * 0.5));
        const finalDmg = Math.floor(rawDmg);

        currentEnemyHp -= finalDmg;
        addLog(`${myMonster.name} โจมตี! (${finalDmg} dmg)`, 'text-emerald-400');

        currentPlayerGauge = 0; // Reset Gauge
      }

      // 2. Enemy Gauge Increase
      currentEnemyGauge += (enemy.stats.spd * 0.15);
      if (currentEnemyGauge >= gaugeMax) {
        // Enemy Attack
        const rawDmg = Math.max(1, enemy.stats.atk - (myMonster.stats.def * 0.5));
        const finalDmg = Math.floor(rawDmg);

        currentPlayerHp -= finalDmg;
        addLog(`${enemy.name} โจมตีสวนกลับ! (${finalDmg} dmg)`, 'text-red-400');

        currentEnemyGauge = 0; // Reset Gauge
      }

      // Update Refs
      playerHpRef.current = currentPlayerHp;
      enemyHpRef.current = currentEnemyHp;
      playerGaugeRef.current = currentPlayerGauge;
      enemyGaugeRef.current = currentEnemyGauge;

      // Sync UI (React State)
      setPlayerHp(currentPlayerHp);
      setEnemyHp(currentEnemyHp);
      setPlayerGauge(currentPlayerGauge);
      setEnemyGauge(currentEnemyGauge);

    }, tickRate);

    return () => {
      if (battleInterval.current) {
        clearInterval(battleInterval.current);
      }
    };
  }, [isActive, myMonster, enemy, updateVitals, gainRewards]);

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
