<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="reservationRecordForm" :label-width="formLabelWidth" ref="refReservationRecordForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="房号" prop="roomNumber">
            <el-input v-model="reservationRecordForm.roomNumber" placeholder="请选择房号" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findRoom"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="reservationRecordForm.name" placeholder="请输入姓名" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="reservationRecordForm.phone" placeholder="请输入联系电话" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="预定入驻时间" prop="checkInTime">
            <el-date-picker
                v-model="reservationRecordForm.checkInTime" type="datetime" placeholder="预定入驻时间" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="reservationRecordForm.remark" placeholder="请输入备注" maxlength="255"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="状态" prop="status">
            <el-select v-model="reservationRecordForm.status" placeholder="请选择状态">
              <el-option label="已预定" :value="10"></el-option>
              <el-option label="已入驻" :value="20"></el-option>
              <el-option label="已取消" :value="30"></el-option>
            </el-select>
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
    <el-dialog :visible.sync="roomSelectorVisible" v-if="roomSelectorVisible" title="房间选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <room-selector @room-selected-event="handleRoomSelectedEvent">
      </room-selector>
    </el-dialog>
  </div>
</template>

<script>
import reservationRecordApi from '@/api/reservationRecordApi'
import RoomSelector from "@/views/room/RoomSelector.vue";
export default {
  name: 'ReservationRecordAdd',
  components: {RoomSelector,},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      reservationRecordForm: {
        roomId: '',
        roomNumber: '',
        name: '',
        phone: '',
        checkInTime: '',
        remark: '',
        status: ''
      },
      rules: {
        roomNumber:[
          { required: true, message: '请输入房号', trigger: 'blur' }
        ],
        name:[
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
      },
      roomSelectorVisible: false,
    }
  },
  created () {
    if (this.id) {
      reservationRecordApi.findById(Number(this.id))
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
    onReset () {
      this.reservationRecordForm = {
        roomId: '',
        roomNumber: '',
        name: '',
        phone: '',
        checkInTime: '',
        remark: '',
        status: ''
      }
      this.$emit('reset-reservation-record-add-event')
    },
    onSave () {
      this.$refs.refReservationRecordForm.validate((valid) => {
        if (valid) {
          reservationRecordApi.save(this.reservationRecordForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-reservation-record-add-event', {search: true})
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
    findRoom () {
      this.roomSelectorVisible = true
    },
    handleRoomSelectedEvent (selectedRoom) {
      this.roomSelectorVisible = false
      if (selectedRoom && 'roomId' in selectedRoom && this.searchParams.roomId !== selectedRoom['roomId']) {
        this.searchParams.roomId = selectedRoom['roomId']
        this.searchParams.roomNumber = selectedRoom['roomNumber']
      }
    },
    onBack () {
      this.$emit('close-reservation-record-add-event')
    }
  }
}
</script>

<style lang="scss">
</style>