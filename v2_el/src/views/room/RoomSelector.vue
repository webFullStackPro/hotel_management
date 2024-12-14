<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
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
        </el-form-item>
      </el-form>

      <el-table
        :data="pageData.list"
        border
        v-loading="pageData.loading"
        size="mini"
        header-cell-class-name="table-header-cell-font"
        cell-class-name="table-cell-font"
        @row-dblclick="roomSelected">
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
  </div>
</template>

<script>
import roomApi from '@/api/roomApi'
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'RoomSelector',
  components: {},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        roomNumber: '',
        roomType: '',
        status: ''
      }
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
    roomSelected (row) {
      this.$emit('room-selected-event', {
        roomId: row.id,
        roomNumber: row.roomNumber,
      })
    },
    onBack () {
      this.$emit('room-selected-event')
    }
  }
}
</script>

<style lang="scss">
</style>
