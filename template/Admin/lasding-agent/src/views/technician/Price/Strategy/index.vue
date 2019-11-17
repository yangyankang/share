<template>
  <el-card shadow="never">
    <el-form
      label-width="90px"
      ref="searchForm"
      class="search-form"
      :model="searchForm"
      inline
      @submit.native.prevent
    >
      <el-form-item label="策略名称：" prop="strategyName">
        <el-input
          size="small"
          clearable
          v-model="searchForm.strategyName"
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
    <el-table
      :data="dataList"
      v-loading="dataLoading"
    >
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column label="策略名称" prop="strategyName" width="200"></el-table-column>
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
      <el-table-column label="操作" width="60" align="center">
        <template slot-scope="{row}">
          <span class="table-handle-btns">
            <span class="handle-btn warn" @click="openEdit(row)">
              编辑
            </span>
          </span>
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
    </rule-dialog>
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
import TableConfig from '@/components/TableConfig'
import HandleDialog from './handleDialog'
import RuleDialog from './ruleDialog'
import Rule from './rule'
import {
  GetPriceStrategy,
  deleteStrategy,
  deleteStrategyRule
} from '@/api/price'
export default {
  mixins: [baseMinix],
  components: {
    SetTableCols,
    HandleDialog,
    TableConfig,
    RuleDialog,
    Rule
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
      ruleDialogVisible: false
    }
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
      this.dtaLoading = true
      GetPriceStrategy(params)
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
    dialogClose () {
      this.isEdit = false
    },
    submitOk () {
      this.dialogVisible = false
      this.fetchList()
    },
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
        priceTypeName
      } = data
      const {
        strategyName
      } = row
      this.$confirm(`您确定删除--${strategyName}的${priceTypeName}--规则嘛？`, '系统提示', {})
        .then(() => {
          deleteStrategyRule(id)
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
    }
  },
  created () {
    this.fetchList()
  }
}
</script>
