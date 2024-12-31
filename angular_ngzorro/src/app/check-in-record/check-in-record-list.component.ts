import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {CheckInRecordService} from '../../service/check-in-record.service';
import {CheckInRecordQueryForm} from '../../types/req/CheckInRecordQueryForm';
import {SharedModule} from '../shared.module';
import {CheckInRecord} from '../../types/resp/CheckInRecord';
import {Page} from '../../types/page';
import {CheckInRecordAddComponent} from './check-in-record-add.component';
import {CheckInRecordViewComponent} from './check-in-record-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ReservationRecordSelectorComponent} from '../reservation-record/reservation-record-selector.component';
import {RoomSelectorComponent} from '../room/room-selector.component';
import {exportToExcel} from '../../util/exportUtil';
import {getCheckInRecordStatusText} from '../../util/dictTranslator';

@Component({
  selector: 'check-in-record-list',
  imports: [
    ReservationRecordSelectorComponent,
    RoomSelectorComponent,
    CheckInRecordAddComponent,
    CheckInRecordViewComponent,
    SharedModule
  ],
  templateUrl: './check-in-record-list.component.html',
  standalone: true
})
export class CheckInRecordListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: CheckInRecord[] = [];
  total: number = 0

  @ViewChild(ReservationRecordSelectorComponent, { static: false }) reservationRecordSelectorComponent!: ReservationRecordSelectorComponent;
  @ViewChild(RoomSelectorComponent, { static: false }) roomSelectorComponent!: RoomSelectorComponent;
  @ViewChild(CheckInRecordAddComponent, { static: false }) checkInRecordAddComponent!: CheckInRecordAddComponent;
  @ViewChild(CheckInRecordViewComponent, { static: false }) checkInRecordViewComponent!: CheckInRecordViewComponent;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private checkInRecordService: CheckInRecordService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      reservationRecordId: [0],
      preName: [''],
      prePhone: [''],
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
      this.checkInRecordService.find(new CheckInRecordQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<CheckInRecord> | undefined = resp.data
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
    this.checkInRecordAddComponent.display(0)
  }

  onExport() {
    try {
      const headers = ['预定人员姓名', '预定人员联系电话', '房号', '姓名', '联系电话', '入驻时间', '退房时间', '房费', '商品消费', '总金额', '备注', '状态']
      this.searchLoading = true
      this.checkInRecordService.find(new CheckInRecordQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1 || !resp.data || resp.data.list.length < 1) {
            this.message.error('无数据导出')
            return
          }
          const exportData = []
          for (const d of resp.data.list) {
            exportData.push([d.preName, d.prePhone, d.roomNumber, d.name, d.phone, d.checkInTime,
              d.checkOutTime, d.roomAmount, d.goodsAmount, d.amount, d.remark, getCheckInRecordStatusText(d.status)])
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
    this.checkInRecordAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.checkInRecordService.del(id).subscribe({
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

  detailRow(record: CheckInRecord) {
    this.checkInRecordViewComponent.display(record)
  }

  findReservationRecord() {
    this.reservationRecordSelectorComponent.display()
  }

  handleReservationRecordSelectedEvent(selectedReservationRecord: { reservationRecordId?: number; preName?: string;prePhone?: string; }) {
    if (selectedReservationRecord && 'reservationRecordId' in selectedReservationRecord) {
      this.searchForm.patchValue(selectedReservationRecord);
    }
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
