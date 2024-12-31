import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {RoomService} from '../../service/room.service';
import {RoomQueryForm} from '../../types/req/RoomQueryForm';
import {SharedModule} from '../shared.module';
import {Room} from '../../types/resp/Room';
import {Page} from '../../types/page';
import {RoomAddComponent} from './room-add.component';
import {RoomViewComponent} from './room-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ReservationRecordQueryForm} from '../../types/req/ReservationRecordQueryForm';
import {
  getReservationRecordStatusText,
  getRoomStatusText,
  getRoomTypeText,
  getYesOrNoText
} from '../../util/dictTranslator';
import {exportToExcel} from '../../util/exportUtil';

@Component({
  selector: 'room-list',
  imports: [
    RoomAddComponent,
    RoomViewComponent,
    SharedModule
  ],
  templateUrl: './room-list.component.html',
  standalone: true
})
export class RoomListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Room[] = [];
  total: number = 0

  @ViewChild(RoomAddComponent, { static: false }) roomAddComponent!: RoomAddComponent;
  @ViewChild(RoomViewComponent, { static: false }) roomViewComponent!: RoomViewComponent;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private roomService: RoomService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      roomNumber: [''],
      roomType: [undefined],
      status: [undefined],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.roomService.find(new RoomQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<Room> | undefined = resp.data
          if (page && page.list.length > 0) {
            this.listOfData = page.list
            this.total = page.total
          }
        },
        complete: () => {
          this.searchLoading = false
        }
      })
    } catch (e) {
      console.log('获取数据异常', e)
    }
  }

  onAdd() {
    this.roomAddComponent.display(0)
  }

  onExport() {
    try {
      const headers = ['房号','房型','状态','价格','面积','楼层','床型','入住人数','wifi是否免费','是否有窗','是否有免费早餐']
      this.searchLoading = true
      this.roomService.find(new RoomQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1 || !resp.data || resp.data.list.length < 1) {
            this.message.error('无数据导出')
            return
          }
          const exportData = []
          for (const d of resp.data.list) {
            exportData.push([d.roomNumber, getRoomTypeText(d.roomType), getRoomStatusText(d.status), d.price, d.area,
              d.floorNumber, d.bedType, d.maxOccupancy, getYesOrNoText(d.freeWifi), getYesOrNoText(d.existWindow),
              getYesOrNoText(d.freeBreakfast)])
          }
          exportToExcel(headers, exportData)
        },
        complete: () => {
          this.searchLoading = false
        }
      })
    } catch (e) {
      console.log('获取数据异常', e)
    }
  }

  editRow(id: number) {
    this.roomAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.roomService.del(id).subscribe({
          next: (resp) => {
            if (resp && resp.code === 1) {
              this.message.success('删除成功!')
              this.onSearch()
            } else {
              this.message.error('操作失败:' + (resp.msg ? resp.msg : '原因未知'))
            }
          },
          complete: () => {
            this.searchLoading = false
          }
        })
      }
    });
  }

  detailRow(record: Room) {
    this.roomViewComponent.display(record)
  }

  onAdded(addedFlag: boolean) {
    if (addedFlag) {
      this.onSearch()
    }
  }
}
