
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['nickname'])
  },
  render (h) {
    let parent = document.documentElement
    let maxWidth = parent.offsetWidth
    let maxHeight = parent.offsetHeight
    let baseWidth = this.nickname.length * 15
    let iBase = 200
    let iCol = Math.ceil(maxWidth / (baseWidth + iBase))
    let iRow = parseInt(maxHeight / (15 + iBase))
    let rowArr = []
    for (let i = 0; i < iRow; i++) {
      for (let n = 0; n < iCol; n++) {
        rowArr.push(h(
          'div',
          {
            class: 'watermark-item',
            style: {
              top: i * (15 + iBase) + (iBase / 2) + 'px',
              left: n * (baseWidth + iBase) + (iBase / 2) + 'px',
              marginRight: '-100px'
            }
          },
          [this.nickname, h('div', null, 'www.lasding.com')]
        ))
      }
    }
    return (
      <div class="water-mark">
        {rowArr}
      </div>
    )
  },
  mounted () {
    // document.body.appendChild(this.$el)
  }
}
</script>

<style lang="scss" scoped>
.water-mark{
  .watermark-item{
    font-size: 13px;
    text-align: center;
    position: fixed;
    pointer-events: none;
    white-space: nowrap;
    z-index: 9999;
    color: #666;
    transform: rotateZ(-20deg);
    opacity: .3;
  }
}
</style>
