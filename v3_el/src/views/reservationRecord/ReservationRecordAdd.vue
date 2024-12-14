<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="reservationRecordForm" :label-width="formLabelWidth" ref="reservationRecordFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="房号" prop="roomNumber">
              <el-input v-model="reservationRecordForm.roomNumber" placeholder="请选择房号" readonly="readonly">
                <template #suffix>
                  <el-icon @click="findRoom"><Search/></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="reservationRecordForm.name" placeholder="请输入姓名" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="reservationRecordForm.phone" placeholder="请输入联系电话" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="预定入驻时间" prop="checkInTime">
              <el-date-picker
                  v-model="reservationRecordForm.checkInTime" type="datetime" placeholder="预定入驻时间" value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="reservationRecordForm.remark" placeholder="请输入备注" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="状态" prop="status">
              <el-select v-model="reservationRecordForm.status" placeholder="请选择状态">
                <el-option label="已预定" :value="10"></el-option>
                <el-option label="已入驻" :value="20"></el-option>
                <el-option label="已取消" :value="30"></el-option>
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
    <el-dialog v-model="roomSelectorVisible" v-if="roomSelectorVisible" title="房间选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <room-selector @room-selected-event="handleRoomSelectedEvent">
      </room-selector>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, inject, onMounted, reactive, ref, toRefs} from 'vue';
import reservationRecordApi from '@/api/reservationRecordApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {ReservationRecordForm} from "@/types/req/reservationRecordForm";
import type {Result} from '@/types/result'
import type {ReservationRecord} from "@/types/resp/reservationRecord";
import type {Id} from "@/types/id";
import {Search} from '@element-plus/icons-vue';
import RoomSelector from "@/views/room/RoomSelector.vue";

const props = defineProps<Id>()
const reservationRecordFormRef = ref<FormInstance | null>(null);
let reservationRecordForm = reactive<ReservationRecordForm>({
  roomId: 0,
  roomNumber: '',
  name: '',
  phone: '',
  checkInTime: '',
  remark: '',
  status: undefined,
})
const roomSelectorVisible = ref<boolean>(false)
const emit = defineEmits<{
  (e: 'resetReservationRecordAddEvent'): void;
  (e: 'closeReservationRecordAddEvent', data?: { search: boolean }): void;
}>()

const rules = reactive({
  roomNumber: [
    { required: true, message: '请输入房号', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
});
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initReservationRecordFormById(props.id)
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

const initReservationRecordFormById = async (id: number) => {
  const resp: Result<ReservationRecord> = await reservationRecordApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(reservationRecordForm, resp.data)
  }
}

const onReset = () => {
  if (reservationRecordFormRef.value) {
    reservationRecordFormRef.value.resetFields()
  }
  emit('resetReservationRecordAddEvent')
}

const onSave = () => {
  if (!reservationRecordFormRef.value) {
    return
  }
  reservationRecordFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await reservationRecordApi.save(reservationRecordForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeReservationRecordAddEvent', {search: true})
      } else {
        ElMessage.error('保存失败:' + (resp.msg ? resp.msg : ''))
      }
    }
  })
}

const findRoom = () => {
  roomSelectorVisible.value = true
}

const handleRoomSelectedEvent = (selectedRoom: any) => {
  roomSelectorVisible.value = false
  if (selectedRoom && 'roomId' in selectedRoom && reservationRecordForm.roomId !== selectedRoom['roomId']) {
    reservationRecordForm.roomId = selectedRoom['roomId']
    reservationRecordForm.roomNumber = selectedRoom['roomNumber']
  }
}

const onBack = () => {
  emit('closeReservationRecordAddEvent')
}
</script>

<style lang="scss">
</style>
