import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../context/GameContext';

interface AdventureProps {
  onEnterCombat: () => void;
}

export default function Adventure({ onEnterCombat }: AdventureProps) {
  const { player, logs, toggleAdventure } = useGame();
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [selectedMap, setSelectedMap] = useState('misty_forest');

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const maps = [
    { 
      id: 'misty_forest', 
      name: '迷雾森林', 
      en: 'Misty Forest', 
      level: 'Lv.1-10', 
      risk: '安全', 
      riskColor: 'text-primary',
      progress: 75,
      img: 'https://picsum.photos/seed/forest/400/500'
    },
    { 
      id: 'spirit_mine', 
      name: '灵石矿脉', 
      en: 'Spirit Mine', 
      level: 'Lv.10-20', 
      risk: '危险', 
      riskColor: 'text-amber-500',
      progress: 12,
      img: 'https://picsum.photos/seed/mine/400/500'
    },
    { 
      id: 'demon_valley', 
      name: '万妖谷', 
      en: 'Demon Valley', 
      level: 'Lv.20-40', 
      risk: '极度危险', 
      riskColor: 'text-red-500',
      progress: 0,
      locked: true,
      img: 'https://picsum.photos/seed/valley/400/500'
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark select-none">
      <header className="flex-none flex items-center justify-between px-5 py-4 bg-background-dark/95 backdrop-blur-md border-b border-white/5 z-20 pt-12">
        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-tight text-white uppercase">历练地图</h1>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Exploration Area</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-surface-dark px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
            <span className="material-symbols-outlined text-amber-400 text-[16px]">diamond</span>
            <span className="text-xs font-bold font-mono text-slate-200">{player.resources.spiritStones.toLocaleString()}</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto scrollbar-hide pb-6 relative flex flex-col pt-4">
        {/* Quick Stats */}
        <section className="px-5 mb-6 grid grid-cols-3 gap-3 shrink-0">
          {[
            { label: '当前境界', value: `${player.realm.name}${player.realm.level}层`, color: 'text-primary' },
            { label: '气血状态', value: `${player.stats.hp}/${player.stats.maxHp}`, color: 'text-white' },
            { label: '综合战力', value: (player.stats.attack * 10 + player.stats.defense * 5).toLocaleString(), color: 'text-amber-500' }
          ].map((stat, i) => (
            <div key={i} className="bg-surface-dark p-3 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-1 shadow-lg">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">{stat.label}</span>
              <span className={`text-xs font-black ${stat.color} tracking-tight`}>{stat.value}</span>
            </div>
          ))}
        </section>
        
        {/* Map Selection */}
        <section className="px-5 mb-8 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">map</span>
              探索区域
            </h2>
            <span className="text-[10px] font-bold text-primary hover:underline cursor-pointer">查看全部地图</span>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x px-1">
            {maps.map((map) => (
              <div 
                key={map.id}
                onClick={() => !map.locked && setSelectedMap(map.id)}
                className={`snap-center shrink-0 w-[200px] h-[280px] relative rounded-3xl overflow-hidden border-2 transition-all duration-300 cursor-pointer shadow-2xl ${
                  selectedMap === map.id ? 'border-primary scale-105 ring-4 ring-primary/10' : 'border-white/5 opacity-80 hover:opacity-100'
                } ${map.locked ? 'grayscale cursor-not-allowed' : ''}`}
              >
                <img 
                  src={map.img} 
                  alt={map.name} 
                  className="absolute inset-0 w-full h-full object-contain bg-slate-900"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                
                {player.isAdventuring && selectedMap === map.id && (
                  <div className="absolute top-4 left-4 bg-primary text-background-dark text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse uppercase tracking-widest">
                    探索中
                  </div>
                )}

                {map.locked && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                    <span className="material-symbols-outlined text-white/50 text-4xl">lock</span>
                    <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">未解锁</span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 w-full p-4">
                  <h3 className="text-white font-black text-lg leading-tight">{map.name}</h3>
                  <p className="text-slate-400 text-[10px] font-bold mb-3 uppercase tracking-tighter">{map.en}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold text-slate-300">{map.level}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${map.riskColor}`}>{map.risk}</span>
                  </div>
                  <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${map.progress}%` }}></div>
                  </div>
                  <p className="text-[9px] font-bold text-slate-500 mt-1.5 text-right uppercase tracking-widest">探索进度 {map.progress}%</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Adventure Log & Controls */}
        <section className="flex-1 flex flex-col px-5 pt-2 pb-6 min-h-[350px]">
          <div className="flex items-center justify-between mb-4 gap-4">
            <div className="flex bg-surface-dark rounded-xl p-1 border border-white/5 shadow-lg">
              <button 
                onClick={toggleAdventure}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${player.isAdventuring ? 'bg-primary text-background-dark shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
              >
                {player.isAdventuring ? '挂机中' : '开始挂机'}
              </button>
              <button 
                onClick={() => { if(player.isAdventuring) toggleAdventure(); }}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!player.isAdventuring ? 'bg-surface-highlight text-primary' : 'text-slate-500 hover:text-white'}`}
              >
                手动探索
              </button>
            </div>
            <button 
              onClick={onEnterCombat}
              className="flex-1 bg-primary hover:bg-primary-dark active:scale-95 text-background-dark font-black py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/10 uppercase text-xs tracking-widest"
            >
              <span className="material-symbols-outlined text-xl">swords</span>
              <span>进入战斗</span>
            </button>
          </div>
          
          <div className="flex-1 bg-ui-dark border border-ui-border rounded-2xl p-5 overflow-hidden flex flex-col relative shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">历练日志 / Exploration Log</h3>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${player.isAdventuring ? 'bg-primary animate-pulse shadow-[0_0_8px_rgba(19,236,91,0.8)]' : 'bg-slate-600'}`}></span>
                <span className={`text-[10px] font-black font-mono uppercase tracking-widest ${player.isAdventuring ? 'text-primary' : 'text-slate-500'}`}>
                  {player.isAdventuring ? 'Live' : 'Idle'}
                </span>
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 pr-2 space-y-4 font-mono text-[11px] leading-relaxed flex flex-col-reverse scrollbar-hide">
              <div ref={logsEndRef} />
              {logs.map((log) => (
                <div key={log.id} className="flex gap-3 group animate-in fade-in slide-in-from-bottom-1 duration-300">
                  <span className="text-slate-600 shrink-0 select-none font-bold">[{log.time}]</span>
                  <div className={`flex-1 ${
                    log.type === 'reward' ? 'text-primary font-bold' : 
                    log.type === 'combat' ? 'text-slate-200' : 
                    log.type === 'system' ? 'text-amber-400 font-black' : 
                    'text-slate-400'
                  }`}>
                    <p className={log.type === 'reward' ? 'border-l-2 border-primary pl-3' : ''}>{log.text}</p>
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-slate-600 text-center mt-12 flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-4xl opacity-20">history_edu</span>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50">暂无日志，请开始历练...</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
