import React from 'react';
import { useGameStore } from '../store/gameStore';
import { X, Sword, Shield, Zap, Heart, TrendingUp } from 'lucide-react';

interface StatusModalProps {
  onClose: () => void;
}

const StatusModal: React.FC<StatusModalProps> = ({ onClose }) => {
  const monster = useGameStore(state => state.myMonster);

  if (!monster) return null;

  const { stats, level, exp, maxExp, vitals } = monster;

  const statRow = (label: string, value: number, icon: React.ReactNode, color: string) => (
    <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-slate-700/50">
       <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-slate-900 ${color}`}>{icon}</div>
          <span className="font-bold text-slate-300">{label}</span>
       </div>
       <span className="font-mono text-xl font-bold text-white">{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-in fade-in duration-200">
       <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 bg-slate-800/50 border-b border-slate-700 flex justify-between items-start">
             <div>
                <h2 className="text-2xl font-black text-white mb-1">{monster.name}</h2>
                <div className="flex items-center gap-2 text-sm">
                   <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600">Lv. {level}</span>
                   <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">{monster.element}</span>
                </div>
             </div>
             <button onClick={onClose} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"><X size={20} /></button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
             {/* EXP Progress */}
             <div className="mb-6">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                   <span>Experience</span>
                   <span>{Math.floor((exp/maxExp)*100)}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500" style={{ width: `${(exp/maxExp)*100}%` }}></div>
                </div>
                <div className="text-right text-[10px] text-slate-500 mt-1">{exp} / {maxExp} XP</div>
             </div>

             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Combat Stats</h3>
             <div className="space-y-2">
                {statRow("HP", stats.maxHp, <Heart size={16} />, "text-red-400")}
                {statRow("ATK", stats.atk, <Sword size={16} />, "text-orange-400")}
                {statRow("DEF", stats.def, <Shield size={16} />, "text-blue-400")}
                {statRow("SPD", stats.spd, <Zap size={16} />, "text-yellow-400")}
                {statRow("LUK", stats.luk, <TrendingUp size={16} />, "text-emerald-400")}
             </div>

             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6">Vitals</h3>
             <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-800 p-2 rounded-lg text-center border border-slate-700">
                   <div className="text-xs text-slate-400 mb-1">Hunger</div>
                   <div className="font-bold text-orange-400">{vitals.hunger}</div>
                </div>
                <div className="bg-slate-800 p-2 rounded-lg text-center border border-slate-700">
                   <div className="text-xs text-slate-400 mb-1">Mood</div>
                   <div className="font-bold text-pink-400">{vitals.mood}</div>
                </div>
                <div className="bg-slate-800 p-2 rounded-lg text-center border border-slate-700">
                   <div className="text-xs text-slate-400 mb-1">Energy</div>
                   <div className="font-bold text-yellow-400">{vitals.energy}</div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default StatusModal;
