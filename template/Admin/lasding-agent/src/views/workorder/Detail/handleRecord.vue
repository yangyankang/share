<template>
  <div>
    <el-table
      border
      height="500px"
      :data="records"
    >
      <el-table-column label="操作时间" width="140" align="center" prop="crtTime"></el-table-column>
      <el-table-column label="操作内容" prop="remark"></el-table-column>
      <el-table-column label="操作流程" prop="flowStatus" width="180" align="center"></el-table-column>
      <el-table-column label="操作人" prop="crtName" width="160" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { findRecording } from '@/api/workorder'
export default {
  props: {
    isOwn: {
      type: Boolean,
      default: false
    },
    serviceId: [String, Number]
  },
  data () {
    return {
      records: []
    }
  },
  methods: {
    fetchRecords () {
      findRecording(this.serviceId)
        .then(res => {
          this.records = res.result || []
        })
        .catch(err => {
          this.$message.error(err)
        })
    }
  },
  watch: {
    isOwn (val) {
      if (val) {
        this.fetchRecords()
      }
    }
  }
}
</script>

<style>

</style>
