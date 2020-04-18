<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
    top="3vh"
  >
    <div style="padding: 10px;">
      <el-form
        label-width="82px"
        ref="form"
        class="search-form"
        :model="form"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="工单编号：">
              {{detail.id}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品类型：">
              {{product.categoryIdDictText}}
              {{product.subcategoryIdDictText}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户姓名：">
              {{detail.linkmanName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户电话：">
              {{detail.linkmanMobile}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="安装地址：">
              {{detail.address}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务类型：">
              {{detail.serviceTypeDictText}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="安装技师：">
              {{tech.name}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="技师电话：">
              {{tech.mobile}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结算方式：">
              {{serviceType}}
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="detail.serviceType === 1">
            <el-form-item label="结算技师：">
              {{tech.name}}
            </el-form-item>
          </el-col>
          <el-col :span="12" v-else>
            <el-form-item label="结算技师：">
              {{settleWho}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label-width="0">
          <div class="tab-title-wrapper">
            <span>师傅费用</span>
            <div class="fr">
              <el-button
                size="small"
                type="primary"
                @click="openAdd"
              >新增费用</el-button>
            </div>
          </div>
          <el-table
            height="350px"
            :data="costs"
          >
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
        </el-form-item>
      </el-form>
      <add-cost
        v-model="addVisible"
        @confirm="addConfirm"
      ></add-cost>
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
        @click="submitForm"
      >提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import AddCost from './addCost'
import {
  womTechCost,
  cancelCost,
  addWomTechCost
} from '@/api/workorder'
import { WOM_COST_STATUS } from '@/store/modules/dict'
import { mapState } from 'vuex'
export default {
  components: {
    AddCost
  },
  mixins: [dialogMinix],
  props: {
    detail: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      form: {
      },
      costs: [],
      addVisible: false
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
    },
    ...mapState({
      womCostStates: state => state.dict[WOM_COST_STATUS]
    }),
    tech () {
      return this.detail.technician || {}
    },
    product () {
      return this.detail.product || {}
    },
    serviceType () {
      const {
        serviceType
      } = this.detail
      if (serviceType === 1) {
        return '个人结算'
      } else {
        switch (this.techGroup.settleType) {
          case 1:
            return '固定结算'
          case 2:
            return '团员结算'
        }
      }
    },
    techGroup () {
      const {
        technicianGroup
      } = this.detail
      return technicianGroup || {}
    },
    settle () {
      return (this.techGroup.settle || this.techGroup.leader) || {}
    },
    settleWho () {
      const {
        serviceType
      } = this.detail
      let str = ''
      if (serviceType === 1) {
        str = (this.tech.name || '') +
        (this.tech.mobile ? '——' + this.tech.mobile : '')
      } else {
        if (this.techGroup.settleType === 1) {
          str = (this.settle.name || '') +
          (this.settle.mobile ? '——' + this.settle.mobile : '')
        } else {
          str = (this.tech.name || '') +
          (this.tech.mobile ? '——' + this.tech.mobile : '')
        }
      }
      return str
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true
          let data = {}
          let done = () => {
            this.btnLoading = false
          }
          this.$emit('confirm', data, done)
        }
      })
    },
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
      if (this.editMiddle) {
        this.form = {...this.editMiddle}
      } else {
        this.$refs.form.resetFields()
      }
      this.$refs.form.clearValidate()
      this.$emit('close')
    },
    fetchTechCosts () {
      womTechCost(this.detail.id)
        .then(res => {
          this.costs = res.result || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    openAdd () {
      this.addVisible = true
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
        serviceId: this.detail.id
      }
      addWomTechCost(params)
        .then(res => {
          this.$notify({
            title: '系统提示',
            message: '添加技师',
            type: 'success'
          })
          done()
          this.fetchTechCosts()
          this.addVisible = false
        })
        .catch(err => {
          done()
          this.$message.error(err.message)
        })
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.fetchTechCosts()
        if (this.womCostStates.length <= 0) {
          this.$store.dispatch('GetDictItem', WOM_COST_STATUS)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-title-wrapper{
  border-bottom: 1px solid #EEE;
  .fr{
    float: right;
  }
}
</style>
