<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../store/gameStore';

const store = useGameStore();

// 进度比例：0~1
// A3 (index 14) 为 100%
// 2 (index 0) 为 0%
const MAX_INDEX = 14; // A3_INDEX

const redProgress = computed(() => {
  // 游戏结束（胜利）时，显示满进度
  if (store.isGameOver && store.attacker === 'red') return 1;
  
  const index = store.redLevelIndex;
  return index / MAX_INDEX;
});

const blueProgress = computed(() => {
  // 游戏结束（胜利）时，显示满进度
  if (store.isGameOver && store.attacker === 'blue') return 1;

  const index = store.blueLevelIndex;
  return index / MAX_INDEX;
});

// 计算 clip-path
// inset(top right bottom left)
// 左侧（红）：显示左半部分 (right=50%)，高度随进度变化 (top=100-p)
const redClipPath = computed(() => {
  const p = redProgress.value * 100;
  return `inset(${100 - p}% 50% 0 0)`;
});

// 右侧（蓝）：显示右半部分 (left=50%)，高度随进度变化 (top=100-p)
const blueClipPath = computed(() => {
  const p = blueProgress.value * 100;
  return `inset(${100 - p}% 0 0 50%)`;
});
</script>

<template>
  <!-- 一劳永逸：外层 px-3 / py-1.5 预留灯条 6px 空间，内层高度少 24px，灯条始终在框内不被裁切 -->
  <div class="relative w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto px-3 py-1.5 md:px-4 md:py-2 flex flex-col items-center group transition-transform duration-300 hover:scale-[1.02]">
    <div class="relative w-full flex flex-col h-[calc(80vh-24px)] min-h-[176px]">
      <!-- 插槽：放置 ScoreCard，z-10 在灯条之下 -->
      <div class="relative z-10 w-full h-full min-h-0 rounded-3xl overflow-hidden flex flex-col">
        <slot />
      </div>

      <!-- 1. 轨道底色（深灰色边框） -->
      <div 
        class="absolute inset-[-6px] rounded-[calc(1.5rem+6px)] border-[6px] border-white/10 pointer-events-none z-20"
      ></div>

      <!-- 2. 红方进度（左侧边框填充） -->
      <div 
        class="absolute inset-[-6px] rounded-[calc(1.5rem+6px)] border-[6px] border-guandan-red pointer-events-none z-20 transition-all duration-500 ease-out"
        :style="{ 
          clipPath: redClipPath,
          filter: 'drop-shadow(0 0 8px rgb(var(--guandan-red-rgb) / 0.4))'
        }"
      ></div>

      <!-- 3. 蓝方进度（右侧边框填充） -->
      <div 
        class="absolute inset-[-6px] rounded-[calc(1.5rem+6px)] border-[6px] border-guandan-blue pointer-events-none z-20 transition-all duration-500 ease-out"
        :style="{ 
          clipPath: blueClipPath,
          filter: 'drop-shadow(0 0 8px rgb(var(--guandan-blue-rgb) / 0.4))'
        }"
      ></div>
    </div>
  </div>
</template>
