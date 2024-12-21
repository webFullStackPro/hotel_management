import mockApi from "@/api/mockApi";

export default class goodsApi {
  static goodss = [
    {"id":1,"name":"牙具","price":"4.77","createTime":"2020-01-22 23:17:01","modifyTime":"2020-01-23 23:17:01"},
    {"id":2,"name":"毛巾","price":"2.73","createTime":"2021-02-20 23:17:01","modifyTime":"2021-02-22 23:17:01"},
    {"id":3,"name":"刮胡刀","price":"3.91","createTime":"2022-03-23 23:17:01","modifyTime":"2022-03-21 23:17:01"},
    {"id":4,"name":"香烟","price":"1.61","createTime":"2023-04-23 23:17:01","modifyTime":"2023-04-23 23:17:01"},
    {"id":5,"name":"饮料","price":"4.94","createTime":"2022-05-21 23:17:01","modifyTime":"2022-05-23 23:17:01"},
    {"id":6,"name":"矿泉水","price":"3.13","createTime":"2021-06-20 23:17:01","modifyTime":"2021-06-21 23:17:01"},
    {"id":7,"name":"瓜子","price":"3.99","createTime":"2020-07-22 23:17:01","modifyTime":"2020-07-23 23:17:01"}
  ]

  static async save (params) {
    console.log('goodsApi save params', params)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (params) {
    console.log('goodsApi find params', params)
    const response = await mockApi.queryPageSuccessfully(goodsApi.goodss)
    return response.data
  }

  static async findById (id) {
    console.log('goodsApi findById id', id)
    let target = {}
    for (let a of goodsApi.goodss) {
      if (a.id === id) {
        target = a
      }
    }
    const response = await mockApi.queryByIdSuccessfully(target)
    return response.data
  }

  static async del (id) {
    console.log('goodsApi del id', id)
    const response = await mockApi.operateSuccessfully()
    return response.data
  }
}