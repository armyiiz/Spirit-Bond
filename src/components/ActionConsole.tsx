// ... imports
import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { LogEntry, BattleResult } from '../hooks/useBattle';
import { EVOLUTIONS } from '../data/monsters';
import { ITEMS } from '../data/items';
import { ROUTES } from '../data/routes';
import { Heart, Zap, Smile, Trash2, Utensils, Bath, Moon, Sun, LogOut, ShoppingCart, Hammer, ArrowUpCircle } from 'lucide-react'; // เพิ่ม Hammer, ArrowUpCircle

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
  onModeChange: (mode: ConsoleMode) => void;
}


const ActionConsole: React.FC<ActionConsoleProps> = ({ mode, battleState, onReturnToIdle, onModeChange }) => {
  const { myMonster, player, inventory, useItem, buyItem, craftItem, evolveMonster,
          updateVitals, trainMonster, feedGeneric, cleanPoop, isSleeping, toggleSleep, resetSave, bathMonster } = useGameStore();
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

    useEffect(() => {
    if (mode === 'battle' && battleState?.result && !battleState.isActive) {
      setCanCloseBattle(false);
      const timer = setTimeout(() => {
        setCanCloseBattle(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [mode, battleState?.result, battleState?.isActive]);

  useEffect(() => {
    if (mode !== 'train') setTrainingResult(null);
    if (mode !== 'battle') setCanCloseBattle(false);
  }, [mode]);

  const handleTrain = () => {
     const result = trainMonster();
     if (result) setTrainingResult(result);
  };

  if (isSleeping && mode !== 'settings' && mode !== 'shop') {
     return (
       <div className="h-full bg-slate-950 p-4 flex flex-col items-center justify-center animate-pulse">
          <Moon size={48} className="text-blue-200 mb-4" />
          <h2 className="text-xl text-blue-100 font-bold">กำลังนอนพัก...</h2>
          <p className="text-xs text-slate-400 mt-2">HP และพลังงานกำลังฟื้นฟู</p>
          <button onClick={toggleSleep} className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-full border border-slate-600 hover:bg-slate-700">
             <Sun size={16} className="inline mr-2"/> ตื่นนอน
          </button>
       </div>
     );
  }

  // --- Render Views ---

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
        <div className="grid grid-cols-4 gap-1 text-[10px] text-center text-slate-500 mt-auto">
           <div className="bg-slate-800/50 rounded py-1">ATK {myMonster.stats.atk}</div>
           <div className="bg-slate-800/50 rounded py-1">DEF {myMonster.stats.def}</div>
           <div className="bg-slate-800/50 rounded py-1">SPD {myMonster.stats.spd}</div>
           <div className="bg-slate-800/50 rounded py-1">LUK {myMonster.stats.luk}</div>
        </div>
      </div>
    );
  }

  if (mode === 'care') {
    const poopCount = myMonster?.poopCount || 0;
    const canBath = myMonster && myMonster.vitals.energy >= 5 && myMonster.vitals.mood < 100;

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

           <button
             onClick={bathMonster}
             disabled={!canBath}
             className={`p-3 rounded-xl flex flex-col items-center gap-1 border border-slate-700 ${canBath ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-900 opacity-50 cursor-not-allowed'}`}
            >
              <Bath className="text-blue-400" />
              <span className="text-sm font-bold">อาบน้ำ</span>
              <span className={`text-[10px] ${canBath ? 'text-slate-400' : 'text-red-400'}`}>
                  -5 Energy
              </span>
           </button>

            <button onClick={toggleSleep} className="col-span-2 bg-indigo-900/50 hover:bg-indigo-800/50 p-3 rounded-xl flex items-center justify-center gap-2 border border-indigo-700">
               <Moon className="text-indigo-300" />
               <div>
                 <div className="text-sm font-bold text-indigo-100">นอนพักผ่อน</div>
                 <div className="text-[10px] text-indigo-400">ฟื้นฟู HP/Energy (ใช้เวลา)</div>
               </div>
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

  if (mode === 'shop') {
    const shopItems = Object.values(ITEMS).filter(item => !item.recipe && item.price);
    const craftItems = Object.values(ITEMS).filter(item => item.recipe);

    return (
        <div className="h-full bg-slate-900 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-blue-400 flex items-center gap-2"><ShoppingCart size={18}/> ร้านค้า & คราฟต์</h3>
                <div className="text-xs text-yellow-400 font-mono bg-slate-800 px-2 py-1 rounded">
                    💰 {player.gold} G
                </div>
            </div>
            <button onClick={onReturnToIdle} className="text-xs underline text-slate-500 self-end mb-2">Close</button>

            <div className="flex-1 overflow-y-auto space-y-4">
                <div className="space-y-2">
                   <h4 className="text-xs text-slate-500 uppercase font-bold">สินค้าทั่วไป</h4>
                   {shopItems.map(item => (
                       <div key={item.id} className="bg-slate-800 p-2 rounded-lg flex items-center gap-3 border border-slate-700">
                           <div className="text-2xl bg-slate-700 w-10 h-10 flex items-center justify-center rounded-lg">{item.emoji}</div>
                           <div className="flex-1">
                               <div className="font-bold text-slate-200 text-sm">{item.name}</div>
                               <div className="text-[10px] text-slate-400">{item.price} G</div>
                           </div>
                           <button onClick={() => buyItem(item.id)} disabled={player.gold < (item.price || 0)} className={`px-3 py-1 rounded text-xs font-bold ${player.gold >= (item.price || 0) ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-700 text-slate-500'}`}>Buy</button>
                       </div>
                   ))}
                </div>

                <div className="space-y-2">
                   <h4 className="text-xs text-slate-500 uppercase font-bold">ผสมหินวิวัฒนาการ</h4>
                   {craftItems.map(item => {
                       const recipe = item.recipe!;
                       const canCraft = player.gold >= recipe.gold && recipe.ingredients.every(req => {
                           const found = inventory.find(i => i.item.id === req.itemId);
                           return found && found.count >= req.count;
                       });

                       return (
                           <div key={item.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                               <div className="flex justify-between items-start mb-2">
                                   <div className="flex gap-2">
                                       <div className="text-2xl">{item.emoji}</div>
                                       <div>
                                           <div className="font-bold text-slate-200 text-sm">{item.name}</div>
                                           <div className="text-[10px] text-yellow-400">Cost: {recipe.gold} G</div>
                                       </div>
                                   </div>
                                   <button onClick={() => craftItem(item.id)} disabled={!canCraft} className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 ${canCraft ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
                                       <Hammer size={12}/> Craft
                                   </button>
                               </div>
                               <div className="flex gap-2 bg-slate-900/50 p-2 rounded">
                                   {recipe.ingredients.map(req => {
                                       const ingItem = ITEMS[req.itemId];
                                       const userHas = inventory.find(i => i.item.id === req.itemId)?.count || 0;
                                       const isEnough = userHas >= req.count;
                                       return (
                                           <div key={req.itemId} className={`text-[10px] flex items-center gap-1 ${isEnough ? 'text-slate-300' : 'text-red-400'}`}>
                                               <span>{ingItem?.emoji}</span>
                                               <span>{userHas}/{req.count}</span>
                                           </div>
                                       );
                                   })}
                               </div>
                           </div>
                       );
                   })}
                </div>
            </div>
        </div>
    );
  }

  if (mode === 'evo') {
     if (!myMonster) return null;
     const possibleEvos = EVOLUTIONS.filter(e => e.parentSpeciesId === myMonster.speciesId);

     return (
      <div className="h-full bg-slate-900 p-4 flex flex-col">
         <div className="flex justify-between items-center mb-2">
           <h3 className="font-bold text-purple-400">🧬 วิวัฒนาการ ({possibleEvos.length} ร่าง)</h3>
           <button onClick={onReturnToIdle} className="text-xs underline text-slate-500">Close</button>
         </div>
         <div className="flex-1 overflow-y-auto space-y-2">
            {possibleEvos.map(evo => {
               const stoneId = `stone_${evo.element.toLowerCase()}`;
               const hasStone = inventory.some(i => i.item.id === stoneId && i.count > 0);
               const isLevelEnough = myMonster.level >= 10;
               const canEvolve = hasStone && isLevelEnough;

               return (
                   <div key={evo.id} className={`bg-slate-800 p-3 rounded-lg flex justify-between items-center border ${canEvolve ? 'border-purple-500 shadow-lg shadow-purple-900/20' : 'border-slate-700'}`}>
                      <div className="flex items-center gap-3">
                         <div className="text-2xl bg-slate-700 w-10 h-10 flex items-center justify-center rounded-full">
                             {canEvolve ? evo.appearance.emoji : '?'}
                         </div>
                         <div>
                           <div className="font-bold text-slate-200">{evo.name}</div>
                           <div className="text-[10px] text-slate-400 flex flex-col">
                               <span className={isLevelEnough ? 'text-green-400' : 'text-red-400'}>• Lv.10 (Current: {myMonster.level})</span>
                               <span className={hasStone ? 'text-green-400' : 'text-red-400'}>• {evo.element} Stone {hasStone ? '✅' : '❌'}</span>
                           </div>
                         </div>
                      </div>
                      <button
                        onClick={() => evolveMonster(evo.speciesId, stoneId)}
                        disabled={!canEvolve}
                        className={`px-3 py-2 rounded text-xs font-bold ${canEvolve ? 'bg-purple-600 hover:bg-purple-500 text-white animate-pulse' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}
                      >
                          {canEvolve ? 'EVOLVE!' : 'Locked'}
                      </button>
                   </div>
               );
            })}
            {possibleEvos.length === 0 && <div className="text-center text-slate-500 mt-10">ร่างนี้สุดยอดแล้ว! พัฒนาต่อไม่ได้</div>}
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

  if (mode === 'settings') {
    return (
      <div className="h-full bg-slate-900 p-4 flex flex-col gap-4">
         <h3 className="font-bold text-slate-400">⚙️ ตั้งค่า</h3>

         <button onClick={() => window.location.reload()} className="w-full p-3 bg-slate-800 rounded-lg flex items-center gap-3 hover:bg-slate-700 text-slate-200">
            <LogOut size={20} /> กลับหน้าเมนูหลัก (Reload)
         </button>

         <div className="mt-auto pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                 if(confirm('ลบเซฟจริงๆ นะ? หายหมดเลยนะ!')) resetSave();
              }}
              className="w-full p-3 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center justify-center gap-2 hover:bg-red-900/40 text-red-400"
            >
               <Trash2 size={20} /> ลบเซฟเริ่มเล่นใหม่
            </button>
         </div>
      </div>
    );
  }

  if (mode === 'explore') {
    const { setActiveRoute } = useGameStore.getState();

    const handleSelectRoute = (routeId: string) => {
      setActiveRoute(routeId);
      onModeChange('battle');
    };

    return (
      <div className="h-full bg-slate-900 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-emerald-400">🗺️ เลือกเส้นทาง</h3>
          <button onClick={onReturnToIdle} className="text-xs underline text-slate-500">Close</button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {ROUTES.map(route => {
            const isLocked = !myMonster || myMonster.level < route.requiredLevel;
            return (
              <button
                key={route.id}
                disabled={isLocked}
                onClick={() => !isLocked && handleSelectRoute(route.id)}
                className={`w-full p-3 rounded-lg flex items-center justify-between text-left border ${
                  isLocked
                    ? 'bg-slate-800/50 border-slate-700 opacity-60'
                    : `${route.color} border-slate-700 hover:brightness-110`
                }`}
              >
                <div>
                  <h4 className="font-bold">{route.name}</h4>
                  <p className="text-xs opacity-80">{route.description}</p>
                </div>
                <div className="text-right">
                  {isLocked ? (
                    <span className="text-sm">🔒 Lv.{route.requiredLevel}</span>
                  ) : (
                    <span className="text-xs">Lv.{route.requiredLevel}+</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }


  return <div className="h-full bg-slate-900 p-4 text-center text-slate-500">Mode: {mode} (Unknown)</div>;
};

export default ActionConsole;
