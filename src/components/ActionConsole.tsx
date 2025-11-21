import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { LogEntry, BattleState } from '../hooks/useBattleSystem';
import { Map, Apple, Dumbbell, Swords, Skull, Heart } from 'lucide-react';

export type ConsoleMode = 'default' | 'care' | 'train' | 'battle' | 'explore';

interface ActionConsoleProps {
  mode: ConsoleMode;
  logs: LogEntry[]; // General logs or Battle logs
  battleState?: BattleState;
  onAction: (action: string, payload?: any) => void;
  onModeChange: (mode: ConsoleMode) => void;
}

const ActionConsole: React.FC<ActionConsoleProps> = ({ mode, logs, battleState, onAction, onModeChange }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { inventory, useItem, trainMonster, myMonster } = useGameStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, mode]); // Auto-scroll when logs update or mode changes

  // --- Sub-Components for Modes ---

  const RenderLogs = () => (
    <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5" ref={scrollRef}>
      {logs.length === 0 && <div className="text-slate-600 text-center mt-4 italic">...</div>}
      {logs.map((log) => (
        <div key={log.id} className={`${log.color} animate-in slide-in-from-left-2 duration-200`}>
          <span className="opacity-30 mr-2 text-[10px]">[{new Date(log.id).toLocaleTimeString('th-TH', { minute: '2-digit', second: '2-digit' })}]</span>
          {log.text}
        </div>
      ))}
    </div>
  );

  const CarePanel = () => {
    const consumables = inventory.filter(i => i.item.type === 'consumable');
    return (
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
           <button
             onClick={() => onAction('bath')}
             className="bg-blue-900/30 border border-blue-500/30 p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-900/50 transition"
           >
             <span className="text-2xl">🛁</span>
             <div className="text-left">
               <div className="font-bold text-blue-300 text-sm">อาบน้ำ</div>
               <div className="text-[10px] text-blue-400">+Mood</div>
             </div>
           </button>
           {consumables.map(slot => (
             <button
               key={slot.item.id}
               onClick={() => useItem(slot.item.id)}
               className="bg-slate-800 border border-slate-700 p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-700 transition"
             >
               <span className="text-2xl">{slot.item.emoji}</span>
               <div className="text-left">
                 <div className="font-bold text-slate-200 text-sm">{slot.item.name}</div>
                 <div className="text-[10px] text-slate-500">x{slot.count}</div>
               </div>
             </button>
           ))}
           {consumables.length === 0 && (
             <div className="col-span-2 text-center text-slate-500 py-4 text-sm">
               ไม่มีอาหารในกระเป๋า
             </div>
           )}
        </div>
        <button onClick={() => onModeChange('default')} className="mt-4 w-full py-2 bg-slate-800 text-slate-400 text-xs rounded-lg">Back</button>
      </div>
    );
  };

  const TrainPanel = () => {
    const canTrain = (myMonster?.vitals.energy || 0) >= 20;
    return (
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
         <div className="text-4xl mb-2 animate-bounce">🏋️</div>
         <p className="text-slate-400 text-xs mb-4 text-center">ใช้ 20 Energy สุ่มเพิ่มค่าสถานะ</p>
         <button
           onClick={() => { if(canTrain) trainMonster(); }}
           disabled={!canTrain}
           className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${canTrain ? 'bg-orange-600 text-white' : 'bg-slate-700 text-slate-500'}`}
         >
           <span>ฝึกฝนร่างกาย</span>
           {!canTrain && <span className="text-xs">(เหนื่อย)</span>}
         </button>
         <button onClick={() => onModeChange('default')} className="mt-3 w-full py-2 bg-slate-800 text-slate-400 text-xs rounded-lg">Back</button>
      </div>
    );
  };

  const ExplorePanel = () => {
     const locations = [
       { id: 'forest', name: 'ป่าลึกลับ', color: 'bg-emerald-900/50 border-emerald-700', icon: '🌲' },
       { id: 'ocean', name: 'ชายหาด', color: 'bg-blue-900/50 border-blue-700', icon: '🌊' },
       { id: 'mountain', name: 'ภูเขาหิน', color: 'bg-stone-800/80 border-stone-600', icon: '⛰️' },
       { id: 'volcano', name: 'ภูเขาไฟ', color: 'bg-red-900/50 border-red-700', icon: '🌋' },
     ];

     return (
       <div className="flex-1 p-4">
         <div className="grid grid-cols-2 gap-2 mb-2">
            {locations.map(loc => (
              <button
                key={loc.id}
                onClick={() => onAction('explore', loc.id)}
                className={`p-3 rounded-xl border ${loc.color} flex items-center gap-2 transition hover:brightness-110`}
              >
                <span className="text-xl">{loc.icon}</span>
                <span className="text-xs font-bold text-white">{loc.name}</span>
              </button>
            ))}
         </div>
         <button onClick={() => onModeChange('default')} className="w-full py-2 bg-slate-800 text-slate-400 text-xs rounded-lg">Back</button>
       </div>
     );
  };

  const BattleControls = () => {
    // If battle ended, show Result button
    if (battleState?.result) {
       return (
         <div className="p-4 border-t border-slate-800 bg-slate-900">
            <button
              onClick={() => onAction('finishBattle')}
              className={`w-full py-3 rounded-xl font-bold text-lg ${battleState.result === 'win' ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-white'}`}
            >
              {battleState.result === 'win' ? 'รับรางวัล' : 'หนีกลับบ้าน'}
            </button>
         </div>
       );
    }
    // During Battle: Show Run button (Attacks are auto)
    return (
      <div className="p-2 border-t border-slate-800 bg-slate-900 flex gap-2">
         <div className="flex-1 bg-slate-800 rounded-lg flex items-center justify-center text-xs text-slate-400">
            Auto-Battle Active...
         </div>
         <button
           onClick={() => onAction('surrender')}
           className="px-6 py-2 bg-red-900/50 text-red-400 border border-red-800 rounded-lg font-bold text-xs hover:bg-red-900"
         >
           หนี
         </button>
      </div>
    );
  };

  // --- Main Render ---

  return (
    <div className="h-full flex flex-col bg-black/80 backdrop-blur-md border-t border-slate-700 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      {/* Header / Title of Console Section */}
      <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex justify-between items-center">
         <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            {mode === 'battle' ? <Swords size={14} className="text-red-500" /> :
             mode === 'care' ? <Heart size={14} className="text-pink-500" /> :
             mode === 'train' ? <Dumbbell size={14} className="text-orange-500" /> :
             mode === 'explore' ? <Map size={14} className="text-emerald-500" /> :
             <span className="w-3 h-3 rounded-full bg-slate-600 animate-pulse"></span>
            }
            <span>{mode === 'default' ? 'SYSTEM LOG' : mode}</span>
         </div>
         {mode === 'default' && (
           <div className="text-[10px] text-slate-600">v2.0.1 console</div>
         )}
      </div>

      {/* Content Area */}
      {mode === 'default' && <RenderLogs />}
      {mode === 'care' && <CarePanel />}
      {mode === 'train' && <TrainPanel />}
      {mode === 'explore' && <ExplorePanel />}

      {mode === 'battle' && (
        <>
          <RenderLogs />
          <BattleControls />
        </>
      )}
    </div>
  );
};

export default ActionConsole;
