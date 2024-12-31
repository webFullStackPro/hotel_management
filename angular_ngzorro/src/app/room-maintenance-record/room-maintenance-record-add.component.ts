import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {RoomMaintenanceRecordService} from '../../service/room-maintenance-record.service';
import {SharedModule} from '../shared.module';
import {RoomMaintenanceRecordForm} from '../../types/req/RoomMaintenanceRecordForm';
import {MODAL_WIDTH} from '../../const'
import {RoomSelectorComponent} from '../room/room-selector.component';
import {StaffSelectorComponent} from '../staff/staff-selector.component';

@Component({
  selector: 'room-maintenance-record-add',
  imports: [
    RoomSelectorComponent,
    StaffSelectorComponent,
    SharedModule
  ],
  templateUrl: './room-maintenance-record-add.component.html',
  standalone: true
})
export class RoomMaintenanceRecordAddComponent implements OnInit {
  roomMaintenanceRecordToSave:RoomMaintenanceRecordForm = {};
  roomMaintenanceRecordForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增房间维护记录'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(RoomSelectorComponent, { static: false }) roomSelectorComponent!: RoomSelectorComponent;
  @ViewChild(StaffSelectorComponent, { static: false }) staffSelectorComponent!: StaffSelectorComponent;

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private roomMaintenanceRecordService: RoomMaintenanceRecordService
  ) {}

  ngOnInit(): void {
    this.roomMaintenanceRecordForm = this.fb.group({
      roomId: [0],
      roomNumber: ['', [Validators.required]],
      staffId: [0],
      staffName: ['', [Validators.required]],
      staffPhone: ['', [Validators.required]],
      startTime: [''],
      endTime: [''],
      content: [''],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.roomMaintenanceRecordForm.controls) {
        this.roomMaintenanceRecordForm.controls[i].markAsDirty();
        this.roomMaintenanceRecordForm.controls[i].updateValueAndValidity();
      }
      if (!this.roomMaintenanceRecordForm.valid) {
        this.saveLoading = false
        return
      }
      this.roomMaintenanceRecordService.save(Object.assign(this.roomMaintenanceRecordToSave, this.roomMaintenanceRecordForm.value)).subscribe({
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
    this.title = '新增房间维护记录'.slice()
    this.roomMaintenanceRecordForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改房间维护记录'
      this.saveLoading = true
      this.roomMaintenanceRecordService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.roomMaintenanceRecordToSave = resp.data
            this.roomMaintenanceRecordForm.patchValue(this.roomMaintenanceRecordToSave);
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
      this.roomMaintenanceRecordForm.patchValue(selectedRoom);
    }
  }

  findStaff() {
    this.staffSelectorComponent.display()
  }

  handleStaffSelectedEvent(selectedStaff: { staffId?: number; staffName?: string;staffPhone?: string; }) {
    if (selectedStaff && 'staffId' in selectedStaff) {
      this.roomMaintenanceRecordForm.patchValue(selectedStaff);
    }
  }
}
