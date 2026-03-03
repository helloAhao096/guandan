<script setup lang="ts">
import Scoreboard from "@/pages/Scoreboard.vue";
import { Github, Globe, Mail } from "lucide-vue-next";

const GITHUB_URL = "https://github.com/helloAhao096/guandan";
const BLOG_URL = "https://blog.mapin.net";
const EMAIL = "helloahao@icloud.com";
</script>

<template>
  <!-- 
    First Principles: 
    On large screens (2k, 4k), the functional area should be constrained 
    to maintain usability (Fitts's Law) and visual coherence. 
    We treat the app as a "device" or "card" floating in the center 
    rather than stretching to infinity.
  -->
  <div class="w-full h-full bg-neutral-900 flex items-center justify-center overflow-hidden">
    <!-- 
      Constrain the maximum width to avoid "scattered" UI on ultra-wide screens.
      1600px is a safe upper bound that keeps side panels reachable while feeling spacious.
      Removed shadow to blend seamlessly with the background.
    -->
    <div
      class="w-full h-full max-w-[1600px] relative overflow-hidden flex flex-col"
    >
      <Scoreboard class="ts flex-1 min-h-0" />
      <!-- Footer: 固定高度、不参与 flex 伸缩，避免挤压主内容；小屏可换行 -->
      <footer
        class="flex-shrink-0 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-3 py-2 text-xs text-neutral-500"
      >
        <a
          :href="GITHUB_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 rounded hover:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        >
          <Github class="size-3.5 shrink-0" aria-hidden="true" />
          <span>GitHub</span>
        </a>
        <a
          :href="BLOG_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 rounded hover:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        >
          <Globe class="size-3.5 shrink-0" aria-hidden="true" />
          <span>WebSite</span>
        </a>
        <a
          :href="`mailto:${EMAIL}`"
          class="inline-flex items-center gap-1.5 break-all rounded hover:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        >
          <Mail class="size-3.5 shrink-0" aria-hidden="true" />
          <span>{{ EMAIL }}</span>
        </a>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.ts {
  /*transform: rotate(90deg);
  //transform-origin: center; /* 旋转原点 */
}
</style>
