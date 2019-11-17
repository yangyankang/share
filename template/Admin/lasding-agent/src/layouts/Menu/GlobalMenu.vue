<template>
  <div
    class="aside-menu-wrapper"
  >
    <el-menu
      :background-color="asideTheme"
      :text-color="navTextColor"
      active-text-color="#ffd04b"
      class="no-border el-menu-vertical-demo"
      :collapse="!showMenu"
      router
      :default-openeds="defaultOpens"
      :default-active="defaultActive"
    >
      <template v-for="item in userMenu">
        <menu-item
          v-if="!item.hidden"
          :key="item.path"
          :data="item"
        ></menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import MenuItem from './MenuItem'
import { mapGetters } from 'vuex'
export default {
  name: 'GloBalMenu',
  components: {
    MenuItem
  },
  data () {
    return {
      routes: [
        { name: 1, index: '1' },
        {
          name: 2,
          index: '2',
          children: [
            {name: 2.1, index: '2.1'},
            {name: 2.2, index: '2.2'},
            {name: 2.3, index: '2.3'}
          ]
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'themeColor',
      'asideTheme',
      'navTextColor',
      'navTextActiveColor',
      'showMenu',
      'userMenu',
      'fixedMenu'
    ]),
    defaultOpens () {
      return this.$route.matched.map(x => x.path)
    },
    defaultActive () {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss">
.aside-menu-wrapper{
  flex: 1;
  background-color: #001529;
  overflow-x: hidden;
  &::-webkit-scrollbar{
    display: none;
  }
}
.no-border{
  border: none;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
