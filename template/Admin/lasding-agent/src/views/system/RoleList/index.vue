<template>
  <el-card shadow="hover">
    <el-form
      label-width="90px"
      ref="searchForm"
      class="search-form"
      inline
      :model="searchForm"
      @submit.native.prevent
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input size="small" placeholder="请输入角色名称" v-model="searchForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label-width="10px">
        <el-button size="small" type="primary" @click="fetchList">
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
      :data="dataList"
      :show-columns="showCols"
      @sort-change="sortChange"
      v-loading="dataLoading"
    >
      <el-table-column width="140" align="center" label="操作">
        <span class="table-handle-btns" slot-scope="{row}">
          <span class="handle-btn primary" @click.stop="openAuth(row)">
            授权
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
      v-model="dialogVisible"
      ref="handleDialog"
      :edit="isEdit"
      @close="dialogClose"
      @submit-ok="submitOk"
    ></handle-dialog>
    <table-config
      v-model="tableConfigShow"
      :url="url"
    >
    </table-config>
    <i-drawer
      :visible.sync="drawerVisible"
      show-bg
      title="角色权限配置"
      @close="drawerClose"
    >
      <div>
        <el-tree
          ref="authTree"
          show-checkbox
          :data="treeData"
          :props="treeProps"
          :check-strictly="strictly"
          :default-expand-all="expand"
          node-key="id"
        >
        </el-tree>
      </div>
      <div slot="footer">
        <div style="float: right;">
          <el-button
            size="small"
            :loading="btnLoading"
            :disabled="btnLoading"
            @click="drawerVisible = false"
          >
            取消
          </el-button>
          <el-button
            size="small"
            type="primary"
            :loading="btnLoading"
            :disabled="btnLoading"
            @click="saveRoleMenu"
          >
            保存
          </el-button>
        </div>
        <div>
          <el-dropdown @command="commandHandler">
            <el-button size="small">
              树操作
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="link">{{strictly ? '父子关联' : '取消关联'}}</el-dropdown-item>
              <el-dropdown-item command="checkedall">全部选中</el-dropdown-item>
              <el-dropdown-item command="cancelchecked">取消全选</el-dropdown-item>
              <!-- <el-dropdown-item command="expand">全部展开</el-dropdown-item>
              <el-dropdown-item command="cancelexpand">合并所有</el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </i-drawer>
  </el-card>
</template>

<script>
import baseMinix from '@/utils/baseMinix'
import SetTableCols from '@/components/SetTableCols'
import ListTable from '@/components/ListTable'
import TableConfig from '@/components/TableConfig'
import HandleDialog from './handleDialog'
import {
  GetRoleList,
  deleteRole,
  findMenuPerms,
  saveMenuPerms,
  findUserConfigMenu
} from '@/api/system'
import IDrawer from '@/components/Drawer'
// import { mapGetters } from 'vuex'
export default {
  mixins: [baseMinix],
  components: {
    ListTable,
    SetTableCols,
    HandleDialog,
    TableConfig,
    IDrawer
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
        config: '/sys/role'
      },
      searchForm: {
        roleName: ''
      },
      tableConfigShow: false,
      drawerVisible: false,
      treeData: [],
      treeProps: {
        label (data) {
          return data.meta ? data.meta.title : data.name
        }
      },
      treeChecks: [],
      strictly: true,
      expand: true
    }
  },
  computed: {
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
      GetRoleList(params)
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
    sortChange () {
    },
    openEdit (row) {
      this.isEdit = true
      this.dialogVisible = true
      this.$refs.handleDialog.handleEdit(row)
    },
    dialogClose () {
      this.isEdit = false
    },
    submitOk () {
      this.dialogVisible = false
      this.fetchList()
    },
    openRemove (row) {
      const {
        roleName,
        id
      } = row
      this.$confirm(`您确定删除--${roleName}--角色吗`, '系统提示', {})
        .then(() => {
          deleteRole(id)
            .then(() => {
              this.$notify({
                title: '系统提示',
                message: '角色删除成功',
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
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.fetchList()
    },
    openAuth (row) {
      this.drawerVisible = true
      this.cRow = {...row}
      findMenuPerms(row.id)
        .then(res => {
          let result = res.result
          this.$refs.authTree.setCheckedNodes(result)
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    drawerClose () {
      this.$refs.authTree.setCheckedKeys([])
    },
    saveRoleMenu () {
      let halfChecks = this.$refs.authTree.getHalfCheckedKeys()
      let checks = this.$refs.authTree.getCheckedKeys()
      if (checks.length <= 0) {
      }
      this.btnLoading = true
      saveMenuPerms(this.cRow.id, checks.concat(halfChecks))
        .then(res => {
          this.$notify({
            title: '系统提示',
            message: '角色菜单配置成功',
            type: 'success'
          })
          this.btnLoading = false
          this.drawerVisible = false
        })
        .catch(err => {
          this.btnLoading = false
          this.$message.error(err.message)
        })
    },
    fetchConfigMenu () {
      findUserConfigMenu()
        .then(res => {
          this.treeData = res.result || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    commandHandler (command) {
      switch (command) {
        case 'link':
          this.strictly = !this.strictly
          break
        case 'checkedall':
          this.$refs.authTree.setCheckedNodes(this.treeData)
          break
        case 'cancelchecked':
          this.$refs.authTree.setCheckedNodes([])
          break
        case 'expand':
          this.expand = true
          break
        case 'cancelexpand':
          this.expand = false
          break
      }
    }
  },
  created () {
    this.fetchConfigMenu()
    this.fetchList()
  }
}
</script>
