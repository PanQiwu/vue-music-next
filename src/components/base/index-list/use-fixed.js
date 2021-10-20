import { ref, watch, computed, nextTick } from 'vue'

export function useFixed(props) {
  // 常量fixed的高度
  const TITLE_HEIGHT = 30
  // ref对象
  const groupRef = ref(null)
  // 列表的高度
  const listHeights = ref([])
  // 定义当前位置的Y值变量
  const scrollY = ref(0)
  // 当前显示的列表区间的索引值
  const currentIndex = ref(0)
  // 下一个title距离顶部的距离
  const distance = ref(0)

  // 计算fixedTitle的值
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  // 计算fixedTitle的style
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    // 计算fixed的偏移量
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT ? distanceVal - TITLE_HEIGHT : 0)
    return {
      transform: `translate3D(0, ${diff}px, 0)`
    }
  })

  // 监听props.data数据
  watch(() => props.data, async () => {
    // 等待dom更新
    await nextTick()
    calculate()
  })

  // 监听scrollY值的变化
  watch(scrollY, (newY) => {
    const listHeightsVal = listHeights.value
    // 遍历listHeightsVal获取当前顶部的列表高度和底部的列表高度
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      const heightTop = listHeightsVal[i]
      const heightBottom = listHeightsVal[i + 1]
      // 判断当前位置的Y值所在的区域，就是当前显示的列表区间
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY
      }
    }
  })

  // 求解列表的高度
  function calculate() {
    // 获取容器的子元素列表
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    let height = 0

    listHeightsVal.length = 0
    listHeightsVal.push(height)
    // 列表高度是累加起来的，计算列表高度
    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
  }
  // 获取当前滚动位置
  function onScroll(pos) {
    scrollY.value = -pos.y
  }
  console.log(fixedTitle)
  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle,
    currentIndex
  }
}
