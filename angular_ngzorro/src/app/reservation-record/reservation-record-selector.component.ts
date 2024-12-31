import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ReservationRecordService} from '../../service/reservation-record.service';
import {ReservationRecordQueryForm} from '../../types/req/ReservationRecordQueryForm';
import {SharedModule} from '../shared.module';
import {ReservationRecord} from '../../types/resp/ReservationRecord';
import {Page} from '../../types/page';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MODAL_WIDTH} from '../../const';
import {RoomSelectorComponent} from '../room/room-selector.component';

@Component({
  selector: 'reservation-record-selector',
  imports: [
    RoomSelectorComponent,
    SharedModule
  ],
  templateUrl: './reservation-record-selector.component.html',
  standalone: true
})
export class ReservationRecordSelectorComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: ReservationRecord[] = [];
  total: number = 0
  isVisible: boolean = false
  title: string = '预定记录选择器(双击行选中)'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(RoomSelectorComponent, { static: false }) roomSelectorComponent!: RoomSelectorComponent;

  @Output() reservationRecordSelectedEvent = new EventEmitter<{}>();

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

  onRowDblClick(row: ReservationRecord, event: MouseEvent) {
    this.isVisible = false
    this.reservationRecordSelectedEvent.emit({
      reservationRecordId: row.id,
      preName: row.name,
      prePhone: row.phone,
    });
  }

  onBack() {
    this.isVisible = false
  }

  display() {
    this.isVisible = true
    this.searchForm.reset();
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
