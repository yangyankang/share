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
        :rules="formRules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请技师：" class="custom-item">
              {{detail.crtName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请时间：" class="custom-item">
              {{detail.crtTime}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单号：" class="custom-item">
              {{detail.serviceId}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="费用类型：" class="custom-item">
              {{detail.costType}}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注信息：" class="custom-item">
              {{detail.remark}}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="照片信息：">
              <div class="imgs-wrapper" v-viewer>
                <img v-for="item in attachments" :key="item.id" :src="item.path" />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="费用金额：" prop="cost">
              <el-input
                size="small"
                v-model="form.cost"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商家费用：">
              <el-form-item prop="hasPartner">
                <el-checkbox v-model="form.hasPartner">
                  新增商家费用
                </el-checkbox>
              </el-form-item>
              <div v-if="form.hasPartner">
                <el-form-item style="margin-bottom: 10px;" prop="partnerCost.costType">
                  <el-radio-group
                    v-model="form.partnerCost.costType"
                    @change="costTypeChange"
                  >
                    <el-row>
                      <el-col
                        :span="4"
                        v-for="item in costTypes"
                        :key="item.value"
                      >
                        <el-radio
                          :key="item.value"
                          :label="item.value"
                        >{{item.text}}</el-radio>
                      </el-col>
                    </el-row>
                  </el-radio-group>
                </el-form-item>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item
                      label="金额"
                      label-width="55px"
                      prop="partnerCost.cost"
                    >
                      <el-input-number
                        size="small"
                        style="width: 100%;"
                        v-model="form.partnerCost.cost"
                      ></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item label-width="0" prop="partnerCost.remark">
                      <el-input
                        size="small"
                        placeholder="商家费用描述"
                        v-model="form.partnerCost.remark"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="审核备注：" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                :rows="5"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'
Vue.use(Viewer)
export default {
  mixins: [dialogMinix],
  data () {
    const moneyRule = (rule, val, cb) => {
      if (/^\d+(\.\d{1,2})?$/.test(val)) {
        cb()
      } else {
        cb(new Error('金额错误'))
      }
    }
    return {
      form: {
        applyId: '',
        remark: '',
        cost: '',
        partnerCost: {
          costType: '',
          subject: '',
          cost: '',
          remark: ''
        },
        hasPartner: false
      },
      formRules: {
        remark: [
          {required: true, message: '请输入备注信息', trigger: 'blur'}
        ],
        cost: [
          {
            validator: moneyRule,
            trigger: 'input'
          }
        ],
        'partnerCost.costType': [
          {required: true, message: '请选择费用类型', trigger: 'change'}
        ],
        'partnerCost.cost': [
          {required: true, message: '请输入费用金额', trigger: 'change'},
          {
            validator: moneyRule,
            trigger: 'input'
          }
        ],
        'partnerCost.remark': [
          {required: true, message: '请输入备注信息', trigger: 'change'}
        ]
      },
      detail: {},
      costTypes: [
        {value: 1, text: '配件费', cost: 30},
        {value: 4, text: '二次上门', cost: 50},
        {value: 6, text: '打孔费', cost: 30},
        {value: 8, text: '远程费', cost: 15},
        {value: 11, text: '猫眼', cost: 30},
        {value: 10, text: '其他', cost: ''},
        {value: 14, text: '作废', cost: ''},
        {value: 15, text: '加急', cost: 50},
        {value: 16, text: '高速', cost: ''},
        {value: 17, text: '超高', cost: 50},
        {value: 18, text: '特殊墙体', cost: 30},
        {value: 19, text: '空跑', cost: 50},
        {value: 31, text: '其他退款', hide: true, cost: ''}
      ]
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
    },
    attachments () {
      return this.detail.attachments || []
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true
          let data = {
            ...this.form,
            applyId: this.detail.id
          }
          if (!this.form.hasPartner) {
            delete data.partnerCost
            delete data.hasPartner
          }
          let done = () => {
            this.btnLoading = false
          }
          this.$emit('confirm', data, done)
        }
      })
    },
    setData (row) {
      // this.editMiddle = {...this.form}
      // this.form = {...row}
      this.detail = {...row}
      const {
        cost
      } = row
      this.form.cost = cost
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
    costTypeChange (val) {
      let has = this.costTypes.find(x => x.value === val)
      this.form.partnerCost.subject = has.text
    }
  }
}
</script>

<style lang="scss" scoped>
.imgs-wrapper{
  img{
    vertical-align: top;
    height: 40px;
    margin-right: 5px;
  }
}
.custom-item{
  margin-bottom: 0;
}
</style>
