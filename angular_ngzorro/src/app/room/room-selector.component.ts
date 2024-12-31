import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {RoomService} from '../../service/room.service';
import {RoomQueryForm} from '../../types/req/RoomQueryForm';
import {SharedModule} from '../shared.module';
import {Room} from '../../types/resp/Room';
import {Page} from '../../types/page';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MODAL_WIDTH} from '../../const';

@Component({
  selector: 'room-selector',
  imports: [
    SharedModule
  ],
  templateUrl: './room-selector.component.html',
  standalone: true
})
export class RoomSelectorComponent implements OnInit {
  searchForm!: FormGroup;
  searchLoading: boolean = false
  listOfData: Room[] = [];
  total: number = 0
  isVisible: boolean = false
  title: string = '房间选择器(双击行选中)'
  modalWidth: string = MODAL_WIDTH


  @Output() roomSelectedEvent = new EventEmitter<{}>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private roomService: RoomService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      roomNumber: [''],
      roomType: [undefined],
      status: [undefined],
    })
    this.onSearch()
  }

  onReset() {
    this.searchForm.reset()
  }

  onSearch() {
    try {
      this.searchLoading = true
      this.roomService.find(new RoomQueryForm(this.searchForm.value)).subscribe({
        next: (resp) => {
          if (!resp || resp.code !== 1) {
            this.message.error(resp && resp.msg ? resp.msg : '操作异常')
            return
          }
          const page: Page<Room> | undefined = resp.data
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

  onRowDblClick(row: Room, event: MouseEvent) {
    this.isVisible = false
    this.roomSelectedEvent.emit({
      roomId: row.id,
      roomNumber: row.roomNumber,
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
