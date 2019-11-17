<template>
  <el-dialog
    title="设置表格展示列"
    width="800px"
    :visible.sync="model"
    top="50px"
  >
    <!-- <el-transfer
      v-model="value"
      :titles="['隐藏列', '顺序展示列']"
      :data="data"
      target-order="push"
    >
      <div slot-scope="{option}">
        {{option.label}}
      </div>
    </el-transfer> -->
    <el-row :gutter="20">
      <el-col :span="12">
        <h3 class="sort-title">隐藏列</h3>
        <draggable
          v-model="data"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false"
        >
          <transition-group
            class="list-group"
            tag="div"
            type="transition"
            :name="!drag ? 'flip-list' : null"
          >
            <div
              class="list-group-item"
              v-for="item in data"
              :key="item.field"
            >
              {{ item.fieldName }}
            </div>
          </transition-group>
        </draggable>
      </el-col>
      <el-col :span="12">
        <h3 class="sort-title">顺序展示列</h3>
        <draggable
          v-model="value"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false"
        >
          <transition-group
            class="list-group"
            tag="div"
            type="transition"
            :name="!drag ? 'flip-list' : null"
          >
            <div
              class="list-group-item"
              v-for="item in value"
              :key="item.field"
            >
              {{ item.fieldName }}
            </div>
          </transition-group>
        </draggable>
      </el-col>
    </el-row>
    <div>
      <p style="float: right;">点击确定才能够正常应用!</p>
      <p>拖动以配置</p>
    </div>
    <span slot="footer">
      <el-button
        size="small"
        @click="$emit('change', false)"
        :loading="btnLoading"
      >
        取消
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="confirm"
        :loading="btnLoading"
        :disabled="btnLoading"
      >
        确定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/utils/dialogMinix'
import draggable from 'vuedraggable'
import { tableConfig, userTableConfig, saveUserTableConfig } from '@/api/system'
import { mapState } from 'vuex'
export default {
  name: 'SetTableCols',
  components: {
    draggable
  },
  mixins: [dialogMixin],
  props: {
    props: {
      type: Object,
      default () {
        return {
          key: 'field',
          label: 'fieldName',
          disabled: 'disabled'
        }
      }
    },
    url: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      value: [],
      data: [],
      drag: false
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.userInfo.userId
    }),
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  methods: {
    confirm () {
      let checkDatas = this.value.map(x => ({...x, id: undefined}))
      // this.value.forEach(x => {
      //   let has = this.data.find(z => z[this.props.key] === x)
      //   checkDatas.push(has)
      // })
      if (this.url.config) {
        let params = {
          userId: this.userId,
          displayList: checkDatas
        }
        this.btnLoading = true
        saveUserTableConfig(this.url.config, params)
          .then(() => {
            this.$notify({
              title: '系统提示',
              message: '表格配置保存成功',
              type: 'success'
            })
            this.btnLoading = false
            this.$emit('confirm', checkDatas)
          })
          .catch(err => {
            this.btnLoading = false
            this.$message.error(err.message)
          })
      }
    },
    async fetchTableConfig () {
      if (this.url.config) {
        let response = await this.fetchUserTableConfig()
        let userConfigs = response.result
        tableConfig(this.url.config)
          .then(res => {
            var result = res.result || []
            this.value = userConfigs.map(x => {
              let has = result.findIndex(z => z.field === x.field)
              if (has !== -1) {
                result.splice(has, 1)
              }
              return x
            })
            this.data = result.map(x => ({
              key: x[this.props.key],
              label: x[this.props.label],
              ...x
            }))
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      }
    },
    fetchUserTableConfig () {
      return new Promise((resolve, reject) => {
        userTableConfig(this.url.config)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            this.$message.error(err.message)
            reject(err)
          })
      })
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.fetchTableConfig()
        // this.fetchUserTableConfig()
      }
    }
  }
}
</script>

<style scoped>
.sort-title{
  font-size: 14px;
  padding: 10px 0;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 400px;
  border: 1px solid #EEE;
}
.list-group-item {
  cursor: move;
  border-bottom: 1px solid #EEE;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 10px;
}
.list-group-item i {
  cursor: pointer;
}
</style>
