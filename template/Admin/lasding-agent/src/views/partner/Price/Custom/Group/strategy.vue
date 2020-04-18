<template>
  <el-card shadow="never">
    <el-form
      label-width="90px"
      ref="searchForm"
      class="search-form"
      :model="searchForm"
      inline
    >
      <el-form-item label="策略名称：" prop="strategyName">
        <el-input
          size="small"
          placeholder="请输入策略名称"
          clearable
          v-model.trim="searchForm.strategyName"
        ></el-input>
      </el-form-item>
      <el-form-item label-width="10px">
        <el-button
          size="small"
          type="primary"
          @click="fetchList"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <div class="header-btns-wrapper">
      <div class="fr">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="strategyVisible = true"
        >
          新增
        </el-button>
        <!-- <el-button
          size="small"
          type="primary"

        >自定义策略</el-button> -->
        <!-- <el-button
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
        </el-button> -->
      </div>
      <div>
        <el-button
          size="small"
          @click="backGroup"
        >返回</el-button>
      </div>
    </div>
    <el-table
      border
      :data="dataList"
      v-loading="dataLoading"
    >
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column label="策略名称" prop="priceStrategy.strategyName" width="200"></el-table-column>
      <el-table-column label="产品分类" width="150">
        <template slot-scope="{row}">
          {{row.priceStrategy.categoryIdDictText + '-' + row.priceStrategy.subcategoryIdDictText}}
        </template>
      </el-table-column>
      <el-table-column label="策略类型" width="110" prop="strategyTypeDictText"></el-table-column>
      <el-table-column label="价格规则" min-width="200">
        <template slot-scope="{row}">
          <rule
            v-for="item in (row.priceStrategy && row.priceStrategy.ruleList)"
            :key="item.id"
            :data="item"
            :show-handle="false"
            @edit-click="(data) => openRuleEdit(data, row)"
            @remove-click="(data) => openRemoveRule(data, row)"
          ></rule>
          <!-- <span class="table-handle-btns">
            <span class="handle-btn primary" @click="openRuleAdd(row)"
            style="white-space: nowrap;">
              添加规则
            </span>
          </span> -->
        </template>
      </el-table-column>
      <el-table-column label="策略规则" width="100" align="center">
        <span slot-scope="{row}" class="table-handle-btns">
          <span class="handle-btn primary" @click="setRegion(row)">
            配置
          </span>
        </span>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="{row}">
          <!-- <span class="table-handle-btns">
            <span class="handle-btn warn" @click="openEdit(row)">
              编辑
            </span>
          </span> -->
          <span class="table-handle-btns">
            <span class="handle-btn danger" @click="openRemove(row)">
              删除
            </span>
          </span>
        </template>
      </el-table-column>
    </el-table>
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
    <!-- <set-table-cols
      v-model="setColsVisible"
      @confirm="setTableColsOk"
      :url="url"
    >
    </set-table-cols> -->
    <!-- <handle-dialog
      ref="handleDialog"
      :edit="isEdit"
      @close="dialogClose"
      v-model="dialogVisible"
      @submit-ok="submitOk"
    ></handle-dialog>
    <rule-dialog
      ref="ruleDialog"
      v-model="ruleDialogVisible"
      :row="cRow"
      :edit="isEdit"
      @close="ruleDialogClose"
      @submit-ok="ruleSubmitOk"
    >
    </rule-dialog> -->
    <!-- <table-config
      v-model="tableConfigShow"
      :url="url"
      @save-ok="tableConfigSaveOk"
    >
    </table-config> -->
    <!-- <choose-strategy
      v-model="chooseVisible"
      @confirm="chooseConfirm"
      mode="partner"
    ></choose-strategy> -->
    <strategy-dialog
      v-model="strategyVisible"
      @submit-ok="submitOk"
    ></strategy-dialog>
    <choose-regions
      v-model="regionVisible"
      :row="cRow"
      @confirm="chooseRegionConfirm"
    ></choose-regions>
    <choose-product
      v-model="productVisible"
      :row="cRow"
      :request-all="fetchAllProduct"
      :request-use="fetchUseProduct"
      @confirm="confirmProduct"
    ></choose-product>
  </el-card>
</template>

