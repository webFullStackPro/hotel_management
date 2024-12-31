import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {CheckInRecordService} from '../../service/check-in-record.service';
import {CheckInRecordQueryForm} from '../../types/req/CheckInRecordQueryForm';
import {SharedModule} from '../shared.module';
import {CheckInRecord} from '../../types/resp/CheckInRecord';
import {Page} from '../../types/page';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MODAL_WIDTH} from '../../const';
import {ReservationRecordSelectorComponent} from '../reservation-record/reservation-record-selector.component';
import {RoomSelectorComponent} from '../room/room-selector.component';

@Component({
  selector: 'check-in-record-selector',
  imports: [
    ReservationRecordSelectorComponent,
    RoomSelectorComponent,
    SharedModule
  ],
  templateUrl: './check-in-record-selector.component.html',
  standalone: true
})
export class CheckInRecordSelectorComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: CheckInRecord[] = [];
  total: number = 0
  isVisible: boolean = false
  title: string = '入住记录选择器(双击行选中)'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(ReservationRecordSelectorComponent, { static: false }) reservationRecordSelectorComponent!: ReservationRecordSelectorComponent;
  @ViewChild(RoomSelectorComponent, { static: false }) roomSelectorComponent!: RoomSelectorComponent;

  @Output() checkInRecordSelectedEvent = new EventEmitter<{}>();

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

  onRowDblClick(row: CheckInRecord, event: MouseEvent) {
    this.isVisible = false
    this.checkInRecordSelectedEvent.emit({
      checkInRecordId: row.id,
      name: row.name,
      phone: row.phone,
    });
  }

  onBack() {
    this.isVisible = false
  }

  display() {
    this.isVisible = true
    this.searchForm.reset();
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
}
