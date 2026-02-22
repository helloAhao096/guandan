import { useGameStore, A_INDEX, A2_INDEX, A3_INDEX } from '../store/gameStore';
import type { RoundResult } from '../types/game';

export function useGameControl() {
  const store = useGameStore();

  // 选择结果
  function selectResult(winner: 'red' | 'blue', result: RoundResult) {
    if (store.isGameOver) return;
    store.setPending(winner, result);
  }

  // 确认结果并推进游戏
  function confirmRound() {
    if (store.pendingResult === null || store.pendingWinner === null || store.isGameOver) return;

    // 1. 记录历史快照
    store.pushHistory({
      redLevelIndex: store.redLevelIndex,
      blueLevelIndex: store.blueLevelIndex,
      attacker: store.attacker,
      lastTribute: store.lastTribute ? JSON.parse(JSON.stringify(store.lastTribute)) : null,
    });

    const result = store.pendingResult;
    const winner = store.pendingWinner;

    // 2. 计算贡牌关系
    calculateTribute(winner, result);

    // 3. 计算级别变更（赢家加分，红蓝同一套逻辑）
    calculateLevelProgression(winner, result);

    // 4. 更新攻击方和清理状态
    store.setAttacker(winner);
    store.setPending(null, null);
  }

  // 计算贡牌
  function calculateTribute(winner: 'red' | 'blue', result: RoundResult) {
    let tribute = null;
    if (result === 3) { // 双下
      tribute = {
        type: 'double',
        rankings: {
          red: winner === 'red' ? [1, 2] : [3, 4],
          blue: winner === 'blue' ? [1, 2] : [3, 4],
        },
      };
    } else if (result === 2) { // 单下
      tribute = {
        type: 'single',
        rankings: {
          red: winner === 'red' ? [1, 3] : [2, 4],
          blue: winner === 'blue' ? [1, 3] : [2, 4],
        },
      };
    } else { // 平局/保级 (头游+末游)
      tribute = {
        type: 'single',
        rankings: {
          red: winner === 'red' ? [1, 4] : [2, 3],
          blue: winner === 'blue' ? [1, 4] : [2, 3],
        },
      };
    }
    // @ts-ignore
    store.setLastTribute(tribute);
  }

  // 计算级别变更逻辑 (核心规则)
  // 赢家直接加分，红蓝同一套逻辑；赢家成为下一轮庄家
  function calculateLevelProgression(winner: 'red' | 'blue', result: RoundResult) {
    const winnerLevel = winner === 'red' ? store.redLevelIndex : store.blueLevelIndex;
    const isInAZone = winnerLevel >= A_INDEX; // A, A2, A3

    if (isInAZone) {
      // A级阶段逻辑
      // 1. 双下 (result=3) 或 单下 (result=2) -> 过A成功，游戏结束
      // 2. 保级 (result=1, 头游+末游) -> A->A2->A3->回2
      if (result === 3 || result === 2) {
        store.setGameOver(true);
      } else if (result === 1) {
        let nextLevel = 0;
        if (winnerLevel === A_INDEX) nextLevel = A2_INDEX;
        else if (winnerLevel === A2_INDEX) nextLevel = A3_INDEX;
        else if (winnerLevel === A3_INDEX) nextLevel = 0;
        store.setLevel(winner, nextLevel);
      }
    } else {
      // 正常升级逻辑 (2 -> K)：赢家按结果加分
      const levelIncrease = result;
      const nextLevel = Math.min(winnerLevel + levelIncrease, A_INDEX);
      store.setLevel(winner, nextLevel);
    }
  }

  // 撤销
  function undoRound() {
    const lastSnapshot = store.popHistory();
    if (lastSnapshot) {
      store.setLevel('red', lastSnapshot.redLevelIndex);
      store.setLevel('blue', lastSnapshot.blueLevelIndex);
      store.setAttacker(lastSnapshot.attacker);
      store.setLastTribute(lastSnapshot.lastTribute);
      store.setGameOver(false);
    }
    store.setPending(null, null);
  }

  // 重置
  function resetGame() {
    store.resetState();
  }

  return {
    selectResult,
    confirmRound,
    undoRound,
    resetGame,
  };
}
