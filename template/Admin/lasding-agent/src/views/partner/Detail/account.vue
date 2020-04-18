<template>
  <div>
    <div></div>
    <div>
      <el-table
        border
        height="500px"
        :data="dataList"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column label="登录账户" prop="username"></el-table-column>
        <el-table-column label="用户名" prop="name"></el-table-column>
        <el-table-column label="联系电话" prop="mobile"></el-table-column>
        <el-table-column label="账号类型" prop="type" align="center" width="110">
          <template slot-scope="{row}">
            {{row.type | optsFilter(types, 'value', 'text')}}
          </template>
        </el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="状态" prop="status" align="center" width="100">
          <template slot-scope="{row}">
            <el-tag size="mini" :type="row.status | optsFilter(staties, 'value', 'type')">
              {{row.status | optsFilter(staties, 'value', 'text')}}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  findPartnerUser
} from '@/api/partner'
export default {
  props: {
    partnerId: String,
    isOwn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      dataList: [],
      dataLoading: false,
      types: [
        {value: 'ADMIN', text: '管理员'},
        {value: 'USER', text: '员工'},
        {value: 'SUPER', text: '超级管理员'}
      ],
      staties: [
        {value: 1, text: '正常', type: 'primary'},
        {value: 0, text: '禁用', type: 'warning'}
      ]
    }
  },
  methods: {
    fetchList () {
      this.dataLoading = true
      findPartnerUser(this.partnerId)
        .then(res => {
          this.dataList = res.result || []
          this.total = res.result.total || 0
          this.dataLoading = false
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  },
  watch: {
    isOwn (val) {
      if (val) {
        this.fetchList()
      }
    }
  }
}
</script>

<style>

</style>
