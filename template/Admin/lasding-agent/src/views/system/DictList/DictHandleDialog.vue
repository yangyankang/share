<template>
  <el-dialog
    :visible.sync="model"
    :title="dialogTitle"
    width="800px"
    @close="close"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="100px"
      ref="form"
      :model="form"
      :rules="formRules"
    >
      <el-form-item label="字典名称：" prop="dictName">
        <el-input size="small" placeholder="请输入字典名称" v-model.trim="form.dictName"></el-input>
      </el-form-item>
      <el-form-item label="字典编码：" prop="dictCode">
        <el-input size="small" placeholder="请输入字典名称" v-model.trim="form.dictCode"></el-input>
      </el-form-item>
      <el-form-item label="描述：" prop="description">
        <el-input size="small" v-model.trim="form.description" placeholder="请输入字典名称" type="textarea">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button
        size="small"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="$emit('change', false)"
      >
        取消
      </el-button>
      <el-button
        size="small"
        type="primary"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="submitForm"
      >
        提交
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import { createDict, updateDict } from '@/api/system'
export default {
  name: 'DictHandleDialog',
  mixins: [dialogMinix],
  data () {
    return {
      form: {
        dictCode: '',
        dictName: '',
        description: ''
      },
      formRules: {
        dictName: [
          {required: true, message: '请输入字典名称', trigger: 'blur'}
        ],
        dictCode: [
          {required: true, message: '请输入字典编码', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改字典' : '新增字典'
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true

          if (this.edit) {
            updateDict(this.form)
              .then(res => {
                this.$notify({
                  title: '系统提示',
                  message: '修改字典集成功!',
                  type: 'success'
                })
                this.$emit('submit-ok')
                this.btnLoading = false
              })
              .catch(err => {
                this.btnLoading = false
                this.$message.error(err.message)
              })
            return
          }
          createDict(this.form)
            .then(res => {
              this.$notify({
                title: '系统提示',
                message: '新增字典集成功!',
                type: 'success'
              })
              this.$emit('submit-ok')
              this.btnLoading = false
            })
            .catch(err => {
              this.btnLoading = false
              this.$message.error(err.message)
            })
        }
      })
    },
    close () {
      if (this.editMiddle) {
        this.form = {...this.editMiddle}
      } else {
        this.$refs.form.resetFields()
      }
      this.$refs.form.clearValidate()
      this.$emit('close')
    },
    handleEdit (row) {
      this.editMiddle = {...this.form}
      this.form = {...row}
    }
  }
}
</script>

<style>

</style>
