<script setup lang="ts">
const { canConfirm, canUndo } = defineProps<{
  canConfirm: boolean;
  canUndo: boolean;
}>();

const emit = defineEmits<{
  confirm: [];
  undo: [];
}>();
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full mt-auto">
    <!-- 撤销按钮：次级操作，幽灵按钮，放在确认上方 -->
    <button
      type="button"
      class="w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center text-sm active:scale-95 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      :class="!canUndo ? 'opacity-0 pointer-events-none' : ''"
      :disabled="!canUndo"
      @click="emit('undo')"
      title="撤销上一步"
    >
      <span class="mr-1">↺</span> 撤销
    </button>

    <!-- 确认按钮：主要操作，高亮，加大，放在最底部 -->
    <button
      type="button"
      class="w-full py-4 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center text-lg shadow-sm active:scale-95 active:shadow-none min-h-[64px]"
      :class="canConfirm
        ? 'bg-black text-white hover:bg-gray-800 shadow-md dark:bg-white dark:text-black'
        : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
      :disabled="!canConfirm"
      @click="emit('confirm')"
    >
      确认
    </button>
  </div>
</template>
