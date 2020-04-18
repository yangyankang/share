<template>
  <el-card shadow="never">
    <el-form
      label-width="90px"
      ref="searchForm"
      class="search-form"
      :model="searchForm"
    >
      <el-row>
        <el-col :xl="4" :lg="6" :md="6" :sm="8" :xs="12">
          <el-form-item label="工单编号" prop="id">
            <el-input
              size="mini"
              v-model.trim="searchForm.id"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="6" :sm="8" :xs="12">
          <el-form-item label="客户信息" prop="linkman">
            <el-input
              size="mini"
              v-model.trim="searchForm.linkman"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="6" :sm="8" :xs="12">
          <el-form-item label="技师信息" prop="technician">
            <el-input
              size="mini"
              v-model.trim="searchForm.technician"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="6" :sm="8" :xs="12">
          <el-form-item label="商家信息" prop="partner">
            <el-input
              size="mini"
              v-model.trim="searchForm.partner"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="6" :sm="8" :xs="12">
          <el-form-item label="来源单号" prop="sourceId">
            <el-input
              size="mini"
              v-model.trim="searchForm.sourceId"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="6" :sm="8" :xs="12">
          <el-form-item label="工单类型" prop="type">
            <!-- <el-input
              size="mini"
              v-model.trim="searchForm.type"
            ></el-input> -->
            <el-select
              size="mini"
              v-model="searchForm.type"
            >
              <el-option value="" label="全部"></el-option>
              <el-option
                v-for="item in womTypes"
                :key="item.itemValue"
                :value="item.itemValue"
                :label="item.itemText"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="16" :xs="24">
          <el-form-item prop="searchDateType">
            <div slot="label" style="margin-right: -12px;">
              <el-select
                size="mini"
                v-model="searchForm.searchDateType"
              >
                <el-option
                  v-for="item in dateTypeList"
                  :key="item.key"
                  :value="item.key"
                  :label="item.label"
                ></el-option>
              </el-select>
            </div>
            <el-row>
              <el-col :span="11">
                <el-form-item prop="beginTime">
                  <el-date-picker
                    size="mini"
                    style="width: 100%;"
                    type="datetime"
                    v-model="searchForm.beginTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item label-width="0">
                  <div style="text-align: center;">
                    至
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item prop="endTime">
                  <el-date-picker
                    size="mini"
                    style="width: 100%;"
                    type="datetime"
                    v-model="searchForm.endTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="6" :sm="8" :xs="12">
          <el-form-item label="工单来源" prop="sourceType">
            <el-select
              size="mini"
              v-model="searchForm.sourceType"
            >
              <el-option value="" label="全部"></el-option>
              <el-option
                v-for="item in womSourceTypes"
                :key="item.itemValue"
                :value="item.itemValue"
                :label="item.itemText"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="6" :sm="8" :xs="12">
          <el-form-item label="收货状态">
            <el-input
              size="mini"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="6" :md="6" :sm="8" :xs="12">
          <el-form-item label="失败原因" prop="sourceType">
            <el-input
              size="mini"
              v-model="searchForm.errcode"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xl="8" :lg="12" :md="16" :sm="24" :xs="24">
          <el-form-item label="工单状态" prop="status">
            <el-radio-group size="mini" v-model="searchForm.status">
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button
                v-for="item in womStates"
                :key="item.itemValue"
                :label="item.itemValue"
              >
                {{item.itemText}}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="行政区域">
            <el-cascader
              v-model="searchForm.region"
              popper-class="add-cascader-height"
              size="mini"
              :options="regions"
              :props="{
                checkStrictly: true,
                value: 'regionCode',
                label: 'regionName',
                lazy: true,
                lazyLoad: lazyLoad
              }"
              clearable
              filterable
              style="width: 100%;"
            >
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-form-item label="工单进度" id="flows-wrapper">
        <el-checkbox-group size="mini" v-model="searchForm.flows" @change="flowsSearchChange">
          <el-checkbox-button label="">全部</el-checkbox-button>
          <el-checkbox-button
            v-for="item in flowsStatus"
            :key="item.itemValue"
            :label="item.itemValue"
          >
            <el-badge
              :value="item.num"
              :hidden="item.num === 0"
            >
              <span>{{item.itemText}}</span>
            </el-badge>
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item> -->
    </el-form>
    <div class="header-btns-wrapper">
      <div class="fr">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="openCreating"
        >
          新增
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="setColsVisible = true">
          表格配置
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="tableConfigShow = true">
          管理配置
        </el-button>
      </div>
      <div>
        <el-button
          size="small"
          type="primary"
          @click="fetchList"
        >查询</el-button>
        <el-button
          size="small"
        >重置</el-button>
        <el-button
          size="small"
          type="text"
        >收起</el-button>
      </div>
    </div>
    <list-table
      :data="dataList"
      :show-columns="showCols"
      @sort-change="sortChange"
      v-loading="dataLoading"
      show-checkbox
    >
      <template slot="id" slot-scope="{row}">
        {{row.id}}
      </template>
      <template slot="typeDictText" slot-scope="{row}">
        <div>
          <el-tag
            size="mini"
            :type="row.type | typeStatus"
          >{{row.typeDictText[1]}}</el-tag>
          <el-tag
            size="mini"
            type="danger"
            v-if="row.sourceType !== 'NONE'"
          >
            {{row.sourceType === 'TMALL' ? 'TM' : row.sourceType}}
          </el-tag>
          <el-tag
            size="mini"
            v-if="row.serviceType"
          >
            {{row.serviceType === 1 ? '个' : '团'}}
          </el-tag>
        </div>
      </template>
      <el-table-column label="操作" align="center" fixed="right" min-width="300" show-overflow-tooltip>
        <span class="table-handle-btns" slot-scope="{row}">
          <!-- <span class="handle-btn warn" @click="openCheckOrder(row)">
            创建检测单
          </span> -->
          <a
            class="handle-btn primary"
            :href="'/workorder/detail?oId=' + row.id"
            target="_blank"
          >
            详情
          </a>
          <span class="handle-btn success" @click="handleVisit(row)">
            回访
          </span>
          <!-- <span class="handle-btn danger" @click="openRepairOrder(row)">
            创建维修单
          </span>
          <span class="handle-btn" @click="openClosure(row)">
            核销
          </span>
          <span class="handle-btn success" @click="openYuYue(row)">
            预约
          </span>
          <span class="handle-btn danger" @click="openCancel(row)">
            取消
          </span>
          <span class="handle-btn primary" @click="openShare(row)">
            分单
          </span> -->
        </span>
      </el-table-column>
    </list-table>
    <div class="pages-wrapper">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="page.pageSize"
        :current-page="page.pageNum"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <set-table-cols
      v-model="setColsVisible"
      @confirm="setTableColsOk"
      :url="url"
    >
    </set-table-cols>
    <handle-dialog
      ref="handleDialog"
      :edit="isEdit"
      @close="dialogClose"
      v-model="dialogVisible"
      @confirm="confirmSubmit"
      :detail="cRow"
    ></handle-dialog>
    <table-config
      v-model="tableConfigShow"
      :url="url"
      @save-ok="tableConfigSaveOk"
    >
    </table-config>
    <!-- <closure-dialog
      v-model="closureVisible"
      :row="cRow"
      @submit-ok="closureSuccess"
    ></closure-dialog>
    <appointment
      v-model="YuYueVisible"
      :row="cRow"
      :mode="orderType"
      @confirm="yuyueConfirm"
    ></appointment> -->
  </el-card>
