<template>
  <div style="min-height: 500px;">
    <div class="handle-steps">
      <el-steps align-center :active="finished">
        <el-step title="第一步" icon="el-icon-edit" description="基本信息"></el-step>
        <el-step title="第二步" icon="el-icon-map-location" description="服务区域"></el-step>
        <el-step title="第三步" icon="el-icon-star-on" description="服务能力、价格"></el-step>
        <el-step title="第四步" icon="el-icon-finished" description="完成"></el-step>
      </el-steps>
    </div>
    <div class="form-wrapper">
      <div v-show="finished === 0">
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
                  v-model="form1.name"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电话：" prop="mobile">
                <el-input
                  size="small"
                  v-model="form1.mobile"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号：" prop="idcard">
                <el-input
                  size="small"
                  v-model="form1.idcard"
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
                  v-model="form1.hometown"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="民族：" prop="nation">
                <el-input
                  size="small"
                  v-model="form1.nation"
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
                :data="{index: 0}"
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
                :data="{index: 1}"
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
                :data="{index: 2}"
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
                :data="{index: 3}"
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
          <!-- <el-form-item label="加入黑名单：">
            <el-checkbox>黑名单</el-checkbox>
          </el-form-item> -->
          <div style="text-align: center;">
            <el-button
              @click="step1"
            >
              通过并下一步
            </el-button>
            <el-button
              @click="openReject"
            >
              不通过
            </el-button>
          </div>
        </el-form>
      </div>
      <div v-show="finished === 1">
        <el-form
          label-width="110px"
          :model="form2"
          :rules="form2Rules"
          ref="form2"
        >
          <el-form-item label="常驻地址：" prop="address">
            <el-autocomplete
              placeholder="省+市+区县+城镇+街道+门牌号,根据实际地址而定"
              v-model="form2.address"
              :fetch-suggestions="fetchRelaAddress"
              size="small"
              style="width: 100%;"
              value-key="name"
              @input="addressInput"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="服务区域：" prop="areas">
            <el-checkbox-group v-model="form2.areas">
              <el-checkbox
                v-for="item in areas"
                :key="item.regionCode"
                :label="item.regionCode"
              >{{item.regionName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <div style="text-align: center;">
            <el-button
              @click="finished--"
            >
              上一步
            </el-button>
            <el-button
              @click="step2"
            >
              下一步
            </el-button>
          </div>
        </el-form>
      </div>
      <div v-show="finished === 2">
        <el-form
          label-width="110px"
          ref="form3"
          :model="form3"
          :rules="form3Rules"
        >
          <el-form-item label="安装技能：" prop="strategies">
            <el-checkbox-group v-model="form3.strategies" size="small">
              <div
                v-for="item in categores"
                :key="item.id"
              >
                <el-row>
                  <el-col :span="6">
                    <el-checkbox :label="item.id">
                     {{item.categoryName}} - {{item.subcategoryName}}
                    </el-checkbox>
                  </el-col>
                  <el-col :span="6">
                    <el-button
                      type="text"
                      @click="openChooseStrategy(item)"
                    >添加策略</el-button>
                  </el-col>
                </el-row>
                <div style="font-size: 13px;" v-if="item.strategies.length > 0">
                  <el-table
                    :data="item.strategies"
                    border
                    row-key="id"
                  >
                    <el-table-column type="index" align="center"></el-table-column>
                    <el-table-column label="策略名称" prop="strategyName" width="130"></el-table-column>
                    <el-table-column label="产品分类" width="150">
                      <template slot-scope="{row}">
                        {{row.categoryIdDictText + '-' + row.subcategoryIdDictText}}
                      </template>
                    </el-table-column>
                    <el-table-column label="规则">
                      <template slot-scope="{row}">
                        <rule
                          v-for="item in row.ruleList"
                          :key="item.id"
                          :data="item"
                          :show-handle="false"
                        ></rule>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120">
                      <span class="table-handle-btns" slot-scope="{row, $index}">
                        <!-- <span class="handle-btn warn" v-if="row.strategyType" @click="openEdit(row)">
                          修改
                        </span> -->
                        <span class="handle-btn danger" @click="openRemove(item, row, $index)">
                          删除
                        </span>
                      </span>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-checkbox-group>
          </el-form-item>
          <div style="text-align: center;">
            <el-button
              @click="finished--"
              :loading="btnLoading"
              :disabled="btnLoading"
            >
              上一步
            </el-button>
            <el-button
              @click="step3"
              :loading="btnLoading"
              :disabled="btnLoading"
            >
              下一步
            </el-button>
          </div>
        </el-form>
      </div>
      <div>
        <el-form></el-form>
      </div>
    </div>
    <handle-strategy
      v-model="visible1"
      :row="detail"
      :edit="isEdit"
      ref="handleDialog"
      @close="ruleDialogClose"
      @confirm="strategyConfirm"
    ></handle-strategy>
  </div>
</template>

<script>
import { PAYMENT_PERIOD, TECH_TYPE } from '@/store/modules/dict'
import { mapState } from 'vuex'
import { rejectTech, approveTech, findTechStrategy, deleteStrategy } from '@/api/technician'
import { fileQniu } from '@/api/file'
import { searchAddress, regionRegeo, GetRegionsList } from '@/api/system'
import { GetSubcategory } from '@/api/product'
import HandleStrategy from '@/views/technician/List/handleStrategy'
import Rule from '@/views/technician/Price/Strategy/rule'
export default {
  components: {
    HandleStrategy,
    Rule
  },
  props: {
    detail: {
      type: Object,
      default () {
        return {}
      }
    },
    isOwn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const lenRule = (rl, val, cb) => {
      if (val.length > 0) {
        cb()
      } else {
        cb(new Error('请选择服务区域'))
      }
    }
    return {
      finished: 0,
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
      form2: {
        address: '',
        areas: []
      },
      form2Rules: {
        address: [
          {required: true, message: '请输入常驻地址', trigger: 'blur'}
        ],
        areas: [
          {required: true, message: '请选择地区', trigger: 'change'},
          {
            validator: lenRule,
            trigger: 'change'
          }
        ]
      },
      form3: {
        strategies: []
      },
      form3Rules: {
        strategies: [
          {required: true, message: '请选择技能', trigger: 'change'}
        ]
      },
      completeLevelList: [
        {key: 'PASSWORD', label: '密码已设置'},
        {key: 'BASIC', label: '基础信息已完善'},
        {key: 'ABILITY', label: '服务能力已完善'},
        {key: 'BANKCARD', label: '银行卡已完善'}
      ],
      fetchRelaTimer: null,
      reverseAddressTimer: null,
      areas: [],
      categores: [],
      visible1: false,
      category: {},
      isEdit: false,
      btnLoading: false,
      oldStrategies: []
    }
  },
  computed: {
    ...mapState({
      payTypes: state => state.dict[PAYMENT_PERIOD],
      techTypes: state => state.dict[TECH_TYPE],
      QniuToken: state => state.app.qniuToken
    })
  },
  methods: {
    openReject () {
      this.$prompt('请输入驳回理由', '系统提示', {
        inputType: 'textarea',
        inputPattern: /.{2,}/,
        inputValidator (val) {
          if (!/.{2,}/.test(val)) {
            return '请说明具体理由'
          }
        },
        inputErrorMessage: '请说明具体理由'
      })
        .then(({value}) => {
          let params = {
            remark: value,
            technicianId: this.detail.id
          }
          rejectTech(params)
            .then(() => {
              this.$notify({
                title: '系统提示',
                message: '已驳回该师傅的申请',
                type: 'success'
              })
              this.$emit('update')
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {})
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
    },
    step1 () {
      this.$refs.form1.validate(valid => {
        if (valid) {
          this.finished++
        }
      })
    },
    step2 () {
      this.$refs.form2.validate(valid => {
        if (valid) {
          this.finished++
        }
      })
    },
    fetchRelaAddress (str, cb) {
      clearTimeout(this.fetchRelaTimer)
      if (!str) {
        let result = []
        cb(result)
        return
      }
      this.fetchRelaTimer = setTimeout(() => {
        searchAddress(str)
          .then(res => {
            cb(res.result || [])
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      }, 500)
    },
    addressInput (val) {
      clearTimeout(this.reverseAddressTimer)
      if (!val) {
        return
      }
      this.reverseAddressTimer = setTimeout(() => {
        regionRegeo(val)
          .then(res => {
            let result = res.result || {}
            const {
              provinceCode,
              cityCode,
              districtCode
            } = result
            let params = {
              parentCode: cityCode || provinceCode
            }
            this.form1.province = provinceCode
            this.form1.city = cityCode
            this.form1.district = districtCode
            GetRegionsList(params)
              .then(res => {
                // this.form2.areas = []
                this.areas = res.result || []
              })
              .catch(err => {
                this.$message.error(err.message)
              })
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      }, 1000)
    },
    fetchSubcategory () {
      let params = {
        page: {
          pageSize: 1e6,
          pageNum: 1
        }
      }
      GetSubcategory(params)
        .then(res => {
          let list = res.result.list || []
          let {
            oldStrategies
          } = this
          list.forEach(x => {
            let has = (oldStrategies || []).filter(z => x.id === z.subcategoryId)
            this.$set(x, 'strategies', has)
          })
          this.categores = list
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    step3 () {
      this.$refs.form3.validate(valid => {
        if (valid) {
          let strategies = []
          this.form3.strategies.forEach(x => {
            let has = this.categores.find(z => z.id === x)
            if (has) {
              strategies = strategies.concat(has.strategies)
            }
          })
          let params = {
            ...this.form1,
            ...this.form2,
            strategies,
            id: this.detail.id
          }
          let hasImg = params.attachments.filter(x => !!x.path)
          let chooseAreas = params.areas.map(x => {
            let has = this.areas.find(z => z.regionCode === x)
            if (has) {
              return {
                province: has.provinceCode,
                city: has.cityCode,
                district: has.districtCode
              }
            } else {
              return {}
            }
          })
          params.areas = chooseAreas.filter(x => !!x.city)
          if (hasImg.length <= 0) {
            delete params.attachments
          }
          params.completeLevel = params.completeLevel.join(';')
          this.btnLoading = true
          approveTech(params)
            .then(res => {
              this.$notify({
                title: '系统提示',
                message: '审核通过成功',
                type: 'success'
              })
              this.finished++
              this.$emit('update')
            })
            .catch(err => {
              this.btnLoading = false
              this.$message.error(err.message)
            })
        }
      })
    },
    openEdit (row) {
      this.isEdit = true
      this.$refs.strategyDialog.handleEdit(row)
      this.visible1 = true
    },
    openRemove (item, row, $index) {
      if (row.id) {
        deleteStrategy(row.id)
          .then(res => {
            item.strategies.splice($index, 1)
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      } else {
        item.strategies.splice($index, 1)
      }
    },
    openChooseStrategy (item) {
      this.category = {...item}
      this.$refs.handleDialog.setData(item)
      this.visible1 = true
    },
    strategyConfirm (data) {
      if (data.id) {
        let has = this.category.strategies.find(z => z.strategyId === data.id)
        if (!has) {
          let item = {...data}
          item.strategyId = data.id
          delete item.id
          this.category.strategies.push(item)
        } else {
          this.$message({
            message: '存在相同策略',
            type: 'warning'
          })
        }
      } else {
        let strategy = Object.assign({}, data, {
          categoryIdDictText: this.category.categoryName,
          subcategoryIdDictText: this.category.subcategoryName
        })
        this.category.strategies.push(strategy)
      }
      this.visible1 = false
      this.isEdit = false
    },
    strategyClose () {
      this.isEdit = false
    },
    fetchStrategies () {
      let params = {
        technicianId: this.detail.id
      }
      findTechStrategy(params)
        .then(res => {
          this.oldStrategies = res.result.list || []
          this.form3.strategies = this.oldStrategies.map(x => x.subcategoryId)
          this.fetchSubcategory()
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    ruleDialogClose () {
      this.isEdit = false
    }
  },
  created () {
    if (this.payTypes.length <= 0) {
      this.$store.dispatch('GetDictItem', PAYMENT_PERIOD)
    }
    if (this.techTypes.length <= 0) {
      this.$store.dispatch('GetDictItem', TECH_TYPE)
    }
    // this.fetchSubcategory()
  },
  watch: {
    'detail.id': {
      handler (val) {
      }
    },
    isOwn: {
      handler (val) {
        if (val) {
          const {
            detail,
            form1,
            form2
          } = this
          form1.name = detail.name
          form1.mobile = detail.mobile
          form1.idcard = detail.idcard
          form1.gender = detail.gender
          form1.hometown = detail.hometown || detail.address
          form1.birthday = detail.birthday
          form1.authentication = detail.authentication
          form1.paymentPeriod = detail.paymentPeriod + ''
          form1.type = detail.type
          form1.nation = detail.nation
          form1.completeLevel = detail.completeLevel.split(';').filter(x => x !== '')
          detail.attachments.forEach((item) => {
            let has = this.form1.attachments.find(x => x.sourceKey === item.sourceKey)
            delete item.id
            Object.assign(has, item)
          })
          this.addressInput(detail.address)
          form2.address = detail.address
          form2.areas = detail.areas.map(x => x.district)
        }
        this.fetchStrategies()
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.handle-steps{
  margin-bottom: 20px;
}
.form-wrapper{
  max-width: 900px;
  margin: 0 auto;
}
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
