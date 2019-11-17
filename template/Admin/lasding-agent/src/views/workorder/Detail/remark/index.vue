<template>
  <div>
    <div style="padding: 10px 0; text-align: right;">

    </div>
    <div>
      <div style="padding-right: 21px;">
        <el-row class="remark-titles">
          <el-col :span="3">
            <span class="remark-title">类型</span>
          </el-col>
          <el-col :span="11">
            <span class="remark-title">备注</span>
          </el-col>
          <el-col :span="4" style="text-align: center;">
            <span class="remark-title">时间</span>
          </el-col>
          <el-col :span="3" style="text-align: center;">
            <span class="remark-title">操作人</span>
          </el-col>
          <el-col :span="3" style="text-align: right;">
            <el-button
              size="small"
              type="primary"
              @click="visible = true"
            >添加备注</el-button>
          </el-col>
        </el-row>
      </div>
      <el-collapse>
        <el-collapse-item
          v-for="item in comments"
          :key="item.id"
        >
          <div slot="title" class="content-body">
            <el-row v-viewer>
              <el-col :span="3">{{item.label || '&nbsp;'}}</el-col>
              <el-col :span="11" class="commet-style">
                {{item.comment || '&nbsp;'}}
                <img
                  v-for="img in item.attachments"
                  :src="img.path"
                  :key="img.key"
                >
              </el-col>
              <el-col :span="4" style="text-align: center;">{{item.crtTime || '&nbsp;'}}</el-col>
              <el-col :span="3" style="text-align: center;">{{item.crtName || '&nbsp;'}}</el-col>
              <el-col :span="3" style="text-align: right;">
                <el-button
                  size="mini"
                  type="text"
                  @click.stop="openRplay(item)"
                >回复</el-button>
              </el-col>
            </el-row>
          </div>
          <div style="padding-right: 21px;">
            <el-row v-for="col in item.replies" :key="col.id">
              <el-col :span="3">&nbsp;</el-col>
              <el-col :span="11">
                <div>{{col.comment || '&nbsp;'}}</div>
                <div v-viewer>
                  <img v-for="z in col.attachments" :key="z.key" :src="z.path" style="height: 50px;">
                </div>
              </el-col>
              <el-col :span="4" style="text-align: center;">{{col.crtTime || '&nbsp;'}}</el-col>
              <el-col :span="3" style="text-align: center;">{{col.crtName || '&nbsp;'}}</el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <handle-dialog
      v-model="visible"
      ref="handleDialog"
      @close="dialogClose"
      @confirm="submitConfirm"
      :mode="handleMode"
    ></handle-dialog>
  </div>
</template>

<script>
import { findComment, addWomComment, replyComment } from '@/api/workorder'
import HandleDialog from './handleDialog'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'
Vue.use(Viewer)
export default {
  components: {
    HandleDialog
  },
  props: {
    serviceId: [String, Number],
    isOwn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      comments: [],
      visible: false,
      cRow: {},
      handleMode: 'add'
    }
  },
  methods: {
    fetchComment () {
      findComment(this.serviceId)
        .then(res => {
          this.comments = res.result || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    dialogClose () {
      this.handleMode = 'add'
    },
    submitConfirm (data, done) {
      let params = {
        ...data,
        serviceId: this.serviceId
      }
      if (this.handleMode === 'add') {
        addWomComment(params)
          .then(res => {
            this.$notify({
              title: '系统提示',
              message: '添加成功!',
              type: 'success'
            })
            this.visible = false
            done()
            this.fetchComment()
          })
          .catch(err => {
            done()
            this.$message.error(err.message)
          })
      } else {
        Object.assign(params, {
          replyId: this.cRow.id
        })
        replyComment(params)
          .then(res => {
            this.$notify({
              title: '系统提示',
              message: '回复成功',
              type: 'success'
            })
            done()
            this.fetchComment()
            this.visible = false
          })
          .catch(err => {
            done()
            this.$message.error(err.message)
          })
      }
    },
    openRplay (row) {
      this.cRow = {...row}
      this.$refs.handleDialog.setData(row)
      this.handleMode = 'replay'
      this.visible = true
    }
  },
  watch: {
    isOwn (val) {
      if (val) {
        this.fetchComment()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.remark-titles{
  padding: 5px 0;
  font-size: 14px;
  font-weight: bold;
  .remark-title{
    vertical-align: middle;
  }
}
.content-body{
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.commet-style{
  img{
    height: 30px;
    vertical-align: middle;
  }
}
</style>
