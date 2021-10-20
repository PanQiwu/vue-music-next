// 实现迷你播放器左右滑动切歌
import { ref, watch, computed, nextTick, onMounted, onUnmounted, onActivated } from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

export default function useMiniSlider() {
  // 定义滑动对象实例
  const sliderWrapperRef = ref(null)
  const slider = ref(null)
  const store = useStore()
  // 监听页面是否渲染，1，要获取fullscreen 2，playlist
  const fullScreen = computed(() => store.state.fullScreen)
  const playlist = computed(() => store.state.playlist)
  const currentIndex = computed(() => store.state.currentIndex)

  const sliderShow = computed(() => {
    return !fullScreen.value && !!playlist.value
  })

  onMounted(() => {
    let sliderVal
    watch(sliderShow, async (newSliderShow) => {
      if (!newSliderShow) {
        return
      }
      await nextTick()
      // 如果sliderShow位true 则创建BScroll对象
      if (!sliderVal) {
        sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
          click: true,
          scrollX: true,
          scrollY: false,
          momentum: false,
          bounce: false,
          probeType: 2,
          slide: {
            autoplay: false,
            loop: true
          }
        })
        // 监听sliderpageChanged事件,page切换事切换对应的歌去
        sliderVal.on('slidePageChanged', ({ pageX }) => {
          store.commit('setCurrentIndex', pageX)
        })
      } else {
        sliderVal.refresh()
      }
      sliderVal.goToPage(currentIndex.value, 0, 0)
    })

    // 监听当前播放的歌曲显示对应的歌名和歌手
    watch(currentIndex, (newIndex) => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })

    watch(playlist, async (newList) => {
      if (sliderVal && sliderShow.value && newList.lentgth) {
        await nextTick()
        sliderVal.refresh()
      }
    })
  })

  // 销毁
  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })

  onActivated(() => {
    slider.value.disable()
  })

  return {
    slider,
    sliderWrapperRef
  }
}
