<template>
  <el-card shadow="never">
    <el-form
      label-width="90px"
      ref="searchForm"
      class="search-form"
      :model="searchForm"
    >
      <el-row>
        <el-col :xl="6" :lg="8" :md="8" :sm="12">
          <el-form-item label="账号：" prop="username">
            <el-input size="small" v-model="searchForm.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="8" :sm="12">
          <el-form-item label="姓名：" prop="realName">
            <el-input size="small" v-model="searchForm.realName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="8" :sm="12">
          <el-form-item label="手机号：" prop="phone">
            <el-input size="small" v-model="searchForm.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="8" :sm="12">
          <el-form-item label-width="10px">
            <el-button size="small" type="primary" @click="fetchList">
              查询
            </el-button>
            <el-button size="small" type="primary" @click="resetSearch">
              重置
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
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
      <el-table-column label="操作" width="150" align="center" fixed="right">
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
    <i-drawer
      :visible.sync="drawerVisible"
      show-bg
      title="地区权限分配"
    >
      <div>
        <el-tree
          :data="regionTree"
          :props="{
            label: 'regionName'
          }"
          ref="regionTree"
          show-checkbox
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
            @click="saveAuth"
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
  GetUserList,
  deleteUser,
  userRegionTree,
  saveUserRegionPerms,
  findUserRegionPerm
} from '@/api/system'
import IDrawer from '@/components/Drawer'
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
        config: '/sys/user'
      },
      searchForm: {},
      tableConfigShow: false,
      strictly: false,
      drawerVisible: false,
      regionTree: []
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
      GetUserList(params)
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
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.fetchList()
    },
    tableConfigSaveOk () {},
    openRemove (row) {
      const {
        realName,
        id
      } = row
      this.$confirm(`您确定删除--${realName}--用户嘛？`, '系统提示', {})
        .then(() => {
          deleteUser(id)
            .then(() => {
              this.$notify({
                title: '系统提示',
                message: '用户删除成功',
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
    saveAuth () {
      this.btnLoading = true
      let checkedKeys = this.$refs.regionTree.getCheckedNodes()
      let halfCheckeds = this.$refs.regionTree.getHalfCheckedNodes()
      let params = {
        userId: this.cRow.id,
        regions: checkedKeys
          .concat(halfCheckeds)
          .map(x => ({
            regionCode: x.id,
            parentCode: x.parentId,
            ...x
          }))
      }
      saveUserRegionPerms(params)
        .then(res => {
          this.$notify({
            title: '系统提示',
            message: '保存成功',
            type: 'success'
          })
          this.btnLoading = false
        })
        .catch(err => {
          this.btnLoading = false
          this.$message.error(err.message)
        })
    },
    commandHandler (command) {
      switch (command) {
        case 'link':
          this.strictly = !this.strictly
          break
        case 'checkedall':
          this.$refs.regionTree.setCheckedNodes(this.regionTree)
          break
        case 'cancelchecked':
          this.$refs.regionTree.setCheckedNodes([])
          break
        case 'expand':
          this.expand = true
          break
        case 'cancelexpand':
          this.expand = false
          break
      }
    },
    openAuth (row) {
      this.drawerVisible = true
      this.cRow = {...row}
      this.drawerVisible = true
      this.$refs.regionTree.setCheckedKeys([])
      findUserRegionPerm(row.id)
        .then(res => {
          let result = res.result || []
          let level4 = result.filter(x => x.regionGrade === 4)
          let level3 = result.filter(x => x.regionGrade === 3)
          let otherCitys = ['澳门', '台湾', '香港']
          let otherLevel = result.filter(x => otherCitys.indexOf(x.regionName) !== -1 && x.regionGrade === 1)
          if (level4.length > 0) {
            level4.forEach(item => {
              let index = level3.findIndex(z => item.parentCode === z.regionCode)
              if (index !== -1) {
                level3.splice(index, 1)
              }
            })
            this.$refs.regionTree.setCheckedKeys(level4.concat(level3, otherLevel).map(x => x.regionCode))
          } else {
            console.log(level3.concat(otherLevel))
            this.$refs.regionTree.setCheckedKeys(level3.concat(otherLevel).map(x => x.regionCode))
          }
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    fetchUserRegionTree () {
      userRegionTree()
        .then(res => {
          this.regionTree = res.result || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  },
  created () {
    this.fetchList()
    this.fetchUserRegionTree()
  }
}
</script>

<style>

</style>
