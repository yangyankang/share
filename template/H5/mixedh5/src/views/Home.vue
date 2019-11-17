<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <!-- <div
      class="test"
      v-onepx
    >
      test 页面
    </div>
    <div class="box">
      <div class="box-list"></div>
      <div class="box-list"></div>
      <div class="box-list"></div>
      <div class="box-list"></div>
    </div> -->
    <div class="svg-container">
      <svg-icon icon-class="dashboard"></svg-icon>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue"

export default {
  name: 'home',
  components: {
    // HelloWorld
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
$dark_gray: #889aa4;

.test {
  width: 750px;
  height: 700px;
  background: pink;
  font-size: 30px;
  position: relative;
  &::after {
    content: '';
    display: block;
    width: 100%;
  }
}
.box {
  width: 100%;
  display: flex;
  padding-bottom: 250px;
  .box-list {
    height: 750px;
  }
  .box-list:nth-child(1) {
    width: 188px;
    background: pink;
  }
  .box-list:nth-child(2) {
    width: 187px;
    background: yellow;
  }
  .box-list:nth-child(3) {
    width: 188px;
    background: red;
  }
  .box-list:nth-child(4) {
    width: 187px;
    background: gray;
  }
}
.svg-container {
  padding: 6px 5px 6px 15px;
  color: $dark_gray;
  vertical-align: middle;
  width: 30px;
  display: inline-block;
}
</style>
