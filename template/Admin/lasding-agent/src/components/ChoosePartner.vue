<template>
  <el-dialog
    title="选择商家"
    width="800px"
    :visible.sync="model"
    append-to-body
  >
    <el-table
      :data="dataList"
      @sort-change="sortChange"
      v-loading="dataLoading"
      header-row-class-name="table-header-style"
      header-cell-class-name="table-header-cell-style"
      row-key="partnerCode"
      border
      max-height="450"
      highlight-current-row
      @selection-change="selectsChange"
      @row-click="rowClick"
      @row-dblclick="rowDblclick"
    >
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column type="selection" align="center" v-if="multiple" reserve-selection></el-table-column>
      <template v-if="showCols.length > 0">
        <el-table-column
          v-for="item in showCols"
          :key="item.field"
          :prop="item.field"
          :label="item.fieldName"
          :width="item.fieldWidth ? item.fieldWidth : ''"
          :align="item.fieldAlign"
          :sortable="item.fieldSort ? true : false"
          show-overflow-tooltip
        ></el-table-column>
      </template>
      <el-table-column v-else></el-table-column>
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
        @click="$emit('change', false)"
      >取消</el-button>
      <el-button
        size="small"
        type="primary"
        @click="rowDblclick"
      >确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import baseMinix from '@/utils/baseMinix'
import { fetchPartners } from '@/api/partner'
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
        config: '/tp/partner',
        partnerName: ''
      },
      searchForm: {},
      selects: [],
      checked: {}
    }
  },
  methods: {
    fetchList () {
      let params = {
        page: this.page
      }
      for (let k in this.searchForm) {
        if (params[k] !== '') {
          params[k] = this.searchForm[k]
        }
      }
      this.dataLoading = true
      fetchPartners(params)
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
    selectsChange (ss) {
      this.selects = [...ss]
    },
    rowClick (row) {
      this.checked = {...row}
    },
    rowDblclick () {
      if (this.multiple) {
        this.$emit('confirm', this.selects)
      } else {
        this.$emit('confirm', this.checked)
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
