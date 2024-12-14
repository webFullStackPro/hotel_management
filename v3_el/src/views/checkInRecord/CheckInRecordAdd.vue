<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="checkInRecordForm" :label-width="formLabelWidth" ref="checkInRecordFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="预定人员姓名" prop="preName">
              <el-input v-model="checkInRecordForm.preName" placeholder="请选择预定人员姓名" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findReservationRecord"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="预定人员联系电话" prop="prePhone">
              <el-input v-model="checkInRecordForm.prePhone" placeholder="请选择预定人员联系电话" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findReservationRecord"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="房号" prop="roomNumber">
              <el-input v-model="checkInRecordForm.roomNumber" placeholder="请选择房号" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findRoom"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="checkInRecordForm.name" placeholder="请输入姓名" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="checkInRecordForm.phone" placeholder="请输入联系电话" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="入驻时间" prop="checkInTime">
              <el-date-picker
                v-model="checkInRecordForm.checkInTime" type="datetime" placeholder="入驻时间" value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="退房时间" prop="checkOutTime">
              <el-date-picker
                v-model="checkInRecordForm.checkOutTime" type="datetime" placeholder="退房时间" value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="房费" prop="roomAmount">
              <el-input-number v-model="checkInRecordForm.roomAmount" :min="1" :max="9999999" @change="calculateAmount"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="商品消费" prop="goodsAmount">
              <el-input-number v-model="checkInRecordForm.goodsAmount" :min="1" :max="9999999" @change="calculateAmount"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="总金额" prop="amount">
              <el-input-number v-model="checkInRecordForm.amount" :disabled="true"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="remark" prop="remark">
              <el-input v-model="checkInRecordForm.remark" placeholder="请输入remark" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="状态" prop="status">
              <el-select v-model="checkInRecordForm.status" placeholder="请选择状态">
                <el-option label="已入驻" :value="20"></el-option>
                <el-option label="已取消" :value="30"></el-option>
                <el-option label="已退房" :value="40"></el-option>
              </el-select>
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
    <el-dialog v-model="reservationRecordSelectorVisible" v-if="reservationRecordSelectorVisible" title="预定记录选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <reservation-record-selector @reservation-record-selected-event="handleReservationRecordSelectedEvent">
      </reservation-record-selector>
    </el-dialog>
    <el-dialog v-model="roomSelectorVisible" v-if="roomSelectorVisible" title="房间选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <room-selector @room-selected-event="handleRoomSelectedEvent">
      </room-selector>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, inject, onMounted, reactive, ref, toRefs} from 'vue';
import checkInRecordApi from '@/api/checkInRecordApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {CheckInRecordForm} from "@/types/req/checkInRecordForm";
import type {Result} from '@/types/result'
import type {CheckInRecord} from "@/types/resp/checkInRecord";
import type {Id} from "@/types/id";
import {Search} from '@element-plus/icons-vue';
import ReservationRecordSelector from "@/views/reservationRecord/ReservationRecordSelector.vue";
import RoomSelector from "@/views/room/RoomSelector.vue";

const props = defineProps<Id>()
const checkInRecordFormRef = ref<FormInstance | null>(null);
let checkInRecordForm = reactive<CheckInRecordForm>({
  reservationRecordId: 0,
  preName: '',
  prePhone: '',
  roomId: 0,
  roomNumber: '',
  name: '',
  phone: '',
  checkInTime: '',
  checkOutTime: '',
  roomAmount: 0,
  goodsAmount: 0,
  amount: 0,
  remark: '',
  status: undefined,
})
const reservationRecordSelectorVisible = ref<boolean>(false)
const roomSelectorVisible = ref<boolean>(false)
const emit = defineEmits<{
  (e: 'resetCheckInRecordAddEvent'): void;
  (e: 'closeCheckInRecordAddEvent', data?: { search: boolean }): void;
}>()

const rules = reactive({
  roomNumber: [
    { required: true, message: '请输入房号', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  checkInTime: [
    { required: true, message: '请输入入驻时间', trigger: 'blur' }
  ],
});
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initCheckInRecordFormById(props.id)
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

  calculateAmount()
});

const initCheckInRecordFormById = async (id: number) => {
  const resp: Result<CheckInRecord> = await checkInRecordApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(checkInRecordForm, resp.data)
  }
}

const onReset = () => {
  if (checkInRecordFormRef.value) {
    checkInRecordFormRef.value.resetFields()
  }
  emit('resetCheckInRecordAddEvent')
}

const onSave = () => {
  if (!checkInRecordFormRef.value) {
    return
  }
  checkInRecordFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await checkInRecordApi.save(checkInRecordForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeCheckInRecordAddEvent', {search: true})
      } else {
        ElMessage.error('保存失败:' + (resp.msg ? resp.msg : ''))
      }
    }
  })
}

const findReservationRecord = () => {
  reservationRecordSelectorVisible.value = true
}

const handleReservationRecordSelectedEvent = (selectedReservationRecord: any) => {
  reservationRecordSelectorVisible.value = false
  if (selectedReservationRecord && 'reservationRecordId' in selectedReservationRecord && checkInRecordForm.reservationRecordId !== selectedReservationRecord['reservationRecordId']) {
    checkInRecordForm.reservationRecordId = selectedReservationRecord['reservationRecordId']
    checkInRecordForm.preName = selectedReservationRecord['preName']
    checkInRecordForm.prePhone = selectedReservationRecord['prePhone']
  }
}
const findRoom = () => {
  roomSelectorVisible.value = true
}

const handleRoomSelectedEvent = (selectedRoom: any) => {
  roomSelectorVisible.value = false
  if (selectedRoom && 'roomId' in selectedRoom && checkInRecordForm.roomId !== selectedRoom['roomId']) {
    checkInRecordForm.roomId = selectedRoom['roomId']
    checkInRecordForm.roomNumber = selectedRoom['roomNumber']
  }
}

const calculateAmount = () => {
  checkInRecordForm.amount = checkInRecordForm.roomAmount + checkInRecordForm.goodsAmount
}

const onBack = () => {
  emit('closeCheckInRecordAddEvent')
}
</script>

<style lang="scss">
</style>
