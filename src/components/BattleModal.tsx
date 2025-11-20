import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { X } from 'lucide-react';

interface BattleModalProps {
  onClose: () => void;
}

interface LogEntry {
  id: number;
  text: string;
  color: string; // Tailwind text color class
}

const BattleModal: React.FC<BattleModalProps> = ({ onClose }) => {
  const { myMonster, updateVitals, addItem } = useGameStore();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [playerGauge, setPlayerGauge] = useState(0);
  const [enemyGauge, setEnemyGauge] = useState(0);
  const [enemyHp, setEnemyHp] = useState(100); // Dummy enemy HP
  const [playerHp, setPlayerHp] = useState(myMonster ? myMonster.stats.hp : 100);
  const [battleOver, setBattleOver] = useState(false);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);

  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Simple Enemy Stats (Dummy)
  const enemyStats = {
    name: 'Slime',
    hp: 100,
    maxHp: 100,
    atk: 15,
    def: 5,
    spd: 15, // Slightly slower than average starter
    emoji: '🦠'
  };

  const addLog = (text: string, color: string = 'text-slate-300') => {
    setLogs(prev => [...prev, { id: Date.now(), text, color }]);
  };

  useEffect(() => {
    if (!myMonster || battleOver) return;

    const tickRate = 100; // 100ms per tick
    const gaugeMax = 100;

    const interval = setInterval(() => {
      if (playerHp <= 0 || enemyHp <= 0) {
        setBattleOver(true);
        const isWin = playerHp > 0;
        setResult(isWin ? 'win' : 'lose');
        addLog(isWin ? 'ชนะการต่อสู้!' : 'พ่ายแพ้...', isWin ? 'text-yellow-400 font-bold' : 'text-red-500 font-bold');

        if (isWin) {
          // Drop loot
          addItem('food_meat', 1);
          addLog('ได้รับ: เนื้อติดกระดูก x1', 'text-emerald-400');
        }

        // Reduce energy/hunger from battle
        updateVitals({ hunger: -5, energy: -5 });

        clearInterval(interval);
        return;
      }

      // Increase Gauges based on SPD
      // Formula: SPD * 0.1 per tick
      setPlayerGauge(prev => {
        const next = prev + (myMonster.stats.spd * 0.15); // Multiplier to speed up demo
        if (next >= gaugeMax) {
          // Player Attack
          const dmg = Math.max(1, Math.floor(myMonster.stats.atk - enemyStats.def));
          setEnemyHp(h => h - dmg);
          addLog(`${myMonster.name} โจมตี! (${dmg} dmg)`, 'text-emerald-400');
          return 0;
        }
        return next;
      });

      setEnemyGauge(prev => {
        const next = prev + (enemyStats.spd * 0.15);
        if (next >= gaugeMax) {
          // Enemy Attack
          const dmg = Math.max(1, Math.floor(enemyStats.atk - myMonster.stats.def));
          setPlayerHp(h => h - dmg);
          addLog(`${enemyStats.name} โจมตีสวนกลับ! (${dmg} dmg)`, 'text-red-400');
          return 0;
        }
        return next;
      });

    }, tickRate);

    return () => clearInterval(interval);
  }, [myMonster, battleOver, enemyHp, playerHp, updateVitals, addItem]);


  if (!myMonster) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
       <div className="w-full max-w-md h-[80vh] flex flex-col bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-slate-800 flex justify-between items-center border-b border-slate-700">
             <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
                <span className="text-2xl">⚔️</span> Battle Log
             </h2>
             {!battleOver && <span className="text-xs text-slate-400 animate-pulse">LIVE</span>}
             {battleOver && <button onClick={onClose}><X /></button>}
          </div>

          {/* Battle Visuals (Top) */}
          <div className="flex justify-between items-center p-6 bg-slate-800/50">
             <div className="flex flex-col items-center gap-1">
                <div className="text-4xl animate-bounce">{myMonster.appearance.emoji}</div>
                <div className="h-2 w-20 bg-slate-700 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(playerHp / myMonster.stats.maxHp) * 100}%` }}></div>
                </div>
                <div className="h-1 w-20 bg-slate-800 mt-1 rounded-full overflow-hidden">
                   <div className="h-full bg-yellow-400 transition-all duration-100" style={{ width: `${Math.min(100, playerGauge)}%` }}></div>
                </div>
             </div>

             <div className="text-slate-500 font-bold text-xl">VS</div>

             <div className="flex flex-col items-center gap-1">
                <div className="text-4xl animate-pulse">{enemyStats.emoji}</div>
                <div className="h-2 w-20 bg-slate-700 rounded-full overflow-hidden">
                   <div className="h-full bg-red-500 transition-all" style={{ width: `${(enemyHp / enemyStats.maxHp) * 100}%` }}></div>
                </div>
                <div className="h-1 w-20 bg-slate-800 mt-1 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 transition-all duration-100" style={{ width: `${Math.min(100, enemyGauge)}%` }}></div>
                </div>
             </div>
          </div>

          {/* Logs (Center) */}
          <div
            ref={logContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-2 bg-black font-mono text-sm border-y border-slate-700"
          >
             {logs.map(log => (
               <div key={log.id} className={`${log.color} animate-in slide-in-from-bottom-2 duration-300`}>
                 <span className="opacity-50 mr-2">[{new Date(log.id).toLocaleTimeString('th-TH', { hour12: false, minute: '2-digit', second: '2-digit' })}]</span>
                 {log.text}
               </div>
             ))}
             {logs.length === 0 && <div className="text-slate-600 text-center mt-10">Waiting for signals...</div>}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-800">
             {battleOver ? (
               <button
                 onClick={onClose}
                 className={`w-full py-3 rounded-xl font-bold text-lg ${result === 'win' ? 'bg-yellow-500 text-black' : 'bg-slate-600 text-white'}`}
               >
                 {result === 'win' ? 'รับรางวัล & กลับ' : 'หนีกลับบ้าน'}
               </button>
             ) : (
               <div className="text-center text-xs text-slate-500">
                  การต่อสู้กำลังดำเนินอยู่...
               </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default BattleModal;
