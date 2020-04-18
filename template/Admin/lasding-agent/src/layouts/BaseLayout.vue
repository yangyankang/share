<template>
  <el-container style="min-height: 100vh;" class="set-background">
    <el-aside
      class="animated"
      :width="showMenu ? '200px' : '64px'"
      :class="{'fixed-aside': fixedMenu}"
    >
      <div
        class="slide-navbar"
      >
        <lasding-logo></lasding-logo>
        <global-menu></global-menu>
      </div>
    </el-aside>
    <el-container
      style="position: relative;"
      :style="{'paddingLeft': bodyLeft}"
    >
      <el-header
        class="global-header"
        :class="{'fixed-header': fixedHeader}"
        :style="'width: calc(100% - ' + headerWidth + ');'"
      >
        <global-header></global-header>
      </el-header>
      <el-header v-if="fixedHeader"></el-header>
      <el-header height="40px"></el-header>
      <el-header
        height="auto"
        class="page-header"
        :style="'width: calc(100% - ' + headerWidth + ');'"
      >
        <el-tabs v-model="pageActive" @tab-remove="tabRemove">
          <el-tab-pane
            v-for="item in openpages"
            :key="item.path"
            :label="item.meta.title"
            :name="item.path"
            :closable="openpages.length > 1"
          ></el-tab-pane>
        </el-tabs>
      </el-header>
      <!-- <el-header
        height="auto"
        style="background-color: #FFF;"
      >
        <el-tabs
          closable
        >
          <el-tab-pane label="首页"></el-tab-pane>
          <el-tab-pane label="首页1"></el-tab-pane>
        </el-tabs>
      </el-header> -->
      <el-main>
        <water-mark></water-mark>
        <router-view />
      </el-main>
      <el-footer>
        <GlobalFooter></GlobalFooter>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import GlobalFooter from './GlobalFooter'
import LasdingLogo from './Logo'
import GlobalMenu from './Menu/GlobalMenu'
import GlobalHeader from './Header'
import WaterMark from '@/components/watermark'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'BaseLayout',
  components: {
    GlobalFooter,
    LasdingLogo,
    GlobalMenu,
    GlobalHeader,
    WaterMark
  },
  methods: {
    tabRemove (val) {
      let hasIndex = this.openpages.findIndex(x => x.path === val)
      const current = this.$route.path
      if (hasIndex !== -1) {
        if (this.openpages[hasIndex].path === current) {
          if (hasIndex > 0) {
            this.$router.push(this.openpages[hasIndex - 1])
          } else if (hasIndex === 0) {
            this.$router.push(this.openpages[hasIndex + 1])
          }
        }
        this.$store.dispatch('closePage', hasIndex)
      }
    }
  },
  computed: {
    ...mapGetters([
      'showMenu',
      'fixedHeader',
      'fixedMenu'
    ]),
    ...mapState({
      openpages: state => state.user.openpages
    }),
    headerWidth () {
      return this.showMenu ? '200px' : '64px'
    },
    bodyLeft () {
      return this.showMenu ? '200px' : '64px'
    },
    pageActive: {
      get () {
        return this.$route.path
      },
      set (val) {
        let has = this.openpages.find(page => page.path === val)
        this.$router.push({...has})
      }
    }
  }
}
</script>

<style lang="scss">
.slide-navbar{
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow-x: hidden;
}
.global-header{
  box-shadow: 0 1px 2px #ccc;
  position: relative;
  z-index: 2;
  transition: .4s all ease;
}
.animated{
  transition: all ease .4s;
}
.fixed-aside{
  position: fixed;
  z-index: 3;
  height: 100%;
}
.page-header{
  position: fixed;
  top: 60px;
  right: 0;
  background-color: #FFF;
  z-index: 5;
  transition: .4s all ease;
  .el-tabs__header{
    margin-bottom: 0;
  }
}
.set-background{
  background-image: url('~@/assets/images/404.jpg');
  background-size: 100% auto;
  background-repeat: repeat-y;
  background-position: center;
}
</style>
