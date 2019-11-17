<template>
  <div>
    <el-row style="border-top: 1px solid #E5E5E5;">
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <data-item title="产品名称">{{detail.productName}}</data-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <data-item title="产品编号">{{product.productNo}}</data-item>
      </el-col>
      <el-col :xl="8" :lg="8" :md="8" :sm="12">
        <data-item title="产品品牌"></data-item>
      </el-col>
      <el-col :xl="8" :lg="8" :md="8" :sm="12">
        <data-item title="产品类别"></data-item>
      </el-col>
      <el-col :xl="8" :lg="8" :md="8" :sm="12">
        <data-item title="来源单号"></data-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import dataItem from './dataItem'
export default {
  components: {
    dataItem
  },
  props: {
    detail: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    product () {
      return this.detail.product || {}
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
