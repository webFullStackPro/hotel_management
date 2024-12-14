<template>
  <div class="check-in-record-detail-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>入住消费商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="searchParams">
      <el-form-item label="入住人员姓名" prop="name">
        <el-input v-model="searchParams.name" placeholder="请选择入住人员姓名" readonly="readonly">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="findCheckInRecord"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="入住人员联系电话" prop="phone">
        <el-input v-model="searchParams.phone" placeholder="请选择入住人员联系电话" readonly="readonly">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="findCheckInRecord"></i>
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
      <el-table-column prop="name" label="入住人员姓名"></el-table-column>
      <el-table-column prop="phone" label="入住人员联系电话"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称"></el-table-column>
      <el-table-column prop="qty" label="数量"></el-table-column>
      <el-table-column prop="price" label="单价"></el-table-column>
      <el-table-column prop="amount" label="总价"></el-table-column>
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
    <el-dialog :visible.sync="checkInRecordSelectorVisible" v-if="checkInRecordSelectorVisible" title="入住记录选择器(双击行选中)" :top="dialogTop" :width="dialogWidth">
      <check-in-record-selector @check-in-record-selected-event="handleCheckInRecordSelectedEvent">
      </check-in-record-selector>
    </el-dialog>
    <el-dialog :visible.sync="checkInRecordDetailAddVisible" v-if="checkInRecordDetailAddVisible" :title="checkInRecordDetailAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <check-in-record-detail-add :id="selectedCheckInRecordDetailId" @close-check-in-record-detail-add-event="handleCloseCheckInRecordDetailAddEvent" @reset-check-in-record-detail-add-event="handleResetCheckInRecordDetailAddEvent">
      </check-in-record-detail-add>
    </el-dialog>
    <el-dialog :visible.sync="checkInRecordDetailViewVisible" v-if="checkInRecordDetailViewVisible" title="入住消费商品详情" :top="dialogTop" :width="dialogWidth">
      <check-in-record-detail-view :id="selectedCheckInRecordDetailId" @close-check-in-record-detail-view-event="handleCloseCheckInRecordDetailViewEvent">
      </check-in-record-detail-view>
    </el-dialog>
  </div>
</template>

<script>
import checkInRecordDetailApi from '@/api/checkInRecordDetailApi'
import CheckInRecordSelector from "@/views/checkInRecord/CheckInRecordSelector.vue";
import CheckInRecordDetailAdd from "@/views/checkInRecordDetail/CheckInRecordDetailAdd.vue"
import CheckInRecordDetailView from "@/views/checkInRecordDetail/CheckInRecordDetailView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'CheckInRecordDetailList',
  components: {CheckInRecordSelector,CheckInRecordDetailAdd, CheckInRecordDetailView},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        checkInRecordId: '',
        name: '',
        phone: '',
      },
      checkInRecordSelectorVisible: false,
      goodsSelectorVisible: false,
      checkInRecordDetailAddVisible: false,
      checkInRecordDetailAddTitle: '',
      checkInRecordDetailViewVisible: false,
      selectedCheckInRecordDetailId: 0
    }
  },
  methods: {
    getPageData (p) {
      return checkInRecordDetailApi.find(p)
    },
    onSearch () {
      this._getPageData()
    },
    onReset () {
      this.searchParams = {
        checkInRecordId: '',
        name: '',
        phone: '',
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    onAdd () {
      this.selectedCheckInRecordDetailId = ''
      this.checkInRecordDetailAddVisible = true
      this.checkInRecordDetailAddTitle = '入住消费商品新增'
    },
    editRow (id) {
      this.selectedCheckInRecordDetailId = id
      this.checkInRecordDetailAddVisible = true
      this.checkInRecordDetailAddTitle = '入住消费商品编辑'
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
        checkInRecordDetailApi.del(id)
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
      this.selectedCheckInRecordDetailId = id
      this.checkInRecordDetailViewVisible = true
    },
    findCheckInRecord () {
      this.checkInRecordSelectorVisible = true
    },
    handleCheckInRecordSelectedEvent (selectedCheckInRecord) {
      this.checkInRecordSelectorVisible = false
      if (selectedCheckInRecord && 'checkInRecordId' in selectedCheckInRecord && this.searchParams.checkInRecordId !== selectedCheckInRecord['checkInRecordId']) {
        this.searchParams.checkInRecordId = selectedCheckInRecord['checkInRecordId']
        this.searchParams.name = selectedCheckInRecord['name']
        this.searchParams.phone = selectedCheckInRecord['phone']
      }
    },
    handleCloseCheckInRecordDetailViewEvent () {
      this.checkInRecordDetailViewVisible = false
    },
    handleResetCheckInRecordDetailAddEvent () {
      this.checkInRecordDetailAddTitle = '入住消费商品新增'
    },
    handleCloseCheckInRecordDetailAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.checkInRecordDetailAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>