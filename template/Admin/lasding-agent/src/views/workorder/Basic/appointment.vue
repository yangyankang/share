<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="1200px"
    @close="dialogClose"
    :close-on-click-modal="false"
    top="2vh"
  >
    <div style="margin: -10px;">
      <el-row :gutter="20">
        <el-col :span="15">
          <el-form
            label-width="90px"
            ref="search"
            class="reduce-margin"
            :model="search"
          >
            <el-form-item label="工单备注：" v-if="row.remark">
              {{row.remark}}
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="行政区域：">
                  <el-cascader
                    v-model="search.regions"
                    popper-class="add-cascader-height"
                    size="small"
                    :options="regions"
                    :props="{
                      checkStrictly: true,
                      value: 'id',
                      label: 'regionName'
                    }"
                    clearable
                    filterable
                    style="width: 100%;"
                  >
                  </el-cascader>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-form-item label="期望时间：">
                  <el-date-picker
                    size="small"
                    style="width: 100%;"
                  ></el-date-picker>
                </el-form-item>
              </el-col> -->
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="技师信息：" prop="content">
                  <el-input
                    size="small"
                    placeholder="技师信息/团队信息"
                    v-model.trim="search.content"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品类别：" prop="subcategoryId">
                  <el-select size="small" v-model="search.subcategoryId">
                    <el-option value="" label="全部"></el-option>
                    <el-option
                      v-for="item in subcategories"
                      :key="item.id"
                      :value="item.id"
                      :label="item.categoryName + '-' + item.subcategoryName"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="10px">
                  <el-button
                    size="small"
                    type="primary"
                    @click="searchTableData"
                  >查询</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form
            label-width="90px"
            ref="form"
            :model="form"
            :rules="formRules"
            class="reduce-margin"
          >
            <el-form-item label-width="0" prop="technicianId">
              <el-tabs v-model="tabActive" v-loading="dataLoading">
                <el-tab-pane label="技师群组" name="group">
                  <el-table
                    border
                    height="350px"
                    :data="techGroups"
                    highlight-current-row
                    @row-click="groupRowClick"
                    @expand-change="groupExpand"
                    @current-change="techGroupCheckedChange"
                    row-key="id"
                    ref="techGroup"
                  >
                    <el-table-column label="展开" type="expand">
                      <template slot-scope="{row}">
                        <div style="padding-left: 48px;">
                          <el-table
                            border
                            :data="(row.members || [])"
                            highlight-current-row
                            ref="techGroupMember"
                            @current-change="(tech) => techGroupMemberChange(tech, row)"
                          >
                            <el-table-column label="技师姓名" prop="name"></el-table-column>
                            <el-table-column label="技师电话" prop="mobile"></el-table-column>
                            <el-table-column label="交通工具" prop="vehicle" width="110" align="center"></el-table-column>
                            <el-table-column label="七日单量" width="90" align="center"></el-table-column>
                          </el-table>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="团队名称" prop="groupName" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="团长信息" prop="leader.name" show-overflow-tooltip></el-table-column>
                    <el-table-column label="团队人数" prop="num" width="100" align="center"></el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="个人技师" name="one">
                  <el-table
                    border
                    height="350px"
                    highlight-current-row
                    :data="techDataList"
                    @current-change="techCheckedChange"
                    ref="techTable"
                  >
                    <el-table-column label="技师姓名" prop="name"></el-table-column>
                    <el-table-column label="技师电话" prop="mobile"></el-table-column>
                    <el-table-column label="交通工具" prop="vehicle"></el-table-column>
                    <el-table-column label="七日单量"></el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </el-form-item>
            <div>
              <template v-if="tabActive === 'group'">
                <div class="pages-wrapper">
                  <el-pagination
                    background
                    layout="sizes, prev, pager, next, jumper"
                    :total="techGroupTotal"
                    :page-size="techGroupPage.pageSize"
                    :current-page="techGroupPage.pageNum"
                    @size-change="techGroupSizeChange"
                    @current-change="techGroupCurrentChange"
                  >
                  </el-pagination>
                </div>
              </template>
              <template v-else>
                <div class="pages-wrapper">
                  <el-pagination
                    background
                    layout="sizes, prev, pager, next, jumper"
                    :total="techTotal"
                    :page-size="techPage.pageSize"
                    :current-page="techPage.pageNum"
                    @size-change="techSizeChange"
                    @current-change="techCurrentChange"
                  >
                  </el-pagination>
                </div>
              </template>
            </div>
            <div v-if="mode !== 'share'">
              <el-row>
                <el-col :span="12" v-if="mode === 'again'">
                  <el-form-item label="失败原因：">
                    <el-select
                      size="small"
                      v-model="form"
                    >
                      <el-option
                        v-for="item in womRefuseTypes"
                        :key="item.itemValue"
                        :value="item.itemValue"
                        :label="item.itemText"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="日期：" prop="planDate">
                    <el-date-picker
                      value-format="yyyy-MM-dd"
                      placeholder="请选择日期"
                      size="small"
                      v-model="form.planDate"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="时段：" prop="timeSlot">
                <el-radio-group size="small" v-model="form.timeSlot">
                  <el-radio-button
                    v-for="item in womPlanSlots"
                    :key="item.itemValue"
                    :label="item.itemValue"
                  >{{item.itemText}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-form>
        </el-col>
        <el-col :span="9">
          <div>
            <div style="height: 230px;" id="map"></div>
          </div>
          <div>
            <el-calendar :range="dateRange">
              <template slot="dateCell" slot-scope="{data}">
                <div style="font-size: 12px;">
                  {{data.day | tripsFilter(techTrips, 'date')}}
                </div>
                <div class="trip-box">
                  {{data.day | tripsFilter(techTrips, 'num')}}
                </div>
              </template>
            </el-calendar>
          </div>
        </el-col>
      </el-row>
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
        @click="confirm"
      >提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import { GetRegions } from '@/api/system'
import { WOM_PLAN_SLOT, WOM_REFUSE_TYPE } from '@/store/modules/dict'
import { mapState } from 'vuex'
import {
  findWomValidTech,
  findWomValidGroup,
  techGroupMembers,
  findTechPlan,
  findGroupPlan
} from '@/api/technician'
import { GetSubcategory } from '@/api/product'
export default {
  mixins: [dialogMinix],
  props: {
    row: {
      type: Object,
      default () {
        return {}
      }
    },
    mode: {
      type: String,
      default: 'share',
      validtor (val) {
        return [
          'yuyue', // 预约
          'again', // 在此预约
          'share' // 分单
        ].indexOf(val) !== -1
      }
    }
  },
  data () {
    return {
      form: {
        planDate: '',
        groupId: '',
        technicianId: '',
        timeSlot: '',
        serviceIds: ''
      },
      formRules: {
        technicianId: [
          {required: true, message: '请选择技师', trigger: 'change'}
        ]
      },
      search: {
        content: '',
        province: '',
        city: '',
        district: '',
        regions: []
      },
      regions: [],
      techPage: {
        pageNum: 1,
        pageSize: 20
      },
      techTotal: 0,
      techDataList: [],
      techGroupPage: {
        pageNum: 1,
        pageSize: 20
      },
      techGroupTotal: 0,
      techGroups: [],
      tabActive: 'group',
      techTrips: [],
      subcategories: [],
      expands: [],
      dataLoading: false
    }
  },
  computed: {
    dialogTitle () {
      return '预约'
    },
    dateRange () {
      const dNow = new Date()
      const beginDate = new Date()
      let dNowW = dNow.getDay()
      let dNowD = dNow.getDate()
      if (dNowW !== 0) {
        beginDate.setDate(dNowD - dNowW + 1)
      }
      let beginD = beginDate.getDate()
      let beginY = beginDate.getFullYear()
      let beginM = beginDate.getMonth()
      let endDate = new Date()
      endDate.setDate(dNowD + (4 * 7) + (6 - dNowW) + 1)
      let endY = endDate.getFullYear()
      let endM = endDate.getMonth()
      let endD = endDate.getDate()
      function addZero (n) {
        return n < 10 ? '0' + n : n + ''
      }
      return [
        beginY + '-' + addZero(beginM + 1) + '-' + addZero(beginD),
        endY + '-' + addZero(endM + 1) + '-' + addZero(endD)
      ]
    },
    ...mapState({
      womPlanSlots: state => state.dict[WOM_PLAN_SLOT],
      womRefuseTypes: state => state.dict[WOM_REFUSE_TYPE]
    })
  },
  methods: {
    confirm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true
          const done = () => {
            this.btnLoading = false
          }
          this.$emit('confirm', {...this.form}, done)
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
      this.form.groupId = ''
      this.expands.forEach(x => {
        this.$refs.techGroup && this.$refs.techGroup.toggleRowExpansion(x, false)
      })
      this.$emit('close')
    },
    // lazyLoad (node, resolve) {
    //   const {
    //     level
    //   } = node
    //   let regionCode
    //   if (node.data) {
    //     regionCode = node.data.regionCode
    //   }
    //   let params = {
    //     regionGrade: level + 1,
    //     parentCode: regionCode
    //   }
    //   GetRegionsList(params)
    //     .then(res => {
    //       var result = res.result || []
    //       resolve(result)
    //     })
    //     .catch(err => {
    //       this.$message.error(err.message)
    //     })
    // },
    fetchRegions () {
      GetRegions()
        .then(res => {
          this.regions = res.result || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    fetchWomValidTech () {
      this.dataLoading = true
      const {
        regions: [
          province,
          city,
          district
        ],
        subcategoryId,
        content
      } = this.search
      let params = {
        page: this.techPage,
        province,
        city,
        district,
        subcategoryId,
        content
      }
      findWomValidTech(params)
        .then(res => {
          this.techDataList = res.result.list || []
          this.techTotal = res.result.total || 0
          this.dataLoading = false
          const {
            technicianId
          } = this.form
          const {
            serviceType
          } = this.row
          if (serviceType && technicianId) {
            let has = this.techDataList.find(x => x.id === technicianId)
            if (has) {
              this.$refs.techTable.setCurrentRow(has, true)
            }
          }
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    fetchWomValidGroup () {
      this.dataLoading = true
      const {
        regions: [
          province,
          city,
          district
        ],
        subcategoryId,
        content
      } = this.search
      let params = {
        page: this.techGroupPage,
        province,
        city,
        district,
        subcategoryId,
        content
      }
      findWomValidGroup(params)
        .then(res => {
          this.techGroups = res.result.list || []
          this.techGroupTotal = res.result.total || 0
          this.dataLoading = false
          const {
            technicianId,
            groupId
          } = this.form
          let has = this.techGroups.find(x => x.id === groupId)
          if (has) {
            if (technicianId && has.leaderId === technicianId) {
              this.$refs.techGroup.setCurrentRow(has, true)
            } else {
              if (technicianId) {
                this.$refs.techGroup.toggleRowExpansion(has, true)
                this.$nextTick(() => {
                  this.$refs.techGroupMember.setCurrentRow({id: technicianId}, true)
                })
              }
            }
          }
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    groupRowClick (row) {
      let {
        id
      } = row
      this.form.groupId = id
    },
    techGroupSizeChange (size) {
      this.techGroupPage.pageSize = size
      this.fetchWomValidGroup()
    },
    techGroupCurrentChange (num) {
      this.techGroupPage.pageNum = num
      this.fetchWomValidGroup()
    },
    techSizeChange (size) {
      this.techPage.pageSize = size
      this.fetchWomValidTech()
    },
    techCurrentChange (num) {
      this.techPage.pageNum = num
      this.fetchWomValidTech()
    },
    groupExpand (row, expandedRows) {
      this.expands = [...expandedRows]
      let params = {
        groupId: row.id
      }
      this.$refs.techGroup.setCurrentRow(row)
      if (!row.members) {
        techGroupMembers(params)
          .then(res => {
            this.$set(row, 'members', res.result)
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      }
    },
    techGroupCheckedChange (row) {
      if (!row) {
        return
      }
      console.log(row)
      this.$refs.techGroupMember && this.$refs.techGroupMember.setCurrentRow()
      this.$refs.techGroup.setCurrentRow(row)
      const {
        id,
        leaderId
      } = row
      this.form.groupId = id
      this.form.technicianId = leaderId
      this.$refs.form.validateField('technicianId')
      this.fetchGroupPlan(id)
    },
    techGroupMemberChange (tech, row) {
      if (!tech) {
        return
      }
      this.$refs.techGroup.setCurrentRow()
      this.$refs.techGroupMember.setCurrentRow(tech)
      this.form.groupId = row.id
      this.form.technicianId = tech.id
      this.$refs.form.validateField('technicianId')
      this.fetchTechPlan(tech.id)
    },
    techCheckedChange (row) {
      const {
        id
      } = row
      this.$refs.techGroup && this.$refs.techGroup.setCurrentRow()
      this.$refs.techGroupMember && this.$refs.techGroupMember.setCurrentRow()
      this.form.groupId = ''
      this.form.technicianId = id
      this.$refs.form.validateField('technicianId')
      this.fetchTechPlan(id)
    },
    fetchTechPlan (technicianId) {
      const [
        beginDate,
        endDate
      ] = this.dateRange
      let params = {
        beginDate,
        endDate,
        technicianId
      }
      console.log(this.dateRange)
      findTechPlan(params)
        .then(res => {
          this.techTrips = res.result || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    fetchGroupPlan (groupId) {
      const [
        beginDate,
        endDate
      ] = this.dateRange
      let params = {
        groupId,
        beginDate,
        endDate
      }
      findGroupPlan(params)
        .then(res => {
          this.techTrips = res.result || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    fetchSubcategory () {
      let params = {
        page: {
          pageNum: 1,
          pageSize: 1e6
        }
      }
      GetSubcategory(params)
        .then(res => {
          this.subcategories = res.result.list || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    searchTableData () {
      switch (this.tabActive) {
        case 'group':
          this.fetchWomValidGroup()
          break
        case 'one':
          this.fetchWomValidTech()
          break
      }
    }
  },
  filters: {
    tripsFilter (date, trips, type) {
      let day = date.split('-').slice(1).join('-')
      let has = trips.find(x => x.date.split(' ')[0] === date)
      let data = {
        date: day,
        num: has ? has.num + '单' : ''
      }
      return data[type]
    }
  },
  watch: {
    visible (val) {
      if (val) {
        const {
          longitude,
          latitude,
          serviceType,
          technicianId,
          technicianGroup
        } = this.row
        if (serviceType === 1) {
          this.tabActive = 'one'
          this.form.technicianId = technicianId
        } else {
          if (serviceType === 2) {
            this.form.groupId = technicianGroup
            this.form.technicianId = technicianId
          }
          this.fetchWomValidGroup()
        }
        this.$nextTick(() => {
          var map = new window.AMap.Map('map', {
            zoom: 16,
            center: [longitude, latitude]
          })
          var marker = new window.AMap.Marker({
            icon: 'http://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
            position: [longitude, latitude]
          })
          marker.setMap(map)
        })
        if (this.womPlanSlots.length <= 0) {
          this.$store.dispatch('GetDictItem', WOM_PLAN_SLOT)
        }
        if (this.mode === 'share') {
          if (this.womRefuseTypes.length <= 0) {
            this.$store.dispatch('GetDictItem', WOM_REFUSE_TYPE)
          }
        }
        if (this.regions.length <= 0) {
          this.fetchRegions()
        }
        if (this.subcategories.length <= 0) {
          this.fetchSubcategory()
        }
        // 设置数据
        const {
          province,
          city,
          district,
          product
        } = this.row
        this.search.regions = [province, city, district]
        this.search.subcategoryId = product ? product.subcategoryId : ''
      } else {
        this.tabActive = 'group'
      }
    },
    tabActive (val) {
      if (val === 'one') {
        this.fetchWomValidTech()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.reduce-margin{
  /deep/ .el-form-item{
    margin-bottom: 5px;
  }
  /deep/ .el-form-item__error{
    margin-top: -3px;
    padding-top: 0;
  }
}
.trip-box{
  color: coral;
  font-size: 12px;
}
</style>
