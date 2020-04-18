<template>
  <el-dialog
    :title="dialogVisible"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="100px"
      ref="form"
      :model="form"
      :rules="formRules"
    >
      <el-form-item label="机构名称：" prop="name">
        <el-input
          size="small"
          v-model="form.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="企业全称：" prop="enterpriseName">
        <el-input
          size="small"
          placeholder="请输入企业名称"
          v-model="form.enterpriseName"
        ></el-input>
      </el-form-item>
      <el-form-item label="收费类型：" prop="chargeType">
        <el-radio-group size="small" v-model="form.chargeType">
          <el-radio-button :label="0">
            体验模式
          </el-radio-button>
          <el-radio-button :label="1">
            月付模式
          </el-radio-button>
          <el-radio-button :label="2">
            年付模式
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="签约时间：" v-if="form.chargeType === 0">
        <el-row>
          <el-col :span="11">
            <el-form-item prop="validTime">
              <el-date-picker
                size="small"
                type="datetime"
                placeholder="开始时间"
                v-model="form.validTime"
                style="width: 100%;"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item style="text-align: center;">至</el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="invalidTime">
              <el-date-picker
                size="small"
                type="datetime"
                placeholder="结束时间"
                v-model="form.invalidTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="负责人姓名：" prop="contactName">
            <el-input
              size="small"
              v-model="form.contactName"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人电话：">
            <el-input
              size="small"
              v-model="form.contactMobile"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="企业地址：" prop="enterpriseAddress">
        <el-input
          size="small"
          v-model="form.enterpriseAddress"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="社会统一信用编码："
        prop="enterpriseNo"
        label-width="150px"
      >
        <el-input
          size="small"
          v-model="form.enterpriseNo"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button
        size="small"
        :loading="btnLoading"
        @click="$emit('change', false)">
        取消
      </el-button>
      <el-button
        size="small"
        type="primary"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="submitForm"
      >
        提交
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import { createAgent, updateAgent } from '@/api/system'
export default {
  mixins: [dialogMinix],
  props: {

  },
  data () {
    return {
      form: {
        name: '',
        enterpriseName: '',
        chargeType: '',
        validTime: '',
        invalidTime: '',
        enterpriseNo: '',
        enterpriseAddress: '',
        contactName: '',
        contactMobile: ''
      },
      formRules: {
        name: [
          {required: true, message: '请输入机构名称', trigger: 'blur'}
        ],
        chargeType: [
          {required: true, message: '请选择机构类型', trigger: 'change'}
        ],
        validTime: [
          {required: true, message: '请选择起始时间', trigger: 'blur'}
        ],
        invalidTime: [
          {required: true, message: '请选择结束时间', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    dialogVisible () {
      return this.edit ? '修改机构信息' : '新增机构'
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true
          if (this.edit) {
            updateAgent(this.form)
              .then(res => {
                this.$notify({
                  title: '系统提示',
                  message: '修改机构信息成功!',
                  type: 'success'
                })
                this.$emit('submit-ok')
                this.btnLoading = false
              })
              .catch(err => {
                this.btnLoading = false
                this.$message.error(err.message)
              })
            return
          }
          createAgent(this.form)
            .then(res => {
              this.$notify({
                title: '系统提示',
                message: '机构新增成功!',
                type: 'success'
              })
              this.$emit('submit-ok')
              this.btnLoading = false
            })
            .catch(err => {
              this.btnLoading = false
              this.$message.error(err.message)
            })
        }
      })
    },
    dialogClose () {
      if (this.editMiddle) {
        this.form = {...this.editMiddle}
      } else {
        this.$refs.form.resetFields()
      }
      this.form.parentId = ''
      this.$refs.form.clearValidate()
      this.$emit('close')
    },
    handleEdit (row) {
      this.editMiddle = {...this.form}
      this.form = {...row}
    }
  },
  watch: {
    visible (val) {
      if (val) {
      }
    }
  }
}
</script>
