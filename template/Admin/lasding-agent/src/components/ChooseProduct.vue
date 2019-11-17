<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <div>
      <el-table
        border
        :data="dataList"
        header-row-class-name="table-header-style"
        header-cell-class-name="table-header-cell-style"
        v-loading="dataLoading"
        @selection-change="selectsChange"
        highlight-current-row
        @row-click="rowClick"
      >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column type="selection" align="center" reserve-selection v-if="multiple"></el-table-column>
        <el-table-column label="产品名称" prop="productName"></el-table-column>
        <el-table-column label="产品类别" prop="categoryIdDictText"></el-table-column>
        <el-table-column label="产品子类别" prop="subcategoryIdDictText"></el-table-column>
        <el-table-column label="产品品牌" prop="brandId"></el-table-column>
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
    </div>
    <span slot="footer">
      <el-button
        size="small"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="$emit('change', false)"
      >取消</el-button>
      <el-button
        size="small"
        type="primary"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="confirm"
      >提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import baseMinix from '@/utils/baseMinix'
import {
  GetProduct
} from '@/api/product'
export default {
  mixins: [dialogMinix, baseMinix],
  props: {
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      url: {
        config: ''
      },
      selects: [],
      checked: {}
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
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
    handleEdit (row) {
      this.editMiddle = {...this.form}
      this.form = {...row}
    },
    submitOkMessage (msg) {
      this.$notify({
        title: '系统提示',
        message: `${msg}成功`,
        type: 'success'
      })
      this.$emit('submit-ok')
      this.btnLoading = false
    },
    dialogClose () {
      this.$emit('close')
    },
    selectsChange (ss) {
      this.selects = [...ss]
    },
    confirm () {
      this.btnLoading = true
      let done = () => {
        this.btnLoading = false
      }
      if (this.multiple) {
        this.$emit('confirm', this.selects, done)
      } else {
        this.$emit('confirm', this.checked, done)
      }
    },
    rowClick (row) {
      this.checked = {...row}
    }
  },
  created () {
    this.fetchList()
  }
}
</script>

<style>

</style>
