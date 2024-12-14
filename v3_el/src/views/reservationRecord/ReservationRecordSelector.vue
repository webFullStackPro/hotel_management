<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form :inline="true" :model="reservationRecordQueryForm" ref="reservationRecordQueryFormRef" :rules="rules">
        <el-form-item label="房号" prop="roomNumber">
          <el-input v-model="reservationRecordQueryForm.roomNumber" placeholder="请选择房号" readonly="readonly">
            <template #suffix>
              <el-icon @click="findRoom"><Search/></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="reservationRecordQueryForm.name" placeholder="请输入姓名" maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="reservationRecordQueryForm.phone" placeholder="请输入联系电话" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="reservationRecordQueryForm.status" placeholder="请选择状态" class="select-custom">
            <el-option label="已预定" :value="10"></el-option>
            <el-option label="已入驻" :value="20"></el-option>
            <el-option label="已取消" :value="30"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="state.tableData"
        border
        v-loading="state.loading"
        size="small"
        header-cell-class-name="table-header-cell-font"
        cell-class-name="table-cell-font"
        @row-dblclick="reservationRecordSelected">
        <el-table-column prop="roomNumber" label="房号"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="联系电话"></el-table-column>
        <el-table-column prop="checkInTime" label="预定入驻时间"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template v-slot="{ row }">
            <div v-if="row.status === 10">已预定</div>
            <div v-if="row.status === 20">已入驻</div>
            <div v-if="row.status === 30">已取消</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-pagination">
        <el-pagination
          @current-change="changePage"
          :current-page="state.currentPage"
          :page-sizes="state.pageSizes"
          :page-size="state.pageSize"
          background
          layout="total, prev, pager, next, jumper"
          :total="state.total">
        </el-pagination>
      </div>
    </div>
    <div class="pop-dialog-footer">
      <el-row>
        <el-col :span="11" :offset="6">
          <div class="form-button-container">
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
import {onMounted, reactive, ref, inject, toRefs, defineEmits} from 'vue';
import reservationRecordApi from '@/api/reservationRecordApi'
import type {ReservationRecordQueryForm} from "@/types/req/reservationRecordQueryForm";
import type {ReservationRecord} from "@/types/resp/reservationRecord";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import { Search } from '@element-plus/icons-vue';
import RoomSelector from "@/views/room/RoomSelector.vue";

const reservationRecordQueryFormRef = ref<FormInstance | null>(null);
let reservationRecordQueryForm = reactive<ReservationRecordQueryForm>({
  roomId: 0,
  roomNumber: '',
  name: '',
  phone: '',
  status: undefined,
})
const roomSelectorVisible = ref<boolean>(false)

const state = reactive({
  loading: false,
  tableData: [] as ReservationRecord[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})

const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')

const rules = reactive({
});

const emit = defineEmits<{
  (e: 'reservationRecordSelectedEvent', data?: {
    reservationRecordId: number,
    preName: string,
    prePhone: string,
    }): void;
}>()

onMounted(() => {
  onSearch()
  const globalState = inject('globalState', {} as { dialogWidth?: string, dialogTop?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.dialogWidth) {
    dialogWidth.value = globalStateRefs.dialogWidth.value || ''
  }
  if (globalStateRefs.dialogTop) {
    dialogTop.value = globalStateRefs.dialogTop.value || ''
  }
})

const getPageData = async () => {
  try {
    state.loading = true
    const resp: Result<Page<ReservationRecord>> = await reservationRecordApi.find(reservationRecordQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
        const page: Page<ReservationRecord> = resp.data
        if (page && page.list.length > 0) {
          state.tableData = page.list
          state.total = page.total
        }
      }
    }
  } catch (e) {
    console.log('获取数据异常', e)
  } finally {
    state.loading = false
  }
}
const onSearch = () => {
  getPageData()
}

const changePage = (val: number) => {
  state.currentPage = val
  getPageData()
}

const onReset = () => {
  if (reservationRecordQueryFormRef.value) {
    reservationRecordQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const reservationRecordSelected = (row: ReservationRecord) => {
  emit('reservationRecordSelectedEvent', {
    reservationRecordId: row.id,
    preName: row.name,
    prePhone: row.phone,
  })
}

const findRoom = () => {
  roomSelectorVisible.value = true
}

const handleRoomSelectedEvent = (selectedRoom: any) => {
  roomSelectorVisible.value = false
  if (selectedRoom && 'roomId' in selectedRoom && reservationRecordQueryForm.roomId !== selectedRoom['roomId']) {
    reservationRecordQueryForm.roomId = selectedRoom['roomId']
    reservationRecordQueryForm.roomNumber = selectedRoom['roomNumber']
  }
}

const onBack = () => {
  emit('reservationRecordSelectedEvent')
}
</script>

<style lang="scss">
</style>
