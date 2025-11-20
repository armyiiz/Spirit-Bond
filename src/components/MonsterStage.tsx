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
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6 w-full max-w-md mx-auto">
      {/* Card Container */}
      <div className={`relative w-full aspect-square rounded-3xl border-4 border-slate-700 flex items-center justify-center shadow-2xl overflow-hidden ${appearance.color} bg-opacity-20`}>
         <div className={`absolute inset-0 ${appearance.color} opacity-20`}></div>

         <motion.div
           animate={{ y: [0, -10, 0] }}
           transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
           className="text-9xl z-10 drop-shadow-lg"
         >
           {appearance.emoji}
         </motion.div>

         <div className="absolute bottom-4 left-0 right-0 text-center z-10">
            <h2 className="text-2xl font-bold text-white drop-shadow-md">{name}</h2>
            <span className="text-xs px-2 py-1 bg-black bg-opacity-50 rounded-full text-white border border-slate-600">
              {element} Type
            </span>
         </div>
      </div>

      {/* Vitals Section */}
      <div className="w-full bg-slate-800 rounded-xl p-4 flex flex-col gap-2 shadow-lg">
         <div className="flex justify-between text-xs text-slate-400 mb-1">
           <span>HP: {stats.hp}/{stats.maxHp}</span>
           <span>EXP: {monster.exp}/{monster.maxExp}</span>
         </div>
         {/* HP Bar */}
         <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
             <div className="h-full bg-red-500" style={{ width: `${(stats.hp / stats.maxHp) * 100}%` }}></div>
         </div>

         {renderBar(<Heart size={14} />, vitals.hunger, 'bg-orange-400')}
         {renderBar(<Smile size={14} />, vitals.mood, 'bg-pink-400')}
         {renderBar(<Zap size={14} />, vitals.energy, 'bg-yellow-400')}
      </div>
    </div>
  );
};

export default MonsterStage;
