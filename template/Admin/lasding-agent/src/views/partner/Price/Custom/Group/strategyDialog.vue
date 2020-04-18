<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <div style="padding: 2px 50px;">
      <el-form
        label-width="120px"
        ref="form"
        :model="form"
      >
        <el-form-item label="策略类型：" prop="strategyType">
          <el-radio-group v-model="form.strategyType">
            <el-radio :label="0">系统策略</el-radio>
            <el-radio :label="1">自定义策略</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="form.strategyType === 0">
          <el-form-item label="选择策略：" prop="strategyName">
            <el-input
              size="small"
              placeholder="请选择策略"
              v-model="form.strategyName"
              readonly
              @click.native="openChooseStrategy"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="选择策略：" prop="strategyId" v-show="false">
            <el-input
              size="small"
              placeholder="请选择策略"
              v-model="form.strategyId"
            >
            </el-input>
          </el-form-item>
        </template>
        <el-form-item label="策略名称：" prop="strategyName" v-else>
          <el-input
            size="small"
            placeholder="请输入策略名称"
            readonly
            v-model="form.strategyName"
            @click.native="openCustomChoose"
          ></el-input>
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
    <chooseCustomDialog
      v-model="customVisible"
      @confirm="customChooseConfirm"
    ></chooseCustomDialog>
    <choose-strategy
      v-model="chooseVisible"
      @confirm="chooseConfirm"
      mode="partner"
    ></choose-strategy>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
// import { GetCategory, GetSubcategory } from '@/api/product'
import ChooseStrategy from '@/views/technician/Price/Strategy/choose'
import {
  createTpCustomPriceGroupStrategy
} from '@/api/price'
import chooseCustomDialog from './chooseCustomDialog'
export default {
  mixins: [dialogMinix],
  components: {
    chooseCustomDialog,
    ChooseStrategy
  },
  data () {
    return {
      form: {
        priceGroupId: '',
        strategyId: '',
        strategyType: 1,
        strategyName: ''
      },
      formRules: {
        strategyId: [
          {required: true, message: '请选择价格策略', trigger: 'change'}
        ]
      },
      categorys: [],
      subcategorys: [],
      customVisible: false,
      chooseVisible: false
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            ...this.form,
            priceGroupId: this.$route.query.groupId
          }
          if (this.edit) {
            return
          }
          createTpCustomPriceGroupStrategy(params)
            .then(() => {
              this.submitOkMessage('新增策略')
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        }
      })
    },
    handleEdit (row) {
      this.editMiddle = {...this.form}
      this.form = {...row}
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
    // fetchCategorys () {
    //   let params = {
    //     page: {
    //       pageSize: 1e5,
    //       pageNum: 1
    //     }
    //   }
    //   GetCategory(params)
    //     .then(res => {
    //       this.categorys = res.result.list || []
    //     })
    //     .catch(err => {
    //       this.$message.error(err.message)
    //     })
    // },
    // fetchSubcategorys (val) {
    //   let params = {
    //     page: {
    //       pageSize: 1e5,
    //       pageNum: 1
    //     },
    //     categoryId: val
    //   }
    //   this.subcategorys = []
    //   GetSubcategory(params)
    //     .then(res => {
    //       this.subcategorys = res.result.list || []
    //     })
    //     .catch(err => {
    //       this.$message.error(err.message)
    //     })
    // },
    // categoryChange (val) {
    //   this.form.subcategoryId = ''
    //   this.fetchSubcategorys(val)
    // },
    openCustomChoose () {
      this.customVisible = true
    },
    customChooseConfirm (row) {
      const {
        id,
        strategyName
      } = row
      this.form.strategyId = id
      this.form.strategyName = strategyName
      this.customVisible = false
    },
    chooseConfirm (row) {
      const {
        id,
        strategyName
      } = row
      this.form.strategyId = id
      this.form.strategyName = strategyName
      this.chooseVisible = false
    },
    openChooseStrategy () {
      this.chooseVisible = true
    }
  },
  watch: {
    visible (val) {
    }
  }
}
</script>

<style>

</style>
