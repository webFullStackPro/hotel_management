import {Injectable} from '@angular/core';
import {CheckInRecordDetail} from '../types/resp/CheckInRecordDetail';
import {CheckInRecordDetailForm} from '../types/req/CheckInRecordDetailForm';
import {Result} from '../types/result';
import MockApi from '../api/mockApi';
import {map, Observable} from 'rxjs';
import type {Response} from '../types/response';
import {Page} from '../types/page';
import {CheckInRecordDetailQueryForm} from '../types/req/CheckInRecordDetailQueryForm';

@Injectable({
  providedIn: 'root'
})
export class CheckInRecordDetailService {
  checkInRecordDetails: CheckInRecordDetail[] = [
    {"id":1,"checkInRecordId":1,"name":"张一","phone":"13899990001","goodsId":2,"goodsName":"牙具","goodsPrice":4.8,"qty":3,"price":4.8,"amount":14.4,"createTime":"2024-11-22 14:54:57"},
    {"id":2,"checkInRecordId":3,"name":"李二","phone":"13899990002","goodsId":2,"goodsName":"毛巾","goodsPrice":4.63,"qty":5,"price":4.6,"amount":23,"createTime":"2024-11-22 14:54:57"},
    {"id":3,"checkInRecordId":3,"name":"王三","phone":"13899990003","goodsId":2,"goodsName":"刮胡刀","goodsPrice":3.20,"qty":3,"price":3.2,"amount":9.6,"createTime":"2024-11-23 14:54:57"},
    {"id":4,"checkInRecordId":3,"name":"赵四","phone":"13899990004","goodsId":1,"goodsName":"香烟","goodsPrice":4.9,"qty":1,"price":4.9,"amount":4.9,"createTime":"2024-11-21 14:54:57"},
    {"id":5,"checkInRecordId":2,"name":"刘五","phone":"13899990005","goodsId":4,"goodsName":"饮料","goodsPrice":4.42,"qty":2,"price":4.42,"amount":8.84,"createTime":"2024-11-22 14:54:57"}
  ]
  constructor() {
  }

  save (checkInRecordDetailForm: CheckInRecordDetailForm): Observable<Result<void>> {
    console.log('checkInRecordDetailApi save params', checkInRecordDetailForm)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }

  find (checkInRecordDetailQueryForm: CheckInRecordDetailQueryForm): Observable<Result<Page<CheckInRecordDetail>>> {
    console.log('checkInRecordDetailApi find params', checkInRecordDetailQueryForm)
    return MockApi.queryPageSuccessfully(this.checkInRecordDetails).pipe(
      map((response: Response<Result<Page<CheckInRecordDetail>>>) => response.data)
    );
  }

  findById (id: number): Observable<Result<CheckInRecordDetail>> {
    console.log('checkInRecordDetailApi findById id', id)
    let target = {}
    for (const a of this.checkInRecordDetails) {
      if (a.id === id) {
        target = a
      }
    }
    return MockApi.operateSuccessfullyWithData(target).pipe(
      map((response: Response<Result<CheckInRecordDetail>>) => response.data)
    );
  }

  del (id: number): Observable<Result<void>> {
    console.log('checkInRecordDetailApi del id', id)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }
}
