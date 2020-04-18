<template>
  <div style="min-height: 500px;" v-loading="dataLoading">
    <!-- <div class="serve-item">
      <detail-item label="服务区域">
        <span v-for="item in areas" :key="item.district">
          <el-tag
            size="mini"
          >
            {{
              item.cityDictText +
              (item.districtDictText ? '-' + item.districtDictText : '')
            }}
          </el-tag>
          &nbsp;
        </span>
      </detail-item>
      <detail-item label="安装技能">
        上海市
      </detail-item>
    </div> -->
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
          @change="dataChange"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="服务区域：" prop="areas">
        <el-checkbox-group v-model="form2.areas" @change="dataChange">
          <el-checkbox
            v-for="item in areas"
            :key="item.regionCode"
            :label="item.regionCode"
          >{{item.regionName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="安装技能：" prop="strategies">
        <el-checkbox-group v-model="form2.strategies" size="small" @change="dataChange">
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
                <el-table-column label="安装等级" prop="fixLevelDictText" width="130"></el-table-column>
                <el-table-column label="规则">
                  <template slot-scope="{row}">
                    <rule
                      v-for="item in row.ruleList"
                      :key="item.id"
                      :data="item"
                      :show-handle="false"
                    ></rule>
                    <span class="table-handle-btns">
                      <span class="handle-btn primary" @click="openRuleAdd(row)">
                        添加
                      </span>
                    </span>
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
    </el-form>
    <div v-if="isChange" style="text-align: center;">
      <el-button
        type="primary"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="step3"
      >保存</el-button>
    </div>
    <!-- <handle-strategy
      v-model="visible1"
      ref="strategyDialog"
      :category="category"
      @confirm="strategyConfirm"
      @close="strategyClose"
    ></handle-strategy> -->
    <handle-strategy
      v-model="visible1"
      :row="detail"
      :edit="isEdit"
      ref="handleDialog"
      @close="ruleDialogClose"
      @confirm="strategyConfirm"
    ></handle-strategy>
    <rule-dialog
      ref="ruleDialog"
      v-model="ruleDialogVisible"
      :row="strategy"
      :edit="isEdit"
      @close="ruleDialogClose"
      @submit-ok="ruleSubmitOk"
    >
    </rule-dialog>
  </div>
</template>

<script>
import DetailItem from './detail-item'
import { searchAddress, regionRegeo, GetRegionsList } from '@/api/system'
import { GetSubcategory } from '@/api/product'
import Rule from '@/views/technician/Price/Strategy/rule'
import HandleStrategy from '@/views/technician/List/handleStrategy'
import { updateTech, deleteStrategy, findTechStrategy } from '@/api/technician'
import RuleDialog from '@/views/technician/List/ruleDialog'
export default {
  components: {
    DetailItem,
    Rule,
    HandleStrategy,
    RuleDialog
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
      form2: {
        address: '',
        areas: [],
        strategies: []
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
        ],
        strategies: [
          {required: true, message: '请选择技能', trigger: 'change'}
        ]
      },
      fetchRelaTimer: null,
      areas: [],
      dataLoading: false,
      categores: [],
      isChange: false,
      category: {},
      visible1: false,
      btnLoading: false,
      oldStrategies: [],
      cRow: {},
      ruleDialogVisible: false,
      isEdit: false,
      strategy: {}
    }
  },
  computed: {
  },
  methods: {
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
      this.dataLoading = true
      this.reverseAddressTimer = setTimeout(() => {
        regionRegeo(val)
          .then(res => {
            let result = res.result || {}
            const {
              provinceCode,
              cityCode
            } = result
            let params = {
              parentCode: cityCode || provinceCode
            }
            GetRegionsList(params)
              .then(res => {
                // this.form2.areas = []
                this.areas = res.result || []
                this.dataLoading = false
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
    dataChange () {
      this.isChange = true
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
    step3 () {
      this.$refs.form2.validate(valid => {
        if (valid) {
          let strategies = []
          this.form2.strategies.forEach(x => {
            let has = this.categores.find(z => z.id === x)
            if (has) {
              strategies = strategies.concat(has.strategies)
            }
          })
          let params = {
            ...this.form2,
            strategies,
            id: this.detail.id
          }
          params.areas = params.areas.map(x => {
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
          this.btnLoading = true
          updateTech(params)
            .then(res => {
              this.$notify({
                title: '系统提示',
                message: '更新服务信息成功',
                type: 'success'
              })
              this.btnLoading = false
            })
            .catch(err => {
              this.btnLoading = false
              this.$message.error(err.message)
            })
        }
      })
    },
    fetchStrategies () {
      let params = {
        technicianId: this.detail.id
      }
      findTechStrategy(params)
        .then(res => {
          this.oldStrategies = res.result.list || []
          this.form2.strategies = this.oldStrategies.map(x => x.subcategoryId)
          this.fetchSubcategory()
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    openRuleAdd (row) {
      if (!row.id) {
        this.$message({
          message: '请先保存策略之后配置规则',
          type: 'warning'
        })
        return
      }
      this.strategy = {...row}
      // this.$refs.handleDialog.setData(row)
      // this.cRow = {...row}
      this.ruleDialogVisible = true
    },
    ruleDialogClose () {
      this.isEdit = false
    },
    ruleSubmitOk () {
      this.ruleDialogVisible = false
      this.fetchStrategies()
      this.fetchSubcategory()
    }
  },
  watch: {
    isOwn (val) {
      if (val) {
        const {
          address,
          areas
        } = this.detail
        this.form2.address = address
        this.form2.areas = (areas || []).map(x => x.district)
        this.addressInput(address)
        this.fetchStrategies()
      }
    }
  }
}
</script>
