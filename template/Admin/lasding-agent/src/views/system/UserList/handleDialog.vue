<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    top="20px"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="100px"
      ref="form"
      :model="form"
      :rules="formRules"
    >
      <el-form-item label="用户账号：" prop="username">
        <el-input
          size="small"
          placeholder="请输入用户账号"
          v-model="form.username"
        >
        </el-input>
      </el-form-item>
      <el-row v-if="!edit">
        <el-col :span="12">
          <el-form-item label="账号密码：" prop="password">
            <el-input
              size="small"
              type="password"
              placeholder="请输入登陆密码"
              v-model="form.password"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="账号密码：" prop="validPass">
            <el-input
              size="small"
              type="password"
              placeholder="请输入登陆密码"
              v-model="form.validPass"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名字：" prop="realName">
            <el-input
              size="small"
              placeholder="请输入姓名"
              v-model="form.realName"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期：" prop="birthday">
            <el-date-picker
              size="small"
              placeholder="请输入出生日期"
              v-model="form.birthday"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号码：" prop="phone">
            <el-input
              size="small"
              placeholder="请输入手机号"
              v-model="form.phone"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱：" prop="email">
            <el-input
              size="small"
              placeholder="请输入邮箱"
              v-model="form.email"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="所属机构：" prop="agentId">
        <el-popover
          :width="400"
          placement="bottom-start"
          v-model="showAgentTree"
        >
          <div style="min-height: 150px; max-height: 400px;">
            <el-tree
              node-key="id"
              ref="agentTree"
              :data="agentTree"
              :props="{
                label: 'name'
              }"
              highlight-current
              default-expand-all
              :expand-on-click-node="false"
              @current-change="agentChange"
            >
              <div class="custorm-node" slot-scope="{node}" @dblclick="nodeDblClick('showAgentTree')">
                <span>{{node.label}}</span>
              </div>
            </el-tree>
          </div>
          <el-input
            readonly
            size="small"
            placeholder="请选择部门"
            slot="reference"
            v-model="agentChecked.name"
          ></el-input>
        </el-popover>
      </el-form-item>
      <el-form-item label="所属部门：" prop="departId">
        <el-popover
          :width="400"
          :disabled="!agentChecked.id"
          placement="bottom-start"
          v-model="showDeptTree"
        >
          <div style="min-height: 150px; max-height: 400px;">
            <el-tree
              node-key="id"
              ref="deptTree"
              :data="deptTree"
              :props="{
                label: 'departName'
              }"
              highlight-current
              default-expand-all
              :expand-on-click-node="false"
              @current-change="deptChange"
            >
              <div class="custorm-node" slot-scope="{node}" @dblclick="nodeDblClick('showDeptTree')">
                <span>{{node.label}}</span>
              </div>
            </el-tree>
          </div>
          <el-input
            readonly
            size="small"
            placeholder="请选择部门"
            slot="reference"
            v-model="deptChecked.departName"
            :disabled="!agentChecked.id"
          ></el-input>
        </el-popover>
      </el-form-item>
      <el-form-item label="角色：" prop="roles">
        <el-select
          v-model="form.roles"
          size="mini"
          multiple
          style="width: 100%;"
        >
          <el-option
            v-for="item in roleOpts"
            :key="item.id"
            :value="item.id"
            :label="item.roleName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性别：" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="头像：" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action="/"
          accept="image/*"
          :show-file-list="false"
          :http-request="customFile"
        >
          <img v-if="form.avatar" :src="form.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
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
import {
  createUser,
  GetRoleList,
  GetDepartListTree,
  updateUser,
  GetUserAgentTree,
  GetUserDetail
} from '@/api/system'
import { mapState } from 'vuex'
import { fileQniu } from '@/api/file'
export default {
  mixins: [dialogMinix],
  data () {
    return {
      form: {
        agentId: '',
        username: '',
        password: '',
        validPass: '',
        realName: '',
        roles: [],
        phone: '',
        sex: '',
        avatar: '',
        birthday: '',
        email: '',
        departId: ''
      },
      formRules: {
        username: [
          {required: true, message: '请输入用户登陆账号', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入账号密码', trigger: 'blur'},
          {min: 6, max: 16, message: '最少6个字符最多16个字符', trigger: 'blur'}
        ],
        validPass: [
          {required: true, message: '请再次输入密码', trigger: 'blur'}
        ],
        realName: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ]
      },
      roleOpts: [],
      deptTree: [],
      deptChecked: {},
      showDeptTree: false,
      agentTree: [],
      agentChecked: {},
      showAgentTree: false
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
    },
    ...mapState({
      QniuToken: state => state.app.qniuToken
    })
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true
          if (this.edit) {
            updateUser(this.form)
              .then(res => {
                this.submitOkMessage('修改用户')
              })
              .catch(err => {
                this.btnLoading = false
                this.$message.error(err.message)
              })
            return
          }
          createUser(this.form)
            .then(res => {
              this.submitOkMessage('新增用户')
            })
            .catch(err => {
              this.btnLoading = false
              this.$message.error(err.message)
            })
        }
      })
    },
    handleEdit (row) {
      this.editMiddle = {...this.form}
      this.btnLoading = true
      GetUserDetail(row.id)
        .then(res => {
          let result = res.result
          this.form = {...result}
          this.form.roles = (result.roles || []).map(x => x.id)
          if (result.agentId) {
            this.agentChecked = {
              id: result.agentId,
              name: result.agentName
            }
          }
          if (result.departId) {
            this.deptChecked = {
              id: result.departId,
              departName: result.departName
            }
          }
          this.btnLoading = false
        })
        .catch(err => {
          this.$message.error(err.message)
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
      this.form.departId = ''
      this.form.agentId = ''
      this.deptChecked = {}
      this.agentChecked = {}
      this.$refs.deptTree.setCurrentKey('')
      this.$refs.agentTree.setCurrentKey('')
      this.$refs.form.clearValidate()
      this.$emit('close')
    },
    fetchRoleList () {
      GetRoleList({
        page: {
          pageSize: 1e6,
          pageNum: 1
        }
      })
        .then(res => {
          this.roleOpts = res.result.list || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    fetchDepartTree () {
      let params = {
        agentId: this.agentChecked.id
      }
      GetDepartListTree(params)
        .then(res => {
          this.deptTree = res.result
          if (this.deptChecked.id) {
            this.$refs.deptTree.setCurrentKey(this.deptChecked.id)
          }
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    deptChange (data) {
      this.deptChecked = {...data}
      this.form.departId = data.id
    },
    fetchAgentTree () {
      GetUserAgentTree()
        .then(res => {
          this.agentTree = res.result || []
          if (this.agentChecked.id) {
            this.$nextTick(() => {
              this.$refs.agentTree.setCurrentKey(this.agentChecked.id)
            })
          }
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    agentChange (data) {
      this.agentChecked = {...data}
      this.form.agentId = data.id
    },
    nodeDblClick (type) {
      this[type] = false
    },
    async customFile (http) {
      const {
        file
      } = http
      if (!this.QniuToken) {
        await this.$store.dispatch('GetQniuToken')
      }
      var observable = fileQniu(file, 'user/avatar', this.QniuToken)
      observable.subscribe({
        error: (err) => {
          this.$message.error(err.message)
        },
        complete: (res) => {
          this.form.avatar = res.path
        }
      })
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.fetchRoleList()
        this.fetchAgentTree()
      }
    },
    'agentChecked.id': {
      handler (val) {
        if (val) {
          this.fetchDepartTree()
        }
      },
      deep: true
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 88px;
    height: 88px;
    line-height: 88px;
    text-align: center;
  }
  .avatar {
    width: 88px;
    height: 88px;
    display: block;
  }
  .custorm-node{
    flex: 1;
  }
</style>
