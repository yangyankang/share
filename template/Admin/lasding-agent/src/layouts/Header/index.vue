<template>
  <div class="base-header-wrapper">
    <div class="toggle-aside-menu">
      <div class="toggle-menu-btn" @click="toggleShowMenu">
        <span class="el-icon-s-fold" v-if="showMenu"></span>
        <span class="el-icon-s-unfold" v-else></span>
      </div>
    </div>
    <user-menu></user-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserMenu from './UserMenu'
export default {
  name: 'GlobalHeader',
  components: {
    UserMenu
  },
  computed: {
    ...mapGetters([
      'showMenu'
    ])
  },
  methods: {
    toggleShowMenu () {
      let isShowMenu = !this.showMenu
      this.$store.dispatch('toggleShowMenu', isShowMenu)
    }
  }
}
</script>

<style lang="scss">
.base-header-wrapper{
  height: 100%;
  .toggle-aside-menu{
    float: left;
    padding: 10px 10px 10px 0;
    .toggle-menu-btn{
      width: 40px;
      height: 40px;
      cursor: pointer;
      font-size: 28px;
      text-align: center;
      &:hover{
        background-color: #E1E1E1;
      }
    }
  }
}
</style>
