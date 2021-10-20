import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'

export default function useCd() {
  const cdRef = ref(null)
  const cdImageRef = ref(null)

  // 动画根据播放状态控制，引入playing
  const store = useStore()
  const playing = computed(() => {
    return store.state.playing
  })

  // 根据播放状态添加动画效果
  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })

  // 监听playing的变化
  watch(playing, (newPlaying) => {
    // 判断新的playing值是否为true，为不为 true则记录此时的transform值
    if (!newPlaying) {
      // 同步wrapper与 img的transform值
      asycTransform(cdRef.value, cdImageRef.value)
    }
  })

  // 同步内外transform值
  function asycTransform(wrapper, inner) {
    // 获取外层初始旋转角度
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform)
  }

  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}
