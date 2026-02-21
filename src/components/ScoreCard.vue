<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../store/gameStore';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';

const store = useGameStore();

const isGameStarted = computed(() => store.history.length > 0);

const cardClass = () => {
  // 基础卡片样式：iOS 风格圆角 + 阴影 + 毛玻璃
  let borderClass = 'border-white/20 dark:border-white/5';
  
  if (!isGameStarted.value) {
    // 未开始：黑灰色荧光边框
    borderClass = 'border-gray-500/30 shadow-[0_0_20px_-5px_rgba(100,100,100,0.3)]';
  } else if (store.attacker === 'red') {
    borderClass = 'border-guandan-red/30 shadow-[0_0_30px_-10px_var(--color-guandan-red)]';
  } else if (store.attacker === 'blue') {
    borderClass = 'border-guandan-blue/30 shadow-[0_0_30px_-10px_var(--color-guandan-blue)]';
  }

  return `bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl shadow-xl border ${borderClass}`;
};

const textClass = () => {
  if (!isGameStarted.value) {
    // 未开始：黑灰色荧光文字
    return 'text-gray-400 dark:text-gray-500 drop-shadow-[0_0_8px_rgba(150,150,150,0.3)]';
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
    class="relative flex flex-col items-center justify-center w-full h-full rounded-3xl px-6 py-4 sm:px-8 sm:py-6 transition-all duration-500 transform hover:scale-[1.02] overflow-hidden group"
    :class="cardClass()"
  >
    <!-- 背景装饰：巨大的虚化色块，随阵营变化 -->
    <div 
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full blur-[80px] opacity-20 transition-colors duration-700 pointer-events-none"
      :class="bgClass()"
    ></div>

    <!-- 皇冠 Lottie：游戏结束（过 A 胜利）时显示，使用高度过渡避免挤压下方分数 -->
    <div
      class="overflow-hidden transition-[max-height] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
      :style="{ maxHeight: store.isGameOver ? '18vmin' : '0px' }"
    >
      <div class="relative z-10 w-[20vmin] h-[20vmin] min-w-[72px] min-h-[72px] mx-auto flex items-center justify-center">
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

    <!-- 大数字 -->
    <!-- 使用 key 触发数字切换动画 -->
    <Transition name="slide-fade" mode="out-in">
      <div 
        :key="store.currentLevel"
        class="relative z-10 flex items-center justify-center"
      >
        <span 
          class="text-8xl sm:text-9xl md:text-[10rem] font-thin select-none tabular-nums transition-colors duration-300 block leading-none tracking-tighter"
          :class="textClass()"
        >
          {{ store.currentLevel }}
        </span>
      </div>
    </Transition>

    <!-- 底部微小的装饰性指示条 -->
    <div class="absolute bottom-4 sm:bottom-5 flex gap-1">
      <div class="w-1 h-1 rounded-full bg-current opacity-20"></div>
      <div class="w-1 h-1 rounded-full bg-current opacity-20"></div>
      <div class="w-1 h-1 rounded-full bg-current opacity-20"></div>
    </div>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); /* 弹性效果 */
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  transition: opacity 0.6s ease 0.2s, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s;
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
