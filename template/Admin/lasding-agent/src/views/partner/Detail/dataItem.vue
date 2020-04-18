<template>
  <div class="data-row">
    <div class="data-row-label" :style="{width: dataLabelWidth}">
      <slot name="label">
        {{label}}
      </slot>
    </div>
    <div class="data-row-message">
      <slot>
        {{message}}
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    labelWidth: String,
    label: String,
    message: String
  },
  data () {
    return {}
  },
  computed: {
    dataLabelWidth () {
      let parent = this.$parent
      while (parent && !parent.dataLabelWidth) {
        parent = parent.$parent
      }
      let labelWidth = parent ? parent.dataLabelWidth : ''
      return this.labelWidth || labelWidth
    }
  }
}
</script>

<style lang="scss" scoped>
.data-row{
  display: flex;
  border-bottom: 1px solid #F5F5F5;
  line-height: 20px;
  font-size: 13px;
  padding: 8px 0;
  .data-row-label{
    color: #92a3b7;
  }
  .data-row-message{
    flex: 1;
  }
}
</style>
