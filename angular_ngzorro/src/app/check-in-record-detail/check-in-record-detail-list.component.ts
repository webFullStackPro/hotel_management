import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {CheckInRecordDetailService} from '../../service/check-in-record-detail.service';
import {CheckInRecordDetailQueryForm} from '../../types/req/CheckInRecordDetailQueryForm';
import {SharedModule} from '../shared.module';
import {CheckInRecordDetail} from '../../types/resp/CheckInRecordDetail';
import {Page} from '../../types/page';
import {CheckInRecordDetailAddComponent} from './check-in-record-detail-add.component';
import {CheckInRecordDetailViewComponent} from './check-in-record-detail-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {CheckInRecordSelectorComponent} from '../check-in-record/check-in-record-selector.component';
import {GoodsSelectorComponent} from '../goods/goods-selector.component';

@Component({
  selector: 'check-in-record-detail-list',
  imports: [
    CheckInRecordSelectorComponent,
    GoodsSelectorComponent,
    CheckInRecordDetailAddComponent,
    CheckInRecordDetailViewComponent,
    SharedModule
  ],
  templateUrl: './check-in-record-detail-list.component.html',
  standalone: true
})
export class CheckInRecordDetailListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: CheckInRecordDetail[] = [];
  total: number = 0

  @ViewChild(CheckInRecordSelectorComponent, { static: false }) checkInRecordSelectorComponent!: CheckInRecordSelectorComponent;
  @ViewChild(GoodsSelectorComponent, { static: false }) goodsSelectorComponent!: GoodsSelectorComponent;
  @ViewChild(CheckInRecordDetailAddComponent, { static: false }) checkInRecordDetailAddComponent!: CheckInRecordDetailAddComponent;
  @ViewChild(CheckInRecordDetailViewComponent, { static: false }) checkInRecordDetailViewComponent!: CheckInRecordDetailViewComponent;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private checkInRecordDetailService: CheckInRecordDetailService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      checkInRecordId: [0],
      name: [''],
      phone: [''],
      goodsId: [0],
      goodsName: [''],
      goodsPrice: [''],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.checkInRecordDetailService.find(new CheckInRecordDetailQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<CheckInRecordDetail> | undefined = resp.data
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
    this.checkInRecordDetailAddComponent.display(0)
  }

  editRow(id: number) {
    this.checkInRecordDetailAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.checkInRecordDetailService.del(id).subscribe({
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

  detailRow(record: CheckInRecordDetail) {
    this.checkInRecordDetailViewComponent.display(record)
  }

  findCheckInRecord() {
    this.checkInRecordSelectorComponent.display()
  }

  handleCheckInRecordSelectedEvent(selectedCheckInRecord: { checkInRecordId?: number; name?: string;phone?: string; }) {
    if (selectedCheckInRecord && 'checkInRecordId' in selectedCheckInRecord) {
      this.searchForm.patchValue(selectedCheckInRecord);
    }
  }

  findGoods() {
    this.goodsSelectorComponent.display()
  }

  handleGoodsSelectedEvent(selectedGoods: { goodsId?: number; goodsName?: string;goodsPrice?: number; }) {
    if (selectedGoods && 'goodsId' in selectedGoods) {
      this.searchForm.patchValue(selectedGoods);
    }
  }

  onAdded(addedFlag: boolean) {
    if (addedFlag) {
      this.onSearch()
    }
  }
}
