<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <div style="padding: 0;">
      <div style="text-align: center;">
        <el-radio-group size="small" v-model="form.strategyType" @change="typeChange">
          <el-radio-button :label="0">
            系统策略
          </el-radio-button>
          <el-radio-button :label="1">
            自定义策略
          </el-radio-button>
        </el-radio-group>
      </div>
      <div v-show="form.strategyType === 0">
        <el-table
          :data="dataList"
          v-loading="dataLoading"
          border
          row-key="id"
          @selection-change="selectsChange"
        >
          <el-table-column type="selection" reserve-selection align="center"></el-table-column>
          <el-table-column type="index" align="center"></el-table-column>
          <el-table-column label="策略名称" prop="strategyName" width="200"></el-table-column>
          <el-table-column label="产品分类" width="150">
            <template slot-scope="{row}">
              {{row.categoryIdDictText + '-' + row.subcategoryIdDictText}}
            </template>
          </el-table-column>
          <el-table-column label="规则">
            <template slot-scope="{row}">
              <rule
                v-for="item in row.ruleList"
                :key="item.id"
                :data="item"
                :show-handle="false"
              ></rule>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-form
        label-width="110px"
        ref="form"
        :model="form"
        :rules="formRules"
         v-show="form.strategyType === 1"
      >
        <el-form-item label="策略名称：" prop="strategyName">
          <el-input
            size="small"
            placeholder="请输入策略名称"
            v-model="form.strategyName"
          ></el-input>
        </el-form-item>
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
        <el-form-item prop="categoryId"></el-form-item>
        <el-form-item prop="subcategoryId"></el-form-item>
        <el-form-item prop="strategyType"></el-form-item>
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
        @click="confirm"
      >提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import { FIX_LEVEL } from '@/store/modules/dict'
import { mapState } from 'vuex'
import { GetPriceStrategy } from '@/api/price'
import Rule from '@/views/technician/Price/Strategy/rule'
export default {
  mixins: [dialogMinix],
  components: {
    Rule
  },
  props: {
    category: {
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
        strategyType: 1,
        strategyId: '',
        subcategoryId: '',
        fixLevel: ''
      },
      formRules: {
        strategyName: [
          {required: true, message: '请输入策略名称', trigger: 'blur'}
        ],
        fixLevel: [
          {required: true, message: '请选择安装等级', trigger: 'blur'}
        ]
      },
      dataList: [],
      dataLoading: false,
      selects: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0
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
    confirm () {
      if (this.form.strategyType === 0) {
        if (this.selects.length <= 0) {
          this.$message({
            type: 'warning',
            message: '请选择策略'
          })
          return
        }
        this.$emit('confirm', this.selects)
      } else {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$emit('confirm', {
              ...this.form,
              categoryIdDictText: this.category.categoryName,
              subcategoryIdDictText: this.category.subcategoryName
            })
          }
        })
      }
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
      this.form.categoryId = ''
      this.form.subcategoryId = ''
      this.$refs.form.clearValidate()
      this.$emit('close')
    },
    fetchStrategy () {
      let params = {
        page: this.page
      }
      GetPriceStrategy(params)
        .then(res => {
          this.dataList = res.result.list || []
          this.total = res.result.total || 0
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    typeChange (val) {
      if (val === 0) {
        this.fetchStrategy()
      }
    },
    selectsChange (ss) {
      this.selects = [...ss]
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.fixLevels.length <= 0) {
          this.$store.dispatch('Get_' + FIX_LEVEL)
        }
        if (this.category.id) {
          this.form.subcategoryId = this.category.id
          this.form.categoryId = this.category.categoryId
        }
      }
    }
  }
}
</script>

<style>

</style>
