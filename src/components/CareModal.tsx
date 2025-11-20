import React from 'react';
import { useGameStore } from '../store/gameStore';
import { X } from 'lucide-react';

interface CareModalProps {
  onClose: () => void;
}

const CareModal: React.FC<CareModalProps> = ({ onClose }) => {
  const { inventory, useItem, updateVitals } = useGameStore();

  const handleBathe = () => {
    updateVitals({ mood: 20 }); // Bathing increases mood
    onClose();
  };

  const consumables = inventory.filter(slot => slot.item.type === 'consumable');

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
       <div className="bg-slate-800 w-full max-w-sm rounded-2xl p-4 border border-slate-700 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold text-pink-400">ดูแลน้อง</h2>
             <button onClick={onClose}><X className="text-slate-400" /></button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
             <button
               onClick={handleBathe}
               className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 p-4 rounded-xl flex flex-col items-center gap-2 transition-colors"
             >
               <span className="text-3xl">🛁</span>
               <span className="font-bold text-blue-300">อาบน้ำ</span>
               <span className="text-xs text-blue-200">+Mood</span>
             </button>
          </div>

          <h3 className="text-sm font-bold text-slate-400 mb-2">ให้อาหาร</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
             {consumables.length === 0 ? (
               <p className="text-center text-slate-500 py-4">ไม่มีอาหารในกระเป๋า</p>
             ) : (
               consumables.map((slot) => (
                 <div key={slot.item.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                       <div className="text-2xl">{slot.item.emoji}</div>
                       <div>
                          <div className="font-bold text-sm">{slot.item.name}</div>
                          <div className="text-xs text-slate-400">x{slot.count}</div>
                       </div>
                    </div>
                    <button
                      onClick={() => { useItem(slot.item.id); onClose(); }}
                      className="px-3 py-1 bg-emerald-600 text-xs font-bold rounded-full hover:bg-emerald-500"
                    >
                      ป้อน
                    </button>
                 </div>
               ))
             )}
          </div>
       </div>
    </div>
  );
};

export default CareModal;
