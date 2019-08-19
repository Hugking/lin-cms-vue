/* eslint-disable class-methods-use-this */
import {
  post,
  get,
  put,
  _delete,
} from '@/lin/plugins/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class Attr {
  // constructor() {}

  // 类中的方法可以代表一个用户行为
  async addAttr(info) {
    const res = await post('plugin/goods/attr/', info)
    return res
  }

  // 在这里通过 async await 语法糖让代码同步执行
  // 1. await 一定要搭配 async 来使用
  // 2. await 后面跟的是一个 Promise 对象
  async getAttr(id) {
    const res = await get(`plugin/goods/attr/${id}`)
    return res
  }

  async editAttr(id, info) {
    const res = await put(`plugin/goods/attr/${id}`, info)
    return res
  }

  async delectAttr(id) {
    const res = await _delete(`plugin/goods/attr/${id}`)
    return res
  }

  async getAttrs(info) {
    const res = await get('plugin/goods/attr/', info)
    return res
  }

  async searchAttr(info) {
    const res = await post('plugin/goods/attr/search', info)
    return res
  }

  async getAttrCount() {
    const res = await get('plugin/goods/attr/count')
    return res
  }
}

export default new Attr()
