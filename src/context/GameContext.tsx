import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';

export interface SkillBonus {
  type: 'hp' | 'attack' | 'defense' | 'hit' | 'evasion' | 'critRate' | 'critDamage';
  value: number;
}

export interface SkillInfo {
  name: string;
  level: number;
  maxLevel: number;
  type: 'cultivation' | 'attack' | 'defense' | 'evasion' | 'utility';
  bonuses: SkillBonus[];
}

export interface Item {
  id: string;
  name: string;
  type: 'consumable' | 'material' | 'equipment' | 'other';
  quality: string;
  desc: string;
  count: number;
  icon: string;
  color: string;
  price?: number;
  effect?: (p: PlayerState) => Partial<PlayerState>;
}

export interface DailyTask {
  id: string;
  name: string;
  desc: string;
  rewardActivity: number;
  rewardStones?: number;
  rewardExp?: number;
  rewardContribution?: number;
  current: number;
  target: number;
  claimed: boolean;
  icon: string;
}

export interface Order {
  id: string;
  itemName: string;
  price: number;
  amount: number;
  type: 'buy' | 'sell';
  status: 'active' | 'completed' | 'cancelled';
  time: string;
}

export interface PlayerState {
  name: string;
  sect: string;
  realm: {
    name: string;
    stage: string;
    level: number;
    progress: number;
    baseRate: number;
  };
  resources: {
    spiritStones: number;
    sectContribution: number;
  };
  stats: {
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
    spirit: number;
    hit: number;
    evasion: number;
    critRate: number; // 0 to 1
    critDamage: number; // multiplier, e.g. 1.5
  };
  inventory: Item[];
  skills: SkillInfo[];
  dailyTasks: DailyTask[];
  orders: Order[];
  activityValue: number;
  activityRewardsClaimed: number[]; // indices of claimed chests
  isCultivating: boolean;
  isAdventuring: boolean;
  dailySalaryClaimed: boolean;
  sectTasks: number;
  rank: '外门弟子' | '内门弟子' | '核心弟子' | '长老';
}

export interface LogEntry {
  id: number;
  time: string;
  text: React.ReactNode;
  type: 'normal' | 'combat' | 'reward' | 'system';
}

