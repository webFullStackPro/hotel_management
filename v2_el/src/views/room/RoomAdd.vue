<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
    <el-form label-position="right" :model="roomForm" :label-width="formLabelWidth" ref="refRoomForm" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="房号" prop="roomNumber">
            <el-input v-model="roomForm.roomNumber" placeholder="请输入房号" maxlength="32"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="房型" prop="roomType">
            <el-select v-model="roomForm.roomType" placeholder="请选择房型">
              <el-option label="标准单人间" :value="10"></el-option>
              <el-option label="豪华单人间" :value="11"></el-option>
              <el-option label="标准双人间" :value="20"></el-option>
              <el-option label="豪华双人间" :value="21"></el-option>
              <el-option label="标准套房" :value="90"></el-option>
              <el-option label="豪华套房" :value="91"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="价格" prop="price">
            <el-input-number v-model="roomForm.price" :precision="2" :step="0.1" :min="1" :max="99999999"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="面积" prop="area">
            <el-input v-model="roomForm.area" placeholder="请输入面积" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="楼层" prop="floorNumber">
            <el-input v-model="roomForm.floorNumber" placeholder="请输入楼层" maxlength="32"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="床型" prop="bedType">
            <el-input v-model="roomForm.bedType" placeholder="请输入床型" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="入住人数" prop="maxOccupancy">
            <el-input-number v-model="roomForm.maxOccupancy" :min="1" :max="10"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="wifi是否免费" prop="freeWifi">
            <el-select v-model="roomForm.freeWifi" placeholder="请选择wifi是否免费">
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="是否有窗" prop="existWindow">
            <el-select v-model="roomForm.existWindow" placeholder="请选择是否有窗">
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="是否有免费早餐" prop="freeBreakfast">
            <el-select v-model="roomForm.freeBreakfast" placeholder="请选择是否有免费早餐">
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
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
  </div>
</template>

<script>
import roomApi from '@/api/roomApi'
export default {
  name: 'RoomAdd',
  components: {},
  props: ['id'],
  mixins: [
  ],
  data () {
    return {
      roomForm: {
        roomNumber: '',
        roomType: '',
        price: '',
        area: '',
        floorNumber: '',
        bedType: '',
        maxOccupancy: '',
        freeWifi: '',
        existWindow: '',
        freeBreakfast: ''
      },
      rules: {
        roomNumber:[
          { required: true, message: '请输入房号', trigger: 'blur' }
        ],
        roomType:[
          { required: true, message: '请输入房型', trigger: 'blur' }
        ],
      },
    }
  },
  created () {
    if (this.id) {
      roomApi.findById(Number(this.id))
        .then(resp => {
          if (resp && resp.code === 1) {
            this.roomForm = resp.data
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
      this.roomForm = {
        roomNumber: '',
        roomType: '',
        price: '',
        area: '',
        floorNumber: '',
        bedType: '',
        maxOccupancy: '',
        freeWifi: '',
        existWindow: '',
        freeBreakfast: ''
      }
      this.$emit('reset-room-add-event')
    },
    onSave () {
      this.$refs.refRoomForm.validate((valid) => {
        if (valid) {
          roomApi.save(this.roomForm)
            .then((resp) => {
              if (resp && resp.code === 1) {
                this.$message.success('保存成功')
                this.$emit('close-room-add-event', {search: true})
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
      this.$emit('close-room-add-event')
    }
  }
}
</script>

<style lang="scss">
</style>