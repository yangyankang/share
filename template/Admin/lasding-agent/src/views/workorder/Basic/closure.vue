<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <div style="padding: 10px;">
      <el-form
        label-width="90px"
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-form-item label="核销方式：">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="hasCode">
                <el-radio-group v-model="form.hasCode">
                  <el-radio :label="1">有核销码</el-radio>
                  <el-radio :label="0">无核销码</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="16" v-if="form.hasCode === 1">
              <el-form-item prop="identifyCode">
                <el-input
                  size="small"
                  placeholder="请输入核销码"
                  v-model="form.identifyCode"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="SN码：">
          <el-input
            size="small"
            placeholder="请输入SN码"
          ></el-input>
        </el-form-item>
        <el-form-item label="核销图片：" prop="attachments">
          <el-upload
            action="/"
            list-type="picture-card"
            :file-list="fileList"
            :http-request="customFile"
            :before-remove="fileRemove"
            ref="uploader"
          >
          </el-upload>
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
import { identifyOrder } from '@/api/workorder'
import { fileQniu } from '@/api/file'
import { mapState } from 'vuex'
export default {
  name: 'closureDialog',
  mixins: [dialogMinix],
  props: {
    row: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      form: {
        identifyCode: '',
        attachments: [],
        serviceId: '',
        hasCode: 0
      },
      formRules: {
        identifyCode: [
          {required: true, message: '请输入核销码', trigger: 'blur'}
        ]
      },
      fileList: []
    }
  },
  computed: {
    dialogTitle () {
      return this.row.id ? this.row.id + '--核销' : '核销'
    },
    ...mapState({
      QniuToken: state => state.app.qniuToken
    })
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            ...this.form,
            serviceId: this.row.id
          }
          delete params.hasCode
          this.btnLoading = true
          identifyOrder(params)
            .then(res => {
              this.$notify({
                title: '系统提示',
                message: '核销成功',
                type: 'success'
              })
              this.btnLoading = false
              this.$emit('submit-ok')
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
      this.$refs.uploader.clearFiles()
      this.fileList = []
      this.$emit('close')
    },
    async customFile (http) {
      const {
        file
      } = http
      if (!this.QniuToken) {
        await this.$store.dispatch('GetQniuToken')
      }
      var observable = fileQniu(file, 'wom/file', this.QniuToken)
      observable.subscribe({
        error: (err) => {
          this.$message.error(err.message)
        },
        complete: (res) => {
          this.fileList.push({
            name: file.name,
            url: res.path
          })
          this.form.attachments.push({...res, url: res.path, hashKey: res.hash})
        }
      })
    },
    fileRemove (file, fileList) {
      return new Promise((resolve, reject) => {
        this.fileList = this.fileList.filter(x => x.path !== file.path)
        this.form.attachments = this.form.attachments.filter(x => x.path !== file.path)
        resolve()
      })
    }
  }
}
</script>
