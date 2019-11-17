<template>
  <el-card shadow="never">
    <div class="header-btns-wrapper">
      <div class="fr">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="createTechAccount"
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
    <el-tabs v-model="tabActive">
      <el-form
        label-width="90px"
        ref="search1"
        :model="search1"
      >
        <el-row>
          <el-col :xl="4" :lg="6" :md="8" :sm="12">
            <el-form-item label="技师信息" prop="name">
              <el-input
                size="small"
                placeholder="技师信息"
                v-model="search1.content"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="4" :lg="6" :md="12" :sm="24">
            <el-form-item label="省/市/区" prop="regionCodes">
              <el-cascader
                size="small"
                :options="regions"
                :props="{
                  checkStrictly: true,
                  label: 'regionName',
                  value: 'id',
                  expandTrigger: 'hover'
                }"
                v-model="search1.regionCodes"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :xl="2" :lg="4" :md="6" :sm="12">
            <el-form-item label-width="10px">
              <el-button
                size="small"
                type="primary"
                @click="fetchList1"
              >查询</el-button>
              <el-button
                size="small"
                type="primary"
                @click="resetSearch"
              >重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-tab-pane label="所属" name="1">
        <list-table
          :data="dataList1"
          :show-columns="showCols"
          @sort-change="sortChange"
          v-loading="dataLoading"
        >
          <el-table-column width="120" label="操作" align="center" prop="handle">
            <span class="table-handle-btns" slot-scope="{row}">
              <!-- <span class="handle-btn primary" @click="openStrategy(row)">
                策略
              </span> -->
              <span class="handle-btn success" @click="GoDetail(row)">
                详情
              </span>
              <span class="handle-btn warn" @click="openEdit(row)">
                更新
              </span>
            </span>
          </el-table-column>
        </list-table>
        <div class="pages-wrapper">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total1"
            :page-size="page1.pageSize"
            :current-page="page1.pageNum"
            @size-change="sizeChange1"
            @current-change="currentChange1"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已雇佣" name="2">
        <list-table
          :data="dataList2"
          :show-columns="showCols"
          @sort-change="sortChange"
          v-loading="dataLoading"
        >
        </list-table>
        <div class="pages-wrapper">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total2"
            :page-size="page2.pageSize"
            :current-page="page2.pageNum"
            @size-change="sizeChange2"
            @current-change="currentChange2"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="可雇佣" name="3"></el-tab-pane>
    </el-tabs>
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
    <strategy-dialog
      v-model="strategyVisible"
      :tech="cRow"
    ></strategy-dialog>
    <handle-dialog
      ref="handleDialog"
      :edit="isEdit"
      @close="dialogClose"
      v-model="dialogVisible"
      @confirm="confirmSubmit"
    ></handle-dialog>
  </el-card>
</template>

<script>
import baseMinix from '@/utils/baseMinix'
import SetTableCols from '@/components/SetTableCols'
import ListTable from '@/components/ListTable'
import TableConfig from '@/components/TableConfig'
import StrategyDialog from './strategyDialog'
import { findTech, findHiredTech, createTech, updateTech } from '@/api/technician'
import { GetRegions } from '@/api/system'
import HandleDialog from './handleDialog'
export default {
  mixins: [baseMinix],
  components: {
    ListTable,
    SetTableCols,
    TableConfig,
    StrategyDialog,
    HandleDialog
  },
  data () {
    return {
      page1: {
        pageSize: 10,
        pageNum: 1
      },
      total1: 0,
      dataList1: [],
      search1: {
        content: '',
        regionCodes: []
      },
      page2: {
        pageSize: 10,
        pageNum: 1
      },
      total2: 0,
      dataList2: [],
      search2: {},
      page3: {
        pageSize: 10,
        pageNum: 1
      },
      total3: 0,
      dataList3: [],
      search3: {},
      cRow: {},
      dialogVisible: false,
      setColsVisible: false,
      url: {
        config: '/technician'
      },
      tableConfigShow: false,
      tabActive: '1',
      regions: [],
      strategyVisible: false
    }
  },
  methods: {
    fetchList1 () {
      let params = {
        page: this.page1
      }
      for (let k in this.search1) {
        if (k === 'regionCodes' && this.search1[k].length > 0) {
          let [province, city, district] = this.search1[k]
          params.province = province
          params.city = city
          params.district = district
        } else if (this.search1[k] !== '') {
          params[k] = this.search1[k]
        }
      }
      this.dataLoading = true
      findTech(params)
        .then(res => {
          this.dataList1 = res.result.list || []
          this.total1 = res.result.total || 0
          this.dataLoading = false
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    fetchList2 () {
      let params = {
        page: this.page2
      }
      this.dataLoading = true
      findHiredTech(params)
        .then(res => {
          this.dataList2 = res.result.list || []
          this.total2 = res.result.total || 0
          this.dataLoading = false
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    currentChange1 (num) {
      this.page1.pageNum = num
      this.fetchList1()
    },
    sizeChange1 (size) {
      this.page1.pageSize = size
      this.fetchList1()
    },
    currentChange2 (num) {
      this.page2.pageNum = num
      this.fetchList1()
    },
    sizeChange2 (size) {
      this.page2.pageSize = size
      this.fetchList1()
    },
    currentChange3 (num) {
      this.page3.pageNum = num
      this.fetchList1()
    },
    sizeChange3 (size) {
      this.page3.pageSize = size
      this.fetchList1()
    },
    sortChange () {
    },
    tableConfigSaveOk () {},
    fetchRegions () {
      GetRegions(3)
        .then(res => {
          this.regions = res.result || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    openStrategy (row) {
      this.cRow = {...row}
      this.strategyVisible = true
    },
    GoDetail (row) {
      this.$router.push({
        path: '/technician/detail',
        query: {
          tId: row.id
        }
      })
    },
    resetSearch () {
      this.$refs.search1.resetFields()
      this.fetchList1()
    },
    createTechAccount () {
      this.$prompt('请输入手机号', '系统提示', {
        inputPattern: /^1[3-9]\d{9}$/,
        inputErrorMessage: '输入不正确'
      })
        .then(({value}) => {
          console.log(value)
          let params = {
            mobile: value
          }
          createTech(params)
            .then(res => {
              this.$notify({
                title: '系统提示',
                message: '创建成功!',
                type: 'success'
              })
              this.fetchList1()
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {})
    },
    openEdit (row) {
      this.isEdit = true
      this.$refs.handleDialog.handleEdit(row)
      this.dialogVisible = true
    },
    dialogClose () {
      this.isEdit = false
    },
    confirmSubmit (data, done) {
      let params = {
        ...data
      }
      updateTech(params)
        .then(res => {
          this.$notify({
            title: '系统提示',
            message: '技师信息修改成功',
            type: 'success'
          })
          done()
          this.fetchList1()
          this.dialogVisible = false
        })
        .catch(err => {
          done()
          this.$message.error(err.message)
        })
    }
  },
  watch: {
    'tabActive' (val) {
      switch (val) {
        case '1':
          this.fetchList1()
          break
        case '2':
          this.fetchList2()
          break
        case '3':
          break
      }
    }
  },
  created () {
    this.fetchList1()
    this.fetchRegions()
  }
}
</script>

<style>

</style>
