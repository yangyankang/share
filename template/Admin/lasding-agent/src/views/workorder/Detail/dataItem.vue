<template>
  <div class="data-item">
    <div class="data-item-title" :style="{width: width}">
      {{title}}
    </div>
    <div class="data-item-message">
      <slot>
        {{message}}
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '110px'
    },
    title: String,
    message: String
  }
}
</script>

<style lang="scss" scoped>
.data-item{
  display: flex;
  height: 40px;
  line-height: 20px;
  border-bottom: 1px solid #E5E5E5;
  border-right: 1px solid #E5E5E5;
  .data-item-title{
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #EEE;
    color: #555;
    font-size: 13px;
  }
  .data-item-message{
    flex: 1;
    display: flex;
    align-items: center;
    padding-left: 3px;
    color: #999;
    font-size: 13px;
  }
}
</style>
