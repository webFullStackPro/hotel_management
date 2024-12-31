import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {CheckInRecordDetail} from '../../types/resp/CheckInRecordDetail';

@Component({
  selector: 'check-in-record-detail-view',
  imports: [
    SharedModule
  ],
  templateUrl: './check-in-record-detail-view.component.html',
  standalone: true
})
export class CheckInRecordDetailViewComponent implements OnInit {
  checkInRecordDetailForm!: FormGroup;
  isVisible: boolean = false
  title: string = '入住消费商品详情'
  modalWidth: string = MODAL_WIDTH

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.checkInRecordDetailForm = this.fb.group({
      name: [''],
      phone: [''],
      goodsName: [''],
      goodsPrice: [0],
      qty: [0],
      price: [0],
      amount: [0],
      createTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(checkInRecordDetail: CheckInRecordDetail) {
    this.isVisible = true
    this.checkInRecordDetailForm.patchValue(checkInRecordDetail);
    this.checkInRecordDetailForm.disable();
  }
}
