import React from 'react';
import { Backpack, Sparkles, HeartHandshake, Dumbbell, Swords, Map, ShoppingCart, Info } from 'lucide-react';

type MenuAction = 'bag' | 'evo' | 'care' | 'train' | 'battle' | 'explore' | 'shop' | 'wiki';

interface TopMenuProps {
  onAction: (action: MenuAction) => void;
}

const TopMenu: React.FC<TopMenuProps> = ({ onAction }) => {
  const buttons = [
    { id: 'battle', icon: Swords, label: 'ต่อสู้', color: 'text-red-400', bg: 'bg-red-900/20 border-red-500/30' },
    { id: 'train', icon: Dumbbell, label: 'ฝึกฝน', color: 'text-orange-400', bg: 'bg-orange-900/20 border-orange-500/30' },
    { id: 'care', icon: HeartHandshake, label: 'ดูแล', color: 'text-pink-400', bg: 'bg-pink-900/20 border-pink-500/30' },
    { id: 'explore', icon: Map, label: 'สำรวจ', color: 'text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-500/30' },
    { id: 'bag', icon: Backpack, label: 'กระเป๋า', color: 'text-amber-400', bg: 'bg-amber-900/20 border-amber-500/30' },
    { id: 'shop', icon: ShoppingCart, label: 'ร้านค้า', color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-500/30' },
    { id: 'evo', icon: Sparkles, label: 'วิวัฒนาการ', color: 'text-purple-400', bg: 'bg-purple-900/20 border-purple-500/30' },
    { id: 'wiki', icon: Info, label: 'คู่มือ', color: 'text-slate-300', bg: 'bg-slate-800/50 border-slate-600/30' },
  ] as const;

  return (
    <div className="p-2 bg-slate-900 border-b border-slate-800 shadow-lg z-50">
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => onAction(btn.id as MenuAction)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all active:scale-95 ${btn.bg}`}
          >
            <btn.icon size={18} className={`mb-1 ${btn.color}`} />
            <span className="text-[10px] font-bold text-slate-400">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopMenu;
