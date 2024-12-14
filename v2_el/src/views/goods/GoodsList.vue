<template>
  <div class="goods-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="Home" :replace="true">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="searchParams">
      <el-form-item label="商品名称">
        <el-input v-model="searchParams.name" placeholder="请输入商品名称" maxlength="255"></el-input>
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
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="modifyTime" label="最后修改时间"></el-table-column>
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
    <el-dialog :visible.sync="goodsAddVisible" v-if="goodsAddVisible" :title="goodsAddTitle" :top="dialogTop" :width="dialogWidth" :modal-append-to-body="true">
      <goods-add :id="selectedGoodsId" @close-goods-add-event="handleCloseGoodsAddEvent" @reset-goods-add-event="handleResetGoodsAddEvent">
      </goods-add>
    </el-dialog>
    <el-dialog :visible.sync="goodsViewVisible" v-if="goodsViewVisible" title="商品详情" :top="dialogTop" :width="dialogWidth">
      <goods-view :id="selectedGoodsId" @close-goods-view-event="handleCloseGoodsViewEvent">
      </goods-view>
    </el-dialog>
  </div>
</template>

<script>
import goodsApi from '@/api/goodsApi'
import GoodsAdd from "@/views/goods/GoodsAdd.vue"
import GoodsView from "@/views/goods/GoodsView.vue"
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'GoodsList',
  components: {GoodsAdd, GoodsView},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        name: ''
      },
      goodsAddVisible: false,
      goodsAddTitle: '',
      goodsViewVisible: false,
      selectedGoodsId: 0
    }
  },
  methods: {
    getPageData (p) {
      return goodsApi.find(p)
    },
    onSearch () {
      this._getPageData()
    },
    onReset () {
      this.searchParams = {
        name: ''
      }
      this.pageData.pageIndex = 1
      this._getPageData()
    },
    onAdd () {
      this.selectedGoodsId = ''
      this.goodsAddVisible = true
      this.goodsAddTitle = '商品新增'
    },
    editRow (id) {
      this.selectedGoodsId = id
      this.goodsAddVisible = true
      this.goodsAddTitle = '商品编辑'
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
        goodsApi.del(id)
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
      this.selectedGoodsId = id
      this.goodsViewVisible = true
    },
    handleCloseGoodsViewEvent () {
      this.goodsViewVisible = false
    },
    handleResetGoodsAddEvent () {
      this.goodsAddTitle = '商品新增'
    },
    handleCloseGoodsAddEvent (params) {
      if (params && params.search) {
        this.onSearch()
      }
      this.goodsAddVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>