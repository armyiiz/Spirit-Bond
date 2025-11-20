import React from 'react';
import { STARTERS } from '../data/monsters';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';

const StarterSelection: React.FC = () => {
  const startGame = useGameStore(state => state.startGame);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4 text-white">
      <h1 className="text-3xl font-bold mb-2 text-emerald-400">เลือกคู่หูของคุณ</h1>
      <p className="mb-8 text-slate-400">เริ่มต้นการผจญภัยไปพร้อมกัน!</p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {STARTERS.map((starter) => (
          <motion.button
            key={starter.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startGame(starter.speciesId)}
            className={`relative p-4 rounded-xl flex flex-col items-center gap-2 border-2 border-transparent hover:border-emerald-500 transition-all ${starter.appearance.color.replace('bg-', 'bg-opacity-20 bg-')}`}
          >
             {/* Card Background with opacity is handled by Tailwind utility classes or we can style inline if needed.
                 Let's use the color provided but with opacity for the card bg */}
             <div className={`absolute inset-0 ${starter.appearance.color} opacity-20 rounded-xl`}></div>

             <div className="text-6xl z-10">{starter.appearance.emoji}</div>
             <div className="font-bold z-10 text-lg">{starter.name}</div>
             <div className="text-xs z-10 text-slate-300">
               HP {starter.stats.hp} | ATK {starter.stats.atk}
             </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default StarterSelection;
