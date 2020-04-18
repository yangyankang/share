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
          @click="openBrandChoose"
        >
          绑定品牌
        </el-button>
      </div>
      <div>
        <el-button
          size="small"
          @click="Goback()"
        >返回</el-button>
      </div>
    </div>
    <el-table
      border
      header-row-class-name="table-header-style"
      header-cell-class-name="table-header-cell-style"
      v-loading="dataLoading"
      :data="dataList"
    >
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column label="品牌名称" prop="brandName"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <span slot-scope="{row}" class="table-handle-btns">
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
      v-model="dialogVisible"
      @confirm="submitConfirm"
      @close="dialogClose"
      :edit="isEdit"
    ></handle-dialog>
    <choose-brand
      v-model="chooseVisible"
      multiple
      @confirm="chooseConfirm"
    ></choose-brand>
  </el-card>
</template>

<script>
import baseMinix from '@/utils/baseMinix'
import HandleDialog from '../handleDialog'
import ChooseBrand from '@/components/ChooseBrand'
import {
  GetTbBrand,
  createTbBrand,
  deleteTbBrand,
  tbBrandBind
} from '@/api/product'
export default {
  mixins: [baseMinix],
  components: {
    HandleDialog,
    ChooseBrand
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
      chooseVisible: false
    }
  },
  methods: {
    fetchList () {
      let params = {
        page: this.page,
        partnerId: this.$route.query.pId
      }
      this.dataLoading = true
      GetTbBrand(params)
        .then(res => {
          this.dataList = res.result.list || []
          this.total = res.result.total || 0
          this.dataLoading = false
        })
        .catch(err => {
          this.$.message.error(err.message)
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
        brandName,
        id
      } = row
      this.$confirm(`您确定删除--${brandName}--品牌嘛？`, '系统提示', {})
        .then(() => {
          deleteTbBrand(id)
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
      createTbBrand(params)
        .then(res => {
          this.$notify({
            title: '系统提示',
            message: '品牌创建成功!',
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
    Goback () {
      this.$router.push({
        path: '/partner/product/own',
        query: {
          pId: this.$route.query.pId
        }
      })
    },
    openBrandChoose () {
      this.chooseVisible = true
    },
    chooseConfirm (data, done) {
      let params = {
        partnerId: this.$route.query.pId,
        brandIds: data.map(x => x.id)
      }
      tbBrandBind(params)
        .then(res => {
          this.$notify({
            title: '系统提示',
            message: '绑定成功!',
            type: 'success'
          })
          done()
          this.fetchList()
          this.chooseVisible = false
        })
        .catch(err => {
          done()
          this.$message.error(err.message)
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
