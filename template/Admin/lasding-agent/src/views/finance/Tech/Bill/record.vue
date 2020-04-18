<template>
  <el-card shadow="never">
    <el-form
      label-width="90px"
      ref="searchForm"
      class="search-form"
      :model="searchForm"
    >
      <el-row>
        <el-col :xl="6" :lg="8" :md="8" :sm="12">
          <el-form-item label="账期：" prop="tradeCycle">
            <el-date-picker
              value-format="yyyy-MM-dd"
              size="small"
              v-model="searchForm.tradeCycle"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="6" :sm="8" :xs="8">
          <el-form-item>
            <el-button
              size="small"
              type="primary"
              @click="fetchList"
            >查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="header-btns-wrapper">
      <div>
        <el-button
          size="small"
          @click="$router.push('/finance/tech/bill')"
        >返回</el-button>
      </div>
      <!-- <div class="fr">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="dialogVisible = true"
        >
          新增
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="setColsVisible = true">
          表格配置
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="tableConfigShow = true">
          管理配置
        </el-button>
      </div> -->
    </div>
    <list-table
      :data="dataList"
      :show-columns="showCols"
      @sort-change="sortChange"
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
    <!-- <set-table-cols
      v-model="setColsVisible"
      @confirm="setTableColsOk"
      :url="url"
    >
    </set-table-cols> -->
    <!-- <handle-dialog
      ref="handleDialog"
      :edit="isEdit"
      @close="dialogClose"
      v-model="dialogVisible"
      @submit-ok="submitOk"
    ></handle-dialog> -->
    <!-- <table-config
      v-model="tableConfigShow"
      :url="url"
      @save-ok="tableConfigSaveOk"
    >
    </table-config> -->
  </el-card>
</template>

<script>
import baseMinix from '@/utils/baseMinix'
// import SetTableCols from '@/components/SetTableCols'
import ListTable from '@/components/ListTable'
// import TableConfig from '@/components/TableConfig'
// import HandleDialog from './handleDialog'
import { billRecords } from '@/api/technician'
import { parseTime } from '@/utils'
export default {
  mixins: [baseMinix],
  components: {
    ListTable
    // SetTableCols,
    // HandleDialog,
    // TableConfig
  },
  data () {
    return {
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      dataList: [],
      cRow: {},
      dialogVisible: false,
      setColsVisible: false,
      url: {
        config: ''
      },
      searchForm: {
        tradeCycle: parseTime(new Date(), 'yyyy-MM-dd')
      },
      tableConfigShow: false,
      showCols: [
        {field: 'id', fieldName: '交易单号'},
        {field: 'tradeCycle', fieldName: '账期'},
        {field: 'tradeTime', fieldName: '交易时间'},
        {field: 'tradeChannel', fieldName: '支付方式'},
        {field: 'actualAmount', fieldName: '实际金额'}
      ]
    }
  },
  computed: {
    techId () {
      return this.$route.query.tId
    }
  },
  methods: {
    fetchList () {
      let params = {
        page: this.page,
        technicianId: this.techId
      }
      for (let k in this.searchForm) {
        if (this.searchForm[k] !== '') {
          params[k] = this.searchForm[k]
        }
      }
      this.dataLoading = true
      billRecords(params)
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
    },
    sortChange () {},
    openEdit (row) {
      this.$refs.handleDialog.handleEdit(row)
    },
    openRemove (row) {
      const {
        typeName,
        id
      } = row
      this.$confirm(`您确定删除--${typeName}--类型嘛？`, '系统提示', {})
        .then(() => {
          alert(id)
          // deletePriceType(id)
          //   .then(() => {
          //     this.$notify({
          //       title: '系统提示',
          //       message: '删除成功!',
          //       type: 'success'
          //     })
          //     this.fetchList()
          //   })
          //   .catch(err => {
          //     this.$message.error(err.message)
          //   })
        })
        .catch(() => {})
    },
    dialogClose () {},
    submitOk () {
      this.dialogVisible = false
      this.fetchList()
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.fetchList()
    },
    tableConfigSaveOk () {}
  },
  watch: {
    techId (val) {
      if (val) {
        this.fetchList()
      }
    }
  },
  created () {
    this.fetchList()
  }
}
</script>

<style>

</style>
