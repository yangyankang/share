<template>
  <div>
    <el-form
      inline
      label-width="90px"
      :model="searchData"
    >
      <el-form-item label="店铺名称：" prop="shopName">
        <el-input
          size="small"
          v-model="searchData.shopName"
          clearable
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
      >添加店铺</el-button>
    </div>
    <div>
      <el-table
        border
        height="500px"
        :data="dataList"
      >
        <el-table-column label="店铺名称" prop="shopName" sortable></el-table-column>
        <el-table-column label="店铺地址" prop="shopAddress"></el-table-column>
        <el-table-column label="店铺类型" prop="shopType" align="center" width="110">
          <template slot-scope="{row}">
            {{row.shopType | optsFilter(shopTypes, 'itemValue', 'itemText')}}
          </template>
        </el-table-column>
        <el-table-column label="联系电话" prop="shopPhone" align="center" width="120"></el-table-column>
        <el-table-column label="店铺链接" prop="shopUrl"></el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <span slot-scope="{row}" class="table-handle-btns">
            <span class="handle-btn warn" @click="openEdit(row)">
              编辑
            </span>
          </span>
        </el-table-column>
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
import { GetShops, addShop, editShop } from '@/api/partner'
import HandleDialog from './handleDialog'
import { SHOP_TYPES } from '@/store/modules/dict'
import { mapState } from 'vuex'
export default {
  components: {
    HandleDialog
  },
  props: {
    partnerId: String,
    isOwn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      dataList: [],
      handleVisible: false,
      isEdit: false,
      searchData: {
        shopName: ''
      }
    }
  },
  computed: {
    ...mapState({
      shopTypes: state => state.dict[SHOP_TYPES]
    })
  },
  methods: {
    fetchList () {
      let params = {
        page: this.page,
        partnerId: this.partnerId
      }
      GetShops(params)
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
        partnerId: this.partnerId
      }
      if (this.isEdit) {
        editShop(params)
          .then(res => {
            this.$notify({
              title: '系统提示',
              message: '修改店铺信息成功',
              type: 'success'
            })
            this.fetchList()
            done()
            this.handleVisible = false
          })
          .catch(err => {
            done()
            this.$message.error(err.message)
          })
        return
      }
      addShop(params)
        .then(res => {
          this.$notify({
            title: '系统提示',
            message: '新增店铺成功!',
            type: 'success'
          })
          this.fetchList()
          done()
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
      this.$refs.handleDialog.handleEdit(row)
      this.handleVisible = true
    }
  },
  watch: {
    isOwn (val) {
      if (val) {
        this.fetchList()
        if (this.shopTypes.length <= 0) {
          this.$store.dispatch('GetDictItem', SHOP_TYPES)
        }
      }
    }
  }
}
</script>

<style>

</style>
