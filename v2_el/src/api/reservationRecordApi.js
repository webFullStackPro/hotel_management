import mockApi from "@/api/mockApi";

export default class reservationRecordApi {
  static reservationRecords = [
    {"id":1,"roomId":1,"roomNumber":"102","name":"张一","phone":"13899990001","checkInTime":"2020-01-23 23:15:45","remark":"次日5点叫醒服务","status":20,"createTime":"2020-01-22 23:17:01","modifyTime":"2020-01-23 23:17:01"},
    {"id":2,"roomId":4,"roomNumber":"203","name":"李二","phone":"13899990002","checkInTime":"2021-02-21 23:15:45","remark":"有窗","status":10,"createTime":"2021-02-20 23:17:01","modifyTime":"2021-02-22 23:17:01"},
    {"id":3,"roomId":2,"roomNumber":"304","name":"王三","phone":"13899990003","checkInTime":"2022-03-24 23:15:45","remark":"免费停车","status":30,"createTime":"2022-03-23 23:17:01","modifyTime":"2022-03-21 23:17:01"},
    {"id":4,"roomId":2,"roomNumber":"405","name":"赵四","phone":"13899990004","checkInTime":"2023-04-24 23:15:45","remark":"优惠券付费","status":30,"createTime":"2023-04-23 23:17:01","modifyTime":"2023-04-23 23:17:01"},
    {"id":5,"roomId":1,"roomNumber":"506","name":"刘五","phone":"13899990005","checkInTime":"2022-05-22 23:15:45","remark":"次日6点叫车服务","status":10,"createTime":"2022-05-21 23:17:01","modifyTime":"2022-05-23 23:17:01"},
    {"id":6,"roomId":1,"roomNumber":"607","name":"陈六","phone":"13899990006","checkInTime":"2021-06-21 23:15:45","remark":"午餐免费送","status":30,"createTime":"2021-06-20 23:17:01","modifyTime":"2021-06-21 23:17:01"},
    {"id":7,"roomId":2,"roomNumber":"708","name":"黄七","phone":"13899990007","checkInTime":"2020-07-23 23:15:45","remark":"加床","status":30,"createTime":"2020-07-22 23:17:01","modifyTime":"2020-07-23 23:17:01"}
  ]

  static async save (params) {
    console.log('reservationRecordApi save params', params)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (params) {
    console.log('reservationRecordApi find params', params)
    const response = await mockApi.queryPageSuccessfully(4, reservationRecordApi.reservationRecords)
    return response.data
  }

  static async findById (id) {
    console.log('reservationRecordApi findById id', id)
    let target = {}
    for (let a of reservationRecordApi.reservationRecords) {
      if (a.id === id) {
        target = a
      }
    }
    const response = await mockApi.queryByIdSuccessfully(target)
    return response.data
  }

  static async del (id) {
    console.log('reservationRecordApi del id', id)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }
}