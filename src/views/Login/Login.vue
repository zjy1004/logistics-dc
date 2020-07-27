<template>
  <div class="login-con">
    <div class="login-header">
      <div class="logo"></div>
      <!-- <div class="header-text">分拨中心/物流云平台</div> -->
    </div>
    <div class="login-main">
      <div class="login-container">
        <div class="login-text">用户登录</div>
        <div class="login-form">
          <el-form ref="form" :rules="rules" :model="form">
            <el-form-item label="" prop="userName">
              <el-input v-model="form.userName" @input="inputUserName" placeholder="请输入用户名" maxlength="128"></el-input>
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-input type="password" @keydown.native="onKeyDownLogin($event)" v-model="form.password" maxlength="128" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="" prop="remeberPass">
              <el-checkbox v-model="form.remeberPass" @change="remeberChange">记住密码</el-checkbox>
            </el-form-item>
            <!-- <el-form-item label="">
              <div class="agreeTerms" @click="agreeTerms">登录表示同意<span>《平台网站注册服务协议》</span></div>
            </el-form-item> -->
            <el-form-item>
              <el-button @click="login">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="login-footer">Copyright © Autozi.com 2020 All Rights Reserved. Powered by Autozi</div>
  </div>
</template>

<script>
import LoginAjax from '@/api/Login/Login'
// import CommonAxios from '@/api/Common/CommonAxios'
import { mapMutations } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      verificationSrc: '',
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码!', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码!', trigger: 'blur' }
        ]
      },
      form: {
        userName: '',
        password: '',
        captcha: '',
        remeberPass: false
      },
      menuData: []
    }
  },
  created () {
    if (this.getCookie('user') && this.getCookie('pswd')) {
      this.form.userName = this.getCookie('user')
      this.form.password = this.base64decode(this.getCookie('pswd'))
      this.form.remeberPass = true
    }
  },
  methods: {
    ...mapMutations([
      'setUserInfo',
      'setMenuData'
    ]),
    inputUserName () {
      this.form.password = ''
    },
    onKeyDownLogin (event) {
      if (event.keyCode === 13) {
        this.submitForm()
      }
    },
    changeVcodeSrc () {
      this.getImgCode()
    },
    getImgCode () {
      LoginAjax.GetVerificationCode().then((response) => {
        this.verificationSrc = `data:image/png;base64,${response.data.data}`
      })
    },
    submitForm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          LoginAjax.Login({account: this.form.userName, password: this.form.password}).then((response) => {
            if (response.code === 200) {
              if (this.form.remeberPass) {
                this.setCookie({name: 'user', value: this.form.userName, day: 7}) // 保存帐号到cookie，有效期7天
                this.setCookie({name: 'pswd', value: this.base64encode(this.form.password), day: 7}) // 保存密码到cookie，有效期7天
              }
              let token = response.data.token
              sessionStorage.setItem('token', token)
              this.setUserInfo({userInfo: response.data})
              sessionStorage.setItem('userInfo', JSON.stringify(response.data))
              this.queryMenus()
            } else if (response.code === 10003) {
              this.$notify({
                message: response.message,
                type: 'error'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    // 查询菜单
    queryMenus () {
      LoginAjax.QueryMenus().then((response) => {
        if (response.code === 200) {
          if (response.data === null || response.data.length < 1) {
            this.$notify({
              message: '您暂无操作权限，请联系管理员',
              type: 'error'
            })
            return false
          }
          this.setMenuData({menuData: response.data})
          this.setFirstCheckMenu(response.data)
          // this.$router.push({name: 'NewWaybill', query: {index: 'add'}})
        }
      })
    },
    // 登录后设置选中第一个有权限的菜单
    setFirstCheckMenu (response) {
      let secondMenuList = response.map(item => {
        return item.menuVos.map(menuItem => {
          return menuItem
        })
      })
      secondMenuList = secondMenuList[0].filter(item => {
        return item.menuType === '2' // 可点的功能节点
      })
      let len = secondMenuList.length
      if (len > 0) {
        let fisrtEnableMenu = secondMenuList[0]
        if (fisrtEnableMenu.menuCode) { // 有query参数
          this.$router.push({name: fisrtEnableMenu.url, query: {index: fisrtEnableMenu.menuCode}})
        } else {
          this.$router.push({name: fisrtEnableMenu.url})
        }
      } else {
        this.$notify({
          message: '您无任何菜单权限!',
          type: 'error'
        })
      }
    },
    // agreeTerms () {
    //   let routes = this.$router.resolve({ name: 'Agreement', query: {type: 1} })
    //   window.open(routes.href, '_blank')
    // },
    login () {
      this.submitForm()
    },
    remeberChange (val) {
      if (!val) {
        this.delCookie('user')
        this.delCookie('pswd')
      }
    }
  },
  components: {}
}
</script>
<style lang="less">
@import '../../style/base.less';
.login-con{
  .el-form{
    .el-form-item{
      margin-bottom: 14px;
      .el-input{
        input{
          border-top: none;
          border-right: none;
          border-left: none;
        }
      }
      button{
        // margin-top: 24px;
        width: 100%;
        height: 40px;
        border-radius: 2px;
        border: none;
        background: #04B8D7;
        span{
          .mixin-sc(15px;#fff);
          color: #fff;
        }
      }
      button:hover{
        background: #04B8b9;
      }
      button:focus{
        background: #04B8b9;
      }
    }
  }
}
</style>
<style lang="less" scoped>
@import '../../style/base.less';
.login-con{
  display: flex;
  flex: 1;
  flex-direction: column;
  background: #fff;
  .login-header{
    width: 100%;
    height: 78px;
    background: #fff;
    display: flex;
    flex-direction: row;
    align-items: center;
    .logo{
      display: block;
      margin-left: 360px;
      // .mixin-logidtic(140px;54px;-32px;-32px);
      width: 145px;
      height: 45px;
      background: url('../../image/login_logo.png') no-repeat;
      background-size: 100% 100%;
    }
    .header-text{
      margin-left: 22px;
      font-size: 20px;
      height: 20px;
      font-weight: bold;
      color: #333;
    }
  }
  .login-main{
    display: block;
    height: 670px;
    background-color: #04B8D7;
    background-image: url(../../image/login.png);
    background-repeat: no-repeat;
    background-position-y: 110px;
    background-position-x: 10%;
    position: relative;
    .login-container{
      position: absolute;
      top: 140px;
      right: 15%;
      padding: 32px 37px 34px 37px;
      width: 316px;
      min-height: 310px;
      background: #fff;
      box-shadow: -1px 0px 10px 0px rgba(0, 0, 0, 0.15);
      .login-text{
        .mixin-sc(18px;#333);
        height: 18px;
        font-weight: 800;
        // margin: 19px 0 0 12px;
      }
      .login-form{
        margin-top: 27px;
        .verificationCode{
          position: relative;
          .verificationImg{
            position: absolute;
            right: 0px;
            top: 0px;
            width: 86px;
            height: 28px;
          }
        }
        .agreeTerms {
          cursor: pointer;
          font-size: 13px;
          color: #606266;
          span {
            font-size: 13px;
            color: #ff0000;
          }
        }
      }
    }
  }
  .login-footer{
    width: 100%;
    height: 84px;
    .mixin-sc(12px;#969696);
    text-align: center;
    line-height: 84px;
    background: #fff;
  }
}
</style>
