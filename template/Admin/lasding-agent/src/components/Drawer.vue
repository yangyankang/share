<template>
  <div class="i-drawer" :style="{zIndex: zIndex}">
    <transition name="el-fade-in-linear">
      <div class="i-drawer-bg" v-if="showBg" v-show="visible" @click="maskClick"></div>
    </transition>
    <div class="i-drawer-container-wrapper">
      <transition name="drawer-slidein">
        <div class="i-drawer-container" :style="{width: width}" v-show="visible">
          <div class="drag-border"></div>
          <div class="i-drawer-body">
            <div class="i-drawer-header">
              <slot name="header">
                <div class="i-drawer-title">{{title}}</div>
                <div class="handle-btn">
                  <el-button size="small" @click="maskClick">
                    关闭
                  </el-button>
                </div>
              </slot>
            </div>
            <div class="i-drawer-main">
              <slot></slot>
            </div>
            <div class="i-drawer-footer" v-if="$slots.footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import zIndex from '@/utils/zIndex'
export default {
  name: 'IDrawer',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    showBg: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '700px'
    },
    title: String
  },
  data () {
    return {
      zIndex: zIndex.nextZIndex()
    }
  },
  methods: {
    maskClick () {
      this.$emit('update:visible', false)
      this.$emit('close')
    }
  },
  watch: {
    visible (val) {
      var className = document.body.className
      var classNames = []
      if (className) {
        classNames = className.split(' ') || []
      }
      if (val) {
        classNames.push('is-show-idraewr')
      } else {
        let index = classNames.findIndex(x => x === 'is-show-idraewr')
        if (index !== -1) {
          classNames.splice(index, 1)
        }
      }
      document.body.className = classNames.join(' ')
    }
  }
}
</script>

<style lang="scss">
.i-drawer{
  position: absolute;
}
.i-drawer-bg{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
}
.i-drawer-container-wrapper{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  // background-color: #FFF;
}
.i-drawer-container{
  height: 100%;
  background-color: #FFF;
  box-shadow: -2px 0 3px #EEE;
}
.i-drawer-body{
  height: 100%;
  display: flex;
  flex-direction: column;
  .i-drawer-header,
  .i-drawer-footer{
    height: 50px;
    line-height: 50px;
    line-height: 50px;
    padding: 0 10px;
  }
  .i-drawer-header{
    border-bottom: 1px solid #EEE;
    .i-drawer-title{
      float: left;
    }
    .handle-btn{
      float: right;
    }
  }
  .i-drawer-footer{
    border-top: 1px solid #EEE;
  }
  .i-drawer-main{
    flex: 1;
    overflow: auto;
    padding: 10px;
  }
}
.drawer-slidein-enter,
.drawer-slidein-leave-to{
  opacity: 0.3;
  transform: translateX(100%);
}
.drawer-slidein-enter-active{
  transition-duration: .4s;
  transition-property: transform, opacity;
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>
