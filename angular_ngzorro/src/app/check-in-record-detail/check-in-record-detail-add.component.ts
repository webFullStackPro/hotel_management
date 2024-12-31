import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {CheckInRecordDetailService} from '../../service/check-in-record-detail.service';
import {SharedModule} from '../shared.module';
import {CheckInRecordDetailForm} from '../../types/req/CheckInRecordDetailForm';
import {MODAL_WIDTH} from '../../const'
import {CheckInRecordSelectorComponent} from '../check-in-record/check-in-record-selector.component';
import {GoodsSelectorComponent} from '../goods/goods-selector.component';

@Component({
  selector: 'check-in-record-detail-add',
  imports: [
    CheckInRecordSelectorComponent,
    GoodsSelectorComponent,
    SharedModule
  ],
  templateUrl: './check-in-record-detail-add.component.html',
  standalone: true
})
export class CheckInRecordDetailAddComponent implements OnInit {
  checkInRecordDetailToSave:CheckInRecordDetailForm = {};
  checkInRecordDetailForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增入住消费商品'
  modalWidth: string = MODAL_WIDTH

  @ViewChild(CheckInRecordSelectorComponent, { static: false }) checkInRecordSelectorComponent!: CheckInRecordSelectorComponent;
  @ViewChild(GoodsSelectorComponent, { static: false }) goodsSelectorComponent!: GoodsSelectorComponent;

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private checkInRecordDetailService: CheckInRecordDetailService
  ) {}

  ngOnInit(): void {
    this.checkInRecordDetailForm = this.fb.group({
      checkInRecordId: [0],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      goodsId: [0],
      goodsName: ['', [Validators.required]],
      goodsPrice: [0, [Validators.required]],
      qty: [0, [Validators.required]],
      price: [0, [Validators.required]],
      amount: [0],
    })

    const priceControl = this.checkInRecordDetailForm.get('price') as FormControl;
    const qtyControl = this.checkInRecordDetailForm.get('qty') as FormControl;

    priceControl.valueChanges.subscribe(() => {
      this.calculateTotal();
    });

    qtyControl.valueChanges.subscribe(() => {
      this.calculateTotal();
    });

    // 初始计算一次
    this.calculateTotal();
  }

  calculateTotal() {
    const qty = this.checkInRecordDetailForm.get('qty')?.value || 0;
    const price = this.checkInRecordDetailForm.get('price')?.value || 0;

    let amount = 0
    if (!isNaN(qty) && !isNaN(price)) {
      amount = qty * price;
    }
    this.checkInRecordDetailForm.patchValue({amount: amount});
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.checkInRecordDetailForm.controls) {
        this.checkInRecordDetailForm.controls[i].markAsDirty();
        this.checkInRecordDetailForm.controls[i].updateValueAndValidity();
      }
      if (!this.checkInRecordDetailForm.valid) {
        this.saveLoading = false
        return
      }
      this.checkInRecordDetailService.save(Object.assign(this.checkInRecordDetailToSave, this.checkInRecordDetailForm.value)).subscribe({
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
    this.title = '新增入住消费商品'.slice()
    this.checkInRecordDetailForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改入住消费商品'
      this.saveLoading = true
      this.checkInRecordDetailService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.checkInRecordDetailToSave = resp.data
            this.checkInRecordDetailForm.patchValue(this.checkInRecordDetailToSave);
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

  findCheckInRecord() {
    this.checkInRecordSelectorComponent.display()
  }

  handleCheckInRecordSelectedEvent(selectedCheckInRecord: { checkInRecordId?: number; name?: string;phone?: string; }) {
    if (selectedCheckInRecord && 'checkInRecordId' in selectedCheckInRecord) {
      this.checkInRecordDetailForm.patchValue(selectedCheckInRecord);
    }
  }

  findGoods() {
    this.goodsSelectorComponent.display()
  }

  handleGoodsSelectedEvent(selectedGoods: { goodsId?: number; goodsName?: string;goodsPrice?: number; }) {
    if (selectedGoods && 'goodsId' in selectedGoods) {
      this.checkInRecordDetailForm.patchValue(selectedGoods);
    }
  }
}
