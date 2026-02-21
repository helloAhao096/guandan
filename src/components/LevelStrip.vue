<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore, LEVELS } from '../store/gameStore';

const store = useGameStore();

// 红蓝各自显示当前级位，不随 pendingWinner 变化；同级时显示半红半蓝
const items = computed(() =>
  LEVELS.map((label, index) => {
    const isRed = store.redLevelIndex === index;
    const isBlue = store.blueLevelIndex === index;
    const ringType: 'gray' | 'red' | 'blue' | 'half' =
      isRed && isBlue ? 'half' : isRed ? 'red' : isBlue ? 'blue' : 'gray';
    return { label, index, ringType };
  })
);
</script>

<template>
  <div class="flex flex-wrap justify-center items-end gap-2 sm:gap-3 py-3">
    <div
      v-for="item in items"
      :key="item.label"
      class="flex flex-col items-center"
    >
      <!-- 空心圆环 -->
      <div
        v-if="item.ringType !== 'half'"
        class="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 box-border flex-shrink-0 transition-colors duration-200 bg-transparent"
        :class="{
          'border-[#9B9B9B]': item.ringType === 'gray',
          'border-[#9e0000]': item.ringType === 'red',
          'border-[#0C359E]': item.ringType === 'blue',
        }"
      />
      <!-- 半红半蓝空心环 (SVG) -->
      <svg
        v-else
        viewBox="0 0 24 24"
        class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-opacity duration-200"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="#9e0000"
          stroke-width="2"
          stroke-dasharray="31.4 31.4"
          stroke-dashoffset="0"
          transform="rotate(-90 12 12)"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="#0C359E"
          stroke-width="2"
          stroke-dasharray="31.4 31.4"
          stroke-dashoffset="0"
          transform="rotate(90 12 12)"
        />
      </svg>
      <!-- 级数标签 -->
      <span
        class="text-xs sm:text-sm font-medium text-foreground mt-0.5 min-w-[1.25rem] text-center"
      >
        {{ item.label }}
      </span>
    </div>
  </div>
</template>
