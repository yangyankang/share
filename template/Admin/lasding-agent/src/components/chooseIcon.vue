<template>
  <el-dialog
    title="选择图标"
    :visible.sync="model"
    append-to-body
    width="800px"
  >
    <div>
      <el-tabs>
        <el-tab-pane label="实心" style="height: 400px; overflow: auto;">
          <ul class="icon-list">
            <li
              v-for="item in solids"
              :key="item" @click="choose(item)"
              :class="{active: choosed === item}"
            >
              <span :class="item"></span>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="素描" style="height: 400px; overflow: auto;">
          <ul class="icon-list">
            <li
              v-for="item in sketchs"
              :key="item" @click="choose(item)"
              :class="{active: choosed === item}"
            >
              <span :class="item"></span>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </div>
    <span slot="footer">
      <el-button size="small">
        取消
      </el-button>
      <el-button size="small" type="primary" @click="confrim">
        确定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'visible',
    event: 'change'
  },
  computed: {
    model: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('change', val)
      }
    }
  },
  data () {
    return {
      solids: [
        'el-icon-platform-eleme',
        'el-icon-delete-solid',
        'el-icon-eleme',
        'el-icon-upload',
        'el-icon-s-cooperation',
        'el-icon-s-order',
        'el-icon-s-platform',
        'el-icon-s-unfold',
        'el-icon-s-promotion',
        'el-icon-s-home',
        'el-icon-s-release',
        'el-icon-s-ticket',
        'el-icon-s-management',
        'el-icon-s-open',
        'el-icon-s-shop',
        'el-icon-s-help',
        'el-icon-s-goods',
        'el-icon-s-marketing',
        'el-icon-s-flag',
        'el-icon-s-comment',
        'el-icon-s-finance',
        'el-icon-s-claim',
        'el-icon-s-tools',
        'el-icon-s-custom',
        'el-icon-s-opportunity',
        'el-icon-s-fold',
        'el-icon-s-data',
        'el-icon-s-check',
        'el-icon-s-grid',
        'el-icon-user-solid',
        'el-icon-question',
        'el-icon-warning',
        'el-icon-remove',
        'el-icon-info',
        'el-icon-circle-plus',
        'el-icon-picture',
        'el-icon-location',
        'el-icon-error',
        'el-icon-success',
        'el-icon-camera-solid',
        'el-icon-d-caret',
        'el-icon-message-solid',
        'el-icon-menu',
        'el-icon-star-on',
        'el-icon-video-camera-solid',
        'el-icon-phone',
        'el-icon-more',
        'el-icon-share',
        'el-icon-caret-left',
        'el-icon-caret-right',
        'el-icon-caret-bottom',
        'el-icon-caret-top'
      ],
      sketchs: [
        'el-icon-c-scale-to-original',
        'el-icon-sort-up',
        'el-icon-sort-down',
        'el-icon-goods',
        'el-icon-video-pause',
        'el-icon-video-play',
        'el-icon-s-operation',
        'el-icon-date',
        'el-icon-circle-close',
        'el-icon-edit',
        'el-icon-folder',
        'el-icon-folder-opened',
        'el-icon-folder-add',
        'el-icon-folder-remove',
        'el-icon-folder-delete',
        'el-icon-folder-checked',
        'el-icon-tickets',
        'el-icon-document-remove',
        'el-icon-document-delete',
        'el-icon-document-copy',
        'el-icon-document-checked',
        'el-icon-document',
        'el-icon-document-add',
        'el-icon-printer',
        'el-icon-paperclip',
        'el-icon-download',
        'el-icon-upload2',
        'el-icon-takeaway-box',
        'el-icon-camera',
        'el-icon-search',
        'el-icon-zoom-in',
        'el-icon-zoom-out',
        'el-icon-monitor',
        'el-icon-attract',
        'el-icon-mobile',
        'el-icon-video-camera',
        'el-icon-scissors',
        'el-icon-umbrella',
        'el-icon-headset',
        'el-icon-brush',
        'el-icon-data-line',
        'el-icon-mouse',
        'el-icon-coordinate',
        'el-icon-magic-stick',
        'el-icon-reading',
        'el-icon-data-board',
        'el-icon-pie-chart',
        'el-icon-data-analysis',
        'el-icon-collection-tag',
        'el-icon-edit-outline',
        'el-icon-film',
        'el-icon-suitcase',
        'el-icon-suitcase-1',
        'el-icon-picture-outline-round',
        'el-icon-picture-outline',
        'el-icon-receiving',
        'el-icon-collection',
        'el-icon-files',
        'el-icon-notebook-1',
        'el-icon-notebook-2',
        'el-icon-toilet-paper',
        'el-icon-office-building',
        'el-icon-school',
        'el-icon-table-lamp',
        'el-icon-house',
        'el-icon-no-smoking',
        'el-icon-shopping-cart-full',
        'el-icon-shopping-cart-1',
        'el-icon-shopping-cart-2',
        'el-icon-shopping-bag-1',
        'el-icon-shopping-bag-2',
        'el-icon-present',
        'el-icon-box',
        'el-icon-bank-card',
        'el-icon-money',
        'el-icon-coin',
        'el-icon-wallet',
        'el-icon-discount',
        'el-icon-price-tag',
        'el-icon-truck',
        'el-icon-news',
        'el-icon-help',
        'el-icon-guide',
        'el-icon-male',
        'el-icon-female',
        'el-icon-thumb',
        'el-icon-cpu',
        'el-icon-link',
        'el-icon-connection',
        'el-icon-open',
        'el-icon-turn-off',
        'el-icon-set-up',
        'el-icon-chat-round',
        'el-icon-chat-line-round',
        'el-icon-chat-square',
        'el-icon-chat-dot-round',
        'el-icon-chat-dot-square',
        'el-icon-chat-line-square',
        'el-icon-message',
        'el-icon-postcard',
        'el-icon-position',
        'el-icon-turn-off-microphone',
        'el-icon-microphone',
        'el-icon-close-notification',
        'el-icon-bell',
        'el-icon-circle-plus-outline',
        'el-icon-remove-outline',
        'el-icon-circle-check',
        'el-icon-time',
        'el-icon-odometer',
        'el-icon-crop',
        'el-icon-switch-button',
        'el-icon-copy-document',
        'el-icon-full-screen',
        'el-icon-star-off',
        'el-icon-basketball',
        'el-icon-football',
        'el-icon-baseball',
        'el-icon-mic',
        'el-icon-stopwatch',
        'el-icon-medal-1',
        'el-icon-medal',
        'el-icon-trophy',
        'el-icon-first-aid-kit',
        'el-icon-discover',
        'el-icon-place',
        'el-icon-location-outline',
        'el-icon-location-information',
        'el-icon-add-location',
        'el-icon-delete-location',
        'el-icon-map-location',
        'el-icon-alarm-clock',
        'el-icon-timer',
        'el-icon-watch-1',
        'el-icon-watch',
        'el-icon-wind-power',
        'el-icon-light-rain',
        'el-icon-lightning',
        'el-icon-sunrise',
        'el-icon-sunrise-1',
        'el-icon-lock',
        'el-icon-user',
        'el-icon-unlock',
        'el-icon-sold-out',
        'el-icon-service',
        'el-icon-mobile-phone',
        'el-icon-more-outline',
        'el-icon-setting',
        'el-icon-warning-outline',
        'el-icon-food'
      ],
      choosed: ''
    }
  },
  methods: {
    choose (item) {
      this.choosed = item
    },
    close () {
      this.$emit('change', false)
    },
    confrim () {
      if (!this.choosed) {
        this.$message({
          type: 'warning',
          message: '请选择图标'
        })
        return
      }
      this.$emit('confirm', this.choosed)
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-list{
  overflow: hidden;
  list-style-type: none;
  padding: 0;
  li{
    float: left;
    width: 49px;
    height: 50px;
    font-size: 18px;
    text-align: center;
    line-height: 50px;
    margin-right: 5px;
    margin-bottom: 5px;
    border: 1px solid #EEE;
    transition: all ease .3s;
    cursor: pointer;
    &:hover{
      background-color: #EEE;
    }
    &.active{
      background-color: #409EFF;
      color: #FFF;
    }
  }
}
</style>
