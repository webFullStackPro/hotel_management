<template>
  <div class="pop-dialog-container">
    <div class="pop-dialog-main">
      <el-form :inline="true" :model="searchParams">
        <el-form-item label="商品名称">
            <el-input v-model="searchParams.name" placeholder="请输入商品名称" maxlength="255"></el-input>
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
        @row-dblclick="goodsSelected">
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="modifyTime" label="最后修改时间"></el-table-column>
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
import goodsApi from '@/api/goodsApi'
import listQueryMixin from '@/mixins/listQueryMixin'
export default {
  name: 'GoodsSelector',
  components: {},
  mixins: [
    listQueryMixin
  ],
  data () {
    return {
      searchParams: {
        name: ''
      }
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
    goodsSelected (row) {
      this.$emit('goods-selected-event', {
        goodsId: row.id,
        goodsName: row.name,
        goodsPrice: row.price,
      })
    },
    onBack () {
      this.$emit('goods-selected-event')
    }
  }
}
</script>

<style lang="scss">
</style>
