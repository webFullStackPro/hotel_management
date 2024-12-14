import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../views/layout/Layout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: Layout,
      children: [{
        path: "/",
        component: () => import("@/views/Home.vue"),
        name: "Home"
      },{
        path: "/AdminList",
        component: () => import("@/views/admin/AdminList.vue"),
        name: "AdminList"
      },{
        path: "/StaffList",
        component: () => import("@/views/staff/StaffList.vue"),
        name: "StaffList"
      },{
        path: "/GoodsList",
        component: () => import("@/views/goods/GoodsList.vue"),
        name: "GoodsList"
      },{
        path: "/RoomList",
        component: () => import("@/views/room/RoomList.vue"),
        name: "RoomList"
      },{
        path: "/ReservationRecordList",
        component: () => import("@/views/reservationRecord/ReservationRecordList.vue"),
        name: "ReservationRecordList"
      },{
        path: "/CheckInRecordList",
        component: () => import("@/views/checkInRecord/CheckInRecordList.vue"),
        name: "CheckInRecordList"
      },{
        path: "/CheckInRecordDetailList",
        component: () => import("@/views/checkInRecordDetail/CheckInRecordDetailList.vue"),
        name: "CheckInRecordDetailList"
      },{
        path: "/RoomMaintenanceRecordList",
        component: () => import("@/views/roomMaintenanceRecord/RoomMaintenanceRecordList.vue"),
        name: "RoomMaintenanceRecordList"
      }]
    }
    ,{
      path: '/Login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
    }
  ],
})

router.beforeEach((to, from, next) => {
  const loginToken = sessionStorage.getItem('loginToken');

  if (to.name !== 'Login' && !loginToken) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router
