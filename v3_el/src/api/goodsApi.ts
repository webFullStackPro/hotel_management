import mockApi from "@/api/mockApi";
import type {GoodsForm} from '@/types/req/goodsForm'
import type {GoodsQueryForm} from '@/types/req/goodsQueryForm'
import type {Goods} from '@/types/resp/goods'
import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {Page} from "@/types/page";

export default class goodsApi {
  static goodss: Goods[] = [
    {"id":1,"name":"牙具","price":4.77,"createTime":"2020-01-22 23:17:01","modifyTime":"2020-01-23 23:17:01"},
    {"id":2,"name":"毛巾","price":2.73,"createTime":"2021-02-20 23:17:01","modifyTime":"2021-02-22 23:17:01"},
    {"id":3,"name":"刮胡刀","price":3.91,"createTime":"2022-03-23 23:17:01","modifyTime":"2022-03-21 23:17:01"},
    {"id":4,"name":"香烟","price":1.61,"createTime":"2023-04-23 23:17:01","modifyTime":"2023-04-23 23:17:01"},
    {"id":5,"name":"饮料","price":4.94,"createTime":"2022-05-21 23:17:01","modifyTime":"2022-05-23 23:17:01"},
    {"id":6,"name":"矿泉水","price":3.13,"createTime":"2021-06-20 23:17:01","modifyTime":"2021-06-21 23:17:01"},
    {"id":7,"name":"瓜子","price":3.99,"createTime":"2020-07-22 23:17:01","modifyTime":"2020-07-23 23:17:01"}
  ]

  static async save (goodsForm: GoodsForm): Promise<Result<void>> {
    console.log('goodsApi save params', goodsForm)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }

  static async find (goodsQueryForm: GoodsQueryForm): Promise<Result<Page<Goods>>> {
    console.log('goodsApi find params', goodsQueryForm)
    const response: Response<Page<object>> = await mockApi.queryPageSuccessfully(4, goodsApi.goodss)
    return response.data
  }

  static async findById (id: number): Promise<Result<Goods>> {
    console.log('goodsApi findById id', id)
    let target = {}
    for (let a of goodsApi.goodss) {
      if (a.id === id) {
        target = a
      }
    }
    const response: Response<Goods> = await mockApi.operateSuccessfullyWithData(target)
    return response.data
  }

  static async del (id: number): Promise<Result<void>> {
    console.log('goodsApi del id', id)
    const response: Response<void> = await mockApi.operateSuccessfully()
    return response.data
  }
}
