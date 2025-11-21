import React from 'react';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Monster } from '../types';

interface MonsterStageProps {
  background: string;       // Required for location themes
  onShowStatus: () => void; // Trigger for the status popup
  enemy?: Monster | null;   // For rendering Sprite & Name
  enemyHp?: number;         // For the HP Bar (Current)
  enemyMaxHp?: number;      // For the HP Bar (Max/Percentage)
}

const MonsterStage: React.FC<MonsterStageProps> = ({ background, onShowStatus, enemy, enemyHp, enemyMaxHp }) => {
  const monster = useGameStore(state => state.myMonster);

  if (!monster) return null;

  const { stats, appearance, name } = monster;

  return (
    <div className={`flex-1 relative flex flex-col items-center justify-center w-full overflow-hidden ${background}`}>

      {/* Background Overlay (Optional tint) */}
      <div className={`absolute inset-0 opacity-10 pointer-events-none ${appearance.color}`}></div>

      {/* Stage Container */}
      <div className="relative w-full max-w-md h-full flex items-center justify-between px-6">

         {/* --- Player Monster (Left) --- */}
         <div className={`flex flex-col items-center z-10 transition-all duration-500 ${enemy ? 'translate-x-0 scale-90' : 'translate-x-[25%] scale-100'}`}>
            {/* HP Bar Floating */}
            <div className="mb-2 w-32 bg-slate-800/80 backdrop-blur rounded-full border border-slate-600 p-1 relative shadow-lg">
               <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(stats.hp / stats.maxHp) * 100}%` }}></div>
               </div>
               <div className="absolute -top-5 left-0 w-full text-center text-[10px] font-bold text-white drop-shadow-md">
                  HP {Math.max(0, stats.hp)}/{stats.maxHp}
               </div>
            </div>

            {/* Sprite */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-[8rem] drop-shadow-2xl filter"
            >
              {appearance.emoji}
            </motion.div>

            {/* Name (Only if not battling to reduce clutter? Or keep small? User said "REMOVE the floating Name/Element text overlay immediately." so we assume completely removed from stage) */}
         </div>

         {/* --- VS Divider --- */}
         {enemy && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <span className="text-6xl font-black text-white/10 italic">VS</span>
            </div>
         )}

         {/* --- Enemy Monster (Right) --- */}
         {enemy && (
            <div className="flex flex-col items-center z-10 animate-in slide-in-from-right-10 duration-500">
               {/* HP Bar Floating */}
               <div className="mb-2 w-32 bg-slate-800/80 backdrop-blur rounded-full border border-slate-600 p-1 relative shadow-lg">
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 transition-all duration-300"
                        style={{ width: `${enemyMaxHp && enemyHp !== undefined ? (enemyHp / enemyMaxHp) * 100 : 100}%` }}
                      ></div>
                   </div>
                   <div className="absolute -top-5 left-0 w-full text-center text-[10px] font-bold text-red-200 drop-shadow-md">
                      HP {enemyHp !== undefined ? Math.max(0, enemyHp) : '???'}/{enemyMaxHp || '???'}
                   </div>
               </div>

               {/* Sprite */}
               <div className="text-[8rem] drop-shadow-2xl filter transform -scale-x-100">
                  {enemy.appearance.emoji}
               </div>
            </div>
         )}
      </div>

      {/* Info Button (Top Right) */}
      <button
        data-testid="status-btn"
        onClick={onShowStatus}
        className="absolute top-4 right-4 z-20 w-10 h-10 bg-slate-800/80 backdrop-blur border border-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white shadow-lg transition-all"
      >
        <Search size={20} />
      </button>

    </div>
  );
};

export default MonsterStage;
