import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/components/Layout.vue'
import Header from '@/views/components/Header.vue'
import Footer from '@/views/components/Footer.vue'
import Main from '@/views/components/Main.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import AdminList from '@/views/admin/AdminList.vue'
import GoodsList from '@/views/goods/GoodsList.vue'
import RoomList from '@/views/room/RoomList.vue'
import StaffList from '@/views/staff/StaffList.vue'
import ReservationRecordList from '@/views/reservationRecord/ReservationRecordList.vue'
import CheckInRecordList from '@/views/checkInRecord/CheckInRecordList.vue'
import CheckInRecordDetailList from '@/views/checkInRecordDetail/CheckInRecordDetailList.vue'
import RoomMaintenanceRecordList from '@/views/roomMaintenanceRecord/RoomMaintenanceRecordList.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        components: {
          default: Main,
          header: Header,
          footer: Footer
        },
        children: [
          {
            path: '/Home',
            name: 'Home',
            component: Home
          },
          {
            path: '/AdminList',
            name: 'AdminList',
            component: AdminList
          },
          {
            path: '/RoomList',
            name: 'RoomList',
            component: RoomList
          },
          {
            path: '/StaffList',
            name: 'StaffList',
            component: StaffList
          },
          {
            path: '/GoodsList',
            name: 'GoodsList',
            component: GoodsList
          },
          {
            path: '/ReservationRecordList',
            name: 'ReservationRecordList',
            component: ReservationRecordList
          },
          {
            path: '/CheckInRecordList',
            name: 'CheckInRecordList',
            component: CheckInRecordList
          },
          {
            path: '/CheckInRecordDetailList',
            name: 'CheckInRecordDetailList',
            component: CheckInRecordDetailList
          },
          {
            path: '/RoomMaintenanceRecordList',
            name: 'RoomMaintenanceRecordList',
            component: RoomMaintenanceRecordList
          }
        ]
      }
    ]
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && to.name !== 'VendorRegister' && !sessionStorage.getItem('backendToken')) {
    next('/Login')
  } else {
    next()
  }
})

export default router
