import React from 'react';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { Monster } from '../types';

interface MonsterStageProps {
  background?: string;
  enemy?: Monster | null;
}

const MonsterStage: React.FC<MonsterStageProps> = ({
  background = "bg-slate-900",
  enemy
}) => {
  const monster = useGameStore(state => state.myMonster);

  if (!monster) return null;

  const { appearance } = monster;

  return (
    <div className={`flex-1 relative flex flex-col items-center justify-center w-full overflow-hidden ${background}`}>

      {/* Background Overlay (Optional tint) */}
      <div className={`absolute inset-0 opacity-10 pointer-events-none ${appearance.color}`}></div>

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
    </div>
  );
};

export default MonsterStage;
