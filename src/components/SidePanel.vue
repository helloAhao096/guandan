<script setup lang="ts">
import { computed } from 'vue';
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

// 是否是当前进攻方
const isAttacker = computed(() => store.attacker === props.side);

// 是否有待确认的结果且属于本方
const canConfirm = computed(() => {
  return store.pendingResult !== null && store.pendingWinner === props.side;
});

// 是否可以撤销 (全局)
const canUndo = computed(() => store.history.length > 0);
</script>

<template>
  <div class="flex flex-col-reverse items-center gap-3 w-full max-w-[160px] pb-2">
    <!-- 确认/撤销操作区 (最底层) -->
    <ConfirmActions
      class="transition-opacity duration-200 w-full"
      :class="{ 'opacity-50 pointer-events-none': !canConfirm && !canUndo }"
      :can-confirm="canConfirm"
      :can-undo="canUndo"
      @confirm="handleConfirm"
      @undo="handleUndo"
    />

    <!-- 结果按钮组 (中间层) -->
    <ResultButtons
      :side="side"
      :selected-result="store.pendingResult"
      :selected-winner="store.pendingWinner"
      @select="handleSelect"
    />

    <!-- 状态指示器 (最上层) -->
    <div 
      class="flex flex-col items-center justify-center w-8 h-8 rounded-full transition-all duration-300 shadow-sm mb-2"
      :class="isAttacker 
        ? (side === 'red' ? 'bg-guandan-red/10 text-guandan-red ring-2 ring-guandan-red/20' : 'bg-guandan-blue/10 text-guandan-blue ring-2 ring-guandan-blue/20')
        : 'bg-transparent text-transparent'"
    >
      <svg v-if="side === 'red'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clip-rule="evenodd" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
      </svg>
    </div>
  </div>
</template>
