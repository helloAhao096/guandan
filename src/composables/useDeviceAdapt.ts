import { ref, computed, onMounted, onUnmounted } from 'vue';

const SMALL_PHONE_THRESHOLD = 500;

export function useDeviceAdapt() {
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 0);
  const height = ref(typeof window !== 'undefined' ? window.innerHeight : 0);

  const isPortrait = computed(() => width.value < height.value);
  const isSmallPhone = computed(() => {
    const short = Math.min(width.value, height.value);
    return short < SMALL_PHONE_THRESHOLD;
  });
  const showRotatePrompt = computed(() => isSmallPhone.value && isPortrait.value);

  function updateSize() {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  }

  onMounted(() => {
    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize);
    window.removeEventListener('orientationchange', updateSize);
  });

  return { isPortrait, isSmallPhone, showRotatePrompt };
}
