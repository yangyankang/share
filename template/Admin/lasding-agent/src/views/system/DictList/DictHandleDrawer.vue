<template>
  <i-drawer
    title="字典项配置"
    :visible.sync="model"
    show-bg
  >
    <div>
      <el-form
        label-width="60px"
        inline
        @submit.native.prevent
        :model="searchForm"
      >
        <el-form-item label="名称" prop="itemText">
          <el-input
            size="small"
            placeholder="请输入名称"
            clearable
            v-model="searchForm.itemText"
            @keyup.native.enter="fetchDictItem"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 10px;">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="dialogVisible = true">
          新增
        </el-button>
      </div>
      <el-table
        border
        :data="dataList"
        v-loading="dataLoading"
        header-row-class-name="table-header-style"
        header-cell-class-name="table-header-cell-style"
      >
        <el-table-column label="名称" prop="itemText" align="center"></el-table-column>
        <el-table-column label="数据值" prop="itemValue" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <span class="table-handle-btns" slot-scope="{row}">
            <span class="handle-btn warn" @click.stop="openEdit(row)">
              编辑
            </span>
            <span class="handle-btn danger" @click.stop="openRemove(row)">
              删除
            </span>
          </span>
        </el-table-column>
      </el-table>
      <div class="pages-wrapper">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="total"
          :page-size="page.pageSize"
          :current-page="page.pageNum"
          @size-change="sizeChange"
          @current-change="currentChange"
        >
        </el-pagination>
      </div>
    </div>
    <dict-item-dialog
      v-model="dialogVisible"
      :row="row"
      @submit-ok="submitOk"
      :edit="isEdit"
      ref="itemDialog"
      @close="dialogClose"
    >
    </dict-item-dialog>
  </i-drawer>
</template>

<script>
import IDrawer from '@/components/Drawer'
import DictItemDialog from './DictItemDialog'
import {
  GetDictItem,
  deleteDictItem
} from '@/api/system'
export default {
  name: 'DictDrawer',
  components: {
    IDrawer,
    DictItemDialog
  },
  props: {
    visible: false,
    row: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  model: {
    prop: 'visible',
    event: 'change'
  },
  computed: {
    model: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('change', val)
      }
    }
  },
  data () {
    return {
      page: {
        pageSize: 20,
        pageNum: 1
      },
      dataList: [],
      total: 0,
      dataLoading: false,
      searchForm: {
        itemText: ''
      },
      dialogVisible: false,
      isEdit: false
    }
  },
  methods: {
    fetchDictItem () {
      let params = {
        page: this.page,
        dictId: this.row.id
      }
      for (let k in this.searchForm) {
        if (this.searchForm[k] !== '') {
          params[k] = this.searchForm[k]
        }
      }
      this.dataLoading = true
      GetDictItem(params)
        .then(res => {
          this.dataList = res.result.list || []
          this.total = res.result.total || 0
          this.dataLoading = false
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    openRemove (row) {
      const {
        id,
        itemText
      } = row
      this.$confirm(`您确定删除--${itemText}--字典项吗？`, '系统提示', {})
        .then(() => {
          deleteDictItem(id)
            .then(res => {
              this.$notify({
                title: '系统提示',
                message: '删除成功!',
                type: 'success'
              })
              this.fetchDictItem()
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {
          this.$message({
            message: '取消删除',
            type: 'info'
          })
        })
    },
    currentChange (num) {
      this.page.pageNum = num
      this.fetchDictList()
    },
    sizeChange (size) {
      this.page.pageSize = size
      this.fetchDictList()
    },
    submitOk () {
      this.dialogVisible = false
      this.fetchDictItem()
    },
    dialogClose () {
      this.isEdit = false
    },
    openEdit (row) {
      this.$refs.itemDialog.handleEdit(row)
      this.isEdit = true
      this.dialogVisible = true
    }
  },
  watch: {
    visible () {
      this.fetchDictItem()
    },
    'row.id' () {
      this.page.pageNum = 1
    }
  }
}
</script>

<style>

</style>
