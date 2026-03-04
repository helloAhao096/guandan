import { onMounted, onUnmounted } from "vue";
import NoSleep from "nosleep.js";

/**
 * 屏幕常亮：首次用户交互后激活。NoSleep.js 内部使用 Wake Lock API 或视频 fallback。
 */
export function useWakeLock() {
  let noSleep: InstanceType<typeof NoSleep> | null = null;

  onMounted(() => {
    noSleep = new NoSleep();
    const enable = () => {
      document.removeEventListener("click", enable, false);
      document.removeEventListener("touchstart", enable, false);
      noSleep?.enable();
    };
    document.addEventListener("click", enable, false);
    document.addEventListener("touchstart", enable, false);
  });

  onUnmounted(() => {
    noSleep?.disable();
    noSleep = null;
  });
}
