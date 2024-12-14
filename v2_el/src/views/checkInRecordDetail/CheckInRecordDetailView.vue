<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="checkInRecordDetailForm" label-width="150px" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="姓名">
            <el-input v-model="checkInRecordDetailForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input v-model="checkInRecordDetailForm.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="商品名称">
            <el-input v-model="checkInRecordDetailForm.goodsName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="价格">
            <el-input v-model="checkInRecordDetailForm.goodsPrice"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="数量">
            <el-input v-model="checkInRecordDetailForm.qty"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="单价">
            <el-input v-model="checkInRecordDetailForm.price"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="总价">
            <el-input v-model="checkInRecordDetailForm.amount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="checkInRecordDetailForm.createTime"></el-input>
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

<script>
import checkInRecordDetailApi from '@/api/checkInRecordDetailApi'
export default {
  name: 'CheckInRecordDetailView',
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      checkInRecordDetailForm: {
      }
    }
  },
  created () {
    if (this.id) {
      checkInRecordDetailApi.findById(this.id)
          .then(resp => {
            if (resp && resp.code === 1) {
              this.checkInRecordDetailForm = resp.data
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
    onBack () {
      this.$emit('close-check-in-record-detail-view-event')
    }
  }
}
</script>

<style lang="scss">
</style>