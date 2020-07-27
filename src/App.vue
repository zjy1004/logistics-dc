<template>
  <div id="app">
    <layout v-if="showLayout()"/>
    <router-view v-if="!showLayout()"/>
  </div>
</template>

<script>
import Layout from '@/views/Layout'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  created () {
    let token = sessionStorage.getItem('token')
    if (token) {
      this.rolePermissionFn()
    }
  },
  computed: {
    // ...mapState({
    //   rolePermission: state => state.rolePermission
    // })
  },
  updated () {
    this.$nextTick(() => {
      let layCon = document.getElementById('autozi-lay-con')
      let layConHeight = ''
      if (layCon) {
        layConHeight = layCon.clientHeight
      }
      let commonHeader = document.getElementById('autozi-header')
      let headerHeight = ''
      if (commonHeader) {
        headerHeight = commonHeader.clientHeight
      }
      let mainContainer = document.getElementById('autozi-main-container')
      if (mainContainer) {
        if (layConHeight && headerHeight) {
          mainContainer.style.height = (layConHeight - headerHeight) + 'px'
        }
      }
    })
  },
  methods: {
    ...mapActions([
      'rolePermissionFn'
    ]),
    hasPermission (code) {
      let isAdmin = JSON.parse(sessionStorage.getItem('userInfo')).isAdmin
      if (isAdmin) {
        return true
      }
      return this.rolePermission.includes(code)
    },
    showLayout () {
      return this.$route.name !== 'Login'
    }
  },
  components: {
    Layout
  }
}
</script>

<style lang="less">
.el-popover{
  text-color: #ff0000 !important;
}
#app{
  display: flex;
  flex-direction: column;
  // min-width: 1280px;
  height: 100%;
}
</style>
