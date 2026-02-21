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
  <div class="flex gap-1 w-full" style="max-width: 120px">
    <button
      type="button"
      class="flex-1 aspect-square rounded-lg border-2 border-gray-400 font-medium transition-colors duration-200 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      :class="canUndo ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-100 text-gray-400'"
      :disabled="!canUndo"
      @click="emit('undo')"
    >
      回退
    </button>
    <button
      type="button"
      class="flex-1 aspect-square rounded-lg border-2 font-medium transition-colors duration-200 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      :class="
        canConfirm
          ? 'border-[#0C359E] bg-[#0C359E] text-white hover:bg-[#0C359E]/90'
          : 'border-gray-300 bg-gray-200 text-gray-500'
      "
      :disabled="!canConfirm"
      @click="emit('confirm')"
    >
      ✓
    </button>
  </div>
</template>
