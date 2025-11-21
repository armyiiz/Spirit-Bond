import React from 'react';
import { STARTERS } from '../data/monsters';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';

const StarterSelection: React.FC = () => {
  const startGame = useGameStore(state => state.startGame);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-6 text-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-emerald-400">เลือกคู่หูของคุณ</h1>
        <p className="text-slate-400 text-sm">เริ่มต้นการผจญภัยไปพร้อมกัน!</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {STARTERS.map((starter) => (
          <motion.button
            key={starter.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => startGame(starter.speciesId)}
            className="group relative p-4 rounded-2xl flex flex-col items-center justify-center overflow-hidden bg-slate-800 border border-slate-700 shadow-lg"
          >
             {/* Background Glow */}
             <div className={`absolute inset-0 ${starter.appearance.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>

             {/* Sprite */}
             <div className="text-6xl z-10 mb-3 drop-shadow-md group-hover:scale-110 transition-transform duration-300">
               {starter.appearance.emoji}
             </div>

             {/* Info (Below Sprite) */}
             <div className="z-10 text-center">
               <div className="font-bold text-lg text-white leading-none mb-1">{starter.name}</div>
               <span className="text-[10px] px-2 py-0.5 bg-slate-900/50 rounded-full text-slate-300 border border-slate-600">
                 {starter.element}
               </span>
             </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default StarterSelection;
