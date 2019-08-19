<template>
  <div class="lin-container">
    <el-form ref="form" :model="form" :inline="true">
      <el-card class="box-card base-box-card" style="margin-bottom:20px;">
        <div class="group">
          <div class="details">
            <div
              class="permissions-box"
              v-for="(item, index) in attrCateoptions"
              :key="index"
            >
              <el-tag class="module">{{ item.name }}</el-tag>
              <el-checkbox-group
                v-model="checkedEquipments[index]"
                @change="checkChange(item.id)"
              >
                <ul class="permissions-ul">
                  <li class="permissions-li">
                    <el-checkbox
                      v-for="data in item.attr_list"
                      :label="data.id"
                      :key="data.name"
                    >
                      {{ data.name }}
                    </el-checkbox>
                  </li>
                </ul>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div style="margin-left: 20px;">
          <el-row :gutter="20">
            <el-form-item label="热门">
              <el-col :span="6">
                <el-switch
                  v-model="form.is_hot"
                  active-color="#3963bc"
                ></el-switch>
              </el-col>
            </el-form-item>
            <el-form-item label="限购">
              <el-col :span="6">
                <el-switch
                  v-model="form.is_limited"
                  active-color="#3963bc"
                ></el-switch>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="新品">
              <el-col :span="6">
                <el-switch
                  v-model="form.is_new"
                  active-color="#3963bc"
                ></el-switch>
              </el-col>
            </el-form-item>
            <el-form-item label="促销">
              <el-col :span="6">
                <el-switch
                  v-model="form.is_on_sale"
                  active-color="#3963bc"
                ></el-switch>
              </el-col>
            </el-form-item>
          </el-row>
        </div>
        <el-form-item class="submit">
          <el-button type="primary" @click="submitForm()">保 存</el-button>
          <el-button @click="resetForm()">刷 新</el-button>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import attr_cate from '../models/attr_cate'
import attr from '../models/attr'
import goods from '../models/goods'
import GoodsAttr from '../models/goods_attr'

