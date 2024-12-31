import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {GoodsService} from '../../service/goods.service';
import {GoodsQueryForm} from '../../types/req/GoodsQueryForm';
import {SharedModule} from '../shared.module';
import {Goods} from '../../types/resp/Goods';
import {Page} from '../../types/page';
import {GoodsAddComponent} from './goods-add.component';
import {GoodsViewComponent} from './goods-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {CheckInRecordQueryForm} from '../../types/req/CheckInRecordQueryForm';
import {getCheckInRecordStatusText} from '../../util/dictTranslator';
import {exportToExcel} from '../../util/exportUtil';

@Component({
  selector: 'goods-list',
  imports: [
    GoodsAddComponent,
    GoodsViewComponent,
    SharedModule
  ],
  templateUrl: './goods-list.component.html',
  standalone: true
})
export class GoodsListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Goods[] = [];
  total: number = 0

  @ViewChild(GoodsAddComponent, { static: false }) goodsAddComponent!: GoodsAddComponent;
  @ViewChild(GoodsViewComponent, { static: false }) goodsViewComponent!: GoodsViewComponent;

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

  onAdd() {
    this.goodsAddComponent.display(0)
  }

  onExport() {
    try {
      const headers = ['商品名称', '价格']
      this.searchLoading = true
      this.goodsService.find(new GoodsQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1 || !resp.data || resp.data.list.length < 1) {
            this.message.error('无数据导出')
            return
          }
          const exportData = []
          for (const d of resp.data.list) {
            exportData.push([d.name, d.price])
          }
          exportToExcel(headers, exportData)
        },
        complete: () => {
          this.searchLoading = false
        }
      })
    } catch (e) {
      console.log('获取数据异常', e)
    }
  }

  editRow(id: number) {
    this.goodsAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.goodsService.del(id).subscribe({
          next: (resp) => {
            if (resp && resp.code === 1) {
              this.message.success('删除成功!')
              this.onSearch()
            } else {
              this.message.error('操作失败:' + (resp.msg ? resp.msg : '原因未知'))
            }
          },
          complete: () => {
            this.searchLoading = false
          }
        })
      }
    });
  }

  detailRow(record: Goods) {
    this.goodsViewComponent.display(record)
  }

  onAdded(addedFlag: boolean) {
    if (addedFlag) {
      this.onSearch()
    }
  }
}
