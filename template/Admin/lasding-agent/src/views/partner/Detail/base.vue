<template>
  <div>
    <el-form
      label-width="90px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <data-item label="商家名称">
            {{detail.partnerName}}
          </data-item>
          <data-item label="登录账号">
            {{detail.username}}
          </data-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <data-item label="联系人">
            {{detail.legalPerson}}
          </data-item>
        </el-col>
        <el-col :span="12">
          <data-item label="联系电话">
            {{detail.partnerPhone}}
          </data-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <data-item label="身份证号">
            {{detail.idcard}}
          </data-item>
          <data-item label="邮箱地址">
            {{detail.email}}
          </data-item>
          <data-item label="商家地址">
            {{detail.partnerAddress}}
          </data-item>
          <data-item label="商家类型">
            {{detail.partnerType + '' | optsFilter(partnerTypes, 'itemValue', 'itemText')}}
          </data-item>
          <data-item label="结算模式">
            {{detail.payId}}
          </data-item>
          <data-item label="授信额度">
          </data-item>
          <data-item label="使用情况">
            {{detail.partnerStatus}}
          </data-item>
          <data-item label="创建人">
            {{detail.crtName}}
          </data-item>
          <data-item label="创建时间">
            {{detail.crtTime}}
          </data-item>
        </el-col>
        <el-col :span="12">
          <data-item label="证件照片">
            <div class="image-wrapper">
              <img v-for="(item, index) in imgs" :key="index" :src="item.path" >
            </div>
          </data-item>
          <data-item label="合同附件">
            <div v-for="(item, index) in pacts" :key="index">
              <a :href="item.path" target="_blank">{{item.name}}</a>
            </div>
          </data-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { PARTNER_TYPES } from '@/store/modules/dict'
import { mapState } from 'vuex'
import DataItem from './dataItem'
export default {
  components: {
    DataItem
  },
  props: {
    detail: {
      type: Object,
      default () {
        return {}
      }
    },
    files: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      dataLabelWidth: '90px'
    }
  },
  computed: {
    imgs () {
      return this.files.filter(x => x.sourceKey !== 'pact')
    },
    pacts () {
      return this.files.filter(x => x.sourceKey === 'pact')
    },
    ...mapState({
      partnerTypes: state => state.dict[PARTNER_TYPES]
    })
  },
  created () {
    if (this.partnerTypes.length <= 0) {
      this.$store.dispatch('GetDictItem', PARTNER_TYPES)
    }
  }
}
</script>

<style lang="scss" scoped>
.image-wrapper{
  img{
    height: 48px;
    vertical-align: top;
    margin-right: 5px;
  }
}
</style>
