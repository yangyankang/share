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
        label-width="110px"
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-form-item label="分组类型：" prop="strategyType">
          <el-radio-group v-model="form.strategyType" @change="strategyTypeChange">
            <el-radio :label="0">系统策略</el-radio>
            <el-radio :label="1">自定义策略</el-radio>
          </el-radio-group>
        </el-form-item>
        <template  v-if="form.strategyType === 0">
          <el-form-item label="分组名称：" prop="groupName">
            <el-input
              size="small"
              v-model="form.groupName"
              placeholder="请输入价格组名称"
              readonly
              @click.native="openChooseGroup"
            ></el-input>
          </el-form-item>
          <el-form-item label="分组名称：" prop="priceGroupId" v-show="false">
            <el-input
              size="small"
              v-model="form.priceGroupId"
              readonly
            ></el-input>
          </el-form-item>
        </template>
        <el-form-item label="分组名称：" prop="groupName" v-else>
          <el-input
            size="small"
            v-model="form.groupName"
            placeholder="请输入价格组名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="分组模式：" prop="groupMode">
          <el-radio-group v-model="form.groupMode" :disabled="form.strategyType === 0">
            <el-radio
              v-for="item in GroupModes"
              :key="item.itemValue"
              :label="item.itemValue"
            >{{item.itemText}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品类别：" prop="categoryId">
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
            <el-radio-group v-model="form.categoryId" @change="categoryChange" :disabled="form.strategyType === 0">
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
    <choose-group
      v-model="chooseGroupVisible"
      @confirm="chooseGroupConfirm"
    ></choose-group>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import { TP_PRICE_GROUP_MODE } from '@/store/modules/dict'
import { mapState } from 'vuex'
import {
  createTpCustomPriceGroup
} from '@/api/price'
import { GetCategory, GetSubcategory } from '@/api/product'
import ChooseGroup from './chooseGroup'
export default {
  mixins: [dialogMinix],
  components: {
    ChooseGroup
  },
  data () {
    return {
      form: {
        groupMode: '',
        groupName: '',
        priceGroupId: '',
        strategyType: 1,
        categoryId: '',
        subcategoryId: ''
      },
      formRules: {
        groupMode: [
          {required: true, message: '请选择分组模式', trigger: 'change'}
        ],
        groupName: [
          {required: true, message: '请输入分组名称', trigger: 'change'}
        ],
        strategyType: [
          {required: true, message: '请选择分组类型', trigger: 'change'}
        ],
        categoryId: [
          {required: true, message: '请选择产品类别', trigger: 'change'}
        ],
        subcategoryId: [
          {required: true, message: '请选择子产品类别', trigger: 'change'}
        ]
      },
      chooseGroupVisible: false,
      categorys: [],
      subcategorys: []
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
    },
    ...mapState({
      GroupModes: state => state.dict[TP_PRICE_GROUP_MODE]
    })
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            ...this.form,
            partnerId: this.$route.query.pId
          }
          if (this.edit) {
            return
          }
          this.btnLoading = true
          createTpCustomPriceGroup(params)
            .then(() => {
              this.submitOkMessage('创建价格组')
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
      this.form.groupMode = row.groupMode + ''
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
    openChooseGroup () {
      this.chooseGroupVisible = true
    },
    chooseGroupConfirm (data) {
      console.log(data)
      const {
        id,
        groupName,
        groupMode,
        categoryId,
        subcategoryId
      } = data
      this.form.groupName = groupName
      this.form.priceGroupId = id
      this.form.groupMode = groupMode + ''
      this.form.categoryId = categoryId
      this.form.subcategoryId = subcategoryId
      this.fetchSubcategorys(categoryId)
      this.chooseGroupVisible = false
    },
    chooseGroupClose () {
      this.isEdit = false
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
    strategyTypeChange (val) {
      if (val === 1) {
        this.form.priceGroupId = ''
        this.form.groupName = ''
      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.GroupModes.length <= 0) {
          this.$store.dispatch('GetDictItem', TP_PRICE_GROUP_MODE)
        }
        if (this.categorys.length <= 0) {
          this.fetchCategorys()
        }
      }
    }
  }
}
</script>

<style>

</style>
