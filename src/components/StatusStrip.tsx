import React from 'react';
import { Monster } from '../types';

interface StatusStripProps {
  myMonster: Monster | null;
  enemy: Monster | null;
  battleActive: boolean;
  playerHp: number;
  enemyHp: number;
}

const StatusStrip: React.FC<StatusStripProps> = ({ myMonster, enemy, battleActive, playerHp, enemyHp }) => {
  if (!myMonster) return null;

  return (
    <div className="flex-none h-12 bg-slate-950 border-y border-slate-800 flex items-center px-4 justify-between relative z-20">
       {/* Player HP (Left) */}
       <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-emerald-400">HP</div>
          <div className="w-24 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
             <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(playerHp / myMonster.stats.maxHp) * 100}%` }}></div>
          </div>
          <div className="text-[10px] font-mono text-slate-400">{Math.max(0, Math.floor(playerHp))}/{myMonster.stats.maxHp}</div>
       </div>

       {/* VS Badge (Center) */}
       {battleActive && <div className="text-xs font-black text-red-500 italic">VS</div>}

       {/* Enemy HP (Right) */}
       {battleActive && enemy ? (
         <div className="flex items-center gap-3">
            <div className="text-[10px] font-mono text-slate-400">{Math.max(0, Math.floor(enemyHp))}/{enemy.stats.maxHp}</div>
            <div className="w-24 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
               <div className="h-full bg-red-500 transition-all" style={{ width: `${(enemyHp / enemy.stats.maxHp) * 100}%` }}></div>
            </div>
            <div className="text-xs font-bold text-red-400">HP</div>
         </div>
       ) : (
         <div className="w-24"></div> // Spacer
       )}
    </div>
  );
};

export default StatusStrip;
