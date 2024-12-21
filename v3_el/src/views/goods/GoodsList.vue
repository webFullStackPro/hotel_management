<template>
  <div class="goods-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="goodsQueryForm" ref="goodsQueryFormRef" :rules="rules">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="goodsQueryForm.name" placeholder="请输入商品名称" maxlength="255"></el-input>
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
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
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
    <el-dialog v-model="goodsAddVisible" v-if="goodsAddVisible" :title="goodsAddTitle" :top="dialogTop" :width="dialogWidth">
      <goods-add :id="selectedGoodsId" @close-goods-add-event="handleCloseGoodsAddEvent" @reset-goods-add-event="handleResetGoodsAddEvent">
      </goods-add>
    </el-dialog>
    <el-dialog v-model="goodsViewVisible" v-if="goodsViewVisible" title="商品详情" :top="dialogTop" :width="dialogWidth">
      <goods-view :id="selectedGoodsId" @close-goods-view-event="handleCloseGoodsViewEvent">
      </goods-view>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, inject, toRefs} from 'vue';
import goodsApi from '@/api/goodsApi'
import type {GoodsQueryForm} from "@/types/req/goodsQueryForm";
import type {Goods} from "@/types/resp/goods";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";
import GoodsAdd from "@/views/goods/GoodsAdd.vue"
import GoodsView from "@/views/goods/GoodsView.vue"
import checkInRecordApi from '@/api/checkInRecordApi.ts'
import { getCheckInRecordStatusText } from '@/composables/dictTranslator.ts'
import { exportToExcel } from '@/composables/exportUtil.ts'

const goodsQueryFormRef = ref<FormInstance | null>(null);
const goodsQueryForm = reactive<GoodsQueryForm>({
  name: '',
})

const state = reactive({
  loading: false,
  tableData: [] as Goods[], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  pageSizes: [10, 20, 50]
})
const selectedGoodsId = ref<number>(0)
const goodsAddVisible = ref<boolean>(false)
const goodsViewVisible = ref<boolean>(false)
const goodsAddTitle = ref<string>('')
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
    const resp: Result<Page<Goods>> = await goodsApi.find(goodsQueryForm)
    if (resp && resp.code === 1) {
      if (resp.data) {
      const page: Page<Goods> = resp.data
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
  if (goodsQueryFormRef.value) {
    goodsQueryFormRef.value.resetFields()
  }
  state.currentPage = 1
  getPageData()
}

const onAdd = () => {
  selectedGoodsId.value = 0
  goodsAddVisible.value = true
  goodsAddTitle.value = '商品新增'
}
const editRow = (id: number) => {
  selectedGoodsId.value = id
  goodsAddVisible.value = true
  goodsAddTitle.value = '商品编辑'
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
    goodsApi.del(id)
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
  selectedGoodsId.value = id
  goodsViewVisible.value = true
}

const handleCloseGoodsViewEvent = () => {
  goodsViewVisible.value = false
}

const handleResetGoodsAddEvent = () => {
  goodsAddTitle.value = '商品新增'
}

const handleCloseGoodsAddEvent = (params: { search?: boolean } | undefined) => {
  if (params && params.search) {
    onSearch()
  }
  goodsAddVisible.value = false
}

const onExport = () => {
  const headers = ['商品名称', '价格']
  goodsApi.find(goodsQueryForm).then(data => {
    if (!data || !data.data || data.data.list.length < 1) {
      ElMessage.error('无数据导出')
      return
    }
    const exportData = []
    for (const d of data.data.list) {
      exportData.push([d.name, d.price])
    }
    exportToExcel(headers, exportData)
  })
}
</script>

<style lang="scss">
</style>
