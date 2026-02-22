import { useGameStore, A_INDEX, A2_INDEX, A3_INDEX } from '../store/gameStore';
import type { RoundResult, Attacker } from '../types/game';

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
    const currentAttacker = store.attacker;

    // 2. 计算贡牌关系
    calculateTribute(winner, result);

    // 3. 计算级别变更
    calculateLevelProgression(winner, result, currentAttacker);

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
  function calculateLevelProgression(winner: 'red' | 'blue', result: RoundResult, currentAttacker: Attacker) {
    const attackerLevel = currentAttacker === 'red' ? store.redLevelIndex : store.blueLevelIndex;
    const isInAZone = attackerLevel >= A_INDEX; // A, A2, A3

    // 只有赢家是当前攻击方时，才涉及升级逻辑
    // 如果防守方赢了 (winner !== currentAttacker)，通常只是换庄，级别不变 (除非有特殊规则，这里按标准规则：换庄不升级)
    
    if (winner === currentAttacker) {
      if (isInAZone) {
        // A级阶段逻辑
        // 规则：
        // 1. 双下 (result=3) 或 单下 (result=2) -> 过A成功，游戏结束
        // 2. 保级 (result=1, 头游+末游) -> 
        //    A -> A2
        //    A2 -> A3
        //    A3 -> 回2 (0)
        
        if (result === 3 || result === 2) {
          store.setGameOver(true);
          // 级别保持在 A/A2/A3 不变，显示胜利状态
        } else if (result === 1) {
          let nextLevel = 0;
          if (attackerLevel === A_INDEX) nextLevel = A2_INDEX;
          else if (attackerLevel === A2_INDEX) nextLevel = A3_INDEX;
          else if (attackerLevel === A3_INDEX) nextLevel = 0; // A3 失败回 2

          store.setLevel(winner, nextLevel);
        }
      } else {
        // 正常升级逻辑 (2 -> K)
        // result: 3(+3级), 2(+2级), 1(+1级)
        // 注意：不能超过 A (index 12)
        // 如果当前是 K (11)，+1 -> A, +2 -> A, +3 -> A
        
        const levelIncrease = result; 
        const nextLevel = Math.min(attackerLevel + levelIncrease, A_INDEX);
        store.setLevel(winner, nextLevel);
      }
    } else {
      // 防守方赢了 -> 换庄，级别不变
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
