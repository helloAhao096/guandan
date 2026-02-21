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
];

function isActive(opt: { value: RoundResult }) {
  return props.selectedWinner === props.side && props.selectedResult === opt.value;
}

function handleClick(opt: { value: RoundResult }) {
  emit('select', opt.value);
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 min-w-[100px] flex flex-col items-center"
      :class="[
        side === 'red'
          ? 'border-[#9e0000] bg-[#9e0000]/10 hover:bg-[#9e0000]/20'
          : 'border-[#0C359E] bg-[#0C359E]/10 hover:bg-[#0C359E]/20',
        isActive(opt)
          ? side === 'red'
            ? 'bg-[#9e0000] text-white border-[#9e0000]'
            : 'bg-[#0C359E] text-white border-[#0C359E]'
          : 'text-foreground',
      ]"
      @click="handleClick(opt)"
    >
      <span class="text-xl font-bold">{{ opt.main }}</span>
      <span class="text-xs opacity-80 mt-0.5">{{ opt.sub }}</span>
    </button>
  </div>
</template>
