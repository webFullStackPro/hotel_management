import mockApi from "@/api/mockApi";

export default class checkInRecordDetailApi {
  static checkInRecordDetails = [
    {"id":1,"checkInRecordId":1,"name":"张一","phone":"13899990001","goodsId":2,"goodsName":"牙具","goodsPrice":"4.8","qty":3,"price":4.8,"amount":14.4,"createTime":"2024-11-22 14:54:57"},
    {"id":2,"checkInRecordId":3,"name":"李二","phone":"13899990002","goodsId":2,"goodsName":"毛巾","goodsPrice":"4.63","qty":5,"price":4.6,"amount":23,"createTime":"2024-11-22 14:54:57"},
    {"id":3,"checkInRecordId":3,"name":"王三","phone":"13899990003","goodsId":2,"goodsName":"刮胡刀","goodsPrice":"3.20","qty":3,"price":3.2,"amount":9.6,"createTime":"2024-11-23 14:54:57"},
    {"id":4,"checkInRecordId":3,"name":"赵四","phone":"13899990004","goodsId":1,"goodsName":"香烟","goodsPrice":"4.9","qty":1,"price":4.9,"amount":4.9,"createTime":"2024-11-21 14:54:57"},
    {"id":5,"checkInRecordId":2,"name":"刘五","phone":"13899990005","goodsId":4,"goodsName":"饮料","goodsPrice":"4.42","qty":2,"price":4.42,"amount":8.84,"createTime":"2024-11-22 14:54:57"}
  ]

  static async save (params) {
    console.log('checkInRecordDetailApi save params', params)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (params) {
    console.log('checkInRecordDetailApi find params', params)
    const response = await mockApi.queryPageSuccessfully(4, checkInRecordDetailApi.checkInRecordDetails)
    return response.data
  }

  static async findById (id) {
    console.log('checkInRecordDetailApi findById id', id)
    let target = {}
    for (let a of checkInRecordDetailApi.checkInRecordDetails) {
      if (a.id === id) {
        target = a
      }
    }
    const response = await mockApi.queryByIdSuccessfully(target)
    return response.data
  }

  static async del (id) {
    console.log('checkInRecordDetailApi del id', id)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }
}