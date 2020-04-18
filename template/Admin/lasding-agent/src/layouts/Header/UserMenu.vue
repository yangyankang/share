<template>
  <div class="user-menu-wrapper">
    <div class="user-menu">
      <span class="icon">
        <span class="el-icon-question"></span>
      </span>
      <span class="icon">
        <el-popover
          placement="bottom-end"
        >
          <div style="width: 300px; height: 250px;">

          </div>
          <span slot="reference">
            <el-badge :value="12">
              <span class="el-icon-chat-dot-square"></span>
            </el-badge>
          </span>
        </el-popover>
      </span>
      <span class="text">
        <el-dropdown>
          <span>
            欢迎您, {{nickname}}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span class="el-icon-user"></span>
              <span>个人中心</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span class="el-icon-setting"></span>
              <span>账户设置</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span class="el-icon-more-outline"></span>
              <span>密码修改</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
      <span class="text" @click="Logout">
        <span class="el-icon-switch-button"></span>
        退出登录
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'UserMenu',
  computed: {
    ...mapGetters([
      'nickname'
    ])
  },
  methods: {
    Logout () {
      this.$store.dispatch('Logout')
      setTimeout(() => {
        window.location.reload()
      }, 0)
    }
  }
}
</script>

<style lang="scss">
.user-menu-wrapper{
  float: right;
  padding: 10px 0;
}
.user-menu{
  >span{
    display: inline-block;
    line-height: 40px;
    height: 40px;
    text-align: center;
    vertical-align: top;
    &:hover{
      background-color: #EEE;
    }
    &.icon{
      width: 40px;
    }
    &.text{
      padding: 0 10px;
      font-size: 14px;
    }
  }
}
</style>
