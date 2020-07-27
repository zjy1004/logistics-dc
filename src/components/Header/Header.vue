<template>
  <div class="common-header" id="autozi-header">
    <div class="logo-con">
      <div class="logo"></div>
    </div>
    <div class="header-main">
      <div class="nav-con">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item v-show="hasMenuPermission('1')" index="1">运单管理</el-menu-item>
          <el-menu-item v-show="hasMenuPermission('4')" index="4">调度管理</el-menu-item>
          <el-menu-item v-show="hasMenuPermission('3')" index="3">财务管理</el-menu-item>
          <el-menu-item v-show="hasMenuPermission('2')" index="2">基础管理</el-menu-item>
          <el-menu-item v-show="hasMenuPermission('5')" index="5">基础数据</el-menu-item>
        </el-menu>
      </div>
        <div class="user-info">
          <span class="user_circle"></span>
          <div class="user_box">
          <span class="user_con" v-text="userName"></span>
          <span class="user_tri"></span>
          </div>
            <ul class="dropdown" :class="{'opcoyDropdown': saveRoleType === 10}">
              <li v-if="saveRoleType !== 10" @click="personalInfo">个人中心</li>
              <li @click="changePsd">修改密码</li>
              <!-- <li @click="more">更多</li> -->
              <li class="logOut_line" @click="logOut">退出</li>
          </ul>
        </div>
      </div>
      <change-psd
        v-if="dialogVisible"
        :dialogVisible="dialogVisible"
        @click-cancel="clickDialogCancel"
      />
      <tip
        v-if="showTip"
        :dialogVisible="showTip"
        @click-cancel="showTip = false"
      />
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex'
import changePsd from '@/views/PersonalManage/EditPassWord'
// import Tip from '@/views/ServiceCenter/FundsAccount/subpage/Tip'
export default {
  name: 'Header',
  data () {
    return {
      showTip: false,
      activeIndex: '',
      userName: '',
      dialogVisible: false,
      saveRoleType: '',
      isClient: false
    }
  },
  created () {
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if (userInfo) {
      this.saveRoleType = userInfo.accountType
    }
    this.getUrl()
  },
  computed: {
    ...mapState({
      topTabMenuIndex: state => state.topTabMenuIndex,
      menuData: state => state.menuData
    }),
    ...mapGetters(['hasMenuPermission'])
  },
  mounted () {
    this.userMessage()
  },
  methods: {
    ...mapMutations([
      'updateTopTabMenuIndex'
    ]),
    more () {
      this.$router.push({path: '/more-info'})
    },
    getUrl () {
      let currentUrl = window.location.href.split('#')[1].split('/')[1]
      if (currentUrl === 'waybill-manage') {
        this.activeIndex = '1'
        this.updateTopTabMenuIndex({index: '1'})
      }
      if (currentUrl === 'dispatch-manage') {
        this.activeIndex = '4'
        this.updateTopTabMenuIndex({index: '4'})
      }
      if (currentUrl === 'finance-manage') {
        this.activeIndex = '3'
        this.updateTopTabMenuIndex({index: '3'})
      }
      if (currentUrl === 'basic-manage') {
        this.activeIndex = '2'
        this.updateTopTabMenuIndex({index: '2'})
      }
      if (currentUrl === 'basic-data') {
        this.activeIndex = '5'
        this.updateTopTabMenuIndex({index: '5'})
      }
    },
    handleSelect (key, keyPath) {
      switch (key) {
        case '1':
          this.setCheckMenuOnTopTabChange('1')
          this.updateTopTabMenuIndex({index: '1'})
          break
        case '2':
          this.setCheckMenuOnTopTabChange('2')
          this.updateTopTabMenuIndex({index: '2'})
          break
        case '3':
          this.setCheckMenuOnTopTabChange('3')
          this.updateTopTabMenuIndex({index: '3'})
          break
        case '4':
          this.setCheckMenuOnTopTabChange('4')
          this.updateTopTabMenuIndex({index: '4'})
          break
        case '5':
          this.setCheckMenuOnTopTabChange('5')
          this.updateTopTabMenuIndex({index: '5'})
          break
        default:
          break
      }
    },
    setCheckMenuOnTopTabChange (topType) {
      let menus = this.menuData
      let leftMenus = menus.filter(item => {
        return item.url === topType
      })
      let secondMenus = leftMenus[0].menuVos
      secondMenus = secondMenus.filter(item => {
        return item.menuType === '2' // 可点的功能节点
      })
      if (secondMenus.length > 0) {
        let checkedMenu = secondMenus[0]
        if (checkedMenu.menuCode) {
          this.$router.push({name: checkedMenu.url, query: {index: checkedMenu.menuCode}})
        } else {
          this.$router.push({name: checkedMenu.url})
        }
      }
    },
    logOut () {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('userInfo')
      this.$router.push({path: '/'})
    },
    personalInfo () {
      if (this.saveRoleType === 30) {
        this.$router.push({path: '/personal-manage/dc-personal-center'})
      }
      if (this.saveRoleType === 20) {
        this.$router.push({path: '/personal-manage/opcoy-personal-center'})
      }
    },
    changePsd () {
      // this.$router.push({path: '/personal-manage/edit-password'})
      this.dialogVisible = !this.dialogVisible
    },
    receiptConfig () {
      this.$router.push({name: 'ReceiptMoneyConfig'})
    },
    userMessage () {
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      if (userInfo) {
        if (userInfo.isClient) {
          this.userName = userInfo.account
          this.isClient = true
        } else {
          this.userName = userInfo.userName
          this.isClient = false
        }
      }
    },
    clickDialogCancel () {
      this.dialogVisible = false
    }
  },
  components: {
    changePsd
    // Tip
  }
}
</script>

