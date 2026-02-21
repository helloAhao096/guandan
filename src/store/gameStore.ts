import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Attacker, RoundResult, GameSnapshot, TributeRelation } from '../types/game';

// 2 到 A，再 A1/A2/A3（打A头游+末游时递进，A3 再不过则回2）
export const LEVELS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', 'A1', 'A2', 'A3'];
const A_INDEX = 12;
const A1_INDEX = 13;
const A2_INDEX = 14;
const A3_INDEX = 15;

export const useGameStore = defineStore('game', () => {
  const redLevelIndex = ref(0);
  const blueLevelIndex = ref(0);
  const attacker = ref<Attacker>('red');
  const pendingResult = ref<RoundResult | null>(null);
  const pendingWinner = ref<'red' | 'blue' | null>(null);
  const history = ref<GameSnapshot[]>([]);
  const lastTribute = ref<TributeRelation | null>(null);
  const isGameOver = ref(false); // 过A 后为 true

  const currentLevel = computed(() => {
    const index = attacker.value === 'red' ? redLevelIndex.value : blueLevelIndex.value;
    return LEVELS[index];
  });

  const isTie = computed(() => redLevelIndex.value === blueLevelIndex.value);

  // 单侧选择：点击哪侧传哪方；过A 后不可再选
  function selectResult(winner: 'red' | 'blue', result: RoundResult) {
    if (isGameOver.value) return;
    pendingWinner.value = winner;
    pendingResult.value = result;
  }

  function confirm() {
    if (pendingResult.value === null || pendingWinner.value === null || isGameOver.value) return;

    history.value.push({
      redLevelIndex: redLevelIndex.value,
      blueLevelIndex: blueLevelIndex.value,
      attacker: attacker.value,
      lastTribute: lastTribute.value ? JSON.parse(JSON.stringify(lastTribute.value)) : null,
    });

    const result = pendingResult.value;
    const winner = pendingWinner.value;

    // 贡牌：根据 winner + result 计算 rankings
    if (result === 3) {
      lastTribute.value = {
        type: 'double',
        rankings: {
          red: winner === 'red' ? [1, 2] : [3, 4],
          blue: winner === 'blue' ? [1, 2] : [3, 4],
        },
      };
    } else if (result === 2) {
      lastTribute.value = {
        type: 'single',
        rankings: {
          red: winner === 'red' ? [1, 3] : [2, 4],
          blue: winner === 'blue' ? [1, 3] : [2, 4],
        },
      };
    } else {
      lastTribute.value = {
        type: 'single',
        rankings: {
          red: winner === 'red' ? [1, 4] : [2, 3],
          blue: winner === 'blue' ? [1, 4] : [2, 3],
        },
      };
    }

    // 升级与过A（百科：A级必打；过A=打A方头游且搭档不是末游；头游+末游→A1→A2→A3→回2）
    const attackerLevel = attacker.value === 'red' ? redLevelIndex.value : blueLevelIndex.value;
    const isInAZone = attackerLevel >= A_INDEX && attackerLevel <= A3_INDEX;

    if (isInAZone && winner === attacker.value && result === 1) {
      // 打A方头游+末游：A→A1→A2→A3→回2
      const nextLevel =
        attackerLevel === A_INDEX
          ? A1_INDEX
          : attackerLevel === A1_INDEX
            ? A2_INDEX
            : attackerLevel === A2_INDEX
              ? A3_INDEX
              : 0; // A3 不过回2
      if (winner === 'red') {
        redLevelIndex.value = nextLevel;
      } else {
        blueLevelIndex.value = nextLevel;
      }
    } else {
      // 正常升级或过A
      if (winner === 'red') {
        redLevelIndex.value = Math.min(redLevelIndex.value + result, A_INDEX);
      } else {
        blueLevelIndex.value = Math.min(blueLevelIndex.value + result, A_INDEX);
      }
      if (isInAZone && winner === attacker.value && (result === 2 || result === 3)) {
        isGameOver.value = true; // 过A，游戏结束
      }
    }

    attacker.value = winner;
    pendingResult.value = null;
    pendingWinner.value = null;
  }

  function undo() {
    const lastSnapshot = history.value.pop();
    if (lastSnapshot) {
      redLevelIndex.value = lastSnapshot.redLevelIndex;
      blueLevelIndex.value = lastSnapshot.blueLevelIndex;
      attacker.value = lastSnapshot.attacker;
      lastTribute.value = lastSnapshot.lastTribute;
      isGameOver.value = false;
    }
    pendingResult.value = null;
    pendingWinner.value = null;
  }

  function reset() {
    redLevelIndex.value = 0;
    blueLevelIndex.value = 0;
    attacker.value = 'red';
    pendingResult.value = null;
    pendingWinner.value = null;
    history.value = [];
    lastTribute.value = null;
    isGameOver.value = false;
  }

  return {
    redLevelIndex,
    blueLevelIndex,
    attacker,
    pendingResult,
    pendingWinner,
    history,
    lastTribute,
    isGameOver,
    currentLevel,
    isTie,
    selectResult,
    confirm,
    undo,
    reset,
  };
});
