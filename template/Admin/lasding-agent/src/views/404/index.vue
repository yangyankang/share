<template>
  <div class="not-find">
    <div class="not-find-body">
      <img src="@/assets/images/404.jpg" alt="">
      <div class="real404">
        <div class="title">404</div>
        <div>
          <el-button
            size="small"
            type="primary"
            @click="$router.push('/')"
          >返回首页</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.not-find{
  max-width: 100vw;
  max-height: 100vh;
  height: 100vh;
  overflow: hidden;
  position: relative;
  .not-find-body{
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 auto;
    transform: translate(-50%, -50%);
    width: 50%;
    max-width: 1200px;
    >img{
      width: 100%;
    }
    .real404{
      position: absolute;
      top: 0;
      left: 3%;
      .title{
        font-size: 150px;
        color: #F7F7F7;
      }
    }
  }
}
</style>
