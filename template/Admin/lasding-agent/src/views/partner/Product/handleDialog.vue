<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <div style="padding: 10px;">
      <el-form
        label-width="110px"
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-form-item label="选择商家：" prop="partnerId" v-if="isOwn">
          <el-input
            size="small"
            placeholder="请选择商家"
            v-model="form.partnerName"
            readonly
            @click.native="openChoosePartner"
          ></el-input>
        </el-form-item>
        <div v-show="false">
          <el-form-item prop="partnerName"></el-form-item>
        </div>
        <el-form-item label="产品名称：" prop="productName">
          <el-input
            size="small"
            placeholder="请输入产品名称"
            v-model="form.productName"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="产品编号：" prop="productNo">
          <el-input
            size="small"
            placeholder="来源编号"
            v-model="form.productNo"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="商品类别：" prop="categoryId">
          <template v-if="categorys.length > 5">
            <el-select
              size="small"
              v-model="form.categoryId"
              style="width: 100%;"
              @change="categoryChange"
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
            <el-radio-group v-model="form.categoryId" @change="categoryChange">
              <el-radio
                v-for="item in categorys"
                :key="item.id"
                :label="item.id"
              >{{item.categoryName}}</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="商品子类别：" prop="subcategoryId">
          <template v-if="subcategorys.length > 5">
            <el-select
              size="small"
              v-model="form.subcategoryId"
              style="width: 100%;"
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
            <el-radio-group v-model="form.subcategoryId">
              <el-radio
                v-for="item in subcategorys"
                :key="item.id"
                :label="item.id"
              >{{item.subcategoryName}}</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="商品品牌：" prop="brandId">
          <template v-if="brands.length > 5">
            <el-select
              size="small"
              v-model="form.brandId"
              style="width: 100%;"
            >
              <el-option
                v-for="item in brands"
                :key="item.id"
                :value="item.id"
                :label="item.brandName"
              ></el-option>
            </el-select>
          </template>
          <template v-else>
            <el-radio-group v-model="form.brandId">
              <el-radio
                v-for="item in brands"
                :key="item.id"
                :label="item.id"
              >{{item.brandName}}</el-radio>
            </el-radio-group>
          </template>
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
    <ChoosePartner
      v-model="choosePartnerVisible"
      @confirm="chooseConfirm"
    ></ChoosePartner>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import {
  GetCategory,
  GetSubcategory,
  GetBrands
} from '@/api/product'
import { mapState } from 'vuex'
import {
  FIX_LEVEL
} from '@/store/modules/dict'
import ChoosePartner from '@/components/ChoosePartner'
export default {
  mixins: [dialogMinix],
  components: {
    ChoosePartner
  },
  props: {
    isOwn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        productName: '',
        productNo: '',
        categoryId: '',
        subcategoryId: '',
        brandId: '',
        // sourceId: '',
        fixLevel: '',
        partnerId: '',
        partnerName: ''
      },
      formRules: {
        productName: [
          {required: true, message: '请输入产品名称', trigger: 'blur'}
        ],
        categoryId: [
          {required: true, message: '请选择类别', trigger: 'change'}
        ],
        subcategoryId: [
          {required: true, message: '请选择子类别', trigger: 'change'}
        ],
        productNo: [
          {required: true, message: '请输入来源编号', trigger: 'blur'}
        ],
        fixLevel: [
          {required: true, message: '请选择安装等级', trigger: 'change'}
        ],
        brandId: [
          {required: true, message: '请选择商品品牌', trigger: 'change'}
        ],
        partnerId: [
          {required: true, message: '请选择商家', trigger: 'change'}
        ]
      },
      categorys: [],
      subcategorys: [],
      brands: [],
      choosePartnerVisible: false
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
          this.btnLoading = true
          const done = () => {
            this.btnLoading = false
          }
          if (!this.isOwn) {
            delete this.form.partnerId
            delete this.form.partnerName
          }
          this.$emit('confirm', this.form, done)
          // if (this.edit) {
          //   updateProduct(this.form)
          //     .then(() => {
          //       this.submitOkMessage('修改产品信息')
          //     })
          //     .catch(err => {
          //       this.btnLoading = false
          //       this.$message.error(err.message)
          //     })
          //   return
          // }
          // createProduct(this.form)
          //   .then(() => {
          //     this.submitOkMessage('新增产品')
          //   })
          //   .catch(err => {
          //     this.btnLoading = false
          //     this.$message.error(err.message)
          //   })
        }
      })
    },
    handleEdit (row) {
      this.editMiddle = {...this.form}
      this.form = {...row}
      this.form.fixLevel = row.fixLevel + ''
      this.fetchSubcategory(row.categoryId)
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
    fetchCategory () {
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
          this.$message.error(err)
        })
    },
    categoryChange (val) {
      this.form.subcategoryId = ''
      this.fetchSubcategory(val)
    },
    fetchSubcategory (val) {
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
    fetchBrands () {
      let params = {
        page: {
          pageSize: 1e5,
          pageNum: 1
        }
      }
      GetBrands(params)
        .then(res => {
          this.brands = res.result.list || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    openChoosePartner () {
      this.choosePartnerVisible = true
    },
    chooseConfirm (row) {
      const {
        partnerName,
        partnerId
      } = row
      this.form.partnerName = partnerName
      this.form.partnerId = partnerId
      this.choosePartnerVisible = false
      this.$refs.form.validateField(['partnerId'])
    }
  },
  watch: {
    visible (val) {
      if (!this.categorys.length) {
        this.fetchCategory()
      }
      if (!this.brands.length) {
        this.fetchBrands()
      }
      if (this.fixLevels.length <= 0) {
        this.$store.dispatch('Get_' + FIX_LEVEL)
      }
    }
  }
}
</script>

<style>

</style>
