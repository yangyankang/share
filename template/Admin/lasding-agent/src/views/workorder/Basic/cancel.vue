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
        label-width="110px"
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-form-item label="取消原因：" prop="cancelCode">
          <el-radio-group v-model="form.cancelCode" @change="codeChange">
            <div
              v-for="item in womRefuseTypes"
              :key="item.itemValue"
              style="margin-bottom: 12px;"
            >
              <el-radio
                :label="item.itemValue"
              >{{item.itemText}}</el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="取消备注：" prop="cancelRemark">
          <el-input
            type="textarea"
            :rows="5"
            v-model="form.cancelRemark"
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
import { WOM_REFUSE_TYPE } from '@/store/modules/dict'
import { mapState } from 'vuex'
export default {
  mixins: [dialogMinix],
  data () {
    return {
      form: {
        cancelCode: '',
        cancelReason: '',
        cancelRemark: ''
      },
      formRules: {
        cancelCode: [
          {required: true, message: '请选择取消原因', trigger: 'change'}
        ],
        cancelRemark: [
          {required: true, message: '请输入取消描述', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '取消工单'
    },
    ...mapState({
      womRefuseTypes: state => state.dict[WOM_REFUSE_TYPE]
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
          let data = {
            ...this.form
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
      this.$emit('close')
    },
    codeChange (val) {
      let has = this.womRefuseTypes.find(x => x.itemValue === val)
      this.form.cancelReason = has.itemText
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.womRefuseTypes.length <= 0) {
          this.$store.dispatch('GetDictItem', WOM_REFUSE_TYPE)
        }
      }
    }
  }
}
</script>

<style>

</style>
