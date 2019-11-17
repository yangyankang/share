
<script>
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
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
    return {
      iswiper: null,
      items: [
        {
          title: '工单总量',
          desc: '成功核销完成的工单总数量',
          field (data) {
            return (data.recordCountSum || 0)
          }
        },
        {
          title: '费用总额',
          desc: '工单费用总和（包含基础费用+额外费用）',
          field (data) {
            return (data.totalSum || 0).toFixed(2)
          }
        },
        {
          title: '已支付总额',
          desc: '当前工单已经支付的金额总计',
          field (data) {
            return (data.completeSum || 0).toFixed(2)
          }
        },
        {
          title: '待支付总额',
          desc: `
            工单状态为待支付的工单总额
            （包含基础费用和已经审核及待审核的额外费用）
            退款总金额：包含异常工单退款、
            （如:重复建单，建单地址识别错误、优惠、操作失误导致的工单异常费用）
          `,
          field (data) {
            return (data.waitSum || 0).toFixed(2)
          }
        },
        {
          title: '退款总额',
          desc: `
            该金额为【小螺钉】在该账期中退还给商家的安装费用
            并实时退回到商家账户
          `,
          field (data) {
            return (data.refundSum || 0).toFixed(2)
          }
        },
        {
          title: '实际应付总额',
          desc: '当前应付账单总额',
          field (data) {
            return ((data.totalSum || 0) - (data.refundSum || 0)).toFixed(2)
          }
        }
      ]
    }
  },
  methods: {
    createdElem () {
      return this.$createElement('div', {
        style: {
          color: 'red'
        }
      }, '123456')
    }
  },
  render () {
    return (
      <div>
        <div class="swiper-container">
          <div class="swiper-wrapper">
            {this.items.map((item, index) => {
              return (
                <div
                  class="swiper-slide"
                  key={index}
                >
                  <div class="statc-title">
                    {item.title}
                    <el-tooltip content={item.desc} placement="top">
                      <span class="el-icon-question"></span>
                    </el-tooltip>
                  </div>
                  <div class="statc-num">
                    <strong>
                      {item.field(this.data)}
                    </strong>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  },
  mounted () {
    this.iswiper = new Swiper('.swiper-container', {
      slidesPerView: 'auto',
      freeMode: true
    })
  },
  destroyed () {
    this.iswiper = null
  }
}
</script>

<style lang="scss" scoped>

.swiper-slide{
  width: auto;
  padding: 0 40px;
  line-height: 28px;
  .statc-title{
    font-size: 16px;
    >.iconfont{
      font-size: 16px;
    }
  }
  .statc-num{
    font-size: 18px;
  }
  .yen{
    font-size: 14px;
  }
}
</style>
