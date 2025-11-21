import React from 'react';
import { useGameStore } from '../store/gameStore';
import { X, Heart, Zap, Smile, Shield, Sword, Footprints, Clover } from 'lucide-react';

interface StatusModalProps {
  onClose: () => void;
}

const StatusModal: React.FC<StatusModalProps> = ({ onClose }) => {
  const { myMonster, player } = useGameStore();

  if (!myMonster) return null;

  const { vitals, stats, name, level, exp, maxExp, appearance, element } = myMonster;

  const renderBar = (label: React.ReactNode, value: number, color: string, max: number = 100) => (
    <div className="flex items-center gap-3 w-full">
      <div className="w-6 text-slate-400 flex justify-center">{label}</div>
      <div className="flex-1 flex flex-col gap-1">
         <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
           <div
             className={`h-full ${color} transition-all duration-500`}
             style={{ width: `${(value / max) * 100}%` }}
           />
         </div>
         <div className="text-[10px] text-slate-500 text-right font-mono leading-none">
           {value}/{max}
         </div>
      </div>
    </div>
  );

  return (
    <div data-testid="status-modal" className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
       <div className="bg-slate-900 w-full max-w-xs rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
             <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
               📊 Status Info
             </h2>
             <button data-testid="status-close-btn" onClick={onClose} className="p-1 hover:bg-slate-700 rounded-full transition-colors">
               <X size={20} className="text-slate-400" />
             </button>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
             {/* Header Profile */}
             <div className="flex gap-4 items-center">
                <div className={`w-20 h-20 rounded-2xl ${appearance.color} bg-opacity-20 border border-slate-600 flex items-center justify-center text-4xl shadow-inner`}>
                   {appearance.emoji}
                </div>
                <div>
                   <div className="text-xl font-black text-white">{name}</div>
                   <div className="text-xs font-bold text-slate-400 mb-1">Lv. {level} <span className="text-slate-600">|</span> {element}</div>
                   <div className="text-[10px] text-blue-400">EXP: {exp}/{maxExp}</div>
                </div>
             </div>

             {/* Vitals Section */}
             <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Vitals</h3>
                {renderBar(<Heart size={14} />, vitals.hunger, 'bg-orange-400')}
                {renderBar(<Smile size={14} />, vitals.mood, 'bg-pink-400')}
                {renderBar(<Zap size={14} />, vitals.energy, 'bg-yellow-400')}
             </div>

             {/* Stats Grid */}
             <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Combat Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="flex items-center gap-2 text-sm">
                      <Heart className="text-red-400" size={16} />
                      <div>
                         <div className="font-bold text-slate-200">{stats.hp}/{stats.maxHp}</div>
                         <div className="text-[10px] text-slate-500">HP</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 text-sm">
                      <Sword className="text-orange-400" size={16} />
                      <div>
                         <div className="font-bold text-slate-200">{stats.atk}</div>
                         <div className="text-[10px] text-slate-500">Attack</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 text-sm">
                      <Shield className="text-blue-400" size={16} />
                      <div>
                         <div className="font-bold text-slate-200">{stats.def}</div>
                         <div className="text-[10px] text-slate-500">Defense</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 text-sm">
                      <Footprints className="text-emerald-400" size={16} />
                      <div>
                         <div className="font-bold text-slate-200">{stats.spd}</div>
                         <div className="text-[10px] text-slate-500">Speed</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 text-sm col-span-2 border-t border-slate-700/50 pt-2 mt-1">
                      <Clover className="text-yellow-400" size={16} />
                      <div>
                         <div className="font-bold text-slate-200">{stats.luk}</div>
                         <div className="text-[10px] text-slate-500">Luck</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default StatusModal;
