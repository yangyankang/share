<template>
  <div class="login-wrapper">
    <el-form :model="form" :rules="formRules" ref="form">
      <div class="login-header">
        <img src="@/assets/images/logo86×26-black.png" alt="logo">
        <p>小螺钉最具影响力的安装服务平台</p>
      </div>
      <div class="login-tabs">
        <div class="login-tabs-btns">
          <div class="login-tab-btn" :class="{active: tabActive === 1}" @click="changeTab(1)">账号密码登录</div>
          <div class="login-tab-btn" :class="{active: tabActive === 2}" @click="changeTab(2)">手机号登录</div>
        </div>
        <div class="login-tabs-panes">
          <div class="login-tab-pane" v-if="tabActive === 1">
            <el-form-item prop="username">
              <el-input
                placeholder="请输入账户名"
                prefix-icon="el-icon-s-custom"
                v-model="form.username"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                placeholder="请输入密码"
                type="password"
                prefix-icon="el-icon-lock"
                v-model="form.password"
                :maxlength="16"
              ></el-input>
            </el-form-item>
          </div>
          <div class="login-tab-pane" v-if="tabActive === 2">
            <el-form-item>
              <el-input placeholder="请输入手机号" prefix-icon="el-icon-mobile-phone"></el-input>
            </el-form-item>
            <el-form-item>
              <el-row>
                <el-col :span="16">
                  <el-input placeholder="请输入验证码" prefix-icon="el-icon-message"></el-input>
                </el-col>
                <el-col :span="8">
                  <el-button style="width: 100%;">
                    获取验证码
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
        </div>
      </div>
      <el-form-item>
        <el-checkbox>记住密码</el-checkbox>
        <router-link to="" style="float: right;">
          忘记密码
        </router-link>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style="width: 100%;"
          :loading="btnLoading"
          :disabled="btnLoading"
          @click="userLogin"
        >
          登 录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      tabActive: 1,
      form: {
        username: 'jeecg',
        password: '123456'
      },
      formRules: {
        username: [
          {required: true, message: '请输入账号', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 4, max: 16, message: '最少6位最多16位', trigger: 'blur'}
        ]
      },
      btnLoading: false
    }
  },
  methods: {
    ...mapActions(['Login', 'Logout', 'GetUserInfo']),
    changeTab (index) {
      this.tabActive = index
    },
    userLogin () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true
          this.Login(this.form)
            .then(res => {
              this.GetUserInfo()
                .then(res => {
                  this.$notify({
                    title: '系统提示',
                    message: '下午好，欢迎回来!',
                    type: 'success'
                  })
                  this.$router.push('/')
                })
                .catch(err => {
                  this.$message.error(err.message)
                  this.Logout()
                })
            })
            .catch(err => {
              this.btnLoading = false
              this.$message.error(err.message)
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-wrapper{
  max-width: 380px;
  margin: 0 auto;
}
.login-header{
  text-align: center;
  margin-bottom: 30px;
  img{
    width: 120px;
  }
  p{
    font-size: 14px;
    color: #999;
  }
}
.login-tabs{
  .login-tabs-btns{
    font-size: 0;
    margin-bottom: 20px;
    text-align: center;
  }
  .login-tab-btn{
    display: inline-block;
    font-size: 15px;
    color: #565656;
    line-height: 40px;
    padding: 0 20px;
    transition: color .3s ease;
    cursor: pointer;
    position: relative;
    &::after{
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      background-color: #1890ff;
      transform: scaleX(0);
      transition: transform .3s ease;
    }
    &.active{
      color: #1890ff;
      &::after{
        transform: scaleX(1);
      }
    }
  }
}
</style>
