<template>
  <el-card shadow="never">
    <el-form
      label-width="90px"
      ref="searchForm"
      class="search-form"
      :model="searchForm"
    >
      <el-row>
        <el-col :xl="4" :lg="6" :md="8" :sm="12">
          <el-form-item label="平台名称" prop="name">
            <el-input size="small" placeholder="请输入平台名称" v-model="searchForm.name"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :xl="4" :lg="6" :md="8" :sm="12">
          <el-form-item label="机构类型" prop="type">
            <el-radio-group size="small" v-model="searchForm.type">
              <el-radio-button :label="1">
                平台
              </el-radio-button>
              <el-radio-button :label="0">
                服务商
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col> -->
        <el-col :xl="6" :lg="8" :md="8" :sm="12">
          <el-form-item label="签约时间">
            <el-row>
              <el-col :span="11">
                <el-form-item prop="validTime">
                  <el-date-picker
                    placeholder="开始时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    size="small"
                    style="width: 100%;"
                    v-model="searchForm.validTime"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item style="text-align: center;">
                  ~
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item prop="invalidTime">
                  <el-date-picker
                    placeholder="开始时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    size="small"
                    style="width: 100%;"
                    v-model="searchForm.invalidTime"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="4" :md="8" :sm="12">
          <el-form-item label-width="10px">
            <el-button size="small" type="primary" @click="fetchList">
              查询
            </el-button>
            <el-button size="small" type="primary" @click="resetSearch">
              重置
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
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
    <list-table
      :data="dataList"
      :show-columns="showCols"
      @sort-change="sortChange"
      v-loading="dataLoading"
    >
      <el-table-column label="操作">
        <span class="table-handle-btns" slot-scope="{row}">
          <span class="handle-btn warn" @click="openEdit(row)">
            编辑
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
    <handle-dialog
      ref="handleDialog"
      :edit="isEdit"
      @close="dialogClose"
      v-model="dialogVisible"
      @submit-ok="submitOk"
    ></handle-dialog>
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
import ListTable from '@/components/ListTable'
import TableConfig from '@/components/TableConfig'
import HandleDialog from './handleDialog'
import { findPlatform } from '@/api/platform'
export default {
  mixins: [baseMinix],
  components: {
    ListTable,
    SetTableCols,
    HandleDialog,
    TableConfig
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
        config: '/sys/agent'
      },
      searchForm: {
        name: '',
        validTime: '',
        invalidTime: ''
      },
      tableConfigShow: false
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
      this.dataLoading = true
      findPlatform(params)
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
      this.$refs.handleDialog.handleEdit(row)
      this.isEdit = true
      this.dialogVisible = true
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
    tableConfigSaveOk () {}
  },
  created () {
    this.fetchList()
  }
}
</script>

<style>

</style>
