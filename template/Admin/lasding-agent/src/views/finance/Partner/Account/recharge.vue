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
        label-width="130px"
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="充值金额：" prop="applyMoney">
              <el-input-number
                size="small"
                style="width: 100%;"
                v-model="form.applyMoney"
                :min="0"
                :max="1e6"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="流水单号：">
              <el-input
                size="small"
                placeholder="请输入流水单号"
              ></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-form-item label="付款账户类型：" prop="payAccountType">
          <el-radio-group v-model="form.payAccountType">
            <el-radio :label="2">支付宝</el-radio>
            <el-radio :label="3">微信</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注信息：" prop="remark">
          <el-input
            type="textarea"
            :rows="4"
            v-model="form.remark"
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
import { PAY_ACCOUNT_TYPES } from '@/store/modules/dict'
import { mapState } from 'vuex'
export default {
  mixins: [dialogMinix],
  data () {
    return {
      form: {
        applyMoney: '',
        payAccountType: '',
        sourceClient: 3,
        remark: ''
      },
      formRules: {
        applyMoney: [
          {required: true, message: '请输入充值金额', trigger: 'blur'}
        ],
        payAccountType: [
          {required: true, message: '请选择支付类型', trigger: 'change'}
        ]
      }
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '充值'
    },
    ...mapState({
      payAccountTypes: state => state.dict[PAY_ACCOUNT_TYPES]
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
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.payAccountTypes.length <= 0) {
          this.$store.dispatch('GetDictItem', PAY_ACCOUNT_TYPES)
        }
      }
    }
  }
}
</script>

<style>

</style>
