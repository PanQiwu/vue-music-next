<template>
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song.js'
import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/contant'
export default {
  name: 'singer-detail',
  components: {
    MusicList
  },
  props: {
    singer: Object
  },
  data() {
    return {
      songs: [],
      loading: true
    }
  },
  computed: {
    // 解决不能在当前页面刷新的问题
    computedData() {
      let ret = null
      const singer = this.singer
      if (singer) {
        ret = singer
      } else {
        const cached = storage.session.get(SINGER_KEY)
        if (cached && (cached.mid || cached.id + '') === this.$router.currentRoute.value.params.id) {
          ret = cached
        }
      }
      return ret
    },
    pic() {
      const data = this.computedData
      return data && data.pic
    },
    title() {
      const data = this.computedData
      return data && (data.name || data.title)
    }
  },
  async created() {
    if (!this.computedData) {
      const toPath = this.$router.currentRoute.value.matched[0].path
      this.$router.push(toPath)
      return
    }
    const result = await getSingerDetail(this.computedData)
    const songs = await processSongs(result.songs)
    this.loading = false
    this.songs = songs
  }
}
</script>

<style lang="scss" scoped>
  .singer-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
