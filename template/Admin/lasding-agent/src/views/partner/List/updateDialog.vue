<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
    @mouseup.native="showPass = false"
    top="10vh"
  >
    <div class="form-wrapper">
      <el-form
        label-width="110px"
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="商家名称：" prop="partnerName">
              <el-input
                size="small"
                v-model.trim="form.partnerName"
                placeholder="请输入商家名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商家类型：" prop="partnerType">
              <el-radio-group size="small" v-model="form.partnerType">
                <el-radio-button
                  v-for="item in partnerTypes"
                  :key="item.itemValue"
                  :label="item.itemValue"
                >{{item.itemText}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="!edit">
          <el-col :span="12">
            <el-form-item label="登录账号：" prop="username">
              <el-input
                size="small"
                placeholder="请设置登录账号"
                v-model.trim="form.username"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号密码：" prop="password">
              <el-input
                size="small"
                placeholder="请设置登录密码"
                v-model.trim="form.password"
                :type="showPass ? 'text' : 'password'"
                :maxlength="16"
              >
                <span
                  slot="suffix"
                  class="el-icon-view"
                  @mousedown="showPass = true"
                ></span>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人：" prop="legalPerson">
              <el-input
                size="small"
                v-model.trim="form.legalPerson"
                placeholder="请输入联系人姓名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号：" prop="partnerPhone">
              <el-input
                size="small"
                v-model.trim="form.partnerPhone"
                :maxlength="11"
                placeholder="请输入联系人手机号"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号码：" prop="idCard">
              <el-input
                size="small"
                placeholder="请输入身份证号码"
                v-model="form.idCard"
                :maxlength="18"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商家邮箱：" prop="email">
              <el-input
                size="small"
                placeholder="请输入邮箱地址"
                v-model.trim="form.email"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="签约期限：" prop="activeTime">
              <el-date-picker
                style="width: 100%;"
                size="small"
                v-model="form.activeTime"
                placeholder="开始时间"
                value-format="yyyy-MM-dd"
                :picker-options="startOpts"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="——" class="set-style" prop="invalidTime">
              <el-date-picker
                style="width: 100%;"
                size="small"
                v-model="form.invalidTime"
                placeholder="结束时间"
                value-format="yyyy-MM-dd"
                :picker-options="endOpts"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="省市区：" prop="regions">
              <el-cascader
                :options="regions"
                :props="{
                  checkStrictly: true,
                  value: 'id',
                  label: 'regionName'
                }"
                size="small"
                v-model="form.regions"
                style="width: 100%;"
                filterable
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址：" prop="partnerAddress">
              <el-input
                size="small"
                placeholder="请输入详细地址"
                v-model.trim="form.partnerAddress"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="上传照片：">
          <p>请不要上传同一张照片</p>
          <div>
            <div class="img-item">
              <el-upload
                action="/"
                :show-file-list="false"
                :http-request="customFile"
                :data="{type: 'license', index: 0}"
                class="avatar-uploader"
                accept="image/*"
              >
                <img
                  class="img-card"
                  v-if="license.path"
                  :src="license.path"
                >
                <i v-else class="avatar-uploader-icon">
                  营业执照
                </i>
              </el-upload>
            </div>
            <div class="img-item">
              <el-upload
                action="/"
                :show-file-list="false"
                :http-request="customFile"
                :data="{type: 'idcardfront', index: 0}"
                class="avatar-uploader"
                accept="image/*"
              >
                <img
                  class="img-card"
                  v-if="idcardfront.path"
                  :src="idcardfront.path"
                >
                <i v-else class="avatar-uploader-icon">
                  身份证正面
                </i>
              </el-upload>
            </div>
            <div class="img-item">
              <el-upload
                action="/"
                :show-file-list="false"
                :http-request="customFile"
                :data="{type: 'idcardback', index: 1}"
                class="avatar-uploader"
                accept="image/*"
              >
                <img
                  class="img-card"
                  v-if="idcardback.path"
                  :src="idcardback.path"
                >
                <i v-else class="avatar-uploader-icon">
                  身份证反面
                </i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="上传附件：">
          <el-upload
            action="/"
            :file-list="pactList"
            :http-request="customFile"
            :data="{type: 'pact'}"
            :before-remove="pactBeforeRemove"
            accept="application/pdf, application/msword"
            ref="pactFile"
          >
            <el-button
              size="small"
              type="success"
              icon="el-icon-upload"
            >合同上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传.pdf | .doc文件</div>
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
import { PARTNER_TYPES } from '@/store/modules/dict'
import { mapState } from 'vuex'
import { fileQniu } from '@/api/file'
import { GetRegions } from '@/api/system'
import { queryPartnerAttachment } from '@/api/partner'
export default {
  mixins: [dialogMinix],
  data () {
    const mobileRule = (rl, val, cb) => {
      if (/^1[3-9]\d{9}$/.test(val)) {
        cb()
      } else {
        cb(new Error('手机号格式有误!'))
      }
    }
    return {
      form: {
        partnerName: '',
        partnerType: '',
        partnerPhone: '',
        payId: 2,
        partnerAddress: '',
        activeTime: '',
        invalidTime: '',
        idCard: '',
        legalPerson: '',
        username: '',
        email: '',
        regions: [],
        certificate: [],
        idCardImg: [],
        contract: []
      },
      formRules: {
        partnerName: [
          {required: true, message: '请输入商家名称', trigger: 'blur'}
        ],
        partnerType: [
          {required: true, message: '请选择商家类型', trigger: 'change'}
        ],
        username: [
          {required: true, message: '请设置登录账号', trigger: 'blur'}
        ],
        partnerPhone: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {validator: mobileRule, trigger: 'blur'}
        ],
        legalPerson: [
          {required: true, message: '请输入联系人姓名', trigger: 'blur'}
        ]
      },
      showPass: false,
      regions: [],
      startOpts: {
        disabledDate (time) {
          return time < Date.now() - 12 * 60 * 60 * 1000
        }
      },
      endOpts: {
        disabledDate (time) {
          return time < Date.now() + 24 * 60 * 60 * 1000 * 7
        }
      },
      license: {},
      idcardfront: {},
      idcardback: {},
      pactList: []
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
    },
    ...mapState({
      partnerTypes: state => state.dict[PARTNER_TYPES],
      QniuToken: state => state.app.qniuToken
    })
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
          if (data.regions.length > 0) {
            const [province, city, district] = data.regions
            data.province = province
            data.city = city
            data.district = district
          }
          delete data.regions
          this.$emit('confirm', data, done)
        }
      })
    },
    handleEdit (row) {
      this.editMiddle = {...this.form}
      const {
        partnerId,
        activeTime,
        invalidTime,
        province,
        city,
        district,
        partnerAddress,
        partnerType,
        partnerPhone,
        partnerName,
        legalPerson,
        email
      } = row
      let params = {
        AttachType: -1,
        partnerId
      }
      queryPartnerAttachment(params)
        .then(res => {
          let result = res.result || []
          let license = result.find(x => x.sourceKey === 'license')
          let idcardfront = result.find(x => x.sourceKey === 'idcardfront')
          let idcardback = result.find(x => x.sourceKey === 'idcardback')
          let pacts = result.filter(x => x.sourceKey === 'pact')
          this.pactList.push(...pacts.map(x => ({url: x.path, name: x.name, key: x.ossKey})))
          this.form.contract.push(...pacts)
          this.license = license || {}
          license && this.form.certificate.push(license)
          this.idcardfront = idcardfront || {}
          this.idcardback = idcardback || {}
          idcardfront && this.form.idCardImg.push(idcardfront)
          idcardback && this.form.idCardImg.push(idcardback)
        })
        .catch(err => {
          this.$message.error(err.message)
        })
      var regions = [province, city, district].filter(x => !!x)
      Object.assign(this.form, {
        partnerName: partnerName || '',
        activeTime: activeTime || '',
        invalidTime: invalidTime || '',
        regions,
        partnerAddress: partnerAddress || '',
        partnerType: partnerType + '' || '',
        partnerPhone: partnerPhone || '',
        partnerId,
        legalPerson: legalPerson || '',
        email: email || ''
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
        this.form = {...this.editMiddle}
      } else {
        this.$refs.form.resetFields()
      }
      this.$refs.form.clearValidate()
      this.$refs.pactFile.clearFiles()
      this.form.certificate = []
      this.form.idCardImg = []
      this.contract = []
      this.idcardfront = {}
      this.idcardback = {}
      this.license = {}
      this.pactList = []
      this.$emit('close')
    },
    async customFile (http) {
      const {
        file,
        data: {
          type,
          index
        }
      } = http
      if (!this.QniuToken) {
        await this.$store.dispatch('GetQniuToken')
      }
      var observable = fileQniu(file, 'partner/photo', this.QniuToken)
      observable.subscribe({
        error: (err) => {
          this.$message.error(err.message)
        },
        complete: (res) => {
          let result = {...res, ossKey: res.key, ossBucket: res.bucket}
          switch (type) {
            case 'license':
              Object.assign(result, {sourceKey: type})
              this.form.certificate[index] = result
              this[type] = result
              break
            case 'pact':
              Object.assign(result, {sourceKey: type})
              this.form.contract.push(result)
              this.pactList.push({
                name: file.name,
                url: res.path,
                key: res.key
              })
              break
            default:
              Object.assign(result, {sourceKey: type})
              this.form.idCardImg[index] = result
              this[type] = result
          }
        }
      })
    },
    pactBeforeRemove (file) {
      const {
        uid
      } = file
      let hasIndex = this.pactList.findIndex(x => x.uid === uid)
      this.form.contract.splice(hasIndex, 1)
      this.pactList.splice(hasIndex, 1)
    },
    fetchRegion () {
      GetRegions()
        .then(res => {
          this.regions = res.result || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.partnerTypes.length <= 0) {
          this.$store.dispatch('GetDictItem', PARTNER_TYPES)
        }
        if (this.regions.length <= 0) {
          this.fetchRegion()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.set-style{
  /deep/ .el-form-item__label{
    padding-right: 0;
    text-align: center;
  }
}
.el-upload__tip{
  margin-top: 0;
  line-height: 20px;
}
.form-wrapper{
  /deep/ .el-form-item{
    margin-bottom: 10px;
  }
  /deep/ .el-form-item__error{
    padding-top: 0;
  }
}
.img-item{
  display: inline-block;
  vertical-align: baseline;
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
</style>
