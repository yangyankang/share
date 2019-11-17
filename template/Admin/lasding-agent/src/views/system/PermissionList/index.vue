<template>
  <el-card shadow="hover" v-loading="btnLoading">
    <div class="header-btns-wrapper">
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
        plain
        v-if="tableSelects.length > 0"
      >
        批量删除
      </el-button>
    </div>
    <el-table
      :data="dataList"
      border
      row-key="id"
      header-row-class-name="table-header-style"
      header-cell-class-name="table-header-cell-style"
      @selection-change="selectsChange"
    >
      <el-table-column type="selection" align="center">
      </el-table-column>
      <el-table-column label="菜单名称" prop="name" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="菜单类型" prop="menuType" width="150" align="center">
        <template slot-scope="{row}">
          {{row.menuType | optsFilter(menuTypes, 'value', 'text')}}
        </template>
      </el-table-column>
      <el-table-column label="图标" prop="icon" width="160" align="center"></el-table-column>
      <el-table-column label="组件" prop="component" min-width="40"
        align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="跳转路径" prop="url" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="排序" prop="sortNo" width="80" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <span slot-scope="{row}" class="table-handle-btns">
          <span class="handle-btn primary" @click.stop="openEdit(row)">
            编辑
          </span>
          <span class="handle-btn danger" @click.stop="openRemove(row)">
            删除
          </span>
        </span>
      </el-table-column>
    </el-table>
    <menu-handle-dialog
      v-model="dialogVisible"
      :edit="isEdit"
      :menu="dataList"
      ref="menuDialog"
      @submit-ok="submitOk"
      @close="dialogClose"
    ></menu-handle-dialog>
  </el-card>
</template>

<script>
import {
  MenulistTree,
  removeMenu
} from '@/api/system'
import baseMinix from '@/utils/baseMinix'
import MenuHandleDialog from './MenuHandleDialog'
export default {
  name: 'MenuList',
  components: {
    MenuHandleDialog
  },
  mixins: [baseMinix],
  data () {
    return {
      dataList: [],
      menuTypes: [
        {value: 0, text: '目录'},
        {value: 1, text: '菜单'},
        {value: 2, text: '按钮'}
      ],
      tableSelects: [],
      dialogVisible: false,
      url: {
      }
    }
  },
  methods: {
    fetchMenuListTree () {
      MenulistTree()
        .then(res => {
          this.dataList = res.result || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    selectsChange (ss) {
      this.tableSelects = ss
    },
    openEdit (row) {
      this.isEdit = true
      this.dialogVisible = true
      this.$refs.menuDialog.handleEdit(row)
    },
    submitOk () {
      this.fetchMenuListTree()
      this.dialogVisible = false
    },
    dialogClose () {
      this.isEdit = false
    },
    openRemove (row) {
      let {
        name,
        id
      } = row
      this.$confirm(`您确定删除{${name}}吗？`, '系统提示', {})
        .then(res => {
          removeMenu(id)
            .then(res => {
              this.$notify({
                title: '系统提示',
                message: `${name}-删除成功!`,
                type: 'success'
              })
              this.fetchMenuListTree()
            })
            .catch(err => {
              this.$message.erorr(err.message)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '删除取消'
          })
        })
    }
  },
  created () {
    this.fetchMenuListTree()
  }
}
</script>

<style>

</style>
