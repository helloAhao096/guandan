<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore, LEVELS } from '../store/gameStore';

const store = useGameStore();

// 配色 - 使用 CSS 变量
const RED_COLOR = 'var(--color-guandan-red)';
const BLUE_COLOR = 'var(--color-guandan-blue)';
const TRACK_COLOR = 'var(--color-guandan-track)';

// 尺寸定义
const VIEW_BOX_SIZE = 44;
const CENTER = VIEW_BOX_SIZE / 2;
const RADIUS = 18; // 稍微调小一点以容纳 stroke
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const items = computed(() =>
  LEVELS.map((label, index) => {
    const isRed = store.redLevelIndex === index;
    const isBlue = store.blueLevelIndex === index;
    
    let status: 'none' | 'red' | 'blue' | 'both' = 'none';
    if (isRed && isBlue) status = 'both';
    else if (isRed) status = 'red';
    else if (isBlue) status = 'blue';

    return { label, index, status };
  })
);

// 计算圆环属性
// 当双方都在时，我们需要两个半圆，中间留有空隙
// 留白比例 (0.025 * 360 = 9度)
const GAP_RATIO = 0.025;
const SEGMENT_LENGTH_RATIO = 0.5 - (GAP_RATIO * 2); // 0.45

// 蓝方（右侧）：从 12点偏右开始
const BLUE_DASH_ARRAY = `${CIRCUMFERENCE * SEGMENT_LENGTH_RATIO} ${CIRCUMFERENCE}`;
const BLUE_DASH_OFFSET = -CIRCUMFERENCE * GAP_RATIO;

// 红方（左侧）：从 6点偏左开始
const RED_DASH_ARRAY = `${CIRCUMFERENCE * SEGMENT_LENGTH_RATIO} ${CIRCUMFERENCE}`;
const RED_DASH_OFFSET = -CIRCUMFERENCE * (0.5 + GAP_RATIO);

// 单人全圆
const FULL_DASH_ARRAY = `${CIRCUMFERENCE} ${CIRCUMFERENCE}`;
const FULL_DASH_OFFSET = 0;

</script>

<template>
  <div class="w-full overflow-x-auto no-scrollbar py-4">
    <div class="flex flex-nowrap items-center px-4 gap-3 md:justify-center min-w-max">
      <div
        v-for="item in items"
        :key="item.label"
        class="relative flex items-center justify-center w-14 h-14 flex-shrink-0 group cursor-default transition-transform duration-200 hover:scale-110"
      >
        <!-- 黑色圆底 -->
        <div class="absolute inset-0 bg-black rounded-full shadow-lg ring-1 ring-white/10"></div>

        <!-- SVG 容器：整体旋转 -90度，使 0点位于 12点钟方向 -->
        <svg :viewBox="`0 0 ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`" class="absolute inset-0 w-full h-full transform -rotate-90">
          <!-- 轨道底色 -->
          <circle
            :cx="CENTER" :cy="CENTER" :r="RADIUS"
            fill="none"
            :stroke="TRACK_COLOR"
            stroke-width="4"
            stroke-linecap="round"
            class="opacity-40"
          />

          <!-- 红方圆环 -->
          <!-- 只有红方：全圆 -->
          <!-- 双方都在：左半圆 -->
          <circle
            v-if="item.status === 'red' || item.status === 'both'"
            :cx="CENTER" :cy="CENTER" :r="RADIUS"
            fill="none"
            :stroke="RED_COLOR"
            stroke-width="4"
            stroke-linecap="round"
            :stroke-dasharray="item.status === 'both' ? RED_DASH_ARRAY : FULL_DASH_ARRAY"
            :stroke-dashoffset="item.status === 'both' ? RED_DASH_OFFSET : FULL_DASH_OFFSET"
            class="transition-all duration-500 ease-out"
          />

          <!-- 蓝方圆环 -->
          <!-- 只有蓝方：全圆 -->
          <!-- 双方都在：右半圆 -->
          <circle
            v-if="item.status === 'blue' || item.status === 'both'"
            :cx="CENTER" :cy="CENTER" :r="RADIUS"
            fill="none"
            :stroke="BLUE_COLOR"
            stroke-width="4"
            stroke-linecap="round"
            :stroke-dasharray="item.status === 'both' ? BLUE_DASH_ARRAY : FULL_DASH_ARRAY"
            :stroke-dashoffset="item.status === 'both' ? BLUE_DASH_OFFSET : FULL_DASH_OFFSET"
            class="transition-all duration-500 ease-out"
          />
        </svg>

        <!-- 级数数字 -->
        <span
          class="relative z-10 text-lg font-bold font-mono select-none transition-colors duration-300"
          :class="{
            'text-white': item.status !== 'none',
            'text-gray-600': item.status === 'none'
          }"
        >
          {{ item.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
