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
        label-width="120px"
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-form-item label="分组名称：" prop="groupName">
          <el-input
            size="small"
            placeholder="请输入分组名称"
            v-model="form.groupName"
          ></el-input>
        </el-form-item>
        <el-form-item label="分组模式：" prop="groupMode">
          <el-radio-group v-model="form.groupMode">
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
        <el-form-item label="产品子类别：" prop="subcategoryId">
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
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import { TP_PRICE_GROUP_MODE } from '@/store/modules/dict'
import { mapState } from 'vuex'
import { createTpPriceGroup, updateTpPriceGroup } from '@/api/price'
import { GetCategory, GetSubcategory } from '@/api/product'
export default {
  mixins: [dialogMinix],
  data () {
    return {
      form: {
        groupName: '',
        groupMode: '',
        categoryId: '',
        subcategoryId: ''
      },
      formRules: {
        groupName: [
          {required: true, message: '请输入分组名称', trigger: 'blur'}
        ],
        groupMode: [
          {required: true, message: '请选择模式', trigger: 'change'}
        ],
        categoryId: [
          {required: true, message: '请选择产品类别', trigger: 'change'}
        ],
        subcategoryId: [
          {required: true, message: '请选择子产品类别', trigger: 'change'}
        ]
      },
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
          this.btnLoading = true
          if (this.edit) {
            updateTpPriceGroup(this.form)
              .then(res => {
                this.submitOkMessage('修改价格组')
              })
              .catch(err => {
                this.btnLoading = false
                this.$message.error(err.message)
              })
            return
          }
          createTpPriceGroup(this.form)
            .then(res => {
              this.submitOkMessage('新增价格组')
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
      this.form.groupMode = row.groupMode.toString()
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
