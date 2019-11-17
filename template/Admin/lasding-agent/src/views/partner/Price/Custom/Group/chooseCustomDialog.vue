<template>
  <el-dialog
    title="选择自定义策略"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-table
      :data="dataList"
      height="500px"
      v-loading="dataLoading"
      highlight-current-row
      @row-click="rowClick"
      @row-dblclick="confirm"
    >
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column label="策略名称" prop="strategyName" width="200"></el-table-column>
      <el-table-column label="产品分类" width="150">
        <template slot-scope="{row}">
          {{row.categoryIdDictText + '-' + row.subcategoryIdDictText}}
        </template>
      </el-table-column>
      <el-table-column label="规则" min-width="500">
        <template slot-scope="{row}">
          <rule
            v-for="item in row.ruleList"
            :key="item.id"
            :data="item"
            :show-handle="false"
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
import { GetTPCustomStrategy } from '@/api/price'
import Rule from '@/views/technician/Price/Strategy/rule'
export default {
  mixins: [dialogMinix],
  components: {
    Rule
  },
  data () {
    return {
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 1,
      dataLoading: false,
      dataList: [],
      cRow: {}
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
    }
  },
  methods: {
    // submitForm () {
    //   this.$refs.form.validate(valid => {
    //     if (valid) {
    //     }
    //   })
    // },
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
      // if (this.editMiddle) {
      //   this.form = {...this.editMiddle}
      // } else {
      //   this.$refs.form.resetFields()
      // }
      // this.$refs.form.clearValidate()
      this.$emit('close')
    },
    fetchList () {
      let params = {
        page: this.page,
        partnerId: this.$route.pId
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
    rowClick (row) {
      this.cRow = {...row}
    },
    confirm () {
      this.$emit('confirm', this.cRow)
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
