<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="100px"
      ref="form"
      :model="form"
      :rules="formRules"
    >
      <el-form-item label="部门名称：" prop="departName">
        <el-input
          size="small"
          placeholder="请输入部门名称"
          v-model="form.departName"
        ></el-input>
      </el-form-item>
      <el-form-item label="上级部门：" prop="parentId">
        <el-popover
          placement="bottom-start"
          :width="400"
          v-model="showDeptTree"
        >
          <div style="max-height: 400px;">
            <el-tree
              :data="tree"
              :props="{
                label: 'departName'
              }"
              highlight-current
              node-key="id"
              ref="parentTree"
              @current-change="checkedChange"
              default-expand-all
              :expand-on-click-node="false"
            >
              <div slot-scope="{node}" class="custorm-node" @dblclick="nodeDblclick">
                <span>{{node.label}}</span>
              </div>
            </el-tree>
          </div>
          <el-input
            size="small"
            slot="reference"
            readonly
            v-model="treeChecked.departName"
          ></el-input>
        </el-popover>
      </el-form-item>
      <el-form-item label="部门状态：" prop="status">
        <el-switch
          :active-value="1"
          :inactive-value="0"
          active-text="启用"
          inactive-text="禁用"
          v-model="form.status"
        >
        </el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button
        size="small"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="$emit('change', false)"
      >取消</el-button>
      <el-button
        size="small"
        type="primary"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="submitForm"
      >提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import { createDepart, updateDepart } from '@/api/system'
export default {
  mixins: [dialogMinix],
  props: {
    tree: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      form: {
        departName: '',
        parentId: '',
        status: 1
      },
      formRules: {
        departName: [
          {required: true, message: '请输入部门名称!', trigger: 'blur'}
        ]
      },
      treeChecked: {},
      showDeptTree: false
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
    }
  },
  methods: {
    submitForm () {
      if (this.edit) {
        updateDepart(this.form)
          .then(res => {
            this.submitOkMessage('修改部门信息')
          })
          .catch(err => {
            this.btnLoading = false
            this.$message.error(err.message)
          })
        return
      }
      createDepart(this.form)
        .then(res => {
          this.submitOkMessage('新增部门')
        })
        .catch(err => {
          this.btnLoading = false
          this.$message.error(err.message)
        })
    },
    handleEdit (row) {
      this.editMiddle = {...this.form}
      this.form = {...row}
      this.$nextTick(() => {
        if (row.parentId !== -1) {
          this.$refs.parentTree.setCurrentKey(row.parentId)
          let checked = this.$refs.parentTree.getCurrentNode()
          this.treeChecked = {...checked}
        }
      })
    },
    submitOkMessage (msg) {
      this.$notify({
        title: '系统提示',
        message: `${msg}成功`,
        type: 'success'
      })
      this.$emit('submit-ok')
      this.btnLoading = false
    },
    dialogClose () {
      if (this.editMiddle) {
        this.form = {...this.editMiddle}
      } else {
        this.$refs.form.resetFields()
      }
      this.form.parentId = ''
      this.treeChecked = {}
      this.$refs.parentTree.setCurrentKey('')
      this.$refs.form.clearValidate()
      this.$emit('close')
    },
    checkedChange (data, node) {
      this.form.parentId = data.id
      this.treeChecked = {...data}
    },
    setParent (data) {
      this.form.parentId = data.id
      this.$nextTick(() => {
        this.treeChecked = {...data}
        this.$refs.parentTree.setCurrentKey(data.id)
      })
    },
    nodeDblclick () {
      this.showDeptTree = false
    }
  }
}
</script>

<style>
.custorm-node{
  flex: 1;
}
</style>
