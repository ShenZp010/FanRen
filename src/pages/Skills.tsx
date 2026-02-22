import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

export default function Skills() {
  const { player, upgradeSkill, addLog } = useGame();
  const [activeCategory, setActiveCategory] = useState('心法');

  const categories = ['心法', '身法', '秘术', '术法'];
  
  // Map context skills to UI display
  const skillDisplayData = player.skills.map(s => {
    const isCultivation = s.type === 'cultivation';
    return {
      ...s,
      category: isCultivation ? '心法' : '术法', // Simple mapping for now
      tier: s.level > 30 ? '极品' : s.level > 15 ? '上品' : '凡品',
      effect: isCultivation ? `修炼速度 +${(s.bonus * 100).toFixed(0)}%` : `攻击力 +${s.bonus}`,
      icon: isCultivation ? 'auto_stories' : 'bolt',
      desc: isCultivation ? '转化天地灵气为自身修为，提升修炼效率。' : '引动天地之力，对敌造成巨大伤害。',
      color: isCultivation ? 'primary' : 'orange',
      progress: (s.level / s.maxLevel) * 100
    };
  });

  const filteredSkills = skillDisplayData.filter(s => s.category === activeCategory);

  const handleUpgrade = (skill: any) => {
    const cost = skill.level * 100;
    if (upgradeSkill(skill.name, cost)) {
      addLog(<span>功法 <span className="text-primary font-bold">{skill.name}</span> 境界提升！消耗了 <span className="text-amber-400">{cost} 灵石</span>。</span>, 'system');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="flex-none flex items-center bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-surface-highlight">
        <div className="text-white flex size-12 shrink-0 items-center justify-center cursor-pointer hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined text-white">chevron_left</span>
        </div>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">功法</h2>
        <div className="flex size-12 items-center justify-center">
          <button className="flex items-center justify-center text-white hover:text-primary transition-colors">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </header>
      
      <div className="flex-none px-4 py-4 bg-background-dark">
        <div className="bg-[#193322] rounded-xl p-4 border border-surface-highlight flex items-center justify-between shadow-sm">
          <div className="flex flex-col">
            <span className="text-text-muted text-xs font-medium mb-1">功法总战力加成</span>
            <span className="text-white text-2xl font-bold tracking-wide">{player.stats.attack * 5 + 12000}</span>
          </div>
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">bolt</span>
          </div>
        </div>
      </div>
      
      <div className="flex-none bg-background-dark sticky top-0 z-10 shadow-lg shadow-background-dark/50">
        <div className="flex border-b border-surface-highlight px-4 justify-between">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`group flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-2 flex-1 transition-colors ${activeCategory === cat ? 'border-b-primary text-white' : 'border-b-transparent text-text-muted hover:text-white'}`}
            >
              <p className={`text-sm font-bold leading-normal tracking-[0.015em] ${activeCategory === cat ? 'text-white' : 'text-text-muted group-hover:text-white'}`}>{cat}</p>
            </button>
          ))}
        </div>
      </div>
      
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-6">
        {filteredSkills.map((skill, idx) => (
          <div 
            key={idx}
            onClick={() => handleUpgrade(skill)}
            className={`flex flex-col bg-[#193322] rounded-xl border border-surface-highlight p-4 gap-3 hover:border-primary/50 transition-colors cursor-pointer group ${skill.locked ? 'opacity-75' : ''}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className={`text-white flex items-center justify-center rounded-lg bg-surface-highlight shrink-0 size-12 ${!skill.locked ? 'group-hover:bg-primary group-hover:text-black' : ''} transition-colors`}>
                  <span className="material-symbols-outlined">{skill.icon}</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-base font-bold ${skill.locked ? 'text-white/70' : 'text-white'}`}>{skill.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      skill.locked 
                        ? 'bg-red-500/20 text-red-400/70' 
                        : skill.color === 'primary' 
                          ? 'bg-primary/20 text-primary' 
                          : `bg-${skill.color}-500/20 text-${skill.color}-400`
                    }`}>{skill.tier}</span>
                    {!skill.locked && <span className="text-text-muted text-xs">{skill.effect}</span>}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                {skill.locked ? (
                  <button className="text-xs bg-primary text-black font-bold px-3 py-1 rounded-full hover:bg-white transition-colors">解锁</button>
                ) : (
                  <>
                    <span className="text-primary font-bold text-sm">Lv. {skill.level}</span>
                    <span className="text-text-muted text-[10px]">/ {skill.maxLevel}</span>
                  </>
                )}
              </div>
            </div>
            {!skill.locked && (
              <div className="w-full bg-black/40 rounded-full h-1.5 mt-1 overflow-hidden">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: `${skill.progress}%` }}></div>
              </div>
            )}
            <p className={`text-xs font-normal leading-relaxed line-clamp-2 border-t border-white/5 pt-2 mt-1 ${skill.locked ? 'text-text-muted/60' : 'text-text-muted'}`}>
              {skill.desc}
            </p>
          </div>
        ))}
        {filteredSkills.length === 0 && (
          <div className="text-center py-10 text-gray-500">该类别暂无已习得功法</div>
        )}
      </main>
    </div>
  );
}
