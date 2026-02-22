import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'motion/react';

interface SectSkillsProps {
  onBack: () => void;
}

const SECT_SKILLS = [
  // 外门
  { 
    id: 's1', 
    name: '青木剑诀', 
    type: 'attack', 
    element: '木系', 
    desc: '修炼至大成可御剑飞行，攻击力+45', 
    price: 200, 
    icon: 'forest', 
    color: '#10b981', 
    reqRealm: '筑基期', 
    reqRank: '外门弟子', 
    tab: '外门',
    bonuses: [{ type: 'attack', value: 45 }]
  },
  { 
    id: 's2', 
    name: '烈火掌', 
    type: 'attack', 
    element: '火系', 
    desc: '掌风如火，灼烧敌人，攻击力+55', 
    price: 350, 
    icon: 'local_fire_department', 
    color: '#ef4444', 
    reqRealm: '练气后期', 
    reqRank: '外门弟子', 
    tab: '外门',
    bonuses: [{ type: 'attack', value: 55 }]
  },
  { 
    id: 's5', 
    name: '神行百变', 
    type: 'evasion', 
    element: '身法', 
    desc: '身法如电，闪避率提升30%', 
    price: 450, 
    icon: 'sprint', 
    color: '#64748b', 
    reqRealm: '练气圆满', 
    reqRank: '外门弟子', 
    tab: '外门',
    bonuses: [{ type: 'evasion', value: 30 }]
  },
  
  // 内门
  { 
    id: 's6', 
    name: '九转金身', 
    type: 'defense', 
    element: '金系', 
    desc: '肉身如金，防御力大幅提升，防御+150', 
    price: 1500, 
    icon: 'shield', 
    color: '#f59e0b', 
    reqRealm: '筑基后期', 
    reqRank: '内门弟子', 
    tab: '内门',
    bonuses: [{ type: 'defense', value: 150 }]
  },
  { 
    id: 's7', 
    name: '御剑术·极', 
    type: 'attack', 
    element: '剑法', 
    desc: '万剑归宗，攻击力+200', 
    price: 2000, 
    icon: 'swords', 
    color: '#60a5fa', 
    reqRealm: '筑基圆满', 
    reqRank: '内门弟子', 
    tab: '内门',
    bonuses: [{ type: 'attack', value: 200 }, { type: 'hit', value: 50 }]
  },
  
  // 核心
  { 
    id: 's3', 
    name: '玄冰护体', 
    type: 'defense', 
    element: '水系', 
    desc: '凝水成冰护体，防御力+300', 
    price: 5000, 
    icon: 'ac_unit', 
    color: '#06b6d4', 
    reqRealm: '结丹期', 
    reqRank: '核心弟子', 
    tab: '核心',
    bonuses: [{ type: 'defense', value: 300 }, { type: 'hp', value: 1000 }]
  },
  { 
    id: 's4', 
    name: '天雷引', 
    type: 'attack', 
    element: '雷系', 
    desc: '引九天雷霆，攻击力+500', 
    price: 8000, 
    icon: 'bolt', 
    color: '#a855f7', 
    reqRealm: '结丹中期', 
    reqRank: '核心弟子', 
    tab: '核心',
    bonuses: [{ type: 'attack', value: 500 }, { type: 'critRate', value: 5 }, { type: 'critDamage', value: 20 }]
  },
];

const RANK_LEVELS = {
  '外门弟子': 1,
  '内门弟子': 2,
  '核心弟子': 3,
  '长老': 4
};

export default function SectSkills({ onBack }: SectSkillsProps) {
  const { player, learnSectSkill } = useGame();
  const [activeTab, setActiveTab] = useState('外门');

  const tabs = ['外门', '内门', '核心'];
  const playerRankLevel = RANK_LEVELS[player.rank] || 1;

  return (
    <div className="flex flex-col h-full bg-background-dark text-slate-100 font-body">
      {/* Header */}
      <header className="flex-none px-4 py-3 bg-background-dark/95 backdrop-blur border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center justify-center text-slate-400 hover:text-white transition-colors w-8 h-8 rounded-full hover:bg-white/5">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight">宗门功法</h1>
        </div>
        <button className="flex items-center justify-center text-slate-400 hover:text-white transition-colors w-8 h-8 rounded-full hover:bg-white/5">
          <span className="material-symbols-outlined">help</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Player Stats Overview */}
        <div className="px-4 py-4 grid grid-cols-2 gap-3">
          <div className="bg-surface-dark border border-white/5 rounded-lg p-3 flex flex-col items-center justify-center gap-1">
            <span className="text-xs text-slate-400 font-medium">当前身份</span>
            <span className="text-white font-bold text-lg tracking-wide">{player.rank}</span>
          </div>
          <div className="bg-surface-dark border border-white/5 rounded-lg p-3 flex flex-col items-center justify-center gap-1">
            <span className="text-xs text-slate-400 font-medium">宗门贡献</span>
            <div className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-[16px]">token</span>
              <span className="font-bold text-lg">{player.resources.sectContribution.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 pb-2 sticky top-0 bg-background-dark z-10 pt-2">
          <div className="flex p-1 bg-surface-dark rounded-lg border border-white/5">
            {tabs.map(tab => {
              const tabLevel = RANK_LEVELS[tab as keyof typeof RANK_LEVELS];
              const isLocked = playerRankLevel < tabLevel;
              return (
                <button 
                  key={tab}
                  onClick={() => !isLocked && setActiveTab(tab)}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-1 ${
                    activeTab === tab ? 'bg-primary text-background-dark shadow-sm' : 'text-slate-400 hover:text-white'
                  } ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {isLocked && <span className="material-symbols-outlined text-[14px]">lock</span>}
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Technique List */}
        <div className="px-4 py-2 flex flex-col gap-3">
          {SECT_SKILLS.filter(s => s.tab === activeTab).map(skill => {
            const isLearned = player.skills.some(s => s.name === skill.name);
            const canAfford = player.resources.sectContribution >= skill.price;
            
            return (
              <div key={skill.id} className="bg-surface-dark rounded-lg border border-white/5 p-4 flex flex-col gap-3 group active:border-primary/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-base">{skill.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/5 text-slate-300 border border-white/10">{skill.element}</span>
                    </div>
                    <p className="text-xs text-slate-400">{skill.desc}</p>
                  </div>
                  <div className="w-10 h-10 rounded-md bg-white/5 border border-white/10 flex items-center justify-center" style={{ color: skill.color }}>
                    <span className="material-symbols-outlined">{skill.icon}</span>
                  </div>
                </div>
                <div className="w-full h-px bg-white/5"></div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      <span>{skill.reqRealm}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      <span>{skill.reqRank}</span>
                    </div>
                  </div>
                  {isLearned ? (
                    <button disabled className="flex items-center gap-1 bg-white/5 text-slate-500 px-4 py-1.5 rounded-md font-bold text-sm">
                      <span>已习得</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => learnSectSkill(skill)}
                      className={`flex items-center gap-1 px-4 py-1.5 rounded-md font-bold text-sm transition-colors ${
                        canAfford ? 'bg-primary text-background-dark hover:bg-primary/90' : 'border border-red-500 text-red-500 hover:bg-red-500/10'
                      }`}
                    >
                      <span>{skill.price}</span>
                      <span className="text-[10px] font-normal opacity-80">{canAfford ? '贡献' : '贡献不足'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
