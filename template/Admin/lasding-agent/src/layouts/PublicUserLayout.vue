<template>
  <el-container style="height: 100%;">
    <el-main  class="container">
      <router-view></router-view>
    </el-main>
    <el-footer>
      <GlobalFooter></GlobalFooter>
    </el-footer>
  </el-container>
</template>

<script>
import GlobalFooter from './GlobalFooter'
export default {
  name: 'PublicUserLayout',
  components: {
    GlobalFooter
  }
}
</script>

<style lang="scss" scoped>
.container{
  padding: 110px 0;
}
</style>
