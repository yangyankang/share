<template>
  <el-card shadow="never">
    <div style="position: relative;">
      <div class="back-btns">
        <el-button
          size="small"
          @click="$router.push('/finance/partner/account')"
        >返回</el-button>
      </div>
      <el-tabs type="card" v-model="active">
        <el-tab-pane label="基本信息" name="base">
          <detail-base
            :show-cols="showCols"
            :detail="detail"
          ></detail-base>
        </el-tab-pane>
        <el-tab-pane label="流水记录" name="record">
          <record
            :detail="detail"
            :is-own="active === 'record'"
          ></record>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<script>
import baseMinix from '@/utils/baseMinix'
import DetailBase from './base'
import Record from './record'
import {
  financeAccountsDetail
} from '@/api/partner'
export default {
  mixins: [baseMinix],
  components: {
    DetailBase,
    Record
  },
  data () {
    return {
      url: {
        config: '/partner/account'
      },
      detail: {},
      active: 'base'
    }
  },
  computed: {
    partnerId () {
      return this.$route.query.pId
    }
  },
  methods: {
    fetchDetail () {
      financeAccountsDetail(this.partnerId)
        .then(res => {
          this.detail = {...res.result}
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  },
  created () {
    this.fetchDetail()
  }
}
</script>

<style lang="scss" scoped>
.back-btns{
  position: absolute;
  right: 0;
}
</style>
