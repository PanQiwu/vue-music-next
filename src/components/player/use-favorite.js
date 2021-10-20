import { computed } from 'vue'
import { useStore } from 'vuex'
import { save, remove } from '../../assets/js/array-store'
import { FAVORITE_KEY } from '@/assets/js/contant'

export function useFavorite() {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  const maxlen = 100
  // 获取收藏按钮的样式
  function getFavoriteIcon(song) {
    const isFavo = isFavorite(song)
    return isFavo ? 'icon-favorite' : 'icon-not-favorite'
  }
  // 按钮点击事件
  function toggleFavorite(song) {
    let list
    const isFavo = isFavorite(song)
    // 判断歌曲是否在收藏列表内
    if (isFavo) {
      // remove
      list = remove(FAVORITE_KEY, compare)
    } else {
      // save
      list = save(song, FAVORITE_KEY, compare, maxlen)
    }
    store.commit('setFavoriteList', list)
    function compare(item) {
      return item.id === song.id
    }
    console.log(compare)
  }

  // 判断是否已经收藏
  function isFavorite(song) {
    const index = favoriteList.value.findIndex((item) => {
      return item.id === song.id
    })
    // 判断index是否大于-1
    return index > -1
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
