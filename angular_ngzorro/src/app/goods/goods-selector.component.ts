import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {GoodsService} from '../../service/goods.service';
import {GoodsQueryForm} from '../../types/req/GoodsQueryForm';
import {SharedModule} from '../shared.module';
import {Goods} from '../../types/resp/Goods';
import {Page} from '../../types/page';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MODAL_WIDTH} from '../../const';

@Component({
  selector: 'goods-selector',
  imports: [
    SharedModule
  ],
  templateUrl: './goods-selector.component.html',
  standalone: true
})
export class GoodsSelectorComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Goods[] = [];
  total: number = 0
  isVisible: boolean = false
  title: string = '商品选择器(双击行选中)'
  modalWidth: string = MODAL_WIDTH


  @Output() goodsSelectedEvent = new EventEmitter<{}>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private goodsService: GoodsService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      name: [''],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.goodsService.find(new GoodsQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<Goods> | undefined = resp.data
          if (page && page.list.length > 0) {
            this.listOfData = page.list
            this.total = page.total
          }
        },
        complete: () => {
          this.searchLoading = false
        }
      })
    } catch (e) {
      console.log('获取数据异常', e)
    }
  }

  onRowDblClick(row: Goods, event: MouseEvent) {
    this.isVisible = false
    this.goodsSelectedEvent.emit({
      goodsId: row.id,
      goodsName: row.name,
      goodsPrice: row.price,
    });
  }

  onBack() {
    this.isVisible = false
  }

  display() {
    this.isVisible = true
    this.searchForm.reset();
  }

}
