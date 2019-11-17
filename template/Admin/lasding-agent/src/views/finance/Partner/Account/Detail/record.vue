<template>
  <div>
    <div style="position: relative;">
      <el-table
        border
        :data="dataList"
      >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column label="流水编号" prop="recordNo" show-overflow-tooltip></el-table-column>
        <el-table-column label="工单编号" prop="workorderId" width="90" align="center"></el-table-column>
        <el-table-column label="流水类型" prop="recordTypeDictText" width="100" align="center"></el-table-column>
        <el-table-column label="支付账户名" prop="payAccountName"></el-table-column>
        <el-table-column label="支付方式" prop="payAccountTypeDictText" width="100" align="center"></el-table-column>
        <el-table-column label="实际金额" prop="actualMoney" width="90" align="center"></el-table-column>
        <el-table-column label="优惠金额" prop="couponMoney" width="90" align="center"></el-table-column>
        <el-table-column label="当前余额" prop="currentBalanceMoney" width="90" align="center"></el-table-column>
        <el-table-column label="收款账户名" prop="recAccountName"></el-table-column>
        <el-table-column label="备注信息" prop="remark" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="crtTime" width="140" align="center"></el-table-column>
        <el-table-column label="收/支" prop="billType" width="80" align="center"></el-table-column>
        <el-table-column label="订单状态" prop="recordStatusDictText" width="100" align="center"></el-table-column>
      </el-table>
    </div>
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
  </div>
</template>

<script>
import { findRecordList } from '@/api/partner'
export default {
  props: {
    detail: {
      type: Object,
      default () {
        return {}
      }
    },
    isOwn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      dataList: []
    }
  },
  methods: {
    fetchList () {
      let params = {
        page: this.page,
        partnerId: this.detail.partnerId
      }
      findRecordList(params)
        .then(res => {
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

<style lang="scss" scoped>
.tab-right-btns{
  position: absolute;
  right: 0;
}
</style>
