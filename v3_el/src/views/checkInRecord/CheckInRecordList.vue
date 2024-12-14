<template>
  <div class="checkInRecord-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>入住记录列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="checkInRecordQueryForm" ref="checkInRecordQueryFormRef" :rules="rules">
      <el-form-item label="房号" prop="roomNumber">
        <el-input v-model="checkInRecordQueryForm.roomNumber" placeholder="请选择房号" readonly="readonly">
          <template #suffix>
            <el-icon @click="findRoom"><Search/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="checkInRecordQueryForm.name" placeholder="请输入姓名" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="checkInRecordQueryForm.phone" placeholder="请输入联系电话" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="checkInRecordQueryForm.status" placeholder="请选择状态" class="select-custom">
          <el-option label="已入驻" :value="20"></el-option>
          <el-option label="已取消" :value="30"></el-option>
          <el-option label="已退房" :value="40"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" @click="onAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="state.tableData"
      border
      v-loading="state.loading"
      size="small"
      header-cell-class-name="table-header-cell-font"
      cell-class-name="table-cell-font">
      <el-table-column prop="preName" label="预定人员姓名"></el-table-column>
      <el-table-column prop="prePhone" label="预定人员联系电话"></el-table-column>
      <el-table-column prop="roomNumber" label="房号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="联系电话"></el-table-column>
      <el-table-column prop="checkInTime" label="入驻时间"></el-table-column>
      <el-table-column prop="checkOutTime" label="退房时间"></el-table-column>
      <el-table-column prop="roomAmount" label="房费"></el-table-column>
      <el-table-column prop="goodsAmount" label="商品消费"></el-table-column>
      <el-table-column prop="amount" label="总金额"></el-table-column>
      <el-table-column prop="remark" label="remark"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template v-slot="{ row }">
          <div v-if="row.status === 20">已入驻</div>
          <div v-if="row.status === 30">已取消</div>
          <div v-if="row.status === 40">已退房</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template v-slot="{ row }">
          <el-button @click.native.prevent="editRow(row.id)" type="primary">编辑</el-button>
          <el-button @click.native.prevent="delRow(row.id)" type="danger" plain>删除</el-button>
          <el-button @click.native.prevent="detailRow(row.id)" type="primary" plain>详情</el-button>
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
    <el-dialog v-model="checkInRecordAddVisible" v-if="checkInRecordAddVisible" :title="checkInRecordAddTitle" :top="dialogTop" :width="dialogWidth">
      <check-in-record-add :id="selectedCheckInRecordId" @close-check-in-record-add-event="handleCloseCheckInRecordAddEvent" @reset-check-in-record-add-event="handleResetCheckInRecordAddEvent">
      </check-in-record-add>
    </el-dialog>
    <el-dialog v-model="checkInRecordViewVisible" v-if="checkInRecordViewVisible" title="入住记录详情" :top="dialogTop" :width="dialogWidth">
      <check-in-record-view :id="selectedCheckInRecordId" @close-check-in-record-view-event="handleCloseCheckInRecordViewEvent">
      </check-in-record-view>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, inject, toRefs} from 'vue';
import checkInRecordApi from '@/api/checkInRecordApi'
import type {CheckInRecordQueryForm} from "@/types/req/checkInRecordQueryForm";
import type {CheckInRecord} from "@/types/resp/checkInRecord";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import { Search } from '@element-plus/icons-vue';
import RoomSelector from "@/views/room/RoomSelector.vue";
import CheckInRecordAdd from "@/views/checkInRecord/CheckInRecordAdd.vue"
import CheckInRecordView from "@/views/checkInRecord/CheckInRecordView.vue"

const checkInRecordQueryFormRef = ref<FormInstance | null>(null);
let checkInRecordQueryForm = reactive<CheckInRecordQueryForm>({
  roomId: 0,
  roomNumber: '',
  name: '',
  phone: '',
  status: undefined,
})

const state = reactive({
  loading: false,
  tableData: [] as CheckInRecord[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})
const selectedCheckInRecordId = ref<number>(0)
const reservationRecordSelectorVisible = ref<boolean>(false)
const roomSelectorVisible = ref<boolean>(false)
const checkInRecordAddVisible = ref<boolean>(false)
const checkInRecordViewVisible = ref<boolean>(false)
const checkInRecordAddTitle = ref<string>('')
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
    const resp: Result<Page<CheckInRecord>> = await checkInRecordApi.find(checkInRecordQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
      const page: Page<CheckInRecord> = resp.data
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
  if (checkInRecordQueryFormRef.value) {
    checkInRecordQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const onAdd = () => {
  selectedCheckInRecordId.value = 0
  checkInRecordAddVisible.value = true
  checkInRecordAddTitle.value = '入住记录新增'
}
const editRow = (id: number) => {
  selectedCheckInRecordId.value = id
  checkInRecordAddVisible.value = true
  checkInRecordAddTitle.value = '入住记录编辑'
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
    checkInRecordApi.del(id)
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
  selectedCheckInRecordId.value = id
  checkInRecordViewVisible.value = true
}

const findRoom = () => {
  roomSelectorVisible.value = true
}

const handleRoomSelectedEvent = (selectedRoom: any) => {
  roomSelectorVisible.value = false
  if (selectedRoom && 'roomId' in selectedRoom && checkInRecordQueryForm.roomId !== selectedRoom['roomId']) {
    checkInRecordQueryForm.roomId = selectedRoom['roomId']
    checkInRecordQueryForm.roomNumber = selectedRoom['roomNumber']
  }
}

const handleCloseCheckInRecordViewEvent = () => {
  checkInRecordViewVisible.value = false
}

const handleResetCheckInRecordAddEvent = () => {
  checkInRecordAddTitle.value = '入住记录新增'
}

const handleCloseCheckInRecordAddEvent = (params: { search?: boolean } | undefined) => {
  if (params && params.search) {
    onSearch()
  }
  checkInRecordAddVisible.value = false
}
</script>

<style lang="scss">
</style>