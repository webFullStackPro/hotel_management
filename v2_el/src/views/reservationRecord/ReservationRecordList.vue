<template>
  <div class="reservation-record-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>预定记录列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
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
        <el-button type="primary" @click="onAdd">新增</el-button>
        <el-button type="primary" @click="onExport">导出</el-button>
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
    <el-dialog :visible.sync="reservationRecordAddVisible" v-if="reservationRecordAddVisible" :title="reservationRecordAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <reservation-record-add :id="selectedReservationRecordId" @close-reservation-record-add-event="handleCloseReservationRecordAddEvent" @reset-reservation-record-add-event="handleResetReservationRecordAddEvent">
      </reservation-record-add>
    </el-dialog>
    <el-dialog :visible.sync="reservationRecordViewVisible" v-if="reservationRecordViewVisible" title="预定记录详情" :top="dialogTop" :width="dialogWidth">
      <reservation-record-view :id="selectedReservationRecordId" @close-reservation-record-view-event="handleCloseReservationRecordViewEvent">
      </reservation-record-view>
    </el-dialog>
  </div>
</template>

<script>
import reservationRecordApi from '@/api/reservationRecordApi'
import RoomSelector from "@/views/room/RoomSelector.vue";
import ReservationRecordAdd from "@/views/reservationRecord/ReservationRecordAdd.vue"
import ReservationRecordView from "@/views/reservationRecord/ReservationRecordView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
import {getReservationRecordStatusText} from "@/utils/dictTranslator";

export default {
  name: 'ReservationRecordList',
  components: {RoomSelector,ReservationRecordAdd, ReservationRecordView},
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
      reservationRecordAddVisible: false,
      reservationRecordAddTitle: '',
      reservationRecordViewVisible: false,
      selectedReservationRecordId: 0
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
    onAdd () {
      this.selectedReservationRecordId = ''
      this.reservationRecordAddVisible = true
      this.reservationRecordAddTitle = '预定记录新增'
    },
    onExport () {
      const headers = ['房号','姓名','联系电话','预定入驻时间','备注','状态']
      const params = Object.assign(this.getPaginationParams(), this.searchParams)
      this.getPageData(params).then(data => {
        if (!data || !data.data || data.data.list.length < 1) {
          this.$message.error('无数据导出')
          return
        }
        const exportData = []
        for (const d of data.data.list) {
          exportData.push([d.roomNumber, d.name, d.phone, d.checkInTime, d.remark, getReservationRecordStatusText(d.status)])
        }
        this.exportToExcel(headers, exportData)
      })
    },
    editRow (id) {
      this.selectedReservationRecordId = id
      this.reservationRecordAddVisible = true
      this.reservationRecordAddTitle = '预定记录编辑'
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
        reservationRecordApi.del(id)
          .then((resp) => {
            if (resp && resp.code === 1) {
              this.$message.success('删除成功!')
              this.onSearch()
            } else {
              this.$message.error('删除失败:' + (resp.msg ? resp.msg : '原因未知'))
            }
          })
          .catch(error => {
            console.error('删除数据失败:', error)
          })
      }).catch(() => {})
    },
    detailRow (id) {
      this.selectedReservationRecordId = id
      this.reservationRecordViewVisible = true
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
    handleCloseReservationRecordViewEvent () {
      this.reservationRecordViewVisible = false
    },
    handleResetReservationRecordAddEvent () {
      this.reservationRecordAddTitle = '预定记录新增'
    },
    handleCloseReservationRecordAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.reservationRecordAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>