import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {GoodsService} from '../../service/goods.service';
import {SharedModule} from '../shared.module';
import {GoodsForm} from '../../types/req/GoodsForm';
import {MODAL_WIDTH} from '../../const'

@Component({
  selector: 'goods-add',
  imports: [
    SharedModule
  ],
  templateUrl: './goods-add.component.html',
  standalone: true
})
export class GoodsAddComponent implements OnInit {
  goodsToSave:GoodsForm = {};
  goodsForm!: FormGroup;
  isVisible: boolean = false
  saveLoading: boolean = false
  title: string = '新增商品'
  modalWidth: string = MODAL_WIDTH

  @Output() addedEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private goodsService: GoodsService
  ) {}

  ngOnInit(): void {
    this.goodsForm = this.fb.group({
      name: ['', [Validators.required]],
      price: [0, [Validators.required]],
    })
  }

  onSave() {
    try {
      this.saveLoading = true
      for (const i in this.goodsForm.controls) {
        this.goodsForm.controls[i].markAsDirty();
        this.goodsForm.controls[i].updateValueAndValidity();
      }
      if (!this.goodsForm.valid) {
        this.saveLoading = false
        return
      }
      this.goodsService.save(Object.assign(this.goodsToSave, this.goodsForm.value)).subscribe({
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
    this.title = '新增商品'.slice()
    this.goodsForm.reset()
  }

  onBack(addedFlag=false) {
    this.isVisible = false
    this.addedEvent.emit(addedFlag);
  }

  display(id: number) {
    this.isVisible = true
    if (id) {
      this.title = '修改商品'
      this.saveLoading = true
      this.goodsService.findById(id).subscribe({
        next: (resp) => {
          if (resp && resp.code === 1 && resp.data) {
            this.goodsToSave = resp.data
            this.goodsForm.patchValue(this.goodsToSave);
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
