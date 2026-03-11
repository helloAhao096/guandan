<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../store/gameStore';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';

const store = useGameStore();

const isGameStarted = computed(() => store.history.length > 0);

const cardClass = () => {
  // 基础卡片样式：去除边框，保留背景和毛玻璃
  // 外框由 LevelProgressBars 组件提供
  return `bg-neutral-800/80 backdrop-blur-xl`;
};

const textClass = () => {
  if (!isGameStarted.value) {
    // 未开始：黑灰色荧光文字
    return 'text-gray-500 drop-shadow-[0_0_8px_rgba(150,150,150,0.3)]';
  }
  // 使用 CSS 变量颜色，并增加发光效果
  return store.attacker === 'red' 
    ? 'text-guandan-red drop-shadow-[0_0_8px_rgba(250,17,79,0.4)]' 
    : 'text-guandan-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]';
};

const bgClass = () => {
  if (!isGameStarted.value) return 'bg-gray-500';
  return store.attacker === 'red' ? 'bg-guandan-red' : 'bg-guandan-blue';
};
</script>

<template>
  <div
    class="relative flex flex-col items-center justify-center w-full h-full min-h-0 flex-1 rounded-3xl px-6 py-4 sm:px-8 sm:py-6 overflow-hidden self-center transform-gpu"
    :class="cardClass()"
  >
    <!-- 背景装饰：巨大的虚化色块，随阵营变化 -->
    <div 
      class="absolute top-1/2 left-1/2 w-3/4 h-3/4 rounded-full blur-[40px] sm:blur-[80px] opacity-20 transition-colors duration-700 pointer-events-none"
      :class="bgClass()"
      style="transform: translate3d(-50%, -50%, 0)"
    ></div>

    <!-- 皇冠 Lottie：游戏结束（过 A 胜利）时显示，使用高度过渡避免挤压下方分数 -->
    <div
      class="overflow-hidden transition-[max-height] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
      :style="{ maxHeight: store.isGameOver ? '18vmin' : '0px' }"
    >
      <div class="relative z-10 w-[20vmin] h-[20vmin] min-w-[60px] min-h-[60px] sm:min-w-[72px] sm:min-h-[72px] mx-auto flex items-center justify-center">
        <Transition name="crown-inner">
          <DotLottieVue
            v-if="store.isGameOver"
            style="height: 100%; width: 100%"
            autoplay
            loop
            src="/animations/Crown Drop.lottie"
          />
        </Transition>
      </div>
    </div>

    <!-- 大数字：按视口比例自适应，占满可用空间 -->
    <!-- 使用 key 触发数字切换动画 -->
    <Transition name="slide-fade" mode="out-in">
      <div 
        :key="store.currentLevel"
        class="relative z-10 flex flex-1 items-center justify-center min-h-0"
      >
        <span 
          class="score-number font-bold select-none tabular-nums transition-colors duration-300 block leading-none tracking-tight"
          :class="textClass()"
        >
          {{ store.currentLevel }}
        </span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 分数数字：与 SidePanel watermark 互换后，主视觉更大
 * - 小屏：6rem
 * - 常规：28vw
 * - 大屏：14rem 上限
 */
.score-number {
  font-size: clamp(6rem, 28vw, 14rem);
}

.slide-fade-enter-active {
  transition: all 0.4s var(--ease-out-expo);
}

.slide-fade-leave-active {
  transition: all 0.3s var(--ease-out-quart);
}

.slide-fade-enter-from {
  transform: translateY(30px) scale(0.9);
  opacity: 0;
  filter: blur(4px);
}

.slide-fade-leave-to {
  transform: translateY(-30px) scale(1.1);
  opacity: 0;
  filter: blur(4px);
}

/* 皇冠容器高度过渡：为分数区域预留空间，避免突兀挤压 */
/* 皇冠内部：延迟淡入 + 轻微缩放，与容器展开同步 */
.crown-inner-enter-active {
  transition: opacity 0.6s ease 0.2s, transform 0.6s var(--ease-out-expo) 0.2s;
}
.crown-inner-enter-from {
  opacity: 0;
  transform: scale(0.7);
}
.crown-inner-leave-active {
  transition: opacity 0.25s ease;
}
.crown-inner-leave-to {
  opacity: 0;
}
</style>
