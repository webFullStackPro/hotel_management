<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form :inline="true" :model="roomQueryForm" ref="roomQueryFormRef" :rules="rules">
        <el-form-item label="房号" prop="roomNumber">
          <el-input v-model="roomQueryForm.roomNumber" placeholder="请输入房号" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="房型" prop="roomType">
          <el-select v-model="roomQueryForm.roomType" placeholder="请选择房型" class="select-custom">
            <el-option label="标准单人间" :value="10"></el-option>
            <el-option label="豪华单人间" :value="11"></el-option>
            <el-option label="标准双人间" :value="20"></el-option>
            <el-option label="豪华双人间" :value="21"></el-option>
            <el-option label="标准套房" :value="90"></el-option>
            <el-option label="豪华套房" :value="91"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="roomQueryForm.status" placeholder="请选择状态" class="select-custom">
            <el-option label="空房" :value="10"></el-option>
            <el-option label="已预定" :value="20"></el-option>
            <el-option label="已入住" :value="30"></el-option>
            <el-option label="已退房(待清理)" :value="40"></el-option>
            <el-option label="维修中" :value="50"></el-option>
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
        @row-dblclick="roomSelected">
        <el-table-column prop="roomNumber" label="房号"></el-table-column>
        <el-table-column prop="roomType" label="房型">
          <template v-slot="{ row }">
            <div v-if="row.roomType === 10">标准单人间</div>
            <div v-if="row.roomType === 11">豪华单人间</div>
            <div v-if="row.roomType === 20">标准双人间</div>
            <div v-if="row.roomType === 21">豪华双人间</div>
            <div v-if="row.roomType === 90">标准套房</div>
            <div v-if="row.roomType === 91">豪华套房</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template v-slot="{ row }">
            <div v-if="row.status === 10">空房</div>
            <div v-if="row.status === 20">已预定</div>
            <div v-if="row.status === 30">已入住</div>
            <div v-if="row.status === 40">已退房(待清理)</div>
            <div v-if="row.status === 50">维修中</div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="area" label="面积"></el-table-column>
        <el-table-column prop="floorNumber" label="楼层"></el-table-column>
        <el-table-column prop="bedType" label="床型"></el-table-column>
        <el-table-column prop="maxOccupancy" label="入住人数"></el-table-column>
        <el-table-column prop="freeWifi" label="wifi是否免费">
          <template v-slot="{ row }">
            <div v-if="row.freeWifi === 0">否</div>
            <div v-if="row.freeWifi === 1">是</div>
          </template>
        </el-table-column>
        <el-table-column prop="existWindow" label="是否有窗">
          <template v-slot="{ row }">
            <div v-if="row.existWindow === 0">否</div>
            <div v-if="row.existWindow === 1">是</div>
          </template>
        </el-table-column>
        <el-table-column prop="freeBreakfast" label="是否有免费早餐">
          <template v-slot="{ row }">
            <div v-if="row.freeBreakfast === 0">否</div>
            <div v-if="row.freeBreakfast === 1">是</div>
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
  </div>
</template>

<script setup lang="ts">
import { defineEmits, inject, onMounted, reactive, ref, toRefs } from 'vue'
import roomApi from '@/api/roomApi'
import type { RoomQueryForm } from '@/types/req/roomQueryForm'
import type { Room } from '@/types/resp/room'
import { type FormInstance } from 'element-plus'
import type { Result } from '@/types/result'
import type { Page } from '@/types/page'

const roomQueryFormRef = ref<FormInstance | null>(null);
const roomQueryForm = reactive<RoomQueryForm>({
  roomNumber: '',
  roomType: undefined,
  status: undefined,
})

const state = reactive({
  loading: false,
  tableData: [] as Room[], // 数据列表
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
  (e: 'roomSelectedEvent', data?: {
    roomId: number,
    roomNumber: string,
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
    const resp: Result<Page<Room>> = await roomApi.find(roomQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
        const page: Page<Room> = resp.data
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
  if (roomQueryFormRef.value) {
    roomQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const roomSelected = (row: Room) => {
  emit('roomSelectedEvent', {
    roomId: row.id,
    roomNumber: row.roomNumber,
  })
}


const onBack = () => {
  emit('roomSelectedEvent')
}
</script>

<style lang="scss">
</style>
