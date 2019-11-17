<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <div style="padding: 0px;">
      <el-form
        label-width="100px"
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-steps :active="active" align-center>
          <el-step title="创建订单">
          </el-step>
          <el-step title="选择支付方式">
          </el-step>
          <el-step title="支付结果确认"></el-step>
        </el-steps>
        <div class="pay-view-wrapper">
          <div class="center" v-if="active === 0">
            <el-form-item label="金额：" label-width="90px" prop="payAmount">
              <el-input
                size="small"
                placeholder="0.00"
                v-model="form.payAmount"
                @blur="formatMoney"
              >
                <span slot="suffix">元</span>
              </el-input>
            </el-form-item>
            <el-form-item label="付费周期：" prop="chargePeriod">
              <el-radio-group size="small" v-model="form.chargePeriod">
                <el-radio-button :label="1">
                  月付
                </el-radio-button>
                <el-radio-button :label="2">
                  年付
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div v-if="active === 1" class="center">
            <el-form-item label="支付方式：" prop="tradeChannel">
              <el-radio-group
                size="small"
                v-model="form.tradeChannel"
                @change="payTypeChange"
              >
                <el-radio-button
                  v-for="item in payTypes"
                  :key="item.value"
                  :label="item.value"
                >{{item.text}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div v-if="active === 2" class="center">
            <pay-loading :is-finish="finish"></pay-loading>
          </div>
        </div>
      </el-form>
    </div>
    <span slot="footer">
      <el-button
        size="small"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="cancel"
        v-if="!finish"
      >{{finish ? '关闭' : '取消'}}</el-button>
      <el-button
        size="small"
        type="primary"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="finished"
        v-if="finish"
      >确定</el-button>
      <el-button
        size="small"
        type="primary"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="submitForm"
        v-if="active === 0"
      >创建订单</el-button>
      <el-button
        size="small"
        type="primary"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="payOrder"
        v-if="active === 1"
      >支付</el-button>
      <el-button
        size="small"
        type="primary"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="submitForm"
        v-if="payFial && active === 2 && !finish"
      >重新支付</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import {
  agentRenew,
  // bilCreate,
  payOrder
} from '@/api/system'
import { payNotify } from '@/api/order'
import PayLoading from '@/components/PayLoading'
export default {
  mixins: [dialogMinix],
  components: {
    PayLoading
  },
  props: {
    row: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    const moneyRule = (rl, val, cb) => {
      if (/^\d+(\.\d+)?$/.test(val) && val >= 0.01) {
        cb()
      } else {
        cb(new Error('金额格式错误'))
      }
    }
    return {
      form: {
        payAmount: '',
        tradeChannel: '',
        chargePeriod: ''
      },
      formRules: {
        payAmount: [
          {required: true, message: '请输入支付金额', trigger: 'blur'},
          {
            validator: moneyRule,
            trigger: 'blur'
          }
        ],
        tradeChannel: [
          {required: true, message: '请选择支付方式', trigger: 'change'}
        ],
        chargePeriod: [
          {required: true, message: '请选择支付周期', trigger: 'change'}
        ]
      },
      active: 0,
      order: null,
      bill: null,
      payTypes: [
        {value: 'Balance', text: '余额'},
        {value: 'Alipay', text: '支付宝'},
        {value: 'Wxpay', text: '微信'},
        {value: 'Ebank', text: '网银'}
      ],
      finish: false,
      payFial: false
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '续约'
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validateField('payAmount', valid => {
        if (!valid) {
          this.btnLoading = true
          let params = {
            ...this.form,
            agentId: this.row.id
          }
          agentRenew(params)
            .then(res => {
              this.active++
              this.order = res.result || {}
              this.btnLoading = false
            })
            .catch(err => {
              this.payFial = true
              this.btnLoading = false
              this.$message.error(err.message)
            })
        }
      })
    },
    payOrder () {
      this.$refs.form.validateField('tradeChannel', async err => {
        if (err) {
          return
        }
        let params = {
          agentId: this.row.id,
          categoryNo: this.order.categoryNo,
          subcategoryNo: this.order.subcategoryNo,
          tradeChannel: this.form.tradeChannel,
          dealAmount: this.form.payAmount
        }
        this.btnLoading = true
        // try {
        //   this.bill = await bilCreate(params)
        // } catch (e) {
        //   this.btnLoading = false
        //   this.$message.error(e.message)
        // }
        this.active++
        let order = {
          ...params,
          billId: this.order.orderId,
          fundType: 'Cash'
        }
        payOrder(order)
          .then(res => {
            this.bill = res.result || {}
            window.setTimeout(() => {
              this.finish = true
              this.btnLoading = false
            }, 1000)
          })
          .catch(err => {
            this.payFial = true
            this.btnLoading = false
            this.$message.error(err.message)
          })
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
      this.payFial = false
      this.order = null
      this.bill = null
      this.active = 0
      this.finish = false
      this.form = {
        payAmount: '',
        tradeChannel: ''
      }
      this.$emit('close')
    },
    formatMoney () {
      let num = Number.parseFloat(this.form.payAmount)
      if (num) {
        this.form.payAmount = num.toFixed(2)
      }
    },
    cancel () {
      if (this.active === 1) {
        this.$confirm('存在尚未支付订单是否继续退出', '系统提示', {
          type: 'warning'
        })
          .then(() => {
            this.active = 0
            this.$emit('change', false)
          })
          .catch(() => {})
      } else {
        this.$emit('change', false)
      }
    },
    payTypeChange (val) {
      // let has = this.payTypes.find(x => x.value === val)
      // this.form.tradeChannel = has.text
    },
    finished () {
      let params = {
        flowId: this.bill.flowId,
        orderId: this.order.orderId,
        tradeChannel: this.form.tradeChannel
      }
      payNotify(params)
        .then(res => {
          this.btnLoading = false
          this.$emit('pay-success')
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.pay-view-wrapper{
  height: 300px;
  position: relative;
  .center{
    padding: 100px;
  }
}
</style>
