<template>
  <el-menu class="aside-menu"
           router
           :collapse="isCollapse"
           :default-openeds="defaultOpeneds"
           :default-active="currentHash"
           :unique-opened="true"
           @select="handleSelect">
    <el-menu-item>
      <i :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"></i>
      <span slot="title">收起</span>
    </el-menu-item>
    <el-menu-item v-for="item in menuItems" :key="item.index" :index="item.index">
      <i :class="item.icon"></i>
      <span slot="title">{{ item.title }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Aside',
  data () {
    return {
      isCollapse: false,
      navbars: [],
      defaultOpeneds: [],
      type: 0,
      menuItems: [
        { index: '/Home', icon: 'el-icon-s-home', title: '主页' },
        { index: '/AdminList', icon: 'el-icon-user-solid', title: '管理员' },
        { index: '/StaffList', icon: 'el-icon-service', title: '员工' },
        { index: '/GoodsList', icon: 'el-icon-goods', title: '商品' },
        { index: '/RoomList', icon: 'el-icon-house', title: '房间' },
        { index: '/ReservationRecordList', icon: 'el-icon-tickets', title: '预定记录' },
        { index: '/CheckInRecordList', icon: 'el-icon-s-check', title: '入住记录' },
        { index: '/CheckInRecordDetailList', icon: 'el-icon-s-goods', title: '入住消费商品' },
        { index: '/RoomMaintenanceRecordList', icon: 'el-icon-setting', title: '房间维护记录' },
        { index: '/ChartList', icon: 'el-icon-pie-chart', title: '数据统计' }
      ]
    }
  },
  created () {
  },
  mounted () {
    const type = sessionStorage.getItem('type')
    if (type) {
      this.type = Number(type)
    }
  },
  methods: {
    toHome () {
      this.$router.push({ name: 'Home' })
    },
    handleSelect(key) {
      if (!key) {
        this.isCollapse = !this.isCollapse
      }
      console.log('key', key)
    },
    findTitleByKey(key) {
      for (let mi of this.menuItems) {
        if (mi.index === key) {
          return mi.title
        }
      }
    }
  },
  computed: {
    currentHash () {
      return this.$router.currentRoute.fullPath
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/styles/var";

.aside-menu {
  height: 100%;
  width: 250px;
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
  background: darken($primary-color, 5);
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
