<template>
  <el-card shadow="never">
    <div style="height: 120px;" class="steps-wrapper">
      <div style="flex: 1;">
        <el-steps :active="computedSteps.active" align-center>
          <el-step
            v-for="(item, index) in computedSteps.steps"
            :key="index"
            :title="item.text"
          >
          </el-step>
        </el-steps>
      </div>
      <div style="padding-left: 20px;">
        <el-button
          size="small"
          type="info"
          @click="$router.push('/workorder/basic')"
        >返回</el-button>
      </div>
    </div>
    <div></div>
    <div style="position: relative;">
      <div class="btns-wrapper">
        <el-button
          size="small"
          type="primary"
        >拨打电话</el-button>
        <el-button
          size="small"
          type="primary"
        >拨打电话</el-button>
      </div>
      <el-tabs v-model="tabActive" type="card">
        <el-tab-pane label="基本信息" name="base">
          <base-data :detail="detail"></base-data>
        </el-tab-pane>
        <el-tab-pane label="产品信息" name="product">
          <product :detail="detail"></product>
        </el-tab-pane>
        <el-tab-pane label="工单备注" name="remark">
          <remark
            :is-own="tabActive === 'remark'"
            :serviceId="serviceId"
          ></remark>
        </el-tab-pane>
        <el-tab-pane label="操作记录" name="record">
          <handle-record
            :is-own="tabActive === 'record'"
            :serviceId="serviceId"
          ></handle-record>
        </el-tab-pane>
        <el-tab-pane label="技师费用" name="techcost">
          <tech-cost
            :is-own="tabActive === 'techcost'"
            :serviceId="serviceId"
          ></tech-cost>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<script>
import { GetDetailById } from '@/api/workorder'
import HandleRecord from './handleRecord'
import Remark from './remark/index'
import BaseData from './base'
import Product from './product'
import TechCost from './techCost'
export default {
  components: {
    HandleRecord,
    Remark,
    BaseData,
    Product,
    TechCost
  },
  data () {
    return {
      steps: [
        {value: 'REQUESTED', text: '已创建'},
        {value: 'ISSUED', text: '已发布'},
        {value: 'SHARED', text: '已分单'},
        {value: 'RECEIVED', text: '已接单'},
        {value: 'REFUSED', text: '已拒单', desc: true},
        {value: 'NEXT', text: '预约失败', desc: true},
        {value: 'DELAY', text: '暂不安装'},
        {value: 'ASSIGNED', text: '已预约'},
        {value: 'LEAVE', text: '已出发'},
        {value: 'REACHED', text: '已签到'},
        {value: 'REWORK', text: '已返工'},
        {value: 'IDENTIFY', text: '已核销'},
        {value: 'END', text: '已完结'}
      ],
      detail: {},
      tabActive: 'base'
    }
  },
  computed: {
    serviceId () {
      return this.$route.query.oId
    },
    computedSteps () {
      let hidden = [
        'REFUSED',
        'NEXT',
        'DELAY',
        'REWORK'
      ]
      let flowStatus = this.detail.flowStatus
      let hasHidden = hidden.findIndex(x => x === hidden)
      if (hasHidden !== -1) {
        hidden.splice(hasHidden, 1)
      }
      let filterSteps = this.steps.filter(x => hidden.indexOf(x.value) === -1)
      let step = filterSteps.findIndex(x => x.value === flowStatus)
      return {
        steps: filterSteps,
        active: step + 1
      }
    }
  },
  methods: {
    fetchDetails () {
      GetDetailById(this.serviceId)
        .then(res => {
          this.detail = res.result || {}
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  },
  created () {
    this.fetchDetails()
  }
}
</script>

<style lang="scss" scoped>
.steps-wrapper{
  display: flex;
  /deep/ .el-step__title{
    font-size: 13px;
  }
}
.btns-wrapper{
  position: absolute;
  right: 0;
}
</style>
