import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'motion/react';

interface SectTreasureProps {
  onBack: () => void;
}

const TREASURES = [
  { id: 't1', name: '筑基丹', type: 'consumable', quality: '珍稀', desc: '突破筑基瓶颈的关键丹药，增加成功率30%。', price: 500, icon: 'pill', color: '#60A5FA' },
  { id: 't2', name: '聚灵草', type: 'material', quality: '普通', desc: '炼制初级丹药的基础材料，随处可见。', price: 50, icon: 'grass', color: '#4ADE80' },
  { id: 't3', name: '千年寒铁', type: 'material', quality: '史诗', desc: '极寒之地孕育千年的矿石，打造法宝极品。', price: 1200, icon: 'diamond', color: '#C084FC' },
  { id: 't4', name: '洗髓丹', type: 'consumable', quality: '珍稀', desc: '洗经伐髓，提升根骨资质，不可多得。', price: 300, icon: 'clean_hands', color: '#60A5FA' },
  { id: 't5', name: '凝气散', type: 'consumable', quality: '优秀', desc: '加快修炼速度，适合炼气期修士。', price: 100, icon: 'grain', color: '#4ADE80' },
  { id: 't6', name: '下品灵石', type: 'material', quality: '基础', desc: '修真界的硬通货，也可用于辅助修炼。', price: 10, icon: 'hexagon', color: '#9CA3AF' },
  { id: 't7', name: '无名剑意', type: 'other', quality: '史诗', desc: '蕴含上古剑修的一缕剑意，参悟可得神通。', price: 2500, icon: 'swords', color: '#C084FC' },
];

export default function SectTreasure({ onBack }: SectTreasureProps) {
  const { player, buyTreasure } = useGame();
  const [activeFilter, setActiveFilter] = useState('全部');

  const filters = ['全部', '丹药', '材料', '灵种', '法宝', '功法'];

  const filteredTreasures = TREASURES.filter(t => {
    if (activeFilter === '全部') return true;
    if (activeFilter === '丹药') return t.type === 'consumable';
    if (activeFilter === '材料') return t.type === 'material';
    return false;
  });

  return (
    <div className="flex flex-col h-full bg-background-dark text-slate-100 font-body">
      {/* Top Bar / Header */}
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={onBack} className="flex items-center justify-center w-10 h-10 -ml-2 text-slate-400 hover:text-white rounded-full active:bg-white/5 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight text-white absolute left-1/2 -translate-x-1/2">宗门藏宝阁</h1>
          <button className="flex items-center justify-center w-10 h-10 -mr-2 text-slate-400 hover:text-white rounded-full active:bg-white/5 transition-colors">
            <span className="material-symbols-outlined">history</span>
          </button>
        </div>
        {/* Filter Tabs */}
        <nav className="px-4 pb-0 overflow-x-auto no-scrollbar border-b border-white/5">
          <div className="flex gap-6 min-w-max">
            {filters.map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`pb-3 border-b-2 text-sm transition-colors ${
                  activeFilter === filter ? 'border-primary text-primary font-bold' : 'border-transparent text-slate-400 hover:text-white font-medium'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24">
        {/* Player Currency Card */}
        <div className="px-4 py-4 sticky top-0 z-40 bg-background-dark shadow-lg shadow-background-dark/50">
          <div className="bg-gradient-to-r from-surface-dark to-slate-800 rounded-xl p-4 flex items-center justify-between border border-white/5">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-medium mb-1">当前宗门贡献</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>token</span>
                <span className="text-2xl font-bold text-white tracking-tight">{player.resources.sectContribution.toLocaleString()}</span>
              </div>
            </div>
            <button className="bg-primary hover:bg-primary-dark text-background-dark font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1 transition-colors shadow-sm shadow-primary/20">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
              <span>获取</span>
            </button>
          </div>
        </div>

        {/* Item Grid */}
        <div className="px-4 grid grid-cols-2 gap-3 pb-4">
          {filteredTreasures.map(treasure => (
            <motion.div 
              key={treasure.id}
              whileTap={{ scale: 0.98 }}
              className="bg-surface-dark rounded-lg p-3 border border-white/5 flex flex-col gap-3 group transition-transform duration-100"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center border border-white/10">
                  <span className="material-symbols-outlined" style={{ color: treasure.color }}>{treasure.icon}</span>
                </div>
                <span className="text-[10px] font-bold bg-white/5 text-slate-300 px-1.5 py-0.5 rounded border border-white/10">{treasure.quality}</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-0.5 truncate">{treasure.name}</h3>
                <p className="text-[10px] text-slate-400 line-clamp-2 h-8 leading-4">{treasure.desc}</p>
              </div>
              <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1 text-primary">
                  <span className="text-xs font-bold">{treasure.price}</span>
                  <span className="text-[10px] text-primary/80">贡献</span>
                </div>
                <button 
                  onClick={() => buyTreasure(treasure)}
                  className="w-7 h-7 flex items-center justify-center rounded bg-white/5 hover:bg-primary hover:text-background-dark text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">shopping_cart</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
