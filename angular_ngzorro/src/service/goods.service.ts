import {Injectable} from '@angular/core';
import {Goods} from '../types/resp/Goods';
import {GoodsForm} from '../types/req/GoodsForm';
import {Result} from '../types/result';
import MockApi from '../api/mockApi';
import {map, Observable} from 'rxjs';
import type {Response} from '../types/response';
import {Page} from '../types/page';
import {GoodsQueryForm} from '../types/req/GoodsQueryForm';

@Injectable({
  providedIn: 'root'
})
export class GoodsService {
  goodss: Goods[] = [
    {"id":1,"name":"牙具","price":4.77,"createTime":"2020-01-22 23:17:01","modifyTime":"2020-01-23 23:17:01"},
    {"id":2,"name":"毛巾","price":2.73,"createTime":"2021-02-20 23:17:01","modifyTime":"2021-02-22 23:17:01"},
    {"id":3,"name":"刮胡刀","price":3.91,"createTime":"2022-03-23 23:17:01","modifyTime":"2022-03-21 23:17:01"},
    {"id":4,"name":"香烟","price":1.61,"createTime":"2023-04-23 23:17:01","modifyTime":"2023-04-23 23:17:01"},
    {"id":5,"name":"饮料","price":4.94,"createTime":"2022-05-21 23:17:01","modifyTime":"2022-05-23 23:17:01"},
    {"id":6,"name":"矿泉水","price":3.13,"createTime":"2021-06-20 23:17:01","modifyTime":"2021-06-21 23:17:01"},
    {"id":7,"name":"瓜子","price":3.99,"createTime":"2020-07-22 23:17:01","modifyTime":"2020-07-23 23:17:01"}
  ]
  constructor() {
  }

  save (goodsForm: GoodsForm): Observable<Result<void>> {
    console.log('goodsApi save params', goodsForm)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }

  find (goodsQueryForm: GoodsQueryForm): Observable<Result<Page<Goods>>> {
    console.log('goodsApi find params', goodsQueryForm)
    return MockApi.queryPageSuccessfully(this.goodss).pipe(
      map((response: Response<Result<Page<Goods>>>) => response.data)
    );
  }

  findById (id: number): Observable<Result<Goods>> {
    console.log('goodsApi findById id', id)
    let target = {}
    for (const a of this.goodss) {
      if (a.id === id) {
        target = a
      }
    }
    return MockApi.operateSuccessfullyWithData(target).pipe(
      map((response: Response<Result<Goods>>) => response.data)
    );
  }

  del (id: number): Observable<Result<void>> {
    console.log('goodsApi del id', id)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }
}
