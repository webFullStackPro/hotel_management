<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="checkInRecordDetailForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="姓名">
            <el-input v-model="checkInRecordDetailForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input v-model="checkInRecordDetailForm.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="商品名称">
            <el-input v-model="checkInRecordDetailForm.goodsName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="价格">
            <el-input v-model="checkInRecordDetailForm.goodsPrice"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="数量">
            <el-input v-model="checkInRecordDetailForm.qty"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="单价">
            <el-input v-model="checkInRecordDetailForm.price"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="总价">
            <el-input v-model="checkInRecordDetailForm.amount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="checkInRecordDetailForm.createTime"></el-input>
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
import checkInRecordDetailApi from '@/api/checkInRecordDetailApi'
import type {CheckInRecordDetail} from "@/types/resp/checkInRecordDetail";
import type {Id} from "@/types/id"

const checkInRecordDetailForm = reactive<Partial<CheckInRecordDetail>>({});
const props = defineProps<Id>()
const emit = defineEmits<{
  (e: 'closeCheckInRecordDetailViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initCheckInRecordDetailById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initCheckInRecordDetailById = async (id: number) => {
  const resp = await checkInRecordDetailApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(checkInRecordDetailForm, resp.data)
  }
}
const onBack = () => {
  emit('closeCheckInRecordDetailViewEvent')
}
</script>

<style lang="scss">
</style>