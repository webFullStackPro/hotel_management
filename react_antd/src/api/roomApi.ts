import mockApi from "@/api/mockApi";
import type {RoomForm} from '@/types/req/roomForm'
import type {RoomQueryForm} from '@/types/req/roomQueryForm'
import type {Room} from '@/types/resp/room'
import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {Page} from "@/types/page";

export default class roomApi {
  static rooms: Room[] = [
    {"id":1,"roomNumber":"208","roomType":20,"status":50,"price":1.43,"area":"34平方米","floorNumber":"2楼","bedType":"标准双人床","maxOccupancy":1,"freeWifi":1,"existWindow":0,"freeBreakfast":1,"createTime":"2020-01-22 23:17:01","modifyTime":"2020-01-23 23:17:01"},
    {"id":2,"roomNumber":"806","roomType":90,"status":20,"price":2.84,"area":"80平方米","floorNumber":"8楼","bedType":"豪华大床","maxOccupancy":1,"freeWifi":1,"existWindow":1,"freeBreakfast":0,"createTime":"2021-02-20 23:17:01","modifyTime":"2021-02-22 23:17:01"},
    {"id":3,"roomNumber":"808","roomType":90,"status":20,"price":2.94,"area":"80平方米","floorNumber":"8楼","bedType":"豪华大床","maxOccupancy":2,"freeWifi":1,"existWindow":1,"freeBreakfast":0,"createTime":"2022-03-23 23:17:01","modifyTime":"2022-03-21 23:17:01"},
    {"id":4,"roomNumber":"106","roomType":10,"status":10,"price":4.25,"area":"15平方米","floorNumber":"1楼","bedType":"标准单人床","maxOccupancy":3,"freeWifi":1,"existWindow":1,"freeBreakfast":0,"createTime":"2023-04-23 23:17:01","modifyTime":"2023-04-23 23:17:01"},
    {"id":5,"roomNumber":"305","roomType":21,"status":40,"price":2.62,"area":"40平方米","floorNumber":"3楼","bedType":"豪华双人床","maxOccupancy":4,"freeWifi":1,"existWindow":0,"freeBreakfast":0,"createTime":"2022-05-21 23:17:01","modifyTime":"2022-05-23 23:17:01"}
  ]

  static async save (roomForm: RoomForm): Promise<Result<void>> {
    console.log('roomApi save params', roomForm)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (roomQueryForm: RoomQueryForm): Promise<Result<Page<Room>>> {
    console.log('roomApi find params', roomQueryForm)
    const response: Response<Page<object>> = await mockApi.queryPageSuccessfully(roomApi.rooms)
    return response.data
  }

  static async findById (id: number): Promise<Result<Room>> {
    console.log('roomApi findById id', id)
    let target = {}
    for (const a of roomApi.rooms) {
      if (a.id === id) {
        target = a
      }
    }
    const response: Response<Room> = await mockApi.operateSuccessfullyWithData(target)
    return response.data
  }

  static async del (id: number): Promise<Result<void>> {
    console.log('roomApi del id', id)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }
}
