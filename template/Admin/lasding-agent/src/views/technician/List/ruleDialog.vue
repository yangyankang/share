<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    append-to-body
    :close-on-click-modal="false"
  >
    <div style="padding: 0 100px;">
      <el-form
        label-width="110px"
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-form-item label="价格策略：" prop="strategyId">
          <el-input
            size="small"
            v-model="row.strategyName"
            readonly
          ></el-input>
        </el-form-item>
        <el-form-item label="规则类型：" prop="ruleType">
          <el-radio-group v-model="form.ruleType">
            <el-radio :label="1">可申请规则</el-radio>
            <el-radio :label="0">不可申请规则</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="执行模式：" prop="runMode">
          <el-radio-group v-model="form.runMode">
            <el-radio :label="1">奖励</el-radio>
            <el-radio :label="0">惩罚</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规则模式：" prop="ruleMode">
          <el-radio-group v-model="form.ruleMode">
            <el-radio :label="0">基础模式</el-radio>
            <el-radio :label="1">考核模式</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="价格类型：" prop="priceTypeId">
          <el-select
            size="small"
            v-model="form.priceTypeId"
            style="width: 100%;"
            value-key="id"
          >
            <el-option
              v-for="item in basicTypes"
              :key="item.id"
              :value="item.id"
              :label="item.typeName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额：" prop="money">
          <el-input
            size="small"
            placeholder="请输入基础价"
            v-model="form.money"
          ></el-input>
        </el-form-item>
        <template v-if="form.ruleMode === 1">
          <p>考核指标：</p>
          <el-form-item label="选择项目：" prop="serveTypes">
            <el-select
              multiple
              size="small"
              v-model="form.serveTypes"
              style="width: 100%;"
              value-key="id"
              @change="serveChange"
            >
              <el-option
                v-for="item in serveTypes"
                :key="item.id"
                :value="item"
                :label="item.typeName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-row>
            <el-col
              :span="12"
              v-for="(item, index) in form.checkList"
              :key="item.id"
            >
              <el-form-item
                :label="item.typeName"
                :prop="'checkList.' + index + '.money'"
                :rules="formRules.money"
              >
                <el-input
                  size="small"
                  v-model="item.money"
                  placeholder="请输入金额"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
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
import {
  GetPriceTypes
} from '@/api/price'

import {
  createStrategyRule,
  updateStrategyRule
} from '@/api/technician'

export default {
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
    const moneyRule = (rule, val, cb) => {
      if ((/^\d+(\.\d{1,2})?$/.test(val) && val >= 0.01) || val === '') {
        cb()
      } else {
        cb(new Error('金额格式有误!'))
      }
    }
    return {
      form: {
        strategyId: '',
        ruleType: 1,
        ruleMode: 0,
        priceTypeId: '',
        money: '',
        runMode: 1,
        serveTypes: [],
        checkList: []
      },
      formRules: {
        ruleType: [
          {required: true, message: '请选择规则类型', trigger: 'change'}
        ],
        ruleMode: [
          {required: true, message: '请选择规则模式', trigger: 'change'}
        ],
        runMode: [
          {required: true, message: '请选择执行模式', trigger: 'change'}
        ],
        priceTypeId: [
          {required: true, message: '请选择基本价格类型', trigger: 'change'}
        ],
        money: [
          {required: true, message: '请输入金额', trigger: 'blur'},
          {
            validator: moneyRule,
            trigger: 'blur'
          }
        ],
        serveTypes: [
          {required: true, message: '请选择考核指标', trigger: 'change'},
          {
            validator: (ru, va, cb) => {
              if (va.length > 0) {
                cb()
              } else {
                cb(new Error('请选择考核指标'))
              }
            }
          }
        ]
      },
      priceTypes: []
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
    },
    basicTypes () {
      return this.priceTypes.filter(x => x.typeMode === 0)
    },
    serveTypes () {
      return this.priceTypes.filter(x => x.typeMode === 1)
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = false
          let params = {
            ...this.form
          }
          delete params.serveTypes
          if (params.ruleMode === 0) {
            delete params.checkList
          }
          if (this.edit) {
            updateStrategyRule(params)
              .then(() => {
                this.submitOkMessage('修改规则')
              })
              .catch(err => {
                this.btnLoading = false
                this.$message.error(err.message)
              })
            return
          }
          createStrategyRule(params)
            .then(() => {
              this.submitOkMessage('新增规则')
            })
            .catch(err => {
              this.btnLoading = false
              this.$message.error(err.message)
            })
        }
      })
    },
    handleEdit (item, row) {
      // this.editMiddle = {...this.form}
      // this.form = {...row}
      const {
        id,
        ruleMode,
        ruleType,
        money,
        checkList,
        // strategyId,
        priceTypeId,
        runMode
      } = item
      // const {
      //   strategyName
      // } = row
      this.editMiddle = {...this.form}
      this.form.ruleType = ruleType
      this.form.ruleMode = ruleMode
      this.form.money = money
      this.form.priceTypeId = priceTypeId
      this.form.runMode = runMode
      this.form.id = id
      if (ruleMode === 1) {
        this.form.serveTypes = checkList.map(x => ({
          id: x.priceTypeId,
          typeName: x.priceTypeName
        }))
        this.form.checkList = checkList.map(x => ({
          id: x.id,
          typeName: x.priceTypeName,
          priceTypeId: x.priceTypeId,
          money: x.money
        }))
      }
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
    fetchPriceTypes () {
      let params = {
        page: {
          pageNum: 1,
          pageSize: 1e5
        }
      }
      GetPriceTypes(params)
        .then(res => {
          this.priceTypes = res.result.list || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    serveChange (ss) {
      this.form.checkList = ss.map(x => {
        let has = this.form.checkList.find(z => x.id === z.priceTypeId)
        if (has) {
          return has
        } else {
          return {
            money: '',
            priceTypeId: x.id,
            typeName: x.typeName
          }
        }
      })
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.fetchPriceTypes()
      }
    },
    'row.id' () {
      this.form.strategyId = this.row.id
    }
  }
}
</script>

<style>

</style>
