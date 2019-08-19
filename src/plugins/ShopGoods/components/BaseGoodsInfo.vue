<template>
  <el-form ref="form" :model="form" :inline="true" :rules="goodsRules">
    <el-card class="box-card base-box-card" style="margin-bottom:20px;">
      <el-row>
        <el-col :span="6">
          <el-form-item prop="name" label="产品名称">
            <el-input
              placeholder="请输入产品名称"
              v-model="form.name"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col style="margin-bottom: 10px;margin-top: 10px;">
          <el-form-item label="产品图片" required>
            <upload-imgs
              ref="uploadPic"
              :value="form.list_pic_url"
              :rules="rules"
              :max-num="5"
              :multiple="true"
              :sortable="true"
              :fit="fit"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="产品分组" prop="category_id">
          <el-tree
            :data="cateOptions"
            :props="defaultProps"
            node-key="id"
            ref="tree"
            accordion
            show-checkbox
            :default-expanded-keys="form.category_id"
            :default-checked-keys="form.category_id"
            :expand-on-click-node="false"
          ></el-tree>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item prop="brand_id" label="产品品牌">
            <el-select
              default-first-option
              v-model="form.brand_id"
              placeholder="请选择品牌"
              prefix="品牌"
            >
              <el-option
                v-for="item in brandOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item prop="retail_price" label="市场价格">
            <el-input
              placeholder="请输入市场价格"
              v-model="form.retail_price"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item prop="goods_unit" label="计量单位">
            <el-input
              placeholder="请输入计量单位"
              v-model="form.goods_unit"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item prop="unit_price" label="产品价格">
            <el-input
              placeholder="请输入产品价格"
              v-model="form.unit_price"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item prop="goods_num" label="产品库存">
            <el-input
              placeholder="请输入产品库存"
              v-model="form.goods_num"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item prop="goods_brief" label="产品简介">
            <el-input
              placeholder="请输入产品简介"
              v-model="form.goods_brief"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <tinymce
          v-bind:Fcontent="form.goods_desc"
          @change="change"
          upload_url="http://localhost:5000/cms/file/"
        />
      </el-form-item>
      <el-row>
        <el-form-item class="submit">
          <el-button type="primary" @click="submitForm('form')">
            保 存
          </el-button>
          <el-button @click="resetForm('form')">重 置</el-button>
        </el-form-item>
      </el-row>
    </el-card>
  </el-form>
</template>

<script>
import Tinymce from '@/components/base/tinymce'
import UploadImgs from '@/components/base/upload-imgs'
import brand from '../models/brand'
import cate from '../models/cate'
import attr from '../models/attr'
import goods from '../models/goods'

