<template>
  <el-dialog
    width="800px"
    title="选择价格组"
    append-to-body
    :visible.sync="model"
    :close-on-click-modal="false"
  >
    <el-table
      border
      header-row-class-name="table-header-style"
      header-cell-class-name="table-header-cell-style"
      highlight-current-row
      :data="dataList"
      @row-click="rowClick"
      @row-dblclick="confirm"
    >
      <el-table-column label="分组名称" prop="groupName"></el-table-column>
      <el-table-column label="分组模式" prop="groupModeDictText"></el-table-column>
      <!-- <el-table-column label="操作">
        <span slot-scope="{row}" class="table-handle-btns">
          <span class="handle-btn primary" @click="GoStrategy(row)">
            策略
          </span>
        </span>
      </el-table-column> -->
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
      >确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import {
  GetTpPriceGroup
} from '@/api/price'
export default {
  mixins: [dialogMinix],
  data () {
    return {
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      dataList: [],
      cRow: {}
    }
  },
  methods: {
    fetchList () {
      let params = {
        page: this.page
      }
      this.dataLoading = true
      GetTpPriceGroup(params)
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
    rowClick (row) {
      this.cRow = {...row}
    },
    confirm () {
      if (Object.keys(this.cRow).length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择价格组'
        })
      }
      this.$emit('confirm', this.cRow)
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.dataList.length <= 0) {
          this.fetchList()
        }
      }
    }
  }
}
</script>

<style>

</style>
