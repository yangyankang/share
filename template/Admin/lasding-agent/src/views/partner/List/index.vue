<template>
  <el-card shadow="never">
    <el-form
      label-width="90px"
      ref="searchForm"
      class="search-form"
      :model="searchForm"
      inline
    >
      <el-form-item label="商家名称：">
        <el-input
          size="small"
          placeholder="请输入商家名称"
          v-model.trim="searchForm.partnerName"
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
          @click="updateVisible = true"
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
      @sort-change="sortChange"
      v-loading="dataLoading"
      header-row-class-name="table-header-style"
      header-cell-class-name="table-header-cell-style"
      row-key="partnerCode"
      border
      lazy
      :load="lazyLoad"
      :tree-props="{hasChildren: 'partnerId'}"
    >
      <el-table-column type="index" align="center"></el-table-column>
      <template v-if="showCols.length > 0">
        <el-table-column
          v-for="item in showCols"
          :key="item.field"
          :prop="item.field"
          :label="item.fieldName"
          :width="item.fieldWidth ? item.fieldWidth : ''"
          :align="item.fieldAlign"
          :sortable="item.fieldSort ? true : false"
          show-overflow-tooltip
        ></el-table-column>
      </template>
      <el-table-column v-else></el-table-column>
      <el-table-column label="操作" width="auto" show-overflow-tooltip align="center">
        <span slot-scope="{row}" class="table-handle-btns">
          <a
            class="handle-btn primary"
            :href="'/partner/detail?pId=' + row.partnerId"
            target="_blank"
          >
            详情
          </a>
          <span class="handle-btn warn" @click="openEditPayType(row)">
            结算模式
          </span>
          <span class="handle-btn primary" @click="openStrategy(row)">
            策略
          </span>
          <span class="handle-btn primary" @click="openPriceGroup(row)">
            价格组
          </span>
          <span class="handle-btn primary" @click="openProduct(row)">
            产品
          </span>
          <span class="handle-btn warn" @click="openEdit(row)">
            编辑
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
    <strategy-dialog
      v-model="strategyVisible"
      :partner="cRow"
    ></strategy-dialog>
    <add-dialog
      v-model="addVisible"
      @confirm="addSubmit"
    ></add-dialog>
    <update-dialog
      v-model="updateVisible"
      @confirm="addSubmit"
      @close="updateClose"
      :edit="isEdit"
      ref="handleDialog"
    ></update-dialog>
    <edit-pay-type
      v-model="payTypeVisible"
      :detail="cRow"
      @confirm="submitEditPayType"
    >
    </edit-pay-type>
  </el-card>
</template>

<script>
import baseMinix from '@/utils/baseMinix'
import SetTableCols from '@/components/SetTableCols'
import ListTable from '@/components/ListTable'
import TableConfig from '@/components/TableConfig'
import AddDialog from './addDialog'
import UpdateDialog from './updateDialog'
import EditPayType from './editPayType'
// import HandleDialog from './handleDialog'
import {
  fetchPartners,
  createPartner,
  updatePartner,
  findDetail,
  updatePayType
} from '@/api/partner'
import StrategyDialog from './strategyDialog'
export default {
  mixins: [baseMinix],
  components: {
    ListTable,
    SetTableCols,
    // HandleDialog,
    TableConfig,
    StrategyDialog,
    AddDialog,
    UpdateDialog,
    EditPayType
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
        config: '/tp/partner',
        partnerName: ''
      },
      searchForm: {},
      tableConfigShow: false,
      strategyVisible: false,
      addVisible: false,
      updateVisible: false,
      payTypeVisible: false
    }
  },
  methods: {
    fetchList () {
      let params = {
        page: this.page
      }
      for (let k in this.searchForm) {
        if (params[k] !== '') {
          params[k] = this.searchForm[k]
        }
      }
      this.dataLoading = true
      fetchPartners(params)
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
    sortChange () {},
    openEdit (row) {
      this.isEdit = true
      // this.$refs.handleDialog.handleEdit(row)
      this.updateVisible = true
      findDetail(row.partnerId)
        .then(res => {
          this.$refs.handleDialog.handleEdit(res.result || {})
        })
        .catch(err => {
          this.$message.error(err.message)
        })
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
    addSubmit (data, done) {
      // this.fetchList()
      if (this.isEdit) {
        updatePartner(data)
          .then(res => {
            this.$notify({
              title: '系统提示',
              message: '修改商家信息成功！',
              type: 'success'
            })
            done()
            this.fetchList()
            this.updateVisible = false
          })
          .catch(err => {
            done()
            this.$message.error(err.message)
          })
        return
      }
      createPartner(data)
        .then(res => {
          this.$notify({
            title: '系统提示',
            message: '新增商家成功！',
            type: 'success'
          })
          done()
          this.fetchList()
          this.updateVisible = false
        })
        .catch(err => {
          done()
          this.$message.error(err.message)
        })
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.fetchList()
    },
    tableConfigSaveOk () {},
    lazyLoad () {
    },
    openStrategy (row) {
      this.cRow = {...row}
      this.strategyVisible = true
    },
    openPriceGroup (row) {
      this.$router.push({
        path: '/partner/price/custom/group',
        query: {
          pId: row.partnerId
        }
      })
    },
    openProduct (row) {
      this.$router.push({
        path: '/partner/product/own',
        query: {
          pId: row.partnerId
        }
      })
    },
    updateClose () {
      this.isEdit = false
    },
    GoDetail (row) {
      this.$router.push({
        path: '/partner/detail',
        query: {
          pId: row.partnerId
        }
      })
    },
    openEditPayType (row) {
      this.cRow = {...row}
      this.payTypeVisible = true
    },
    submitEditPayType (data, done) {
      let params = {
        ...data,
        partnerId: this.cRow.partnerId,
        agentId: this.cRow.agentId
      }
      updatePayType(params)
        .then(res => {
          this.$notify({
            title: '系统提示',
            message: '结算模式调整成功',
            type: 'success'
          })
          done()
          this.fetchList()
          this.payTypeVisible = false
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
