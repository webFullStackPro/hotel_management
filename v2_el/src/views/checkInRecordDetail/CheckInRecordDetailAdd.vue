<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="checkInRecordDetailForm" :label-width="formLabelWidth" ref="refCheckInRecordDetailForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="入住人员姓名" prop="name">
            <el-input v-model="checkInRecordDetailForm.name" placeholder="请选择入住人员姓名" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findCheckInRecord"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="入住人员联系电话" prop="phone">
            <el-input v-model="checkInRecordDetailForm.phone" placeholder="请选择入住人员联系电话" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findCheckInRecord"></i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="商品名称" prop="goodsName">
            <el-input v-model="checkInRecordDetailForm.goodsName" placeholder="请选择商品名称" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findGoods"></i>
            </el-input>
          </el-form-item>
        </el-col>
<!--        <el-col :span="11">-->
<!--          <el-form-item label="商品价格" prop="goodsPrice">-->
<!--            <el-input v-model="checkInRecordDetailForm.goodsPrice" placeholder="请选择商品价格" readonly="readonly">-->
<!--              <i slot="suffix" class="el-input__icon el-icon-search" @click="findGoods"></i>-->
<!--            </el-input>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="11">
          <el-form-item label="数量" prop="qty">
            <el-input-number v-model="checkInRecordDetailForm.qty" :min="1" :max="99" @change="calculateAmount"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="单价" prop="price">
            <el-input-number v-model="checkInRecordDetailForm.price" :min="1" :max="999999" @change="calculateAmount"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="总价" prop="amount">
            <el-input v-model="checkInRecordDetailForm.amount" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </div>
    <div class="pop-dialog-footer">
      <el-row>
        <el-col :span="11" :offset="6">
          <div class="form-button-container">
            <el-button type="primary" @click="onSave">保存</el-button>
            <el-button type="primary" @click="onReset" plain>重置</el-button>
            <el-button type="primary" @click="onBack">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog :visible.sync="checkInRecordSelectorVisible" v-if="checkInRecordSelectorVisible" title="入住记录选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <check-in-record-selector @check-in-record-selected-event="handleCheckInRecordSelectedEvent">
      </check-in-record-selector>
    </el-dialog>
    <el-dialog :visible.sync="goodsSelectorVisible" v-if="goodsSelectorVisible" title="商品选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <goods-selector @goods-selected-event="handleGoodsSelectedEvent">
      </goods-selector>
    </el-dialog>
  </div>
</template>

<script>
import checkInRecordDetailApi from '@/api/checkInRecordDetailApi'
import CheckInRecordSelector from "@/views/checkInRecord/CheckInRecordSelector.vue";
import GoodsSelector from "@/views/goods/GoodsSelector.vue";
export default {
  name: 'CheckInRecordDetailAdd',
  components: {CheckInRecordSelector,GoodsSelector,},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      checkInRecordDetailForm: {
        checkInRecordId: '',
        name: '',
        phone: '',
        goodsId: '',
        goodsName: '',
        goodsPrice: '',
        qty: '',
        price: '',
        amount: ''
      },
      rules: {
        name:[
          { required: true, message: '请输入入住人员姓名', trigger: 'blur' }
        ],
        phone:[
          { required: true, message: '请输入入住人员联系电话', trigger: 'blur' }
        ],
        goodsName:[
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goodsPrice:[
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        qty:[
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        price:[
          { required: true, message: '请输入单价', trigger: 'blur' }
        ],
      },
      checkInRecordSelectorVisible: false,
      goodsSelectorVisible: false,
    }
  },
  created () {
    if (this.id) {
      checkInRecordDetailApi.findById(Number(this.id))
        .then(resp => {
          if (resp && resp.code === 1) {
            this.checkInRecordDetailForm = resp.data
          } else {
            this.$message.error('获取数据失败')
          }
        })
        .catch(error => {
          console.error('获取数据失败:', error)
        })
    }
  },
  mounted() {
    this.calculateAmount()
  },
  methods: {
    onReset () {
      this.checkInRecordDetailForm = {
        checkInRecordId: '',
        name: '',
        phone: '',
        goodsId: '',
        goodsName: '',
        goodsPrice: '',
        qty: '',
        price: '',
        amount: ''
      }
      this.$emit('reset-check-in-record-detail-add-event')
    },
    onSave () {
      this.$refs.refCheckInRecordDetailForm.validate((valid) => {
        if (valid) {
          checkInRecordDetailApi.save(this.checkInRecordDetailForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-check-in-record-detail-add-event', {search: true})
              } else {
                this.$message.error('保存失败:' + (resp.msg ? resp.msg : ''))
              }
            })
            .catch(error => {
              console.log(error)
              this.$message.error('保存失败')
            })
        } else {
          return false
        }
      })
    },
    findCheckInRecord () {
      this.checkInRecordSelectorVisible = true
    },
    handleCheckInRecordSelectedEvent (selectedCheckInRecord) {
      this.checkInRecordSelectorVisible = false
      if (selectedCheckInRecord && 'checkInRecordId' in selectedCheckInRecord && this.checkInRecordDetailForm.checkInRecordId !== selectedCheckInRecord['checkInRecordId']) {
        this.checkInRecordDetailForm.checkInRecordId = selectedCheckInRecord['checkInRecordId']
        this.checkInRecordDetailForm.name = selectedCheckInRecord['name']
        this.checkInRecordDetailForm.phone = selectedCheckInRecord['phone']
      }
    },
    findGoods () {
      this.goodsSelectorVisible = true
    },
    handleGoodsSelectedEvent (selectedGoods) {
      this.goodsSelectorVisible = false
      if (selectedGoods && 'goodsId' in selectedGoods && this.checkInRecordDetailForm.goodsId !== selectedGoods['goodsId']) {
        this.checkInRecordDetailForm.goodsId = selectedGoods['goodsId']
        this.checkInRecordDetailForm.goodsName = selectedGoods['goodsName']
        this.checkInRecordDetailForm.price = selectedGoods['goodsPrice']
        this.calculateAmount()
      }
    },
    onBack () {
      this.$emit('close-check-in-record-detail-add-event')
    },
    calculateAmount() {
      this.checkInRecordDetailForm.amount = parseFloat((this.checkInRecordDetailForm.qty * this.checkInRecordDetailForm.price).toFixed(2))
    }
  }
}
</script>

<style lang="scss">
</style>