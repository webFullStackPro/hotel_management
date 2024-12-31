import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {Room} from '../../types/resp/Room';

@Component({
  selector: 'room-view',
  imports: [
    SharedModule
  ],
  templateUrl: './room-view.component.html',
  standalone: true
})
export class RoomViewComponent implements OnInit {
  roomForm!: FormGroup;
  isVisible: boolean = false
  title: string = '房间详情'
  modalWidth: string = MODAL_WIDTH

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.roomForm = this.fb.group({
      roomNumber: [''],
      roomType: [undefined],
      status: [undefined],
      price: [0],
      area: [''],
      floorNumber: [''],
      bedType: [''],
      maxOccupancy: [0],
      freeWifi: [undefined],
      existWindow: [undefined],
      freeBreakfast: [undefined],
      createTime: [''],
      modifyTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(room: Room) {
    this.isVisible = true
    this.roomForm.patchValue(room);
    this.roomForm.disable();
  }
}
