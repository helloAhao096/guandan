<script setup lang="ts">
import { computed } from 'vue';
import { CircleArrowLeft, CircleArrowRight } from 'lucide-vue-next';
import { useGameStore } from '../store/gameStore';
import { useGameControl } from '../composables/useGameControl';
import ResultButtons from './ResultButtons.vue';
import ConfirmActions from './ConfirmActions.vue';

const props = defineProps<{
  side: 'red' | 'blue';
}>();

const store = useGameStore();
const { selectResult, confirmRound, undoRound } = useGameControl();

function handleSelect(result: import('../types/game').RoundResult) {
  selectResult(props.side, result);
}

function handleConfirm() {
  confirmRound();
}

function handleUndo() {
  undoRound();
}

// 是否是当前进攻方
const isAttacker = computed(() => store.attacker === props.side);

// 游戏未开始时（双方都是 2，无历史）不显示箭头
const showArrow = computed(() => isAttacker.value && store.history.length > 0);

// 是否有待确认的结果且属于本方
const canConfirm = computed(() => {
  return store.pendingResult !== null && store.pendingWinner === props.side;
});

// 是否可以撤销 (全局)
const canUndo = computed(() => store.history.length > 0);
</script>

<template>
  <div class="flex flex-col-reverse items-center gap-2 lg:gap-6 w-full h-full min-h-0 px-2 lg:px-4 py-2 lg:py-6">
    <!-- 确认/撤销操作区 (最底层) -->
    <ConfirmActions
      class="flex-shrink-0 transition-opacity duration-200 w-full"
      :class="{ 'opacity-50 pointer-events-none': !canConfirm && !canUndo }"
      :side="side"
      :can-confirm="canConfirm"
      :can-undo="canUndo"
      @confirm="handleConfirm"
      @undo="handleUndo"
    />

    <!-- 结果按钮组 (中间层，占主要空间) -->
    <div class="flex-1 min-h-0 w-full flex flex-col justify-center overflow-y-auto overflow-x-hidden py-1 lg:py-2">
      <ResultButtons
        :side="side"
        :selected-result="store.pendingResult"
        :selected-winner="store.pendingWinner"
        @select="handleSelect"
      />
    </div>

    <!-- 状态指示器 (最上层)：固定高度以防止布局跳动 -->
    <div
      class="flex-shrink-0 h-10 lg:h-24 w-full flex items-center justify-center overflow-visible"
    >
      <Transition :name="side === 'red' ? 'arrow-in-left' : 'arrow-in-right'">
        <span
          v-if="showArrow"
          class="arrow-wrapper inline-flex items-center justify-center w-full h-full max-w-10 max-h-10 lg:max-w-24 lg:max-h-24 min-w-8 min-h-8"
        >
          <svg class="absolute w-0 h-0" aria-hidden="true">
            <defs>
              <filter :id="`arrow-stroke-glow-${side}`" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur2" />
                <feFlood flood-color="#F5B800" flood-opacity="0.9" result="color" />
                <feComposite in="color" in2="blur2" operator="in" result="glow2" />
                <feFlood flood-color="#F5B800" flood-opacity="0.5" result="color2" />
                <feComposite in="color2" in2="blur1" operator="in" result="glow1" />
                <feMerge>
                  <feMergeNode in="glow2" />
                  <feMergeNode in="glow1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
          <component
            :is="side === 'red' ? CircleArrowLeft : CircleArrowRight"
            :class="['arrow-icon w-full h-full text-[#F5B800]']"
            :style="{ filter: `url(#arrow-stroke-glow-${side})` }"
          />
        </span>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* 箭头容器：透明背景 */
.arrow-wrapper {
  background: transparent;
  isolation: isolate;
}

/* 确保 Lucide 图标为纯线条（无填充），SVG 滤镜仅对线条发光 */
.arrow-wrapper :deep(svg) {
  fill: none;
  overflow: visible;
}

/* 红方（左侧）：箭头从左侧滑入 */
.arrow-in-left-enter-active,
.arrow-in-left-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.arrow-in-left-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}
.arrow-in-left-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}

/* 蓝方（右侧）：箭头从右侧滑入 */
.arrow-in-right-enter-active,
.arrow-in-right-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.arrow-in-right-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.arrow-in-right-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
</style>
