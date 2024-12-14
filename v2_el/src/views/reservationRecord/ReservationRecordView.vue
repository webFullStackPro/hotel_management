<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="reservationRecordForm" label-width="150px" disabled="disabled">
      <el-row>
        <el-col :span="11">
          <el-form-item label="房号">
            <el-input v-model="reservationRecordForm.roomNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="姓名">
            <el-input v-model="reservationRecordForm.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input v-model="reservationRecordForm.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="预定入驻时间">
            <el-input v-model="reservationRecordForm.checkInTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="备注">
            <el-input v-model="reservationRecordForm.remark"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="状态">
            <el-select v-model="reservationRecordForm.status" placeholder="请选择状态">
              <el-option label="已预定" :value="10"></el-option>
              <el-option label="已入驻" :value="20"></el-option>
              <el-option label="已取消" :value="30"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="创建时间">
            <el-input v-model="reservationRecordForm.createTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="最后修改时间">
            <el-input v-model="reservationRecordForm.modifyTime"></el-input>
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
import reservationRecordApi from '@/api/reservationRecordApi'
export default {
  name: 'ReservationRecordView',
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      reservationRecordForm: {
      }
    }
  },
  created () {
    if (this.id) {
      reservationRecordApi.findById(this.id)
          .then(resp => {
            if (resp && resp.code === 1) {
              this.reservationRecordForm = resp.data
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
      this.$emit('close-reservation-record-view-event')
    }
  }
}
</script>

<style lang="scss">
</style>