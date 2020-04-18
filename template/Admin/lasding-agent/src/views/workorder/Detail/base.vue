<template>
  <el-row style="border-top: 1px solid #E5E5E5;">
    <el-col :span="24">
      <data-item title="工单备注">{{detail.remark}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="工单编号">{{detail.id}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="工单类型">{{detail.type}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="来源类型">{{detail.sourceType}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="来源单号">{{detail.sourceNo}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="来源ID">{{detail.sourceId}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="商家">{{detail.partnerName}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="核销码">{{detail.confirmCode}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="联系人">{{detail.linkmanName}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="客户名称">{{detail.customerName}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="客户电话">{{detail.customerMobile}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="数量">{{detail.num || 1}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="期望上门时间">{{detail.expectDate && detail.expectDate.split(' ')[0]}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="期望上门时间段">{{detail.expectTimeSlot}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="预约上门时间">{{detail.id}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="群组团长">{{detail.leaderName}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="安装技师">{{detail.hidTechnician}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="技师电话">{{detail.technicianMobile}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="创建时间">{{detail.crtTime}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="创建人">{{detail.crtName}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="收货时间">{{detail.deliverySignTime}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="付款时间">{{detail.paymentTime}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="分单时间">{{detail.shareTime}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="拒单时间">{{detail.refuseTime}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="出发时间">{{detail.leaveTime}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="签到时间"></data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="上门时间">{{detail.signTime}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="核销时间">{{detail.doneTime}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="更新时间">{{detail.updTime}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="更新人">{{detail.updName}}</data-item>
    </el-col>
    <el-col v-bind="cols">
      <data-item title="店铺">{{detail.shopName}}</data-item>
    </el-col>
    <el-col :span="24">
      <data-item title="客户地址">{{detail.deliveryAddress || detail.address}}</data-item>
    </el-col>
    <el-col :span="24">
      <data-item title="安装地址">{{detail.address}}</data-item>
    </el-col>
  </el-row>
</template>

<script>
import DataItem from './dataItem'
export default {
  components: {
    DataItem
  },
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
      cols: {
        xl: 8,
        lg: 8,
        md: 8,
        sm: 12,
        xs: 24
      }
    }
  }
}
</script>

<style>

</style>
