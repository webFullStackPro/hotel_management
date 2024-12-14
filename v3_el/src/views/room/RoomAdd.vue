<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="roomForm" :label-width="formLabelWidth" ref="roomFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="房号" prop="roomNumber">
              <el-input v-model="roomForm.roomNumber" placeholder="请输入房号" maxlength="32"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="房型" prop="roomType">
              <el-select v-model="roomForm.roomType" placeholder="请选择房型">
                <el-option label="标准单人间" :value="10"></el-option>
                <el-option label="豪华单人间" :value="11"></el-option>
                <el-option label="标准双人间" :value="20"></el-option>
                <el-option label="豪华双人间" :value="21"></el-option>
                <el-option label="标准套房" :value="90"></el-option>
                <el-option label="豪华套房" :value="91"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="价格" prop="price">
              <el-input-number v-model="roomForm.price" :precision="2" :step="0.1" :min="1" :max="99999999"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="面积" prop="area">
              <el-input v-model="roomForm.area" placeholder="请输入面积" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="楼层" prop="floorNumber">
              <el-input v-model="roomForm.floorNumber" placeholder="请输入楼层" maxlength="32"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="床型" prop="bedType">
              <el-input v-model="roomForm.bedType" placeholder="请输入床型" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="入住人数" prop="maxOccupancy">
              <el-input-number v-model="roomForm.maxOccupancy" :min="1" :max="10"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="wifi是否免费" prop="freeWifi">
              <el-select v-model="roomForm.freeWifi" placeholder="请选择wifi是否免费">
                <el-option label="否" :value="0"></el-option>
                <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="是否有窗" prop="existWindow">
              <el-select v-model="roomForm.existWindow" placeholder="请选择是否有窗">
                <el-option label="否" :value="0"></el-option>
                <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="是否有免费早餐" prop="freeBreakfast">
              <el-select v-model="roomForm.freeBreakfast" placeholder="请选择是否有免费早餐">
                <el-option label="否" :value="0"></el-option>
                <el-option label="是" :value="1"></el-option>
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
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, onMounted, reactive, ref, inject, toRefs} from 'vue';
import roomApi from '@/api/roomApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {RoomForm} from "@/types/req/roomForm";
import type {Result} from '@/types/result'
import type {Room} from "@/types/resp/room";
import type {Id} from "@/types/id";

const props = defineProps<Id>()
const roomFormRef = ref<FormInstance | null>(null);
let roomForm = reactive<RoomForm>({
  roomNumber: '',
  roomType: undefined,
  price: 0,
  area: '',
  floorNumber: '',
  bedType: '',
  maxOccupancy: 0,
  freeWifi: undefined,
  existWindow: undefined,
  freeBreakfast: undefined,
})
const emit = defineEmits<{
  (e: 'resetRoomAddEvent'): void;
  (e: 'closeRoomAddEvent', data?: { search: boolean }): void;
}>()

const rules = reactive({
  roomNumber: [
    { required: true, message: '请输入房号', trigger: 'blur' }
  ],
  roomType: [
    { required: true, message: '请输入房型', trigger: 'blur' }
  ],
});
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initRoomFormById(props.id)
  }
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
});

const initRoomFormById = async (id: number) => {
  const resp: Result<Room> = await roomApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(roomForm, resp.data)
  }
}

const onReset = () => {
  if (roomFormRef.value) {
    roomFormRef.value.resetFields()
  }
  emit('resetRoomAddEvent')
}

const onSave = () => {
  if (!roomFormRef.value) {
    return
  }
  roomFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await roomApi.save(roomForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeRoomAddEvent', {search: true})
      } else {
        ElMessage.error('保存失败:' + (resp.msg ? resp.msg : ''))
      }
    }
  })
}

const onBack = () => {
  emit('closeRoomAddEvent')
}
</script>

<style lang="scss">
</style>
