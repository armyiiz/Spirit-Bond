import React from 'react';
import { Backpack, Sparkles, HeartHandshake, Dumbbell, Swords, Shield, ShoppingCart, Settings } from 'lucide-react';
import { ConsoleMode } from './ActionConsole';

interface TopNavigationProps {
  onModeChange: (mode: ConsoleMode) => void;
  disabled?: boolean;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ onModeChange, disabled }) => {
  const buttons = [
    { id: 'battle', label: 'ต่อสู้', icon: Swords, color: 'text-red-400', target: 'battle_hub' },
    { id: 'train', label: 'ฝึกฝน', icon: Dumbbell, color: 'text-orange-400', target: 'train' },
    { id: 'care', label: 'ดูแล', icon: HeartHandshake, color: 'text-pink-400', target: 'care' },
    { id: 'equipment', label: 'สวมใส่', icon: Shield, color: 'text-emerald-400', target: 'equipment' },
    { id: 'bag', label: 'กระเป๋า', icon: Backpack, color: 'text-amber-400', target: 'bag' },
    { id: 'shop', label: 'ร้านค้า', icon: ShoppingCart, color: 'text-blue-400', target: 'shop' },
    { id: 'evo', label: 'วิวัฒนาการ', icon: Sparkles, color: 'text-purple-400', target: 'evo' },
    { id: 'settings', label: 'ตั้งค่า', icon: Settings, color: 'text-slate-400', target: 'settings' },
  ] as const;

  const handleClick = (target: string) => {
    if (disabled) return;
    onModeChange(target as ConsoleMode);
  };

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 p-2">
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn) => (
          <button
            key={btn.id}
            data-testid={`nav-btn-${btn.id}`}
            onClick={() => handleClick(btn.target)}
            disabled={disabled}
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800'}`}
          >
            <div className={`p-1.5 rounded-full bg-slate-800/50 border border-slate-700 ${btn.color}`}>
              <btn.icon size={18} />
            </div>
            <span className="text-[10px] font-medium text-slate-400">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopNavigation;
