<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
    append-to-body
  >
    <div style="padding: 50px;">
      <el-form
        label-width="110px"
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="费用类型：" prop="costType">
              <el-select size="small" v-model="form.costType" @change="costTypeChange">
                <el-option
                  v-for="item in priceTypes"
                  :key="item.id"
                  :value="item.id"
                  :label="item.typeName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="费用金额：" prop="cost">
              <el-input-number
                :min="0"
                size="small"
                style="width: 100%;"
                v-model="form.cost"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注："  prop="remark">
              <el-input
                size="small"
                type="textarea"
                placeholder="请输入备注信息"
                :rows="4"
                v-model="form.remark"
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
import { GetPriceTypes } from '@/api/price'
export default {
  mixins: [dialogMinix],
  data () {
    return {
      form: {
        cost: '',
        remark: '',
        costType: '',
        subject: ''
      },
      formRules: {
        costType: [
          {required: true, message: '请选择费用类型', trigger: 'change'}
        ],
        cost: [
          {required: true, message: '请输入费用金额', trigger: 'blur'},
          {
            validator: (rule, value, cb) => {
              if (/^\d+(\.\d{1,2})?$/.test(value)) {
                cb()
              } else {
                cb(new Error('金额格式有误'))
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
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let data = {
            ...this.form
          }
          this.btnLoading = true
          let done = () => {
            this.btnLoading = false
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
    costTypeChange (val) {
      let has = this.priceTypes.find(x => x.id === val)
      const {
        typeName
      } = has
      this.form.subject = typeName
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
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.priceTypes.length <= 0) {
          this.fetchPriceTypes()
        }
      }
    }
  }
}
</script>

<style>

</style>
