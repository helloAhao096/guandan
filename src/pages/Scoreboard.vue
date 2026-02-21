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
  <div class="relative w-screen min-h-screen bg-neutral flex flex-col overflow-hidden">
    <!-- 竖屏窄屏提示 -->
    <RotatePrompt :show="showRotatePrompt" />

    <!-- 主内容（横屏三段式） -->
    <div
      v-show="!showRotatePrompt"
      class="flex flex-col flex-1 min-h-0"
    >
      <!-- 顶部：级数灯条 -->
      <header class="flex-shrink-0">
        <LevelStrip />
      </header>

      <!-- 中部：左右对称 -->
      <main class="flex flex-1 min-h-0 items-stretch gap-4 sm:gap-6 px-4 py-4">
        <!-- 左侧边栏：红方 -->
        <aside class="flex-shrink-0 flex items-center justify-center min-w-[100px] sm:min-w-[140px]">
          <SidePanel side="red" />
        </aside>

        <!-- 中央区域：卡片 + 进贡区 -->
        <section class="flex flex-col flex-1 items-center justify-center gap-4 min-w-0">
          <ScoreCard />
          <TributeDiagram />
        </section>

        <!-- 右侧边栏：蓝方 -->
        <aside class="flex-shrink-0 flex items-center justify-center min-w-[100px] sm:min-w-[140px]">
          <SidePanel side="blue" />
        </aside>
      </main>
    </div>
  </div>
</template>
