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
    <el-table
      :data="dataList"
      @sort-change="sortChange"
      v-loading="dataLoading"
      header-row-class-name="table-header-style"
      header-cell-class-name="table-header-cell-style"
      row-key="regionCode"
      border
      lazy
      :load="lazyLoad"
      :tree-props="{hasChildren: 'regionCode'}"
    >
      <el-table-column label="区域名称" prop="regionName"></el-table-column>
      <el-table-column label="区域类型" prop="regionType" width="150" align="center"></el-table-column>
      <el-table-column label="区域等级" prop="regionGradeDictText" align="center"></el-table-column>
      <el-table-column label="区域编码" prop="regionCode" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <span class="table-handle-btns" slot-scope="{row}">
          <span class="handle-btn warn" @click="openEdit(row)">
            编辑
          </span>
          <span class="handle-btn danger" @click="openRemove(row)">
            删除
          </span>
        </span>
      </el-table-column>
    </el-table>
    <!-- <div class="pages-wrapper">
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
    </div> -->
    <handle-dialog
      ref="handleDialog"
      :edit="isEdit"
      @close="dialogClose"
      v-model="dialogVisible"
      @submit-ok="submitOk"
      :parent-data="dataList"
    ></handle-dialog>
  </el-card>
</template>

<script>
import baseMinix from '@/utils/baseMinix'
import ListTable from '@/components/ListTable'
import HandleDialog from './handleDialog'
import { GetRegionsList, deleteRegion } from '@/api/system'
export default {
  mixins: [baseMinix],
  components: {
    ListTable,
    HandleDialog
  },
  data () {
    return {
      page: {
        pageSize: 20,
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
      showCols: [
        {
          field: 'regionName',
          fieldName: '区域名称'
        },
        {
          field: 'regionType',
          fieldName: '区域类型',
          fieldAlign: 'center'
        },
        {
          field: 'regionGradeDictText',
          fieldName: '区域级别',
          fieldAlign: 'center'
        }
      ]
    }
  },
  methods: {
    fetchList () {
      this.dataLoading = true
      let params = {
        regionGrade: 1
      }
      GetRegionsList(params)
        .then(res => {
          var result = res.result || []
          this.dataList = result
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
    openEdit (row) {
      this.dialogVisible = true
      this.isEdit = true
      this.$refs.handleDialog.handleEdit(row)
    },
    dialogClose () {
      this.isEdit = false
    },
    submitOk () {
      this.dialogVisible = false
      this.fetchList()
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.fetchList()
    },
    openRemove (row) {
      const {
        id,
        regionName
      } = row
      this.$confirm(`您确定删除--${regionName}--地区嘛？`, '系统提示', {})
        .then(() => {
          deleteRegion(id)
            .then(res => {
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
    lazyLoad (row, node, resolve) {
      let params = {
        regionGrade: row.regionGrade + 1,
        parentCode: row.regionCode
      }
      this.dataLoading = true
      GetRegionsList(params)
        .then(res => {
          var result = res.result || []
          resolve(result)
          this.dataLoading = false
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  },
  created () {
    this.fetchList()
  }
}
</script>
