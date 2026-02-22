<script setup lang="ts">
import { useDeviceAdapt } from '../composables/useDeviceAdapt';
import RotatePrompt from '../components/RotatePrompt.vue';
// import LevelStrip from '../components/LevelStrip.vue'; // 已禁用：级数进度移至 ScoreCard 两侧
import LevelProgressBars from '../components/LevelProgressBars.vue';
import ScoreCard from '../components/ScoreCard.vue';
import SidePanel from '../components/SidePanel.vue';

const { showRotatePrompt } = useDeviceAdapt();
</script>

<template>
  <div class="relative w-full h-full min-h-0 bg-neutral-900 flex flex-col overflow-hidden text-gray-100 font-sans">
    <!-- 竖屏窄屏提示 -->
    <RotatePrompt :show="showRotatePrompt" />

    <!-- 主内容（横屏三段式） -->
    <div
      v-show="!showRotatePrompt"
      class="flex flex-col flex-1 min-h-0 overflow-hidden"
    >
      <!-- 顶部：级数灯条 (已禁用，改用 ScoreCard 两侧进度条) -->
      <!-- <header class="flex-shrink-0 bg-white/5 backdrop-blur-sm border-b border-white/5 z-10">
        <LevelStrip />
      </header> -->

      <!-- 中部：左右对称 -->
      <main class="flex flex-1 min-h-0 overflow-hidden items-stretch justify-between gap-2 md:gap-4 lg:gap-8 px-4 py-4 md:px-8 md:py-6 lg:px-12 max-w-full w-full">
        <!-- 左侧边栏：红方 -->
        <aside class="flex-shrink-0 flex items-stretch justify-start min-w-[120px] sm:min-w-[160px] md:min-w-[200px] lg:min-w-[260px] w-[22vw] md:w-[20vw] lg:w-[18vw] max-w-[280px]">
          <SidePanel side="red" />
        </aside>

        <!-- 中央区域：左右进度条 + 积分卡片 -->
        <section class="flex flex-1 min-h-0 min-w-0 items-center justify-center">
          <LevelProgressBars>
            <ScoreCard class="flex-1 w-full max-w-full min-h-0" />
          </LevelProgressBars>
        </section>

        <!-- 右侧边栏：蓝方 -->
        <aside class="flex-shrink-0 flex items-stretch justify-end min-w-[120px] sm:min-w-[160px] md:min-w-[200px] lg:min-w-[260px] w-[22vw] md:w-[20vw] lg:w-[18vw] max-w-[280px]">
          <SidePanel side="blue" />
        </aside>
      </main>
    </div>
  </div>
</template>
