import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { Monster, ElementType } from '../types';
import { MONSTER_DB } from '../data/monsters';

export interface LogEntry {
  id: number;
  text: string;
  color: string;
}

export interface BattleState {
  isActive: boolean;
  playerHp: number;
  playerMaxHp: number;
  playerGauge: number;
  enemy: Monster | null;
  enemyHp: number;
  enemyMaxHp: number;
  enemyGauge: number;
  logs: LogEntry[];
  result: 'win' | 'lose' | null;
}

export const useBattleSystem = () => {
  const { myMonster, updateVitals, gainRewards, addItem } = useGameStore();

  const [state, setState] = useState<BattleState>({
    isActive: false,
    playerHp: 0,
    playerMaxHp: 0,
    playerGauge: 0,
    enemy: null,
    enemyHp: 0,
    enemyMaxHp: 0,
    enemyGauge: 0,
    logs: [],
    result: null,
  });

  const battleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = useCallback((text: string, color: string = 'text-slate-300') => {
    setState(prev => ({
      ...prev,
      logs: [...prev.logs, { id: Date.now(), text, color }]
    }));
  }, []);

  const startBattle = useCallback(() => {
    if (!myMonster) return;

    // 1. Pick Random Enemy
    const randomIndex = Math.floor(Math.random() * MONSTER_DB.length);
    const baseEnemy = MONSTER_DB[randomIndex];

    // 2. Determine Level (Player Level +/- 3, min 1)
    const levelDiff = Math.floor(Math.random() * 7) - 3;
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
    };

    setState({
      isActive: true,
      playerHp: myMonster.stats.hp,
      playerMaxHp: myMonster.stats.maxHp,
      playerGauge: 0,
      enemy: finalEnemy,
      enemyHp: scaledStats.maxHp,
      enemyMaxHp: scaledStats.maxHp,
      enemyGauge: 0,
      logs: [{ id: Date.now(), text: `ศัตรูปรากฏตัว! ${finalEnemy.name} (Lv.${finalEnemy.level})`, color: 'text-red-400 font-bold' }],
      result: null,
    });
  }, [myMonster]);

  const surrender = useCallback(() => {
    if (!state.isActive) return;

    addLog('หนีจากการต่อสู้!', 'text-slate-400');
    setState(prev => ({ ...prev, isActive: false, result: 'lose' }));
    updateVitals({ mood: -5 });
  }, [state.isActive, addLog, updateVitals]);

  // Battle Loop
  useEffect(() => {
    if (!state.isActive || !state.enemy || !myMonster || state.result) {
      if (battleIntervalRef.current) {
        clearInterval(battleIntervalRef.current);
        battleIntervalRef.current = null;
      }
      return;
    }

    const tickRate = 100;
    const gaugeMax = 100;

    battleIntervalRef.current = setInterval(() => {
      setState(prev => {
        if (prev.playerHp <= 0 || prev.enemyHp <= 0) {
          // Battle End Logic is handled in the effect cleanup or next render,
          // but better to handle state transition here to avoid extra ticks
          const isWin = prev.playerHp > 0;
          return { ...prev, result: isWin ? 'win' : 'lose' };
        }

        let nextPlayerGauge = prev.playerGauge + (myMonster.stats.spd * 0.15);
        let nextEnemyGauge = prev.enemyGauge + (prev.enemy!.stats.spd * 0.15);
        let nextPlayerHp = prev.playerHp;
        let nextEnemyHp = prev.enemyHp;

        // Player Action
        if (nextPlayerGauge >= gaugeMax) {
          const rawDmg = Math.max(1, myMonster.stats.atk - (prev.enemy!.stats.def * 0.5));
          const finalDmg = Math.floor(rawDmg);
          nextEnemyHp -= finalDmg;
          nextPlayerGauge = 0;

          // We can't use addLog here directly because it's inside setState updater
          // So we append to logs in state
          // But wait, we need to side-effect logs.
          // Ideally logs are state.
        }

        // Enemy Action (only if alive)
        if (nextEnemyHp > 0 && nextEnemyGauge >= gaugeMax) {
           const rawDmg = Math.max(1, prev.enemy!.stats.atk - (myMonster.stats.def * 0.5));
           const finalDmg = Math.floor(rawDmg);
           nextPlayerHp -= finalDmg;
           nextEnemyGauge = 0;
        }

        return {
          ...prev,
          playerHp: nextPlayerHp,
          enemyHp: nextEnemyHp,
          playerGauge: nextPlayerGauge,
          enemyGauge: nextEnemyGauge
        };
      });
    }, tickRate);

    return () => {
      if (battleIntervalRef.current) {
        clearInterval(battleIntervalRef.current);
      }
    };
  }, [state.isActive, state.result, state.enemy, myMonster]);

  // Watch for Battle End to trigger side effects (Logs, Rewards)
  // We use a ref to prevent double triggering if re-renders happen
  const processedResultRef = useRef<string | null>(null);

  useEffect(() => {
    // Reset ref when battle starts
    if (state.isActive && !state.result) {
      processedResultRef.current = null;
    }

    if (state.result && processedResultRef.current !== state.result) {
      processedResultRef.current = state.result;
      const isWin = state.result === 'win';

      addLog(isWin ? 'ชนะการต่อสู้!' : 'พ่ายแพ้...', isWin ? 'text-yellow-400 font-bold text-lg' : 'text-red-500 font-bold text-lg');

      if (isWin && state.enemy) {
         const goldReward = state.enemy.level * 10;
         const expReward = state.enemy.level * 20;
         addLog(`ได้รับ: ${goldReward} Gold, ${expReward} EXP`, 'text-emerald-400');
         gainRewards(expReward, goldReward);
         addItem('food_meat', 1); // Drop logic
         updateVitals({ hunger: -5, energy: -5 });
      } else {
         updateVitals({ hunger: -10, energy: -10, mood: -10 });
      }

      // End battle state after a delay or immediately?
      // The user might want to see the logs.
      // We keep isActive true but result set, so UI knows battle is "over" but still showing stats.
      // We'll let the UI handle closing/resetting via "Done" button or similar,
      // OR we just set isActive to false eventually.
      // For now, we keep isActive=true so we can see the dead enemy/logs.
      // But `ActionConsole` needs to know to show "Back" or "Next".
    }
  }, [state.result, state.isActive, state.enemy, addLog, gainRewards, updateVitals, addItem]);

  // Separate effect to log damage (since we can't easily do it inside the state updater without complex logic)
  // Or we can change the state updater to push logs.
  // Let's refactor the loop slightly to handle logging more cleanly.

  useEffect(() => {
      if (!state.isActive || state.result || !state.enemy || !myMonster) return;

      const tickRate = 100;
      const gaugeMax = 100;

      const interval = setInterval(() => {
        setState(prev => {
            if (prev.result) return prev; // Already ended

            let { playerGauge, enemyGauge, playerHp, enemyHp, logs } = prev;
            const newLogs = [...logs];

            // Player Charge
            playerGauge += (myMonster.stats.spd * 0.15);

            // Player Attack
            if (playerGauge >= gaugeMax) {
                const rawDmg = Math.max(1, myMonster.stats.atk - (prev.enemy!.stats.def * 0.5));
                const finalDmg = Math.floor(rawDmg);
                enemyHp -= finalDmg;
                playerGauge = 0;
                newLogs.push({
                    id: Date.now(),
                    text: `${myMonster.name} โจมตี! (${finalDmg} dmg)`,
                    color: 'text-emerald-400'
                });
            }

            // Check Win
            if (enemyHp <= 0) {
                return { ...prev, playerHp, enemyHp, playerGauge, enemyGauge, logs: newLogs, result: 'win' };
            }

            // Enemy Charge
            enemyGauge += (prev.enemy!.stats.spd * 0.15);

            // Enemy Attack
            if (enemyGauge >= gaugeMax) {
                const rawDmg = Math.max(1, prev.enemy!.stats.atk - (myMonster.stats.def * 0.5));
                const finalDmg = Math.floor(rawDmg);
                playerHp -= finalDmg;
                enemyGauge = 0;
                 newLogs.push({
                    id: Date.now(),
                    text: `${prev.enemy!.name} โจมตีสวนกลับ! (${finalDmg} dmg)`,
                    color: 'text-red-400'
                });
            }

             // Check Lose
            if (playerHp <= 0) {
                 return { ...prev, playerHp, enemyHp, playerGauge, enemyGauge, logs: newLogs, result: 'lose' };
            }

            return { ...prev, playerHp, enemyHp, playerGauge, enemyGauge, logs: newLogs };
        });
      }, tickRate);

      return () => clearInterval(interval);
  }, [state.isActive, state.result]); // Removed dependencies that change every tick to avoid resetting interval

  const resetBattle = useCallback(() => {
      setState(prev => ({
          ...prev,
          isActive: false,
          result: null,
          enemy: null,
          logs: []
      }));
  }, []);

  return {
    battleState: state,
    startBattle,
    surrender,
    resetBattle,
    addLog // Exposed in case we want to add logs manually
  };
};
