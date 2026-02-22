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
      class="relative flex items-center justify-between px-4 py-0 lg:px-6 lg:py-4 min-h-[44px] lg:min-h-[56px] rounded-xl lg:rounded-2xl transition-all duration-200 active:scale-95 w-full border border-transparent group"
      :class="[
        isActive(opt)
          ? side === 'red'
            ? 'bg-guandan-red text-white shadow-lg shadow-guandan-red/30 border-guandan-red'
            : 'bg-guandan-blue text-black shadow-lg shadow-guandan-blue/30 border-guandan-blue'
          : side === 'red'
            ? 'bg-guandan-red/5 text-guandan-red hover:bg-guandan-red/10 border-guandan-red/10'
            : 'bg-guandan-blue/5 text-guandan-blue hover:bg-guandan-blue/10 border-guandan-blue/10',
      ]"
      @click="handleClick(opt)"
    >
      <!-- 左侧：大数字 -->
      <span class="text-xl lg:text-3xl font-semibold leading-none">{{ opt.main }}</span>
      
      <!-- 右侧：小说明 -->
      <span 
        class="text-xs lg:text-sm font-medium leading-none"
        :class="isActive(opt) ? (side === 'red' ? 'text-white/90' : 'text-black/70') : 'text-gray-500'"
      >
        {{ opt.sub }}
      </span>
    </button>
  </div>
</template>
