<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="100px"
      ref="form"
      :model="form"
      :rules="formRules"
    >
      <el-form-item label="角色名称：" prop="roleName">
        <el-input size="small" placeholder="请输入角色名称" v-model="form.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色代码：" prop="roleCode">
        <el-input size="small" placeholder="请输入角色名称" v-model="form.roleCode"></el-input>
      </el-form-item>
      <el-form-item label="描述信息：" prop="description">
        <el-input size="small" placeholder="描述信息" type="textarea" v-model="form.description"></el-input>
      </el-form-item>
    </el-form>
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
import { createRole, updateRole } from '@/api/system'
export default {
  mixins: [dialogMinix],
  data () {
    return {
      form: {
        roleName: '',
        roleCode: '',
        roleType: '',
        description: ''
      },
      formRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'change'}
        ],
        roleCode: [
          {required: true, message: '请输入角色编码', trigger: 'change'}
        ]
      }
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改角色信息' : '新增角色'
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true
          if (this.edit) {
            updateRole(this.form)
              .then(() => {
                this.submitOkMessage('修改角色信息')
              })
              .catch(err => {
                this.btnLoading = false
                this.$message.error(err.message)
              })
            return
          }
          createRole(this.form)
            .then(() => {
              this.submitOkMessage('新增角色')
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
