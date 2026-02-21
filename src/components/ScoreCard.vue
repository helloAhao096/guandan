<script setup lang="ts">
import { useGameStore } from '../store/gameStore';

const store = useGameStore();

const cardBgClass = () => {
  if (store.history.length === 0) return 'bg-gray-500';
  return store.attacker === 'red' ? 'bg-[#9e0000]' : 'bg-[#0C359E]';
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-w-[120px] min-h-[120px] rounded-xl px-6 py-4 transition-colors duration-200"
    :class="cardBgClass()"
  >
    <span class="text-white text-6xl sm:text-7xl md:text-8xl font-bold select-none">
      {{ store.currentLevel }}
    </span>
  </div>
</template>
