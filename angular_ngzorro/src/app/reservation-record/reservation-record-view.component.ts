import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {ReservationRecord} from '../../types/resp/ReservationRecord';

@Component({
  selector: 'reservation-record-view',
  imports: [
    SharedModule
  ],
  templateUrl: './reservation-record-view.component.html',
  standalone: true
})
export class ReservationRecordViewComponent implements OnInit {
  reservationRecordForm!: FormGroup;
  isVisible: boolean = false
  title: string = '预定记录详情'
  modalWidth: string = MODAL_WIDTH

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.reservationRecordForm = this.fb.group({
      roomNumber: [''],
      name: [''],
      phone: [''],
      checkInTime: [''],
      remark: [''],
      status: [undefined],
      createTime: [''],
      modifyTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(reservationRecord: ReservationRecord) {
    this.isVisible = true
    this.reservationRecordForm.patchValue(reservationRecord);
    this.reservationRecordForm.disable();
  }
}
