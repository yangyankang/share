<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <div style="padding: 0 100px 0 80px;">
      <el-form
        label-width="120px"
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-form-item label="任务类名：" prop="jobClassName">
          <el-input
            v-model="form.jobClassName"
            size="small"
            placeholder="请输入任务类名"
          ></el-input>
        </el-form-item>
        <el-form-item label="cron表达式：" prop="cronExpression">
          <el-input
            v-model="form.cronExpression"
            size="small"
            placeholder="请输入cron表达式"
          ></el-input>
          <div style="line-height: 20px;">
            <el-link href="http://cron.qqe2.com/" target="_blank" type="primary">
              <span class="el-icon-link"></span>
              主要链接
            </el-link>
          </div>
        </el-form-item>
        <el-form-item label="参数：" prop="parameter">
          <el-input
            v-model="form.parameter"
            size="small"
            placeholder="请输入参数"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-input
            v-model="form.description"
            size="small"
            placeholder="请输入描述"
            type="textarea"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="form.status" size="small">
            <el-radio-button :label="1">正常</el-radio-button>
            <el-radio-button :label="0">冻结</el-radio-button>
          </el-radio-group>
        </el-form-item> -->
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
import { createQuartzJob, updateQuartzJob } from '@/api/system'
export default {
  mixins: [dialogMinix],
  data () {
    return {
      form: {
        jobClassName: '',
        cronExpression: '',
        parameter: '',
        description: '',
        status: 1
      },
      formRules: {
        jobClassName: [
          {required: true, message: '请输入任务类名', trigger: 'blur'}
        ],
        cronExpression: [
          {required: true, message: '请输入cron表达式', trigger: 'blur'}
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
            updateQuartzJob(this.form)
              .then(res => {
                this.submitOkMessage('修改任务信息')
              })
              .catch(err => {
                this.btnLoading = false
                this.$message.error(err.message)
              })
            return
          }
          createQuartzJob(this.form)
            .then(res => {
              this.submitOkMessage('任务创建')
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
