<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
    append-to-body
    top="5vh"
  >
    <div style="margin: 0 -10px;">
      <el-form
        label-width="90px"
        ref="search"
        :model="search"
        inline
        @submit.native.prevent
      >
        <el-form-item label="师傅信息：" prop="name">
          <el-input
            size="small"
            v-model.trim="search.name"
            placeholder="请输入技师信息"
          ></el-input>
        </el-form-item>
        <el-form-item label-width="5px">
          <el-button
            size="small"
            type="primary"
            @click="fetchList"
          >查询</el-button>
        </el-form-item>
      </el-form>
      <list-table
        :data="dataList"
        :show-columns="showCols"
        v-loading="dataLoading"
        @row-click="rowClick"
        @row-dblclick="rowDblclick"
        :show-checkbox="multiple"
        @selection-change="selectChange"
      >
      </list-table>
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
        @click="chooseOk"
      >提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import baseMinix from '@/utils/baseMinix'
import { findTech } from '@/api/technician'
import ListTable from '@/components/ListTable'
export default {
  mixins: [dialogMinix, baseMinix],
  components: {
    ListTable
  },
  props: {
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      search: {
        name: ''
      },
      url: {
        config: '/technician'
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
      for (let k in this.search) {
        if (this.search[k] !== '') {
          params[k] = this.search[k]
        }
      }
      this.dataLoading = true
      findTech(params)
        .then(res => {
          this.dataList = res.result.list || []
          this.total = res.result.total || 0
          this.dataLoading = false
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    chooseOk () {
      if (this.multiple) {
        if (this.selects.length <= 0) {
          this.$message({
            title: 'warning',
            message: '请选择技师'
          })
          return
        }
        this.$emit('confirm', this.selects)
      } else {
        this.$emit('confirm', this.checked)
      }
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
      if (this.editMiddle) {
        this.search = {...this.editMiddle}
      } else {
        this.$refs.search.resetFields()
      }
      this.$refs.search.clearValidate()
      this.$emit('close')
    },
    currentChange (num) {
      this.page.pageNum = num
      this.fetchList()
    },
    sizeChange (size) {
      this.page.pageSize = size
      this.fetchList()
    },
    rowClick (row) {
      this.checked = {...row}
    },
    rowDblclick () {
      if (!this.multiple) {
        this.$emit('confirm', this.checked)
      }
    },
    selectChange (ss) {
      this.selects = [...ss]
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.fetchList()
      }
    }
  }
}
</script>

<style>

</style>
