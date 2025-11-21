import React from 'react';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { Search, Zap } from 'lucide-react';
import { BattleState } from '../hooks/useBattleSystem';
import { Monster } from '../types';

interface MonsterStageProps {
  background: string;
  battleState: BattleState;
  onShowStatus: () => void;
}

const MonsterStage: React.FC<MonsterStageProps> = ({ background, battleState, onShowStatus }) => {
  const monster = useGameStore(state => state.myMonster);

  if (!monster) return null;

  const { stats, appearance, level } = monster;

  const currentHp = battleState.isActive ? battleState.playerHp : stats.hp;
  const maxHp = battleState.isActive ? battleState.playerMaxHp : stats.maxHp;

  return (
    <div className={`flex-1 relative overflow-hidden transition-colors duration-1000 ${background}`}>
       {/* Background Overlay for Depth */}
       <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 pointer-events-none"></div>

       {/* Stage Area */}
       <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="w-full max-w-md flex justify-between items-end pb-20 relative h-full">

             {/* Player Monster (Left) */}
             <div className="flex flex-col items-center z-10 relative w-1/2">
                {/* Damage Numbers / Effects could go here */}
                <motion.div
                   animate={{
                      y: [0, -8, 0],
                      scale: battleState.isActive ? [1, 1.05, 1] : 1
                   }}
                   transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                   className="text-[7rem] sm:text-[9rem] drop-shadow-2xl filter"
                   style={{ transform: 'scaleX(-1)' }} // Face right
                >
                  {appearance.emoji}
                </motion.div>
                {/* Shadow */}
                <div className="w-20 h-4 bg-black/30 rounded-[100%] blur-sm mt-[-10px]"></div>
             </div>

             {/* Enemy Monster (Right) - Only visible in battle */}
             {battleState.isActive && battleState.enemy && (
               <div className="flex flex-col items-center z-10 relative w-1/2">
                  <motion.div
                     initial={{ opacity: 0, x: 50 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 50 }}
                     className="text-[7rem] sm:text-[9rem] drop-shadow-2xl grayscale-[0.2]"
                  >
                    {battleState.enemy.appearance.emoji}
                  </motion.div>
                  {/* Enemy HP Bar (Mini) */}
                  <div className="w-20 h-2 bg-slate-800 rounded-full mt-[-10px] border border-slate-600 overflow-hidden relative z-20">
                     <div
                       className="h-full bg-red-500 transition-all duration-200"
                       style={{ width: `${(battleState.enemyHp / battleState.enemyMaxHp) * 100}%` }}
                     ></div>
                  </div>
                  <div className="w-20 h-4 bg-black/30 rounded-[100%] blur-sm mt-1"></div>
               </div>
             )}
          </div>
       </div>

       {/* HUD Overlay (Top Left - Player HP) */}
       <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex-1 max-w-[180px]">
             <div className="flex justify-between text-xs font-bold text-white drop-shadow-md mb-1 px-1">
               <span>Lv.{level} {monster.name}</span>
               <span>{Math.max(0, currentHp)}/{maxHp}</span>
             </div>
             <div className="h-4 bg-slate-900/60 backdrop-blur-sm rounded-full border border-slate-500 overflow-hidden relative">
                <div
                   className="h-full bg-emerald-500 transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                   style={{ width: `${(Math.max(0, currentHp) / maxHp) * 100}%` }}
                ></div>
                {/* Gauge Bar (Yellow) - Only in battle */}
                {battleState.isActive && (
                   <div className="absolute bottom-0 left-0 h-1 bg-yellow-400 transition-all duration-100" style={{ width: `${Math.min(100, battleState.playerGauge)}%` }}></div>
                )}
             </div>
          </div>

          <button
            onClick={onShowStatus}
            className="ml-2 p-2 bg-slate-900/60 backdrop-blur-sm border border-slate-500 rounded-full text-white hover:bg-white hover:text-black transition-colors shadow-lg"
          >
            <Search size={16} />
          </button>
       </div>
    </div>
  );
};

export default MonsterStage;
