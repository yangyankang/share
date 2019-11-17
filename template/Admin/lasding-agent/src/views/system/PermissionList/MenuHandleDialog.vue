<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    top="50px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="120px"
      :model="form"
      :rules="formRules"
      ref="form"
    >
      <div>
        <el-form-item label="菜单类型：" prop="menuType">
          <el-radio-group v-model="form.menuType">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮/权限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称：" prop="name">
          <el-input size="small" placeholder="请输入菜单名称" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单：" prop="parentId" v-if="form.menuType !== 0">
          <el-cascader
            :options="menu"
            :props="{
              value: 'id',
              label: 'name'
            }"
            change-on-select
            size="small"
            style="width: 100%;"
            v-model="form.parentId"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="跳转地址：" prop="url">
          <el-input size="small" placeholder="请输入跳转地址" v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="前端组件：" prop="component" v-if="form.menuType !== 2">
          <el-input size="small" placeholder="请输入组件路径" v-model="form.component"></el-input>
        </el-form-item>
        <el-form-item label="默认跳转地址：" prop="redirect" v-if="form.menuType === 0">
          <el-input size="small" placeholder="请输入重定向地址" v-model="form.redirect"></el-input>
        </el-form-item>
        <el-form-item label="前端图标：" prop="icon" v-if="form.menuType !== 2">
          <el-input size="small" placeholder="请输入菜单图标" v-model="form.icon">
            <el-button size="small"
              icon="el-icon-setting"
              slot="append"
              @click="openChooseIcon"
            >
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="授权标识：" prop="perms" v-if="form.menuType === 2">
          <el-input size="small" placeholder="多个用逗号隔开:user.list,user.create" v-model="form.perms"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sortNo">
          <el-input-number size="mini" :min="0" v-model="form.sortNo"></el-input-number>
        </el-form-item>
        <el-form-item label="是否路由菜单：" prop="route" v-if="form.menuType !== 2">
          <el-switch
            v-model="form.route"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="隐藏路由：" prop="hidden"  v-if="form.menuType !== 2">
          <el-switch
            v-model="form.hidden"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="授权策略：" prop="permsType" v-if="form.menuType === 2">
          <el-radio-group v-model="form.permsType">
            <el-radio :label="1">
              显示/访问
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态："  prop="status" v-if="form.menuType === 2">
          <el-radio-group v-model="form.status">
            <el-radio label="0">
              无效
            </el-radio>
            <el-radio label="1">
              有效
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer">
      <el-button
        size="small"
        @click="cancel"
        :loading="btnLoading"
        :disabled="btnLoading">
        取消
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="submitForm"
        :loading="btnLoading"
        :disabled="btnLoading">
        确定
      </el-button>
    </span>
    <choose-icon v-model="iconVisible" @confirm="iconConfirm"></choose-icon>
  </el-dialog>
</template>

<script>
import chooseIcon from '@/components/chooseIcon'
import { createMenu, updateMenu, loadMenuDetail } from '@/api/system'
export default {
  name: 'MenuHandleDialog',
  components: {
    chooseIcon
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    edit: {
      type: Boolean,
      default: false
    },
    menu: {
      type: Array,
      default () {
        return []
      }
    }
  },
  model: {
    prop: 'visible',
    event: 'change'
  },
  data () {
    return {
      form: {
        menuType: 0,
        name: '',
        parentId: [],
        hidden: false,
        url: '',
        redirect: '',
        component: '',
        sortNo: 1,
        route: false,
        icon: '',
        perms: '',
        permsType: 1,
        status: '1'
      },
      formRules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ]
      },
      iconVisible: false,
      btnLoading: false,
      editMiddle: null
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '菜单修改' : '新增菜单'
    },
    model: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('change', val)
      }
    }
  },
  methods: {
    openChooseIcon () {
      this.iconVisible = true
    },
    iconConfirm (icon) {
      this.form.icon = icon
      this.iconVisible = false
    },
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true
          let len = this.form.parentId.length
          let params = {
            ...this.form
          }
          delete params.partnerId
          if (len > 0) {
            params.parentId = this.form.parentId[len - 1]
          } else {
            params.parentId = ''
          }

          switch (this.form.menuType) {
            case 0:
            case 1:
              delete params.perms
              delete params.permsType
              delete params.status
              break
            case 2:
              delete params.icon
              delete params.hidden
              delete params.component
              delete params.redirect
              delete params.route
              break
          }

          if (this.edit) {
            updateMenu(params)
              .then(res => {
                this.$notify({
                  title: '系统提示',
                  message: '修改提交成功',
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

          createMenu(params)
            .then(res => {
              this.$notify({
                title: '系统提示',
                message: '新增成功',
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
    dialogClose () {
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
      loadMenuDetail(row.id)
        .then(res => {
          this.form = {...row}
          this.form.parentId = []
          const {
            parentIds
          } = res.result
          if (parentIds) {
            let tmpIds = parentIds.split(',')
            if (!tmpIds[tmpIds.length - 1]) {
              tmpIds.pop()
            }
            this.form.parentId = tmpIds
          }
          delete this.form.children
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    cancel () {
      this.$emit('change', false)
    }
  }
}
</script>

<style>

</style>
