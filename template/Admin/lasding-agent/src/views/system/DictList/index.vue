<template>
  <el-card shadow="hover" v-loading="dataLoading">
    <div>
      <el-form
        label-width="100px"
        ref="searchForm"
        :model="searchForm"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="字典名称：" prop="dictName">
              <el-input
                size="small"
                placeholder="请输入字典名称"
                clearable
                v-model.trim="searchForm.dictName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="字典编号：" prop="dictCode">
              <el-input
                size="small"
                placeholder="请输入字典编号"
                v-model.trim="searchForm.dictCode"
                clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="10px">
              <el-button size="small" type="primary" @click="fetchDictList">
                查询
              </el-button>
              <el-button size="small" @click="resetSearch">
                重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="header-btns-wrapper">
      <el-button
        size="small"
        type="primary"
        icon="el-icon-plus"
        @click="dialogVisible = true">
        新增
      </el-button>
    </div>
    <el-table
      border
      header-row-class-name="table-header-style"
      header-cell-class-name="table-header-cell-style"
      :data="dataList"
    >
      <el-table-column type="selection" align="center">
      </el-table-column>
      <el-table-column prop="dictName" label="字典名称" min-width="50" align="center">
      </el-table-column>
      <el-table-column prop="dictCode" label="字典编码" min-width="50" align="center">
      </el-table-column>
      <el-table-column prop="description" label="字典描述"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <span class="table-handle-btns" slot-scope="{row}">
          <span class="handle-btn warn" @click="openEdit(row)">
            编辑
          </span>
          <span class="handle-btn primary" @click="openItems(row)">
            字典项
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
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="page.pageSize"
        :current-page="page.pageNum"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <dict-handle-dialog
      v-model="dialogVisible"
      :edit="isEdit"
      @close="dialogClose"
      @submit-ok="submitOk"
      ref="dictDialog"
    >
    </dict-handle-dialog>
    <dict-drawer
      v-model="drawerVisible"
      :row="cRow"
    >
    </dict-drawer>
  </el-card>
</template>

<script>
import {
  GetDictList,
  deleteDict
} from '@/api/system'
import baseMinix from '@/utils/baseMinix'
import DictHandleDialog from './DictHandleDialog'
import DictDrawer from './DictHandleDrawer'
export default {
  name: 'DictList',
  components: {
    DictHandleDialog,
    DictDrawer
  },
  mixins: [baseMinix],
  data () {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      dataList: [],
      dialogVisible: false,
      isEdit: false,
      drawerVisible: false,
      cRow: {},
      searchForm: {
        dictName: '',
        dictCode: ''
      },
      url: {}
    }
  },
  methods: {
    fetchDictList () {
      let params = {
        page: this.page
      }
      for (let k in this.searchForm) {
        if (this.searchForm[k] !== '') {
          params[k] = this.searchForm[k]
        }
      }
      this.dataLoading = true
      GetDictList(params)
        .then(res => {
          this.dataLoading = false
          this.dataList = res.result.list || []
          this.total = res.result.total || 0
        })
        .catch(err => {
          this.dataLoading = false
          this.$message.error(err.message)
        })
    },
    currentChange (num) {
      this.page.pageNum = num
      this.fetchDictList()
    },
    sizeChange (size) {
      this.page.pageSize = size
      this.fetchDictList()
    },
    dialogClose () {
      this.isEdit = false
    },
    submitOk () {
      this.dialogVisible = false
      this.fetchDictList()
    },
    openEdit (row) {
      this.isEdit = true
      this.dialogVisible = true
      this.$refs.dictDialog.handleEdit(row)
    },
    openItems (row) {
      this.cRow = {...row}
      this.drawerVisible = true
    },
    openRemove (row) {
      const {
        dictName,
        id
      } = row
      this.$confirm(`您确定删除--${dictName}--字典集吗`, '系统提示', {})
        .then(() => {
          deleteDict(id)
            .then(() => {
              this.$notify({
                title: '系统提示',
                message: '删除成功',
                type: 'success'
              })
              this.fetchDictList()
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.fetchDictList()
    }
  },
  created () {
    this.fetchDictList()
  }
}
</script>

<style>

</style>
