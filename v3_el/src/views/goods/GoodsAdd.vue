<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form label-position="right" :model="goodsForm" :label-width="formLabelWidth" ref="goodsFormRef" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="goodsForm.name" placeholder="请输入商品名称" maxlength="255"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="价格" prop="price">
              <el-input-number v-model="goodsForm.price" :precision="2" :step="0.1" :min="1" :max="9999"></el-input-number>
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
import goodsApi from '@/api/goodsApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {GoodsForm} from "@/types/req/goodsForm";
import type {Result} from '@/types/result'
import type {Goods} from "@/types/resp/goods";
import type {Id} from "@/types/id";

const props = defineProps<Id>()
const goodsFormRef = ref<FormInstance | null>(null);
let goodsForm = reactive<GoodsForm>({
  name: '',
  price: 0,
})
const emit = defineEmits<{
  (e: 'resetGoodsAddEvent'): void;
  (e: 'closeGoodsAddEvent', data?: { search: boolean }): void;
}>()

const rules = reactive({
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' }
  ],
});
const formLabelWidth = ref<string>('')

onMounted(() => {
  if (props.id) {
    initGoodsFormById(props.id)
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

const initGoodsFormById = async (id: number) => {
  const resp: Result<Goods> = await goodsApi.findById(id)
  if (resp && resp.code === 1 && resp.data) {
    Object.assign(goodsForm, resp.data)
  }
}

const onReset = () => {
  if (goodsFormRef.value) {
    goodsFormRef.value.resetFields()
  }
  emit('resetGoodsAddEvent')
}

const onSave = () => {
  if (!goodsFormRef.value) {
    return
  }
  goodsFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const resp: Result<void> = await goodsApi.save(goodsForm)
      if (resp && resp.code === 1) {
        ElMessage.success('保存成功')
        emit('closeGoodsAddEvent', {search: true})
      } else {
        ElMessage.error('保存失败:' + (resp.msg ? resp.msg : ''))
      }
    }
  })
}

const onBack = () => {
  emit('closeGoodsAddEvent')
}
</script>

<style lang="scss">
</style>
