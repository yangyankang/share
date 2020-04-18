<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <div style="padding: 100px;">
      <el-form
        label-width="100px"
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-form-item label="团队名称：" prop="groupName">
          <el-input
            size="small"
            placeholder="请输入团队名称"
            v-model="form.groupName"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择团长：" prop="leader" v-if="!edit">
          <el-input
            size="small"
            placeholder="请选择团长"
            readonly
            v-model="form.leaderName"
            @click.native="openChooseTech"
          ></el-input>
        </el-form-item>
        <el-form-item prop="leaderName" v-show="false"></el-form-item>
        <el-form-item label="结算方式：" prop="settleType">
          <el-radio-group v-model="form.settleType">
            <el-radio
              v-for="item in groupSettleTypes"
              :key="item.itemValue"
              :label="item.itemValue"
            >{{item.itemText}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="结算对象：" prop="settleUid" v-if="edit && form.settleType === '1'">
          <el-select size="small" v-model="form.settleUid" style="width: 100%;">
            <el-option
              v-for="item in members"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
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
    <choose-tech
      v-model="chooseTechVisible"
      @confirm="chooseConfirm"
    ></choose-tech>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import ChooseTech from '@/views/technician/Dialog/ChooseTech'
import { createTechGroup, updateTechGroup, techGroupMembers } from '@/api/technician'
import { TECH_GROUP_SETTLE_TYPE } from '@/store/modules/dict'
import { mapState } from 'vuex'
export default {
  mixins: [dialogMinix],
  components: {
    ChooseTech
  },
  data () {
    return {
      form: {
        groupName: '',
        leader: '',
        leaderName: '',
        settleType: '',
        settleUid: ''
      },
      formRules: {
        groupName: [
          {required: true, message: '请输入团队名称', trigger: 'blur'}
        ],
        leader: [
          {required: true, message: '请选择一个团长', trigger: 'blur'}
        ],
        settleType: [
          {required: true, message: '请选择结算方式', trigger: 'blur'}
        ]
      },
      chooseTechVisible: false,
      members: []
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
    },
    ...mapState({
      groupSettleTypes: state => state.dict[TECH_GROUP_SETTLE_TYPE]
    })
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true
          if (this.edit) {
            updateTechGroup(this.form)
              .then(res => {
                this.submitOkMessage('修改团队信息')
              })
              .catch(err => {
                this.btnLoading = false
                this.$message.error(err.message)
              })
            return
          }
          createTechGroup(this.form)
            .then(res => {
              this.submitOkMessage('创建团队')
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
      this.form = {...row}
      this.form.settleType = row.settleType + ''
      let params = {
        groupId: row.id
      }
      techGroupMembers(params)
        .then(res => {
          this.members = res.result || []
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
      this.$refs.form.clearValidate()
      this.$emit('close')
    },
    openChooseTech () {
      this.chooseTechVisible = true
    },
    chooseConfirm (checked) {
      const {
        name,
        id
      } = checked
      this.form.leader = id
      this.form.leaderName = name
      this.$refs.form.validateField('leader')
      this.chooseTechVisible = false
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.groupSettleTypes.length <= 0) {
          this.$store.dispatch('GetDictItem', TECH_GROUP_SETTLE_TYPE)
        }
      }
    }
  }
}
</script>

<style>

</style>
