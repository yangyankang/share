<template>
  <el-card shadow="never">
    <el-form
      label-width="90px"
      ref="searchForm"
      class="search-form"
      :model="searchForm"
      inline
    >
      <el-form-item label="类别名称" prop="categoryName">
        <el-input
          size="small"
          placeholder="请输入类别名称"
          clearable
          v-model.trim="searchForm.categoryName"
        ></el-input>
      </el-form-item>
      <el-form-item label-width="10px">
        <el-button
          size="small"
          type="primary"
          @click="fetchList"
        >查询</el-button>
      </el-form-item>
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
      <el-table-column label="类别名称" prop="categoryName"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <span slot-scope="{row}" class="table-handle-btns">
          <span class="handle-btn primary" @click="openDrawer(row)">
            子类
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
    <child-drawer
      v-model="drawerVisible"
      :row="cRow"
    ></child-drawer>
  </el-card>
</template>

<script>
import baseMinix from '@/utils/baseMinix'
import HandleDialog from './handleDialog'
import ChildDrawer from './childDrawer'
import { GetCategory, deleteCategory } from '@/api/product'
export default {
  mixins: [baseMinix],
  components: {
    HandleDialog,
    ChildDrawer
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
        categoryName: ''
      },
      tableConfigShow: false,
      drawerVisible: false
    }
  },
  methods: {
    fetchList () {
      let params = {
        page: this.page
      }
      this.dataLoading = true
      GetCategory(params)
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
      this.dialogVisible = true
      this.isEdit = true
      this.$refs.handleDialog.handleEdit(row)
    },
    openRemove (row) {
      const {
        categoryName,
        id
      } = row
      this.$confirm(`您确定删除--${categoryName}--类别嘛？`, '系统提示', {})
        .then(() => {
          deleteCategory(id)
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
    dialogClose () {
      this.isEdit = false
    },
    submitOk () {
      this.dialogVisible = false
      this.fetchList()
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.fetchList()
    },
    tableConfigSaveOk () {},
    openDrawer (row) {
      this.cRow = {...row}
      this.drawerVisible = true
    }
  },
  created () {
    this.fetchList()
  }
}
</script>

<style>

</style>
