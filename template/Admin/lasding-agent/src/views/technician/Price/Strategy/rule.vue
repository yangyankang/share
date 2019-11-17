<template>
  <el-popover
    placement="bottom-start"
    :width="180"
    trigger="hover"
    popper-class="set-popper"
  >
    <div class="rule-body">
      <div class="rule-handle"  v-if="showHandle">
        <el-button
          size="mini"
          type="text"
          @click="editClick"
        >修改</el-button>
        <el-button
          size="mini"
          type="text"
          @click="removeClick"
        >删除</el-button>
      </div>
      <template v-if="data.ruleMode === 1">
        <p class="rule-min-title">考核项</p>
        <ul class="rule-checks">
          <li
            class="rule-check-item"
            v-for="item in (data.checkList || [])"
            :key="item.id"
          >
            <span>{{item.priceTypeName}}</span>
            <span class="rule-price">{{parseFloat(item.money).toFixed(2)}}</span>
          </li>
        </ul>
      </template>
    </div>
    <div class="rule-item" slot="reference">
      <div class="rule-item-header">
        <div class="rule-header-right">
          <span class="rule-header-label" :class="data.ruleMode === 1 ? 'warn' : 'info'">
            {{data.ruleMode === 1 ? '考核' : '基础'}}
          </span>
          <span v-if="data.ruleMode === 1" class="el-icon-arrow-right"></span>
        </div>
        <div class="rule-item-title">
          {{data.priceTypeName}}：
          <span class="rule-price">
            {{parseFloat(data.money).toFixed(2)}}
          </span>
        </div>
      </div>
      <!-- <div class="rule-item-body">
        <div class="rule-item-price-wrppaer">
          <div class="price-wrapper">
            <span class="rule-item-label">
              金额
            </span>
            <span class="rule-item-price">
              {{parseFloat(data.money).toFixed(2)}}
            </span>
          </div>
        </div>
        <div class="rule-item-serve">
          <el-popover
            trigger="hover"
            placement="right"
            :disabled="data.ruleMode === 0"
          >
            <template v-if="data.checkList && data.checkList.length > 0">
              <div class="check-items">
                <div
                  v-for="item in (data.checkList || [])"
                  :key="item.id"
                  class="check-item"
                >
                  <span class="check-item-label">{{item.priceTypeName}}</span>
                  <span class="check-item-price">{{parseFloat(item.money).toFixed(2)}}</span>
                </div>
              </div>
            </template>
            <div class="check-items" v-else>
              <span>暂无考核项!</span>
            </div>
            <div slot="reference">
              <span class="rule-item-label">
                考核项目
              </span>
              <span class="rule-item-icon">
                <span v-if="data.ruleMode === 0">暂无</span>
                <span class="el-icon-arrow-right" v-else></span>
              </span>
            </div>
          </el-popover>
        </div>
      </div>
      <div class="rule-footer" v-if="showHandle">
        <el-button
          size="mini"
          type="text"
          style="padding: 4px 0;"
          @click="editClick"
        >修改</el-button>
        <el-button
          size="mini"
          type="text"
          style="padding: 4px 0;"
          @click="removeClick"
        >
          删除
        </el-button>
      </div> -->
    </div>
  </el-popover>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    showHandle: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    editClick () {
      this.$emit('edit-click', this.data)
    },
    removeClick () {
      this.$emit('remove-click', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.rule-item{
  display: inline-block;
  border: 1px solid #EEE;
  min-width: 180px;
  background-color: #FFF;
  margin-bottom: 5px;
  margin-right: 5px;
  cursor: pointer;
  position: relative;
  vertical-align: middle;
}
.rule-item-header{
  overflow: hidden;
  padding: 3px 5px;
  white-space: nowrap;
  .rule-item-title{
    font-size: 13px;
    line-height: 20px;
  }
  .rule-header-right{
    font-size: 10px;
    float: right;
    line-height: 20px;
  }
  .rule-header-label{
    display: inline-block;
    vertical-align: top;
    padding: 0 2px;
    &.info{
      background-color: #CCC;
      color: #666;
    }
    &.warn{
      background-color: #FFCC99;
      color: #666;
    }
  }
}
.rule-price{
  color: #F00;
  font-weight: 700;
}
.rule-body{
  z-index: 10;
  width: 100%;
  .rule-handle{
    display: flex;
    border-bottom: 1px solid #EEE;
    >*{
      flex: 1;
    }
  }
  .rule-min-title{
    padding: 10px 10px 0;
    font-weight: 700;
    color: #333;
    font-size: 13px;
  }
}
.rule-checks{
  padding: 0;
  list-style-type: none;
  .rule-check-item{
    padding: 5px 15px;
    border-bottom: 1px solid #ECECEC;
    font-size: 13px;
    .rule-price{
      float: right;
    }
  }
}
</style>
