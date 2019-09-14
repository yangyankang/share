<template>
  <el-dialog
    :visible.sync="sendImageVisible"
    append-to-body
  >
    <div class="head">
      <i
        class="close el-icon-close"
        @click="sendImageClose"
      ></i>
      <span class="title">发送图片</span>
    </div>
    <div class="body">
      <div class="file-area">
        <div class="file-area-box">
          <img
            class="file-img"
            :src="preFile.url"
          >
        </div>
        <p class="file-info-item file-name ng-binding">{{preFile.name}}</p>
        <p class="file-info-item file-size">{{preFile.size}}B</p>
      </div>
    </div>
    <div class="foot">
      <el-button
        type="primary"
        class="sendBtn"
        size="small"
        @click="send"
      >发送</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    sendImageVisible: Boolean,
    preFile: Object
  },
  data () {
    return {

    }
  },
  components: {},
  methods: {
    sendImageClose () {
      this.$emit('close', false)
    },
    send () {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang='scss' scoped>
/deep/ .el-dialog__header {
  display: none;
}
/deep/ .sendBtn {
  width: 136px;
}
/deep/ .el-dialog__body {
  padding: 0;
  .head {
    height: 50px;
    line-height: 52px;
    text-align: center;
    background-color: #fff;
    padding: 0 30px;
    position: relative;
    border-bottom: 1px solid #ececed;
    border-radius: 3px;
    position: relative;
    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      font-size: 20px;
    }
  }
  .body {
    flex: 1;
    padding: 12px;
    overflow-y: auto;
    .file-area {
      padding-top: 12px;
      text-align: center;
      .file-img {
        max-width: 100%;
        max-height: 200px;
      }
      .file-name {
        margin-top: 15px;
        color: #222;
      }
      .file-size {
        margin-top: 10px;
        color: #7d7d7e;
      }
    }
  }
  .foot {
    width: 100%;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: #fff;
    position: relative;
  }
}
</style>