</template>

<script>
import baseMinix from '@/utils/baseMinix'
import SetTableCols from '@/components/SetTableCols'
import ListTable from '@/components/ListTable'
import TableConfig from '@/components/TableConfig'
import HandleDialog from './handleDialog'
import {
  findIdentifyWom,
  orderAssign,
  shareOrder,
  loadFlowStatistics,
  visitWom
} from '@/api/workorder'
import { GetRegionsList } from '@/api/system'
import {
  WOM_STATUS,
  WOM_SOURCE_TYPE,
  WOM_ORDER_TYPE
} from '@/store/modules/dict'
import { mapState } from 'vuex'
export default {
  mixins: [baseMinix],
  components: {
    ListTable,
    SetTableCols,
    TableConfig,
    HandleDialog
  },
  data () {
    return {
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      dataList: [],
      cRow: {},
      dialogVisible: false,
      setColsVisible: false,
      url: {
        config: '/wom/order'
      },
      searchForm: {
        id: '',
        linkman: '',
        technician: '',
        partner: '',
        sourceId: '',
        type: '',
        beginTime: '',
        endTime: '',
        searchDateType: 'BY_REQUESTED_TIME',
        sourceType: '',
        deliveryStatus: '',
        status: '',
        region: [],
        flows: ['']
      },
      tableConfigShow: false,
      closureVisible: false,
      regions: [],
      dateTypeList: [
        {key: 'BY_DELIVERY_TIME', label: '收货时间'},
        {key: 'BY_REQUESTED_TIME', label: '创建时间'},
        {key: 'BY_SHARED_TIME', label: '分单时间'},
        {key: 'BY_RECEIVED_TIME', label: '接单时间'},
        {key: 'BY_ASSIGNED_TIME', label: '预约时间'},
        {key: 'BY_REACHED_TIME', label: '签到时间'},
        {key: 'BY_IDENTIFY_TIME', label: '核销时间'},
        {key: 'BY_END_TIME', label: '回访时间'},
        {key: 'BY_PLAN_DATE', label: '预约日期'}
      ],
      YuYueVisible: false,
      orderType: 'yuyue',
      createType: '2',
      flowsWomNum: []
    }
  },
  computed: {
    ...mapState({
      womStates: state => state.dict[WOM_STATUS],
      // womFlowStates: state => state.dict[WOM_FLOW_STATUS],
      womSourceTypes: state => state.dict[WOM_SOURCE_TYPE],
      womTypes: state => state.dict[WOM_ORDER_TYPE]
    })
    // flowsStatus () {
    //   let flowsStatus = this.womFlowStates.map(x => {
    //     let has = this.flowsWomNum.find(z => z.flowStatus === x.itemValue)
    //     return {
    //       ...x,
    //       num: has ? has.num : 0
    //     }
    //   })
    //   return flowsStatus
    // }
  },
  methods: {
    fetchList () {
      let params = {
        page: this.page
      }
      for (let k in this.searchForm) {
        if (this.searchForm[k] !== '') {
          switch (k) {
            case 'flows':
              params[k] = this.searchForm[k].filter(x => x !== '')
              break
            case 'region':
              const [province, city, district, street] = this.searchForm[k]
              Object.assign(params, {
                province,
                city,
                district,
                street
              })
              break
            default:
              params[k] = this.searchForm[k]
          }
        }
      }
      this.dataLoading = true
      findIdentifyWom(params)
        .then(res => {
          this.dataList = res.result.list || []
          this.total = res.result.total || 0
          this.dataLoading = false
          this.fetchFlowStatistics()
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    currentChange (num) {
      this.page.pageNum = num
      this.fetchList()
    },
    sizeChange (size) {
      this.page.pageSize = size
      this.fetchList()
    },
    sortChange () {},
    openEdit (row) {
      this.$refs.handleDialog.handleEdit(row)
    },
    openRemove (row) {
      const {
        typeName,
        id
      } = row
      this.$confirm(`您确定删除--${typeName}--类型嘛？`, '系统提示', {})
        .then(() => {
          alert(id)
          // deletePriceType(id)
          //   .then(() => {
          //     this.$notify({
          //       title: '系统提示',
          //       message: '删除成功!',
          //       type: 'success'
          //     })
          //     this.fetchList()
          //   })
          //   .catch(err => {
          //     this.$message.error(err.message)
          //   })
        })
        .catch(() => {})
    },
    dialogClose () {
      this.isEdit = false
    },
    async confirmSubmit (data, done) {
      let params = {
        serviceIds: [this.cRow.id],
        technicianId: this.cRow.technicianId
      }
      visitWom(params)
        .then(res => {
          this.$notify({
            title: '系统提示',
            message: '回访成功!',
            type: 'success'
          })
          done()
          this.dialogVisible = false
          this.fetchList()
        })
        .catch(err => {
          done()
          this.$message.error(err.message)
        })
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.fetchList()
    },
    tableConfigSaveOk () {},
    openCheckOrder (row) {
      // this.$refs.handleDialog.createData(row)
      this.dialogVisible = true
    },
    openRepairOrder (row) {
      this.createType = '2'
      this.$refs.handleDialog.createData(row)
      this.dialogVisible = true
    },
    openClosure (row) {
      this.cRow = {...row}
      this.closureVisible = true
    },
    closureSuccess () {
      this.closureVisible = false
    },
    lazyLoad (node, resolve) {
      const {
        level
      } = node
      let regionCode
      if (node.data) {
        regionCode = node.data.regionCode
      }
      // const {
      //   regionGrade,
      //   regionCode
      // } = node.data
      let params = {
        regionGrade: level + 1,
        parentCode: regionCode
      }
      GetRegionsList(params)
        .then(res => {
          var result = res.result || []
          resolve(result)
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    flowsSearchChange (val) {
      console.log(val)
      if (val[val.length - 1] !== '') {
        this.searchForm.flows = val.filter(x => x !== '')
      } else {
        this.searchForm.flows = ['']
      }
    },
    openYuYue (row) {
      this.cRow = {...row}
      this.YuYueVisible = true
    },
    openCancel (row) {
      this.cRow = {...row}
    },
    yuyueConfirm (data, done) {
      let params = Object.assign({}, data, {serviceIds: [this.cRow.id]})
      switch (this.orderType) {
        case 'order':
          break
        case 'yuyue':
          orderAssign(params)
            .then(res => {
              this.$notify({
                title: '系统提示',
                message: '预约提交成功',
                type: 'success'
              })
              done()
              this.fetchList()
              this.YuYueVisible = false
            })
            .catch(err => {
              done()
              this.$message.error(err.message)
            })
          break
        case 'share':
          shareOrder(params)
            .then(res => {
              this.$notify({
                title: '系统提示',
                message: '已成功分单',
                type: 'success'
              })
              done()
              this.fetchList()
              this.YuYueVisible = false
            })
            .catch(err => {
              done()
              this.$message.error(err.message)
            })
          break
      }
    },
    openShare (row) {
      this.cRow = {...row}
      this.orderType = 'share'
      this.YuYueVisible = true
    },
    openCreating () {
      this.createType = '1'
      this.dialogVisible = true
    },
    Godetail (row) {
      this.$router.push({
        path: '/workorder/detail',
        query: {
          oId: row.id
        }
      })
    },
    fetchFlowStatistics () {
      loadFlowStatistics()
        .then(res => {
          this.flowsWomNum = res.result || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    handleVisit (row) {
      this.cRow = {...row}
      this.dialogVisible = true
    }
  },
  filters: {
    typeStatus (val) {
      let type
      switch (val) {
        case 1:
          type = 'primary'
          break
        case 2:
          type = 'warning'
          break
        case 3:
          type = 'warning'
          break
        case 4:
          type = 'warning'
          break
        case 5:
          type = 'warning'
          break
      }
      return type
    },
    flowNum (val, opts) {
      let has = opts.find(x => x.flowStatus === val)
      return has ? has.num : 0
    }
  },
  created () {
    this.fetchList()
    if (this.womStates.length <= 0) {
      this.$store.dispatch('GetDictItem', WOM_STATUS)
    }
    // if (this.womFlowStates.length <= 0) {
    //   this.$store.dispatch('GetDictItem', WOM_FLOW_STATUS)
    // }
    if (this.womSourceTypes.length <= 0) {
      this.$store.dispatch('GetDictItem', WOM_SOURCE_TYPE)
    }
    if (this.womTypes.length <= 0) {
      this.$store.dispatch('GetDictItem', WOM_ORDER_TYPE)
    }
  }
}
</script>

<style lang="scss">
.el-calendar-table{
  .el-calendar-day{
    height: 58px;
  }
}
#flows-wrapper{
  /deep/ .el-badge__content{
    top: -8px;
    z-index: 10;
  }
}
</style>
