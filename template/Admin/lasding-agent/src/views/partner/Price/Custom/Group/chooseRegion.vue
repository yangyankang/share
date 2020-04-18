<template>
  <el-dialog
    title="选择地区"
    width="800px"
    :visible.sync="model"
    :close-on-click-modal="false"
  >
    <div v-loading="dataLoading" style="max-height: 450px; overflow: auto;">
      <el-tree
        :data="dataTree"
        :props="{label: 'regionName'}"
        :default-expanded-keys="defaultExpanded"
        :default-checked-keys="defaultCheckes"
        show-checkbox
        class="area-tree"
        node-key="id"
        ref="regionTree"
      ></el-tree>
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
        @click="confirm"
      >提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import { GetTpCustomGroupStrategyRegionTree, GetTpCustomGroupStrategyOldRegion } from '@/api/price'
export default {
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
      dataTree: [],
      dataLoading: false,
      defaultExpanded: [],
      defaultCheckes: []
    }
  },
  methods: {
    confirm () {
      let halfs = this.$refs.regionTree.getHalfCheckedNodes()
      let checkes = this.$refs.regionTree.getCheckedNodes()
      if (checkes.length <= 0) {
        this.$message({
          type: 'waring',
          message: '请选择区域'
        })
        return
      }
      this.btnLoading = true
      const done = () => {
        this.btnLoading = false
      }
      this.$emit('confirm', {halfs, checkes}, done)
    },
    async fetchRegions () {
      let params = {
        groupStrategyId: this.row.id,
        priceGroupId: this.row.priceGroupId
      }
      this.dataLoading = true
      GetTpCustomGroupStrategyRegionTree(params)
        .then(res => {
          let list = res.result || []
          // this.defaultExpanded = list.map(x => x.id)
          // this.dataTree = list
          // this.dataLoading = false
          this.$refs.regionTree.setCheckedKeys([])
          GetTpCustomGroupStrategyOldRegion(params)
            .then(res => {
              let oldChecks = res.result || []
              let filterCheckes = oldChecks.filter(x => x.regionGrade === 3)
              this.defaultExpanded = list.map(x => x.id)
              this.defaultCheckes = filterCheckes.map(x => x.regionCode)
              this.dataTree = list
              this.dataLoading = false
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.fetchRegions()
      }
    }
  }
}
</script>

<style>

</style>
