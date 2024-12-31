import {Injectable} from '@angular/core';
import {CheckInRecord} from '../types/resp/CheckInRecord';
import {CheckInRecordForm} from '../types/req/CheckInRecordForm';
import {Result} from '../types/result';
import MockApi from '../api/mockApi';
import {map, Observable} from 'rxjs';
import type {Response} from '../types/response';
import {Page} from '../types/page';
import {CheckInRecordQueryForm} from '../types/req/CheckInRecordQueryForm';

@Injectable({
  providedIn: 'root'
})
export class CheckInRecordService {
  checkInRecords: CheckInRecord[] = [
    {"id":1,"reservationRecordId":2,"preName":"张一","prePhone":"13899990001","roomId":4,"roomNumber":"102","name":"张一","phone":"13899990001","checkInTime":"2024-11-23 14:27:42","checkOutTime":"2024-11-21 14:27:42","roomAmount":399,"goodsAmount":31,"amount":430,"remark":"次日5点叫醒服务","status":30,"createTime":"2020-01-22 23:17:01","modifyTime":"2020-01-23 23:17:01"},
    {"id":2,"reservationRecordId":3,"preName":"李二","prePhone":"13899990002","roomId":2,"roomNumber":"203","name":"李二","phone":"13899990002","checkInTime":"2024-11-21 14:27:42","checkOutTime":"2024-11-23 14:27:42","roomAmount":299,"goodsAmount":22,"amount":321,"remark":"有窗","status":20,"createTime":"2021-02-20 23:17:01","modifyTime":"2021-02-22 23:17:01"},
    {"id":3,"reservationRecordId":1,"preName":"王三","prePhone":"13899990003","roomId":1,"roomNumber":"304","name":"王三","phone":"13899990003","checkInTime":"2024-11-23 14:27:42","checkOutTime":"2024-11-21 14:27:42","roomAmount":499,"goodsAmount":14,"amount":513,"remark":"免费停车","status":30,"createTime":"2022-03-23 23:17:01","modifyTime":"2022-03-21 23:17:01"},
    {"id":4,"reservationRecordId":1,"preName":"赵四","prePhone":"13899990004","roomId":1,"roomNumber":"405","name":"赵四","phone":"13899990004","checkInTime":"2024-11-23 14:27:42","checkOutTime":"2024-11-23 14:27:42","roomAmount":299,"goodsAmount":25,"amount":324,"remark":"优惠券付费","status":40,"createTime":"2023-04-23 23:17:01","modifyTime":"2023-04-23 23:17:01"},
    {"id":5,"reservationRecordId":1,"preName":"刘五","prePhone":"13899990005","roomId":3,"roomNumber":"506","name":"刘五","phone":"13899990005","checkInTime":"2024-11-24 14:27:42","checkOutTime":"2024-11-21 14:27:42","roomAmount":199,"goodsAmount":36,"amount":235,"remark":"次日6点叫车服务","status":40,"createTime":"2022-05-21 23:17:01","modifyTime":"2022-05-23 23:17:01"},
    {"id":6,"reservationRecordId":4,"preName":"陈六","prePhone":"13899990006","roomId":1,"roomNumber":"607","name":"陈六","phone":"13899990006","checkInTime":"2024-11-21 14:27:42","checkOutTime":"2024-11-22 14:27:42","roomAmount":499,"goodsAmount":27,"amount":526,"remark":"加床","status":40,"createTime":"2021-06-20 23:17:01","modifyTime":"2021-06-21 23:17:01"}
  ]
  constructor() {
  }

  save (checkInRecordForm: CheckInRecordForm): Observable<Result<void>> {
    console.log('checkInRecordApi save params', checkInRecordForm)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }

  find (checkInRecordQueryForm: CheckInRecordQueryForm): Observable<Result<Page<CheckInRecord>>> {
    console.log('checkInRecordApi find params', checkInRecordQueryForm)
    return MockApi.queryPageSuccessfully(this.checkInRecords).pipe(
      map((response: Response<Result<Page<CheckInRecord>>>) => response.data)
    );
  }

  findById (id: number): Observable<Result<CheckInRecord>> {
    console.log('checkInRecordApi findById id', id)
    let target = {}
    for (const a of this.checkInRecords) {
      if (a.id === id) {
        target = a
      }
    }
    return MockApi.operateSuccessfullyWithData(target).pipe(
      map((response: Response<Result<CheckInRecord>>) => response.data)
    );
  }

  del (id: number): Observable<Result<void>> {
    console.log('checkInRecordApi del id', id)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }
}
