<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="model"
    width="800px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <el-form
      ref="form"
      label-width="100px"
      :model="form"
      :rules="formRules"
      style="height: 450px;padding-top: 50px;"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="区域名称：" prop="regionName">
            <el-input
              size="small"
              placeholder="请输入区域名称"
              v-model.trim="form.regionName"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区域编码：" prop="regionCode">
            <el-input
              size="small"
              placeholder="请输入区域名称"
              v-model.trim="form.regionCode"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="区块划分：" prop="division">
        <el-radio-group v-model="form.division">
          <el-radio
            v-for="(item, index) in divisions"
            :key="index"
            :label="item"
          ></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="区域等级：" prop="regionGrade">
            <el-select
              size="small"
              v-model="form.regionGrade"
              style="width: 100%;"
              @change="levelChange"
            >
              <el-option
                v-for="(item, index) in levels"
                :key="index"
                :label="item.description"
                :value="item.level"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区域类型：" prop="regionType">
            <el-select
              size="small"
              v-model="form.regionType"
              style="width: 100%;"
            >
              <el-option
                v-for="(item, index) in types"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="上级地区："
            prop="parentCode"
            :rules="{
              required: form.regionGrade > 1,
              message: '请选择上级区域',
              trigger: 'change'
            }"
          >
            <el-cascader
              v-model="form.parentCode"
              popper-class="add-cascader-height"
              size="small"
              :options="parentData"
              :show-all-levels="false"
              :props="{
                checkStrictly: true,
                emitPath: false,
                value: 'regionCode',
                label: 'regionName',
                lazy: true,
                lazyLoad: lazyLoad
              }"
              clearable
              filterable
              style="width: 100%;"
            >
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序：" prop="sortNo">
            <el-input size="small" v-model.number="form.sortNo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
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
import { createRegion, updateRegion, GetRegionsList } from '@/api/system'
export default {
  mixins: [dialogMinix],
  // props: {
  //   parentData: {
  //     type: Array,
  //     default () {
  //       return []
  //     }
  //   }
  // },
  data () {
    return {
      form: {
        regionName: '',
        regionCode: '',
        parentCode: '',
        regionGrade: '',
        regionType: '',
        division: '',
        sortNo: ''
      },
      formRules: {
        regionName: [
          {required: true, message: '请输入地区名称!', trigger: 'blur'}
        ],
        regionCode: [
          {required: true, message: '请输入地区编码', trigger: 'blur'}
        ],
        regionGrade: [
          {required: true, message: '请选择区域等级', trigger: 'change'}
        ],
        regionType: [
          {required: true, message: '请选择区域类型', trigger: 'change'}
        ]
      },
      divisions: [
        '华北',
        '华东',
        '东北',
        '中南',
        '西南',
        '西北',
        '港澳台'
      ],
      levels: [
        {
          level: 1,
          description: '一级 省级行政区',
          types: [
            '省',
            '自治区',
            '直辖市',
            '特别行政区'
          ]
        },
        {
          level: 2,
          description: '二级 地级行政区',
          types: [
            '地级市',
            '地区',
            '自治州',
            '盟'
          ]
        },
        {
          level: 3,
          description: '三级 县级行政区',
          types: [
            '市辖区',
            '县级市',
            '县',
            '自治县',
            '旗',
            '自治旗',
            '林区',
            '特区'
          ]
        },
        {
          level: 4,
          description: '四级 乡级行政区',
          types: [
            '街道',
            '镇',
            '乡',
            '民族乡',
            '苏木',
            '民族苏木',
            '县霞区公所'
          ]
        }
      ],
      parentData: []
    }
  },
  computed: {
    dialogTitle () {
      return this.edit ? '修改' : '新增'
    },
    types () {
      if (this.form.regionGrade) {
        let has = this.levels.find(x => x.level === this.form.regionGrade)
        return has ? has.types : []
      } else {
        return []
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true
          if (this.edit) {
            delete this.form.children
            updateRegion(this.form)
              .then(res => {
                this.submitOkMessage('更新地区信息')
              })
              .catch(err => {
                this.btnLoading = false
                this.$message.error(err.message)
              })
            return
          }
          createRegion(this.form)
            .then(res => {
              this.submitOkMessage('新增地区')
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
      if (parseInt(row.parentId) !== -1) {
        this.form.parentCode = this.form.parentCode
      } else {
        this.form.parentCode = ''
      }
      this.form.regionCode = row.regionCode
      delete this.form.parentId
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
    levelChange () {
      this.form.regionType = ''
    },
    fetchRegions () {
      let params = {
        regionGrade: 1
      }
      GetRegionsList(params)
        .then(res => {
          this.parentData = res.result || []
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    lazyLoad (node, resolve) {
      const {
        level
      } = node
      let regionCode
      if (node.data) {
        regionCode = node.data.regionCode
      }
      // const {
      //   regionGrade,
      //   regionCode
      // } = node.data
      let params = {
        regionGrade: level + 1,
        parentCode: regionCode
      }
      GetRegionsList(params)
        .then(res => {
          var result = res.result || []
          resolve(result)
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  },
  watch: {
    visible () {
      // if (this.parentData.length <= 0) {
      //   this.fetchRegions()
      // }
    }
  }
}
</script>
