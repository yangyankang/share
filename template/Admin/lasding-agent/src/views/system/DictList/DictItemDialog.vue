<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="close"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form
      label-width="100px"
      ref="form"
      :model="form"
      :rules="formRules"
    >
      <el-form-item label="名称：" prop="itemText">
        <el-input size="small" placeholder="请输入名称" v-model="form.itemText"></el-input>
      </el-form-item>
      <el-form-item label="数据值：" prop="itemValue">
        <el-input size="small" placeholder="请输入名称" v-model="form.itemValue"></el-input>
      </el-form-item>
      <el-form-item label="描述：" prop="description">
        <el-input size="small" placeholder="请输入名称" v-model="form.description" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="排序：" prop="sortOrder">
        <el-input-number
          v-model="form.sortOrder"
          controls-position="right"
          :min="0"
          size="small"
          ></el-input-number>
          <span>值越小越靠前</span>
      </el-form-item>
      <el-form-item label="是否启用：" prop="status">
        <el-switch
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="form.status"
        >
        </el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button
        size="small"
        :loading="btnLoading"
        :disabled="btnLoading">
        取消
      </el-button>
      <el-button
        size="small"
        type="primary"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="submitForm">
        提交
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import {
  createDictItem,
  updateDictItem
} from '@/api/system'
export default {
  name: 'DictItemDialog',
  props: {
    row: {
      type: Object,
      defualt () {
        return {}
      }
    }
  },
  mixins: [dialogMinix],
  data () {
    return {
      form: {
        itemText: '',
        itemValue: '',
        sortOrder: 1,
        status: 1,
        description: ''
      },
      formRules: {
        itemText: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        itemValue: [
          {required: true, message: '请输入数据值', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改字典项' : '新增字典项'
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            ...this.form,
            dictId: this.row.id
          }
          if (this.edit) {
            updateDictItem(params)
              .then(res => {
                this.$notify({
                  title: '系统提示',
                  message: '修改字典项成功!',
                  type: 'success'
                })
                this.$emit('submit-ok')
                this.btnLoading = false
              })
              .catch(err => {
                this.btnLoading = false
                this.$message.error(err.message)
              })
            return
          }
          createDictItem(params)
            .then(() => {
              this.$notify({
                title: '系统提示',
                message: '新增字典项成功!',
                type: 'success'
              })
              this.$emit('submit-ok')
              this.btnLoading = false
            })
            .catch(err => {
              this.btnLoading = false
              this.$message.error(err.message)
            })
        }
      })
    },
    close () {
      if (this.editMiddle) {
        this.form = {...this.editMiddle}
      } else {
        this.$refs.form.resetFields()
      }
      this.$refs.form.clearValidate()
      this.$emit('close')
    },
    handleEdit (row) {
      this.editMiddle = {...this.form}
      this.form = {...row}
    }
  }
}
</script>

<style>

</style>
