<template>
  <el-table
    border
    :data="data"
    :row-key="rowKey"
    header-row-class-name="table-header-style"
    header-cell-class-name="table-header-cell-style"
    highlight-current-row
    @sort-change="tableSortChange"
    v-on="$listeners"
  >
    <el-table-column type="selection" align="center" v-if="showCheckbox"></el-table-column>
    <template v-if="showColumns.length > 0">
      <el-table-column
        v-for="item in showColumns"
        :key="item.field"
        :prop="item.field"
        :label="item.fieldName"
        :width="item.fieldWidth ? item.fieldWidth + '' : ''"
        :align="item.fieldAlign"
        :sortable="item.fieldSort ? true : false"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <slot :name="item.field" v-bind="{row}">
            {{row[item.field]}}
          </slot>
        </template>
      </el-table-column>
    </template>
    <el-table-column v-else></el-table-column>
    <slot></slot>
  </el-table>
</template>

<script>
export default {
  name: 'ListTable',
  props: {
    showColumns: {
      type: Array,
      default () {
        return []
      }
    },
    data: {
      type: Array,
      default () {
        return []
      }
    },
    rowKey: [Number, String],
    renderCols: {
      type: Object,
      default () {
        return {}
      }
    },
    showCheckbox: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    tableSortChange (data) {
      console.log(data)
      this.$emit('sort-change')
    },
    expandKey (row) {
      return row[this.rowKey]
    },
    renderColumn () {
      let h = this.$createElement
      return h('div', '12312313')
    }
  }
  // render () {
  //   let colums = this.showColumns.length > 0
  //     ? this.showColumns.map(x => (
  //         this.renderCols[x.field]
  //       ? this.renderCols[x.field].render()
  //         : <TableColumn
  //             prop={x.field}
  //             label={x.fieldName}
  //             sortable={x.fieldSort ? 'custom' : false}
  //           ></TableColumn>
  //       ))
  //     : [<TableColumn></TableColumn>]
  //     colums.push(this.$slots.default)
  //     console.log(this.$slots)
  //   return (
  //     <Table
  //       border
  //       data={this.data}
  //       header-row-class-name="table-header-style"
  //       header-cell-class-name="table-header-cell-style"
  //       rowKey={this.rowKey}
  //       on-sort-change={this.tableSortChange}
  //       // {...{on: {onSortChange: this.tableSortChange}}}
  //     >
  //       <TableColumn type="selection" align="center" />
  //       {colums}
  //     </Table>
  //   )
  // }
}
</script>
