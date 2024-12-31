import mockApi from "@/api/mockApi";
import type {ReservationRecordForm} from '@/types/req/reservationRecordForm'
import type {ReservationRecordQueryForm} from '@/types/req/reservationRecordQueryForm'
import type {ReservationRecord} from '@/types/resp/reservationRecord'
import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {Page} from "@/types/page";
import dayjs from "dayjs";

export default class reservationRecordApi {
  static reservationRecords: ReservationRecord[] = [
    {"id":1,"roomId":1,"roomNumber":"102","name":"张一","phone":"13899990001","checkInTime":dayjs("2020-01-23 23:15:45"),"remark":"次日5点叫醒服务","status":20,"createTime":"2020-01-22 23:17:01","modifyTime":"2020-01-23 23:17:01"},
    {"id":2,"roomId":4,"roomNumber":"203","name":"李二","phone":"13899990002","checkInTime":dayjs("2021-02-21 23:15:45"),"remark":"有窗","status":10,"createTime":"2021-02-20 23:17:01","modifyTime":"2021-02-22 23:17:01"},
    {"id":3,"roomId":2,"roomNumber":"304","name":"王三","phone":"13899990003","checkInTime":dayjs("2022-03-24 23:15:45"),"remark":"免费停车","status":30,"createTime":"2022-03-23 23:17:01","modifyTime":"2022-03-21 23:17:01"},
    {"id":4,"roomId":2,"roomNumber":"405","name":"赵四","phone":"13899990004","checkInTime":dayjs("2023-04-24 23:15:45"),"remark":"优惠券付费","status":30,"createTime":"2023-04-23 23:17:01","modifyTime":"2023-04-23 23:17:01"},
    {"id":5,"roomId":1,"roomNumber":"506","name":"刘五","phone":"13899990005","checkInTime":dayjs("2022-05-22 23:15:45"),"remark":"次日6点叫车服务","status":10,"createTime":"2022-05-21 23:17:01","modifyTime":"2022-05-23 23:17:01"},
    {"id":6,"roomId":1,"roomNumber":"607","name":"陈六","phone":"13899990006","checkInTime":dayjs("2021-06-21 23:15:45"),"remark":"午餐免费送","status":30,"createTime":"2021-06-20 23:17:01","modifyTime":"2021-06-21 23:17:01"},
    {"id":7,"roomId":2,"roomNumber":"708","name":"黄七","phone":"13899990007","checkInTime":dayjs("2020-07-23 23:15:45"),"remark":"加床","status":30,"createTime":"2020-07-22 23:17:01","modifyTime":"2020-07-23 23:17:01"}
  ]

  static async save (reservationRecordForm: ReservationRecordForm): Promise<Result<void>> {
    console.log('reservationRecordApi save params', reservationRecordForm)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (reservationRecordQueryForm: ReservationRecordQueryForm): Promise<Result<Page<ReservationRecord>>> {
    console.log('reservationRecordApi find params', reservationRecordQueryForm)
    const response: Response<Page<object>> = await mockApi.queryPageSuccessfully(reservationRecordApi.reservationRecords)
    return response.data
  }

  static async findById (id: number): Promise<Result<ReservationRecord>> {
    console.log('reservationRecordApi findById id', id)
    let target = {}
    for (const a of reservationRecordApi.reservationRecords) {
      if (a.id === id) {
        target = a
      }
    }
    const response: Response<ReservationRecord> = await mockApi.operateSuccessfullyWithData(target)
    return response.data
  }

  static async del (id: number): Promise<Result<void>> {
    console.log('reservationRecordApi del id', id)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }
}
