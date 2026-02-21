<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../store/gameStore';

const store = useGameStore();

const hasHistory = computed(() => store.history.length > 0);
const tribute = computed(() => store.lastTribute);

// 四块位置：grid 顺序 [左顶, 右顶, 左底, 右底] = [red0, blue0, red1, blue1]
const blocks = computed(() => {
  if (!tribute.value) {
    return [
      { rank: null, team: 'red' as const },
      { rank: null, team: 'blue' as const },
      { rank: null, team: 'red' as const },
      { rank: null, team: 'blue' as const },
    ];
  }
  const r = tribute.value.rankings;
  return [
    { rank: r.red[0], team: 'red' as const },
    { rank: r.blue[0], team: 'blue' as const },
    { rank: r.red[1], team: 'red' as const },
    { rank: r.blue[1], team: 'blue' as const },
  ];
});

// 连接线：单贡 4→1；双贡 4→1、3→2
const lines = computed(() => {
  if (!tribute.value || !hasHistory.value) return [];
  const [lt, rt, lb, rb] = blocks.value;
  const positions = [
    { rank: lt.rank!, x: 25, y: 25 },
    { rank: rt.rank!, x: 75, y: 25 },
    { rank: lb.rank!, x: 25, y: 75 },
    { rank: rb.rank!, x: 75, y: 75 },
  ];
  const byRank = Object.fromEntries(positions.map((p) => [p.rank, p]));
  const result: { x1: number; y1: number; x2: number; y2: number }[] = [];
  if (byRank[4] && byRank[1]) {
    result.push({
      x1: byRank[4].x,
      y1: byRank[4].y,
      x2: byRank[1].x,
      y2: byRank[1].y,
    });
  }
  if (tribute.value.type === 'double' && byRank[3] && byRank[2]) {
    result.push({
      x1: byRank[3].x,
      y1: byRank[3].y,
      x2: byRank[2].x,
      y2: byRank[2].y,
    });
  }
  return result;
});
</script>

<template>
  <div class="flex flex-col items-center gap-2 py-2">
    <!-- 四方块 + 连接线 -->
    <div class="relative w-32 h-24 sm:w-36 sm:h-28">
      <!-- 连接线 (SVG 覆盖) -->
      <svg
        v-if="hasHistory && lines.length > 0"
        class="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <line
          v-for="(line, i) in lines"
          :key="i"
          :x1="`${line.x1}%`"
          :y1="`${line.y1}%`"
          :x2="`${line.x2}%`"
          :y2="`${line.y2}%`"
          stroke="#6b7280"
          stroke-width="1"
        />
      </svg>
      <!-- 4 块 -->
      <div class="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1">
        <div
          v-for="(block, i) in blocks"
          :key="i"
          class="flex items-center justify-center rounded border-2 border-white/30 min-h-0 transition-all duration-200"
          :class="hasHistory ? (block.team === 'red' ? 'bg-[#9e0000]' : 'bg-[#0C359E]') : 'bg-gray-500'"
        >
          <span
            v-if="hasHistory && block.rank != null"
            class="text-white text-lg font-bold"
          >
            {{ block.rank }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
