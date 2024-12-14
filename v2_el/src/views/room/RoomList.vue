<template>
  <div class="room-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>房间列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="searchParams">
      <el-form-item label="房号">
        <el-input v-model="searchParams.roomNumber" placeholder="请输入房号" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="房型" prop="roomType">
        <el-select v-model="searchParams.roomType" placeholder="请选择房型">
          <el-option label="标准单人间" :value="10"></el-option>
          <el-option label="豪华单人间" :value="11"></el-option>
          <el-option label="标准双人间" :value="20"></el-option>
          <el-option label="豪华双人间" :value="21"></el-option>
          <el-option label="标准套房" :value="90"></el-option>
          <el-option label="豪华套房" :value="91"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="searchParams.status" placeholder="请选择状态">
          <el-option label="空房" :value="10"></el-option>
          <el-option label="已预定" :value="20"></el-option>
          <el-option label="已入住" :value="30"></el-option>
          <el-option label="已退房(待清理)" :value="40"></el-option>
          <el-option label="维修中" :value="50"></el-option>
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
      <el-table-column prop="roomNumber" label="房号"></el-table-column>
      <el-table-column prop="roomType" label="房型">
        <template v-slot="{ row }">
          <div v-if="row.roomType === 10">标准单人间</div>
          <div v-if="row.roomType === 11">豪华单人间</div>
          <div v-if="row.roomType === 20">标准双人间</div>
          <div v-if="row.roomType === 21">豪华双人间</div>
          <div v-if="row.roomType === 90">标准套房</div>
          <div v-if="row.roomType === 91">豪华套房</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template v-slot="{ row }">
          <div v-if="row.status === 10">空房</div>
          <div v-if="row.status === 20">已预定</div>
          <div v-if="row.status === 30">已入住</div>
          <div v-if="row.status === 40">已退房(待清理)</div>
          <div v-if="row.status === 50">维修中</div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="area" label="面积"></el-table-column>
      <el-table-column prop="floorNumber" label="楼层"></el-table-column>
      <el-table-column prop="bedType" label="床型"></el-table-column>
      <el-table-column prop="maxOccupancy" label="入住人数"></el-table-column>
      <el-table-column prop="freeWifi" label="wifi是否免费">
        <template v-slot="{ row }">
          <div v-if="row.freeWifi === 0">否</div>
          <div v-if="row.freeWifi === 1">是</div>
        </template>
      </el-table-column>
      <el-table-column prop="existWindow" label="是否有窗">
        <template v-slot="{ row }">
          <div v-if="row.existWindow === 0">否</div>
          <div v-if="row.existWindow === 1">是</div>
        </template>
      </el-table-column>
      <el-table-column prop="freeBreakfast" label="是否有免费早餐">
        <template v-slot="{ row }">
          <div v-if="row.freeBreakfast === 0">否</div>
          <div v-if="row.freeBreakfast === 1">是</div>
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
    <el-dialog :visible.sync="roomAddVisible" v-if="roomAddVisible" :title="roomAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <room-add :id="selectedRoomId" @close-room-add-event="handleCloseRoomAddEvent" @reset-room-add-event="handleResetRoomAddEvent">
      </room-add>
    </el-dialog>
    <el-dialog :visible.sync="roomViewVisible" v-if="roomViewVisible" title="房间详情" :top="dialogTop" :width="dialogWidth">
      <room-view :id="selectedRoomId" @close-room-view-event="handleCloseRoomViewEvent">
      </room-view>
    </el-dialog>
  </div>
</template>

<script>
import roomApi from '@/api/roomApi'
import RoomAdd from "@/views/room/RoomAdd.vue"
import RoomView from "@/views/room/RoomView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'RoomList',
  components: {RoomAdd, RoomView},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        roomNumber: '',
        roomType: '',
        status: ''
      },
      roomAddVisible: false,
      roomAddTitle: '',
      roomViewVisible: false,
      selectedRoomId: 0
    }
  },
  methods: {
    getPageData (p) {
      return roomApi.find(p)
    },
    onSearch () {
      this._getPageData()
    },
    onReset () {
      this.searchParams = {
        roomNumber: '',
        roomType: '',
        status: ''
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    onAdd () {
      this.selectedRoomId = ''
      this.roomAddVisible = true
      this.roomAddTitle = '房间新增'
    },
    editRow (id) {
      this.selectedRoomId = id
      this.roomAddVisible = true
      this.roomAddTitle = '房间编辑'
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
        roomApi.del(id)
          .then((resp) => {
            if (resp && resp.code === 1) {
              this.$message.success('删除成功!')
              this.onSearch()
            } else {
              this.$message.error('保存失败:' + (resp.msg ? resp.msg : '原因未知'))
            }
          })
          .catch(error => {
            console.error('获取数据失败:', error)
          })
      }).catch(() => {})
    },
    detailRow (id) {
      this.selectedRoomId = id
      this.roomViewVisible = true
    },
    handleCloseRoomViewEvent () {
      this.roomViewVisible = false
    },
    handleResetRoomAddEvent () {
      this.roomAddTitle = '房间新增'
    },
    handleCloseRoomAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.roomAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>