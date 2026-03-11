<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../store/gameStore';

const store = useGameStore();

const hasHistory = computed(() => store.history.length > 0);
const tribute = computed(() => store.lastTribute);

// 辅助：根据排名找队伍
const findTeamByRank = (r: { red: number[], blue: number[] }, rank: number): 'red' | 'blue' | null => {
  if (r.red.includes(rank)) return 'red';
  if (r.blue.includes(rank)) return 'blue';
  return null;
};

// 统一的事件结构
interface TributeItem {
  from: 'red' | 'blue';
  to: 'red' | 'blue';
  type: 'gold' | 'silver';
  label: string;
  subLabel?: string;
  fromLabel: string;
  toLabel: string;
}

const tributeItems = computed<TributeItem[]>(() => {
  if (!tribute.value || !hasHistory.value) return [];
  const r = tribute.value.rankings;
  const items: TributeItem[] = [];

  if (tribute.value.type === 'single') {
    const from = findTeamByRank(r, 4);
    const to = findTeamByRank(r, 1);
    if (from && to) {
      items.push({
        from, to,
        type: 'gold',
        label: '进贡',
        fromLabel: '末游',
        toLabel: '头游'
      });
    }
  } else if (tribute.value.type === 'double') {
    const loser = findTeamByRank(r, 4);
    const winner = findTeamByRank(r, 1);
    
    if (loser && winner) {
      // 1. 进大牌 (输家 -> 头游)
      items.push({
        from: loser,
        to: winner,
        type: 'gold',
        label: '进大',
        subLabel: '下局先出',
        fromLabel: '末游',
        toLabel: '头游'
      });
      // 2. 进小牌 (输家 -> 二游)
      items.push({
        from: loser,
        to: winner,
        type: 'silver',
        label: '进小',
        fromLabel: '三游',
        toLabel: '二游'
      });
    }
  }
  return items;
});

// 样式辅助
const teamColorClass = (team: 'red' | 'blue') => {
  return team === 'red' ? 'text-guandan-red bg-guandan-red/10 border-guandan-red/20' : 'text-guandan-blue bg-guandan-blue/10 border-guandan-blue/20';
};
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center py-2 px-4">
    <!-- 空状态 -->
    <div 
      v-if="!hasHistory" 
      class="flex flex-col items-center justify-center text-gray-600 space-y-2 opacity-60"
    >
      <div class="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center">
        <span class="text-xs">VS</span>
      </div>
      <span class="text-xs font-medium">等待开局</span>
    </div>

    <!-- 列表展示 (单贡/双贡通用) -->
    <!-- gap-4 为皇冠（-top-3）预留空间，避免与上一项重叠 -->
    <TransitionGroup
      v-else
      tag="div"
      class="w-full max-w-xs flex flex-col gap-4"
      name="tribute-item"
    >
      <div 
        v-for="(item, index) in tributeItems" 
        :key="index"
        class="flex items-center justify-between bg-white/5 rounded-full p-1.5 pr-4 shadow-sm border border-white/20 backdrop-blur-sm"
      >
        <!-- 进贡方 -->
        <div class="flex items-center gap-2">
          <div 
            class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border shadow-sm"
            :class="teamColorClass(item.from)"
          >
            {{ item.from === 'red' ? '红' : '蓝' }}
          </div>
          <span class="text-[10px] text-gray-500 font-medium w-6 text-center">{{ item.fromLabel }}</span>
        </div>

        <!-- 动态箭头 -->
        <div class="flex-1 flex flex-col items-center px-1 relative">
          <!-- 文字标签 -->
          <div class="flex flex-col items-center mb-1">
            <span 
              class="text-[10px] font-bold leading-none"
              :class="item.type === 'gold' ? 'text-guandan-gold' : 'text-gray-400'"
            >
              {{ item.label }}
            </span>
            <span 
              v-if="item.subLabel" 
              class="text-[8px] scale-90 leading-none mt-0.5 opacity-80"
              :class="item.type === 'gold' ? 'text-guandan-gold' : 'text-gray-400'"
            >
              {{ item.subLabel }}
            </span>
          </div>

          <!-- 箭头轨道 -->
          <div class="relative w-full h-[14px] flex items-center justify-center overflow-hidden">
             <!-- 轨道线 -->
             <div class="absolute inset-x-0 h-[1px] bg-gray-700 top-1/2 -translate-y-1/2"></div>
             
             <!-- 流光动画 -->
             <div 
               class="absolute top-1/2 -translate-y-1/2 h-[2px] w-12 rounded-full blur-[1px] animate-shuttle"
               :class="item.type === 'gold' ? 'bg-guandan-gold' : 'bg-gray-400'"
             ></div>

             <!-- 箭头头 (心跳动画) -->
             <svg 
               viewBox="0 0 24 24" 
               class="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 animate-pulse-fast transform-origin-center"
               :class="item.type === 'gold' ? 'text-guandan-gold' : 'text-gray-400'"
               fill="currentColor"
             >
               <path d="M12 2L20 12L12 22" stroke="none" />
             </svg>
          </div>
        </div>

        <!-- 受贡方 -->
        <div class="flex items-center gap-2 flex-row-reverse">
          <div 
            class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border shadow-sm relative"
            :class="teamColorClass(item.to)"
          >
            {{ item.to === 'red' ? '红' : '蓝' }}
            <!-- 皇冠：-top-2.5 微调，避免与上一项 gap 冲突 -->
            <div v-if="item.type === 'gold'" class="absolute -top-2.5 left-1/2 -translate-x-1/2 text-guandan-gold drop-shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <span class="text-[10px] text-gray-500 font-medium w-6 text-center">{{ item.toLabel }}</span>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
/* 进贡条目入场：淡入 + 自下而上 */
.tribute-item-enter-active {
  transition: opacity 0.35s var(--ease-out-expo), transform 0.35s var(--ease-out-expo);
}
.tribute-item-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.tribute-item-move {
  transition: transform 0.35s var(--ease-out-quart);
}

@keyframes shuttle {
  0% { transform: translate(-150%, -50%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translate(150%, -50%); opacity: 0; }
}

.animate-shuttle {
  animation: shuttle 1.5s var(--ease-out-quart) infinite;
}

@keyframes pulse-fast {
  0%, 100% { transform: translateY(-50%) scale(1); opacity: 1; }
  50% { transform: translateY(-50%) scale(1.2); opacity: 0.8; }
}

.animate-pulse-fast {
  animation: pulse-fast 1.5s var(--ease-out-quart) infinite;
  transform-origin: center;
}
</style>
