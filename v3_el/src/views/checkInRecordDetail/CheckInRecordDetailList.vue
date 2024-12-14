<template>
  <div class="checkInRecordDetail-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>入住消费商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="checkInRecordDetailQueryForm" ref="checkInRecordDetailQueryFormRef" :rules="rules">
      <el-form-item label="入住人员姓名" prop="name">
        <el-input v-model="checkInRecordDetailQueryForm.name" placeholder="请选择入住人员姓名" readonly="readonly">
          <template #suffix>
            <el-icon @click="findCheckInRecord"><Search/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="入住人员联系电话" prop="phone">
        <el-input v-model="checkInRecordDetailQueryForm.phone" placeholder="请选择入住人员联系电话" readonly="readonly">
          <template #suffix>
            <el-icon @click="findCheckInRecord"><Search/></el-icon>
          </template>
        </el-input>
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
      <el-table-column prop="name" label="入住人员姓名"></el-table-column>
      <el-table-column prop="phone" label="入住人员联系电话"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称"></el-table-column>
      <el-table-column prop="goodsPrice" label="商品价格"></el-table-column>
      <el-table-column prop="qty" label="数量"></el-table-column>
      <el-table-column prop="price" label="单价"></el-table-column>
      <el-table-column prop="amount" label="总价"></el-table-column>
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
    <el-dialog v-model="checkInRecordSelectorVisible" v-if="checkInRecordSelectorVisible" title="入住记录选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <check-in-record-selector @check-in-record-selected-event="handleCheckInRecordSelectedEvent">
      </check-in-record-selector>
    </el-dialog>
    <el-dialog v-model="checkInRecordDetailAddVisible" v-if="checkInRecordDetailAddVisible" :title="checkInRecordDetailAddTitle" :top="dialogTop" :width="dialogWidth">
      <check-in-record-detail-add :id="selectedCheckInRecordDetailId" @close-check-in-record-detail-add-event="handleCloseCheckInRecordDetailAddEvent" @reset-check-in-record-detail-add-event="handleResetCheckInRecordDetailAddEvent">
      </check-in-record-detail-add>
    </el-dialog>
    <el-dialog v-model="checkInRecordDetailViewVisible" v-if="checkInRecordDetailViewVisible" title="入住消费商品详情" :top="dialogTop" :width="dialogWidth">
      <check-in-record-detail-view :id="selectedCheckInRecordDetailId" @close-check-in-record-detail-view-event="handleCloseCheckInRecordDetailViewEvent">
      </check-in-record-detail-view>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, inject, toRefs} from 'vue';
import checkInRecordDetailApi from '@/api/checkInRecordDetailApi'
import type {CheckInRecordDetailQueryForm} from "@/types/req/checkInRecordDetailQueryForm";
import type {CheckInRecordDetail} from "@/types/resp/checkInRecordDetail";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import { Search } from '@element-plus/icons-vue';
import CheckInRecordSelector from "@/views/checkInRecord/CheckInRecordSelector.vue";
import CheckInRecordDetailAdd from "@/views/checkInRecordDetail/CheckInRecordDetailAdd.vue"
import CheckInRecordDetailView from "@/views/checkInRecordDetail/CheckInRecordDetailView.vue"

const checkInRecordDetailQueryFormRef = ref<FormInstance | null>(null);
let checkInRecordDetailQueryForm = reactive<CheckInRecordDetailQueryForm>({
  checkInRecordId: 0,
  name: '',
  phone: '',
})

const state = reactive({
  loading: false,
  tableData: [] as CheckInRecordDetail[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})
const selectedCheckInRecordDetailId = ref<number>(0)
const checkInRecordSelectorVisible = ref<boolean>(false)
const goodsSelectorVisible = ref<boolean>(false)
const checkInRecordDetailAddVisible = ref<boolean>(false)
const checkInRecordDetailViewVisible = ref<boolean>(false)
const checkInRecordDetailAddTitle = ref<string>('')
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
    const resp: Result<Page<CheckInRecordDetail>> = await checkInRecordDetailApi.find(checkInRecordDetailQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
      const page: Page<CheckInRecordDetail> = resp.data
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
  if (checkInRecordDetailQueryFormRef.value) {
    checkInRecordDetailQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const onAdd = () => {
  selectedCheckInRecordDetailId.value = 0
  checkInRecordDetailAddVisible.value = true
  checkInRecordDetailAddTitle.value = '入住消费商品新增'
}
const editRow = (id: number) => {
  selectedCheckInRecordDetailId.value = id
  checkInRecordDetailAddVisible.value = true
  checkInRecordDetailAddTitle.value = '入住消费商品编辑'
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
    checkInRecordDetailApi.del(id)
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
  selectedCheckInRecordDetailId.value = id
  checkInRecordDetailViewVisible.value = true
}

const findCheckInRecord = () => {
  checkInRecordSelectorVisible.value = true
}

const handleCheckInRecordSelectedEvent = (selectedCheckInRecord: any) => {
  checkInRecordSelectorVisible.value = false
  if (selectedCheckInRecord && 'checkInRecordId' in selectedCheckInRecord && checkInRecordDetailQueryForm.checkInRecordId !== selectedCheckInRecord['checkInRecordId']) {
    checkInRecordDetailQueryForm.checkInRecordId = selectedCheckInRecord['checkInRecordId']
    checkInRecordDetailQueryForm.name = selectedCheckInRecord['name']
    checkInRecordDetailQueryForm.phone = selectedCheckInRecord['phone']
  }
}

const handleCloseCheckInRecordDetailViewEvent = () => {
  checkInRecordDetailViewVisible.value = false
}

const handleResetCheckInRecordDetailAddEvent = () => {
  checkInRecordDetailAddTitle.value = '入住消费商品新增'
}

const handleCloseCheckInRecordDetailAddEvent = (params: { search?: boolean } | undefined) => {
  if (params && params.search) {
    onSearch()
  }
  checkInRecordDetailAddVisible.value = false
}
</script>

<style lang="scss">
</style>