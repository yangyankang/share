<template>
  <el-card shadow="never">
    <el-form
      label-width="90px"
      ref="searchForm"
      class="search-form"
      :model="searchForm"
    >
      <el-row>
        <el-col :xl="6" :lg="8" :md="8" :sm="12">
          <el-form-item label="商家名称" prop="partnerName">
            <el-input
              size="small"
              placeholder="请输入商家名称"
              v-model.trim="searchForm.partnerName"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="8" :sm="12">
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
        <el-col :xl="6" :lg="12" :md="12">
          <el-form-item label="商品类型" prop="subcategoryId">
            <el-radio-group size="small" v-model="searchForm.subcategoryId">
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button
                v-for="item in subcategories"
                :label="item.id"
                :key="item.id"
              >{{item.subcategoryName}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xl="3" :lg="4" :md="6" :sm="6" :xs="12">
          <el-form-item label-width="10px">
            <el-button
              size="small"
              type="primary"
            >查询</el-button>
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
      <recordSum :data="sum"></recordSum>
    </div>
    <list-table
      :data="dataList"
      :show-columns="showCols"
      @sort-change="sortChange"
      v-loading="dataLoading"
    >
      <template slot="payId" slot-scope="{row}">
        {{row.payId + '' | optsFilter(payTypes, 'itemValue', 'itemText')}}
      </template>
      <template slot="totalMoney" slot-scope="{row}">
        <span>{{row.totalMoney}}</span>
        <span>
          <div><span>应收：</span>{{row.receivableMoney}}</div>
          <div><span>抵扣券：</span>{{row.couponMoney}}</div>
        </span>
      </template>
      <template slot="preReceivableMoney" slot-scope="{row}">
        {{row.payId === 1 ? row.monthBackMoney : row.preReceivableMoney}}
      </template>
      <template slot="aliRechargeMoney" slot-scope="{row}">
        <span>
          {{
            row.aliRechargeMoney +
            row.bankRechargeMoney +
            row.wxRechargeMoney +
            row.lsdRechargeMoney
          }}
        </span>
        <span>
          <div>
            <span>支付宝：</span>
            <span>{{row.aliRechargeMoney}}</span>
          </div>
          <div>
            <span>微信：</span>
            <span>{{row.wxRechargeMoney}}</span>
          </div>
          <div>
            <span>银行卡：</span>
            <span>{{row.bankRechargeMoney}}</span>
          </div>
          <div>
            <span>线下：</span>
            <span>{{row.lsdRechargeMoney}}</span>
          </div>
        </span>
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
import RecordSum from './recordSum'
import { findRecordBillStatis } from '@/api/partner'
import { PARTNER_PAY_TYPES, SUBCATEGORYS } from '@/store/modules/dict'
import { mapState } from 'vuex'
// import { parseTime } from '@/utils'
export default {
  mixins: [baseMinix],
  components: {
    ListTable,
    SetTableCols,
    TableConfig,
    RecordSum
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
        config: ''
      },
      searchForm: {
        partnerName: '',
        payId: '',
        subcategoryId: ''
      },
      tableConfigShow: false,
      showCols: [
        {field: 'partnerName', fieldName: '商家名称'},
        {field: 'payId', fieldName: '结算模式'},
        {field: 'totalMoney', fieldName: '销售额'},
        {field: 'preReceivableMoney', fieldName: '已收'},
        {field: 'profitDifferMoney', fieldName: '多收'},
        {field: 'lossDifferMoney', fieldName: '少收'},
        {field: 'aliRechargeMoney', fieldName: '充值总额'},
        {field: 'balanceMoney', fieldName: '当期余额'},
        {field: 'refundMoney', fieldName: '退款'},
        {field: 'monthBackMoney', fieldName: '回款'}
      ],
      sum: {}
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
      this.dataLoading = true
      findRecordBillStatis(params)
        .then(res => {
          let result = res.result || {}
          this.dataList = result.billList.list || []
          this.total = result.billList.total || 0
          this.sum = result.topStatis || {}
          this.dataLoading = false
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
    tableConfigSaveOk () {}
  },
  created () {
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

</style>
