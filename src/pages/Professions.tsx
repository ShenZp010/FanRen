import React from 'react';
import { useGame } from '../context/GameContext';

export default function Professions() {
  const { player, addLog } = useGame();

  const handleCraft = (profession: string) => {
    addLog(<span>正在进行 <span className="text-primary font-bold">{profession}</span> 练习... 消耗了 <span className="text-amber-400">10 灵石</span>。</span>, 'system');
  };

  const handleGather = () => {
    addLog(<span>在后山采集到了一些 <span className="text-green-400">灵草</span> 和 <span className="text-slate-400">玄铁</span>。</span>, 'system');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="flex-none bg-background-dark border-b border-surface-highlight sticky top-0 z-10 pt-12 pb-3 px-4 shadow-lg">
        <div className="flex items-center justify-between">
          <button className="text-white flex size-10 items-center justify-center rounded-full hover:bg-surface-highlight transition-colors">
            <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
          </button>
          <h1 className="text-white text-lg font-bold tracking-tight flex-1 text-center">百业</h1>
          <div className="flex items-center gap-1.5 bg-surface-highlight px-3 py-1.5 rounded-full border border-white/5">
            <span className="material-symbols-outlined text-primary text-[16px]">diamond</span>
            <span className="text-xs font-bold font-mono text-white">{player.resources.spiritStones.toLocaleString()}</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">修真百艺</h2>
          <p className="text-xs text-slate-400">精通一技，可助长生。每一门手艺都是通往大道的阶梯。</p>
        </div>

        {/* Active Crafting */}
        <div className="bg-surface-dark rounded-xl border border-primary/50 p-4 relative overflow-hidden shadow-[0_0_15px_rgba(19,236,91,0.1)]">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">local_fire_department</span>
              <h3 className="text-white font-bold">正在炼制</h3>
            </div>
            <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">20分钟剩余</span>
          </div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-white font-medium">聚灵丹</span>
            <span className="text-xs text-slate-400">二品</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-2 mb-1 overflow-hidden">
            <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>批次 #402</span>
            <span>65%</span>
          </div>
        </div>

        {/* Alchemy */}
        <div 
          onClick={() => handleCraft('炼丹')}
          className="bg-surface-dark rounded-xl border border-surface-highlight p-4 cursor-pointer hover:border-primary/30 transition-colors"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">science</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">炼丹</h3>
                <p className="text-xs text-slate-400">Alchemy</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-4xl text-surface-highlight">cruelty_free</span>
          </div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs text-slate-400">当前境界</span>
            <span className="text-primary font-bold">三品炼丹师</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-1.5 mb-2 overflow-hidden">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: '42%' }}></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>经验: 4,200/10,000</span>
            <span>等级 3</span>
          </div>
        </div>

        {/* Blacksmithing */}
        <div 
          onClick={() => handleCraft('炼器')}
          className="bg-surface-dark rounded-xl border border-surface-highlight p-4 cursor-pointer hover:border-orange-500/30 transition-colors"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                <span className="material-symbols-outlined">hardware</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">炼器</h3>
                <p className="text-xs text-slate-400">Blacksmithing</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-4xl text-surface-highlight">construction</span>
          </div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs text-slate-400">当前境界</span>
            <span className="text-orange-500 font-bold">一品炼器师</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-1.5 mb-2 overflow-hidden">
            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>经验: 150/1,000</span>
            <span>等级 1</span>
          </div>
        </div>

        {/* Talismans */}
        <div 
          onClick={() => handleCraft('符箓')}
          className="bg-surface-dark rounded-xl border border-surface-highlight p-4 cursor-pointer hover:border-yellow-500/30 transition-colors"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <span className="material-symbols-outlined">edit_document</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">符箓</h3>
                <p className="text-xs text-slate-400">Talismans</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-4xl text-surface-highlight">receipt_long</span>
          </div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs text-slate-400">当前境界</span>
            <span className="text-yellow-500 font-bold">符道宗师</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-1.5 mb-2 overflow-hidden">
            <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '88%' }}></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>经验: 88,000/100,000</span>
            <span>等级 9</span>
          </div>
        </div>

        {/* Formations (Locked) */}
        <div className="bg-surface-dark/50 rounded-xl border border-surface-highlight p-4 opacity-75 grayscale-[30%]">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <span className="material-symbols-outlined">pentagon</span>
              </div>
              <div>
                <h3 className="text-slate-300 font-bold text-lg">阵法</h3>
                <p className="text-xs text-slate-500">Formations</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-xl text-slate-500">lock</span>
          </div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs text-slate-500">当前境界</span>
            <span className="text-slate-400 font-bold">未入门</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-1.5 mb-2 overflow-hidden">
            <div className="bg-slate-600 h-1.5 rounded-full" style={{ width: '0%' }}></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>经验: 0/100</span>
            <span>等级 0</span>
          </div>
        </div>

        {/* Gathering */}
        <div 
          onClick={handleGather}
          className="bg-surface-dark rounded-xl border border-surface-highlight p-4 flex items-center justify-between cursor-pointer hover:bg-surface-highlight/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <span className="material-symbols-outlined">forest</span>
            </div>
            <div>
              <h3 className="text-white font-bold">采集资源</h3>
              <p className="text-xs text-slate-400">Gathering & Mining</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-400">chevron_right</span>
        </div>
      </main>
    </div>
  );
}