export default {
  name: 'BaseGoodsInfo',
  components: {
    Tinymce,
    UploadImgs,
  },
  props: {
    Fgoods_id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: true,
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf',
      },
      goods_id: this.Fgoods_id,
      brandOptions: [],
      cateOptions: [],
      attrOptions: [],
      form: {
        name: '',
        brand_id: '',
        category_id: [],
        goods_num: '100',
        goods_unit: '',
        unit_price: '0.00',
        retail_price: '0.00',
        list_pic_url: [],
        primary_pic_url: [],
        goods_brief: '',
        goods_desc: '',
      },
      goodsRules: {
        name: [
          {
            required: true,
            message: '请输入产品名称',
            trigger: 'blur',
          },
        ],
        brand_id: [
          {
            required: true,
            message: '请选择品牌',
            trigger: 'change',
          },
        ],
        category_id: [
          {
            required: true,
            message: '请选择产品分组',
            trigger: 'blur',
          },
        ],
        goods_num: [
          {
            required: true,
            message: '请输入产品库存',
            trigger: 'blur',
          },
        ],
        goods_brief: [
          {
            required: true,
            message: '请输入产品简介',
            trigger: 'blur',
          },
        ],
        goods_unit: [
          {
            required: true,
            message: '请输入产品计量',
            trigger: 'blur',
          },
        ],
        unit_price: [
          {
            required: true,
            message: '请输入产品价格',
            trigger: 'blur',
          },
        ],
        retail_price: [
          {
            required: true,
            message: '请输入产品市场价格',
            trigger: 'blur',
          },
        ],
      },
      fit: 'cover',
      rules: {
        minWidth: 100,
        minHeight: 100,
        maxSize: 5,
      },
      goodsEditFlag: false,
      checkEditFlag: false,
    }
  },
  created() {
    this.loading = true
    this._getBrand()
    this._getCate()
    this.loading = false
  },
  // 计算属性设置
  computed: {},
  // 数据变更监听
  watch: {
    Fgoods_id(newvalue) {
      this.goods_id = newvalue
    },
    goods_id(newvalue) {
      this.$emit('update:Fgoods_id', newvalue.toString())
    },
  },
  beforeMount() {},
  mounted() {
    this.init()
  },
  // 当页面使用路由参数时, 参数部分变化触发的动作在本函数中操作
  // https://router.vuejs.org/zh/guide/advanced/navigation-guards.htmll#组件内的守卫
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
        // console.log('编辑基本信息')
        this._getGoods(this.goods_id)
      } else {
        // console.log('新增基本信息')
      }
      this.loading = false
    },
    change(val) {
      this.form.goods_desc = val
    },
    async getValue(name) {
      const info = await this.$refs[name].getValue()
      // console.log(info, this.form)
      const imgs = []
      /* eslint-disable no-param-reassign */
      info.map((item) => {
        if (!item.id) {
          item.id = ''
        }
        if (!item.imgId) {
          item.imgId = ''
        }
        if (!item.src) {
          item.src = ''
        }
        if (!item.display) {
          item.display = ''
        }
        const img = {
          id: item.id.toString(),
          imgId: item.imgId.toString(),
          src: item.src.toString(),
          display: item.display.toString(),
        }
        imgs.push(img)
        return ''
      })
      return imgs
    },
    async _getBrand() {
      const form = {
        page: '1',
        size: '100',
      }
      const brands = await brand.getBrands(form)
      if (brands.data.brand) {
        const res = brands.data.brand
        this.brandOptions = res
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'error',
            message: brands.msg,
          })
        }, 1000)
      }
    },
    async _getCate() {
      const form = {
        page: '1',
        size: '100',
      }
      const cates = await cate.getCates(form)
      if (cates.data.category) {
        const res = cates.data.category
        this.cateOptions = res
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'error',
            message: cates.msg,
          })
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
        // console.log('attr', res)
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'error',
            message: attrs.msg,
          })
        }, 1000)
      }
    },
    async _getGoods(id) {
      this.loading = true
      const goodss = await goods.getGoods(id)
      if (goodss.data.goods) {
        const res = goodss.data.goods
        // // console.log('查询的goods', res)
        res.list_pic_url = this.fixImg(res.list_pic_url)
        this.form = res
        this.goodsEditFlag = true
        this.loading = false
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'error',
            message: goodss.msg,
          })
        }, 1000)
      }
    },
    async _newGoods(form) {
      this.loading = true
      const goodss = await goods.addGoods(form)
      if (goodss.data.goods) {
        const res = goodss.data.goods
        this.goods_id = res.id
        // console.log('goodss', res)
        res.list_pic_url = this.fixImg(res.list_pic_url)
        this.goodsEditFlag = true
        this.form = res
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: goodss.msg,
          })
        }, 1000)
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'error',
            message: goodss.msg,
          })
        }, 1000)
      }
    },
    async _editGoods(id, form) {
      this.loading = true
      const goodss = await goods.editGoods(id, form)
      if (goodss.data.goods) {
        // const res = goodss.data.goods
        // console.log('goodss', res)
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: goodss.msg,
          })
        }, 1000)
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'error',
            message: goodss.msg,
          })
        }, 1000)
      }
    },
    async submitForm(formName) {
      this.loading = true
      const imgs = await this.getValue('uploadPic')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            this.loading = true
            this.form.list_pic_url = imgs
            this.form.category_id = this.$refs.tree.getCheckedKeys()
            if (imgs.length !== 0) {
              this.form.primary_pic_url = []
              this.form.primary_pic_url.push(imgs[0])
            } else {
              this.form.primary_pic_url = []
            }
            // console.log(this.form, imgs, this.form.primary_pic_url)
            if (this.goods_id) {
              this._editGoods(this.goods_id, this.form)
              this.loading = false
            } else {
              this._newGoods(this.form)
              this.loading = false
            }
          } catch (e) {
            this.loading = false
            // console.log(e)
          }
        } else {
          this.$message.error('请将信息填写完整')
          this.loading = false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    fixImg(pic_list) {
      const imgs = []
      for (let i = 0; i < pic_list.length; i++) {
        const item = pic_list[i]
          .replace(/{/g, '')
          .replace(/}/g, '')
          .replace(/'/g, '')
          .split()[0]
          .replace(/ /g, '')
          .split(',')
        const img_item = {
          id: item[0].split(/:/g)[1],
          imgId: item[1].split(/:/g)[1],
          src: item[2].split(/:/g)[1],
          display: item[3].split(/:/g)[1] + item[3].split(/:/g)[2],
        }
        imgs.push(img_item)
      }
      return imgs
    },
  },
}
</script>

<style scoped lang="scss"></style>
