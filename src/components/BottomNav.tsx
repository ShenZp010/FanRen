import React from 'react';

interface BottomNavProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onChange }: BottomNavProps) {
  const tabs = [
    { id: 'cultivate', icon: 'self_improvement', label: '修炼' },
    { id: 'skills', icon: 'menu_book', label: '功法' },
    { id: 'adventure', icon: 'explore', label: '历练' },
    { id: 'sect', icon: 'temple_buddhist', label: '宗门' },
    { id: 'market', icon: 'storefront', label: '交易' },
    { id: 'professions', icon: 'construction', label: '百业' },
  ];

  return (
    <nav className="flex-none w-full bg-ui-dark border-t border-ui-border px-2 pb-safe-area-inset-bottom pt-2 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
      <div className="grid grid-cols-6 gap-1 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 py-1 group transition-all duration-200 ${
                isActive ? 'text-primary scale-105' : 'text-text-muted hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] transition-transform ${isActive ? 'drop-shadow-[0_0_8px_rgba(19,236,91,0.5)]' : 'group-hover:scale-110'}`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'opacity-100' : 'opacity-80'}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
