import { computed } from 'vue'
import { useStore } from 'vuex'
import { PLAY_MODE } from '@/assets/js/contant'

export function useMode() {
  const store = useStore()
  const playMode = computed(() => store.state.playMode)
  // 图标样式
  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    // 判断当前播放模式
    return playModeVal === PLAY_MODE.sequence ? 'icon-sequence' : playModeVal === PLAY_MODE.random ? 'icon-random' : 'icon-loop'
  })

  function changeMode() {
    const mode = (playMode.value + 1) % 3
    store.dispatch('changeMode', mode)
  }
  return {
    modeIcon,
    changeMode
  }
}
