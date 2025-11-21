import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { LogEntry, BattleResult } from '../hooks/useBattle';
import { ScrollText } from 'lucide-react';

export type ConsoleMode = 'idle' | 'care' | 'train' | 'battle';
export type ModalType = 'bag' | 'evo' | 'explore' | 'shop' | 'settings' | 'status' | null;

interface ActionConsoleProps {
  mode: ConsoleMode;
  battleState?: {
    logs: LogEntry[];
    isActive: boolean;
    result: BattleResult;
    onFlee: () => void;
    onRestart: () => void; // For when battle ends (win/lose) to go back to idle or restart
  };
  onReturnToIdle: () => void;
}

const ActionConsole: React.FC<ActionConsoleProps> = ({ mode, battleState, onReturnToIdle }) => {
  const { myMonster, inventory, useItem, updateVitals, trainMonster } = useGameStore();
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

  if (mode === 'care') {
    const consumables = inventory.filter(slot => slot.item.type === 'consumable');
    return (
      <div className="h-full flex flex-col bg-slate-900/90 backdrop-blur border-t border-slate-700">
        <div className="flex justify-between items-center px-4 py-2 border-b border-slate-800">
           <h3 className="font-bold text-pink-400 flex items-center gap-2">💗 ดูแลน้อง</h3>
             <button data-testid="console-close-btn" onClick={onReturnToIdle} className="text-xs text-slate-500 underline hover:text-slate-300">Close</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
           {/* Bath Button */}
           <button
             onClick={() => updateVitals({ mood: 20 })}
             className="w-full bg-blue-900/20 hover:bg-blue-900/40 border border-blue-500/20 p-3 rounded-xl flex items-center justify-center gap-3 transition-colors"
           >
             <span className="text-2xl">🛁</span>
             <div className="text-left">
               <div className="font-bold text-blue-300 text-sm">อาบน้ำ</div>
               <div className="text-[10px] text-blue-400/70">+Mood</div>
             </div>
           </button>

           {/* Food List */}
           <div className="grid grid-cols-2 gap-2">
             {consumables.length === 0 ? (
                <div className="col-span-2 text-center py-4 border border-dashed border-slate-700 rounded-lg text-slate-500 text-xs">
                   ไม่มีอาหาร
                </div>
             ) : (
               consumables.map(slot => (
                 <button
                   key={slot.item.id}
                   onClick={() => useItem(slot.item.id)}
                   className="flex flex-col items-center bg-slate-800 p-2 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-colors"
                 >
                    <div className="text-xl mb-1">{slot.item.emoji}</div>
                    <div className="text-xs text-slate-300 font-bold">{slot.item.name}</div>
                    <div className="text-[10px] text-slate-500">x{slot.count}</div>
                 </button>
               ))
             )}
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
    const { logs, isActive, result, onFlee, onRestart } = battleState;
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

  // Default Mode (Idle Logs / Flavor Text)
  return (
    <div className="h-full flex flex-col bg-slate-900 border-t border-slate-700 p-6 items-center justify-center text-center">
       <ScrollText className="text-slate-700 mb-2" size={32} />
       <p className="text-slate-400 text-sm">
         "สวัสดี! วันนี้อากาศดีนะ"
       </p>
       <p className="text-slate-600 text-xs mt-1">
         เลือกเมนูเพื่อทำกิจกรรมกับน้องมอนสเตอร์
       </p>
    </div>
  );
};

export default ActionConsole;
