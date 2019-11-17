<template>
  <div class="lasding-admin-logo">
    <router-link to="/">
      <img src="@/assets/images/logo-CN.png" alt="img">
      <h1>LASDING</h1>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'LasdingLogo'
}
</script>

<style lang="scss">
.lasding-admin-logo{
  height: 60px;
  line-height: 60px;
  background-color: #002140;
  text-align: center;
  a{
    color: #FFF;
  }
  img{
    vertical-align: middle;
  }
  h1{
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
