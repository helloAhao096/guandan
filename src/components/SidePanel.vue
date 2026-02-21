<script setup lang="ts">
import { useGameStore } from '../store/gameStore';
import ResultButtons from './ResultButtons.vue';
import ConfirmActions from './ConfirmActions.vue';

const props = defineProps<{
  side: 'red' | 'blue';
}>();

const store = useGameStore();

function handleSelect(result: import('../types/game').RoundResult) {
  store.selectResult(props.side, result);
}

function handleConfirm() {
  store.confirm();
}

function handleUndo() {
  store.undo();
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <!-- 箭头：往外指；未开始时都不亮，选择加分或确认后头游方亮金色 -->
    <div
      class="text-2xl transition-colors duration-200"
      :class="store.history.length > 0 && (store.pendingWinner === side || (store.pendingWinner === null && store.attacker === side)) ? 'text-[#D4AF37]' : 'text-gray-500 opacity-50'"
    >
      <span v-if="side === 'red'" class="inline-block">◀</span>
      <span v-else class="inline-block">▶</span>
    </div>

    <!-- 结果按钮 -->
    <ResultButtons
      :side="side"
      :selected-result="store.pendingResult"
      :selected-winner="store.pendingWinner"
      @select="handleSelect"
    />

    <!-- 回退 + 确认 -->
    <ConfirmActions
      :can-confirm="store.pendingResult !== null"
      :can-undo="store.history.length > 0"
      @confirm="handleConfirm"
      @undo="handleUndo"
    />
  </div>
</template>
