// 需求：1，实现左右滑动切换显示歌词和关闭歌词
//      2，歌词视图需要动画效果
//      3，用cd 下方滑块表示当前现实的视图，左边则显示cd，右边则显示歌词

import { ref } from 'vue'

export default function useMiddleInteractive() {
  // 滑动过程中显示的视图层
  const currentShow = ref('cd')
  // 当前cd的透明度随偏移量变化
  const middleLStyle = ref(null)
  // 滑动时的动画效果
  const middleRStyle = ref(null)

  const touch = {}
  let currentView = 'cd'

  function onMiddleTouchStart(e) {
    // 获取触点的初始位置
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
    touch.directionLocked = ''
  }

  function onMiddleTouchMove(e) {
    // 计算当前偏移量
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // 判断当前滑动锁的值
    if (!touch.directionLocked) {
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
    }

    if (touch.directionLocked === 'v') {
      return
    }
    // 计算滑动的偏移量
    const left = currentView === 'cd' ? 0 : -window.innerWidth
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
    // offsetWidth滑动宽度占总宽度的比例
    touch.percent = Math.abs(offsetWidth / window.innerWidth)

    if (currentView === 'cd') {
      currentShow.value = touch.percent > 0.2 ? 'lyric' : 'cd'
    } else {
      currentShow.value = touch.percent < 0.8 ? 'cd' : 'lyric'
    }

    // 调节cd涂层的透明度
    middleLStyle.value = {
      opacity: 1 - touch.percent
    }

    // 实现滑动动画
    middleRStyle.value = {
      Transform: `translate3d(${offsetWidth}px, 0, 0)`
    }
  }

  function onMiddleTouchEnd(e) {
    let offsetWidth
    let opacity
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    const duration = 300
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }

    middleRStyle.value = {
      Transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}px`
    }
  }

  // 点击歌词显示歌词页面
  function onPlayingClick() {
    currentShow.value = currentShow.value === 'cd' ? 'lyric' : 'cd'
    onMiddleTouchEnd()
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd,
    onPlayingClick
  }
}
