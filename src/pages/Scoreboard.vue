<script setup lang="ts">
import { useDeviceAdapt } from '../composables/useDeviceAdapt';
import RotatePrompt from '../components/RotatePrompt.vue';
import LevelStrip from '../components/LevelStrip.vue';
import ScoreCard from '../components/ScoreCard.vue';
import TributeDiagram from '../components/TributeDiagram.vue';
import SidePanel from '../components/SidePanel.vue';

const { showRotatePrompt } = useDeviceAdapt();
</script>

<template>
  <!-- 背景色改为浅灰，增加质感 -->
  <div class="relative w-screen min-h-screen bg-gray-50 dark:bg-neutral-900 flex flex-col overflow-hidden text-gray-900 dark:text-gray-100 font-sans">
    <!-- 竖屏窄屏提示 -->
    <RotatePrompt :show="showRotatePrompt" />

    <!-- 主内容（横屏三段式） -->
    <div
      v-show="!showRotatePrompt"
      class="flex flex-col flex-1 min-h-0"
    >
      <!-- 顶部：级数灯条 (Apple Watch 风格) -->
      <header class="flex-shrink-0 bg-black/5 dark:bg-white/5 backdrop-blur-sm border-b border-black/5 dark:border-white/5 z-10">
        <LevelStrip />
      </header>

      <!-- 中部：左右对称 -->
      <main class="flex flex-1 min-h-0 items-stretch justify-between gap-4 sm:gap-8 px-8 py-6 md:px-12 max-w-full w-full">
        <!-- 左侧边栏：红方 -->
        <aside class="flex-shrink-0 flex items-end justify-start min-w-[120px] sm:min-w-[160px]">
          <SidePanel side="red" />
        </aside>

        <!-- 中央区域：卡片 + 进贡区 -->
        <section class="flex flex-col flex-1 items-stretch justify-center gap-3 sm:gap-5 min-w-0 max-w-md w-full mx-auto">
          <!-- ScoreCard 占 3/4 -->
          <div class="flex-[3] min-h-0 flex flex-col">
            <ScoreCard class="flex-1 w-full" />
          </div>
          
          <!-- 分隔线 -->
          <div class="w-full h-px bg-gray-200 dark:bg-gray-700"></div>
          
          <!-- TributeDiagram 占 1/4 -->
          <div class="flex-[1] min-h-0 flex flex-col">
            <TributeDiagram class="flex-1 w-full" />
          </div>
        </section>

        <!-- 右侧边栏：蓝方 -->
        <aside class="flex-shrink-0 flex items-end justify-end min-w-[120px] sm:min-w-[160px]">
          <SidePanel side="blue" />
        </aside>
      </main>
    </div>
  </div>
</template>
