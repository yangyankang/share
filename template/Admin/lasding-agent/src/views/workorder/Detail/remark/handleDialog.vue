<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <div style="padding: 2px; height: 380px;">
      <el-form
        label-width="110px"
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-form-item label="备注类型：" prop="type" v-show="mode === 'add'">
          <el-radio-group size="small" v-model="form.type">
            <el-radio-button
              v-for="item in remarkTypes"
              :key="item.itemValue"
              :label="item.itemValue"
            >{{item.itemText}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="可见权限：">
          <el-checkbox-group>
            <el-checkbox-button
              v-for="item in womCommentAuths"
              :key="item.itemValue"
              :label="item.itemValue"
            >{{item.itemText}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item> -->
        <el-form-item label="备注内容：" prop="comment">
          <el-input
            type="textarea"
            :rows="5"
            v-model="form.comment"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注附件：" prop="attachments">
          <el-upload
            action="/"
            ref="uploader"
            :http-request="customFile"
            :file-list="fileList"
            :before-remove="fileRemove"
            accept="image/*"
          >
            <el-button
              size="small"
              type="text"
            >点击上传</el-button>
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
import { WOM_ORDER_REMARK_TYPE } from '@/store/modules/dict'
import { fileQniu } from '@/api/file'
import { mapState } from 'vuex'
export default {
  mixins: [dialogMinix],
  props: {
    mode: {
      type: String,
      default: 'add',
      validator (val) {
        return ['add', 'replay'].indexOf(val) !== -1
      }
    }
  },
  data () {
    return {
      form: {
        comment: '',
        type: '',
        attachments: []
      },
      formRules: {
        comment: [
          {required: true, message: '请输入备注内容', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择备注类型', trigger: 'blur'}
        ]
      },
      fileList: []
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
    },
    ...mapState({
      QniuToken: state => state.app.qniuToken,
      remarkTypes: state => state.dict[WOM_ORDER_REMARK_TYPE]
      // womCommentAuths: state => state.dict[WOM_COMMENT_AUTH]
    })
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true
          let done = () => {
            this.btnLoading = false
          }
          let type = this.remarkTypes.find(x => x.itemValue === this.form.type)
          let data = {
            ...this.form,
            label: type.itemText
          }
          this.$emit('confirm', data, done)
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
      this.$emit('close')
    },
    async customFile (http) {
      const {
        file
      } = http
      if (!this.QniuToken) {
        await this.$store.dispatch('GetQniuToken')
      }
      var observable = fileQniu(file, 'wom/comments', this.QniuToken)
      observable.subscribe({
        error: (err) => {
          this.$message.error(err.message)
        },
        complete: (res) => {
          // this.form1.attachments[0] = {...res}
          // let one = this.form1.attachments[index]
          // this.$set(this.form1.attachments, index, {...one, ...res, ossKey: res.key})
          this.fileList.push({
            name: file.name,
            url: res.path
          })
          this.form.attachments.push({
            ...res,
            ossKey: res.key,
            ossBucket: res.bucket
          })
        }
      })
    },
    fileRemove (file, fileList) {
      let hasIndex = this.fileList.findIndex(x => x.uid === file.uid)
      // this.fileList = this.fileList.filter(x => x.path !== file.path)
      this.fileList.splice(hasIndex, 1)
      this.form.attachments.splice(hasIndex, 1)
      return true
    },
    setData (data) {
      const {
        type
      } = data
      this.form.type = type
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.remarkTypes.length <= 0) {
          this.$store.dispatch('GetDictItem', WOM_ORDER_REMARK_TYPE)
        }
        // if (this.womCommentAuths.length <= 0) {
        //   this.$store.dispatch('GetDictItem', WOM_COMMENT_AUTH)
        // }
      }
    }
  }
}
</script>

<style>

</style>
