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
        label-width="90px"
        ref="form"
        :model="form"
      >
        <div class="other-message">
          <div class="other-message-item">
            <p class="message-item-title">服务商可用额度</p>
            <p class="message-item-price">
              {{credit.agentUsableCredit}}
            </p>
          </div>
          <div class="other-message-item">
            <p class="message-item-title">商户授信额度</p>
            <p class="price">{{account.oweQuota}}</p>
          </div>
          <div class="other-message-item">
            <p class="message-item-title">商户已用额度</p>
            <p class="price">{{account.usedCredit}}</p>
          </div>
        </div>
        <el-form-item label="结算模式：" prop="payId">
          <el-radio-group v-model="form.payId">
            <el-radio
              v-for="item in partnerPayTypes"
              :key="item.itemValue"
              :label="item.itemValue"
            >{{item.itemText}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="授信额度：" prop="usableCredit">
          <el-input-number
            size="small"
            v-model="form.usableCredit"
            :min="account.usedCredit || 0"
            :max="maxCredit"
            :step="100"
          ></el-input-number>
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
import { PARTNER_PAY_TYPES } from '@/store/modules/dict'
import { mapState } from 'vuex'
import { queryAgentCredit } from '@/api/partner'
export default {
  mixins: [dialogMinix],
  props: {
    detail: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      form: {
        payId: '',
        usableCredit: ''
      },
      credit: {}
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
    },
    ...mapState({
      partnerPayTypes: state => state.dict[PARTNER_PAY_TYPES]
    }),
    account () {
      return this.credit.partnerAccount || {}
    },
    maxCredit () {
      let step1 = this.credit.agentUsableCredit || 0
      let step2 = this.account.oweQuota || 0
      return step1 + step2
    }
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
          if (this.form.usableCredit === this.account.oweQuota) {
            delete data.usableCredit
          } else {
            data.resetCredit = 1
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
    fetchAgentCredit () {
      let params = {
        partnerId: this.detail.partnerId,
        agentId: this.detail.agentId
      }
      queryAgentCredit(params)
        .then(res => {
          this.credit = res.result || {}
          const {
            partnerAccount: {
              oweQuota
            }
          } = this.credit
          this.form.usableCredit = oweQuota
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.partnerPayTypes.length <= 0) {
          this.$store.dispatch('GetDictItem', PARTNER_PAY_TYPES)
        }
        const {
          payId
        } = this.detail
        this.form.payId = payId + ''
        this.fetchAgentCredit()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.other-message{
  display: flex;
  margin-bottom: 20px;
  .other-message-item{
    flex: 1;
    text-align: center;
    border-right: 1px dashed #CCC;
    &:last-child{
      border-right: none;
    }
    .message-item-title{
      font-size: 12px;
      line-height: 30px;
      color: #999;
    }
  }
}
</style>
