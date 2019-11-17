<template>
  <el-card shadow="never">
    <div>
      <div style="position: relative;">
        <div style="position: absolute; right: 0; z-index: 2;">
          <el-button
            size="small"
            @click="$router.push('/partner/list')"
          >
            返回
          </el-button>
        </div>
        <el-tabs type="card" v-model="tabActive">
          <el-tab-pane label="基本信息" name="base">
            <partner-base :detail="detail" :files="files"></partner-base>
          </el-tab-pane>
          <el-tab-pane label="子商家" name="child">
            <child
              :partner-id="partnerId"
              :is-own="tabActive === 'child'"
            ></child>
          </el-tab-pane>
          <el-tab-pane label="店铺管理" name="shop">
            <shop
              :partner-id="partnerId"
              :is-own="tabActive === 'shop'"
            ></shop>
          </el-tab-pane>
          <el-tab-pane label="账户列表" name="account">
            <account
              :partner-id="partnerId"
              :is-own="tabActive === 'account'"
            ></account>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-card>
</template>

<script>
import { findDetail, queryPartnerAttachment } from '@/api/partner'
import PartnerBase from './base'
import Child from './child'
import Shop from './shop'
import Account from './account'
export default {
  components: {
    PartnerBase,
    Child,
    Shop,
    Account
  },
  data () {
    return {
      detail: {},
      tabActive: 'base',
      files: []
    }
  },
  computed: {
    partnerId () {
      return this.$route.query.pId
    }
  },
  methods: {
    fetchDetail () {
      findDetail(this.partnerId)
        .then(res => {
          this.detail = res.result || {}
        })
        .catch(err => {
          this.$message.error(err.message)
        })
      let params = {
        partnerId: this.partnerId,
        AttachType: -1
      }
      queryPartnerAttachment(params)
        .then(res => {
          this.files = res.result || []
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

<style>

</style>
