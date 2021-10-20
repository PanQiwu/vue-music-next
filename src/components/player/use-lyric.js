import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import Lyric from 'lyric-parser'
import { getLyric } from '../../service/song'

export function useLyric(songReady, currentTime) {
  // 定义当前歌词
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const pureMusicLyric = ref('')
  const playingLyric = ref('')
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)
  const store = useStore()
  // 获取当前播放的歌曲
  const currentSong = computed(() => store.getters.currentSong)
  // 监听currentsong，当前歌曲改变是发起请求获取歌词
  watch(currentSong, async (newSong) => {
    // 判断新歌曲是否合法可播放
    if (!newSong.url || !newSong.id) {
      return
    }
    // 切换歌曲时，将数据初始化
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    pureMusicLyric.value = ''
    playingLyric.value = ''

    // 发起请求获取当前歌曲的歌词
    const lyric = await getLyric(newSong)
    // 将歌词缓存在当前歌曲对象中
    store.commit('addSongLyric', {
      song: newSong,
      lyric
    })
    // 判断当前播放的故去歌词是否与获取的歌词一致，否则直接return
    if (currentSong.value.lyric !== lyric) {
      return
    }
    // 将获取的歌词进行预处理
    currentLyric.value = new Lyric(lyric, handlerLyric)
    const hasLyric = currentLyric.value.lines.length
    // 判断是否处理成功
    if (hasLyric) {
      // songReady 位true则播放歌词
      if (songReady) {
        playLyric()
      } else {
        playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
      }
    }
  })
  // 播放歌词
  function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  // 停止播放歌词
  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  // 处理函数
  function handlerLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    // 判断没有listEl则直接return
    if (!listEl) {
      return
    }
    // 是高亮歌词始终在屏幕中间位置
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }
  return {
    currentLyric,
    currentLineNum,
    pureMusicLyric,
    playingLyric,
    lyricScrollRef,
    lyricListRef,
    playLyric,
    stopLyric
  }
}
