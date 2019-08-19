/* eslint-disable class-methods-use-this */
import {
  post,
  get,
  put,
  _delete,
} from '@/lin/plugins/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class Keywords {
  // constructor() {}

  // 类中的方法可以代表一个用户行为
  async addKeywords(info) {
    const res = await post('plugin/goods/keywords/', info)
    return res
  }

  // 在这里通过 async await 语法糖让代码同步执行
  // 1. await 一定要搭配 async 来使用
  // 2. await 后面跟的是一个 Promise 对象
  async getKeywords(id) {
    const res = await get(`plugin/goods/keywords/${id}`)
    return res
  }

  async editKeywords(id, info) {
    const res = await put(`plugin/goods/keywords/${id}`, info)
    return res
  }

  async delectKeywords(id) {
    const res = await _delete(`plugin/goods/keywords/${id}`)
    return res
  }

  async getKeywordss(info) {
    const res = await get('plugin/goods/keywords/', info)
    return res
  }

  async searchKeywords(info) {
    const res = await post('plugin/goods/keywords/search', info)
    return res
  }

  async getKeywordsCount() {
    const res = await get('plugin/goods/keywords/count')
    return res
  }
}

export default new Keywords()
