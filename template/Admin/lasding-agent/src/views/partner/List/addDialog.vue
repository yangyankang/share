<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <div style="padding: 0px;">
      <el-form
        label-width="110px"
        ref="form"
        :model="form"
      >
        <el-form-item label="商家名称：">
          <el-input
            size="small"
            placeholder="请输入商家名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人：">
          <el-input
            size="small"
            placeholder="请输入法人姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人电话：">
          <el-input
            size="small"
            placeholder="请输入联系电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录账号："></el-form-item>
        <el-form-item label="登录密码："></el-form-item>
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
export default {
  mixins: [dialogMinix],
  data () {
    return {
      form: {
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