<style lang="less">
@import '../../style/base.less';
.common-header{
  .el-menu--horizontal{
    border-bottom: none;
    margin-left: 45px;
    .el-menu-item{
      .mixin-sc(16px;#fff);
      font-weight: 500;
      padding: 0;
      margin-right: 35px;
    }
    .el-menu-item:not(.is-disabled):hover,.el-menu-item:not(.is-disabled):focus,.el-menu-item.is-active{
      background: #04B8D7;
      .mixin-sc(16px;#fff);
      font-weight: bold;
      border-bottom: 3px solid #fff;
    }
  }
}
</style>
<style lang="less" scoped>
@import '../../style/base.less';
.common-header{
  display: flex;
  flex-direction: row;
  height: 60px;
  background: #04B8D7;
  .logo-con{
    background: #04B8D7;
    width: 180px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    .logo{
      width: 115px;
      height: 35px;
      background: url('../../image/logo.png') no-repeat;
      background-size: 100% 100%;
    }
  }
  .header-main{
    display: flex;
    flex: 1;
    align-items: center;
    .nav-con{
      display: flex;
      flex: 1;
    }
    .el-menu-demo{
      display: flex;
      flex: 1;
      background: #04B8D7;
    }
    .user-info {
      min-width: 106px;
      width: auto;
      height: 60px;
      margin-top: 26px;
      line-height: 34px;
      margin-right: 30px;
      opacity:0.9;
      .userName {
        display: inline-block;
        float: left;
        .mixin-logidtic(110px;34px;-32px;-102px);
        padding-left: 40px;
        .mixin-sc(12px,#ffffff);
      }
      .logOut {
        display: inline-block;
        float: left;
        .mixin-logidtic(15px;15px;-165px;-110px);
        margin-left: 15px;
        margin-top: 10px;
        cursor: pointer;
      }
      .user_circle {
        width: 34px;
        height: 34px;
        display: inline-block;
        border-radius: 50%;
        z-index: 2;
        position: relative;
        background:  #04aad7 url('../../image/user_logo.png') no-repeat 9px 5px;
      }
      .user_box {
        min-width: 103px;
        width: auto;
        height: 34px;
        background: #04aad7;
        border-radius: 20px;
        display: inline-block;
        margin-left: -34px;
        padding-left: 40px;
        .mixin-sc(12px,#ffffff);
        .user_con {
          min-width: 36px;
          width: auto;
          height: 34px;
          line-height: 34px;
          float: left;
        }
      }
      .user_tri {
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 6px solid #fff;
        margin-top: 15px;
        margin-left: 8px;
        margin-right: 8px;
        float: left;
      }
      .opcoyDropdown {
        height: 110px!important;
      }
      .dropdown {
        display: flex;
        flex-direction: column;
        display: none;
        width: 126px;
        height: 142px;
        position: absolute;
        top: 60px;
        right: 15px;
        padding: 12px;
        background: #fff;
        z-index: 9999;
        border: 1px solid #eee;
        li {
          margin-top: 8px;
          margin-left: 0;
          width: 100%;
          height: 32px;
          line-height: 32px;
          text-align: center;
          font-size: 14px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          &:first-child {
              margin-top: 0;
          }
          &:hover {
              background: #f3f3f3;
              color: #04B8D7;
          }
        }
        .logOut_line {
          border-top: 1px solid rgba(0,0,0,0.1);
          &:hover {
            border: none;
          }
        }
      }
      &:hover {
        i::after {
        margin-left: 10px;
        display: block;
        content: "";
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 6px solid #3399cc;
        cursor: pointer;
        }
        //color: #3399cc;
        .dropdown {
            display: block;
        }
      }
    }

  }
}
</style>
