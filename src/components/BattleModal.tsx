import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { X } from 'lucide-react';
import { MONSTER_DB } from '../data/monsters';
import { Monster, ElementType } from '../types';

interface BattleModalProps {
  onClose: () => void;
}

interface LogEntry {
  id: number;
  text: string;
  color: string;
}

const BattleModal: React.FC<BattleModalProps> = ({ onClose }) => {
  const { myMonster, updateVitals, gainRewards } = useGameStore();
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Battle State
  const [playerGauge, setPlayerGauge] = useState(0);
  const [enemyGauge, setEnemyGauge] = useState(0);
  const [playerHp, setPlayerHp] = useState(myMonster ? myMonster.stats.hp : 100);

  // Enemy State
  const [enemy, setEnemy] = useState<Monster | null>(null);
  const [enemyHp, setEnemyHp] = useState(100);

  const [battleOver, setBattleOver] = useState(false);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);

  const logContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Enemy
  useEffect(() => {
    if (!myMonster || enemy) return;

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

    // Initial Log
    addLog(`ศัตรูปรากฏตัว! ${finalEnemy.name} (Lv.${finalEnemy.level})`, 'text-red-400 font-bold');
  }, [myMonster, enemy]);

  // Auto scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (text: string, color: string = 'text-slate-300') => {
    setLogs(prev => [...prev, { id: Date.now(), text, color }]);
  };

  // Battle Loop
  useEffect(() => {
    if (!myMonster || !enemy || battleOver) return;

    const tickRate = 100; // 100ms per tick
    const gaugeMax = 100;

    const interval = setInterval(() => {
      if (playerHp <= 0 || enemyHp <= 0) {
        setBattleOver(true);
        const isWin = playerHp > 0;
        setResult(isWin ? 'win' : 'lose');

        if (isWin) {
           addLog('ชนะการต่อสู้!', 'text-yellow-400 font-bold text-lg');

           // Calculate Rewards
           // Gold: EnemyLevel * 10
           // EXP: EnemyLevel * 20
           const goldReward = enemy.level * 10;
           const expReward = enemy.level * 20;

           addLog(`ได้รับ: ${goldReward} Gold, ${expReward} EXP`, 'text-emerald-400');

           // Apply Rewards & Sync
           gainRewards(expReward, goldReward);
           updateVitals({ hunger: -5, energy: -5 }); // Cost of battle
        } else {
           addLog('พ่ายแพ้...', 'text-red-500 font-bold text-lg');
           // Penalty? Just vitals for now
           updateVitals({ hunger: -10, energy: -10, mood: -10 });
        }

        clearInterval(interval);
        return;
      }

      // Increase Gauges based on SPD
      // Formula: SPD * 0.15 per tick (tuned for speed)
      setPlayerGauge(prev => {
        const next = prev + (myMonster.stats.spd * 0.15);
        if (next >= gaugeMax) {
          // Player Attack
          // Simple Dmg: Atk - Def (Min 1)
          const dmg = Math.max(1, Math.floor(myMonster.stats.atk * (100 / (100 + enemy.stats.def))));
          // Using a simpler formula usually: Atk - Def/2. Let's stick to user request implied simple mechanics or standard RPG
          // Standard: Damage = Atk - Def. If Def > Atk, deal 1.
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

    return () => clearInterval(interval);
  }, [myMonster, enemy, battleOver, enemyHp, playerHp, updateVitals, gainRewards]);

  // Background based on Enemy Element
  const getBgColor = (element: ElementType) => {
    switch (element) {
      case 'Pyro': return 'bg-red-900/50';
      case 'Aqua': return 'bg-blue-900/50';
      case 'Aero': return 'bg-slate-700/50';
      case 'Terra': return 'bg-green-900/50';
      default: return 'bg-slate-900';
    }
  };

  if (!myMonster) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
       <div className={`w-full max-w-md h-[80vh] flex flex-col rounded-2xl border border-slate-700 shadow-2xl overflow-hidden ${enemy ? getBgColor(enemy.element) : 'bg-slate-900'} transition-colors duration-500`}>

          {/* Header */}
          <div className="p-4 bg-slate-900/80 flex justify-between items-center border-b border-slate-700">
             <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
                <span className="text-2xl">⚔️</span> Battle
             </h2>
             <div className="flex items-center gap-2">
               {!battleOver && <span className="text-xs text-slate-400 animate-pulse">FIGHTING</span>}
               <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-full"><X size={20} /></button>
             </div>
          </div>

          {/* Battle Visuals */}
          {enemy && (
            <div className="flex-1 flex items-center justify-between px-8 relative">
               {/* Player (Left) */}
               <div className="flex flex-col items-center gap-2 z-10">
                  <div className="text-5xl animate-bounce" style={{ animationDuration: '2s' }}>{myMonster.appearance.emoji}</div>
                  <div className="text-xs font-bold text-white">{myMonster.name}</div>
                  {/* HP Bar */}
                  <div className="h-2 w-24 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
                     <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(playerHp / myMonster.stats.maxHp) * 100}%` }}></div>
                  </div>
                  {/* Gauge */}
                  <div className="h-1 w-24 bg-slate-800 rounded-full overflow-hidden mt-1">
                     <div className="h-full bg-yellow-400 transition-all duration-100" style={{ width: `${Math.min(100, playerGauge)}%` }}></div>
                  </div>
               </div>

               {/* VS Text */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <span className="text-8xl font-black italic">VS</span>
               </div>

               {/* Enemy (Right) */}
               <div className="flex flex-col items-center gap-2 z-10">
                  <div className="text-5xl animate-pulse">{enemy.appearance.emoji}</div>
                  <div className="text-xs font-bold text-red-300">{enemy.name} (Lv.{enemy.level})</div>
                  {/* HP Bar */}
                  <div className="h-2 w-24 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
                     <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${(enemyHp / enemy.stats.maxHp) * 100}%` }}></div>
                  </div>
                  {/* Gauge */}
                  <div className="h-1 w-24 bg-slate-800 rounded-full overflow-hidden mt-1">
                     <div className="h-full bg-yellow-400 transition-all duration-100" style={{ width: `${Math.min(100, enemyGauge)}%` }}></div>
                  </div>
               </div>
            </div>
          )}

          {/* Logs Panel */}
          <div className="h-1/3 bg-slate-900/90 border-t border-slate-700 flex flex-col">
            <div className="px-4 py-2 border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Combat Log
            </div>
            <div
              ref={logContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-xs"
            >
               {logs.map(log => (
                 <div key={log.id} className={`${log.color} break-words`}>
                   <span className="opacity-30 mr-2">[{new Date(log.id).toLocaleTimeString('th-TH', { minute: '2-digit', second: '2-digit' })}]</span>
                   {log.text}
                 </div>
               ))}
            </div>
          </div>

          {/* Action Button */}
          {battleOver && (
             <div className="p-4 bg-slate-900 border-t border-slate-800">
               <button
                 onClick={onClose}
                 className={`w-full py-3 rounded-xl font-bold text-lg shadow-lg transform transition active:scale-95 ${
                   result === 'win' ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-slate-700 text-white hover:bg-slate-600'
                 }`}
               >
                 {result === 'win' ? 'รับรางวัล & กลับ' : 'หนีกลับบ้าน'}
               </button>
             </div>
          )}
       </div>
    </div>
  );
};

export default BattleModal;
