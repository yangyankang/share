<template>
  <el-card shadow="never">
    <el-form
      ref="searchForm"
      label-width="90px"
      :model="searchForm"
    >
      <el-row>
        <el-col :xl="6" :lg="8" :md="8" :sm="12">
          <el-form-item label="任务类名：" prop="jobClassName">
            <el-input
              size="small"
              placeholder="请输入类名"
              v-model="searchForm.jobClassName"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="8" :sm="12">
          <el-form-item label="任务类名：" prop="status">
            <el-radio-group size="small" v-model="searchForm.status">
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button :label="1">正常</el-radio-button>
              <el-radio-button :label="0">停止</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="8" :sm="12">
          <el-form-item label-width="10px">
            <el-button
              size="small"
              type="primary"
              @click="fetchList"
            >查询</el-button>
            <el-button
              size="small"
              type="primary"
              @click="resetSearch"
            >
              重置
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="header-btns-wrapper">
      <div class="fr">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="dialogVisible = true"
        >
          新增
        </el-button>
      </div>
    </div>
    <el-table
      border
      :data="dataList"
      header-row-class-name="table-header-style"
      header-cell-class-name="table-header-cell-style"
      v-loading="dataLoading"
    >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="任务类名" prop="jobClassName"></el-table-column>
      <el-table-column label="cron表达式" prop="cronExpression" align="center" sortable width="120"></el-table-column>
      <el-table-column label="参数" prop="parameter"></el-table-column>
      <el-table-column label="描述" prop="description"></el-table-column>
      <el-table-column label="状态" prop="statusDictText" align="center" width="100"></el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <span class="table-handle-btns" slot-scope="{row}">
          <span v-if="row.status === 1" class="handle-btn warn" @click="openClose(row)">
            关闭
          </span>
          <span class="handle-btn primary" v-else @click="openStart(row)">
            启动
          </span>
          <span class="handle-btn warn" @click="openEdit(row)">
            编辑
          </span>
          <span class="handle-btn danger" @click="openRemove(row)">
            删除
          </span>
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
    <handle-dialog
      ref="handleDialog"
      :edit="isEdit"
      @close="dialogClose"
      v-model="dialogVisible"
      @submit-ok="submitOk"
    ></handle-dialog>
  </el-card>
</template>

<script>
import { GetQuartzJob, deleteQuartzJob, startJob, closeJob } from '@/api/system'
import HandleDialog from './handleDialog'
export default {
  components: {
    HandleDialog
  },
  data () {
    return {
      dataLoading: false,
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 1,
      dataList: [],
      dialogVisible: false,
      isEdit: false,
      searchForm: {
        jobClassName: '',
        status: ''
      }
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
      GetQuartzJob(params)
        .then(res => {
          this.dataList = res.result.list || []
          this.total = res.result.total || 0
          this.dataLoading = false
        })
        .catch(err => {
          this.dataLoading = false
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
    submitOk () {
      this.dialogVisible = false
      this.fetchList()
    },
    dialogClose () {
      this.isEdit = false
    },
    openEdit (row) {
      this.isEdit = true
      this.dialogVisible = true
      this.$refs.handleDialog.handleEdit(row)
    },
    openRemove (row) {
      const {
        jobClassName,
        id
      } = row
      this.$confirm(`您确定删除--${jobClassName}--任务嘛`, '系统提示', {})
        .then(() => {
          deleteQuartzJob(id)
            .then(() => {
              this.$notify({
                title: '系统提示',
                message: '删除成功!',
                type: 'success'
              })
              this.fetchList()
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {})
    },
    openStart (row) {
      const {
        jobClassName,
        id
      } = row
      this.$confirm(`您确定启动--${jobClassName}--任务嘛?`, '系统提示', {})
        .then(() => {
          startJob(id)
            .then(res => {
              this.$notify({
                title: '系统提示',
                message: '启动成功',
                type: 'success'
              })
              this.fetchList()
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {})
    },
    openClose (row) {
      const {
        jobClassName,
        id
      } = row
      this.$confirm(`您确定启动--${jobClassName}--任务嘛?`, '系统提示', {})
        .then(() => {
          closeJob(id)
            .then(res => {
              this.$notify({
                title: '系统提示',
                message: '已停止成功',
                type: 'success'
              })
              this.fetchList()
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {})
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.fetchList()
    }
  },
  created () {
    this.fetchList()
  }
}
</script>

<style>

</style>
