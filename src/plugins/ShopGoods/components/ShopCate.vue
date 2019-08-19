<template>
  <el-card class="box-card base-box-card" style="margin-bottom:20px;">
    <div class="header">
      <div class="header-left"><p class="title">分组信息</p></div>
      <div class="header-right">
        <div style="margin-left:30px;margin-bottom: 5px;">
          <el-button type="primary" @click="add">新建</el-button>
        </div>
      </div>
    </div>
    <div class="table-main">
      <el-tree
        :data="data"
        :props="defaultProps"
        default-expand-all
        node-key="id"
        :expand-on-click-node="false"
        :render-content="renderContent"
      ></el-tree>
    </div>
    <el-dialog title="编辑分组" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules">
        <el-form-item label="分组名称" :label-width="formLabelWidth" required>
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
          <upload-imgs
            ref="uploadPic"
            :value="form.img_url"
            :rules="imgRules"
            :max-num="1"
            :multiple="true"
            :sortable="true"
            :fit="fit"
          />
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input v-model="form.front_desc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="展示顺序" :label-width="formLabelWidth">
          <el-input v-model="form.show_index" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权重" :label-width="formLabelWidth">
          <el-input v-model="form.sort_order" autocomplete="off"></el-input>
        </el-form-item>
        <!-- el-form-item label="banner_url" :label-width="formLabelWidth">
          <el-input v-model="form.banner_url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="wap_banner_url" :label-width="formLabelWidth">
          <el-input v-model="form.wap_banner_url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="icon_url" :label-width="formLabelWidth">
          <el-input v-model="form.icon_url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="关键词" :label-width="formLabelWidth">
          <el-input v-model="form.keywords" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="type" :label-width="formLabelWidth">
          <el-input v-model="form.type" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="level" :label-width="formLabelWidth">
          <el-input v-model="form.level" autocomplete="off"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import UploadImgs from '@/components/base/upload-imgs'
import cate from '../models/cate'

export default {
  name: 'GroupOps',
  components: {
    UploadImgs,
  },
  props: {},
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf',
      },
      isRouterAlive: true,
      cate_id: '',
      loading: true,
      new: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      imgRules: {
        minWidth: 100,
        minHeight: 100,
        maxSize: 5,
      },
      fit: 'cover',
      rules: {
        name: [
          {
            required: true,
            message: '请输入分组名称',
            trigger: 'blur',
          },
        ],
      },
      form: {
        name: '',
        front_desc: '',
        banner_url: '',
        icon_url: '',
        img_url: [],
        keywords: '',
        level: '',
        parent_id: 0,
        show_index: 0,
        sort_order: 50,
        type: 0,
        wap_banner_url: '',
      },
    }
  },
  created() {
    this.loading = true
    this._getCate()
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
          front_desc: '',
          banner_url: '',
          icon_url: '',
          img_url: [],
          keywords: '',
          level: '',
          parent_id: 0,
          show_index: 0,
          sort_order: 50,
          type: 0,
          wap_banner_url: '',
        }
        this.new = false
      }
      // console.log(val, this.form)
    },
  },
  beforeMount() {},
  mounted() {},
  methods: {
    async edit(data) {
      // console.log('this_id', data.id)
      this.dialogFormVisible = true
      const cates = await cate.getCate(data.id)
      this.form = cates.data.category
    },
    append(data) {
      this.cate_id = ''
      this.dialogFormVisible = true
      this.new = true
      this.form.parent_id = data.id
      this.cate_id = ''
    },
    remove(node, data) {
      const { parent } = node
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      // console.log(children[index].id)
      children.splice(index, 1)
    },
    add() {
      this.new = true
      this.dialogFormVisible = true
    },
    async dialogConfirm() {
      this.form.img_url = await this.getValue('uploadPic')
      this.dialogFormVisible = false
      if (this.new) {
        this._newCate(this.form)
      } else {
        this._editCate(this.form.id, this.form)
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
        this.data = res
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
    async _newCate(form) {
      const cates = await cate.addCate(form)
      if (cates.data.category) {
        const res = cates.data.category
        this.cate_id = res.id
        // console.log(res)
        this._getCate()
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
    async _editCate(id, form) {
      const cates = await cate.editCate(id, form)
      if (cates.data.category) {
        // const res = cates.data.category
        // console.log(res)
        this.$message.success(cates.msg)
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
    async getValue(name) {
      const info = await this.$refs[name].getValue()
      // // console.log(info, this.form)
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
    renderContent(h, { node, data }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            <el-button
              plain
              size="mini"
              style="font-size: 12px;"
              type="success"
              on-click={() => this.edit(data)}
            >
              编辑
            </el-button>
            <el-button
              plain
              size="mini"
              style="font-size: 12px;"
              type="primary"
              on-click={() => this.append(data)}
            >
              添加
            </el-button>
            <el-button
              style="font-size: 12px;"
              plain
              size="mini"
              type="danger"
              on-click={() => this.remove(node, data)}
            >
              删除
            </el-button>
          </span>
        </span>
      )
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