<script>
import baseMinix from '@/utils/baseMinix'
// import SetTableCols from '@/components/SetTableCols'
// import TableConfig from '@/components/TableConfig'
// import HandleDialog from './handleDialog'
// import RuleDialog from './ruleDialog'
import Rule from '@/views/technician/Price/Strategy/rule'
// import ChooseStrategy from '@/views/technician/Price/Strategy/choose'
import StrategyDialog from './strategyDialog'
import ChooseRegions from './chooseRegion'
import ChooseProduct from '../../Group/chooseProduct'
import {
  GetTpCustomPriceGroupStrategy,
  deleteTpCustomPriceGroupStrategy,
  saveTpCustomGroupStrategyRegion
} from '@/api/price'
import {
  findCustomAllProduct,
  findCustomUsedProdcut,
  saveCustomProductRule
} from '@/api/product'
export default {
  mixins: [baseMinix],
  components: {
    // SetTableCols,
    // HandleDialog,
    // TableConfig,
    // RuleDialog,
    Rule,
    // ChooseStrategy,
    ChooseRegions,
    StrategyDialog,
    ChooseProduct
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
        strategyName: ''
      },
      tableConfigShow: false,
      ruleDialogVisible: false,
      strategyVisible: false,
      regionVisible: false,
      productVisible: false
    }
  },
  computed: {
    partnerId () {
      return this.$route.query.pId
    },
    groupId () {
      return this.$route.query.groupId
    },
    groupMode () {
      return this.$route.query.mode
    }
  },
  methods: {
    fetchList () {
      const {
        pId,
        groupId
      } = this.$route.query
      let params = {
        page: this.page,
        priceGroupId: groupId,
        partnerId: pId
      }
      for (let k in this.searchForm) {
        if (this.searchForm[k] !== '') {
          params[k] = this.searchForm[k]
        }
      }
      this.dtaLoading = true
      GetTpCustomPriceGroupStrategy(params)
        .then(res => {
          this.dataLoading = false
          this.dataList = res.result.list || []
          this.total = res.result.total || 0
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
      this.isEdit = true
      this.dialogVisible = true
      this.$refs.handleDialog.handleEdit(row)
    },
    openRemove (row) {
      const {
        priceStrategy,
        id
      } = row
      var h = this.$createElement
      var toastMessage = h(
        'div',
        {},
        [
          `删除策略--${priceStrategy.strategyName}--`,
          h(
            'span',
            {
              style: {
                color: '#F00',
                fontWeight: '700'
              }
            },
            '将删除所有已定义的规则'
          ),
          '，您确定嘛？'
        ]
      )
      this.$confirm(toastMessage, '系统提示', {})
        .then(() => {
          deleteTpCustomPriceGroupStrategy(id)
            .then(() => {
              this.$notify({
                title: '系统提示',
                message: '删除成功!',
                type: 'success'
              })
              this.fetchList()
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {})
    },
    dialogClose () {
      this.isEdit = false
    },
    // submitOk () {
    //   this.dialogVisible = false
    //   this.fetchList()
    // },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.fetchList()
    },
    tableConfigSaveOk () {},
    openRuleAdd (row) {
      this.cRow = {...row}
      this.ruleDialogVisible = true
    },
    ruleDialogClose () {
      this.isEdit = false
    },
    ruleSubmitOk () {
      this.ruleDialogVisible = false
      this.fetchList()
    },
    openRuleEdit (item, row) {
      this.isEdit = true
      this.cRow = {...row}
      this.ruleDialogVisible = true
      this.$refs.ruleDialog.handleEdit(item, row)
    },
    openRemoveRule (data, row) {
      const {
        id,
        money
      } = data
      const {
        strategyName
      } = row
      this.$confirm(`您确定删除--${strategyName}的${money}--规则嘛？`, '系统提示', {})
        .then(() => {
          deleteTpCustomPriceGroupStrategy(id)
            .then(res => {
              this.$notify({
                title: '系统提示',
                message: '删除成功!',
                type: 'success'
              })
              this.fetchList()
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {})
    },
    chooseConfirm (row) {
      // const {
      //   groupId
      // } = this.$route.query
      // const {
      //   id
      // } = row
      // let params = {
      //   strategyId: id,
      //   priceGroupId: groupId
      // }
      // addPriceGroupStrategy(params)
      //   .then(res => {
      //   })
      //   .catch(err => {
      //     this.$message.error(err.message)
      //   })
    },
    setRegion (row) {
      this.cRow = {...row}
      switch (Number.parseInt(this.groupMode)) {
        case 1:
          this.regionVisible = true
          break
        case 2:
          this.productVisible = true
          break
      }
    },
    chooseRegionConfirm (data, done) {
      const {
        halfs,
        checkes
      } = data
      let params = {
        groupStrategyId: this.cRow.id,
        priceGroupId: this.cRow.priceGroupId,
        rules: halfs.concat(checkes).map(x => ({regionCode: x.id}))
      }
      saveTpCustomGroupStrategyRegion(params)
        .then(res => {
          this.$notify({
            title: '系统提示',
            message: '地区规则保存成功',
            type: 'success'
          })
          done()
          this.regionVisible = false
        })
        .catch(err => {
          done()
          this.$message.error(err.message)
        })
    },
    submitOk () {
      this.strategyVisible = false
      this.fetchList()
    },
    backGroup () {
      this.$router.push({
        path: '/partner/price/custom/group',
        query: {
          pId: this.$route.query.pId
        }
      })
    },
    fetchAllProduct (reslove) {
      const {
        priceGroupId,
        id
      } = this.cRow
      let params = {
        groupStrategyId: id,
        priceGroupId: priceGroupId,
        partnerId: this.partnerId
      }
      findCustomAllProduct(params)
        .then(res => {
          const list = res.result || []
          reslove(list)
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    fetchUseProduct (reslove) {
      const {
        priceGroupId,
        id
      } = this.cRow
      let params = {
        groupStrategyId: id,
        priceGroupId: priceGroupId,
        partnerId: this.partnerId
      }
      findCustomUsedProdcut(params)
        .then(res => {
          const list = res.result || []
          reslove(list)
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    confirmProduct (data, done) {
      const {
        priceGroupId,
        id
      } = this.cRow
      let params = {
        ...data,
        groupStrategyId: id,
        priceGroupId: priceGroupId,
        partnerId: this.partnerId
      }
      saveCustomProductRule(params)
        .then(res => {
          this.$notify({
            title: '系统提示',
            message: '配置成功!',
            type: 'success'
          })
          this.fetchList()
          this.productVisible = false
          done()
        })
        .catch(err => {
          done()
          this.$message.error(err.message)
        })
    }
  },
  created () {
    this.fetchList()
  }
}
</script>
