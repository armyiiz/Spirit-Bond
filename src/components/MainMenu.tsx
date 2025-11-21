import React from 'react';
import { useGameStore } from '../store/gameStore';

interface MainMenuProps {
  onStart: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart }) => {
  const { myMonster } = useGameStore();

  return (
    <div className="h-full bg-slate-950 flex flex-col items-center justify-center p-8 space-y-8 relative overflow-hidden">
       {/* BG Effect */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black opacity-50"></div>

       <div className="relative z-10 text-center space-y-2">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 filter drop-shadow-lg">
             SPIRIT BOND
          </h1>
          <p className="text-xs text-slate-400 tracking-widest uppercase">Digital Monster Raising</p>
       </div>

       <div className="relative z-10 w-full max-w-xs space-y-3">
          {myMonster ? (
             <button onClick={onStart} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/50 transition-all active:scale-95">
                CONTINUE
                <div className="text-[10px] font-normal opacity-80">Lv.{myMonster.level} {myMonster.name}</div>
             </button>
          ) : (
             <button onClick={onStart} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/50 transition-all active:scale-95 animate-pulse">
                NEW GAME
             </button>
          )}

          <div className="text-center text-[10px] text-slate-600 mt-8">
             v0.2.5 (Split-Screen Update)
          </div>
       </div>
    </div>
  );
};

export default MainMenu;
