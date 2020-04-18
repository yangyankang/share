<template>
  <drawer
    :visible.sync="model"
    :title="title"
    show-bg
  >
    <div class="header-btns-wrapper">
      <div class="fr">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="chooseVisible = true"
        >
          新增
        </el-button>
      </div>
    </div>
    <el-table
      :data="dataList"
      border
    >
      <el-table-column label="师傅姓名" prop="name"></el-table-column>
      <el-table-column label="电话" prop="mobile" width="110px"></el-table-column>
      <el-table-column label="交通工具" prop="vehicle" width="100px"></el-table-column>
      <el-table-column label="地址" prop="address" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作">
        <span class="table-handle-btns" slot-scope="{row}">
          <span class="handle-btn danger" @click="openRemove(row)">踢出群组</span>
        </span>
      </el-table-column>
    </el-table>
    <choose-tech
      v-model="chooseVisible"
      multiple
      @confirm="confirm"
    ></choose-tech>
  </drawer>
</template>

<script>
import Drawer from '@/components/Drawer'
import dialogMinix from '@/utils/dialogMinix'
import {
  techGroupMembers,
  deleteTechGroupMember,
  addGroupMembers
} from '@/api/technician'
import ChooseTech from '@/views/technician/Dialog/ChooseTech'
export default {
  components: { Drawer, ChooseTech },
  mixins: [dialogMinix],
  props: {
    row: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      dataList: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      dataLoading: false,
      url: {},
      chooseVisible: false
    }
  },
  computed: {
    title () {
      return this.row.groupName + '-团队成员'
    }
  },
  methods: {
    fetchGroupMembers () {
      let params = {
        // page: this.page,
        groupId: this.row.id
      }
      this.dataList = []
      this.dataLoading = true
      techGroupMembers(params)
        .then(res => {
          this.dataList = res.result || []
          // this.total = res.result.total || 0
          this.dataLoading = false
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    openRemove (row) {
      const {
        name,
        id
      } = row
      this.$confirm(`您确定踢除——${name}——该师傅吗？`, '系统提示', {})
        .then(res => {
          let params = {
            groupId: this.row.id,
            technicianIds: [id]
          }
          deleteTechGroupMember(params)
            .then(res => {
              this.$notify({
                title: '系统提示',
                message: '踢除成功',
                type: 'success'
              })
              this.fetchGroupMembers()
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {})
    },
    confirm (selects) {
      let params = {
        groupId: this.row.id,
        technicianIds: selects.map(x => x.id)
      }
      addGroupMembers(params)
        .then(res => {
          this.$notify({
            title: '系统提示',
            message: '添加成功',
            type: 'success'
          })
          this.chooseVisible = false
          this.fetchGroupMembers()
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.fetchGroupMembers()
      }
    }
  }
}
</script>

<style>

</style>
