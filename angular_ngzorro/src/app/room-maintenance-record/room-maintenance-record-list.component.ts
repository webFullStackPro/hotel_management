import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {RoomMaintenanceRecordService} from '../../service/room-maintenance-record.service';
import {RoomMaintenanceRecordQueryForm} from '../../types/req/RoomMaintenanceRecordQueryForm';
import {SharedModule} from '../shared.module';
import {RoomMaintenanceRecord} from '../../types/resp/RoomMaintenanceRecord';
import {Page} from '../../types/page';
import {RoomMaintenanceRecordAddComponent} from './room-maintenance-record-add.component';
import {RoomMaintenanceRecordViewComponent} from './room-maintenance-record-view.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {RoomSelectorComponent} from '../room/room-selector.component';
import {StaffSelectorComponent} from '../staff/staff-selector.component';
import {RoomQueryForm} from '../../types/req/RoomQueryForm';
import {getRoomStatusText, getRoomTypeText, getYesOrNoText} from '../../util/dictTranslator';
import {exportToExcel} from '../../util/exportUtil';

@Component({
  selector: 'room-maintenance-record-list',
  imports: [
    RoomSelectorComponent,
    StaffSelectorComponent,
    RoomMaintenanceRecordAddComponent,
    RoomMaintenanceRecordViewComponent,
    SharedModule
  ],
  templateUrl: './room-maintenance-record-list.component.html',
  standalone: true
})
export class RoomMaintenanceRecordListComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: RoomMaintenanceRecord[] = [];
  total: number = 0

  @ViewChild(RoomSelectorComponent, { static: false }) roomSelectorComponent!: RoomSelectorComponent;
  @ViewChild(StaffSelectorComponent, { static: false }) staffSelectorComponent!: StaffSelectorComponent;
  @ViewChild(RoomMaintenanceRecordAddComponent, { static: false }) roomMaintenanceRecordAddComponent!: RoomMaintenanceRecordAddComponent;
  @ViewChild(RoomMaintenanceRecordViewComponent, { static: false }) roomMaintenanceRecordViewComponent!: RoomMaintenanceRecordViewComponent;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private roomMaintenanceRecordService: RoomMaintenanceRecordService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      roomId: [0],
      roomNumber: [''],
      staffId: [0],
      staffName: [''],
      staffPhone: [''],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.roomMaintenanceRecordService.find(new RoomMaintenanceRecordQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<RoomMaintenanceRecord> | undefined = resp.data
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
    this.roomMaintenanceRecordAddComponent.display(0)
  }

  onExport() {
    try {
      const headers = ['房号','员工姓名','员工联系电话','开始时间','结束时间','维护内容']
      this.searchLoading = true
      this.roomMaintenanceRecordService.find(new RoomMaintenanceRecordQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1 || !resp.data || resp.data.list.length < 1) {
            this.message.error('无数据导出')
            return
          }
          const exportData = []
          for (const d of resp.data.list) {
            exportData.push([d.roomNumber, d.staffName, d.staffPhone, d.startTime, d.endTime, d.content])
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
    this.roomMaintenanceRecordAddComponent.display(id)
  }

  delRow(id: number) {
    this.modal.confirm({
      nzTitle: '<i>删除提示</i>',
      nzContent: '<b>确定要删除吗?</b>',
      nzOnOk: () => {
        this.roomMaintenanceRecordService.del(id).subscribe({
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

  detailRow(record: RoomMaintenanceRecord) {
    this.roomMaintenanceRecordViewComponent.display(record)
  }

  findRoom() {
    this.roomSelectorComponent.display()
  }

  handleRoomSelectedEvent(selectedRoom: { roomId?: number; roomNumber?: string; }) {
    if (selectedRoom && 'roomId' in selectedRoom) {
      this.searchForm.patchValue(selectedRoom);
    }
  }

  findStaff() {
    this.staffSelectorComponent.display()
  }

  handleStaffSelectedEvent(selectedStaff: { staffId?: number; staffName?: string;staffPhone?: string; }) {
    if (selectedStaff && 'staffId' in selectedStaff) {
      this.searchForm.patchValue(selectedStaff);
    }
  }

  onAdded(addedFlag: boolean) {
    if (addedFlag) {
      this.onSearch()
    }
  }
}
