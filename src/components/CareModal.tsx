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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
       <div className="bg-slate-900 w-full max-w-xs rounded-2xl p-6 border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
             <h2 className="text-xl font-bold text-pink-400 flex items-center gap-2">
               <span className="text-2xl">💗</span> ดูแลน้อง
             </h2>
             <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full transition-colors">
               <X className="text-slate-400" size={20} />
             </button>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-6">
             <button
               onClick={handleBathe}
               className="bg-blue-900/30 hover:bg-blue-900/50 border border-blue-500/30 p-4 rounded-xl flex items-center justify-center gap-4 transition-colors group"
             >
               <span className="text-3xl group-hover:scale-110 transition-transform">🛁</span>
               <div className="text-left">
                 <div className="font-bold text-blue-300">อาบน้ำ</div>
                 <div className="text-xs text-blue-400/70">เพิ่มความสุข (+Mood)</div>
               </div>
             </button>
          </div>

          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">อาหารในกระเป๋า</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
             {consumables.length === 0 ? (
               <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-xl">
                 <p className="text-slate-600 text-sm">ไม่มีอาหาร...</p>
               </div>
             ) : (
               consumables.map((slot) => (
                 <div key={slot.item.id} className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-3">
                       <div className="text-2xl bg-slate-700 p-1.5 rounded-lg">{slot.item.emoji}</div>
                       <div>
                          <div className="font-bold text-sm text-slate-200">{slot.item.name}</div>
                          <div className="text-xs text-slate-500">มี: {slot.count} ชิ้น</div>
                       </div>
                    </div>
                    <button
                      onClick={() => { useItem(slot.item.id); onClose(); }}
                      className="px-4 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-600/50 text-xs font-bold rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
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
