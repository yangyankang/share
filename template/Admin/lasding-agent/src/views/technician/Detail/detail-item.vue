<template>
  <div class="detail-item">
    <div class="detail-item-label">
      {{label}}
    </div>
    <div class="detail-item-message">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailItem',
  props: {
    label: String
  }
}
</script>

<style lang="scss" scoped>
.detail-item{
  display: flex;
  font-size: 13px;
  height: 50px;
  border: 1px solid #EEE;
  .detail-item-label{
    width: 90px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #F7F7F7;
  }
  .detail-item-message{
    flex: 1;
    padding-left: 3px;
    display: flex;
    align-items: center;
    line-height: 16px;
    color: #999;
  }
}
</style>
