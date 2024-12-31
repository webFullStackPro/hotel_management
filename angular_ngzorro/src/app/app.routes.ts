import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './auth.guard';
import {LayoutComponent} from './layout/layout.component';
import {HomeComponent} from './home/home.component';
import {AdminListComponent} from './admin/admin-list.component';
import {StaffListComponent} from './staff/staff-list.component';
import {GoodsListComponent} from './goods/goods-list.component';
import {RoomListComponent} from './room/room-list.component';
import {ReservationRecordListComponent} from './reservation-record/reservation-record-list.component';
import {CheckInRecordListComponent} from './check-in-record/check-in-record-list.component';
import {CheckInRecordDetailListComponent} from './check-in-record-detail/check-in-record-detail-list.component';
import {RoomMaintenanceRecordListComponent} from './room-maintenance-record/room-maintenance-record-list.component';
import {ChartListComponent} from './chart/chart-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/Home', pathMatch: 'full' },
      { path: 'Home', component: HomeComponent },
      { path: 'AdminList', component: AdminListComponent },
      { path: 'StaffList', component: StaffListComponent },
      { path: 'GoodsList', component: GoodsListComponent },
      { path: 'RoomList', component: RoomListComponent },
      { path: 'ReservationRecordList', component: ReservationRecordListComponent },
      { path: 'CheckInRecordList', component: CheckInRecordListComponent },
      { path: 'CheckInRecordDetailList', component: CheckInRecordDetailListComponent },
      { path: 'RoomMaintenanceRecordList', component: RoomMaintenanceRecordListComponent },
      { path: 'ChartList', component: ChartListComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
