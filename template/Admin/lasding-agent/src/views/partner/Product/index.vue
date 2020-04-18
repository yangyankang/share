<template>
  <el-card shadow="never">
    <el-tabs v-model="tabActive">
      <el-tab-pane label="系统产品" name="system">
        <el-form
          label-width="90px"
          ref="searchForm"
          class="search-form"
          :model="searchForm"
          @submit.native.prevent
        >
          <el-row>
            <el-col :xl="6" :lg="8" :md="8" :sm="12">
              <el-form-item label="产品名称：" prop="productName">
                <el-input
                  clearable
                  size="small"
                  placeholder="请输入产品名称"
                  v-model="searchForm.productName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="2" :lg="2" :md="4" :sm="4">
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
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              @click="dialogVisible = true"
            >
              新增
            </el-button>
            <!-- <el-button
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
          border
          :data="dataList"
          header-row-class-name="table-header-style"
          header-cell-class-name="table-header-cell-style"
          v-loading="dataLoading"
        >
          <el-table-column type="index" align="center"></el-table-column>
          <el-table-column label="产品名称" prop="productName"></el-table-column>
          <el-table-column label="产品类别" prop="categoryIdDictText"></el-table-column>
          <el-table-column label="产品子类别" prop="subcategoryIdDictText"></el-table-column>
          <el-table-column label="产品品牌" prop="brandId"></el-table-column>
          <el-table-column label="安装难度" prop="fixLevelDictText" width="90" align="center"></el-table-column>
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
            :total="total"
            :page-size="page.pageSize"
            :current-page="page.pageNum"
            @size-change="sizeChange"
            @current-change="currentChange"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="自有产品" name="own">
        <el-form
          label-width="90px"
          ref="searchForm"
          class="search-form"
          :model="ownSearch"
          @submit.native.prevent
        >
          <el-row>
            <el-col :xl="6" :lg="8" :md="8" :sm="12">
              <el-form-item label="产品名称：" prop="productName">
                <el-input
                  clearable
                  size="small"
                  placeholder="请输入产品名称"
                  v-model="ownSearch.productName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="2" :lg="2" :md="4" :sm="4">
              <el-form-item label-width="10px">
                <el-button
                  size="small"
                  type="primary"
                  @click="fetchOwnProduct"
                >查询</el-button>
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
            <!-- <el-button
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
          border
          :data="ownProducts"
          header-row-class-name="table-header-style"
          header-cell-class-name="table-header-cell-style"
          v-loading="dataLoading"
        >
          <el-table-column type="index" align="center"></el-table-column>
          <el-table-column label="产品名称" prop="productName"></el-table-column>
          <el-table-column label="产品类别" prop="categoryIdDictText"></el-table-column>
          <el-table-column label="产品子类别" prop="subcategoryIdDictText"></el-table-column>
          <el-table-column label="产品品牌" prop="brandId"></el-table-column>
          <el-table-column label="安装难度" prop="fixLevelDictText"></el-table-column>
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
            :total="ownTotal"
            :page-size="ownPage.pageSize"
            :current-page="ownPage.pageNum"
            @size-change="ownSizeChange"
            @current-change="ownCurrentChange"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
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
      @confirm="confirmSubmit"
      :is-own="this.tabActive === 'own'"
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
  GetProduct,
  deleteProduct,
  GetTbProducts,
  createProduct,
  updateProduct,
  createTbProduct,
  updateTbProduct
} from '@/api/product'
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
        productName: ''
      },
      tableConfigShow: false,
      ownPage: {
        pageSize: 10,
        pageNum: 1
      },
      ownTotal: 0,
      ownProducts: [],
      ownSearch: {
        productName: ''
      },
      tabActive: 'system'
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
      GetProduct(params)
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
    ownCurrentChange (num) {
      this.page.pageNum = num
      this.fetchOwnProduct()
    },
    ownSizeChange (size) {
      this.page.pageSize = size
      this.fetchOwnProduct()
    },
    sortChange () {},
    openEdit (row) {
      this.isEdit = true
      this.dialogVisible = true
      this.$refs.handleDialog.handleEdit(row)
    },
    openRemove (row) {
      const {
        productName,
        id
      } = row
      this.$confirm(`您确定删除--${productName}--类型嘛？`, '系统提示', {})
        .then(() => {
          deleteProduct(id)
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
    confirmSubmit (data, done) {
      switch (this.tabActive) {
        case 'system':
          if (this.isEdit) {
            updateProduct(data)
              .then(() => {
                this.submitOkMessage('修改产品信息', done)
              })
              .catch(err => {
                done()
                this.$message.error(err.message)
              })
            return
          }
          createProduct(data)
            .then(() => {
              this.submitOkMessage('新增产品', done)
            })
            .catch(err => {
              done()
              this.$message.error(err.message)
            })
          break
        case 'own':
          if (this.isEdit) {
            updateTbProduct(data)
              .then(() => {
                this.submitOkMessage('修改产品信息', done)
              })
              .catch(err => {
                done()
                this.$message.error(err.message)
              })
            return
          }
          createTbProduct(data)
            .then(() => {
              this.submitOkMessage('新增产品', done)
            })
            .catch(err => {
              done()
              this.$message.error(err.message)
            })
          break
      }
    },
    submitOkMessage (str, done) {
      this.$notify({
        title: '系统提示',
        message: str + '成功',
        type: 'success'
      })
      this.dialogVisible = false
      done()
      switch (this.tabActive) {
        case 'system':
          this.fetchList()
          break
        case 'own':
          this.fetchOwnProduct()
          break
      }
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.fetchList()
    },
    tableConfigSaveOk () {},
    fetchOwnProduct () {
      let params = {
        page: this.ownPage
      }
      GetTbProducts(params)
        .then(res => {
          this.ownProducts = res.result.list || []
          this.ownTotal = res.result.total || 0
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  },
  watch: {
    tabActive (val) {
      switch (val) {
        case 'system':
          this.fetchList()
          break
        case 'own':
          this.fetchOwnProduct()
          break
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
