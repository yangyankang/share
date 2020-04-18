<template>
  <el-card shadow="never">
    <h3>师傅 —— {{detail.name}}</h3>
    <el-tabs v-model="tabActive">
      <el-tab-pane label="基础信息" name="basic" :disabled="tabDisabled">
        <basic
          :detail="detail"
        ></basic>
      </el-tab-pane>
      <el-tab-pane label="服务信息" name="skill" :disabled="tabDisabled">
        <serve :detail="detail" :is-own="tabActive === 'skill'"></serve>
      </el-tab-pane>
      <el-tab-pane label="审核信息" name="check" v-if="tabDisabled">
        <check :detail="detail" :is-own="tabActive === 'check'" @update="update"></check>
      </el-tab-pane>
      <!-- <el-tab-pane label="价格策略" name="price" :disabled="tabDisabled">
        <strategy
          :is-own="tabActive === 'price'"
          :detail="detail"
        ></strategy>
      </el-tab-pane> -->
      <el-tab-pane label="技师日程" name="schedule" :disabled="tabDisabled">
        <el-calendar v-model="techDate">
        </el-calendar>
      </el-tab-pane>
      <el-tab-pane label="关系团队" name="group" :disabled="tabDisabled">
        <group :detail="detail" :is-own="tabActive === 'group'"></group>
      </el-tab-pane>
      <el-tab-pane label="技师账单" name="train" :disabled="tabDisabled">
        <el-table
          height="500px"
          border
        ></el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import Basic from './basic'
import Serve from './serve'
import Check from './check'
import Strategy from './strategy'
import Group from './group'
import { GetTechDetail, findTechPlan } from '@/api/technician'
function addZero (n) {
  return n < 10 ? '0' + n : n + ''
}
export default {
  components: {
    Basic,
    Serve,
    Check,
    Strategy,
    Group
  },
  data () {
    return {
      tabActive: 'basic',
      detail: {},
      techDate: new Date(),
      nowMonth: ''
    }
  },
  computed: {
    tabDisabled () {
      return this.detail.flowStatus === 'AUDITING'
    }
  },
  methods: {
    fetchTechDetail () {
      GetTechDetail(this.$route.query.tId)
        .then(res => {
          this.detail = res.result || {}
          const {
            active
          } = this.$route.query
          if (active === 'check') {
            if (this.detail.flowStatus !== 'AUDITING') {
              this.tabActive = 'basic'
            }
          }
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    update () {
      this.fetchTechDetail()
    },
    fetchTechPlan () {
      const {
        techDate
      } = this
      let iY = techDate.getFullYear()
      let iM = techDate.getMonth()
      let newDate = new Date()
      newDate.setFullYear(iY, iM + 1, 0)
      let params = {
        beginDate: iY + '-' + addZero(iM + 1) + '-' + addZero(1),
        endDate: iY + '-' + addZero(newDate.getMonth() + 1) + '-' + addZero(newDate.getDate()),
        technicianId: this.detail.id || this.$route.query.tId
      }
      findTechPlan(params)
        .then(res => {
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  },
  created () {
    const {
      active
    } = this.$route.query
    if (active) {
      this.tabActive = active
    }
    this.fetchTechDetail()
  },
  watch: {
    tabActive (val) {
      switch (val) {
        case 'schedule':
          this.fetchTechPlan()
          break
      }
    },
    techDate (val) {
      this.nowMonth = val.getMonth()
    },
    nowMonth (val) {
      this.fetchTechPlan()
    }
  }
}
</script>

<style>

</style>
