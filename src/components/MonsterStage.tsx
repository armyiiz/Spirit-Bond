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
  playerHp?: number;        // Real-time Player HP
  playerMaxHp?: number;     // Real-time Player MaxHP (usually static but good to have prop)
}

const MonsterStage: React.FC<MonsterStageProps> = ({
  background,
  onShowStatus,
  enemy,
  enemyHp,
  enemyMaxHp,
  playerHp,
  playerMaxHp
}) => {
  const monster = useGameStore(state => state.myMonster);

  if (!monster) return null;

  const { appearance } = monster;

  // Determine Values
  const currentHp = playerHp !== undefined ? playerHp : monster.stats.hp;
  const maxHp = playerMaxHp !== undefined ? playerMaxHp : monster.stats.maxHp;

  return (
    <div className={`flex-1 relative flex flex-col items-center justify-center w-full overflow-hidden ${background}`}>

      {/* Background Overlay (Optional tint) */}
      <div className={`absolute inset-0 opacity-10 pointer-events-none ${appearance.color}`}></div>

      {/* --- FIXED UI: HP Bars --- */}

      {/* Player HP (Top Left) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <div className="w-40 bg-slate-800/90 backdrop-blur border border-slate-600 rounded-xl p-1.5 shadow-xl">
             <div className="flex justify-between text-[10px] font-bold text-white mb-1 px-1">
                <span>{monster.name}</span>
                <span>{Math.max(0, Math.floor(currentHp))}/{maxHp}</span>
             </div>
             <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                 <div
                   className="h-full bg-emerald-500 transition-all duration-200 ease-out"
                   style={{ width: `${(Math.max(0, currentHp) / maxHp) * 100}%` }}
                 ></div>
             </div>
          </div>
      </div>

      {/* Enemy HP (Top Right) - Only if enemy exists */}
      {enemy && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 animate-in slide-in-from-right-10 duration-500">
            <div className="w-40 bg-slate-800/90 backdrop-blur border border-red-900/50 rounded-xl p-1.5 shadow-xl">
               <div className="flex justify-between text-[10px] font-bold text-red-200 mb-1 px-1">
                  <span>{enemy.name}</span>
                  <span>{enemyHp !== undefined ? Math.max(0, Math.floor(enemyHp)) : '???'}/{enemyMaxHp || '???'}</span>
               </div>
               <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                   <div
                     className="h-full bg-red-500 transition-all duration-200 ease-out"
                     style={{ width: `${enemyMaxHp && enemyHp !== undefined ? (Math.max(0, enemyHp) / enemyMaxHp) * 100 : 100}%` }}
                   ></div>
               </div>
            </div>
        </div>
      )}

      {/* Stage Container */}
      <div className="relative w-full max-w-md h-full flex items-center justify-between px-6">

         {/* --- Player Monster (Left) --- */}
         <div className={`flex flex-col items-center z-10 transition-all duration-500 ${enemy ? 'translate-x-0 scale-90' : 'translate-x-[25%] scale-100'}`}>

            {/* Sprite */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-[8rem] drop-shadow-2xl filter"
            >
              {appearance.emoji}
            </motion.div>
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
               {/* Sprite */}
               <div className="text-[8rem] drop-shadow-2xl filter transform -scale-x-100">
                  {enemy.appearance.emoji}
               </div>
            </div>
         )}
      </div>

      {/* Info Button (Bottom Right - Relocated because Top Right is taken by Enemy HP)
          Actually, user said Top-Right is Enemy HP. Where should "Info" go?
          Maybe Bottom Right or Next to Player HP?
          Let's put it Bottom Right for now or Bottom Left.
      */}
      {!enemy && (
          <button
            data-testid="status-btn"
            onClick={onShowStatus}
            className="absolute top-4 right-4 z-20 w-10 h-10 bg-slate-800/80 backdrop-blur border border-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white shadow-lg transition-all"
          >
            <Search size={20} />
          </button>
      )}

      {/* If enemy exists, maybe hide status button or move it?
          The user didn't specify moving the status button, but "Enemy HP: Top-Right" conflicts with "Info Button: Top-Right".
          I will hide the Info button during battle (when enemy exists) to prevent clutter, or move it.
          Given "Navigation Lock" during battle, hiding Info/Status during battle seems consistent.
      */}

    </div>
  );
};

export default MonsterStage;
