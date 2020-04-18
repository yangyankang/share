<template>
  <el-card shadow="never">
    <list-table
      :data="dataList"
      :show-columns="showCols"
      v-loading="dataLoading"
    >
    </list-table>
    <div class="pages-wrapper">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="page.pageSize"
        :current-page="page.pageNum"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import ListTable from '@/components/ListTable'
import { GetSystemLog } from '@/api/system'
export default {
  components: {
    ListTable
  },
  data () {
    return {
      dataList: [],
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      showCols: [
        {
          field: 'crtTime',
          fieldName: '创建时间',
          fieldWidth: 140,
          fieldAlign: 'center',
          fieldSort: 'true'
        },
        {
          field: 'logContent',
          fieldName: '日志内容'
        },
        {
          field: 'costTime',
          fieldName: '耗时',
          fieldWidth: 100,
          fieldAlign: 'center',
          fieldSort: 'true'
        },
        {
          field: 'ip',
          fieldName: '操作IP',
          fieldWidth: 120,
          fieldAlign: 'center',
          fieldSort: 'true'
        },
        {
          field: 'logType',
          fieldName: '日志类型',
          fieldWidth: 120,
          fieldAlign: 'center',
          fieldSort: 'true'
        },
        {
          field: 'requestParam',
          fieldName: '请求参数'
        },
        {
          field: 'method',
          fieldName: 'method'
        }
      ],
      dataLoading: false
    }
  },
  methods: {
    fetchList () {
      let params = {
        page: this.page
      }
      this.dataLoading = true
      GetSystemLog(params)
        .then(res => {
          this.dataList = res.result.list || []
          this.total = res.result.total || 0
          this.dataLoading = false
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    currentChange (num) {
      this.page.pageNum = num
      this.fetchList()
    },
    sizeChange (size) {
      this.page.pageSize = size
      this.fetchList()
    }
  },
  created () {
    this.fetchList()
  }
}
</script>
