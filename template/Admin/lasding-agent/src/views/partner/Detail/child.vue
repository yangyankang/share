<template>
  <div>
    <el-form
      label-width="90px"
      inline
      :model="searchData"
      @submit.native.prevent
    >
      <el-form-item label="商家信息" prop="partnerName">
        <el-input
          size="small"
          clearable
          v-model="searchData.partnerName"
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
    <div style="text-align: right; margin-bottom: 10px;">
      <el-button
        size="small"
        type="primary"
        @click="handleVisible = true"
      >新增子商家</el-button>
    </div>
    <div>
      <list-table
        :data="dataList"
        :show-columns="showCols"
        v-loading="dataLoading"
      >
        <el-table-column label="操作" align="center" width="120">
          <span slot-scope="{row}" class="table-handle-btns">
            <a
              :href="'/partner/detail?pId=' + row.partnerId"
              class="handle-btn primary"
              target="_blank"
            >
              详情
            </a>
            <span class="handle-btn warn" @click="openEdit(row)">
              编辑
            </span>
          </span>
        </el-table-column>
      </list-table>
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
    <handle-dialog
      v-model="handleVisible"
      :edit="isEdit"
      @confirm="submitConfirm"
      @close="dialogClose"
      ref="handleDialog"
    ></handle-dialog>
  </div>
</template>

<script>
import baseMinix from '@/utils/baseMinix'
import {
  fetchPartners,
  createPartner,
  updatePartner,
  findDetail
} from '@/api/partner'
import ListTable from '@/components/ListTable'
import HandleDialog from '../List/updateDialog'
export default {
  mixins: [baseMinix],
  components: {
    ListTable,
    HandleDialog
  },
  props: {
    partnerId: [String, Number],
    isOwn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      url: {
        config: '/tp/partner'
      },
      handleVisible: false,
      isEdit: false,
      searchData: {}
    }
  },
  methods: {
    fetchList () {
      let params = {
        page: this.page,
        pId: this.partnerId
      }
      fetchPartners(params)
        .then(res => {
          this.dataList = res.result.list || []
          this.total = res.result.total || 0
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    sizeChange (size) {
      this.page.pageSize = size
      this.fetchList()
    },
    currentChange (num) {
      this.page.pageNum = num
      this.fetchList()
    },
    submitConfirm (data, done) {
      let params = {
        ...data,
        pId: this.partnerId
      }
      if (this.isEdit) {
        updatePartner(params)
          .then(res => {
            this.$notify({
              title: '系统提示',
              message: '修改商家信息成功！',
              type: 'success'
            })
            done()
            this.fetchList()
            this.handleVisible = false
          })
          .catch(err => {
            done()
            this.$message.error(err.message)
          })
        return
      }
      createPartner(params)
        .then(res => {
          this.$notify({
            title: '系统提示',
            message: '新增商家成功！',
            type: 'success'
          })
          done()
          this.fetchList()
          this.handleVisible = false
        })
        .catch(err => {
          done()
          this.$message.error(err.message)
        })
    },
    dialogClose () {
      this.isEdit = false
    },
    openEdit (row) {
      this.isEdit = true
      // this.$refs.handleDialog.handleEdit(row)
      this.handleVisible = true
      findDetail(row.partnerId)
        .then(res => {
          this.$refs.handleDialog.handleEdit(res.result || {})
        })
        .catch(err => {
          this.$message.error(err.message)
        })
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