export default {
  name: 'otherGoodsInfo',
  components: {},
  props: {
    Fgoods_id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: true,
      goods_id: this.Fgoods_id,
      checkedEquipments: [],
      attrCateoptions: [],
      form: {
        is_delete: false,
        is_hot: false,
        is_limited: false,
        is_new: false,
        is_on_sale: false,

        app_exclusive_price: '0.00',
        counter_price: '0.00',
        extra_price: '0.00',
        keywords: '',
        primary_product_id: 0,
        promotion_desc: '',
        promotion_tag: '',
        sell_volume: '0',
        sort_order: 100,
      },
      goodsEditFlag: false,
      checkEditFlag: false,
    }
  },
  created() {
    this.loading = true
    this._getAttrcate()
    for (const key in this.attrCateoptions) {
      this.$set(this.attrCateoptions, key, [])
    }
    this.loading = false
  },
  // 计算属性设置
  computed: {},
  // 数据变更监听
  watch: {
    Fgoods_id(newvalue) {
      this.goods_id = newvalue
      this.init()
    },
  },
  beforeMount() {},
  mounted() {
    this.init()
  },
  beforeRouteUpdate(to, from, next) {
    this.name = to.params.name
    this.init()
    next()
  },
  methods: {
    // 执行获取数据等初始化动作
    async init() {
      this.loading = true
      if (this.goods_id) {
        // console.log('编辑其他信息')
        this._getGoods(this.goods_id)
      } else {
        // console.log('新增其他信息')
      }
      this.loading = false
    },
    async getCheckdata(id) {
      let get_check = []
      if (this.goodsEditFlag === true) {
        get_check = await this.initCheck(id)
        this.checkEditFlag = true
      }
      this.checkedEquipments = []
      for (let i = 0; i < this.attrCateoptions.length; i++) {
        const checkArr = []
        const item = this.attrCateoptions[i].attr_list
        if (item) {
          if (item.length === 0) {
            this.checkedEquipments.push([])
          } else if (this.checkEditFlag) {
            for (let j = 0; j < get_check.length; j++) {
              /* eslint-disable eqeqeq */
              if (item[0].attribute_category_id == get_check[j].id) {
                for (let k = 0; k < get_check[j].equips.length; k++) {
                  checkArr.push(get_check[j].equips[k])
                }
              }
            }
            this.checkedEquipments.push(checkArr)
          } else {
            this.checkedEquipments.push([])
          }
        } else {
          this.checkedEquipments.push([])
        }
      }
      // // console.log('初始化check', this.checkedEquipments)
    },
    checkChange() {
      this.checkEquipArr = []
      const arr = this.checkedEquipments
      for (let i = 0; i < arr.length; i++) {
        const equipment = arr[i]
        if (equipment.length > 0) {
          const obj = {
            id: this.attrCateoptions[i].id,
            equips: [],
          }
          for (let j = 0; j < equipment.length; j++) {
            obj.equips.push(equipment[j])
          }
          this.checkEquipArr.push(obj)
        }
      }
    },
    async submitCheck() {
      if (!this.checkEquipArr) {
        this.$message.error('至少选择一个购物选项')
      } else if (this.checkEquipArr.length === 0) {
        this.$message.error('至少选择一个购物选项')
      } else {
        this.loading = true
        const old_check = []
        const new_check = []
        const res = await this._searchGoodsAttr(this.goods_id)
        for (let n = 0; n < res.length; n++) {
          old_check.push(res[n].attribute_id.id)
        }
        this.form.attribute_category = []
        for (let key = 0; key < this.checkEquipArr.length; key++) {
          this.form.attribute_category.push(this.checkEquipArr[key].id)
          // // console.log('attr_cate', this.checkEquipArr[key].id, this.form)
          this._editGoods(this.goods_id, this.form)
          for (let j = 0; j < this.checkEquipArr[key].equips.length; j++) {
            new_check.push(this.checkEquipArr[key].equips[j])
          }
        }
        const has_check = new_check.filter(v => old_check.indexOf(v) !== -1)
        const add_check = new_check
          .concat(has_check)
          .filter(
            v => has_check.indexOf(v) === -1 || new_check.indexOf(v) === -1,
          )
        const del_check = old_check
          .concat(has_check)
          .filter(
            v => old_check.indexOf(v) === -1 || has_check.indexOf(v) === -1,
          )
        // // console.log(new_check, old_check, has_check, del_check)
        for (let i = 0; i < add_check.length; i++) {
          const new_form = {
            goods_id: this.goods_id,
            attribute_id: add_check[i],
          }
          // // console.log('new_goods_attr', new_form)
          this._newGoodsAttr(new_form)
        }
        for (let i = 0; i < del_check.length; i++) {
          const del_form = {
            goods_id: this.goods_id,
            attribute_id: del_check[i],
          }
          /* eslint-disable no-await-in-loop */
          const del_item = await GoodsAttr.searchGoodsAttr(del_form)
          const del_id = del_item.data.goods_attr[0].id
          // // console.log('del_goods_attr', del_form, del_item, del_id)
          await GoodsAttr.delectGoodsAttr(del_id)
        }

        this.loading = false
      }
    },
    async initCheck(id) {
      const checkArry = []
      if (this.goodsEditFlag === true) {
        const res = await this._searchGoodsAttr(id)
        for (let n = 0; n < this.form.attribute_category.length; n++) {
          const OBJ = {
            id: this.form.attribute_category[n],
            equips: [],
          }
          for (let m = 0; m < res.length; m++) {
            /* eslint-disable eqeqeq */
            if (
              res[m].attribute_id.attribute_category_id
              == this.form.attribute_category[n]
            ) {
              OBJ.equips.push(res[m].attribute_id.id)
            }
          }
          checkArry.push(OBJ)
        }
        // // console.log('查询的check', res, checkArry)
        return checkArry
      }
      return checkArry
    },
    async _getAttrcate() {
      const form = {
        page: '1',
        size: '100',
      }
      const attr_cates = await attr_cate.getAttrCates(form)
      if (attr_cates.data.attr_cate) {
        const res = attr_cates.data.attr_cate
        this.attrCateoptions = res
        this.getCheckdata()
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message.success(attr_cates.msg)
        }, 1000)
      }
    },
    async _getAttr(attr_cate_id) {
      const form = {
        page: '1',
        size: '100',
        attribute_category_id: attr_cate_id,
      }
      const attrs = await attr.searchAttr(form)
      if (attrs.data.attr) {
        const res = attrs.data.attr
        this.attrOptions = res
        // // console.log('attr', res)
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message.success(attrs.msg)
        }, 1000)
      }
    },
    async _getGoods(id) {
      this.loading = true
      const goodss = await goods.getGoods(id)
      if (goodss.data.goods) {
        const res = goodss.data.goods
        this.form = res
        this.goodsEditFlag = true
        this.getCheckdata(id)
        this.loading = false
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message.error(goodss.msg)
        }, 1000)
      }
    },
    async _editGoods(id, form) {
      this.loading = true
      const goodss = await goods.editGoods(id, form)
      if (goodss.data.goods) {
        // const res = goodss.data.goods
        setTimeout(() => {
          this.loading = false
          this.$message.success(goodss.msg)
        }, 1000)
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message.error(goodss.msg)
        }, 1000)
      }
    },
    async _newGoodsAttr(form) {
      this.loading = true
      const goods_attrs = await GoodsAttr.addGoodsAttr(form)
      if (goods_attrs.data.goods_attr) {
        // const res = goods_attrs.data.goods_attr
        setTimeout(() => {
          this.loading = false
        }, 1000)
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message.error(goods_attrs.msg)
        }, 1000)
      }
    },
    async _searchGoodsAttr(id) {
      this.loading = true
      const form = {
        page: '1',
        size: '100',
        goods_id: id,
      }
      const goods_attrs = await GoodsAttr.searchGoodsAttr(form)
      if (goods_attrs.data.goods_attr) {
        const res = goods_attrs.data.goods_attr
        return res
      }
      setTimeout(() => {
        this.loading = false
      }, 1000)
      return ''
    },
    async submitForm() {
      this.loading = true
      if (this.goodsEditFlag) {
        this._editGoods(this.goods_id, this.form)
        this.submitCheck()
        this.loading = false
      } else {
        this.$message.error('请先填写基本信息')
      }
    },
    resetForm() {
      this.checkedEquipments = []
      this.getCheckdata(this.goods_id)
    },
  },
}
</script>

<style scoped lang="scss">
.group {
  .details {
    display: inline-block;
    width: 100%;
    margin-top: 5px;
    margin-left: 5px;

    .text-input {
      height: 40px;
      width: 780px;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 1px solid #dee2e6;
      text-indent: 20px;

      &::placeholder {
        font-size: 14px;
        font-weight: 400;
        color: #c4c9d2;
        text-indent: 20px;
      }
    }

    .permissions-box {
      .module {
        height: 20px;
        font-size: 13px;
        line-height: 20px;
        margin-bottom: 10px;
      }

      .permissions-ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 20px 20px 0;
        background: #f5f5f6;
        margin-bottom: 20px;

        .permissions-li {
          width: 150px;
          height: 20px;
          line-height: 20px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          vertical-align: text-top;
          margin-right: 10px;

          .check {
            transform: translateY(2px);
            margin-right: 5px;
          }

          .permissions-name {
            height: 20px;
            font-size: 14px;
            font-weight: 400;
            color: #596c8e;
            line-height: 20px;
            margin-right: 20px;
          }
        }
      }
    }
  }
}
</style>
