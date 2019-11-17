<template>
  <el-card shadow="never">
    <el-form
      label-width="90px"
      ref="searchForm"
      class="search-form"
      :model="searchForm"
    >
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
        <el-button
          size="small"
          type="primary"
          @click="openProduct"
        >绑定产品</el-button>
        <el-button
          size="small"
          v-if="selects.length > 0"
          @click="removeMore"
        >批量删除</el-button>
        <el-button
          size="small"
          type="primary"
          @click="openBrand"
        >品牌管理</el-button>
      </div>
      <div>
        <el-button
          size="small"
          @click="Goback"
        >返回</el-button>
      </div>
    </div>
    <el-table
      border
      :data="dataList"
      header-row-class-name="table-header-style"
      header-cell-class-name="table-header-cell-style"
      v-loading="dataLoading"
      @selection-change="selectsChange"
      row-key="id"
    >
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column type="selection" align="center" reserve-selection></el-table-column>
      <el-table-column label="产品名称" prop="productName"></el-table-column>
      <el-table-column label="产品类别" prop="categoryIdDictText"></el-table-column>
      <el-table-column label="产品子类别" prop="subcategoryIdDictText"></el-table-column>
      <el-table-column label="产品品牌" prop="brandId"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <span slot-scope="{row}" class="table-handle-btns">
          <!-- <span class="handle-btn warn" @click="openEdit(row)">
            编辑
          </span> -->
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
      @confirm="submitConfirm"
    ></handle-dialog>
    <choose-product
      v-model="chooseProductVisible"
      multiple
      @confirm="chooseConfirm"
    ></choose-product>
  </el-card>
</template>

<script>
import baseMinix from '@/utils/baseMinix'
import HandleDialog from '../handleDialog'
import ChooseProduct from '@/components/ChooseProduct'
import {
  GetTbProducts,
  createTbProduct,
  // updateTbProduct,
  TbBindProduct,
  deleteTbProduct
} from '@/api/product'
export default {
  mixins: [baseMinix],
  components: {
    HandleDialog,
    ChooseProduct
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
      searchForm: {},
      tableConfigShow: false,
      chooseProductVisible: false,
      selects: []
    }
  },
  methods: {
    fetchList () {
      let params = {
        page: this.page,
        partnerId: this.$route.query.pId
      }
      GetTbProducts(params)
        .then(res => {
          this.dataList = res.result.list || []
          this.total = res.result.total || 0
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
        productName,
        id
      } = row
      this.$confirm(`您确定删除--${productName}--产品嘛？`, '系统提示', {})
        .then(() => {
          let params = {
            partnerId: this.$route.query.pId,
            productIds: [id]
          }
          deleteTbProduct(params)
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
    dialogClose () {},
    submitOk () {
      this.dialogVisible = false
      this.fetchList()
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.fetchList()
    },
    tableConfigSaveOk () {},
    submitConfirm (data, done) {
      let params = {
        ...data,
        partnerId: this.$route.query.pId
      }
      createTbProduct(params)
        .then(res => {
          this.$notify({
            title: '系统提示',
            message: '新增产品成功',
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
    openProduct (row) {
      this.chooseProductVisible = true
    },
    chooseConfirm (data, done) {
      let params = {
        productIds: data.map(x => x.id),
        partnerId: this.$route.query.pId
      }
      TbBindProduct(params)
        .then(res => {
          this.$notify({
            title: '系统提示',
            message: '绑定产品成功',
            type: 'success'
          })
          done()
          this.chooseProductVisible = false
          this.fetchList()
        })
        .catch(err => {
          done()
          this.$message.error(err.message)
        })
    },
    selectsChange (ss) {
      this.selects = [...ss]
    },
    removeMore () {
      this.$confirm(`您确定删除这些产品嘛？`, '系统提示', {})
        .then(() => {
          let params = {
            partnerId: this.$route.query.pId,
            productIds: this.selects.map(x => x.id)
          }
          deleteTbProduct(params)
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
    openBrand () {
      this.$router.push({
        path: '/partner/brand/own',
        query: {...this.$route.query}
      })
    },
    Goback () {
      this.$router.push({
        path: '/partner/list'
      })
    }
  },
  created () {
    this.fetchList()
  }
}
</script>

<style>

</style>
