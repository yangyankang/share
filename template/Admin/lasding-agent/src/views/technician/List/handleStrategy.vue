<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    append-to-body
    :close-on-click-modal="false"
  >
    <div style="padding: 10px;">
      <el-form
        label-width="110px"
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-form-item label="策略类型：" prop="strategyType">
          <el-radio-group v-model="form.strategyType">
            <el-radio :label="0">系统策略</el-radio>
            <el-radio :label="1">自定义策略</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="策略名称：" prop="strategyName" v-if="form.strategyType === 1">
          <el-input
            size="small"
            placeholder="请输入策略名称"
            v-model="form.strategyName"
          ></el-input>
        </el-form-item>
        <template v-else>
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
        <!-- <el-form-item label="产品类别：" prop="categoryId">
          <template v-if="categorys.length > 5">
            <el-select
              size="small"
              v-model="form.categoryId"
              style="width: 100%;"
              @change="categoryChange"
              :disabled="form.strategyType === 0"
            >
              <el-option
                v-for="item in categorys"
                :key="item.id"
                :value="item.id"
                :label="item.categoryName"
              ></el-option>
            </el-select>
          </template>
          <template v-else>
            <el-radio-group
              :disabled="form.strategyType === 0"
              v-model="form.categoryId"
              @change="categoryChange">
              <el-radio
                v-for="item in categorys"
                :key="item.id"
                :label="item.id"
              >{{item.categoryName}}</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="产品子类别：" prop="subcategoryId">
          <template v-if="subcategorys.length > 5">
            <el-select
              size="small"
              v-model="form.subcategoryId"
              style="width: 100%;"
              :disabled="form.strategyType === 0"
            >
              <el-option
                v-for="item in subcategorys"
                :key="item.id"
                :value="item.id"
                :label="item.subcategoryName"
              ></el-option>
            </el-select>
          </template>
          <template v-else>
            <el-radio-group v-model="form.subcategoryId" :disabled="form.strategyType === 0">
              <el-radio
                v-for="item in subcategorys"
                :key="item.id"
                :label="item.id"
              >{{item.subcategoryName}}</el-radio>
            </el-radio-group>
          </template>
        </el-form-item> -->
        <el-form-item label="安装等级：" prop="fixLevel">
          <el-radio-group v-model="form.fixLevel">
            <el-radio
              v-for="item in fixLevels"
              :key="item.itemValue"
              :label="item.itemValue"
            >{{item.itemText}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="策略模式：" prop="strategyTo">
          <el-radio-group v-model="form.strategyTo">
            <el-radio :label="0">自用</el-radio>
            <el-radio :label="1" disabled>共享</el-radio>
          </el-radio-group>
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
    <choose-strategy
      v-model="chooseVisible"
      @confirm="chooseConfirm"
      ref="choose"
    ></choose-strategy>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import ChooseStrategy from '@/views/technician/Price/Strategy/choose'
import { GetCategory, GetSubcategory } from '@/api/product'
import { FIX_LEVEL } from '@/store/modules/dict'
import { mapState } from 'vuex'
export default {
  components: {
    ChooseStrategy
  },
  mixins: [dialogMinix],
  props: {
    row: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      form: {
        strategyName: '',
        categoryId: '',
        strategyTo: 0,
        strategyType: 0,
        strategyId: '',
        subcategoryId: '',
        fixLevel: ''
      },
      formRules: {
        strategyName: [
          {required: true, message: '请输入策略名称', trigger: 'blur'}
        ],
        categoryId: [
          {required: true, message: '请选择产品分类', trigger: 'blur'}
        ],
        subcategoryId: [
          {required: true, message: '请选择产品子分类', trigger: 'blur'}
        ],
        fixLevel: [
          {required: true, message: '请选择安装难度', trigger: 'blur'}
        ]
      },
      categorys: [],
      subcategorys: [],
      chooseVisible: false
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
    },
    ...mapState({
      fixLevels: state => state.dict[FIX_LEVEL]
    })
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          // this.btnLoading = true
          let params = {
            ...this.form,
            technicianId: this.row.id
          }
          if (this.form.strategyType === 1) {
            delete params.strategyId
          }
          let done = () => {
            this.btnLoading = false
          }
          this.$emit('confirm', this.form, done)
        }
      })
    },
    handleEdit (row) {
      const {
        strategyType,
        subcategoryId,
        categoryId,
        strategyTo,
        strategyName,
        fixLevel
      } = row
      this.editMiddle = {...this.form}
      this.form.strategyName = strategyName
      this.form.categoryId = categoryId
      this.form.strategyTo = strategyTo
      this.form.subcategoryId = subcategoryId
      this.form.strategyType = strategyType
      this.form.fixLevel = fixLevel
      if (row.strategyType === 0) {
        this.form.strategyId = row.strategyId
      }
      this.form.id = row.id
      this.fetchSubcategorys(categoryId)
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
    openChooseStrategy () {
      this.$refs.choose.setSearchData({
        categoryId: this.form.categoryId,
        subcategoryId: this.form.subcategoryId
      })
      this.chooseVisible = true
    },
    chooseConfirm (row) {
      const {
        categoryId
      } = row
      this.editMiddle = {...this.form}
      this.form = {...this.form, ...row}
      this.chooseVisible = false
      this.fetchSubcategorys(categoryId)
      this.$refs.form.validateField('strategyName')
    },
    fetchCategorys () {
      let params = {
        page: {
          pageSize: 1e5,
          pageNum: 1
        }
      }
      GetCategory(params)
        .then(res => {
          this.categorys = res.result.list || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    fetchSubcategorys (val) {
      let params = {
        page: {
          pageSize: 1e5,
          pageNum: 1
        },
        categoryId: val
      }
      this.subcategorys = []
      GetSubcategory(params)
        .then(res => {
          this.subcategorys = res.result.list || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    categoryChange (val) {
      this.form.subcategoryId = ''
      this.fetchSubcategorys(val)
    },
    setData (data) {
      const {
        categoryId,
        id
      } = data
      this.form.categoryId = categoryId
      this.form.subcategoryId = id
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.categorys.length <= 0) {
          this.fetchCategorys()
        }
        if (this.fixLevels.length <= 0) {
          this.$store.dispatch('Get_' + FIX_LEVEL)
        }
      }
    }
  }
}
</script>

<style>

</style>
