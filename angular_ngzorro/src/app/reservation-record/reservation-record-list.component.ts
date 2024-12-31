import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ReservationRecordService} from '../../service/reservation-record.service';
import {ReservationRecordQueryForm} from '../../types/req/ReservationRecordQueryForm';
import {SharedModule} from '../shared.module';
import {ReservationRecord} from '../../types/resp/ReservationRecord';
import {Page} from '../../types/page';
import {ReservationRecordAddComponent} from './reservation-record-add.component';
import {ReservationRecordViewComponent} from './reservation-record-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {RoomSelectorComponent} from '../room/room-selector.component';
import {exportToExcel} from '../../util/exportUtil';
import {getReservationRecordStatusText} from '../../util/dictTranslator';

@Component({
  selector: 'reservation-record-list',
  imports: [
    RoomSelectorComponent,
    ReservationRecordAddComponent,
    ReservationRecordViewComponent,
    SharedModule
  ],
  templateUrl: './reservation-record-list.component.html',
  standalone: true
})
export class ReservationRecordListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: ReservationRecord[] = [];
  total: number = 0

  @ViewChild(RoomSelectorComponent, { static: false }) roomSelectorComponent!: RoomSelectorComponent;
  @ViewChild(ReservationRecordAddComponent, { static: false }) reservationRecordAddComponent!: ReservationRecordAddComponent;
  @ViewChild(ReservationRecordViewComponent, { static: false }) reservationRecordViewComponent!: ReservationRecordViewComponent;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private reservationRecordService: ReservationRecordService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      roomId: [0],
      roomNumber: [''],
      name: [''],
      phone: [''],
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
      this.reservationRecordService.find(new ReservationRecordQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<ReservationRecord> | undefined = resp.data
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
    this.reservationRecordAddComponent.display(0)
  }

  onExport() {
    try {
      const headers = ['房号','姓名','联系电话','预定入驻时间','备注','状态']
      this.searchLoading = true
      this.reservationRecordService.find(new ReservationRecordQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1 || !resp.data || resp.data.list.length < 1) {
            this.message.error('无数据导出')
            return
          }
          const exportData = []
          for (const d of resp.data.list) {
            exportData.push([d.roomNumber, d.name, d.phone, d.checkInTime, d.remark, getReservationRecordStatusText(d.status)])
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
    this.reservationRecordAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.reservationRecordService.del(id).subscribe({
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

  detailRow(record: ReservationRecord) {
    this.reservationRecordViewComponent.display(record)
  }

  findRoom() {
    this.roomSelectorComponent.display()
  }

  handleRoomSelectedEvent(selectedRoom: { roomId?: number; roomNumber?: string; }) {
    if (selectedRoom && 'roomId' in selectedRoom) {
      this.searchForm.patchValue(selectedRoom);
    }
  }

  onAdded(addedFlag: boolean) {
    if (addedFlag) {
      this.onSearch()
    }
  }
}
