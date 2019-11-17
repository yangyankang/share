import { hasTableConfig } from '@/api/system'
export default {
  data () {
    return {
      dataLoading: false,
      btnLoading: false,
      isEdit: false,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      dataList: [],
      showCols: [],
      setColsVisible: false
    }
  },
  methods: {
    fetchTableConfig () {
      if (this.url.config) {
        hasTableConfig(this.url.config)
          .then(res => {
            const result = res.result
            this.showCols = [...result]
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      }
    },
    setTableColsOk (ss) {
      // this.showCols = [...ss]
      this.showCols = []
      this.fetchTableConfig()
      this.setColsVisible = false
    }
  },
  created () {
    this.fetchTableConfig()
  }
}
