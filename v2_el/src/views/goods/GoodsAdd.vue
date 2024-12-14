<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="goodsForm" :label-width="formLabelWidth" ref="refGoodsForm" :rules="rules">
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
            <el-button type="primary" @click="onReset" plain>重置</el-button>
            <el-button type="primary" @click="onBack">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import goodsApi from '@/api/goodsApi'
export default {
  name: 'GoodsAdd',
  components: {},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      goodsForm: {
        name: '',
        price: ''
      },
      rules: {
        name:[
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        price:[
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
      },
    }
  },
  created () {
    if (this.id) {
      goodsApi.findById(Number(this.id))
        .then(resp => {
          if (resp && resp.code === 1) {
            this.goodsForm = resp.data
          } else {
            this.$message.error('获取数据失败')
          }
        })
        .catch(error => {
          console.error('获取数据失败:', error)
        })
    }
  },
  methods: {
    onReset () {
      this.goodsForm = {
        name: '',
        price: ''
      }
      this.$emit('reset-goods-add-event')
    },
    onSave () {
      this.$refs.refGoodsForm.validate((valid) => {
        if (valid) {
          goodsApi.save(this.goodsForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-goods-add-event', {search: true})
              } else {
                this.$message.error('保存失败:' + (resp.msg ? resp.msg : ''))
              }
            })
            .catch(error => {
              console.log(error)
              this.$message.error('保存失败')
            })
        } else {
          return false
        }
      })
    },
    onBack () {
      this.$emit('close-goods-add-event')
    }
  }
}
</script>

<style lang="scss">
</style>