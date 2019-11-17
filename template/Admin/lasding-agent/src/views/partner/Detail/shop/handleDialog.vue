<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <div style="padding: 0px;">
      <el-form
        label-width="110px"
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="店铺名称：" prop="shopName">
              <el-input
                size="small"
                placeholder="请输入店铺名称"
                v-model.trim="form.shopName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店铺电话：" prop="shopPhone">
              <el-input
                size="small"
                placeholder="请输入电话"
                v-model.trim="form.shopPhone"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="省市区：" prop="regions">
              <el-cascader
                :options="regions"
                :props="{
                  checkStrictly: true,
                  value: 'id',
                  label: 'regionName'
                }"
                size="small"
                v-model="form.regions"
                style="width: 100%;"
                filterable
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址：" prop="shopAddress">
              <el-input
                size="small"
                placeholder="详细到门牌号"
                v-model.trim="form.shopAddress"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="链接地址：" prop="shopUrl">
          <el-input
            size="small"
            placeholder="链接地址"
            v-model.trim="form.shopUrl"
          ></el-input>
        </el-form-item>
        <el-form-item label="店铺类型：" prop="shopType">
          <el-radio-group v-model="form.shopType">
            <el-radio
              v-for="item in shopTypes"
              :key="item.itemValue"
              :label="item.itemValue"
            >{{item.itemText}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注描述：" prop="remark">
          <el-input
            type="textarea"
            :rows="4"
            v-model="form.remark"
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
  </el-dialog>
</template>

<script>
import dialogMinix from '@/utils/dialogMinix'
import { SHOP_TYPES } from '@/store/modules/dict'
import { mapState } from 'vuex'
import { GetRegions } from '@/api/system'
export default {
  mixins: [dialogMinix],
  data () {
    const telRule = (ru, val, cb) => {
      let reMobile = /^1[3-9]\d{9}$/
      let rePhone = /^(\d{2,4}-)?\d{6,9}$/
      if (reMobile.test(val) || rePhone.test(val)) {
        cb()
      } else {
        cb(new Error('电话格式错误'))
      }
    }
    return {
      form: {
        shopAddress: '',
        shopName: '',
        shopPhone: '',
        shopType: '',
        shopUrl: '',
        remark: '',
        regions: []
      },
      formRules: {
        shopName: [
          {required: true, message: '请输入店铺名称', trigger: 'blur'}
        ],
        shopPhone: [
          {required: true, message: '请输入电话号码', trigger: 'blur'},
          {validator: telRule, trigger: 'blur'}
        ],
        shopType: [
          {required: true, message: '请选择店铺类型', trigger: 'change'}
        ],
        regions: [
          {required: true, message: '请选择省市区', trigger: 'change'},
          {
            validator: (rl, val, cb) => {
              if (val.length === 3) {
                cb()
              } else {
                cb(new Error('请选择到区县'))
              }
            }
          }
        ]
      },
      regions: []
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
    },
    ...mapState({
      shopTypes: state => state.dict[SHOP_TYPES]
    })
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true
          let done = () => {
            this.btnLoading = false
          }
          let data = {
            ...this.form
          }
          if (this.form.regions.length > 0) {
            const [province, city, district] = this.form.regions
            Object.assign(data, {
              province,
              city,
              district
            })
          }
          delete data.regions
          this.$emit('confirm', data, done)
        }
      })
    },
    handleEdit (row) {
      this.editMiddle = {...this.form}
      // this.form = {...row}
      const {
        shopAddress,
        shopName,
        shopPhone,
        shopType,
        shopUrl,
        remark,
        province,
        city,
        district,
        id
      } = row
      var regions = [province, city, district].map(x => !!x)
      Object.assign(this.form, {
        shopAddress: shopAddress || '',
        shopName: shopName || '',
        shopPhone: shopPhone || '',
        shopType: shopType || '',
        shopUrl: shopUrl || '',
        remark: remark || '',
        id,
        regions
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
    fetchRegion () {
      GetRegions()
        .then(res => {
          this.regions = res.result || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.shopTypes.length <= 0) {
          this.$store.dispatch('GetDictItem', SHOP_TYPES)
        }
        if (this.regions.length <= 0) {
          this.fetchRegion()
        }
      }
    }
  }
}
</script>

<style>

</style>
