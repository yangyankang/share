<template>
  <el-dialog
    title="技师自定策略"
    width="900px"
    :visible.sync="model"
    top="8vh"
    :close-on-click-modal="false"
  >
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
      </div>
    </div>
    <el-table
      :data="dataList"
      height="500px"
      v-loading="dataLoading"
      border
    >
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column label="策略名称" prop="strategyName" width="200"></el-table-column>
      <el-table-column label="产品分类" width="150">
        <template slot-scope="{row}">
          {{row.categoryIdDictText + '-' + row.subcategoryIdDictText}}
        </template>
      </el-table-column>
      <el-table-column label="策略类型" width="110" prop="strategyTypeDictText"></el-table-column>
      <el-table-column label="规则" min-width="500">
        <template slot-scope="{row}">
          <rule
            v-for="item in row.ruleList"
            :key="item.id"
            :data="item"
            :show-handle="row.strategyType === 1"
            @edit-click="(data) => openRuleEdit(data, row)"
            @remove-click="(data) => openRemoveRule(data, row)"
          ></rule>
          <span class="table-handle-btns">
            <span class="handle-btn primary" @click="openRuleAdd(row)"
            style="white-space: nowrap;">
              添加
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60" align="center" fixed="right">
        <span slot-scope="{row}" class="table-handle-btns">
          <template v-if="row.strategyType === 1">
            <span class="handle-btn warn" @click="openEdit(row)">
              编辑
            </span>
            <span class="handle-btn danger" @click="openRemove(row)">
              删除
            </span>
          </template>
        </span>
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
    <handle-strategy
      v-model="strategyVisible"
      :row="partner"
      :edit="isEdit"
      ref="handleDialog"
      @close="ruleDialogClose"
      @submit-ok="strategySubmitOk"
    ></handle-strategy>
    <rule-dialog
      ref="ruleDialog"
      v-model="ruleDialogVisible"
      :row="cRow"
      :edit="isEdit"
      @close="ruleDialogClose"
      @submit-ok="ruleSubmitOk"
    >
    </rule-dialog>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import { GetTPCustomStrategy, deleteStrategy, deleteTPCustomStrategyRule } from '@/api/price'
import HandleStrategy from './handleStrategy'
import Rule from '@/views/technician/Price/Strategy/rule'
import RuleDialog from './ruleDialog'
export default {
  mixins: [dialogMinix],
  components: {
    HandleStrategy,
    Rule,
    RuleDialog
  },
  props: {
    partner: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      dataList: [],
      dataLoading: false,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      strategyVisible: false,
      isEdit: false,
      ruleDialogVisible: false,
      cRow: {}
    }
  },
  methods: {
    fetchList () {
      let params = {
        page: this.page,
        partnerId: this.partner.partnerId
      }
      this.dataLoading = true
      GetTPCustomStrategy(params)
        .then(res => {
          this.dataList = res.result.list || []
          this.total = res.result.total || 0
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
    openEdit (row) {
      this.isEdit = true
      this.strategyVisible = true
      this.$refs.handleDialog.handleEdit(row)
    },
    strategySubmitOk () {
      this.strategyVisible = false
      this.fetchList()
    },
    ruleDialogClose () {
      this.isEdit = false
    },
    openRemove (row) {
      const {
        strategyName,
        id
      } = row
      this.$confirm(`您确定删除--${strategyName}--策略嘛？`, '系统提示', {})
        .then(() => {
          deleteStrategy(id)
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
    ruleSubmitOk () {
      this.ruleDialogVisible = false
      this.fetchList()
    },
    openRuleAdd (row) {
      this.cRow = {...row}
      this.ruleDialogVisible = true
    },
    openRemoveRule (data, row) {
      const {
        id,
        priceTypeName
      } = data
      const {
        strategyName
      } = row
      this.$confirm(`您确定删除--${strategyName}的${priceTypeName}--规则嘛？`, '系统提示', {})
        .then(() => {
          deleteTPCustomStrategyRule(id)
            .then(res => {
              this.$notify({
                title: '系统提示',
                message: '规则删除成功!',
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
    openRuleEdit (item, row) {
      this.isEdit = true
      this.cRow = {...row}
      this.ruleDialogVisible = true
      this.$refs.ruleDialog.handleEdit(item, row)
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.fetchList()
      }
    },
    'partner.partnerId': {
      handler () {
        this.page.pageSize = 10
        this.page.pageNum = 1
        this.total = 0
      },
      deep: true
    }
  }
}
</script>

<style>

</style>
