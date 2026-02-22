<script setup lang="ts">
import type { RoundResult } from '../types/game';

const props = defineProps<{
  side: 'red' | 'blue';
  selectedResult: RoundResult | null;
  selectedWinner: 'red' | 'blue' | null;
}>();

const emit = defineEmits<{
  select: [result: RoundResult];
}>();

const options: { main: string; sub: string; value: RoundResult }[] = [
  { main: '+3', sub: '头/二', value: 3 },
  { main: '+2', sub: '头/三', value: 2 },
  { main: '+1', sub: '头/末', value: 1 },
  { main: '+0', sub: '双下', value: 0 },
]; 

const displayOptions = options.filter(o => o.value > 0);

function isActive(opt: { value: RoundResult }) {
  return props.selectedWinner === props.side && props.selectedResult === opt.value;
}

function handleClick(opt: { value: RoundResult }) {
  emit('select', opt.value);
}
</script>

<template>
  <div class="flex flex-col gap-2 lg:gap-3 w-full">
    <button
      v-for="opt in displayOptions"
      :key="opt.value"
      type="button"
      class="relative flex items-center justify-between px-4 py-0 lg:px-6 lg:py-4 min-h-[44px] lg:min-h-[56px] rounded-xl lg:rounded-2xl transition-all duration-300 active:scale-95 w-full border group overflow-hidden"
      :class="[
        isActive(opt)
          ? side === 'red'
            ? 'bg-guandan-red border-guandan-red text-white shadow-[0_0_20px_-5px_rgba(250,17,79,0.6)]'
            : 'bg-guandan-blue border-guandan-blue text-neutral-900 shadow-[0_0_20px_-5px_rgba(0,240,255,0.6)]'
          : side === 'red'
            ? 'bg-neutral-800/40 border-white/5 text-neutral-400 hover:bg-guandan-red/10 hover:border-guandan-red/30 hover:text-guandan-red hover:shadow-[0_0_15px_-5px_rgba(250,17,79,0.15)]'
            : 'bg-neutral-800/40 border-white/5 text-neutral-400 hover:bg-guandan-blue/10 hover:border-guandan-blue/30 hover:text-guandan-blue hover:shadow-[0_0_15px_-5px_rgba(0,240,255,0.15)]',
      ]"
      @click="handleClick(opt)"
    >
      <!-- 激活状态下的光效背景 -->
      <div 
        v-if="isActive(opt)"
        class="absolute inset-0 bg-gradient-to-r opacity-20 pointer-events-none"
        :class="side === 'red' ? 'from-white/0 via-white/30 to-white/0' : 'from-black/0 via-black/10 to-black/0'"
      ></div>

      <!-- 左侧：大数字 -->
      <span 
        class="text-xl lg:text-3xl font-bold leading-none tracking-tight transition-transform duration-300 group-hover:scale-105"
        :class="isActive(opt) ? 'scale-105' : ''"
      >
        {{ opt.main }}
      </span>
      
      <!-- 右侧：小说明 -->
      <span 
        class="text-xs lg:text-sm font-medium leading-none transition-colors duration-200"
        :class="isActive(opt) 
          ? (side === 'red' ? 'text-white/80' : 'text-neutral-900/70') 
          : 'text-neutral-500 group-hover:text-current'"
      >
        {{ opt.sub }}
      </span>
    </button>
  </div>
</template>
