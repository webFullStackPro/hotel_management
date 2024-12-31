import {Injectable} from '@angular/core';
import {Room} from '../types/resp/Room';
import {RoomForm} from '../types/req/RoomForm';
import {Result} from '../types/result';
import MockApi from '../api/mockApi';
import {map, Observable} from 'rxjs';
import type {Response} from '../types/response';
import {Page} from '../types/page';
import {RoomQueryForm} from '../types/req/RoomQueryForm';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  rooms: Room[] = [
    {"id":1,"roomNumber":"208","roomType":20,"status":50,"price":1.43,"area":"34平方米","floorNumber":"2楼","bedType":"标准双人床","maxOccupancy":1,"freeWifi":1,"existWindow":0,"freeBreakfast":1,"createTime":"2020-01-22 23:17:01","modifyTime":"2020-01-23 23:17:01"},
    {"id":2,"roomNumber":"806","roomType":90,"status":20,"price":2.84,"area":"80平方米","floorNumber":"8楼","bedType":"豪华大床","maxOccupancy":1,"freeWifi":1,"existWindow":1,"freeBreakfast":0,"createTime":"2021-02-20 23:17:01","modifyTime":"2021-02-22 23:17:01"},
    {"id":3,"roomNumber":"808","roomType":90,"status":20,"price":2.94,"area":"80平方米","floorNumber":"8楼","bedType":"豪华大床","maxOccupancy":2,"freeWifi":1,"existWindow":1,"freeBreakfast":0,"createTime":"2022-03-23 23:17:01","modifyTime":"2022-03-21 23:17:01"},
    {"id":4,"roomNumber":"106","roomType":10,"status":10,"price":4.25,"area":"15平方米","floorNumber":"1楼","bedType":"标准单人床","maxOccupancy":3,"freeWifi":1,"existWindow":1,"freeBreakfast":0,"createTime":"2023-04-23 23:17:01","modifyTime":"2023-04-23 23:17:01"},
    {"id":5,"roomNumber":"305","roomType":21,"status":40,"price":2.62,"area":"40平方米","floorNumber":"3楼","bedType":"豪华双人床","maxOccupancy":4,"freeWifi":1,"existWindow":0,"freeBreakfast":0,"createTime":"2022-05-21 23:17:01","modifyTime":"2022-05-23 23:17:01"}
  ]
  constructor() {
  }

  save (roomForm: RoomForm): Observable<Result<void>> {
    console.log('roomApi save params', roomForm)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }

  find (roomQueryForm: RoomQueryForm): Observable<Result<Page<Room>>> {
    console.log('roomApi find params', roomQueryForm)
    return MockApi.queryPageSuccessfully(this.rooms).pipe(
      map((response: Response<Result<Page<Room>>>) => response.data)
    );
  }

  findById (id: number): Observable<Result<Room>> {
    console.log('roomApi findById id', id)
    let target = {}
    for (const a of this.rooms) {
      if (a.id === id) {
        target = a
      }
    }
    return MockApi.operateSuccessfullyWithData(target).pipe(
      map((response: Response<Result<Room>>) => response.data)
    );
  }

  del (id: number): Observable<Result<void>> {
    console.log('roomApi del id', id)
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }
}
