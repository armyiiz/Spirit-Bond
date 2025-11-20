import React from 'react';
import { useGameStore } from '../store/gameStore';
import { User, Coins, Star } from 'lucide-react';

const Header: React.FC = () => {
  const { player } = useGameStore();

  return (
    <div className="w-full bg-slate-800 p-3 flex items-center justify-between shadow-md border-b border-slate-700">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
          <User size={20} className="text-white" />
        </div>
        <div className="flex flex-col">
           <span className="font-bold text-white leading-tight">{player.name}</span>
           <span className="text-xs text-emerald-400">Lv. {player.level}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
         <div className="flex items-center gap-1 text-amber-400">
            <Coins size={16} />
            <span className="font-mono font-bold">{player.gold}</span>
         </div>
      </div>
    </div>
  );
};

export default Header;
