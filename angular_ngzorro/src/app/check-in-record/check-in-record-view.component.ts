import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {CheckInRecord} from '../../types/resp/CheckInRecord';

@Component({
  selector: 'check-in-record-view',
  imports: [
    SharedModule
  ],
  templateUrl: './check-in-record-view.component.html',
  standalone: true
})
export class CheckInRecordViewComponent implements OnInit {
  checkInRecordForm!: FormGroup;
  isVisible: boolean = false
  title: string = '入住记录详情'
  modalWidth: string = MODAL_WIDTH

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.checkInRecordForm = this.fb.group({
      preName: [''],
      prePhone: [''],
      roomNumber: [''],
      name: [''],
      phone: [''],
      checkInTime: [''],
      checkOutTime: [''],
      roomAmount: [0],
      goodsAmount: [0],
      amount: [0],
      remark: [''],
      status: [undefined],
      createTime: [''],
      modifyTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(checkInRecord: CheckInRecord) {
    this.isVisible = true
    this.checkInRecordForm.patchValue(checkInRecord);
    this.checkInRecordForm.disable();
  }
}
