<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <div style="height: 450px; overflow: auto;" v-loading="dataLoading">
      <el-form
        label-width="90px"
        ref="form"
      >
        <div>
          <el-form-item label-width="0">
            <el-tree
              class="area-tree"
              :data="dataList"
              show-checkbox
              node-key="id"
              :props="{
                label: 'name',
                disabled: disabledNode
              }"
              :default-expanded-keys="defaultExpand"
              @check="productCheck"
              ref="productTree"
            ></el-tree>
          </el-form-item>
        </div>
      </el-form>
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
export default {
  mixins: [dialogMinix],
  props: {
    row: {
      type: Object,
      default () {
        return {}
      }
    },
    requestAll: Function,
    requestUse: Function
  },
  data () {
    return {
      dataLoading: false,
      dataList: [],
      checks: [],
      defaultExpand: []
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
    }
  },
  methods: {
    submitForm () {
      if (this.checks.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择到产品'
        })
        return
      }
      this.btnLoading = true
      let rules = this.checks.map(x => {
        let id = x.id
        delete x.id
        return {
          ...x,
          productId: id
        }
      })
      let params = {
        rules: rules
      }
      let done = () => {
        this.btnLoading = false
      }
      this.$emit('confirm', params, done)
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
      this.checks = []
      // this.$refs.form.clearValidate()
      this.$emit('close')
    },
    fetchList () {
      this.dataLoading = true
      let reslove = (arr) => {
        this.defaultExpand = arr.map(x => x.id)
        this.dataList = [...arr]
        this.fetchUsedProduct()
      }
      this.requestAll && this.requestAll(reslove)
    },
    fetchUsedProduct () {
      let reslove = (arr) => {
        this.checks = arr.map(x => ({id: x.productId}))
        this.$refs.productTree.setCheckedKeys(arr.map(x => x.productId + ''))
        this.dataLoading = false
      }
      this.requestUse && this.requestUse(reslove)
    },
    productCheck (node, data) {
      const {
        checkedNodes
      } = data
      this.checks = checkedNodes.filter(x => x.grade === 3)
    },
    disabledNode (data, node) {
      return !!data.selected
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.fetchList()
      }
    }
  }
}
</script>

<style>

</style>
