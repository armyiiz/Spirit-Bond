import React from 'react';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { Heart, Zap, Smile } from 'lucide-react';

const MonsterStage: React.FC = () => {
  const monster = useGameStore(state => state.myMonster);

  if (!monster) return null;

  const { vitals, appearance, name, stats, element } = monster;

  // Helper to render bars
  const renderBar = (label: React.ReactNode, value: number, color: string) => (
    <div className="flex items-center gap-2 w-full">
      <div className="w-6 text-slate-400">{label}</div>
      <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-start pt-4 px-6 gap-4 w-full h-full">
      {/* Card Container - Expanded to fill more space */}
      <div className={`relative w-full flex-1 rounded-3xl border-4 border-slate-700 flex items-center justify-center shadow-2xl overflow-hidden ${appearance.color} bg-opacity-20 min-h-[300px]`}>
         <div className={`absolute inset-0 ${appearance.color} opacity-20`}></div>

         <motion.div
           animate={{ y: [0, -15, 0] }}
           transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
           className="text-[9rem] z-10 drop-shadow-lg"
         >
           {appearance.emoji}
         </motion.div>

         <div className="absolute bottom-6 left-0 right-0 text-center z-10">
            <h2 className="text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">{name}</h2>
            <div className="mt-1">
               <span className="text-xs font-bold px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white border border-slate-500 shadow-lg">
                 {element} Type
               </span>
            </div>
         </div>
      </div>

      {/* Vitals Section - Compacted */}
      <div className="w-full bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 flex flex-col gap-2 shadow-lg border border-slate-700">
         <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
           <span>Lv. {monster.level}</span>
           <span>HP: {stats.hp}/{stats.maxHp}</span>
         </div>
         {/* HP Bar */}
         <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-2 relative">
             <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${(stats.hp / stats.maxHp) * 100}%` }}></div>
         </div>

         {/* EXP Bar */}
         <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mb-2">
             <div className="h-full bg-blue-400 transition-all duration-300" style={{ width: `${(monster.exp / monster.maxExp) * 100}%` }}></div>
         </div>

         {renderBar(<Heart size={14} />, vitals.hunger, 'bg-orange-400')}
         {renderBar(<Smile size={14} />, vitals.mood, 'bg-pink-400')}
         {renderBar(<Zap size={14} />, vitals.energy, 'bg-yellow-400')}
      </div>
    </div>
  );
};

export default MonsterStage;
