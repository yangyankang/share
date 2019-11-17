<template>
  <el-dialog
    title="选择策略"
    width="900px"
    append-to-body
    :visible.sync="model"
    :close-on-click-modal="false"
  >
    <el-table
      :data="dataList"
      v-loading="dataLoading"
      :highlight-current-row="!multiple"
      @row-click="rowClick"
      @row-dblclick="confirm"
    >
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column label="策略名称" prop="strategyName" width="200"></el-table-column>
      <el-table-column label="产品分类" prop="productClassification" width="150">
        <template slot-scope="{row}">
          {{row.categoryIdDictText + '-' + row.subcategoryIdDictText}}
        </template>
      </el-table-column>
      <el-table-column label="安装难度" prop="fixLevelDictText" width="80"></el-table-column>
      <el-table-column label="规则">
        <template slot-scope="{row}">
          <rule
            v-for="item in row.ruleList"
            :key="item.id"
            :data="item"
            :show-handle="false"
            @edit-click="(data) => openRuleEdit(data, row)"
            @remove-click="(data) => openRemoveRule(data, row)"
          ></rule>
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
    <span slot="footer">
      <el-button
        size="small"
        @click="$emit('change', false)"
      >取消</el-button>
      <el-button
        size="small"
        type="primary"
        @click="confirm"
      >确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { GetPriceStrategy, GetTPStrategy } from '@/api/price'
import Rule from './rule'
export default {
  components: {
    Rule
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'tech'
    }
  },
  model: {
    prop: 'visible',
    event: 'change'
  },
  data () {
    return {
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      dataList: [],
      dataLoading: false,
      cRow: null,
      searchForm: {}
    }
  },
  computed: {
    model: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('change', val)
      }
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
      if (this.mode === 'partner') {
        GetTPStrategy(params)
          .then(res => {
            this.dataLoading = false
            this.dataList = res.result.list || []
            this.total = res.result.total || 0
          })
          .catch(err => {
            this.$message.error(err.message)
          })
        return
      }
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
    rowClick (row) {
      this.cRow = {...row}
    },
    confirm () {
      if (this.cRow) {
        this.$emit('confirm', this.cRow)
      } else {
        this.$message({
          type: 'warning',
          message: '请选择策略'
        })
      }
    },
    setSearchData (data) {
      Object.assign(this.searchForm, data)
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.fetchList()
      }
    }
  }
}
</script>

<style>

</style>
