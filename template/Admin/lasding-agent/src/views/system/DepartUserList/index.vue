<template>
  <el-card shadow="never">
    <el-form
      label-width="90px"
      ref="searchForm"
      class="search-form"
      inline
      :model="searchForm"
      @submit.native.prevent
    >
      <el-form-item label="部门名称" prop="departName">
        <el-input size="small" type="primary" v-model="searchForm.departName"></el-input>
      </el-form-item>
      <el-form-item label-width="10px">
        <el-button size="small" type="primary" @click="fetchTreeList">
          查询
        </el-button>
        <el-button size="small" type="primary" @click="resetSearch">
          重置
        </el-button>
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
      :data="dataTree"
      :show-columns="showCols"
      @sort-change="sortChange"
      v-loading="dataLoading"
      row-key="id"
    >
      <el-table-column label="操作" width="150" align="center">
        <span class="table-handle-btns" slot-scope="{row}">
          <span class="handle-btn primary" @click.stop="openAddChild(row)">
            添加
          </span>
          <span class="handle-btn warn" @click.stop="openEdit(row)">
            编辑
          </span>
          <span class="handle-btn danger" @click.stop="openRemove(row)">
            删除
          </span>
        </span>
      </el-table-column>
    </list-table>
    <set-table-cols
      v-model="setColsVisible"
      @confirm="setTableColsOk"
      :url="url"
    >
    </set-table-cols>
    <table-config
      v-model="tableConfigShow"
      :url="url"
      @save-ok="tableConfigSaveOk"
    >
    </table-config>
    <handle-dialog
      ref="handleDialog"
      v-model="dialogVisible"
      :edit="isEdit"
      :tree="dataTree"
      @close="dialogClose"
      @submit-ok="submitOk"
    ></handle-dialog>
  </el-card>
  <!-- <el-row>
    <el-col :xl="12" :lg="12" :md="12" style="background-color: #FFF;">
      <el-card shadow="hover">
        <div style="margin-bottom: 10px;">
          <el-button size="small" type="primary" @click="dialogVisible = true">
            添加一级部门
          </el-button>
        </div>
        <div style="margin-bottom: 10px;">
          <div class="show-checked">
            <span class="checked-body">
              当前选择：
              <span class="checked-name">
                {{treeChecked.departName}}
              </span>
            </span>
            <span style="float: right;">
              <el-button
                size="mini"
                type="text"
                @click="openEdit(treeChecked)"
              >
                编辑
              </el-button>
              <el-button
                size="mini"
                type="text"
                @click="openAddChild(treeChecked)"
              >添加</el-button>
              <el-button
                size="mini"
                type="text"
                @click="openRemove(treeChecked)"
              >删除</el-button>
            </span>
          </div>
        </div>
        <div style="min-height: 400px;" v-loading="dataLoading">
          <el-tree
            :data="dataTree"
            :props="{
              label: 'departName'
            }"
            ref="deptTree"
            node-key="id"
            highlight-current
            default-expand-all
            show-checkbox
            :expand-on-click-node="false"
            @current-change="treeCheckChange"
          >
          </el-tree>
        </div>
        <handle-dialog
          ref="handleDialog"
          v-model="dialogVisible"
          :edit="isEdit"
          :tree="dataTree"
          @close="dialogClose"
          @submit-ok="submitOk"
        ></handle-dialog>
      </el-card>
    </el-col>
  </el-row> -->
</template>

<script>
import baseMinix from '@/utils/baseMinix'
import { GetDepartListTree, deleteDepart } from '@/api/system'
import HandleDialog from './handleDialog'
import ListTable from '@/components/ListTable'
import SetTableCols from '@/components/SetTableCols'
import TableConfig from '@/components/TableConfig'
export default {
  mixins: [baseMinix],
  components: {
    HandleDialog,
    ListTable,
    SetTableCols,
    TableConfig
  },
  data () {
    return {
      dataLoading: false,
      isEdit: false,
      dialogVisible: false,
      dataTree: [],
      treeChecked: {},
      url: {
        config: '/sys/depart'
      },
      searchForm: {
        departName: ''
      },
      tableConfigShow: false
    }
  },
  methods: {
    fetchTreeList () {
      let params = {}
      for (let k in this.searchForm) {
        if (this.searchForm[k] !== '') {
          params[k] = this.searchForm[k]
        }
      }
      this.dataLoading = true
      GetDepartListTree()
        .then(res => {
          let result = res.result || []
          function setProp (arr, prop) {
            arr.forEach(item => {
              item[prop] = item[prop].toString()
              if (item.children && item.children.length > 0) {
                setProp(item.children, prop)
              }
            })
          }
          setProp(result, 'id')
          this.dataTree = result
          this.dataLoading = false
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    dialogClose () {
      this.isEdit = false
    },
    submitOk () {
      this.dialogVisible = false
      this.fetchTreeList()
    },
    openEdit (data) {
      // if (!this.treeChecked.id) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请选择部门'
      //   })
      //   return
      // }
      this.isEdit = true
      this.dialogVisible = true
      this.$refs.handleDialog.handleEdit(data)
    },
    openAddChild (data) {
      // if (!this.treeChecked.id) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请选择部门'
      //   })
      //   return
      // }
      this.dialogVisible = true
      this.$refs.handleDialog.setParent(data)
    },
    openRemove (data) {
      // if (!this.treeChecked.id) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请选择部门'
      //   })
      //   return
      // }
      const {
        departName,
        id
      } = data
      this.$confirm(`您确定删除--${departName}--吗？`, '系统提示', {})
        .then(() => {
          deleteDepart(id)
            .then(() => {
              this.$notify({
                title: '系统提示',
                message: '删除成功',
                type: 'success'
              })
              this.fetchTreeList()
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {})
    },
    treeCheckChange (data) {
      this.treeChecked = {...data}
    },
    cancelChecked () {
      this.$refs.deptTree.setCurrentKey('')
    },
    sortChange () {
    },
    tableConfigSaveOk () {},
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.fetchTreeList()
    }
  },
  created () {
    this.fetchTreeList()
  }
}
</script>

<style lang="scss">
  .custom-tree-node {
    flex: 1;
    display: flex;
    font-size: 14px;
    padding-right: 8px;
  }
  .show-checked{
    overflow: hidden;
    border: 1px solid #EEE;
    border-radius: 3px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(#409EFF, .1);
  }
  .checked-body{
    font-size: 13px;
    color: #666;
    .checked-name{
      color: #409EFF;
    }
  }
</style>
