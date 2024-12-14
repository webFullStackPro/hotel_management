<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="checkInRecordForm" label-width="150px" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="姓名">
            <el-input v-model="checkInRecordForm.preName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input v-model="checkInRecordForm.prePhone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="房号">
            <el-input v-model="checkInRecordForm.roomNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="姓名">
            <el-input v-model="checkInRecordForm.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input v-model="checkInRecordForm.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="入驻时间">
            <el-input v-model="checkInRecordForm.checkInTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="退房时间">
            <el-input v-model="checkInRecordForm.checkOutTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="房费">
            <el-input v-model="checkInRecordForm.roomAmount"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="商品消费">
            <el-input v-model="checkInRecordForm.goodsAmount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="总金额">
            <el-input v-model="checkInRecordForm.amount"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="remark">
            <el-input v-model="checkInRecordForm.remark"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="状态">
            <el-select v-model="checkInRecordForm.status" placeholder="请选择状态">
              <el-option label="已入驻" :value="20"></el-option>
              <el-option label="已取消" :value="30"></el-option>
              <el-option label="已退房" :value="40"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="checkInRecordForm.createTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="checkInRecordForm.modifyTime"></el-input>
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
import checkInRecordApi from '@/api/checkInRecordApi'
export default {
  name: 'CheckInRecordView',
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      checkInRecordForm: {
      }
    }
  },
  created () {
    if (this.id) {
      checkInRecordApi.findById(this.id)
          .then(resp => {
            if (resp && resp.code === 1) {
              this.checkInRecordForm = resp.data
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
      this.$emit('close-check-in-record-view-event')
    }
  }
}
</script>

<style lang="scss">
</style>