<template>
  <div class="redcord-sum">
    <div class="record-sum-item-wrapper">
      <div class="record-sum-item">
        <div class="record-item-left">
          <p class="record-item-left_label">销售额</p>
          <div class="record-item-left_content">
            <b>{{(data.topTotalMoney || 0).toFixed(2)}}元</b>
          </div>
        </div>
        <div class="record-item-right">
          <div>
            <span>应收：</span>
            <span>{{(data.topReceivableMoney || 0).toFixed(2)}}元</span>
          </div>
          <div>
            <span>抵扣券：</span>
            <span>{{(data.topCouponMoney || 0).toFixed(2)}}元</span>
          </div>
        </div>
      </div>
    </div>
    <div class="record-sum-item-wrapper">
      <div class="record-sum-item">
        <div class="record-item-left">
          <p class="record-item-left_label">已收</p>
          <div class="record-item-left_content">
            <b>{{((data.topMonthBackMoney || 0) + (data.topPreReceivableMoney || 0)).toFixed(2)}}</b>
          </div>
        </div>
        <div class="record-item-right">
          <div>
            <span>预付：</span>
            <span>{{(data.topMonthBackMoney || 0).toFixed(2)}}元</span>
          </div>
          <div>
            <span>月结：</span>
            <span>{{(data.topPreReceivableMoney || 0).toFixed(2)}}元</span>
          </div>
        </div>
      </div>
    </div>
    <div class="record-sum-item-wrapper">
      <div class="record-sum-item">
        <div class="record-item-left">
          <p class="record-item-left_label">代收</p>
          <div class="record-item-left_content">
            <b>{{
              ((data.topReceivableMoney || 0) -
              (data.topPreReceivableMoney || 0) -
              (data.topMonthBackMoney || 0)).toFixed(2)
            }}元</b>
          </div>
        </div>
        <!-- <div class="record-item-right">
          <div>
            <span>现金：</span>
            <span>4000元</span>
          </div>
          <div>
            <span>抵扣券：</span>
            <span>1000元</span>
          </div>
        </div> -->
      </div>
    </div>
    <div class="record-sum-item-wrapper">
      <div class="record-sum-item">
        <div class="record-item-left">
          <p class="record-item-left_label">差异额</p>
          <div class="record-item-left_content">
            <b>{{
              (Math.abs(data.topProfitDifferMoney || 0) +
              Math.abs(data.topAliRechargeMoney || 0)).toFixed(2)
            }}元</b>
          </div>
        </div>
        <div class="record-item-right">
          <div>
            <span>多收：</span>
            <span>{{(data.topProfitDifferMoney || 0).toFixed(2)}}元</span>
          </div>
          <div>
            <span>少收：</span>
            <span>{{(data.topLossDifferMoney || 0).toFixed(2)}}元</span>
          </div>
        </div>
      </div>
    </div>
    <div class="record-sum-item-wrapper">
      <div class="record-sum-item">
        <div class="record-item-left">
          <p class="record-item-left_label">充值总额</p>
          <div class="record-item-left_content">
            <b>50000</b>
          </div>
        </div>
        <div class="record-item-right">
          <div>
            <span>微信：</span>
            <span>4000元</span>
          </div>
          <div>
            <span>支付宝：</span>
            <span>1000元</span>
          </div>
          <div>
            <span>余额：</span>
            <span>4000元</span>
          </div>
        </div>
      </div>
    </div>
    <div class="record-sum-item-wrapper">
      <div class="record-sum-item">
        <div class="record-item-left">
          <p class="record-item-left_label">余额</p>
          <div class="record-item-left_content">
            <b>{{(data.topBalanceMoney || 0).toFixed(2)}}元</b>
          </div>
        </div>
      </div>
    </div>
    <div class="record-sum-item-wrapper">
      <div class="record-sum-item">
        <div class="record-item-left">
          <p class="record-item-left_label">其他</p>
          <div class="record-item-left_content">
            <b>
              <!-- (data.topAliRechargeMoney || 0) + -->
              {{
                ((data.topWxRechargeMoney || 0) +
                (data.topLsdRechargeMoney || 0) +
                (data.topBankRechargeMoney || 0)).toFixed(2)
              }}元</b>
          </div>
        </div>
        <div class="record-item-right">
          <div>
            <span>微信：</span>
            <span>{{(data.topWxRechargeMoney || 0).toFixed(2)}}元</span>
          </div>
          <div>
            <span>支付宝：</span>
            <span>{{(data.topAliRechargeMoney || 0).toFixed(2)}}元</span>
          </div>
          <div>
            <span>线下：</span>
            <span>{{(data.topBankRechargeMoney || 0).toFixed(2)}}元</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.redcord-sum{
  margin-bottom: 10px;
}
.record-sum-item-wrapper{
  display: inline-block;
  border: 1px solid #CCC;
  padding: 8px 15px;
  margin-bottom: 5px;
}
.record-sum-item{
  display: flex;
  text-align: center;
}
.record-item-left{
  columns: #333;
}
.record-item-left_label{
  font-size: 15px;
  color: #666;
  padding-top: 8px;
  line-height: 1;
  padding-bottom: 2px;
}
.record-item-left_content{
  font-size: 20px;
}
.record-item-right{
  font-size: 13px;
  color: #666;
  float: left;
  padding-left: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
