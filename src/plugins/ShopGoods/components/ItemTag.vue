<template>
  <div v-if="item.id">
    <el-row type="flex" justify="space-around" style="margin: 10px;">
      <el-col style="margin: 5px;">{{ item.name }}</el-col>
      <el-col style="text-align: end;">
        <el-button
          v-for="(it, index) in operate"
          :type="it.type"
          plain
          size="mini"
          :key="index"
          @click.native.prevent.stop="buttonMethods(it.func, item)"
        >
          {{ it.name }}
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <div style="padding: 10px;background-color: #F0F0F0;">
        <el-tag
          v-for="(tag, index) in item.attr_list"
          :key="index"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag.name }}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-model="inputValue"
          v-if="inputVisible"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <i
          v-else
          class="el-icon-circle-plus button-new-tag"
          @click="showInput"
        ></i>
        <!-- <el-button  class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button> -->
      </div>
    </el-row>
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
  </div>
</template>

<script>
import attr_cate from '../models/attr_cate'
import attr from '../models/attr'

export default {
  props: {
    Fitem: {
      type: Object,
      default() {
        return {
          name: '',
          attr_list: [],
          id: '',
        }
      },
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: '120px',
      inputVisible: false,
      inputValue: '',
      item: this.Fitem,
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
        values: '',
      },
    }
  },
  created() {
    this.loading = true
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      { name: '删除', func: 'handleDelete', type: 'danger' },
    ]
    this.loading = false
  },
  watch: {
    Fitem(newvalue) {
      this.item = newvalue
    },
    dialogFormVisible(val) {
      if (!val) {
        this.form = {
          name: '',
          value: '',
        }
      }
      // console.log(val, this.form)
    },
  },
  methods: {
    async dialogConfirm() {
      this.dialogFormVisible = false
      this._editAttrCate(this.item.id, this.form)
    },
    buttonMethods(func, item) {
      const self = this
      const { methods } = this.$options
      methods[func](self, item)
    },
    handleEdit(self, item) {
      self.form = item // eslint-disable-line
      self.dialogFormVisible = true // eslint-disable-line
    },
    handleDelete(self, item) {
      self
        .$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(async () => {
          self.loading = true // eslint-disable-line
          setTimeout(async () => {
            for (let key = 0; key < item.attr_list.length; key++) {
              await attr.delectAttr(item.attr_list[key].id) // eslint-disable-line
            }
            await attr_cate.delectAttrCate(item.id) // eslint-disable-line
            self.item = {  // eslint-disable-line
              name: '',
              attr_list: [],
              id: '',
            }
            self.loading = false // eslint-disable-line
          }, 1000)
        })
    },
    async _editAttrCate(id) {
      this.loading = true
      const attr_cates = await attr_cate.editAttrCate(id, this.form)
      if (attr_cates.data.attr_cate) {
        const res = attr_cates.data.attr_cate
        this.item = res
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
    async _getAttrCate(id) {
      this.loading = true
      const attr_cates = await attr_cate.getAttrCate(id)
      if (attr_cates.data.attr_cate) {
        const res = attr_cates.data.attr_cate
        this.item = res
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
    async _newAttr(form) {
      this.loading = true
      const attrs = await attr.addAttr(form)
      if (attrs.data.attr) {
        // const res = attrs.data.attr
        // console.log(res)
        this._getAttrCate(this.item.id)
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
    async handleClose(tag) {
      this.item.attr_list.splice(this.item.attr_list.indexOf(tag), 1)
      const res = await attr.delectAttr(tag.id)
      setTimeout(() => {
        this.loading = false
        this.$message({
          type: 'success',
          message: res.msg,
        })
      }, 1000)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {  // eslint-disable-line
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const { inputValue } = this
      const form = {
        name: inputValue,
        attribute_category_id: this.item.id,
        input_type: '',
        sort_order: '0',
        values: '',
      }
      if (inputValue) {
        this._newAttr(form)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
  },
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.input-new-tag /deep/ .el-input__inner {
  height: 24px;
}
</style>
