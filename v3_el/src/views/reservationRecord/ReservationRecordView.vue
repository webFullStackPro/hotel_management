<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="reservationRecordForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="房号">
            <el-input v-model="reservationRecordForm.roomNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="姓名">
            <el-input v-model="reservationRecordForm.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input v-model="reservationRecordForm.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="预定入驻时间">
            <el-input v-model="reservationRecordForm.checkInTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="备注">
            <el-input v-model="reservationRecordForm.remark"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="状态">
            <el-select v-model="reservationRecordForm.status" placeholder="请选择状态">
              <el-option label="已预定" :value="10"></el-option>
              <el-option label="已入驻" :value="20"></el-option>
              <el-option label="已取消" :value="30"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="reservationRecordForm.createTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="reservationRecordForm.modifyTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </div>
    <div class="pop-dialog-footer">
      <el-row>
        <el-col :span="12" :offset="6">
          <div class="form-button-container">
            <el-button @click="onBack" type="primary">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, onMounted, reactive, ref, inject, toRefs} from 'vue';
import reservationRecordApi from '@/api/reservationRecordApi'
import type {ReservationRecord} from "@/types/resp/reservationRecord";
import type {Id} from "@/types/id"

const reservationRecordForm = reactive<Partial<ReservationRecord>>({});
const props = defineProps<Id>()
const emit = defineEmits<{
  (e: 'closeReservationRecordViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initReservationRecordById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initReservationRecordById = async (id: number) => {
  const resp = await reservationRecordApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(reservationRecordForm, resp.data)
  }
}
const onBack = () => {
  emit('closeReservationRecordViewEvent')
}
</script>

<style lang="scss">
</style>