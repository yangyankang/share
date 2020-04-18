<template>
  <el-card shadow="never">
    <el-tabs>
      <el-tab-pane label="系统品牌">
        <el-form
          ref="search1"
          label-width="90px"
          :model="search1"
          inline
          @submit.native.prevent
        >
          <el-form-item label="品牌名称：" prop="brandName">
            <el-input
              size="small"
              placeholder="请输入品牌名称"
              v-model="search1.brandName"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              size="small"
              type="primary"
              @click="fetchList1"
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
          header-row-class-name="table-header-style"
          header-cell-class-name="table-header-cell-style"
          v-loading="dataLoading"
          :data="dataList1"
        >
          <el-table-column type="index" align="center"></el-table-column>
          <el-table-column label="品牌名称" prop="brandName"></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <span slot-scope="{row}" class="table-handle-btns">
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
            :total="total1"
            :page-size="page1.pageSize"
            :current-page="page1.pageNum"
            @size-change="sizeChange1"
            @current-change="currentChange1"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="自建品牌">
        <el-table
          border
          header-row-class-name="table-header-style"
          header-cell-class-name="table-header-cell-style"
          v-loading="dataLoading"
          :data="dataList1"
        >
          <el-table-column type="index" align="center"></el-table-column>
          <el-table-column label="品牌名称" prop="brandName"></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <span slot-scope="{row}" class="table-handle-btns">
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
            :total="total1"
            :page-size="page1.pageSize"
            :current-page="page1.pageNum"
            @size-change="sizeChange1"
            @current-change="currentChange1"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="待审核"></el-tab-pane>
    </el-tabs>
    <handle-dialog
      ref="handleDialog"
      v-model="dialogVisible"
      @confirm="submitConfirm"
      @close="dialogClose"
      :edit="isEdit"
    ></handle-dialog>
  </el-card>
</template>

<script>
import HandleDialog from './handleDialog'
import { GetBrands, createBrand, updateBrand, deleteBrand } from '@/api/product'
export default {
  components: {
    HandleDialog
  },
  data () {
    return {
      dataList1: [],
      page1: {
        pageSize: 10,
        pageNum: 1
      },
      total1: 0,
      search1: {
        brandName: ''
      },
      dataLoading: false,
      dialogVisible: false,
      cRow: {},
      isEdit: false
    }
  },
  methods: {
    submitConfirm (data, done) {
      if (this.isEdit) {
        updateBrand(data)
          .then(() => {
            this.$notify({
              title: '系统提示',
              message: '更新品牌信息成功',
              type: 'success'
            })
            done()
            this.fetchList1()
            this.dialogVisible = false
          })
          .catch(err => {
            done()
            this.$message.error(err.message)
          })
        return
      }
      createBrand(data)
        .then(() => {
          this.$notify({
            title: '系统提示',
            message: '新增品牌成功',
            type: 'success'
          })
          done()
          this.fetchList1()
          this.dialogVisible = false
        })
        .catch(err => {
          done()
          this.$message.error(err.message)
        })
    },
    fetchList1 () {
      let params = {
        page: this.page1
      }
      for (let k in this.search1) {
        if (this.search1[k] !== '') {
          params[k] = this.search1[k]
        }
      }
      this.dataLoading = true
      GetBrands(params)
        .then(res => {
          this.dataList1 = res.result.list || []
          this.total1 = res.result.total || 0
          this.dataLoading = false
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    openEdit (row) {
      this.cRow = {...row}
      this.dialogVisible = true
      this.isEdit = true
      this.$refs.handleDialog.handleEdit(row)
    },
    dialogClose () {
      this.isEdit = false
    },
    openRemove (row) {
      const {
        brandName,
        id
      } = row
      this.$confirm(`您确定删除--${brandName}--品牌嘛？`, '系统提示', {})
        .then(() => {
          deleteBrand(id)
            .then(() => {
              this.$notify({
                title: '系统提示',
                message: '删除成功!',
                type: 'success'
              })
              this.fetchList1()
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {})
    },
    currentChange1 (num) {
      this.page1.pageNum = num
      this.fetchList1()
    },
    sizeChange1 (size) {
      this.page1.pageSize = size
      this.fetchList1()
    }
  },
  created () {
    this.fetchList1()
  }
}
</script>

<style>

</style>
