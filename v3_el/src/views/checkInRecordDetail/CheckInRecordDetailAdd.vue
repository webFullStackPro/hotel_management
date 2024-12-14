<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="checkInRecordDetailForm" :label-width="formLabelWidth" ref="checkInRecordDetailFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="入住人员姓名" prop="name">
              <el-input v-model="checkInRecordDetailForm.name" placeholder="请选择入住人员姓名" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findCheckInRecord"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="入住人员联系电话" prop="phone">
              <el-input v-model="checkInRecordDetailForm.phone" placeholder="请选择入住人员联系电话" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findCheckInRecord"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="checkInRecordDetailForm.goodsName" placeholder="请选择商品名称" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findGoods"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goodsPrice">
              <el-input v-model="checkInRecordDetailForm.goodsPrice" placeholder="请选择商品价格" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findGoods"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="数量" prop="qty">
              <el-input-number v-model="checkInRecordDetailForm.qty" :min="1" :max="9999" @change="calculateAmount"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="单价" prop="price">
              <el-input-number v-model="checkInRecordDetailForm.price" :min="1" :max="999999" :precision="2" :step="0.1" @change="calculateAmount"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="总价" prop="amount">
              <el-input-number v-model="checkInRecordDetailForm.amount" :min="1" :max="99999999" :disabled="true"></el-input-number>
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
            <el-button @click="onReset">重置</el-button>
            <el-button type="primary" @click="onBack">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog v-model="checkInRecordSelectorVisible" v-if="checkInRecordSelectorVisible" title="入住记录选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <check-in-record-selector @check-in-record-selected-event="handleCheckInRecordSelectedEvent">
      </check-in-record-selector>
    </el-dialog>
    <el-dialog v-model="goodsSelectorVisible" v-if="goodsSelectorVisible" title="商品选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <goods-selector @goods-selected-event="handleGoodsSelectedEvent">
      </goods-selector>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, inject, onMounted, reactive, ref, toRefs} from 'vue';
import checkInRecordDetailApi from '@/api/checkInRecordDetailApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {CheckInRecordDetailForm} from "@/types/req/checkInRecordDetailForm";
import type {Result} from '@/types/result'
import type {CheckInRecordDetail} from "@/types/resp/checkInRecordDetail";
import type {Id} from "@/types/id";
import {Search} from '@element-plus/icons-vue';
import CheckInRecordSelector from "@/views/checkInRecord/CheckInRecordSelector.vue";
import GoodsSelector from "@/views/goods/GoodsSelector.vue";

const props = defineProps<Id>()
const checkInRecordDetailFormRef = ref<FormInstance | null>(null);
let checkInRecordDetailForm = reactive<CheckInRecordDetailForm>({
  checkInRecordId: 0,
  name: '',
  phone: '',
  goodsId: 0,
  goodsName: '',
  goodsPrice: 0,
  qty: 0,
  price: 0,
  amount: 0,
})
const checkInRecordSelectorVisible = ref<boolean>(false)
const goodsSelectorVisible = ref<boolean>(false)
const emit = defineEmits<{
  (e: 'resetCheckInRecordDetailAddEvent'): void;
  (e: 'closeCheckInRecordDetailAddEvent', data?: { search: boolean }): void;
}>()

const rules = reactive({
  name: [
    { required: true, message: '请输入入住人员姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入入住人员联系电话', trigger: 'blur' }
  ],
  goodsName: [
    { required: true, message: '请输入商品名称', trigger: 'blur' }
  ],
  goodsPrice: [
    { required: true, message: '请输入商品价格', trigger: 'blur' }
  ],
  qty: [
    { required: true, message: '请输入数量', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入单价', trigger: 'blur' }
  ],
});
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initCheckInRecordDetailFormById(props.id)
  }
  const globalState = inject('globalState', {} as { dialogWidth?: string, dialogTop?: string, formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
  if (globalStateRefs.dialogWidth) {
    dialogWidth.value = globalStateRefs.dialogWidth.value || ''
  }
  if (globalStateRefs.dialogTop) {
    dialogTop.value = globalStateRefs.dialogTop.value || ''
  }
});

const initCheckInRecordDetailFormById = async (id: number) => {
  const resp: Result<CheckInRecordDetail> = await checkInRecordDetailApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(checkInRecordDetailForm, resp.data)
  }
}

const onReset = () => {
  if (checkInRecordDetailFormRef.value) {
    checkInRecordDetailFormRef.value.resetFields()
  }
  emit('resetCheckInRecordDetailAddEvent')
}

const onSave = () => {
  if (!checkInRecordDetailFormRef.value) {
    return
  }
  checkInRecordDetailFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await checkInRecordDetailApi.save(checkInRecordDetailForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeCheckInRecordDetailAddEvent', {search: true})
      } else {
        ElMessage.error('保存失败:' + (resp.msg ? resp.msg : ''))
      }
    }
  })
}

const findCheckInRecord = () => {
  checkInRecordSelectorVisible.value = true
}

const handleCheckInRecordSelectedEvent = (selectedCheckInRecord: any) => {
  checkInRecordSelectorVisible.value = false
  if (selectedCheckInRecord && 'checkInRecordId' in selectedCheckInRecord && checkInRecordDetailForm.checkInRecordId !== selectedCheckInRecord['checkInRecordId']) {
    checkInRecordDetailForm.checkInRecordId = selectedCheckInRecord['checkInRecordId']
    checkInRecordDetailForm.name = selectedCheckInRecord['name']
    checkInRecordDetailForm.phone = selectedCheckInRecord['phone']
  }
}
const findGoods = () => {
  goodsSelectorVisible.value = true
}

const handleGoodsSelectedEvent = (selectedGoods: any) => {
  goodsSelectorVisible.value = false
  if (selectedGoods && 'goodsId' in selectedGoods && checkInRecordDetailForm.goodsId !== selectedGoods['goodsId']) {
    checkInRecordDetailForm.goodsId = selectedGoods['goodsId']
    checkInRecordDetailForm.goodsName = selectedGoods['goodsName']
    checkInRecordDetailForm.goodsPrice = selectedGoods['goodsPrice']
    checkInRecordDetailForm.price = selectedGoods['goodsPrice']
    calculateAmount()
  }
}

const calculateAmount = () => {
  checkInRecordDetailForm.amount = parseFloat((checkInRecordDetailForm.qty * checkInRecordDetailForm.price).toFixed(2))
}

const onBack = () => {
  emit('closeCheckInRecordDetailAddEvent')
}
</script>

<style lang="scss">
</style>
