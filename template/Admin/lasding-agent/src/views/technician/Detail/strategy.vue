<template>
  <div>
    <div>
      <div style="text-align: right;">
        <el-button
          size="small"
          type="primary"
          @click="strategyVisible = true"
        >新增</el-button>
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
          {{(row.categoryIdDictText || '暂无') + '-' + (row.subcategoryIdDictText || '暂无')}}
        </template>
      </el-table-column>
      <el-table-column label="策略类型" width="110" prop="strategyTypeDictText"></el-table-column>
      <el-table-column label="安装难度" width="90" prop="fixLevelDictText"></el-table-column>
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
            <span class="handle-btn primary" @click="openRuleAdd(row)">
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
          </template>
          <span class="handle-btn danger" @click="openRemove(row)">
              删除
            </span>
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
      :row="detail"
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
  </div>
</template>

<script>
import Rule from '@/views/technician/Price/Strategy/rule'
import baseMixin from '@/utils/baseMinix'
import { GetCustomStrategy, deleteStrategy } from '@/api/technician'
import HandleStrategy from '@/views/technician/List/handleStrategy'
import RuleDialog from '@/views/technician/List/ruleDialog'
export default {
  mixins: [baseMixin],
  components: {
    Rule,
    HandleStrategy,
    RuleDialog
  },
  props: {
    isOwn: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      url: {},
      strategyVisible: false,
      cRow: {},
      ruleDialogVisible: false
    }
  },
  methods: {
    fetchList () {
      let params = {
        page: this.page,
        technicianId: this.detail.id
      }
      this.dataLoading = true
      GetCustomStrategy(params)
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
    openRuleAdd (row) {
      this.cRow = {...row}
      this.ruleDialogVisible = true
    },
    ruleDialogClose () {
      this.isEdit = false
    },
    strategySubmitOk () {
      this.strategyVisible = false
      this.fetchList()
    },
    ruleSubmitOk () {
      this.ruleDialogVisible = false
      this.fetchList()
    },
    openEdit (row) {
      this.isEdit = true
      this.strategyVisible = true
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
    }
  },
  watch: {
    isOwn (val) {
      if (val) {
        this.fetchList()
      }
    }
  }
}
</script>

<style>

</style>
