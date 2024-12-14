<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form :inline="true" :model="searchParams">
        <el-form-item label="房号" prop="roomNumber">
          <el-input v-model="searchParams.roomNumber" placeholder="请选择房号" readonly="readonly">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="findRoom"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="姓名">
            <el-input v-model="searchParams.name" placeholder="请输入姓名" maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
            <el-input v-model="searchParams.phone" placeholder="请输入联系电话" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="searchParams.status" placeholder="请选择状态">
            <el-option label="已预定" :value="10"></el-option>
            <el-option label="已入驻" :value="20"></el-option>
            <el-option label="已取消" :value="30"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="pageData.list"
        border
        v-loading="pageData.loading"
        size="mini"
        header-cell-class-name="table-header-cell-font"
        cell-class-name="table-cell-font"
        @row-dblclick="reservationRecordSelected">
      <el-table-column prop="roomId" label="房间id"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="联系电话"></el-table-column>
      <el-table-column prop="checkInTime" label="预定入驻时间"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template v-slot="{ row }">
          <div v-if="row.status === 10">已预定</div>
          <div v-if="row.status === 20">已入驻</div>
          <div v-if="row.status === 30">已取消</div>
        </template>
      </el-table-column>
      </el-table>
      <div class="table-pagination">
        <el-pagination
          @current-change="paginationChange"
          :current-page="pageData.current"
          :page-sizes="pageData.pageSizes"
          :page-size="pageData.size"
          background
          layout="total, prev, pager, next, jumper"
          :total="pageData.count">
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
    <el-dialog :visible.sync="roomSelectorVisible" v-if="roomSelectorVisible" title="房间选择器(双击行选中)" :top="dialogTop" :width="dialogWidth" :append-to-body="true">
      <room-selector @room-selected-event="handleRoomSelectedEvent">
      </room-selector>
    </el-dialog>
  </div>
</template>

<script>
import reservationRecordApi from '@/api/reservationRecordApi'
import RoomSelector from "@/views/room/RoomSelector.vue";
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'ReservationRecordSelector',
  components: {RoomSelector,},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        roomId: '',
        roomNumber: '',
        name: '',
        phone: '',
        status: ''
      },
      roomSelectorVisible: false,
    }
  },
  methods: {
    getPageData (p) {
      return reservationRecordApi.find(p)
    },
    onSearch () {
      this._getPageData()
    },
    onReset () {
      this.searchParams = {
        roomId: '',
        roomNumber: '',
        name: '',
        phone: '',
        status: ''
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    reservationRecordSelected (row) {
      this.$emit('reservation-record-selected-event', {
        reservationRecordId: row.id,
        preName: row.name,
        prePhone: row.phone,
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
      this.$emit('reservation-record-selected-event')
    }
  }
}
</script>

<style lang="scss">
</style>
