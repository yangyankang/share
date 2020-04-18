<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <div style="padding: 100px;">
      <el-form
        label-width="100px"
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-form-item label="类别名称：" prop="categoryName">
          <el-input
            placeholder="请输入类别名称"
            v-model="form.categoryName"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button
        size="small"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="$emit('change', false)"
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
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import { createCategory, updateCategory } from '@/api/product'
export default {
  mixins: [dialogMinix],
  data () {
    return {
      form: {
        categoryName: ''
      },
      formRules: {
        categoryName: [
          {required: true, message: '请输入类别名称', trigger: 'change'}
        ]
      }
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true
          if (this.edit) {
            updateCategory(this.form)
              .then(() => {
                this.submitOkMessage('修改类别信息')
              })
              .catch(err => {
                this.btnLoading = false
                this.$message.error(err.message)
              })
            return
          }
          createCategory(this.form)
            .then(() => {
              this.submitOkMessage('新增类别')
            })
            .catch(err => {
              this.btnLoading = false
              this.$message.error(err.message)
            })
        }
      })
    },
    handleEdit (row) {
      this.editMiddle = {...this.form}
      this.form = {...row}
    },
    submitOkMessage (msg) {
      this.$notify({
        title: '系统提示',
        message: `${msg}成功`,
        type: 'success'
      })
      this.$emit('submit-ok')
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
    }
  }
}
</script>
