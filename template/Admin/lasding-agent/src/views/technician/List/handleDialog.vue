<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <div>
      <el-form
        label-width="110px"
        :model="form1"
        :rules="form1Rules"
        class="reduce-margin"
        ref="form1"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名：" prop="name">
              <el-input
                size="small"
                v-model.trim="form1.name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话：" prop="mobile">
              <el-input
                size="small"
                v-model.trim="form1.mobile"
                :maxlength="11"
                :readonly="edit"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="身份证号：" prop="idcard">
              <el-input
                size="small"
                v-model.trim="form1.idcard"
                :maxlength="18"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出生年月日：" prop="birthday">
              <el-date-picker
                size="small"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
                v-model="form1.birthday"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别：" prop="gender">
              <el-radio-group v-model="form1.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="家乡：" prop="hometown">
              <el-input
                size="small"
                v-model.trim="form1.hometown"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="民族：" prop="nation">
              <el-input
                size="small"
                v-model.trim="form1.nation"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="身份证图片：" prop="attachments">
          <div class="img-item">
            <el-upload
              action="/"
              class="avatar-uploader"
              accept="image/*"
              :data="{index: 0, sourceKey: 'idcardfront'}"
              :http-request="customFile"
              :show-file-list="false"
            >
              <img
                class="img-card"
                :src="form1.attachments[0].path"
                v-if="form1.attachments[0].path"
              >
              <i v-else class="avatar-uploader-icon">
                身份证正面
              </i>
            </el-upload>
          </div>
          <div class="img-item">
            <el-upload
              action="/"
              class="avatar-uploader"
              accept="image/*"
              :data="{index: 1, sourceKey: 'idcardback'}"
              :http-request="customFile"
              :show-file-list="false"
            >
              <img
                class="img-card"
                :src="form1.attachments[1].path"
                v-if="form1.attachments[1].path"
              >
              <i v-else class="avatar-uploader-icon">
                身份证反面
              </i>
            </el-upload>
          </div>
          <div class="img-item">
            <el-upload
              action="/"
              class="avatar-uploader"
              accept="image/*"
              :data="{index: 2, sourceKey: 'headimage'}"
              :http-request="customFile"
              :show-file-list="false"
            >
              <img
                class="img-card"
                :src="form1.attachments[2].path"
                v-if="form1.attachments[2].path"
              >
              <i v-else class="avatar-uploader-icon">
                上传头像
              </i>
            </el-upload>
          </div>
          <div class="img-item">
            <el-upload
              action="/"
              class="avatar-uploader"
              accept="image/*"
              :data="{index: 3, sourceKey: 'other'}"
              :http-request="customFile"
              :show-file-list="false"
            >
              <img
                class="img-card"
                :src="form1.attachments[3].path"
                v-if="form1.attachments[3].path"
              >
              <i v-else class="avatar-uploader-icon">
                手持证件照
              </i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="实名认证：" prop="authentication">
          <el-radio-group v-model="form1.authentication">
            <el-radio :label="0">未成功</el-radio>
            <el-radio :label="1">成功</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="结算模式：" prop="paymentPeriod">
          <el-radio-group v-model="form1.paymentPeriod">
            <el-radio
              v-for="item in payTypes"
              :key="item.itemValue"
              :label="item.itemValue"
            >{{item.itemText}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="技师类型：" prop="type">
          <el-radio-group v-model="form1.type">
            <el-radio
              v-for="item in techTypes"
              :key="item.itemValue"
              :label="item.itemValue"
            >{{item.itemText}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="信息完整度：" prop="completeLevel">
          <el-checkbox-group v-model="form1.completeLevel">
            <el-checkbox
              v-for="item in completeLevelList"
              :key="item.key"
              :label="item.key"
            >{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="加入黑名单：">
          <el-checkbox>黑名单</el-checkbox>
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
import { PAYMENT_PERIOD, TECH_TYPE } from '@/store/modules/dict'
import { mapState } from 'vuex'
import { GetTechDetail } from '@/api/technician'
import { fileQniu } from '@/api/file'
export default {
  mixins: [dialogMinix],
  data () {
    return {
      form1: {
        mobile: '',
        name: '',
        idcard: '',
        gender: 1,
        hometown: '',
        authentication: '',
        birthday: '',
        paymentPeriod: '',
        completeLevel: [],
        attachments: [
          {sourceKey: 'idcardfront'},
          {sourceKey: 'idcardback'},
          {sourceKey: 'headimage'},
          {sourceKey: 'other'}
        ],
        type: '',
        nation: ''
      },
      form1Rules: {
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入师傅名', trigger: 'blur'}
        ],
        idcard: [
          {required: true, message: '请输入身份证号', trigger: 'blur'}
        ],
        paymentPeriod: [
          {required: true, message: '请选择结算模式', trigger: 'change'}
        ],
        type: [
          {required: true, message: '请选择技师类型', trigger: 'change'}
        ],
        nation: [
          {required: true, message: '请输入民族信息', trigger: 'change'}
        ]
      },
      completeLevelList: [
        {key: 'PASSWORD', label: '密码已设置'},
        {key: 'BASIC', label: '基础信息已完善'},
        {key: 'ABILITY', label: '服务能力已完善'},
        {key: 'BANKCARD', label: '银行卡已完善'}
      ]
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
    },
    ...mapState({
      payTypes: state => state.dict[PAYMENT_PERIOD],
      techTypes: state => state.dict[TECH_TYPE],
      QniuToken: state => state.app.qniuToken
    })
  },
  methods: {
    submitForm () {
      this.$refs.form1.validate(valid => {
        if (valid) {
          this.btnLoading = true
          let done = () => {
            this.btnLoading = false
          }
          this.$emit('confirm', this.form1, done)
        }
      })
    },
    async handleEdit (row) {
      this.editMiddle = {...this.form1}
      let result = await GetTechDetail(row.id)
      const {
        mobile,
        idcard,
        name,
        gender,
        hometown,
        authentication,
        birthday,
        paymentPeriod,
        completeLevel,
        attachments,
        type,
        nation,
        id
      } = result.result
      this.form1.mobile = mobile
      this.form1.name = name
      this.form1.idcard = idcard
      this.form1.gender = gender
      this.form1.hometown = hometown
      this.form1.authentication = authentication
      this.form1.birthday = birthday
      this.form1.paymentPeriod = paymentPeriod + ''
      this.form1.completeLevel = completeLevel.split(';').filter(x => x !== '')
      this.form1.type = type ? type + '' : ''
      this.form1.id = id
      this.form1.nation = nation
      attachments.forEach((item) => {
        let has = this.form1.attachments.find(x => x.sourceKey === item.sourceKey)
        delete item.id
        Object.assign(has, item)
      })
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
        this.form1 = {...this.editMiddle}
      } else {
        this.$refs.form1.resetFields()
      }
      this.$refs.form1.clearValidate()
      this.form1.attachments = [
        {sourceKey: 'idcardfront'},
        {sourceKey: 'idcardback'},
        {sourceKey: 'headimage'},
        {sourceKey: 'other'}
      ]
      this.$emit('close')
    },
    async customFile (http) {
      const {
        file,
        data: {
          index
        }
      } = http
      if (!this.QniuToken) {
        await this.$store.dispatch('GetQniuToken')
      }
      var observable = fileQniu(file, 'tech/idcard', this.QniuToken)
      observable.subscribe({
        error: (err) => {
          console.log(err)
          this.$message.error(err.message)
        },
        complete: (res) => {
          // this.form1.attachments[0] = {...res}
          let one = this.form1.attachments[index]
          this.$set(this.form1.attachments, index, {...one, ...res, ossKey: res.key})
        }
      })
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.payTypes.length <= 0) {
          this.$store.dispatch('GetDictItem', PAYMENT_PERIOD)
        }
        if (this.techTypes.length <= 0) {
          this.$store.dispatch('GetDictItem', TECH_TYPE)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.reduce-margin{
  /deep/ .el-form-item{
    margin-bottom: 10px;
  }
  /deep/ .el-form-item__error{
    padding-top: 0;
  }
}
.avatar-uploader {
  /deep/ .el-upload{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
}
.avatar-uploader .el-upload:hover{
  border-color: #409EFF;
}
.avatar-uploader-icon{
  font-size: 13px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  display: inline-block;
}
.img-card{
  width: 100px;
  height: 100px;
  display: block;
}
.img-item{
  display: inline-block;
  vertical-align: baseline;
}
</style>
