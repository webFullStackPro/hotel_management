<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="roomForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="房号">
            <el-input v-model="roomForm.roomNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="房型">
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
          <el-form-item label="状态">
            <el-select v-model="roomForm.status" placeholder="请选择状态">
              <el-option label="空房" :value="10"></el-option>
              <el-option label="已预定" :value="20"></el-option>
              <el-option label="已入住" :value="30"></el-option>
              <el-option label="已退房(待清理)" :value="40"></el-option>
              <el-option label="维修中" :value="50"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="价格">
            <el-input v-model="roomForm.price"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="面积">
            <el-input v-model="roomForm.area"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="楼层">
            <el-input v-model="roomForm.floorNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="床型">
            <el-input v-model="roomForm.bedType"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="入住人数">
            <el-input v-model="roomForm.maxOccupancy"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="wifi是否免费">
            <el-select v-model="roomForm.freeWifi" placeholder="请选择wifi是否免费">
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="是否有窗">
            <el-select v-model="roomForm.existWindow" placeholder="请选择是否有窗">
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="是否有免费早餐">
            <el-select v-model="roomForm.freeBreakfast" placeholder="请选择是否有免费早餐">
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="roomForm.createTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="roomForm.modifyTime"></el-input>
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
import roomApi from '@/api/roomApi'
import type {Room} from "@/types/resp/room";
import type {Id} from "@/types/id"

const roomForm = reactive<Partial<Room>>({});
const props = defineProps<Id>()
const emit = defineEmits<{
  (e: 'closeRoomViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initRoomById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initRoomById = async (id: number) => {
  const resp = await roomApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(roomForm, resp.data)
  }
}
const onBack = () => {
  emit('closeRoomViewEvent')
}
</script>

<style lang="scss">
</style>