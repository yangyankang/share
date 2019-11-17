<template>
  <div>
    <el-row :gutter="20">
      <el-col
        :span="12"
        v-for="item in showCols"
        :key="item.field"
      >
        <data-item :label="item.fieldName">
          {{detail[item.field]}}
        </data-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DataItem from '@/views/partner/Detail/dataItem'
export default {
  components: {
    DataItem
  },
  props: {
    showCols: {
      type: Array,
      default () {
        return []
      }
    },
    detail: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      dataLabelWidth: '90px'
    }
  }
}
</script>

<style>

</style>
