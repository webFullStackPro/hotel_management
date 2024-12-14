<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="checkInRecordForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="姓名">
            <el-input v-model="checkInRecordForm.preName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input v-model="checkInRecordForm.prePhone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="房号">
            <el-input v-model="checkInRecordForm.roomNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="姓名">
            <el-input v-model="checkInRecordForm.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input v-model="checkInRecordForm.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="入驻时间">
            <el-input v-model="checkInRecordForm.checkInTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="退房时间">
            <el-input v-model="checkInRecordForm.checkOutTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="房费">
            <el-input v-model="checkInRecordForm.roomAmount"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="商品消费">
            <el-input v-model="checkInRecordForm.goodsAmount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="总金额">
            <el-input v-model="checkInRecordForm.amount"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="remark">
            <el-input v-model="checkInRecordForm.remark"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="状态">
            <el-select v-model="checkInRecordForm.status" placeholder="请选择状态">
              <el-option label="已入驻" :value="20"></el-option>
              <el-option label="已取消" :value="30"></el-option>
              <el-option label="已退房" :value="40"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="checkInRecordForm.createTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="checkInRecordForm.modifyTime"></el-input>
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
import checkInRecordApi from '@/api/checkInRecordApi'
import type {CheckInRecord} from "@/types/resp/checkInRecord";
import type {Id} from "@/types/id"

const checkInRecordForm = reactive<Partial<CheckInRecord>>({});
const props = defineProps<Id>()
const emit = defineEmits<{
  (e: 'closeCheckInRecordViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initCheckInRecordById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initCheckInRecordById = async (id: number) => {
  const resp = await checkInRecordApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(checkInRecordForm, resp.data)
  }
}
const onBack = () => {
  emit('closeCheckInRecordViewEvent')
}
</script>

<style lang="scss">
</style>