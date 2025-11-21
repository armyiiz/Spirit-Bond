import React from 'react';
import { useGameStore } from '../store/gameStore';
import { X } from 'lucide-react';

interface TrainModalProps {
  onClose: () => void;
}

const TrainModal: React.FC<TrainModalProps> = ({ onClose }) => {
  const { myMonster, trainMonster } = useGameStore();

  if (!myMonster) return null;

  const canTrain = myMonster.vitals.energy >= 20;

  const handleTrain = () => {
    if (canTrain) {
      trainMonster();
      // Maybe show a success toast here? For now just close.
      onClose();
    }
  };

  return (
     <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
       <div className="bg-slate-900 w-full max-w-xs rounded-2xl p-8 border border-slate-700 shadow-2xl text-center relative animate-in zoom-in-95 duration-200">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X /></button>

          <div className="text-6xl mb-6 animate-bounce">🏋️</div>
          <h2 className="text-2xl font-bold text-orange-400 mb-2">ฝึกฝนร่างกาย</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
             ใช้ 20 Energy เพื่อสุ่มเพิ่มค่าสถานะ <br/>
             (ATK, DEF, SPD, หรือ HP)
          </p>

          <div className="bg-slate-800 p-4 rounded-xl mb-6 border border-slate-700">
             <div className="flex justify-between items-end">
                <span className="text-xs text-slate-500 uppercase font-bold">พลังงานคงเหลือ</span>
                <span className={`text-2xl font-mono font-bold ${canTrain ? 'text-emerald-400' : 'text-red-400'}`}>
                  {myMonster.vitals.energy}<span className="text-sm text-slate-600">/100</span>
                </span>
             </div>
             <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full ${canTrain ? 'bg-emerald-500' : 'bg-red-500'} transition-all duration-500`}
                  style={{ width: `${myMonster.vitals.energy}%` }}
                ></div>
             </div>
          </div>

          <button
            onClick={handleTrain}
            disabled={!canTrain}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 ${
               canTrain
               ? 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white shadow-lg shadow-orange-500/20'
               : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
            }`}
          >
            {canTrain ? 'เริ่มฝึกฝน!' : 'เหนื่อยเกินไป...'}
          </button>
       </div>
     </div>
  );
};

export default TrainModal;
