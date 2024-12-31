import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {RoomService} from '../../service/room.service';
import {SharedModule} from '../shared.module';
import {RoomForm} from '../../types/req/RoomForm';
import {MODAL_WIDTH} from '../../const'

@Component({
  selector: 'room-add',
  imports: [
    SharedModule
  ],
  templateUrl: './room-add.component.html',
  standalone: true
})
export class RoomAddComponent implements OnInit {
  roomToSave:RoomForm = {};
  roomForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增房间'
  modalWidth: string = MODAL_WIDTH

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.roomForm = this.fb.group({
      roomNumber: ['', [Validators.required]],
      roomType: [undefined, [Validators.required]],
      price: [0],
      area: [''],
      floorNumber: [''],
      bedType: [''],
      maxOccupancy: [0],
      freeWifi: [undefined],
      existWindow: [undefined],
      freeBreakfast: [undefined],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.roomForm.controls) {
        this.roomForm.controls[i].markAsDirty();
        this.roomForm.controls[i].updateValueAndValidity();
      }
      if (!this.roomForm.valid) {
        this.saveLoading = false
        return
      }
      this.roomService.save(Object.assign(this.roomToSave, this.roomForm.value)).subscribe({
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
    this.title = '新增房间'.slice()
    this.roomForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改房间'
      this.saveLoading = true
      this.roomService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.roomToSave = resp.data
            this.roomForm.patchValue(this.roomToSave);
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
}
