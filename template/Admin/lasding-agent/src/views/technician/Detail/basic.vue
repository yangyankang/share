<template>
  <div class="tech-detail">
    <!-- <el-row>
      <el-col :span="8">
        <detail-item class="right-no-border"></detail-item>
      </el-col>
      <el-col :span="8">
        <detail-item></detail-item>
      </el-col>
    </el-row> -->
    <div class="data-item">
      <div class="data-item-label">
        姓名：
      </div>
      <div class="data-item-message">
        {{detail.name}}
      </div>
    </div>
    <div class="data-item">
      <div class="data-item-label">
        号码：
      </div>
      <div class="data-item-message">
        {{detail.mobile}}
      </div>
    </div>
    <div class="data-item">
      <div class="data-item-label">
        年龄：
      </div>
      <div class="data-item-message">
        {{detail.age}}
      </div>
    </div>
    <div class="data-item">
      <div class="data-item-label">
        性别：
      </div>
      <div class="data-item-message">
        {{detail.gender === 2 ? '女' : '男'}}
      </div>
    </div>
    <div class="data-item">
      <div class="data-item-label">
        民族：
      </div>
      <div class="data-item-message">
        {{detail.nation}}
      </div>
    </div>
    <div class="data-item">
      <div class="data-item-label">
        学历：
      </div>
      <div class="data-item-message">
        {{detail.education}}
      </div>
    </div>
    <div class="data-item">
      <div class="data-item-label">
        身份证号：
      </div>
      <div class="data-item-message">
        {{detail.idcard}}
      </div>
    </div>
    <div class="data-item">
      <div class="data-item-label">
        出生年月：
      </div>
      <div class="data-item-message">
        {{detail.birthday}}
      </div>
    </div>
    <div class="data-item">
      <div class="data-item-label">
        家乡：
      </div>
      <div class="data-item-message">
        {{detail.hometown}}
      </div>
    </div>
    <div class="data-item">
      <div class="data-item-label">
        常驻地址：
      </div>
      <div class="data-item-message">
        {{detail.address}}
      </div>
    </div>
    <div class="data-item">
      <div class="data-item-label">
        交通工具：
      </div>
      <div class="data-item-message">
        {{detail.vehicle}}
      </div>
    </div>
    <div class="data-item">
      <div class="data-item-label">
        银行卡号：
      </div>
      <div class="data-item-message">
        {{detail.cardNo}}
      </div>
    </div>
    <div class="data-item">
      <div class="data-item-label">
        银行：
      </div>
      <div class="data-item-message">
        {{detail.bankName}}
      </div>
    </div>
    <div class="data-item">
      <div class="data-item-label">
        服务质量：
      </div>
      <div class="data-item-message">
      </div>
    </div>
    <div class="data-item">
      <div class="data-item-label">
        状态：
      </div>
      <div class="data-item-message">
        {{detail.status === 1 ? '启用' : '禁用'}}
      </div>
    </div>
    <div class="data-item">
      <div class="data-item-label">
        备注：
      </div>
      <div class="data-item-message">
        {{detail.remark}}
      </div>
    </div>
    <div class="data-item">
      <div class="data-item-label">
        注册时间：
      </div>
      <div class="data-item-message">
        {{detail.registerTime}}
      </div>
    </div>
    <div class="data-item">
      <div class="data-item-label">
        入驻时间：
      </div>
      <div class="data-item-message">
        {{detail.approvedTime}}
      </div>
    </div>
    <div class="data-item">
      <div class="data-item-label">
        证件照片：
      </div>
      <div class="data-item-message">
        <img
          v-for="item in detail.imgs"
          :key="item.id"
          :src="item.path"
          style="height: 40px;"
        />
      </div>
    </div>
    <div class="data-item">
      <div class="data-item-label">
        邀请码：
      </div>
      <div class="data-item-message">
        {{detail.shareCode}}
      </div>
    </div>
  </div>
</template>

<script>
import DetailItem from './detail-item'
export default {
  components: {
    DetailItem
  },
  props: {
    detail: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.tech-detail{
  max-width: 800px;
}
.right-no-border{
  border-right: none;
}
.data-item{
  display: flex;
  font-size: 13px;
  line-height: 30px;
  .data-item-label{
    width: 90px;
    text-align: right;
    color: #333;
  }
  .data-item-message{
    color: #666;
  }
}
</style>
