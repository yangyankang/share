<template>
  <el-card shadow="never">
    <el-form
      label-width="90px"
      ref="searchForm"
      class="search-form"
      inline
      :model="searchForm"
      @submit.native.prevent
    >
      <el-form-item>
        <el-input
          size="small"
          placeholder="请输入商家名称"
          v-model.trim="searchForm.partnerName"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          @click="fetchList"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <div class="header-btns-wrapper">
      <div class="fr">
        <!-- <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="dialogVisible = true"
        >
          新增
        </el-button> -->
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
    <list-table
      :data="dataList"
      :show-columns="showCols"
      @sort-change="sortChange"
      v-loading="dataLoading"
    >
      <el-table-column label="操作">
        <span class="table-handle-btns" slot-scope="{row}">
          <a
           :href="'/finance/partner/account/detail?pId=' + row.partnerId"
            class="handle-btn primary"
            target="_blank"
          >
            详情
          </a>
          <span class="handle-btn success" @click="openRecharge(row)">
            充值
          </span>
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
    <!-- <handle-dialog
      ref="handleDialog"
      :edit="isEdit"
      @close="dialogClose"
      v-model="dialogVisible"
      @submit-ok="submitOk"
    ></handle-dialog> -->
    <table-config
      v-model="tableConfigShow"
      :url="url"
      @save-ok="tableConfigSaveOk"
    >
    </table-config>
    <recharge
      v-model="rechargeVisible"
      @confirm="rechargeConfirm"
    ></recharge>
    <el-dialog
      :visible.sync="qrVisible"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
    >
      <div style="width: 200px; margin: 0 auto;">
        <qr-code
          :value="qrcodeValue"
          :size="200"
        ></qr-code>
      </div>
      <p style="text-align: center;">使用微信扫码付款</p>
      <span slot="footer">
        <el-button
          size="small"
          @click="qrVisible = false"
        >取消</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import baseMinix from '@/utils/baseMinix'
import SetTableCols from '@/components/SetTableCols'
import ListTable from '@/components/ListTable'
import TableConfig from '@/components/TableConfig'
// import HandleDialog from './handleDialog'
import Recharge from './recharge'
import QrCode from 'qrcode.vue'
import {
  financeAccounts,
  partnerAccountRecharge
} from '@/api/partner'
export default {
  mixins: [baseMinix],
  components: {
    ListTable,
    SetTableCols,
    Recharge,
    // HandleDialog,
    TableConfig,
    QrCode
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
      setColsVisible: false,
      url: {
        config: '/partner/account'
      },
      searchForm: {
        partnerName: ''
      },
      tableConfigShow: false,
      rechargeVisible: false,
      qrcodeValue: '',
      qrVisible: false
    }
  },
  methods: {
    fetchList () {
      let params = {
        page: this.page
      }
      this.dataLoading = true
      financeAccounts(params)
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
      this.fetchList()
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.fetchList()
    },
    tableConfigSaveOk () {},
    openRecharge (row) {
      this.cRow = {...row}
      this.rechargeVisible = true
    },
    rechargeConfirm (data, done) {
      let params = {
        ...data,
        partnerId: this.cRow.partnerId
      }
      partnerAccountRecharge(params)
        .then(res => {
          const sign = res.result.sign
          switch (data.payAccountType) {
            case 2:
              var oDiv = document.createElement('div')
              oDiv.innerHTML = sign
              document.body.appendChild(oDiv)
              oDiv.querySelector('form').submit()
              break
            case 3:
              const {
                codeUrl
              } = JSON.parse(sign)
              this.qrcodeValue = codeUrl
              this.qrVisible = true
              break
          }
          done()
        })
        .catch(err => {
          done()
          this.$message.error(err.message)
        })
    },
    GoDetail (row) {
      this.$router.push({
        path: '/finance/partner/account/detail',
        query: {
          pId: row.partnerId
        }
      })
    }
  },
  created () {
    this.fetchList()
  }
}
</script>

<style>

</style>
