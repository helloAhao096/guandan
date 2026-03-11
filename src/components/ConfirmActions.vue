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
  <div class="flex items-stretch gap-1.5 sm:gap-2 w-full flex-shrink-0">
    <!-- 红方：确认左、撤销右；蓝方：撤销左、确认右 -->
    <template v-if="side === 'red'">
      <!-- 确认按钮 -->
      <button
        type="button"
        class="flex-1 py-2 lg:py-5 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold transition-all duration-200 flex items-center justify-center text-sm sm:text-base lg:text-xl md:text-2xl shadow-sm active:scale-95 active:shadow-none min-h-[44px] sm:min-h-[48px] lg:min-h-[72px] md:min-h-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-800"
        :class="canConfirm
          ? 'bg-white text-black hover:bg-gray-200 shadow-md'
          : 'bg-neutral-700 text-gray-500 cursor-not-allowed'"
        :disabled="!canConfirm"
        @click="emit('confirm')"
      >
        确认
      </button>
      <!-- 撤销：正方形，仅图标居中 -->
      <button
        type="button"
        class="undo-btn flex-shrink-0 rounded-lg sm:rounded-xl lg:rounded-2xl border-2 transition-all duration-200 flex items-center justify-center active:scale-95 size-[44px] sm:size-[48px] lg:size-[72px] md:size-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-800"
        :class="canUndo
          ? 'border-gray-500 text-gray-300 hover:text-gray-100 hover:bg-white/5 hover:border-gray-400'
          : 'border-gray-700 text-gray-600 cursor-not-allowed'"
        :disabled="!canUndo"
        @click="emit('undo')"
        title="撤销上一步"
        aria-label="撤销上一步"
      >
        <RotateCcw class="undo-btn-icon flex-shrink-0" aria-hidden />
      </button>
    </template>
    <template v-else>
      <!-- 撤销：正方形，仅图标居中 -->
      <button
        type="button"
        class="undo-btn flex-shrink-0 rounded-lg sm:rounded-xl lg:rounded-2xl border-2 transition-all duration-200 flex items-center justify-center active:scale-95 size-[44px] sm:size-[48px] lg:size-[72px] md:size-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-800"
        :class="canUndo
          ? 'border-gray-500 text-gray-300 hover:text-gray-100 hover:bg-white/5 hover:border-gray-400'
          : 'border-gray-700 text-gray-600 cursor-not-allowed'"
        :disabled="!canUndo"
        @click="emit('undo')"
        title="撤销上一步"
        aria-label="撤销上一步"
      >
        <RotateCcw class="undo-btn-icon flex-shrink-0" aria-hidden />
      </button>
      <!-- 确认按钮 -->
      <button
        type="button"
        class="flex-1 py-2 lg:py-5 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold transition-all duration-200 flex items-center justify-center text-sm sm:text-base lg:text-xl md:text-2xl shadow-sm active:scale-95 active:shadow-none min-h-[44px] sm:min-h-[48px] lg:min-h-[72px] md:min-h-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-800"
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

<style scoped>
/* 撤销按钮：仅图标，居中；多端按按钮尺寸比例约 40% */
.undo-btn-icon {
  width: 1.125rem;   /* 18px，44px 按钮约 41% */
  height: 1.125rem;
}
@media (min-width: 640px) {
  .undo-btn-icon {
    width: 1.25rem;   /* 20px，48px 按钮约 42% */
    height: 1.25rem;
  }
}
@media (min-width: 768px) {
  .undo-btn-icon {
    width: 1.75rem;   /* 28px，80px 按钮约 35% */
    height: 1.75rem;
  }
}
@media (min-width: 1024px) {
  .undo-btn-icon {
    width: 1.5rem;    /* 24px，72px 按钮约 33% */
    height: 1.5rem;
  }
}
</style>
