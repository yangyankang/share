<template>
  <el-card shadow="never">
    <el-form
      label-width="90px"
      ref="searchForm"
      class="search-form"
      :model="searchForm"
    >
      <el-row>
        <el-col :xl="4" :lg="6" :md="8" :sm="12">
          <el-form-item label="机构名称" prop="name">
            <el-input size="small" placeholder="请输入机构名称" v-model="searchForm.name"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :xl="4" :lg="6" :md="8" :sm="12">
          <el-form-item label="机构类型" prop="type">
            <el-radio-group size="small" v-model="searchForm.type">
              <el-radio-button :label="1">
                平台
              </el-radio-button>
              <el-radio-button :label="0">
                服务商
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col> -->
        <el-col :xl="6" :lg="8" :md="8" :sm="12">
          <el-form-item label="签约时间">
            <el-row>
              <el-col :span="11">
                <el-form-item prop="validTime">
                  <el-date-picker
                    placeholder="开始时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    size="small"
                    style="width: 100%;"
                    v-model="searchForm.validTime"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item style="text-align: center;">
                  ~
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item prop="invalidTime">
                  <el-date-picker
                    placeholder="开始时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    size="small"
                    style="width: 100%;"
                    v-model="searchForm.invalidTime"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="4" :md="8" :sm="12">
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
      v-loading="dataLoading"
      @sort-change="sortChange"
      row-key="id"
    >
      <el-table-column label="操作" width="150px" align="center">
        <span class="table-handle-btns" slot-scope="{row}">
          <span class="handle-btn success" @click="openRenew(row)">
            续约
          </span>
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
    <table-config
      v-model="tableConfigShow"
      :url="url"
    ></table-config>
    <handle-dialog
      v-model="dialogVisible"
      @submit-ok="submitOk"
      @close="dialogClose"
      :edit="isEdit"
      ref="handleDialog"
    >
    </handle-dialog>
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
    <pay-dialog
      v-model="payVisible"
      :row="cRow"
      @pay-success="paySuccess"
    ></pay-dialog>
  </el-card>
</template>

<script>
import baseMinix from '@/utils/baseMinix'
import {
  deleteAgent,
  GetAgentList,
  userRegionTree,
  findRegionPerm,
  saveRegionPerms
} from '@/api/system'
import SetTableCols from '@/components/SetTableCols'
import ListTable from '@/components/ListTable'
import HandleDialog from './handleDialog'
import TableConfig from '@/components/TableConfig'
import IDrawer from '@/components/Drawer'
import PayDialog from './payDialog'
export default {
  mixins: [baseMinix],
  components: {
    SetTableCols,
    ListTable,
    HandleDialog,
    TableConfig,
    IDrawer,
    PayDialog
  },
  data () {
    return {
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      dataList: [],
      setColsVisible: false,
      dialogVisible: false,
      searchForm: {
        name: '',
        type: '',
        validTime: '',
        invalidTime: ''
      },
      url: {
        config: '/sys/agent'
      },
      tableConfigShow: false,
      drawerVisible: false,
      strictly: false,
      regionTree: [],
      cRow: {},
      payVisible: false
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
      GetAgentList(params)
        .then(res => {
          var result = res.result.list || []
          function setList (arr, prop) {
            arr.forEach(item => {
              item[prop] = item[prop].toString()
              if (item.children && item.children.length > 0) {
                setList(item.children, prop)
              }
            })
          }
          setList(result, 'id')
          this.dataList = result
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
    submitOk () {
      this.fetchList()
      this.dialogVisible = false
    },
    dialogClose () {
      this.isEdit = false
    },
    sortChange () {

    },
    openEdit (row) {
      this.isEdit = true
      this.dialogVisible = true
      this.$refs.handleDialog.handleEdit(row)
    },
    openRemove (row) {
      const {
        name,
        id
      } = row
      this.$confirm(`您确定删除--${name}--服务商吗？`, '系统提示', {})
        .then(() => {
          deleteAgent(id)
            .then(() => {
              this.$notify({
                title: '系统提示',
                message: '删除成功',
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
      this.cRow = {...row}
      this.drawerVisible = true
      this.$refs.regionTree.setCheckedKeys([])
      findRegionPerm(row.id)
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
            this.$refs.regionTree.setCheckedKeys(level3.concat(otherLevel).map(x => x.regionCode))
          }
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
    fetchUserRegionTree () {
      userRegionTree()
        .then(res => {
          this.regionTree = res.result || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    saveAuth () {
      let checkedKeys = this.$refs.regionTree.getCheckedNodes()
      let halfCheckeds = this.$refs.regionTree.getHalfCheckedNodes()
      let params = {
        agentId: this.cRow.id,
        regions: checkedKeys
          .concat(halfCheckeds)
          .map(x => ({
            regionCode: x.id,
            parentCode: x.parentId,
            ...x
          }))
      }
      saveRegionPerms(params)
        .then(res => {
          this.$notify({
            title: '系统提示',
            message: '保存成功',
            type: 'success'
          })
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    openRenew (row) {
      this.cRow = {...row}
      this.payVisible = true
    },
    paySuccess () {
      this.payVisible = false
      this.fetchList()
    }
  },
  created () {
    this.fetchList()
    this.fetchUserRegionTree()
  }
}
</script>
