<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form :inline="true" :model="goodsQueryForm" ref="goodsQueryFormRef" :rules="rules">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="goodsQueryForm.name" placeholder="请输入商品名称" maxlength="255"></el-input>
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
        @row-dblclick="goodsSelected">
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
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
import {onMounted, reactive, ref, inject, toRefs, defineEmits} from 'vue';
import goodsApi from '@/api/goodsApi'
import type {GoodsQueryForm} from "@/types/req/goodsQueryForm";
import type {Goods} from "@/types/resp/goods";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import type {Result} from "@/types/result";
import type {Page} from "@/types/page";

const goodsQueryFormRef = ref<FormInstance | null>(null);
let goodsQueryForm = reactive<GoodsQueryForm>({
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

const dialogTop = ref<string>('')
const dialogWidth = ref<string>('')

const rules = reactive({
});

const emit = defineEmits<{
  (e: 'goodsSelectedEvent', data?: {
    goodsId: number,
    goodsName: string,
    goodsPrice: number,
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

const goodsSelected = (row: Goods) => {
  emit('goodsSelectedEvent', {
    goodsId: row.id,
    goodsName: row.name,
    goodsPrice: row.price,
  })
}


const onBack = () => {
  emit('goodsSelectedEvent')
}
</script>

<style lang="scss">
</style>
