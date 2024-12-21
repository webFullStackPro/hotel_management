<template>
  <el-menu class="aside-menu"
           router
           :collapse="isCollapse"
           :default-active="currentHash"
           @select="handleSelect"
           :unique-opened="true">
    <el-menu-item :index="0">
      <el-icon v-if="!isCollapse"><Fold/></el-icon><el-icon v-if="isCollapse"><Expand /></el-icon>
      <span slot="title">收起</span>
    </el-menu-item>
    <el-menu-item v-for="item in menuItems" :key="item.index" :index="item.index">
      <el-icon><component :is="item.icon"></component></el-icon>
      <span slot="title">{{ item.title }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {useRoute} from 'vue-router'
import {
  Checked,
  Expand,
  Fold,
  Goods,
  GoodsFilled,
  HomeFilled,
  House,
  PieChart,
  Service,
  Setting,
  Tickets,
  UserFilled
} from '@element-plus/icons-vue';

const route = useRoute()
const isCollapse = ref(false);
const currentHash = computed(() => {
  return route.fullPath
});

const handleSelect = (key: string) => {
  console.log('key', key)
  if (!key) {
    isCollapse.value = !isCollapse.value
  }
}

const menuItems = [
  { index: '/Home', icon: HomeFilled, title: '主页' },
  { index: '/AdminList', icon: UserFilled, title: '管理员' },
  { index: '/StaffList', icon: Service, title: '员工' },
  { index: '/GoodsList', icon: Goods, title: '商品' },
  { index: '/RoomList', icon: House, title: '房间' },
  { index: '/ReservationRecordList', icon: Tickets, title: '预定记录' },
  { index: '/CheckInRecordList', icon: Checked, title: '入住记录' },
  { index: '/CheckInRecordDetailList', icon: GoodsFilled, title: '入住消费商品' },
  { index: '/RoomMaintenanceRecordList', icon: Setting, title: '房间维护记录' },
  { index: '/ChartList', icon: PieChart, title: '数据统计' }
]
</script>

<style lang="scss" scoped>
.aside-menu:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
}

.brand {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  margin-right: -1px;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  box-shadow: 0 1px 1px 0 $box-shadow-base;
  white-space: nowrap;

  .platform-name {
    cursor: pointer;
    height: 60px;
    line-height: 60px;
  }
}

.toggle {
  display: inline-block;
  width: 20px;
  cursor: pointer;

  @at-root #{&}__minus {
    display: block;
    width: 20px;
    height: 2px;
    background: #fff;
    margin-bottom: 5px;
  }
}
</style>
