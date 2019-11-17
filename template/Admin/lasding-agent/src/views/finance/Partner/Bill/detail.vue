<template>
  <el-card shadow="never">
    <el-form
      label-width="90px"
      ref="searchForm"
      class="search-form"
      :model="searchForm"
    >
      <el-row>
        <el-col :xl="6" :lg="7" :md="9" :sm="12">
          <el-form-item label="结算模式" prop="payId">
            <el-radio-group size="small" v-model="searchForm.payId">
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button
                v-for="item in payTypes"
                :key="item.itemValue"
                :label="item.itemValue"
              >{{item.itemText}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="账单类型" prop="billType">
            <div class="custom-flex">
              <div class="flex-auto">
                <el-form-item>
                  <el-radio-group
                    size="small"
                    v-model="searchForm.billType"
                    @change="billTypeChange"
                  >
                    <el-radio-button :label="1">日账单</el-radio-button>
                    <el-radio-button :label="4">月账单</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="flex1">
                <el-form-item prop="queryDate" v-if="searchForm.billType === 1">
                  <el-date-picker
                    size="small"
                    style="width: 100%;"
                    v-model="searchForm.queryDate"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item prop="queryDate" v-else>
                  <el-date-picker
                    size="small"
                    style="width: 100%;"
                    type="month"
                    value-format="yyyy-MM"
                    v-model="searchForm.queryDate"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="4" :md="6">
          <el-form-item label-width="10px">
            <el-button
              size="small"
              type="primary"
              @click="fetchList"
            >查询</el-button>
            <el-button
              size="small"
            >重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="header-btns-wrapper">
      <div class="fr">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="dialogVisible = true"
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
    </div>
    <div>
      <el-tabs v-model="tabActive" @tab-click="tabChange">
        <el-tab-pane label="全部" name="ALL"></el-tab-pane>
        <el-tab-pane label="线下" name="XX"></el-tab-pane>
        <el-tab-pane label="京东" name="JD"></el-tab-pane>
        <el-tab-pane label="天猫" name="TM"></el-tab-pane>
        <el-tab-pane label="绿米" name="LV"></el-tab-pane>
      </el-tabs>
      <div style="margin-bottom: 10px;">
        <sum :data="statc"></sum>
      </div>
    </div>
    <list-table
      :data="dataList"
      :show-columns="showCols"
      @sort-change="sortChange"
      v-loading="dataLoading"
    >
      <template slot="payId" slot-scope="{row}">
        {{(row.payId + '') | optsFilter(payTypes, 'itemValue', 'itemText')}}
      </template>
      <template slot="billType" slot-scope="{row}">
        {{row.billType | optsFilter(billTypes, 'value', 'text')}}
      </template>
      <template slot="subcategoryId" slot-scope="{row}">
        {{row.subcategoryId | optsFilter(subcategories, 'id', 'subcategoryName')}}
      </template>
      <template slot="billStatus" slot-scope="{row}">
        {{row.billStatus | optsFilter(stateOptions, 'value', 'text')}}
      </template>
      <template slot="billId" slot-scope="{row}">
        {{row.totalMoney - row.completeMoney}}
      </template>
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
    <table-config
      v-model="tableConfigShow"
      :url="url"
      @save-ok="tableConfigSaveOk"
    >
    </table-config>
  </el-card>
</template>

<script>
import baseMinix from '@/utils/baseMinix'
import SetTableCols from '@/components/SetTableCols'
import ListTable from '@/components/ListTable'
import TableConfig from '@/components/TableConfig'
import Sum from './sum'
import { findBillList, findWebBillStatis } from '@/api/partner'
import { PARTNER_PAY_TYPES, SUBCATEGORYS } from '@/store/modules/dict'
import { mapState } from 'vuex'
import { parseTime } from '@/utils'
export default {
  mixins: [baseMinix],
  components: {
    ListTable,
    SetTableCols,
    TableConfig,
    Sum
  },
  data () {
    let now = new Date()
    let iD = now.getDate()
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
        config: ''
      },
      searchForm: {
        payId: '',
        billType: 1,
        queryDate: parseTime(now.setDate(iD - 1), 'yyyy-MM-dd'),
        partnerId: ''
      },
      tableConfigShow: false,
      tabActive: 'ALL',
      classOpts: {
        'XX': [1, 2],
        'TM': [3, 4],
        'JD': [5, 6],
        'LV': [7, 8]
      },
      statc: {},
      showCols: [
        {field: 'partnerName', fieldName: '商家名称'},
        {field: 'billNo', fieldName: '账单编号'},
        {field: 'payId', fieldName: '结算模式'},
        {field: 'billDate', fieldName: '账期'},
        {field: 'subcategoryId', fieldName: '商品类型'},
        {field: 'billClassifyDictText', fieldName: '账单来源'},
        {field: 'generateTime', fieldName: '生成时间'},
        {field: 'totalMoney', fieldName: '总金额'},
        {field: 'completeMoney', fieldName: '完成金额'},
        {field: 'refundMoney', fieldName: '退款金额'},
        {field: 'waitMoney', fieldName: '待支付金额'},
        {field: 'discountMoney', fieldName: '折扣金额'},
        {field: 'billId', fieldName: '支付差值'},
        {field: 'billType', fieldName: '账单类型'},
        {field: 'billStatus', fieldName: '账单状态'}
      ],
      billTypes: [
        {value: 1, text: '月结'},
        {value: 4, text: '预付'}
      ],
      stateOptions: [
        {value: 1, text: '未支付', type: ''},
        {value: 2, text: '已支付', type: 'success'},
        {value: 3, text: '暂无', type: 'info'}
      ]
    }
  },
  computed: {
    ...mapState({
      payTypes: state => state.dict[PARTNER_PAY_TYPES],
      subcategories: state => state.dict[SUBCATEGORYS]
    })
  },
  methods: {
    fetchList () {
      let params = {
        page: this.page
      }
      for (let k in this.searchForm) {
        if (this.searchForm[k] !== '') {
          params[k] = this.searchForm[k]
        }
      }
      if (this.tabActive !== 'ALL') {
        params.billClassifys = this.classOpts[this.tabActive]
      }
      this.dataLoading = true
      findBillList(params)
        .then(res => {
          this.dataList = res.result.list || []
          this.total = res.result.total || 0
          this.dataLoading = false
        })
        .catch(err => {
          this.$message.error(err.message)
        })
      findWebBillStatis(params)
        .then(res => {
          this.statc = res.result || {}
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
    dialogClose () {},
    submitOk () {
      this.dialogVisible = false
      this.fetchList()
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.fetchList()
    },
    tableConfigSaveOk () {},
    billTypeChange () {},
    tabChange () {
      this.fetchList()
    },
    updateSearch () {
      const {
        pId,
        d,
        dType
      } = this.$route.query
      this.searchForm.queryDate = d
      this.searchForm.billType = dType
      this.searchForm.partnerId = pId
    }
  },
  created () {
    this.updateSearch()
    this.fetchList()
    if (this.payTypes.length <= 0) {
      this.$store.dispatch('GetDictItem', PARTNER_PAY_TYPES)
    }
    if (this.subcategories.length <= 0) {
      this.$store.dispatch('GetSubcategory')
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-flex{
  display: flex;
  .flex-auto{
  }
  .flex1{
    flex: 1;
  }
}
</style>
