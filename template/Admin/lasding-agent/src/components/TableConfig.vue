<template>
  <el-dialog
    title="用户表格展示列配置"
    width="1000px"
    :visible.sync="model"
    top="15px"
  >
    <p>序号小的靠前，展示（选择配置保存）的配置， 不展示的不配置</p>
    <el-table
      border
      height="600px"
      :data="allFields"
      header-row-class-name="table-header-style"
      header-cell-class-name="table-header-cell-style"
      row-key="field"
      ref="fieldsTable"
      @selection-change="selectsChange"
      v-loading="dataLoading"
    >
      <el-table-column type="selection" reserve-selection align="center"></el-table-column>
      <el-table-column label="字段" prop="field" align="center"></el-table-column>
      <el-table-column label="展示标题" prop="fieldName" align="center">
        <template slot-scope="{row}">
          <el-input size="mini" v-model.trim="row.fieldName"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="对齐方式" prop="fieldAlign">
        <template slot-scope="{row}">
          <el-select size="mini" v-model="row.fieldAlign">
            <el-option value="left" label="left"></el-option>
            <el-option value="center" label="center"></el-option>
            <el-option value="right" label="right"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="排序字段" prop="fieldSort" align="center">
        <template slot-scope="{row}">
          <el-input size="mini" v-model.trim="row.fieldSort"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="列宽度" prop="fieldWidth" align="center">
        <template slot-scope="{row}">
          <el-input-number size="small" v-model="row.fieldWidth" placeholder="数字"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="序号" prop="fieldNo" align="center">
        <template slot-scope="{row}">
          <el-input-number size="small" v-model="row.fieldNo" placeholder="数字"></el-input-number>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer">
      <el-button
        size="small"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="$emit('change', false)"
      >
        取消
      </el-button>
      <el-button
        size="small"
        type="primary"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="saveSetting"
      >
        保存
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/utils/dialogMinix'
import draggable from 'vuedraggable'
import { allTableFields, tableConfig, saveGlobalTableConfig } from '@/api/system'
export default {
  mixins: [dialogMixin],
  components: {
    draggable
  },
  props: {
    url: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      dataLoading: false,
      allFields: [],
      setFields: [],
      tableSelects: []
    }
  },
  computed: {
    dragOptions () {
      return {
        animation: 200,
        group: 'people',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  methods: {
    async fetchAllFields () {
      if (this.url.config) {
        this.dataLoading = true
        this.allFields = []
        let result = await this.beforeConfig(this.url.config)
        let beforeSets = result.result || []
        this.$refs.fieldsTable.clearSelection()
        beforeSets.forEach(x => {
          this.$refs.fieldsTable.toggleRowSelection(x, true)
        })
        allTableFields(this.url.config)
          .then(res => {
            let list = res.result || []
            list.forEach(x => {
              let has = beforeSets.find(z => x.field === z.field)
              this.$set(x, 'fieldNo', null)
              if (has) {
                Object.assign(x, has)
              }
            })
            this.allFields = list
            this.dataLoading = false
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      }
    },
    beforeConfig () {
      return new Promise((resolve, reject) => {
        tableConfig(this.url.config)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            this.$message.error(err.message)
            reject(err)
          })
      })
    },
    selectsChange (ss) {
      this.setFields = ss
    },
    saveSetting () {
      if (this.setFields.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择需要展示的项'
        })
        return
      }
      if (this.url.config) {
        this.btnLoading = true
        let params = {
          displayList: this.setFields.map(x => {
            let has = this.allFields.find(z => z.field === x.field)
            return has || x
          })
        }
        saveGlobalTableConfig(this.url.config, params)
          .then(() => {
            this.$notify({
              title: '系统提示',
              message: '保存成功！',
              type: 'success'
            })
            this.$emit('save-ok')
            this.btnLoading = false
          })
          .catch(err => {
            this.btnLoading = false
            this.$message.error(err.message)
          })
      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.fetchAllFields()
      }
    }
  }
}
</script>
