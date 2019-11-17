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
        label-width="110px"
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-form-item label="类型名称：" prop="typeName">
          <el-input
            size="small"
            placeholder="请输入类型名称"
            v-model="form.typeName"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型编码：" prop="typeCode">
          <el-input
            size="small"
            placeholder="请输入类型编码"
            v-model="form.typeCode"
          ></el-input>
        </el-form-item>
        <el-form-item label="模式：" prop="typeMode">
          <el-radio-group size="small" v-model="form.typeMode">
            <el-radio-button :label="0">基本模式</el-radio-button>
            <el-radio-button :label="1">考核模式</el-radio-button>
          </el-radio-group>
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
import { createPriceType, updatePriceType } from '@/api/price'
export default {
  mixins: [dialogMinix],
  data () {
    return {
      form: {
        typeName: '',
        typeMode: 0,
        typeCode: ''
      },
      formRules: {
        typeName: [
          {required: true, message: '请输入类型名称', trigger: 'blur'}
        ],
        typeCode: [
          {required: true, message: '请输入类型编码', trigger: 'blur'}
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
            updatePriceType(this.form)
              .then(res => {
                this.submitOkMessage('修改价格类型')
                this.btnLoading = false
              })
              .catch(err => {
                this.btnLoading = false
                this.$message.error(err.message)
              })
            return
          }
          createPriceType(this.form)
            .then(res => {
              this.submitOkMessage('新增价格类型')
              this.btnLoading = false
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

<style>

</style>
