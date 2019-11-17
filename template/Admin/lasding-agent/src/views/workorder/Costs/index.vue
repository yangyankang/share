<template>
  <el-card shadow="never">
    <el-form
      label-width="90px"
      ref="searchForm"
      class="search-form"
      :model="searchForm"
    >
      <el-row>
        <el-col :xl="4" :lg="6" :md="8" :sm="12">
          <el-form-item label="工单号" prop="serviceId">
            <el-input
              size="small"
              v-model="searchForm.serviceId"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12">
          <el-form-item label="技师姓名" prop="name">
            <el-input
              size="small"
              v-model="searchForm.name"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12">
          <el-form-item label="状态" prop="status">
            <el-select size="small" v-model="searchForm.status">
              <el-option value="">全部</el-option>
              <el-option
                v-for="item in statusOpts"
                :key="item.value"
                :value="item.value"
                :label="item.text"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="8" :sm="12">
          <el-form-item label-width="10px">
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
      <div class="fr">
        <!-- <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="dialogVisible = true"
        >
          新增
        </el-button> -->
      </div>
    </div>
    <!-- <list-table
      :data="dataList"
      :show-columns="showCols"
      @sort-change="sortChange"
      v-loading="dataLoading"
    >
    </list-table> -->
    <el-table
      :data="dataList"
      v-loading="dataLoading"
      header-row-class-name="table-header-style"
      header-cell-class-name="table-header-cell-style"
      border
    >
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column label="工单号" prop="serviceId" width="110" align="center"></el-table-column>
      <el-table-column label="费用类型" prop="costType" width="120"></el-table-column>
      <el-table-column label="费用" prop="cost" width="80" sortable align="center"></el-table-column>
      <el-table-column label="技师" prop="crtName"></el-table-column>
      <el-table-column label="状态" prop="status" width="90" align="center">
        <template slot-scope="{row}">
          <el-tag
            size="mini"
            :type="row.status | optsFilter(statusOpts, 'value', 'type')"
          >{{row.status | optsFilter(statusOpts, 'value', 'text')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column label="创建时间" prop="crtTime" sortable width="140" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <span class="table-handle-btns" slot-scope="{row}">
          <template v-if="row.status === 0">
            <span class="handle-btn success" @click="openPass(row)">
              通过
            </span>
            <span class="handle-btn warn" @click="openReject(row)">
              驳回
            </span>
          </template>
        </span>
      </el-table-column>
    </el-table>
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
    <set-table-cols
      v-model="setColsVisible"
      @confirm="setTableColsOk"
      :url="url"
    >
    </set-table-cols>
    <handle-dialog
      ref="handleDialog"
      :edit="isEdit"
      @close="dialogClose"
      v-model="dialogVisible"
      @confirm="submitOk"
    ></handle-dialog>
    <table-config
      v-model="tableConfigShow"
      :url="url"
      @save-ok="tableConfigSaveOk"
    >
    </table-config>
  </el-card>
</template>

<script>
import baseMinix from '@/utils/baseMinix'
import SetTableCols from '@/components/SetTableCols'
import ListTable from '@/components/ListTable'
import TableConfig from '@/components/TableConfig'
import HandleDialog from './handleDialog'
import {
  findApplyCost,
  checkCost,
  rejectCost
} from '@/api/workorder'
export default {
  mixins: [baseMinix],
  components: {
    ListTable,
    SetTableCols,
    HandleDialog,
    TableConfig
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
        serviceId: '',
        name: '',
        status: ''
      },
      tableConfigShow: false,
      statusOpts: [
        {value: 0, text: '申请中', type: 'primary'},
        {value: 1, text: '已通过', type: 'success'},
        {value: 2, text: '未激活', type: 'info'},
        {value: -1, text: '已驳回', type: 'warning'}
      ],
      isRefuse: false
    }
  },
  methods: {
    fetchList () {
      let params = {
        page: this.page
      }
      for (let k in this.searchForm) {
        if (this.searchForm[k] !== '') {
          params[k] = this.searchForm[k]
        }
      }
      this.dataLoading = true
      findApplyCost(params)
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
    dialogClose () {
      this.isRefuse = false
    },
    submitOk (data, done) {
      let params = {
        ...data,
        serviceId: this.cRow.serviceId
      }
      if (this.isRefuse) {
        rejectCost(params)
          .then(res => {
            this.$notify({
              title: '系统提示',
              message: '驳回提交成功!',
              type: 'success'
            })
            done()
            this.fetchList()
            this.dialogVisible = false
          })
          .catch(err => {
            done()
            this.$message.error(err.message)
          })
        return
      }
      checkCost(params)
        .then(res => {
          this.$notify({
            title: '系统提示',
            message: '审核通过成功!',
            type: 'success'
          })
          done()
          this.fetchList()
          this.dialogVisible = false
        })
        .catch(err => {
          done()
          this.$message.error(err.message)
        })
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.fetchList()
    },
    tableConfigSaveOk () {},
    openPass (row) {
      this.cRow = {...row}
      this.$refs.handleDialog.setData(row)
      this.isRefuse = false
      this.dialogVisible = true
    },
    openReject (row) {
      this.cRow = {...row}
      this.$refs.handleDialog.setData(row)
      this.isRefuse = true
      this.dialogVisible = true
    }
  },
  created () {
    this.fetchList()
  }
}
</script>

<style>

</style>
