import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../shared.module';
import {MODAL_WIDTH} from '../../const'
import {Goods} from '../../types/resp/Goods';

@Component({
  selector: 'goods-view',
  imports: [
    SharedModule
  ],
  templateUrl: './goods-view.component.html',
  standalone: true
})
export class GoodsViewComponent implements OnInit {
  goodsForm!: FormGroup;
  isVisible: boolean = false
  title: string = '商品详情'
  modalWidth: string = MODAL_WIDTH

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.goodsForm = this.fb.group({
      name: [''],
      price: [0],
      createTime: [''],
      modifyTime: [''],
    })
  }

  onBack() {
    this.isVisible = false
  }

  display(goods: Goods) {
    this.isVisible = true
    this.goodsForm.patchValue(goods);
    this.goodsForm.disable();
  }
}
