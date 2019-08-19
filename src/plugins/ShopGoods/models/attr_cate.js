/* eslint-disable class-methods-use-this */
import {
  post,
  get,
  put,
  _delete,
} from '@/lin/plugins/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class AttrCate {
  // constructor() {}

  // 类中的方法可以代表一个用户行为
  async addAttrCate(info) {
    const res = await post('plugin/goods/attr_cate/', info)
    return res
  }

  // 在这里通过 async await 语法糖让代码同步执行
  // 1. await 一定要搭配 async 来使用
  // 2. await 后面跟的是一个 Promise 对象
  async getAttrCate(id) {
    const res = await get(`plugin/goods/attr_cate/${id}`)
    return res
  }

  async editAttrCate(id, info) {
    const res = await put(`plugin/goods/attr_cate/${id}`, info)
    return res
  }

  async delectAttrCate(id) {
    const res = await _delete(`plugin/goods/attr_cate/${id}`)
    return res
  }

  async getAttrCates(info) {
    const res = await get('plugin/goods/attr_cate/', info)
    return res
  }

  async searchAttrCate(info) {
    const res = await post('plugin/goods/attr_cate/search', info)
    return res
  }

  async getAttrCateCount() {
    const res = await get('plugin/goods/attr_cate/count')
    return res
  }
}

export default new AttrCate()
