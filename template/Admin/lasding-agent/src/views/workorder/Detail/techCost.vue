<template>
  <div>
    <div class="header-btns-wrapper">
      <div class="fr">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="addVisible = true"
        >
          新增
        </el-button>
      </div>
    </div>
    <el-table
      border
      height="500px"
      :data="dataList"
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column label="费用类型" prop="subject" show-overflow-tooltip></el-table-column>
      <el-table-column label="金额" prop="cost" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" prop="status" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{row.status + '' | optsFilter(womCostStates, 'itemValue', 'itemText')}}
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" prop="crtTime" show-overflow-tooltip width="140" align="center"></el-table-column>
      <el-table-column label="操作人" prop="crtName" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" prop="updName" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" fixed="right" width="60" align="center">
        <span class="table-handle-btns" slot-scope="{row}">
          <span class="handle-btn warn" @click="openCancel(row)">
            取消
          </span>
        </span>
      </el-table-column>
    </el-table>
    <add-cost
      v-model="addVisible"
      @confirm="addConfirm"
    ></add-cost>
  </div>
</template>

<script>
import { womTechCost, cancelCost, addWomTechCost } from '@/api/workorder'
import { WOM_COST_STATUS } from '@/store/modules/dict'
import { mapState } from 'vuex'
import AddCost from '../Visit/addCost'
export default {
  components: {
    AddCost
  },
  props: {
    isOwn: {
      type: Boolean,
      default: false
    },
    serviceId: [String, Boolean]
  },
  data () {
    return {
      dataList: [],
      addVisible: false
    }
  },
  computed: {
    ...mapState({
      womCostStates: state => state.dict[WOM_COST_STATUS]
    })
  },
  methods: {
    fetchList () {
      womTechCost(this.serviceId)
        .then(res => {
          this.dataList = res.result || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    openCancel (row) {
      this.$prompt('请输入`取消原因`', '系统提示', {
        inputType: 'textarea',
        inputPattern: /.{2,}/,
        inputErrorMessage: '请输入内容'
      })
        .then(({value}) => {
          let params = {
            remark: value
          }
          cancelCost(row.id, params)
            .then(res => {
              this.$notify({
                title: '系统提示',
                message: '取消成功',
                type: 'success'
              })
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
    },
    addConfirm (data, done) {
      let params = {
        ...data,
        serviceId: this.serviceId
      }
      addWomTechCost(params)
        .then(res => {
          this.$notify({
            title: '系统提示',
            message: '添加技师',
            type: 'success'
          })
          done()
          this.fetchList()
          this.addVisible = false
        })
        .catch(err => {
          done()
          this.$message.error(err.message)
        })
    }
  },
  watch: {
    isOwn (val) {
      if (val) {
        this.fetchList()
        if (this.womCostStates.length <= 0) {
          this.$store.dispatch('GetDictItem', WOM_COST_STATUS)
        }
      }
    }
  }
}
</script>

<style>

</style>
