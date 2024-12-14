<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="goodsForm" :label-width="formLabelWidth" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="商品名称">
            <el-input v-model="goodsForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="价格">
            <el-input v-model="goodsForm.price"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="goodsForm.createTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="goodsForm.modifyTime"></el-input>
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
import goodsApi from '@/api/goodsApi'
import type {Goods} from "@/types/resp/goods";
import type {Id} from "@/types/id"

const goodsForm = reactive<Partial<Goods>>({});
const props = defineProps<Id>()
const emit = defineEmits<{
  (e: 'closeGoodsViewEvent'): void;
}>()
const formLabelWidth = ref<string>('')

onMounted(() => {
  initGoodsById(props.id)
  const globalState = inject('globalState', {} as { formLabelWidth?: string })
  if (!globalState) {
    throw new Error('globalState is not provided');
  }
  const globalStateRefs = toRefs(globalState)
  if (globalStateRefs.formLabelWidth) {
    formLabelWidth.value = globalStateRefs.formLabelWidth.value || ''
  }
})

const initGoodsById = async (id: number) => {
  const resp = await goodsApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(goodsForm, resp.data)
  }
}
const onBack = () => {
  emit('closeGoodsViewEvent')
}
</script>

<style lang="scss">
</style>