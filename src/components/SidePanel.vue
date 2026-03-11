<script setup lang="ts">
import { computed } from 'vue';
import { CircleArrowLeft, CircleArrowRight } from 'lucide-vue-next';
import { useGameStore, LEVELS } from '../store/gameStore';
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

// 双方当前级数
const redLevel = computed(() => LEVELS[store.redLevelIndex]);
const blueLevel = computed(() => LEVELS[store.blueLevelIndex]);

// 是否有待确认的结果且属于本方
const canConfirm = computed(() => {
  return store.pendingResult !== null && store.pendingWinner === props.side;
});

// 是否可以撤销 (全局)
const canUndo = computed(() => store.history.length > 0);
</script>

<template>
  <div class="side-panel-root relative flex flex-col-reverse items-stretch gap-2 sm:gap-3 lg:gap-6 w-full h-full min-h-0 px-2 sm:px-3 lg:px-4 py-2 sm:py-4 lg:py-6 overflow-hidden">
    <!-- 中心 watermark：实心半透明灰色 -->
    <div class="side-watermark" aria-hidden="true">
      {{ side === 'red' ? redLevel : blueLevel }}
    </div>
    <!-- 主内容区：置于 watermark 之上 -->
    <div class="relative z-10 flex flex-col-reverse items-stretch gap-2 sm:gap-3 lg:gap-6 w-full flex-1 min-h-0">
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

    <!-- 结果按钮组 (中间层)：移动端单行无滚动，大屏垂直堆叠 -->
    <div class="flex-1 min-h-0 w-full flex flex-col justify-center overflow-hidden py-1 lg:py-2">
      <ResultButtons
        :side="side"
        :selected-result="store.pendingResult"
        :selected-winner="store.pendingWinner"
        @select="handleSelect"
      />
    </div>

    <!-- 状态指示器 (最上层)：箭头；容器与箭头按断点等比放大，保证多端比例协调 -->
    <div
      class="flex-shrink-0 h-12 sm:h-14 lg:h-24 w-full flex items-center justify-center overflow-visible"
    >
        <Transition :name="side === 'red' ? 'arrow-in-left' : 'arrow-in-right'">
          <span
            v-if="showArrow"
            class="arrow-wrapper inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 lg:w-20 lg:h-20 shrink-0"
          >
            <svg class="absolute w-0 h-0" aria-hidden="true">
              <defs>
                <filter :id="`arrow-stroke-glow-${side}`" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur2" />
                  <feFlood flood-color="#22c55e" flood-opacity="0.9" result="color" />
                  <feComposite in="color" in2="blur2" operator="in" result="glow2" />
                  <feFlood flood-color="#22c55e" flood-opacity="0.5" result="color2" />
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
              :class="['arrow-icon w-full h-full text-[#22c55e]']"
              :style="{ filter: `url(#arrow-stroke-glow-${side})` }"
            />
          </span>
        </Transition>
    </div>
    </div>
  </div>
</template>

<style scoped>
/* 中心 watermark：实心半透明灰色，作为背景弱化
 */
.side-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 0;
  transform: translate(-50%, -50%);
  font-size: clamp(2.5rem, 16vmin, 8rem);
  font-weight: 800;
  line-height: 1;
  color: rgba(115, 115, 115, 0.18);
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

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

/* 红方（左侧）：箭头从左侧滑入；位移随断点略增，与箭头尺寸成比例 */
.arrow-in-left-enter-active,
.arrow-in-left-leave-active {
  transition: all 0.4s var(--ease-out-expo);
}
.arrow-in-left-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}
.arrow-in-left-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
@media (min-width: 1024px) {
  .arrow-in-left-enter-from {
    transform: translateX(-32px);
  }
  .arrow-in-left-leave-to {
    transform: translateX(-24px);
  }
}

/* 蓝方（右侧）：箭头从右侧滑入 */
.arrow-in-right-enter-active,
.arrow-in-right-leave-active {
  transition: all 0.4s var(--ease-out-expo);
}
.arrow-in-right-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.arrow-in-right-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
@media (min-width: 1024px) {
  .arrow-in-right-enter-from {
    transform: translateX(32px);
  }
  .arrow-in-right-leave-to {
    transform: translateX(24px);
  }
}
</style>
