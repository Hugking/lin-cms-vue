/* eslint-disable class-methods-use-this */
import {
  post,
  get,
  put,
  _delete,
} from '@/lin/plugins/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class Goods {
  // constructor() {}

  // 类中的方法可以代表一个用户行为
  async addGoods(info) {
    const res = await post('wx/goods/', info)
    return res
  }

  // 在这里通过 async await 语法糖让代码同步执行
  // 1. await 一定要搭配 async 来使用
  // 2. await 后面跟的是一个 Promise 对象
  async getGoods(id) {
    const res = await get(`wx/goods/${id}`)
    return res
  }

  async editGoods(id, info) {
    const res = await put(`wx/goods/${id}`, info)
    return res
  }

  async delectGoods(id) {
    const res = await _delete(`wx/goods/${id}`)
    return res
  }

  async getGoodss(info) {
    const res = await get('wx/goods/', info)
    return res
  }

  async searchGoods(info) {
    const res = await post('wx/goods/search', info)
    return res
  }

  async getCount() {
    const res = await get('wx/goods/count')
    return res
  }
}

export default new Goods()
