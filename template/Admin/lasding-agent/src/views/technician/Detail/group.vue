<template>
  <div>
    <el-table
      border
      :data="dataList"
      height="500px"
    >
      <el-table-column label="团队名称" prop="groupName"></el-table-column>
      <el-table-column label="成员数" prop="num"></el-table-column>
      <el-table-column label="是否团长">
        <template slot-scope="{row}">
          <el-tag
            size="mini"
          >{{row.leader === detail.id ? '是' : '否'}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { findTechInGroup } from '@/api/technician'
export default {
  name: '',
  props: {
    detail: {
      type: Object,
      default () {
        return {}
      }
    },
    isOwn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataList: [],
      dataLoading: false
    }
  },
  methods: {
    fetchTechInGroup () {
      findTechInGroup(this.detail.id)
        .then(res => {
          this.dataList = res.result || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  },
  watch: {
    isOwn () {
      this.fetchTechInGroup()
    }
  }
}
</script>

<style>

</style>
