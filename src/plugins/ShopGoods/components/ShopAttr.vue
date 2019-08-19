<template>
  <el-card class="box-card base-box-card" style="margin-bottom:20px;">
    <div class="header">
      <div class="header-left"><p class="title">属性信息</p></div>
      <div class="header-right">
        <div style="margin-left:30px;margin-bottom: 5px;">
          <el-button type="primary" @click="add">新建</el-button>
        </div>
      </div>
    </div>
    <div class="table-main">
      <div v-for="(item, index) in AttrCateOptions" :key="index">
        <itemtag :Fitem.sync="item" />
      </div>
    </div>
    <el-dialog title="编辑属性" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules">
        <el-form-item
          label="属性名称"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="值" :label-width="formLabelWidth">
          <el-input v-model="form.value" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import ItemTag from './ItemTag'
import attr_cate from '../models/attr_cate'

export default {
  name: 'GroupOps',
  components: {
    itemtag: ItemTag,
  },
  props: {},
  data() {
    return {
      AttrCateOptions: [],
      loading: true,
      new: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      rules: {
        name: [
          {
            required: true,
            message: '请输入属性名称',
            trigger: 'blur',
          },
        ],
      },
      form: {
        name: '',
        value: '',
      },
    }
  },
  created() {
    this.loading = true
    this._getAttrCate()
    this.loading = false
  },
  // 计算属性设置
  computed: {},
  // 数据变更监听
  watch: {
    dialogFormVisible(val) {
      if (!val) {
        this.form = {
          name: '',
          value: '',
        }
        this.new = false
      }
      // console.log(val, this.form)
    },
  },
  beforeMount() {},
  mounted() {},
  methods: {
    add() {
      this.new = true
      this.dialogFormVisible = true
    },
    async dialogConfirm() {
      this.dialogFormVisible = false
      if (this.new) {
        this._newAttrCate(this.form)
      } else {
        this._editAttrCate(this.form.id, this.form)
      }
    },
    async _getAttrCate() {
      const form = {
        page: '1',
        size: '100',
      }
      const attr_cates = await attr_cate.getAttrCates(form)
      if (attr_cates.data.attr_cate) {
        const res = attr_cates.data.attr_cate
        // // console.log(res)
        this.AttrCateOptions = res
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'error',
            message: attr_cates.msg,
          })
        }, 1000)
      }
    },
    async _newAttrCate(form) {
      const attr_cates = await attr_cate.addAttrCate(form)
      if (attr_cates.data.attr_cate) {
        const res = attr_cates.data.attr_cate
        this.attr_cate_id = res.id
        // // console.log(res)
        this._getAttrCate()
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'error',
            message: attr_cates.msg,
          })
        }, 1000)
      }
    },
    async _editAttrCate(id, form) {
      const attr_cates = await attr_cate.editAttrCate(id, form)
      if (attr_cates.data.attr_cate) {
        // const res = attr_cates.data.attr_cate
        // console.log(res)
        this.$message.success(attr_cates.msg)
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'error',
            message: attr_cates.msg,
          })
        }, 1000)
      }
    },
  },
}
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  border-bottom: 1px solid #dae1ed;

  .header-left {
    float: left;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .header-right {
    float: right;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.table-main {
  padding: 0 30px;
  margin-top: 30px;
}
</style>
