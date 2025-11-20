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
       <div className="bg-slate-800 w-full max-w-sm rounded-2xl p-6 border border-slate-700 shadow-2xl text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400"><X /></button>

          <div className="text-6xl mb-4">🏋️</div>
          <h2 className="text-2xl font-bold text-orange-400 mb-2">ฝึกฝนร่างกาย</h2>
          <p className="text-slate-300 mb-6">
             ใช้ 20 Energy เพื่อสุ่มเพิ่มค่าสถานะ <br/>
             (ATK, DEF, SPD, หรือ HP)
          </p>

          <div className="bg-slate-900 p-4 rounded-xl mb-6">
             <div className="text-sm text-slate-400 mb-1">Current Energy</div>
             <div className={`text-2xl font-mono font-bold ${canTrain ? 'text-green-400' : 'text-red-400'}`}>
               {myMonster.vitals.energy}/100
             </div>
          </div>

          <button
            onClick={handleTrain}
            disabled={!canTrain}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
               canTrain
               ? 'bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/20'
               : 'bg-slate-600 text-slate-400 cursor-not-allowed'
            }`}
          >
            {canTrain ? 'เริ่มฝึกฝน!' : 'เหนื่อยเกินไป...'}
          </button>
       </div>
     </div>
  );
};

export default TrainModal;
