<template>
  <drawer
    :visible.sync="model"
    :title="row.categoryName + '--子类别'"
    show-bg
  >
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
      </div>
    </div>
    <el-table
      broder
      :data="dataList"
      header-row-class-name="table-header-style"
      header-cell-class-name="table-header-cell-style"
      v-loading="dataLoading"
    >
      <el-table-column label="子类别" prop="subcategoryName"></el-table-column>
      <el-table-column label="操作" width="120" align="center">
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
    <el-dialog
      :visible.sync="dialogVisible"
      width="800px"
      :title="dialogTitle"
      append-to-body
      @close="dialogClose"
    >
      <div style="padding: 100px;">
        <el-form
          ref="form"
          label-width="100px"
          :model="form"
          :rules="formRules"
        >
          <el-form-item label="子类名称：" prop="subcategoryName">
            <el-input
              placeholder="请输入子类名称"
              v-model="form.subcategoryName"
            ></el-input>
          </el-form-item>
          <el-form-item label="类别编码" prop="subcategoryNo">
            <el-input
              placeholder="类别编码"
              v-model="form.subcategoryNo"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button
          size="small"
          :loading="btnLoading"
          :disabled="btnLoading"
        >取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="btnLoading"
          :disabled="btnLoading"
          @click="submitForm"
        >提交</el-button>
      </span>
    </el-dialog>
  </drawer>
</template>

<script>
import Drawer from '@/components/Drawer'
import {
  GetSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} from '@/api/product'
export default {
  components: {
    Drawer
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
  data () {
    return {
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      dataList: [],
      dataLoading: false,
      dialogVisible: false,
      form: {
        subcategoryName: '',
        subcategoryNo: ''
      },
      formRules: {
        subcategoryName: [
          {required: true, message: '请输入子类名称', trigger: 'blur'}
        ]
      },
      btnLoading: false,
      edit: false,
      editMiddle: null
    }
  },
  computed: {
    model: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('change', val)
      }
    },
    dialogTitle () {
      return this.edit ? '修改子类别信息' : '新增子类别'
    }
  },
  methods: {
    fetchList () {
      let params = {
        page: this.page,
        categoryId: this.row.id
      }
      this.dataLoading = true
      GetSubcategory(params)
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
    openEdit (row) {
      this.editMiddle = {...this.form}
      this.form = {...row}
      this.edit = true
      this.dialogVisible = true
    },
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            ...this.form,
            categoryId: this.row.id
          }
          this.btnLoading = true
          if (this.edit) {
            updateSubcategory(this.form)
              .then(() => {
                this.submitOkMessage('修改子类信息')
              })
              .catch(err => {
                this.btnLoading = false
                this.$message.error(err.message)
              })
            return
          }
          createSubcategory(params)
            .then(res => {
              this.submitOkMessage('新增子类')
            })
            .catch(err => {
              this.btnLoading = false
              this.$message.error(err.message)
            })
        }
      })
    },
    submitOkMessage (msg) {
      this.$notify({
        title: '系统提示',
        message: `${msg}成功`,
        type: 'success'
      })
      this.fetchList()
      this.dialogVisible = false
      this.btnLoading = false
    },
    dialogClose () {
      if (this.editMiddle) {
        this.form = {...this.editMiddle}
      } else {
        this.$refs.form.resetFields()
      }
      this.$refs.form.clearValidate()
      this.$emit('close')
    },
    openRemove (row) {
      const {
        subcategoryName,
        id
      } = row
      this.$confirm(`您确定删除--${subcategoryName}--子类别嘛？`, '系统提示', {})
        .then(() => {
          deleteSubcategory(id)
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
    }
  },
  watch: {
    'row.id': {
      handler () {
        this.page.pageSize = 10
        this.page.pageNum = 1
        this.total = 0
        this.dataList = []
      }
    },
    visible (val) {
      if (val) {
        this.fetchList()
      }
    }
  }
}
</script>

<style>

</style>
