<template>
  <div class="lay-con" id="autozi-lay-con">
    <v-header v-show="showCommonComponent"/>
    <div class="main-con" id="autozi-main-container">
      <auto-left-nav v-show="showCommonComponent"/>
      <router-view/>
    </div>
  </div>
</template>

<script>
import VHeader from '@/components/Header/Header'
import AutoLeftNav from '@/components/LeftNav/LeftNav'

export default {
  name: 'Layout',
  data () {
    return {
      showCommonComponent: true
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'StatePage') {
        this.showCommonComponent = false
      }
    },
    deep: true
  },
  created () {
    if (this.$route.name === 'StatePage') {
      this.showCommonComponent = false
    } else {
      this.showCommonComponent = true
    }
  },
  components: {
    VHeader,
    AutoLeftNav
  }
}
</script>

<style lang="less" scoped>
@import '../style/base.less';
.lay-con{
  // overflow-y: auto;
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  .main-con{
    display: flex;
    flex: 1;
    flex-direction: row;
  }
}
</style>
