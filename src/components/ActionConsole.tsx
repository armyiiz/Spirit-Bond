import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { LogEntry, BattleResult } from '../hooks/useBattle';
import { Heart, Zap, Smile, Trash2, Utensils, Bath } from 'lucide-react';

export type ConsoleMode = 'idle' | 'care' | 'train' | 'battle' | 'bag' | 'evo' | 'explore' | 'shop' | 'settings';

interface ActionConsoleProps {
  mode: ConsoleMode;
  battleState?: {
    logs: LogEntry[];
    isActive: boolean;
    result: BattleResult;
    onFlee: () => void;
    onRestart: () => void;
  };
  onReturnToIdle: () => void;
}

const ActionConsole: React.FC<ActionConsoleProps> = ({ mode, battleState, onReturnToIdle }) => {
  const { myMonster, player, inventory, useItem, updateVitals, trainMonster, feedGeneric, cleanPoop } = useGameStore();
  const logEndRef = useRef<HTMLDivElement>(null);
  const [trainingResult, setTrainingResult] = useState<{ stat: string, value: number } | null>(null);
  const [canCloseBattle, setCanCloseBattle] = useState(false);

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (mode === 'battle') {
      scrollToBottom();
    }
  }, [battleState?.logs, mode]);

  // Handle Battle End Delay
  useEffect(() => {
    if (mode === 'battle' && battleState?.result && !battleState.isActive) {
      setCanCloseBattle(false);
      const timer = setTimeout(() => {
        setCanCloseBattle(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [mode, battleState?.result, battleState?.isActive]);

  // Reset local state when mode changes
  useEffect(() => {
    if (mode !== 'train') {
        setTrainingResult(null);
    }
    if (mode !== 'battle') {
        setCanCloseBattle(false);
    }
  }, [mode]);

  const handleTrain = () => {
     const result = trainMonster();
     if (result) {
         setTrainingResult(result);
     }
  };

  // --- Render Views ---

  // 1. IDLE VIEW (Status Screen - Default)
  if (mode === 'idle') {
    if (!myMonster) return null;
    return (
      <div className="h-full bg-slate-900 p-4 flex flex-col gap-3 text-slate-300">
        <div className="flex justify-between items-end border-b border-slate-700 pb-2">
           <div>
             <h2 className="text-lg font-bold text-white">{myMonster.name}</h2>
             <p className="text-xs text-slate-500">Lv.{myMonster.level} • {myMonster.element}</p>
           </div>
           <div className="text-right">
             <div className="text-sm text-yellow-400 font-mono">{player.gold} G</div>
             <div className="text-[10px] text-blue-400">EXP {myMonster.exp}/{myMonster.maxExp}</div>
           </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-1">
           <div className="bg-slate-800 p-2 rounded flex flex-col items-center">
              <Heart size={16} className="text-orange-400 mb-1"/>
              <div className="text-xs font-bold">{Math.round(myMonster.vitals.hunger)}%</div>
              <div className="text-[9px] text-slate-500">ความหิว</div>
           </div>
           <div className="bg-slate-800 p-2 rounded flex flex-col items-center">
              <Smile size={16} className="text-pink-400 mb-1"/>
              <div className="text-xs font-bold">{Math.round(myMonster.vitals.mood)}%</div>
              <div className="text-[9px] text-slate-500">อารมณ์</div>
           </div>
           <div className="bg-slate-800 p-2 rounded flex flex-col items-center">
              <Zap size={16} className="text-yellow-400 mb-1"/>
              <div className="text-xs font-bold">{Math.round(myMonster.vitals.energy)}%</div>
              <div className="text-[9px] text-slate-500">พลังงาน</div>
           </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-1 text-[10px] text-center text-slate-500 mt-auto">
           <div className="bg-slate-800/50 rounded py-1">ATK {myMonster.stats.atk}</div>
           <div className="bg-slate-800/50 rounded py-1">DEF {myMonster.stats.def}</div>
           <div className="bg-slate-800/50 rounded py-1">SPD {myMonster.stats.spd}</div>
           <div className="bg-slate-800/50 rounded py-1">LUK {myMonster.stats.luk}</div>
        </div>
      </div>
    );
  }

  // 2. CARE VIEW
  if (mode === 'care') {
    const poopCount = (myMonster as any).poopCount || 0;
    return (
      <div className="h-full bg-slate-900 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
           <h3 className="font-bold text-pink-400">💗 ดูแลน้อง</h3>
           <button onClick={onReturnToIdle} className="text-xs underline text-slate-500">Close</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
           <button onClick={feedGeneric} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl flex flex-col items-center gap-1 border border-slate-700">
              <Utensils className="text-orange-400" />
              <span className="text-sm font-bold">ป้อนอาหาร</span>
              <span className="text-[10px] text-yellow-400">-1 Gold</span>
           </button>
           <button onClick={() => updateVitals({ mood: 10 })} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl flex flex-col items-center gap-1 border border-slate-700">
              <Bath className="text-blue-400" />
              <span className="text-sm font-bold">อาบน้ำ</span>
              <span className="text-[10px] text-slate-400">+Mood</span>
           </button>
           {poopCount > 0 && (
             <button onClick={cleanPoop} className="col-span-2 bg-slate-800 hover:bg-red-900/30 p-3 rounded-xl flex items-center justify-center gap-2 border border-red-900/50">
                <Trash2 className="text-red-400" />
                <span className="text-sm font-bold text-red-200">เก็บอึ ({poopCount})</span>
             </button>
           )}
        </div>
      </div>
    );
  }

  // 3. BAG VIEW (Inventory)
  if (mode === 'bag') {
    return (
      <div className="h-full bg-slate-900 p-4 flex flex-col">
         <div className="flex justify-between items-center mb-4">
           <h3 className="font-bold text-amber-400">🎒 กระเป๋า</h3>
           <button onClick={onReturnToIdle} className="text-xs underline text-slate-500">Close</button>
         </div>
         <div className="flex-1 overflow-y-auto grid grid-cols-4 gap-2 content-start">
            {inventory.map((slot, idx) => (
              <button key={idx} onClick={() => useItem(slot.item.id)} className="aspect-square bg-slate-800 border border-slate-700 rounded-lg flex flex-col items-center justify-center hover:border-amber-400 relative">
                 <div className="text-2xl">{slot.item.emoji}</div>
                 <div className="absolute bottom-0 right-1 text-[10px] font-bold">{slot.count}</div>
              </button>
            ))}
            {inventory.length === 0 && <div className="col-span-4 text-center text-slate-600 text-xs mt-4">กระเป๋าว่างเปล่า</div>}
         </div>
      </div>
    );
  }

  // 4. EVO VIEW (Wiki)
  if (mode === 'evo') {
    return (
      <div className="h-full bg-slate-900 p-4 flex flex-col">
         <div className="flex justify-between items-center mb-2">
           <h3 className="font-bold text-purple-400">🧬 วิวัฒนาการ</h3>
           <button onClick={onReturnToIdle} className="text-xs underline text-slate-500">Close</button>
         </div>
         <div className="flex-1 overflow-y-auto space-y-2 text-sm">
            {/* Mockup Evo List */}
            <div className="bg-slate-800 p-3 rounded-lg flex justify-between items-center opacity-50">
               <div className="flex items-center gap-2">
                  <span className="text-xl">🪨</span>
                  <div>
                    <div className="font-bold">Terra Form</div>
                    <div className="text-[10px] text-slate-400">Requires: Lv.5 + Terra Stone</div>
                  </div>
               </div>
               <div className="text-xs text-slate-500">Locked</div>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg flex justify-between items-center opacity-50">
               <div className="flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  <div>
                    <div className="font-bold">Aero Form</div>
                    <div className="text-[10px] text-slate-400">Requires: Lv.5 + Aero Stone</div>
                  </div>
               </div>
               <div className="text-xs text-slate-500">Locked</div>
            </div>
         </div>
      </div>
    );
  }

  if (mode === 'train') {
    if (!myMonster) return null;
    const canTrain = myMonster.vitals.energy >= 20;

    return (
      <div className="h-full flex flex-col bg-slate-900/90 backdrop-blur border-t border-slate-700">
        <div className="flex justify-between items-center px-4 py-2 border-b border-slate-800">
           <h3 className="font-bold text-orange-400 flex items-center gap-2">🏋️ ฝึกฝน</h3>
           <button onClick={onReturnToIdle} className="text-xs text-slate-500 underline hover:text-slate-300">Close</button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4 relative">
            <div className="text-center">
               <p className="text-slate-400 text-xs mb-2">ใช้ 20 Energy เพื่อเพิ่มค่าสถานะแบบสุ่ม</p>
               <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-slate-500">Energy:</span>
                  <span className={`font-mono font-bold ${canTrain ? 'text-emerald-400' : 'text-red-400'}`}>
                    {myMonster.vitals.energy}/100
                  </span>
               </div>
            </div>

            {/* Feedback Toast */}
            {trainingResult && (
                <div className="absolute top-16 animate-in fade-in zoom-in duration-300 bg-slate-800/90 border border-orange-500/50 px-4 py-2 rounded-lg text-center shadow-xl">
                    <div className="text-orange-400 font-bold text-lg uppercase">{trainingResult.stat} +{trainingResult.value}</div>
                    <div className="text-xs text-slate-400">สำเร็จ!</div>
                </div>
            )}

            <button
              onClick={handleTrain}
              disabled={!canTrain}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                 canTrain
                 ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg'
                 : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              {canTrain ? 'เริ่มฝึกฝน (Start)' : 'พักก่อน... (Low Energy)'}
            </button>
        </div>
      </div>
    );
  }

  if (mode === 'battle' && battleState) {
    const { logs, isActive, result, onFlee } = battleState;
    return (
      <div className="h-full flex flex-col bg-slate-900 border-t border-slate-700">
         {/* Logs Area */}
         <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-xs bg-black/20">
            {logs.length === 0 && <div className="text-slate-600 italic text-center mt-4">...Battle Starting...</div>}
            {logs.map(log => (
              <div key={log.id} className={`${log.color} break-words`}>
                <span className="opacity-30 mr-2">[{new Date(log.id).toLocaleTimeString('th-TH', { minute: '2-digit', second: '2-digit' })}]</span>
                {log.text}
              </div>
            ))}
            <div ref={logEndRef} />
         </div>

         {/* Controls */}
         <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
            {!isActive && result ? (
               canCloseBattle ? (
                <button
                    onClick={onReturnToIdle}
                    className={`flex-1 py-3 rounded-lg font-bold text-sm shadow-lg animate-in fade-in zoom-in duration-300 ${
                    result === 'win' ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-slate-700 text-white hover:bg-slate-600'
                    }`}
                >
                    {result === 'win' ? 'Victory! (Close)' : 'Defeated... (Close)'}
                </button>
               ) : (
                 <div className="flex-1 py-3 text-center text-slate-500 text-xs italic animate-pulse">
                    Processing results...
                 </div>
               )
            ) : (
              <button
                 data-testid="battle-flee-btn"
                onClick={onFlee}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold text-sm border border-slate-600"
              >
                🏃 Run (หนี)
              </button>
            )}
         </div>
      </div>
    );
  }

  // Placeholders for Shop, Explore, Settings
  if (['shop', 'explore', 'settings'].includes(mode)) {
     return (
        <div className="h-full bg-slate-900 p-4 flex flex-col items-center justify-center text-center">
           <h3 className="font-bold text-xl text-slate-500 uppercase mb-2">{mode}</h3>
           <p className="text-slate-600 text-sm">Coming Soon...</p>
           <button onClick={onReturnToIdle} className="mt-4 text-xs underline text-slate-500">Back</button>
        </div>
     );
  }

  return <div className="h-full bg-slate-900 p-4 text-center text-slate-500">Mode: {mode} (Unknown)</div>;
};

export default ActionConsole;
