<template>
  <el-dialog
    :title="dialogTitle + orderTypeText"
    :visible.sync="model"
    top="10px"
    width="1000px"
    @close="dialogClose"
    :close-on-click-modal="false"
  >
    <div style="padding: 5px; max-height: 600px; overflow: auto;">
      <el-form
        label-width="110px"
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-row>
          <el-col :span="9">
            <el-form-item label="工单类型：" prop="type">
              <el-radio-group size="small" v-model="form.type">
                <el-radio-button label="1">安装单</el-radio-button>
                <el-radio-button label="2">维修单</el-radio-button>
                <el-radio-button label="3">检测单</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单来源：" prop="sourceType">
              <el-select
                size="small"
                placeholder="请选择"
                v-model="form.sourceType"
              >
                <el-option label="线下" value="NONE"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="来源单号：" prop="sourceNo">
              <el-input
                size="small"
                placeholder="请输入来源单号"
                clearable
                v-model="form.sourceNo"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-collapse v-model="collapseExpaned">
          <el-collapse-item title="客户信息" name="0"> -->
            <el-row>
              <el-col :span="9">
                <el-form-item label="客户姓名：" prop="linkmanName">
                  <el-input
                    size="small"
                    placeholder="请输入客户姓名"
                    clearable
                    v-model="form.linkmanName"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="客户手机：" prop="linkmanMobile">
                  <el-input
                    size="small"
                    placeholder="请输入客户手机号"
                    clearable
                    v-model.trim="form.linkmanMobile"
                    :maxlength="11"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="20px">
                  <el-checkbox>
                    没有手机只有固话
                  </el-checkbox>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="9">
                <el-form-item label="联系人姓名：">
                  <el-input
                    size="small"
                    placeholder="请输入联系人姓名"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="联系人电话：">
                  <el-input
                    size="small"
                    placeholder="请输入联系人电话"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label-width="20px"
                >
                  <el-checkbox>
                    联系人与收货人地址一致
                  </el-checkbox>
                </el-form-item>
              </el-col> -->
              <el-col :span="18">
                <el-form-item label="客户地址：" prop="address">
                  <el-autocomplete
                    placeholder="省+市+区县+城镇+街道+门牌号,根据实际地址而定"
                    v-model="form.address"
                    :fetch-suggestions="fetchRelaAddress"
                    size="small"
                    style="width: 100%;"
                    value-key="name"
                    @input="addressInput"
                  ></el-autocomplete>
                </el-form-item>
                <div v-show="false">
                  <el-form-item prop="province"></el-form-item>
                  <el-form-item prop="city"></el-form-item>
                  <el-form-item prop="district"></el-form-item>
                </div>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item
                  label-width="20px"
                >
                  <el-checkbox>
                    和安装地址一致
                  </el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item label="安装地址：">
                  <el-input
                    size="small"
                    placeholder="请输入安装地址"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col> -->
            </el-row>
          <!-- </el-collapse-item> -->
          <!-- <el-collapse-item title="订单信息" name="1"> -->
            <el-row>
              <el-col :span="8">
                <el-form-item label="选择商家：" prop="partnerId">
                  <el-popover
                    :width="800"
                    placement="bottom-start"
                    trigger="focus"
                  >
                    <el-table
                      border
                      ref="partnerTable"
                      :data="filterParnterTrees"
                      max-height="420px"
                      highlight-current-row
                      @row-dblclick="partnerDblclick"
                      row-key="partnerId"
                    >
                      <el-table-column label="商家名称" prop="partnerName"></el-table-column>
                    </el-table>
                    <el-input
                      size="small"
                      placeholder="请选择商家"
                      v-model="form.partnerName"
                      slot="reference"
                      @input="filterParnter"
                      @focus="filterParnter(form.partnerName)"
                      @keydown.38.40.native="keyDown($event, 'partner')"
                    ></el-input>
                  </el-popover>
                </el-form-item>
                <el-form-item label="请选择商家：" prop="partnerName" v-show="false"></el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="选择店铺：" prop="shopId">
                  <el-popover
                    :width="800"
                    placement="bottom"
                    :disabled="!form.partnerId"
                    trigger="focus"
                  >
                    <el-table
                      border
                      ref="shopTable"
                      :data="shops"
                      :max-height="420"
                      highlight-current-row
                      @row-dblclick="shopDblclick"
                      row-key="id"
                    >
                      <el-table-column label="店铺名称" prop="shopName"></el-table-column>
                    </el-table>
                    <div class="pages-wrapper">
                      <!-- <el-pagination
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        :page-size="page.pageSize"
                        :current-page="page.pageNum"
                        @size-change="sizeChange"
                        @current-change="currentChange"
                      >
                      </el-pagination> -->
                    </div>
                    <el-input
                      size="small"
                      placeholder="请选择店铺"
                      slot="reference"
                      :disabled="!form.partnerId"
                      v-model="form.shopName"
                      @input="filterShops"
                      @focus="filterShops(form.shopName)"
                      @keydown.38.40.native="keyDown($event, 'shop')"
                    ></el-input>
                  </el-popover>
                </el-form-item>
                <el-form-item label="店铺名称" prop="shopName" v-show="false"></el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="产品信息：" prop="productId">
                  <el-popover
                    :width="800"
                    placement="bottom-end"
                    :disabled="!form.partnerId || !form.shopId"
                    trigger="focus"
                  >
                    <el-tabs v-model="productActive">
                      <el-tab-pane label="自有产品" name="own">
                        <el-table
                          border
                          :data="ownProducts"
                          :max-height="400"
                          highlight-current-row
                          @row-dblclick="productDblclick"
                          ref="ownProductTable"
                        >
                          <el-table-column label="产品名称" prop="productName"></el-table-column>
                          <el-table-column label="产品类别" prop="categoryIdDictText"></el-table-column>
                          <el-table-column label="产品子类别" prop="subcategoryIdDictText"></el-table-column>
                        </el-table>
                        <!-- <div class="pages-wrapper">
                          <el-pagination
                            background
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="ownProductTotal"
                            :page-size="ownProductPage.pageSize"
                            :current-page="ownProductPage.pageNum"
                            @size-change="ownProductSizeChange"
                            @current-change="ownProductCurrentChange"
                          >
                          </el-pagination>
                        </div> -->
                      </el-tab-pane>
                      <el-tab-pane label="系统产品" name="system">
                        <el-table
                          border
                          :data="systemProducts"
                          :max-height="400"
                          highlight-current-row
                          @row-dblclick="productDblclick"
                          ref="systemProductTable"
                        >
                          <el-table-column label="产品名称" prop="productName"></el-table-column>
                          <el-table-column label="产品类别" prop="categoryIdDictText"></el-table-column>
                          <el-table-column label="产品子类别" prop="subcategoryIdDictText"></el-table-column>
                        </el-table>
                        <!-- <div class="pages-wrapper">
                          <el-pagination
                            background
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="sysProductTotal"
                            :page-size="sysProductPage.pageSize"
                            :current-page="sysProductPage.pageNum"
                            @size-change="sysProductSizeChange"
                            @current-change="sysProductCurrentChange"
                          >
                          </el-pagination>
                        </div> -->
                      </el-tab-pane>
                    </el-tabs>
                    <el-input
                      size="small"
                      placeholder="请选择产品"
                      slot="reference"
                      :disabled="!form.partnerId || !form.shopId"
                      v-model="form.productName"
                      @input="filterProducts"
                      @focus="filterProducts(form.productName)"
                      @keydown.38.40.native="ProductkeyDown($event)"
                    ></el-input>
                  </el-popover>
                </el-form-item>
                <el-form-item prop="productName" v-show="false"></el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="数量：" prop="num">
                  <el-input-number
                    size="small"
                    :min="1"
                    :max="1"
                    style="width: 100%;"
                    v-model="form.num"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="带锁上门：">
                  <el-switch
                    active-text="是"
                    inactive-text="否"
                  ></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="orderType === '2'">
              <el-col :span="24">
                <el-form-item label="报修模式：" prop="priceMode">
                  <el-radio-group size="small" v-model="form.priceMode">
                    <el-radio-button label="">免费维修</el-radio-button>
                    <el-radio-button
                      v-for="item in womRepairModes"
                      :key="item.itemValue"
                      :label="item.itemValue"
                    >{{item.itemText}}</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="报修原因：" prop="errorCode">
                  <el-select
                    size="small"
                    v-model="form.errorCode"
                  >
                    <el-option
                      v-for="item in womRepairTypes"
                      :key="item.itemValue"
                      :value="item.itemValue"
                      :label="item.itemText"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="报修描述：" prop="errorRemark">
                  <el-input
                    size="small"
                    placeholder="请填写报修详细描述"
                    v-model.trim="form.errorRemark"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    placeholder="备注信息"
                    :rows="5"
                    v-model="form.remark"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上传附件：" prop="imgUrls">
                  <el-upload
                    action="/"
                    :file-list="fileList"
                    :http-request="customFile"
                    :before-remove="fileRemove"
                    accept="image/*"
                  >
                    <el-button
                      size="mini"
                      type="primary"
                    >上传环境图片</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          <!-- </el-collapse-item> -->
          <!-- <el-collapse-item title="设备信息" name="2">
          </el-collapse-item> -->
        <!-- </el-collapse> -->
          <!-- <template v-if="orderType === '1'">
            <el-row>
              <el-col :span="8">
                <el-form-item label="门品牌：">
                  <el-input
                    size="small"
                    placeholder="请输入门品牌"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="开门方向：">
                  <el-select size="small"></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="门材质：">
                  <el-select size="small"></el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="门厚度：">
              <el-radio-group>
                <el-radio
                  v-for="item in doorThicknessList"
                  :key="item"
                  :label="item"
                ></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="导向片宽：">
                  <el-input
                    size="small"
                    placeholder="请输入导向片宽"
                  >
                    <span slot="suffix">mm</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="导向片高：">
                  <el-input
                    size="small"
                    placeholder="请输入导向片高"
                    clearable
                  >
                    <span slot="suffix">mm</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="导向片类型：">
                  <el-input
                    size="small"
                    placeholder="请输入导向片类型"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="天地钩：">
                  <el-switch
                    active-text="有"
                    inactive-text="无"
                  ></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="门框片高度：">
                  <el-input
                    size="small"
                    placeholder="请输入门框片高度"
                    clearable
                  >
                    <span slot="suffix">mm</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="门框片宽度：">
                  <el-input
                    size="small"
                    placeholder="请输入门框片宽度"
                    clearable
                  >
                    <span slot="suffix">mm</span>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="门框距离：">
                  <el-input
                    size="small"
                    placeholder="请输入门框距离"
                    clearable
                  >
                    <span slot="suffix">mm</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="补充信息：">
                  <el-input
                    size="small"
                    placeholder="补充信息"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template> -->
        <div>
          <el-row>
            <el-col :span="5">
              <el-form-item label="产品单价：">{{cost.money || '0.00'}}元</el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="订单总价：">{{cost.money || '0.00'}}元</el-form-item>
            </el-col>
            <!-- <el-col :span="9">
              <el-form-item label="优惠券：">
                <el-input
                  size="small"
                  placeholder="剩余0张可用"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5" :offset="9">
              <el-form-item label="优惠后价格：">
                180元
              </el-form-item>
            </el-col> -->
          </el-row>
        </div>
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
import { WOM_ORDER_TYPE, WOM_REPAIR_TYPE, WOM_REPAIR_MODE } from '@/store/modules/dict'
import { mapState } from 'vuex'
import { regionRegeo, searchAddress } from '@/api/system'
import { fetchPartners, GetShops, loadPartnerPrice } from '@/api/partner'
import { GetProduct, GetTbProducts } from '@/api/product'
import { fileQniu } from '@/api/file'
export default {
  mixins: [dialogMinix],
  props: {
    orderType: {
      validate (val) {
        return [
          '1', // 安装单
          '2', // 维修单
          '3', // 测量单
          '4', // 退货单
          '5' // 换货单
        ].indexOf(val) !== -1
      },
      default: '1'
    }
  },
  data () {
    return {
      form: {
        type: '1',
        address: '',
        city: '',
        district: '',
        linkmanMobile: '',
        linkmanName: '',
        partnerId: '',
        productId: '',
        province: '',
        shopId: '',
        sourceContent: '',
        sourceId: '',
        sourceNo: '',
        sourceType: 'NONE',
        street: '',
        partnerName: '',
        shopName: '',
        productName: '',
        remark: '',
        errorCode: '',
        errorRemark: '',
        imgUrls: [],
        priceMode: '',
        agentId: '',
        num: 1
      },
      formRules: {
        address: [
          {required: true, message: '请输入客户地址', trigger: 'blur'}
        ],
        sourceType: [
          {required: true, message: '请选择订单来源', trigger: 'change'}
        ],
        // sourceNo: [
        //   {required: true, message: '请输入来源单号', trigger: 'blur'}
        // ],
        linkmanMobile: [
          {required: true, message: '请输入客户手机号', trigger: 'blur'}
        ],
        linkmanName: [
          {required: true, message: '请输入客户姓名', trigger: 'blur'}
        ],
        partnerId: [
          {required: true, message: '请选择商家', trigger: 'change'}
        ],
        shopId: [
          {required: true, message: '请选择店铺', trigger: 'change'}
        ],
        productId: [
          {required: true, message: '请选择产品', trigger: 'change'}
        ],
        errorCode: [
          {required: true, message: '请选择报修原因', trigger: 'change'}
        ],
        errorRemark: [
          {required: true, message: '请填写报修描述内容', trigger: 'change'}
        ]
      },
      doorThicknessList: [
        '小于4cm',
        '4cm',
        '4.5cm',
        '5cm',
        '5.5cm',
        '6cm',
        '6.5cm',
        '7cm',
        '大于7cm'
      ],
      orderTypes: [
        {value: '1', text: '安装单'},
        {value: '3', text: '检测单'},
        {value: '2', text: '维修单'},
        {value: '4', text: '退货单'},
        {value: '5', text: '换货单'}
      ],
      fetchRelaTimer: null,
      reverseAddressTimer: null,
      partners: [],
      filterParnterTrees: [],
      filterPTimer: null,
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      shops: [],
      filterSTimer: null,
      collapseExpaned: ['0', '1'],
      ownProductPage: {
        pageSize: 10,
        pageNum: 1
      },
      ownProductTotal: 0,
      ownProducts: [],
      sysProductPage: {
        pageSize: 10,
        pageNum: 1
      },
      sysProductTotal: 0,
      systemProducts: [],
      filterProductTimer: null,
      productActive: 'own',
      fileList: [],
      cost: {}
    }
  },
  computed: {
    dialogTitle () {
      let isEdit = this.edit ? '修改' : '新增'
      return isEdit
    },
    orderTypeText () {
      let has = this.orderTypes.find(x => x.value === this.orderType)
      return has ? has.text : '其他'
    },
    priceTypeCode () {
      let str = ''
      switch (this.form.type) {
        case '1':
          str = 'Basic'
          break
        case '2':
          str = 'Repair'
          break
        case '3':
          str = 'Assign_Ontime'
          break
      }
      return str
    },
    ...mapState({
      womOrderTypes: state => state.dict[WOM_ORDER_TYPE],
      womRepairTypes: state => state.dict[WOM_REPAIR_TYPE],
      womRepairModes: state => state.dict[WOM_REPAIR_MODE],
      QniuToken: state => state.app.qniuToken
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
          this.$emit('confirm', this.form, done)
        }
      })
    },
    handleEdit (row) {
      this.editMiddle = {...this.form}
      this.form = {...row}
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
    fetchPartners (val) {
      let params = {
        page: {
          pageSize: 10,
          pageNum: 1
        },
        partnerName: val
      }
      fetchPartners(params)
        .then(res => {
          this.partners = res.result.list || []
          this.filterParnterTrees = [...this.partners]
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    openPartners () {
      if (this.partners.length <= 0) {
        this.fetchPartners()
      }
    },
    filterParnter (val) {
      clearTimeout(this.filterTimer)
      this.filterPTimer = setTimeout(() => {
        this.fetchPartners(val)
      }, 500)
    },
    partnerDblclick (row) {
      const {
        partnerName,
        partnerId,
        agentId
      } = row
      this.form.partnerName = partnerName
      this.form.partnerId = partnerId
      this.form.agentId = agentId
      this.form.shopId = ''
      this.form.shopName = ''
      this.form.productId = ''
      this.form.productName = ''
    },
    fetchShopList (shopName) {
      let params = {
        page: this.page,
        partnerId: this.form.partnerId,
        shopName
      }
      GetShops(params)
        .then(res => {
          this.shops = res.result.list || []
          this.total = res.result.total || 0
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    openShops (val) {
      if (!val) {
        return
      }
      this.shops = []
      this.fetchShopList()
    },
    shopDblclick (row) {
      const {
        shopName,
        shopId
      } = row
      this.form.shopId = shopId
      this.form.shopName = shopName
      this.form.productId = ''
      this.form.productName = ''
    },
    filterShops (val) {
      clearTimeout(this.filterSTimer)
      if (!val) {
        this.fetchShopList()
      } else {
        this.filterSTimer = setTimeout(() => {
          this.fetchShopList(val)
        }, 500)
      }
    },
    fetchRelaAddress (str, cb) {
      clearTimeout(this.fetchRelaTimer)
      if (!str) {
        let result = []
        cb(result)
      } else {
        this.fetchRelaTimer = setTimeout(() => {
          searchAddress(str)
            .then(res => {
              cb(res.result || [])
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        }, 500)
      }
    },
    addressInput (val) {
      clearTimeout(this.reverseAddressTimer)
      if (!val) {
        return
      }
      this.reverseAddressTimer = setTimeout(() => {
        regionRegeo(val)
          .then(res => {
            let result = res.result || {}
            const {
              provinceCode,
              cityCode,
              districtCode
            } = result
            this.form.province = provinceCode
            this.form.city = cityCode
            this.form.district = districtCode
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      }, 1000)
      this.fetchCost()
    },
    sizeChange (size) {
      this.page.pageSize = size
      this.fetchShopList()
    },
    currentChange (num) {
      this.page.pageNum = num
      this.fetchShopList()
    },
    ownProductSizeChange (size) {
      this.ownProductPage.pageSize = size
      this.fetchOwnProduct()
    },
    ownProductCurrentChange (num) {
      this.ownProductPage.pageNum = num
      this.fetchOwnProduct()
    },
    sysProductSizeChange (size) {
      this.sysProductPage.pageSize = size
      this.fetchSysProduct()
    },
    sysProductCurrentChange (num) {
      this.sysProductPage.pageNum = num
      this.fetchSysProduct()
    },
    fetchOwnProduct (productName) {
      let params = {
        page: this.ownProductPage,
        shopId: this.form.shopId,
        partnerId: this.form.partnerId,
        productName
      }
      GetTbProducts(params)
        .then(res => {
          this.ownProducts = res.result.list || []
          this.ownProductTotal = res.result.total || 0
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    fetchSysProduct (productName) {
      let params = {
        page: this.sysProductPage,
        productName
      }
      GetProduct(params)
        .then(res => {
          this.systemProducts = res.result.list || []
          this.sysProductTotal = res.result.total || 0
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    openProducts (productName) {
      if (!this.form.partnerId || !this.form.shopId) {
        return
      }
      switch (this.productActive) {
        case 'own':
          this.fetchOwnProduct(productName)
          break
        case 'system':
          this.fetchSysProduct(productName)
          break
      }
    },
    productDblclick (row) {
      let {
        productName,
        id
      } = row
      this.form.productId = id
      this.form.productName = productName
      this.fetchCost()
    },
    filterProducts (val) {
      this.productId = ''
      clearTimeout(this.filterProductTimer)
      if (!val) {
        this.openProducts()
      } else {
        this.filterProductTimer = setTimeout(() => {
          this.openProducts(val)
        }, 500)
      }
    },
    createData (row) {
      if (row) {
        const {
          address,
          city,
          district,
          linkmanMobile,
          linkmanName,
          partnerId,
          productId,
          province,
          shopId,
          sourceContent,
          sourceId,
          sourceNo,
          sourceType,
          street,
          partnerName,
          shopName,
          productName,
          id,
          agentId
        } = row
        Object.assign(this.form, {
          address,
          city,
          district,
          linkmanName,
          linkmanMobile,
          partnerId,
          productId,
          province,
          shopId,
          sourceContent,
          sourceId,
          sourceNo,
          sourceType,
          street,
          partnerName,
          shopName,
          productName,
          id,
          agentId
        })
      }
      this.fetchCost()
    },
    async customFile (http) {
      const {
        file
      } = http
      if (!this.QniuToken) {
        await this.$store.dispatch('GetQniuToken')
      }
      var observable = fileQniu(file, 'wom/file', this.QniuToken)
      observable.subscribe({
        error: (err) => {
          this.$message.error(err.message)
        },
        complete: (res) => {
          this.fileList.push({
            name: file.name,
            url: res.path
          })
          this.form.imgUrls.push(res.path)
        }
      })
    },
    fileRemove (file, fileList) {
      this.form.imgUrls = this.form.imgUrls.filter(x => x.path !== file.path)
      let hasIndex = this.fileList.findIndex(x => x.uid === file.uid)
      this.fileList.splice(hasIndex, 1)
      return true
    },
    fetchCost () {
      const {
        agentId,
        partnerId,
        productId,
        district
      } = this.form
      if (!agentId || !partnerId || !productId || !district || !this.priceTypeCode) {
        return
      }
      let params = {
        agentId: agentId,
        partnerId: partnerId,
        priceTypeCode: this.priceTypeCode,
        productId: productId,
        regionCode: district
      }
      this.cost = {}
      loadPartnerPrice(params)
        .then(res => {
          this.cost = res.result || {}
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    keyDown (ev, type) {
      if (this[type + 's'].length <= 0) {
        return
      }
      if (!this.form[type + 'Id']) {
        let checked = this[type + 's'][0]
        this.$refs[type + 'Table'].setCurrentRow(checked)
        this[type + 'Dblclick'](checked)
      } else {
        let hasIndex = this[type + 's'].findIndex(x => x[type + 'Id'] === this.form[type + 'Id'])
        if (ev.keyCode === 38) {
          if (hasIndex !== 0) {
            let current = this[type + 's'][--hasIndex]
            this.$refs[type + 'Table'].setCurrentRow(current)
            this[type + 'Dblclick'](current)
          }
        } else if (ev.keyCode === 40) {
          if (hasIndex === (this[type + 's'].length - 1)) {
          } else {
            let current = this[type + 's'][++hasIndex]
            this.$refs[type + 'Table'].setCurrentRow(current)
            this[type + 'Dblclick'](current)
          }
        }
      }
    },
    ProductkeyDown (ev) {
      ev.preventDefault()
      if (this[this.productActive + 'Products'].length <= 0) {
        return
      }
      if (!this.form.productId) {
        let checked = this[this.productActive + 'Products'][0]
        this.$refs[this.productActive + 'ProductTable'].setCurrentRow(checked)
        this.productDblclick(checked)
      } else {
        let hasIndex = this[this.productActive + 'Products'].findIndex(x => x.id === this.form.productId)
        if (ev.keyCode === 38) {
          if (hasIndex !== 0) {
            let current = this[this.productActive + 'Products'][--hasIndex]
            this.$refs[this.productActive + 'ProductTable'].setCurrentRow(current)
            this.productDblclick(current)
          }
        } else if (ev.keyCode === 40) {
          if (hasIndex !== (this[this.productActive + 'Products'].length - 1)) {
            let current = this[this.productActive + 'Products'][++hasIndex]
            this.$refs[this.productActive + 'ProductTable'].setCurrentRow(current)
            this.productDblclick(current)
          }
        }
      }
    },
    test () {
      alert('fefefefe')
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.womOrderTypes.length <= 0) {
          this.$store.dispatch('GetDictItem', WOM_ORDER_TYPE)
        }
        if (this.orderType === '2') {
          if (this.womRepairTypes.length <= 0) {
            this.$store.dispatch('GetDictItem', WOM_REPAIR_TYPE)
          }
          if (this.womRepairModes.length <= 0) {
            this.$store.dispatch('GetDictItem', WOM_REPAIR_MODE)
          }
        }
        this.form.type = this.orderType
      }
    },
    productActive () {
      this.openProducts()
    }
  }
}
</script>

<style>

</style>
