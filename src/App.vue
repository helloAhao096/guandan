<script setup lang="ts">
import Scoreboard from "@/pages/Scoreboard.vue";
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
      <Scoreboard class="ts flex-1" />
    </div>
  </div>
</template>

<style scoped>
.ts {
  /*transform: rotate(90deg);
  //transform-origin: center; /* 旋转原点 */
}
</style>
