import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {SharedModule} from '../shared.module';
import {AuthService} from '../../service/auth.service';
import {HeaderComponent} from './header/header.component';

@Component({
  selector: 'app-layout',
  imports: [
    SharedModule,
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './layout.component.html',
  standalone: true,
  styleUrl: './layout.component.less'
})
export class LayoutComponent {
  isCollapsed: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  menuItems = [
    { label: '主页', icon: 'home', link: '/Home' },
    { label: '管理员', icon: 'user', link: '/AdminList' },
    { label: '员工', icon: 'bank', link: '/StaffList' },
    { label: '商品', icon: 'table', link: '/GoodsList' },
    { label: '房间', icon: 'team', link: '/RoomList' },
    { label: '预定记录', icon: 'ordered-list', link: '/ReservationRecordList' },
    { label: '入住记录', icon: 'solution', link: '/CheckInRecordList' },
    { label: '入住消费商品', icon: 'audit', link: '/CheckInRecordDetailList' },
    { label: '房间维护记录', icon: 'money-collect', link: '/RoomMaintenanceRecordList' },
    { label: '数据统计', icon: 'pie-chart', link: '/ChartList' }
  ];

  menuClick(item: any) {
    this.router.navigate([item.key]);
  }

  logout() {
    this.authService.logout();
    sessionStorage.removeItem('loginToken')
    sessionStorage.removeItem('uid')
    sessionStorage.removeItem('username')
    this.router.navigate(['/login']);
  }

}
