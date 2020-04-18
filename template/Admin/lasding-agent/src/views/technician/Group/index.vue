<template>
  <el-card shadow="never">
    <el-form
      label-width="90px"
      ref="searchForm"
      class="search-form"
      inline
      :model="searchForm"
    >
      <el-form-item label="团队名称" prop="content">
        <el-input
          size="small"
          placeholder="请输入团队名称"
          v-model.trim="searchForm.content"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="省/市/区" prop="regions">
        <el-cascader
          v-model="searchForm.regions"
          popper-class="add-cascader-height"
          size="small"
          :options="regions"
          :props="{
            checkStrictly: true,
            value: 'regionCode',
            label: 'regionName',
            lazy: true,
            lazyLoad: lazyLoad
          }"
          clearable
          filterable
          style="width: 100%;"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group size="small" v-model="searchForm.status">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button :label="1">启用</el-radio-button>
          <el-radio-button :label="0">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button
          size="small"
          type="primary"
          @click="fetchList"
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
        <el-button
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
        </el-button>
      </div>
    </div>
    <list-table
      :data="dataList"
      :show-columns="showCols"
      @sort-change="sortChange"
      v-loading="dataLoading"
    >
      <template slot="leader.name" slot-scope="{row}">
        {{row.leader.name}}
      </template>
      <template slot="leader.mobile" slot-scope="{row}">
        {{row.leader.mobile}}
      </template>
      <template slot="status" slot-scope="{row}">
        <el-tag
          size="mini"
          :type="row.status === 1 ? 'primary' : 'info'"
        >{{row.status === 1 ? '启用' : '禁用'}}</el-tag>
      </template>
      <el-table-column label="操作" align="center">
        <span class="table-handle-btns" slot-scope="{row}">
          <span class="handle-btn primary" @click="openRember(row)">
            成员
          </span>
          <span class="handle-btn warn" @click="openEdit(row)">
            修改
          </span>
          <span class="handle-btn danger" @click="openRemove(row)">
            删除
          </span>
        </span>
      </el-table-column>
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
      @submit-ok="submitOk"
    ></handle-dialog>
    <table-config
      v-model="tableConfigShow"
      :url="url"
      @save-ok="tableConfigSaveOk"
    >
    </table-config>
    <drawer
      v-model="drawerVisible"
      :row="cRow"
    ></drawer>
  </el-card>
</template>

<script>
import baseMinix from '@/utils/baseMinix'
import SetTableCols from '@/components/SetTableCols'
import ListTable from '@/components/ListTable'
import TableConfig from '@/components/TableConfig'
import HandleDialog from './handleDialog'
import Drawer from './drawer'
import { findTechGroup, deleteTechGroup } from '@/api/technician'
import { GetRegionsList } from '@/api/system'
export default {
  mixins: [baseMinix],
  components: {
    ListTable,
    SetTableCols,
    HandleDialog,
    TableConfig,
    Drawer
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
        config: '/technician/group'
      },
      searchForm: {
        content: '',
        regions: [],
        status: ''
      },
      tableConfigShow: false,
      drawerVisible: false,
      regions: []
    }
  },
  methods: {
    fetchList () {
      let params = {
        page: this.page
      }
      for (let k in this.searchForm) {
        if (k === 'regions') {
          if (this.searchForm[k].length > 0) {
            const [province, city, district] = this.searchForm.regions
            Object.assign(params, {
              province,
              city,
              district
            })
          }
        } else if (this.searchForm[k] !== '') {
          params[k] = this.searchForm[k]
        }
      }
      this.dataLoading = true
      findTechGroup(params)
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
    openEdit (row) {
      this.$refs.handleDialog.handleEdit(row)
      this.isEdit = true
      this.dialogVisible = true
    },
    openRemove (row) {
      const {
        groupName,
        id
      } = row
      this.$confirm(`您确定删除--${groupName}--团队嘛？`, '系统提示', {})
        .then(() => {
          deleteTechGroup(id)
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
    submitOk () {
      this.dialogVisible = false
      this.fetchList()
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.fetchList()
    },
    tableConfigSaveOk () {},
    openRember (row) {
      this.cRow = {...row}
      this.drawerVisible = true
    },
    lazyLoad (node, resolve) {
      const {
        level
      } = node
      let regionCode
      if (node.data) {
        regionCode = node.data.regionCode
      }
      // const {
      //   regionGrade,
      //   regionCode
      // } = node.data
      let params = {
        regionGrade: level + 1,
        parentCode: regionCode
      }
      GetRegionsList(params)
        .then(res => {
          var result = res.result || []
          resolve(result)
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
