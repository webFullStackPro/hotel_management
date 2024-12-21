<template>
  <div class="reservationRecord-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>预定记录列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
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
        <el-button type="primary" @click="onAdd">新增</el-button>
        <el-button type="primary" @click="onExport">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="state.tableData"
      border
      v-loading="state.loading"
      size="small"
      header-cell-class-name="table-header-cell-font"
      cell-class-name="table-cell-font">
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
      <el-table-column fixed="right" label="操作" width="250">
        <template v-slot="{ row }">
          <el-button @click.prevent="editRow(row.id)" type="primary">编辑</el-button>
          <el-button @click.prevent="delRow(row.id)" type="danger" plain>删除</el-button>
          <el-button @click.prevent="detailRow(row.id)" type="primary" plain>详情</el-button>
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
    <el-dialog v-model="roomSelectorVisible" v-if="roomSelectorVisible" title="房间选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <room-selector @room-selected-event="handleRoomSelectedEvent">
      </room-selector>
    </el-dialog>
    <el-dialog v-model="reservationRecordAddVisible" v-if="reservationRecordAddVisible" :title="reservationRecordAddTitle" :top="dialogTop" :width="dialogWidth">
      <reservation-record-add :id="selectedReservationRecordId" @close-reservation-record-add-event="handleCloseReservationRecordAddEvent" @reset-reservation-record-add-event="handleResetReservationRecordAddEvent">
      </reservation-record-add>
    </el-dialog>
    <el-dialog v-model="reservationRecordViewVisible" v-if="reservationRecordViewVisible" title="预定记录详情" :top="dialogTop" :width="dialogWidth">
      <reservation-record-view :id="selectedReservationRecordId" @close-reservation-record-view-event="handleCloseReservationRecordViewEvent">
      </reservation-record-view>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, inject, toRefs} from 'vue';
import reservationRecordApi from '@/api/reservationRecordApi'
import type {ReservationRecordQueryForm} from "@/types/req/reservationRecordQueryForm";
import type {ReservationRecord} from "@/types/resp/reservationRecord";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import { Search } from '@element-plus/icons-vue';
import RoomSelector from "@/views/room/RoomSelector.vue";
import ReservationRecordAdd from "@/views/reservationRecord/ReservationRecordAdd.vue"
import ReservationRecordView from "@/views/reservationRecord/ReservationRecordView.vue"
import goodsApi from '@/api/goodsApi.ts'
import { exportToExcel } from '@/composables/exportUtil.ts'
import { getReservationRecordStatusText } from '@/composables/dictTranslator.ts'

const reservationRecordQueryFormRef = ref<FormInstance | null>(null);
const reservationRecordQueryForm = reactive<ReservationRecordQueryForm>({
  roomId: 0,
  roomNumber: '',
  name: '',
  phone: '',
  status: undefined,
})

const state = reactive({
  loading: false,
  tableData: [] as ReservationRecord[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})
const selectedReservationRecordId = ref<number>(0)
const roomSelectorVisible = ref<boolean>(false)
const reservationRecordAddVisible = ref<boolean>(false)
const reservationRecordViewVisible = ref<boolean>(false)
const reservationRecordAddTitle = ref<string>('')
const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')

const rules = reactive({
});

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

const onAdd = () => {
  selectedReservationRecordId.value = 0
  reservationRecordAddVisible.value = true
  reservationRecordAddTitle.value = '预定记录新增'
}
const editRow = (id: number) => {
  selectedReservationRecordId.value = id
  reservationRecordAddVisible.value = true
  reservationRecordAddTitle.value = '预定记录编辑'
}
const delRow = (id: number) => {
  if (!id) {
    return
  }
  ElMessageBox.confirm(
    '确定要删除吗?',
    '删除提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    reservationRecordApi.del(id)
      .then((resp) => {
        if (resp && resp.code === 1) {
          ElMessage.success('删除成功!')
          onSearch()
        } else {
          ElMessage.error('操作失败:' + (resp.msg ? resp.msg : '原因未知'))
        }
      })
      .catch(error => {
        console.error('操作失败:', error)
      })
  }).catch(() => {})
}
const detailRow = (id:number) => {
  selectedReservationRecordId.value = id
  reservationRecordViewVisible.value = true
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

const handleCloseReservationRecordViewEvent = () => {
  reservationRecordViewVisible.value = false
}

const handleResetReservationRecordAddEvent = () => {
  reservationRecordAddTitle.value = '预定记录新增'
}

const handleCloseReservationRecordAddEvent = (params: { search?: boolean } | undefined) => {
  if (params && params.search) {
    onSearch()
  }
  reservationRecordAddVisible.value = false
}

const onExport = () => {
  const headers = ['房号','姓名','联系电话','预定入驻时间','备注','状态']
  reservationRecordApi.find(reservationRecordQueryForm).then(data => {
    if (!data || !data.data || data.data.list.length < 1) {
      ElMessage.error('无数据导出')
      return
    }
    const exportData = []
    for (const d of data.data.list) {
      exportData.push([d.roomNumber, d.name, d.phone, d.checkInTime, d.remark, getReservationRecordStatusText(d.status)])
    }
    exportToExcel(headers, exportData)
  })
}
</script>

<style lang="scss">
</style>
