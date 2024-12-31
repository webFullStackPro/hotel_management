import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ReservationRecordService} from '../../service/reservation-record.service';
import {SharedModule} from '../shared.module';
import {ReservationRecordForm} from '../../types/req/ReservationRecordForm';
import {MODAL_WIDTH} from '../../const'
import {RoomSelectorComponent} from '../room/room-selector.component';

@Component({
  selector: 'reservation-record-add',
  imports: [
    RoomSelectorComponent,
    SharedModule
  ],
  templateUrl: './reservation-record-add.component.html',
  standalone: true
})
export class ReservationRecordAddComponent implements OnInit {
  reservationRecordToSave:ReservationRecordForm = {};
  reservationRecordForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增预定记录'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(RoomSelectorComponent, { static: false }) roomSelectorComponent!: RoomSelectorComponent;

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private reservationRecordService: ReservationRecordService
  ) {}

  ngOnInit(): void {
    this.reservationRecordForm = this.fb.group({
      roomId: [0],
      roomNumber: ['', [Validators.required]],
      name: ['', [Validators.required]],
      phone: [''],
      checkInTime: [''],
      remark: [''],
      status: [undefined],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.reservationRecordForm.controls) {
        this.reservationRecordForm.controls[i].markAsDirty();
        this.reservationRecordForm.controls[i].updateValueAndValidity();
      }
      if (!this.reservationRecordForm.valid) {
        this.saveLoading = false
        return
      }
      this.reservationRecordService.save(Object.assign(this.reservationRecordToSave, this.reservationRecordForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          this.message.success("保存成功")
          this.onBack(true)
        },
        complete: () => {
          this.saveLoading = false
        }
      })
    } catch (e) {
      console.log('获取数据异常', e)
    }
  }

  onReset() {
    this.title = '新增预定记录'.slice()
    this.reservationRecordForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改预定记录'
      this.saveLoading = true
      this.reservationRecordService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.reservationRecordToSave = resp.data
            this.reservationRecordForm.patchValue(this.reservationRecordToSave);
          }
        },
        complete: () => {
          this.saveLoading = false
        }
      })
    } else {
      this.onReset()
    }
  }

  findRoom() {
    this.roomSelectorComponent.display()
  }

  handleRoomSelectedEvent(selectedRoom: { roomId?: number; roomNumber?: string; }) {
    if (selectedRoom && 'roomId' in selectedRoom) {
      this.reservationRecordForm.patchValue(selectedRoom);
    }
  }
}
