import type {Response} from '@/types/response'
import type {Result} from '@/types/result'
import type {Page} from '@/types/page'

export default class MockApi {
  static operateSuccessfully (): Promise<Response<void>> {
    const result: Result<void> = {
      code: 1,
      msg: '操作成功'
    };
    const response: Response<void> = {
      status: 200,
      data: result
    }
    return Promise.resolve(response)
  }

  static operateSuccessfullyWithData (data: object): Promise<Response<object>> {
    const result: Result<object> = {
      code: 1,
      msg: '操作成功',
      data: Object.assign({}, data)
    };
    const response: Response<object> = {
      status: 200,
      data: result
    }
    return Promise.resolve(response)
  }

  static operateUnsuccessfully (): Promise<Response<object>> {
    const result: Result<object> = {
      code: 0,
      msg: '操作失败'
    };
    const response: Response<object> = {
      status: 200,
      data: result
    }
    return Promise.resolve(response)
  }

  static queryPageSuccessfully (total: number, data: Array<object>): Promise<Response<Page<object>>> {
    const page: Page<object> = {
      total: total,
      list: Object.assign([], data)
    }
    const result: Result<Page<object>> = {
      code: 1,
      msg: '操作成功',
      data: page
    };
    const response: Response<Page<object>> = {
      status: 200,
      data: result
    }
    return Promise.resolve(response)
  }
}
