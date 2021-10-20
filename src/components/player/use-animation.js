import { ref } from 'vue'
import animations from 'create-keyframe-animation'

export default function useAnimation() {
  const cdWrapperRef = ref(null)
  // 设置标识符
  let entering = false
  let leaving = false
  function enter(el, done) {
    // 判断动画之行状态，保证执行完了leave动画再继续执行后进入逻辑
    if (leaving) {
      afterLeave()
    }
    entering = true
    const { x, y, scale } = getPosAndScale()
    // 动画css代码
    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      100: {
        transform: 'translate3d(0 , 0, 0) scale(1)'
      }
    }
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    })
    animations.runAnimation(cdWrapperRef.value, 'move', done)
  }

  function afterEnter() {
    // 初始化数据
    animations.unregisterAnimation('move')
    cdWrapperRef.value.style.animation = ''
    entering = false
  }

  function leave(el, done) {
    if (entering) {
      afterEnter()
    }
    leaving = true
    // 获取动画数据
    const { x, y, scale } = getPosAndScale()
    const cdWrapperRefVal = cdWrapperRef.value
    cdWrapperRefVal.style.transition = 'all.6s cubic-bezier(0.45, 0, 0.55, 1)'
    cdWrapperRefVal.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    cdWrapperRefVal.addEventListener('transitionend', next)

    function next() {
      cdWrapperRefVal.removeEventListener('transitionend', next)
      done()
    }
  }

  function afterLeave() {
    // 将所有动画数据初始化
    const cdWrapperRefVal = cdWrapperRef.value
    cdWrapperRefVal.style.transition = ''
    cdWrapperRefVal.style.transform = ''
    leaving = false
  }
  // 获取动画所需的数据
  function getPosAndScale() {
    // mini cd的直径
    const targetWidth = 40
    // 小cd圆心距离左侧的距离
    const paddingleft = 40
    // 小cd圆心距离底部的距离
    const paddingBottom = 30
    // 大圆心距离顶部的距离
    const paddingTop = 85
    // 大圆直径
    const width = window.innerWidth / 2 - paddingleft
    // 计算x,y,scale的偏移量
    const x = -(window.innerWidth / 2 - paddingleft)
    const y = window.innerHeight - paddingTop - paddingBottom - width / 2
    const scale = targetWidth / width

    return {
      x,
      y,
      scale
    }
  }

  return {
    cdWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave
  }
}
