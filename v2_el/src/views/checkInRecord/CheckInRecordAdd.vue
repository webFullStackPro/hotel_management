<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="checkInRecordForm" :label-width="formLabelWidth" ref="refCheckInRecordForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="预定人员姓名" prop="preName">
            <el-input v-model="checkInRecordForm.preName" placeholder="请选择预定人员姓名" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findReservationRecord"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="预定人员联系电话" prop="prePhone">
            <el-input v-model="checkInRecordForm.prePhone" placeholder="请选择预定人员联系电话" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findReservationRecord"></i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="房号" prop="roomNumber">
            <el-input v-model="checkInRecordForm.roomNumber" placeholder="请选择房号" readonly="readonly">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="findRoom"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="checkInRecordForm.name" placeholder="请输入姓名" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="checkInRecordForm.phone" placeholder="请输入联系电话" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="入驻时间" prop="checkInTime">
            <el-date-picker
                v-model="checkInRecordForm.checkInTime" type="datetime" placeholder="入驻时间" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="退房时间" prop="checkOutTime">
            <el-date-picker
                v-model="checkInRecordForm.checkOutTime" type="datetime" placeholder="退房时间" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="房费" prop="roomAmount">
            <el-input-number v-model="checkInRecordForm.roomAmount" :min="1" :max="9999999" @change="calculateAmount"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="商品消费" prop="goodsAmount">
            <el-input-number v-model="checkInRecordForm.goodsAmount" :min="1" :max="9999999" @change="calculateAmount"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="总金额" prop="amount">
            <el-input v-model="checkInRecordForm.amount" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="remark" prop="remark">
            <el-input v-model="checkInRecordForm.remark" placeholder="请输入remark" maxlength="255"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="状态" prop="status">
            <el-select v-model="checkInRecordForm.status" placeholder="请选择状态">
              <el-option label="已入驻" :value="20"></el-option>
              <el-option label="已取消" :value="30"></el-option>
              <el-option label="已退房" :value="40"></el-option>
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
    <el-dialog :visible.sync="reservationRecordSelectorVisible" v-if="reservationRecordSelectorVisible" title="预定记录选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <reservation-record-selector @reservation-record-selected-event="handleReservationRecordSelectedEvent">
      </reservation-record-selector>
    </el-dialog>
    <el-dialog :visible.sync="roomSelectorVisible" v-if="roomSelectorVisible" title="房间选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <room-selector @room-selected-event="handleRoomSelectedEvent">
      </room-selector>
    </el-dialog>
  </div>
</template>

<script>
import checkInRecordApi from '@/api/checkInRecordApi'
import ReservationRecordSelector from "@/views/reservationRecord/ReservationRecordSelector.vue";
import RoomSelector from "@/views/room/RoomSelector.vue";
export default {
  name: 'CheckInRecordAdd',
  components: {ReservationRecordSelector,RoomSelector,},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      checkInRecordForm: {
        reservationRecordId: '',
        preName: '',
        prePhone: '',
        roomId: '',
        roomNumber: '',
        name: '',
        phone: '',
        checkInTime: '',
        checkOutTime: '',
        roomAmount: '',
        goodsAmount: '',
        amount: '',
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
      reservationRecordSelectorVisible: false,
      roomSelectorVisible: false,
    }
  },
  created () {
    if (this.id) {
      checkInRecordApi.findById(Number(this.id))
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
  mounted() {
    this.calculateAmount()
  },
  methods: {
    onReset () {
      this.checkInRecordForm = {
        reservationRecordId: '',
        preName: '',
        prePhone: '',
        roomId: '',
        roomNumber: '',
        name: '',
        phone: '',
        checkInTime: '',
        checkOutTime: '',
        roomAmount: '',
        goodsAmount: '',
        amount: '',
        remark: '',
        status: ''
      }
      this.$emit('reset-check-in-record-add-event')
    },
    onSave () {
      this.$refs.refCheckInRecordForm.validate((valid) => {
        if (valid) {
          checkInRecordApi.save(this.checkInRecordForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-check-in-record-add-event', {search: true})
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
    findReservationRecord () {
      this.reservationRecordSelectorVisible = true
    },
    handleReservationRecordSelectedEvent (selectedReservationRecord) {
      this.reservationRecordSelectorVisible = false
      if (selectedReservationRecord && 'reservationRecordId' in selectedReservationRecord && this.checkInRecordForm.reservationRecordId !== selectedReservationRecord['reservationRecordId']) {
        this.checkInRecordForm.reservationRecordId = selectedReservationRecord['reservationRecordId']
        this.checkInRecordForm.preName = selectedReservationRecord['preName']
        this.checkInRecordForm.prePhone = selectedReservationRecord['prePhone']
      }
    },
    findRoom () {
      this.roomSelectorVisible = true
    },
    handleRoomSelectedEvent (selectedRoom) {
      this.roomSelectorVisible = false
      if (selectedRoom && 'roomId' in selectedRoom && this.checkInRecordForm.roomId !== selectedRoom['roomId']) {
        this.checkInRecordForm.roomId = selectedRoom['roomId']
        this.checkInRecordForm.roomNumber = selectedRoom['roomNumber']
      }
    },
    onBack () {
      this.$emit('close-check-in-record-add-event')
    },
    calculateAmount() {
      this.checkInRecordForm.amount = this.checkInRecordForm.roomAmount + this.checkInRecordForm.goodsAmount
    }
  }
}
</script>

<style lang="scss">
</style>