export interface ToastInfo {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const initialPlayerState: PlayerState = {
  name: '云游道人',
  sect: '天剑宗',
  realm: {
    name: '炼气期',
    stage: '后期',
    level: 9,
    progress: 85,
    baseRate: 100,
  },
  resources: {
    spiritStones: 1000000,
    sectContribution: 850000,
  },
  stats: {
    hp: 11819,
    maxHp: 11819,
    attack: 886,
    defense: 650,
    spirit: 45,
    hit: 190,
    evasion: 140,
    critRate: 0.15,
    critDamage: 1.5,
  },
  inventory: [
    { id: '1', name: '洗髓丹', type: 'consumable', quality: '传说', desc: '上古流传下来的神奇丹药。服用后可洗筋伐髓，大幅提升修炼资质。', count: 5, icon: 'medication', color: 'orange', price: 500 },
    { id: '2', name: '青云剑', type: 'equipment', quality: '极品', desc: '筑基期修士常用的飞剑，轻便锋利。', count: 1, icon: 'swords', color: 'purple' },
    { id: '3', name: '止血草', type: 'material', quality: '一品', desc: '常见的疗伤草药。', count: 99, icon: 'grass', color: 'slate' },
    { id: '4', name: '聚气丹', type: 'consumable', quality: '二品', desc: '瞬间恢复大量灵气，提升修炼效率。', count: 12, icon: 'pill', color: 'primary' },
  ],
  skills: [
    { 
      name: '虚空经', 
      level: 12, 
      maxLevel: 40, 
      type: 'cultivation', 
      bonuses: [{ type: 'attack', value: 20 }] 
    },
    { 
      name: '青云诀', 
      level: 45, 
      maxLevel: 50, 
      type: 'attack', 
      bonuses: [{ type: 'attack', value: 50 }, { type: 'hit', value: 10 }] 
    },
  ],
  dailyTasks: [
    { id: 't1', name: '吐纳修行', desc: '在洞府内打坐修行一次', rewardActivity: 10, current: 1, target: 1, claimed: true, icon: 'self_improvement' },
    { id: 't2', name: '秘境探索', desc: '探索秘境三次', rewardActivity: 20, rewardStones: 100, rewardExp: 5, current: 3, target: 3, claimed: false, icon: 'swords' },
    { id: 't3', name: '炼丹尝试', desc: '成功炼制任意丹药', rewardActivity: 15, current: 1, target: 5, claimed: false, icon: 'pill' },
    { id: 't4', name: '宗门请安', desc: '向宗门长辈请安', rewardActivity: 5, rewardContribution: 20, current: 0, target: 1, claimed: false, icon: 'groups' },
    { id: 't5', name: '坊市交易', desc: '在坊市购买或出售一件物品', rewardActivity: 10, current: 0, target: 1, claimed: false, icon: 'storefront' },
  ],
  orders: [
    { id: 'o1', itemName: '聚气丹', price: 450, amount: 10, type: 'buy', status: 'completed', time: '10:20:00' },
    { id: 'o2', itemName: '千年寒铁', price: 300, amount: 5, type: 'sell', status: 'active', time: '11:15:00' },
  ],
  activityValue: 65,
  activityRewardsClaimed: [25, 50],
  isCultivating: false,
  isAdventuring: false,
  dailySalaryClaimed: false,
  sectTasks: 3,
  rank: '外门弟子',
};

interface GameContextType {
  player: PlayerState;
  logs: LogEntry[];
  toasts: ToastInfo[];
  toggleCultivation: () => void;
  toggleAdventure: () => void;
  buyItem: (name: string, price: number, amount: number) => boolean;
  claimDailySalary: () => boolean;
  completeSectTask: (reward: number) => boolean;
  addLog: (text: React.ReactNode, type?: LogEntry['type']) => void;
  showToast: (message: string, type?: ToastInfo['type']) => void;
  upgradeSkill: (skillName: string, cost: number) => boolean;
  winCombat: (rewardStones: number, rewardExp: number) => void;
  useItem: (itemId: string) => void;
  discardItem: (itemId: string, amount?: number) => void;
  claimTaskReward: (taskId: string) => void;
  claimActivityReward: (milestone: number) => void;
  cancelOrder: (orderId: string) => void;
  listItem: (itemId: string, amount: number, price: number) => boolean;
  buyTreasure: (item: any) => boolean;
  learnSectSkill: (skill: any) => boolean;
  totalStats: PlayerState['stats'];
  cultivationRate: number;
}

export const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [player, setPlayer] = useState<PlayerState>(initialPlayerState);
  const playerRef = useRef(player);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);
  const [logIdCounter, setLogIdCounter] = useState(0);
  const [toastIdCounter, setToastIdCounter] = useState(0);

  const addLog = (text: React.ReactNode, type: LogEntry['type'] = 'normal') => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setLogs(prev => [{ id: logIdCounter, time: timeString, text, type }, ...prev].slice(0, 50));
    setLogIdCounter(prev => prev + 1);
  };

  const showToast = (message: string, type: ToastInfo['type'] = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const getCultivationRate = (p: PlayerState) => {
    // Base rate is affected by cultivation type skills
    const bonus = p.skills
      .filter(s => s.type === 'cultivation')
      .length * 0.1; // Simple bonus for now, can be refined
    return p.realm.baseRate * (1 + bonus);
  };

  const getTotalStats = (p: PlayerState) => {
    const total = { ...p.stats };
    p.skills.forEach(skill => {
      skill.bonuses.forEach(bonus => {
        const multiplier = 1 + (skill.level - 1) * 0.1; // Level scaling
        const value = bonus.value * multiplier;
        
        if (bonus.type === 'hp') {
          total.maxHp += value;
          total.hp += value;
        } else if (bonus.type === 'attack') {
          total.attack += value;
        } else if (bonus.type === 'defense') {
          total.defense += value;
        } else if (bonus.type === 'hit') {
          total.hit += value;
        } else if (bonus.type === 'evasion') {
          total.evasion += value;
        } else if (bonus.type === 'critRate') {
          total.critRate += value / 100; // Assuming value is percentage
        } else if (bonus.type === 'critDamage') {
          total.critDamage += value / 100;
        }
      });
    });
    
    // Ensure critRate capped at 100%
    total.critRate = Math.min(1, total.critRate);
    
    return total;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setPlayer(prev => {
        let next = { ...prev };
        let stateChanged = false;
        
        if (next.isCultivating) {
          next.realm = { ...next.realm };
          const rate = getCultivationRate(next);
          next.realm.progress += rate;
          stateChanged = true;

          if (next.realm.progress >= 100) {
            next.realm.progress = 0;
            next.realm.level += 1;
            
            const isBigBreakthrough = next.realm.level > 9;
            
            if (isBigBreakthrough) {
              // Big Realm Breakthrough
              next.stats = {
                ...next.stats,
                maxHp: Math.floor(next.stats.maxHp * 1.5),
                hp: Math.floor(next.stats.maxHp * 1.5),
                attack: Math.floor(next.stats.attack * 1.25),
                defense: Math.floor(next.stats.defense * 1.25),
                hit: Math.floor(next.stats.hit * 1.15),
                evasion: Math.floor(next.stats.evasion * 1.15),
                spirit: next.stats.spirit + 10,
              };
              
              next.realm.level = 1;
              if (next.realm.name === '炼气期') {
                next.realm.name = '筑基期';
                next.realm.stage = '初期';
              } else if (next.realm.name === '筑基期') {
                next.realm.name = '金丹期';
                next.realm.stage = '初期';
              }
            } else {
              // Small Realm Breakthrough
              next.stats = {
                ...next.stats,
                maxHp: Math.floor(next.stats.maxHp * 1.05),
                hp: Math.floor(next.stats.maxHp * 1.05),
                attack: Math.floor(next.stats.attack * 1.03),
                defense: Math.floor(next.stats.defense * 1.03),
                hit: Math.floor(next.stats.hit * 1.05),
                evasion: Math.floor(next.stats.evasion * 1.05),
                spirit: next.stats.spirit + 2,
              };

              if (next.realm.level >= 7) {
                next.realm.stage = '后期';
              } else if (next.realm.level >= 4) {
                next.realm.stage = '中期';
              }
            }
            
            // Base Rate Increase
            next.realm.baseRate += 0.05;

            setTimeout(() => {
              addLog(<span className="text-primary font-bold">境界突破！当前境界：{next.realm.name} {next.realm.level}层</span>, 'system');
              showToast(`境界突破至 ${next.realm.name} ${next.realm.level}层`, 'success');
            }, 0);
          }
        }

        if (next.isAdventuring) {
          if (Math.random() < 0.2) {
            const events = [
              { text: <span>你向 <span className="text-slate-200 font-bold">迷雾深处</span> 移动了 50 米。</span>, type: 'normal' },
              { text: <span>发现一株 <span className="text-primary font-bold">灵草</span>，采集获得 <span className="text-primary">+5 修为</span>。</span>, type: 'reward', effect: (p: PlayerState) => { p.realm.progress += 5; } },
              { text: <span>遭遇 <span className="text-red-500 font-bold">低阶妖兽</span>，轻松击杀，获得 <span className="text-white bg-primary/20 px-1 rounded">下品灵石 x2</span>。</span>, type: 'combat', effect: (p: PlayerState) => { p.resources.spiritStones += 2; } },
            ];
            const ev = events[Math.floor(Math.random() * events.length)];
            setTimeout(() => {
              addLog(ev.text, ev.type as any);
            }, 0);
            if (ev.effect) {
              ev.effect(next);
              stateChanged = true;
            }
          }
        }

        return stateChanged || next.isCultivating ? next : prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleCultivation = () => setPlayer(p => ({ ...p, isCultivating: !p.isCultivating }));
  
  const toggleAdventure = () => {
    const isStarting = !playerRef.current.isAdventuring;
    if (isStarting) {
      addLog(<span>开始在 <span className="text-slate-200 font-bold">迷雾森林</span> 挂机历练...</span>, 'system');
      showToast('开始历练');
    } else {
      addLog(<span>停止历练，返回安全区域。</span>, 'system');
      showToast('停止历练');
    }
    setPlayer(p => ({ ...p, isAdventuring: !p.isAdventuring }));
  };

  const buyItem = (name: string, price: number, amount: number) => {
    const totalCost = price * amount;
    if (playerRef.current.resources.spiritStones < totalCost) {
      showToast('灵石不足', 'error');
      return false;
    }

    setPlayer(p => {
      let next = { ...p };
      next.resources = {
        ...p.resources,
        spiritStones: p.resources.spiritStones - totalCost,
      };
      
      const existingItem = next.inventory.find(i => i.name === name);
      if (existingItem) {
        next.inventory = next.inventory.map(i => 
          i.name === name ? { ...i, count: i.count + amount } : i
        );
      } else {
        const newItem: Item = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          type: name.includes('丹') ? 'consumable' : name.includes('剑') || name.includes('盾') ? 'equipment' : 'material',
          quality: '凡品',
          desc: `在坊市购买的${name}。`,
          count: amount,
          icon: name.includes('丹') ? 'pill' : name.includes('剑') ? 'swords' : 'inventory_2',
          color: 'slate'
        };
        next.inventory = [...next.inventory, newItem];
      }
      
      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      next.orders = [{
        id: Math.random().toString(36).substr(2, 9),
        itemName: name,
        price,
        amount,
        type: 'buy',
        status: 'completed',
        time: timeString
      }, ...next.orders].slice(0, 20);

      return next;
    });

    showToast(`购买成功: ${name}`, 'success');
    return true;
  };

  const claimDailySalary = () => {
    if (playerRef.current.dailySalaryClaimed) {
      showToast('今日已领取', 'error');
      return false;
    }

    setPlayer(p => ({
      ...p,
      resources: {
        ...p.resources,
        spiritStones: p.resources.spiritStones + 50,
      },
      dailySalaryClaimed: true,
    }));

    showToast('领取成功: 50 灵石', 'success');
    return true;
  };

  const completeSectTask = (reward: number) => {
    if (playerRef.current.sectTasks <= 0) {
      showToast('今日任务已达上限', 'error');
      return false;
    }

    setPlayer(p => ({
      ...p,
      resources: {
        ...p.resources,
        sectContribution: p.resources.sectContribution + reward,
      },
      sectTasks: p.sectTasks - 1,
    }));

    showToast(`任务完成: +${reward} 贡献`, 'success');
    return true;
  };

  const upgradeSkill = (skillName: string, cost: number) => {
    if (playerRef.current.resources.spiritStones < cost) {
      showToast('灵石不足', 'error');
      return false;
    }

    setPlayer(p => ({
      ...p,
      resources: { ...p.resources, spiritStones: p.resources.spiritStones - cost },
      skills: p.skills.map(s => s.name === skillName ? { ...s, level: s.level + 1 } : s)
    }));

    showToast(`${skillName} 等级提升`, 'success');
    return true;
  };

  const winCombat = (rewardStones: number, rewardExp: number, finalHp: number) => {
    setPlayer(p => ({
      ...p,
      resources: { ...p.resources, spiritStones: p.resources.spiritStones + rewardStones },
      realm: { ...p.realm, progress: Math.min(100, p.realm.progress + rewardExp) },
      stats: { ...p.stats, hp: finalHp }
    }));
    showToast(`战斗胜利: +${rewardStones} 灵石, +${rewardExp} 修为`, 'success');
  };

  const useItem = (itemId: string) => {
    const item = playerRef.current.inventory.find(i => i.id === itemId);
    if (!item || item.count <= 0) return;

    if (item.name === '聚气丹') {
      showToast('使用聚气丹: 修为 +2%', 'success');
    } else if (item.name === '洗髓丹') {
      showToast('使用洗髓丹: 修为 +10%', 'success');
    } else {
      showToast(`使用了 ${item.name}`);
    }

    setPlayer(p => {
      let next = { ...p };
      if (item.name === '聚气丹') {
        next.realm = { ...next.realm, progress: Math.min(100, next.realm.progress + 2) };
      } else if (item.name === '洗髓丹') {
        next.realm = { ...next.realm, progress: Math.min(100, next.realm.progress + 10) };
      }

      next.inventory = next.inventory.map(i => 
        i.id === itemId ? { ...i, count: i.count - 1 } : i
      ).filter(i => i.count > 0);

      return next;
    });
  };

  const discardItem = (itemId: string, amount?: number) => {
    const item = playerRef.current.inventory.find(i => i.id === itemId);
    if (!item) return;
    
    const discardAmount = amount || item.count;
    showToast(`丢弃了 ${item.name} x${discardAmount}`);
    
    setPlayer(p => {
      if (discardAmount >= item.count) {
        return {
          ...p,
          inventory: p.inventory.filter(i => i.id !== itemId)
        };
      } else {
        return {
          ...p,
          inventory: p.inventory.map(i => 
            i.id === itemId ? { ...i, count: i.count - discardAmount } : i
          )
        };
      }
    });
  };

  const claimTaskReward = (taskId: string) => {
    const task = playerRef.current.dailyTasks.find(t => t.id === taskId);
    if (!task || task.current < task.target || task.claimed) return;

    setPlayer(p => {
      let next = { ...p };
      next.resources = { ...next.resources };
      if (task.rewardStones) next.resources.spiritStones += task.rewardStones;
      if (task.rewardContribution) next.resources.sectContribution += task.rewardContribution;
      if (task.rewardExp) next.realm = { ...next.realm, progress: Math.min(100, next.realm.progress + task.rewardExp) };
      
      next.activityValue += task.rewardActivity;
      next.dailyTasks = next.dailyTasks.map(t => t.id === taskId ? { ...t, claimed: true } : t);
      return next;
    });

    showToast(`领取任务奖励: ${task.name}`, 'success');
  };

  const claimActivityReward = (milestone: number) => {
    if (playerRef.current.activityValue < milestone || playerRef.current.activityRewardsClaimed.includes(milestone)) return;
    
    setPlayer(p => {
      let next = { ...p };
      next.resources = { ...next.resources, spiritStones: next.resources.spiritStones + milestone * 2 };
      next.activityRewardsClaimed = [...next.activityRewardsClaimed, milestone];
      return next;
    });

    showToast(`领取活跃奖励: ${milestone} 档位`, 'success');
  };

  const cancelOrder = (orderId: string) => {
    const order = playerRef.current.orders.find(o => o.id === orderId);
    if (!order || order.status !== 'active') return;

    showToast(`已撤回出售: ${order.itemName}`);
    
    setPlayer(p => {
      let next = { ...p };
      if (order.type === 'sell') {
        const existingItem = next.inventory.find(i => i.name === order.itemName);
        if (existingItem) {
          next.inventory = next.inventory.map(i => 
            i.name === order.itemName ? { ...i, count: i.count + order.amount } : i
          );
        } else {
          next.inventory = [...next.inventory, {
            id: Math.random().toString(36).substr(2, 9),
            name: order.itemName,
            type: 'other',
            quality: '凡品',
            desc: '撤回的商品',
            count: order.amount,
            icon: 'inventory_2',
            color: 'slate'
          }];
        }
      }

      next.orders = next.orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o);
      return next;
    });
  };

  const listItem = (itemId: string, amount: number, price: number) => {
    const item = playerRef.current.inventory.find(i => i.id === itemId);
    if (!item || item.count < amount) {
      showToast('物品数量不足', 'error');
      return false;
    }

    setPlayer(p => {
      let next = { ...p };
      // Remove from inventory
      next.inventory = next.inventory.map(i => 
        i.id === itemId ? { ...i, count: i.count - amount } : i
      ).filter(i => i.count > 0);

      // Add to orders
      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      next.orders = [{
        id: Math.random().toString(36).substr(2, 9),
        itemName: item.name,
        price,
        amount,
        type: 'sell',
        status: 'active',
        time: timeString
      }, ...next.orders];

      return next;
    });

    showToast(`上架成功: ${item.name} x${amount}`, 'success');
    return true;
  };

  const buyTreasure = (item: any) => {
    if (playerRef.current.resources.sectContribution < item.price) {
      showToast('宗门贡献不足', 'error');
      return false;
    }

    setPlayer(p => {
      let next = { ...p };
      next.resources = {
        ...p.resources,
        sectContribution: p.resources.sectContribution - item.price
      };

      const existingItem = next.inventory.find(i => i.name === item.name);
      if (existingItem) {
        next.inventory = next.inventory.map(i => 
          i.name === item.name ? { ...i, count: i.count + 1 } : i
        );
      } else {
        next.inventory = [...next.inventory, {
          id: Math.random().toString(36).substr(2, 9),
          name: item.name,
          type: item.type || 'consumable',
          quality: item.quality || '凡品',
          desc: item.desc || '',
          count: 1,
          icon: item.icon || 'pill',
          color: item.color || 'slate'
        }];
      }

      return next;
    });

    showToast(`兑换成功: ${item.name}`, 'success');
    return true;
  };

  const learnSectSkill = (skill: any) => {
    if (playerRef.current.resources.sectContribution < skill.price) {
      showToast('宗门贡献不足', 'error');
      return false;
    }

    const alreadyLearned = playerRef.current.skills.find(s => s.name === skill.name);
    if (alreadyLearned) {
      showToast('已习得此功法', 'error');
      return false;
    }

    setPlayer(p => {
      let next = { ...p };
      next.resources = {
        ...p.resources,
        sectContribution: p.resources.sectContribution - skill.price
      };

      next.skills = [...next.skills, {
        name: skill.name,
        level: 1,
        maxLevel: 50,
        type: skill.type || 'attack',
        bonuses: skill.bonuses || []
      }];

      return next;
    });

    showToast(`领悟功法: ${skill.name}`, 'success');
    return true;
  };

  return (
    <GameContext.Provider value={{ 
      player, logs, toasts, toggleCultivation, toggleAdventure, 
      buyItem, claimDailySalary, completeSectTask, addLog, showToast,
      upgradeSkill, winCombat, useItem, discardItem, claimTaskReward, claimActivityReward,
      cancelOrder, listItem, buyTreasure, learnSectSkill,
      totalStats: getTotalStats(player),
      cultivationRate: getCultivationRate(player)
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
