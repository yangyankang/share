<template>
  <div class="pay-loading">
    <span
      class="el-icon-refresh warn"
      v-if="!isFinish"
    ></span>
    <transition name="fade-rotate-in">
      <span
        class="el-icon-success success"
        v-if="isFinish"
      ></span>
    </transition>
    <div>
      {{text}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isFinish: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    text () {
      return this.isFinish ? '支付成功' : '支付中...'
    }
  }
}
</script>

<style lang="scss" scoped>
.pay-loading{
  text-align: center;
  >span{
    font-size: 80px;
  }
  .warn{
    color: #FFCC33;
    animation: rotate 1s infinite linear;
    transition: 0.4s ease all;
    &.hidden{
      background-color: #FFCC33;
      transform: scale(0);
    }
  }
  .success{
    color: #00CC33;
  }
}
@keyframes rotate {
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(-360deg);
  }
}
.fade-rotate-in-enter{
  transform: rotate(50deg) scale(0.5);
  opacity: 0;
}
.fade-rotate-in-enter-active{
  transition: all ease 0.4s;
}
</style>
