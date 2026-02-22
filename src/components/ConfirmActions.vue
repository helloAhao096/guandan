<script setup lang="ts">
import { RotateCcw } from 'lucide-vue-next';

const { canConfirm, canUndo, side } = defineProps<{
  canConfirm: boolean;
  canUndo: boolean;
  side: 'red' | 'blue';
}>();

const emit = defineEmits<{
  confirm: [];
  undo: [];
}>();
</script>

<template>
  <div class="flex items-stretch gap-2 w-full mt-auto pt-1 lg:pt-0">
    <!-- 红方：确认左、撤销右；蓝方：撤销左、确认右 -->
    <template v-if="side === 'red'">
      <!-- 确认按钮 -->
      <button
        type="button"
        class="flex-1 py-2 lg:py-5 rounded-xl lg:rounded-2xl font-bold transition-all duration-200 flex items-center justify-center text-base lg:text-xl md:text-2xl shadow-sm active:scale-95 active:shadow-none min-h-[40px] lg:min-h-[72px] md:min-h-[80px]"
        :class="canConfirm
          ? 'bg-white text-black hover:bg-gray-200 shadow-md'
          : 'bg-neutral-700 text-gray-500 cursor-not-allowed'"
        :disabled="!canConfirm"
        @click="emit('confirm')"
      >
        确认
      </button>
      <!-- 撤销：方形图标按钮，始终显示 -->
      <button
        type="button"
        class="flex-shrink-0 rounded-xl lg:rounded-2xl border-2 transition-all duration-200 flex items-center justify-center active:scale-95 size-[40px] lg:size-[72px] md:size-[80px]"
        :class="canUndo
          ? 'border-gray-500 text-gray-300 hover:text-gray-100 hover:bg-white/5 hover:border-gray-400'
          : 'border-gray-700 text-gray-600 cursor-not-allowed'"
        :disabled="!canUndo"
        @click="emit('undo')"
        title="撤销上一步"
      >
        <RotateCcw class="w-4 h-4 lg:w-7 md:w-8" />
      </button>
    </template>
    <template v-else>
      <!-- 撤销：方形图标按钮，始终显示 -->
      <button
        type="button"
        class="flex-shrink-0 rounded-xl lg:rounded-2xl border-2 transition-all duration-200 flex items-center justify-center active:scale-95 size-[40px] lg:size-[72px] md:size-[80px]"
        :class="canUndo
          ? 'border-gray-500 text-gray-300 hover:text-gray-100 hover:bg-white/5 hover:border-gray-400'
          : 'border-gray-700 text-gray-600 cursor-not-allowed'"
        :disabled="!canUndo"
        @click="emit('undo')"
        title="撤销上一步"
      >
        <RotateCcw class="w-4 h-4 lg:w-7 md:w-8" />
      </button>
      <!-- 确认按钮 -->
      <button
        type="button"
        class="flex-1 py-2 lg:py-5 rounded-xl lg:rounded-2xl font-bold transition-all duration-200 flex items-center justify-center text-base lg:text-xl md:text-2xl shadow-sm active:scale-95 active:shadow-none min-h-[40px] lg:min-h-[72px] md:min-h-[80px]"
        :class="canConfirm
          ? 'bg-white text-black hover:bg-gray-200 shadow-md'
          : 'bg-neutral-700 text-gray-500 cursor-not-allowed'"
        :disabled="!canConfirm"
        @click="emit('confirm')"
      >
        确认
      </button>
    </template>
  </div>
</template>
