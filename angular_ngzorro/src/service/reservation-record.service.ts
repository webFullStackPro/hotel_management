import {Injectable} from '@angular/core';
import {ReservationRecord} from '../types/resp/ReservationRecord';
import {ReservationRecordForm} from '../types/req/ReservationRecordForm';
import {Result} from '../types/result';
import MockApi from '../api/mockApi';
import {map, Observable} from 'rxjs';
import type {Response} from '../types/response';
import {Page} from '../types/page';
import {ReservationRecordQueryForm} from '../types/req/ReservationRecordQueryForm';

@Injectable({
  providedIn: 'root'
})
export class ReservationRecordService {
  reservationRecords: ReservationRecord[] = [
    {"id":1,"roomId":1,"roomNumber":"102","name":"张一","phone":"13899990001","checkInTime":"2020-01-23 23:15:45","remark":"次日5点叫醒服务","status":20,"createTime":"2020-01-22 23:17:01","modifyTime":"2020-01-23 23:17:01"},
    {"id":2,"roomId":4,"roomNumber":"203","name":"李二","phone":"13899990002","checkInTime":"2021-02-21 23:15:45","remark":"有窗","status":10,"createTime":"2021-02-20 23:17:01","modifyTime":"2021-02-22 23:17:01"},
    {"id":3,"roomId":2,"roomNumber":"304","name":"王三","phone":"13899990003","checkInTime":"2022-03-24 23:15:45","remark":"免费停车","status":30,"createTime":"2022-03-23 23:17:01","modifyTime":"2022-03-21 23:17:01"},
    {"id":4,"roomId":2,"roomNumber":"405","name":"赵四","phone":"13899990004","checkInTime":"2023-04-24 23:15:45","remark":"优惠券付费","status":30,"createTime":"2023-04-23 23:17:01","modifyTime":"2023-04-23 23:17:01"},
    {"id":5,"roomId":1,"roomNumber":"506","name":"刘五","phone":"13899990005","checkInTime":"2022-05-22 23:15:45","remark":"次日6点叫车服务","status":10,"createTime":"2022-05-21 23:17:01","modifyTime":"2022-05-23 23:17:01"},
    {"id":6,"roomId":1,"roomNumber":"607","name":"陈六","phone":"13899990006","checkInTime":"2021-06-21 23:15:45","remark":"午餐免费送","status":30,"createTime":"2021-06-20 23:17:01","modifyTime":"2021-06-21 23:17:01"},
    {"id":7,"roomId":2,"roomNumber":"708","name":"黄七","phone":"13899990007","checkInTime":"2020-07-23 23:15:45","remark":"加床","status":30,"createTime":"2020-07-22 23:17:01","modifyTime":"2020-07-23 23:17:01"}
  ]
  constructor() {
  }

  save (reservationRecordForm: ReservationRecordForm): Observable<Result<void>> {
    console.log('reservationRecordApi save params', reservationRecordForm)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }

  find (reservationRecordQueryForm: ReservationRecordQueryForm): Observable<Result<Page<ReservationRecord>>> {
    console.log('reservationRecordApi find params', reservationRecordQueryForm)
    return MockApi.queryPageSuccessfully(this.reservationRecords).pipe(
      map((response: Response<Result<Page<ReservationRecord>>>) => response.data)
    );
  }

  findById (id: number): Observable<Result<ReservationRecord>> {
    console.log('reservationRecordApi findById id', id)
    let target = {}
    for (const a of this.reservationRecords) {
      if (a.id === id) {
        target = a
      }
    }
    return MockApi.operateSuccessfullyWithData(target).pipe(
      map((response: Response<Result<ReservationRecord>>) => response.data)
    );
  }

  del (id: number): Observable<Result<void>> {
    console.log('reservationRecordApi del id', id)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }
}
