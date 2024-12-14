<template>
  <div class="check-in-record-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>入住记录列表</el-breadcrumb-item>
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
          <el-option label="已入驻" :value="20"></el-option>
          <el-option label="已取消" :value="30"></el-option>
          <el-option label="已退房" :value="40"></el-option>
        </el-select>
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
      <el-table-column prop="preName" label="预定人员姓名"></el-table-column>
      <el-table-column prop="prePhone" label="预定人员联系电话"></el-table-column>
      <el-table-column prop="roomNumber" label="房号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="联系电话"></el-table-column>
      <el-table-column prop="checkInTime" label="入驻时间"></el-table-column>
      <el-table-column prop="checkOutTime" label="退房时间"></el-table-column>
      <el-table-column prop="roomAmount" label="房费"></el-table-column>
      <el-table-column prop="goodsAmount" label="商品消费"></el-table-column>
      <el-table-column prop="amount" label="总金额"></el-table-column>
      <el-table-column prop="remark" label="remark"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template v-slot="{ row }">
          <div v-if="row.status === 20">已入驻</div>
          <div v-if="row.status === 30">已取消</div>
          <div v-if="row.status === 40">已退房</div>
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
    <el-dialog :visible.sync="checkInRecordAddVisible" v-if="checkInRecordAddVisible" :title="checkInRecordAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <check-in-record-add :id="selectedCheckInRecordId" @close-check-in-record-add-event="handleCloseCheckInRecordAddEvent" @reset-check-in-record-add-event="handleResetCheckInRecordAddEvent">
      </check-in-record-add>
    </el-dialog>
    <el-dialog :visible.sync="checkInRecordViewVisible" v-if="checkInRecordViewVisible" title="入住记录详情" :top="dialogTop" :width="dialogWidth">
      <check-in-record-view :id="selectedCheckInRecordId" @close-check-in-record-view-event="handleCloseCheckInRecordViewEvent">
      </check-in-record-view>
    </el-dialog>
  </div>
</template>

<script>
import checkInRecordApi from '@/api/checkInRecordApi'
import RoomSelector from "@/views/room/RoomSelector.vue";
import CheckInRecordAdd from "@/views/checkInRecord/CheckInRecordAdd.vue"
import CheckInRecordView from "@/views/checkInRecord/CheckInRecordView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'CheckInRecordList',
  components: {RoomSelector,CheckInRecordAdd, CheckInRecordView},
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
      reservationRecordSelectorVisible: false,
      roomSelectorVisible: false,
      checkInRecordAddVisible: false,
      checkInRecordAddTitle: '',
      checkInRecordViewVisible: false,
      selectedCheckInRecordId: 0
    }
  },
  methods: {
    getPageData (p) {
      return checkInRecordApi.find(p)
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
      this.selectedCheckInRecordId = ''
      this.checkInRecordAddVisible = true
      this.checkInRecordAddTitle = '入住记录新增'
    },
    editRow (id) {
      this.selectedCheckInRecordId = id
      this.checkInRecordAddVisible = true
      this.checkInRecordAddTitle = '入住记录编辑'
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
        checkInRecordApi.del(id)
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
      this.selectedCheckInRecordId = id
      this.checkInRecordViewVisible = true
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
    handleCloseCheckInRecordViewEvent () {
      this.checkInRecordViewVisible = false
    },
    handleResetCheckInRecordAddEvent () {
      this.checkInRecordAddTitle = '入住记录新增'
    },
    handleCloseCheckInRecordAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.checkInRecordAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>