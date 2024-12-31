import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {CheckInRecordService} from '../../service/check-in-record.service';
import {SharedModule} from '../shared.module';
import {CheckInRecordForm} from '../../types/req/CheckInRecordForm';
import {MODAL_WIDTH} from '../../const'
import {ReservationRecordSelectorComponent} from '../reservation-record/reservation-record-selector.component';
import {RoomSelectorComponent} from '../room/room-selector.component';

@Component({
  selector: 'check-in-record-add',
  imports: [
    ReservationRecordSelectorComponent,
    RoomSelectorComponent,
    SharedModule
  ],
  templateUrl: './check-in-record-add.component.html',
  standalone: true
})
export class CheckInRecordAddComponent implements OnInit {
  checkInRecordToSave:CheckInRecordForm = {};
  checkInRecordForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增入住记录'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(ReservationRecordSelectorComponent, { static: false }) reservationRecordSelectorComponent!: ReservationRecordSelectorComponent;
  @ViewChild(RoomSelectorComponent, { static: false }) roomSelectorComponent!: RoomSelectorComponent;

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private checkInRecordService: CheckInRecordService
  ) {}

  ngOnInit(): void {
    this.checkInRecordForm = this.fb.group({
      reservationRecordId: [0],
      preName: [''],
      prePhone: [''],
      roomId: [0],
      roomNumber: ['', [Validators.required]],
      name: ['', [Validators.required]],
      phone: [''],
      checkInTime: ['', [Validators.required]],
      checkOutTime: [''],
      roomAmount: [0],
      goodsAmount: [0],
      amount: [0],
      remark: [''],
      status: [undefined],
    })

    const roomAmountControl = this.checkInRecordForm.get('roomAmount') as FormControl;
    const goodsAmountControl = this.checkInRecordForm.get('goodsAmount') as FormControl;

    roomAmountControl.valueChanges.subscribe(() => {
      this.calculateTotal();
    });

    goodsAmountControl.valueChanges.subscribe(() => {
      this.calculateTotal();
    });

    // 初始计算一次
    this.calculateTotal();
  }

  calculateTotal() {
    const roomAmount = this.checkInRecordForm.get('roomAmount')?.value || 0;
    const goodsAmount = this.checkInRecordForm.get('goodsAmount')?.value || 0;

    let amount = 0
    if (!isNaN(roomAmount) && !isNaN(goodsAmount)) {
      amount = roomAmount + goodsAmount;
    }
    this.checkInRecordForm.patchValue({amount: amount});
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.checkInRecordForm.controls) {
        this.checkInRecordForm.controls[i].markAsDirty();
        this.checkInRecordForm.controls[i].updateValueAndValidity();
      }
      if (!this.checkInRecordForm.valid) {
        this.saveLoading = false
        return
      }
      this.checkInRecordService.save(Object.assign(this.checkInRecordToSave, this.checkInRecordForm.value)).subscribe({
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
    this.title = '新增入住记录'.slice()
    this.checkInRecordForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改入住记录'
      this.saveLoading = true
      this.checkInRecordService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.checkInRecordToSave = resp.data
            this.checkInRecordForm.patchValue(this.checkInRecordToSave);
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

  findReservationRecord() {
    this.reservationRecordSelectorComponent.display()
  }

  handleReservationRecordSelectedEvent(selectedReservationRecord: { reservationRecordId?: number; preName?: string;prePhone?: string; }) {
    if (selectedReservationRecord && 'reservationRecordId' in selectedReservationRecord) {
      this.checkInRecordForm.patchValue(selectedReservationRecord);
    }
  }

  findRoom() {
    this.roomSelectorComponent.display()
  }

  handleRoomSelectedEvent(selectedRoom: { roomId?: number; roomNumber?: string; }) {
    if (selectedRoom && 'roomId' in selectedRoom) {
      this.checkInRecordForm.patchValue(selectedRoom);
    }
  }
}
