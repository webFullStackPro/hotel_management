<template>
  <div class="room-maintenance-record-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>房间维护记录列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="searchParams">
      <el-form-item label="房号" prop="roomNumber">
        <el-input v-model="searchParams.roomNumber" placeholder="请选择房号" readonly="readonly">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="findRoom"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="员工姓名" prop="staffName">
        <el-input v-model="searchParams.staffName" placeholder="请选择员工姓名" readonly="readonly">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="findStaff"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="员工联系电话" prop="staffPhone">
        <el-input v-model="searchParams.staffPhone" placeholder="请选择员工联系电话" readonly="readonly">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="findStaff"></i>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" @click="onAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="pageData.list"
      border
      v-loading="pageData.loading"
      size="mini"
      header-cell-class-name="table-header-cell-font"
      cell-class-name="table-cell-font">
      <el-table-column prop="roomNumber" label="房号"></el-table-column>
      <el-table-column prop="staffName" label="员工姓名"></el-table-column>
      <el-table-column prop="staffPhone" label="员工联系电话"></el-table-column>
      <el-table-column prop="startTime" label="开始时间"></el-table-column>
      <el-table-column prop="endTime" label="结束时间"></el-table-column>
      <el-table-column prop="content" label="维护内容"></el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template v-slot="{ row }">
          <el-button @click.native.prevent="editRow(row.id)" type="primary">编辑</el-button>
          <el-button @click.native.prevent="delRow(row.id)" type="danger" plain>删除</el-button>
          <el-button @click.native.prevent="detailRow(row.id)" type="primary" plain>详情</el-button>
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
    <el-dialog :visible.sync="roomSelectorVisible" v-if="roomSelectorVisible" title="房间选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <room-selector @room-selected-event="handleRoomSelectedEvent">
      </room-selector>
    </el-dialog>
    <el-dialog :visible.sync="staffSelectorVisible" v-if="staffSelectorVisible" title="员工选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <staff-selector @staff-selected-event="handleStaffSelectedEvent">
      </staff-selector>
    </el-dialog>
    <el-dialog :visible.sync="roomMaintenanceRecordAddVisible" v-if="roomMaintenanceRecordAddVisible" :title="roomMaintenanceRecordAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <room-maintenance-record-add :id="selectedRoomMaintenanceRecordId" @close-room-maintenance-record-add-event="handleCloseRoomMaintenanceRecordAddEvent" @reset-room-maintenance-record-add-event="handleResetRoomMaintenanceRecordAddEvent">
      </room-maintenance-record-add>
    </el-dialog>
    <el-dialog :visible.sync="roomMaintenanceRecordViewVisible" v-if="roomMaintenanceRecordViewVisible" title="房间维护记录详情" :top="dialogTop" :width="dialogWidth">
      <room-maintenance-record-view :id="selectedRoomMaintenanceRecordId" @close-room-maintenance-record-view-event="handleCloseRoomMaintenanceRecordViewEvent">
      </room-maintenance-record-view>
    </el-dialog>
  </div>
</template>

<script>
import roomMaintenanceRecordApi from '@/api/roomMaintenanceRecordApi'
import RoomSelector from "@/views/room/RoomSelector.vue";
import StaffSelector from "@/views/staff/StaffSelector.vue";
import RoomMaintenanceRecordAdd from "@/views/roomMaintenanceRecord/RoomMaintenanceRecordAdd.vue"
import RoomMaintenanceRecordView from "@/views/roomMaintenanceRecord/RoomMaintenanceRecordView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'RoomMaintenanceRecordList',
  components: {RoomSelector,StaffSelector,RoomMaintenanceRecordAdd, RoomMaintenanceRecordView},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        roomId: '',
        roomNumber: '',
        staffId: '',
        staffName: '',
        staffPhone: '',
      },
      roomSelectorVisible: false,
      staffSelectorVisible: false,
      roomMaintenanceRecordAddVisible: false,
      roomMaintenanceRecordAddTitle: '',
      roomMaintenanceRecordViewVisible: false,
      selectedRoomMaintenanceRecordId: 0
    }
  },
  methods: {
    getPageData (p) {
      return roomMaintenanceRecordApi.find(p)
    },
    onSearch () {
      this._getPageData()
    },
    onReset () {
      this.searchParams = {
        roomId: '',
        roomNumber: '',
        staffId: '',
        staffName: '',
        staffPhone: '',
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    onAdd () {
      this.selectedRoomMaintenanceRecordId = ''
      this.roomMaintenanceRecordAddVisible = true
      this.roomMaintenanceRecordAddTitle = '房间维护记录新增'
    },
    editRow (id) {
      this.selectedRoomMaintenanceRecordId = id
      this.roomMaintenanceRecordAddVisible = true
      this.roomMaintenanceRecordAddTitle = '房间维护记录编辑'
    },
    delRow (id) {
      if (!id) {
        return
      }
      this.$confirm('确定要删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        roomMaintenanceRecordApi.del(id)
          .then((resp) => {
            if (resp && resp.code === 1) {
              this.$message.success('删除成功!')
              this.onSearch()
            } else {
              this.$message.error('删除失败:' + (resp.msg ? resp.msg : '原因未知'))
            }
          })
          .catch(error => {
            console.error('操作失败:', error)
          })
      }).catch(() => {})
    },
    detailRow (id) {
      this.selectedRoomMaintenanceRecordId = id
      this.roomMaintenanceRecordViewVisible = true
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
    findStaff () {
      this.staffSelectorVisible = true
    },
    handleStaffSelectedEvent (selectedStaff) {
      this.staffSelectorVisible = false
      if (selectedStaff && 'staffId' in selectedStaff && this.searchParams.staffId !== selectedStaff['staffId']) {
        this.searchParams.staffId = selectedStaff['staffId']
        this.searchParams.staffName = selectedStaff['staffName']
        this.searchParams.staffPhone = selectedStaff['staffPhone']
      }
    },
    handleCloseRoomMaintenanceRecordViewEvent () {
      this.roomMaintenanceRecordViewVisible = false
    },
    handleResetRoomMaintenanceRecordAddEvent () {
      this.roomMaintenanceRecordAddTitle = '房间维护记录新增'
    },
    handleCloseRoomMaintenanceRecordAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.roomMaintenanceRecordAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>