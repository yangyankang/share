<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <el-table
      border
      header-row-class-name="table-header-style"
      header-cell-class-name="table-header-cell-style"
      v-loading="dataLoading"
      :data="dataList"
      max-height="400"
      row-key="id"
      @row-click="rowClick"
      @selection-change="selectsChange"
    >
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column type="selection" align="center" reserve-selection v-if="multiple"></el-table-column>
      <el-table-column label="品牌名称" prop="brandName"></el-table-column>
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
import { GetBrands } from '@/api/product'
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
      checked: {},
      selects: []
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
        }
      })
    },
    fetchBrands () {
      let params = {
        page: this.page
      }
      this.dataLoading = true
      GetBrands(params)
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
      this.fetchBrands()
    },
    sizeChange (size) {
      this.page.pageSize = size
      this.fetchBrands()
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
    rowClick (row) {
      this.checked = {...row}
    },
    confirm () {
      let done = () => {
        this.btnLoading = false
      }
      if (this.multiple) {
        if (this.selects.length <= 0) {
          this.$message({
            type: 'warning',
            message: '请选择品牌'
          })
          return
        }
        this.btnLoading = true
        this.$emit('confirm', this.selects, done)
      } else {
        if (Object.keys(this.checked).length <= 0) {
          this.$message({
            type: 'warning',
            message: '请选择一个品牌!'
          })
          return
        }
        this.btnLoading = true
        this.$emit('confirm', this.checked, done)
      }
    },
    selectsChange (ss) {
      this.selects = [...ss]
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.fetchBrands()
      }
    }
  }
}
</script>

<style>

</style>
