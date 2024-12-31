import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {StaffService} from '../../service/staff.service';
import {StaffQueryForm} from '../../types/req/StaffQueryForm';
import {SharedModule} from '../shared.module';
import {Staff} from '../../types/resp/Staff';
import {Page} from '../../types/page';
import {StaffAddComponent} from './staff-add.component';
import {StaffViewComponent} from './staff-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {RoomMaintenanceRecordQueryForm} from '../../types/req/RoomMaintenanceRecordQueryForm';
import {exportToExcel} from '../../util/exportUtil';

@Component({
  selector: 'staff-list',
  imports: [
    StaffAddComponent,
    StaffViewComponent,
    SharedModule
  ],
  templateUrl: './staff-list.component.html',
  standalone: true
})
export class StaffListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Staff[] = [];
  total: number = 0

  @ViewChild(StaffAddComponent, { static: false }) staffAddComponent!: StaffAddComponent;
  @ViewChild(StaffViewComponent, { static: false }) staffViewComponent!: StaffViewComponent;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private staffService: StaffService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      name: [''],
      phone: [''],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.staffService.find(new StaffQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<Staff> | undefined = resp.data
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
    this.staffAddComponent.display(0)
  }

  onExport() {
    try {
      const headers = ['姓名', '联系电话', '岗位', '特长']
      this.searchLoading = true
      this.staffService.find(new StaffQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1 || !resp.data || resp.data.list.length < 1) {
            this.message.error('无数据导出')
            return
          }
          const exportData = []
          for (const d of resp.data.list) {
            exportData.push([d.name, d.phone, d.position, d.specialty])
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
    this.staffAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.staffService.del(id).subscribe({
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

  detailRow(record: Staff) {
    this.staffViewComponent.display(record)
  }

  onAdded(addedFlag: boolean) {
    if (addedFlag) {
      this.onSearch()
    }
  }
}
