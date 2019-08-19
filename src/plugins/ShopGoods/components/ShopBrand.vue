<template>
  <el-card class="box-card base-box-card" style="margin-bottom:20px;">
    <div class="header">
      <div class="header-left"><p class="title">品牌信息</p></div>
      <div class="header-right">
        <div style="margin-left:30px;margin-bottom: 5px;">
          <el-button
            type="primary"
            @click="add"
          >
            新建
          </el-button>
        </div>
      </div>
    </div>
    <div class="table-main">
      <el-table :data="tableData" style="width: 100%">
        <!--      <el-table-column
        prop="list_pic_url"
        label="图片列"
        width="120"
      ></el-table-column> -->
        <el-table-column
          fixed
          label="名称"
          prop="name"
          :width="200"
          show-overflow-tooltip
        >
          <template slot-scope="props">
            <div v-if="!props.row.editFlag" class="table-edit">
              <div @click="handleEdit(props.row)" class="content">
                {{ props.row.name }}
              </div>
              <div
                class="cell-icon"
                @click="handleCellEdit(props.row)"
              >
                <i class="el-icon-edit"></i>
              </div>
            </div>
            <div v-else class="table-edit">
              <el-input v-model="props.row.name" placeholder></el-input>
              <div class="cell-icon-edit">
                <div class="cell-save" @click="handleCellSave(props.row)">
                  <i class="el-icon-check"></i>
                </div>
                <div
                  class="cell-cancel"
                  @click="handleCellCancel(props.row)"
                >
                  <i class="el-icon-close"></i>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          label="简介"
          prop="simple_desc"
          :width="200"
          show-overflow-tooltip
        >
          <template slot-scope="props">
            <div v-if="!props.row.editFlag" class="table-edit">
              <div @click="handleEdit(props.row)" class="content">
                {{ props.row.simple_desc }}
              </div>
              <div
                class="cell-icon"
                @click="handleCellEdit(props.row, props.row.simple_desc)"
              >
                <i class="el-icon-edit"></i>
              </div>
            </div>
            <div v-else class="table-edit">
              <el-input v-model="props.row.simple_desc" placeholder></el-input>
              <div class="cell-icon-edit">
                <div class="cell-save" @click="handleCellSave(props.row)">
                  <i class="el-icon-check"></i>
                </div>
                <div
                  class="cell-cancel"
                  @click="handleCellCancel(props.row, props.row.simple_desc)"
                >
                  <i class="el-icon-close"></i>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="300">
          <template slot-scope="props">
            <img
              :src="props.row.pic_url[0].display"
              v-if="props.row.pic_url.length !== 0"
              style="width: 60px;height: 60px;"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="sort_order"
          label="权重"
          width="120"
        ></el-table-column>
        <el-table-column label="展示">
          <template slot-scope="props">
            <el-switch
              v-model="props.row.is_show"
              active-color="#3963bc"
              @change="handleRecommend($event, props.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="新品">
          <template slot-scope="props">
            <el-switch
              v-model="props.row.is_new"
              active-color="#3963bc"
              @change="handleRecommend($event, props.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="floor_price"
          label="最低价"
          width="120"
        ></el-table-column>
        <!-- <el-table-column
        prop="app_list_pic_url"
        label="app图片列表"
        width="120"
      ></el-table-column> -->
        <!-- <el-table-column
        prop="new_pic_url"
        label="新图片"
        width="120"
      ></el-table-column> -->
        <!-- <el-table-column
        prop="new_sort_order"
        label="新权重"
        width="120"
      ></el-table-column> -->
        <el-table-column label="操作" fixed="right" width="170">
          <template slot-scope="scope">
            <el-button
              v-for="(item, index) in operate"
              :type="item.type"
              plain
              size="mini"
              :key="index"
              @click.native.prevent.stop="
                buttonMethods(item.func, scope.$index, scope.row)
              "
            >
              {{ item.name }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="编辑品牌" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules">
        <el-form-item label="品牌名称" :label-width="formLabelWidth" required>
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
          <upload-imgs
            ref="uploadPic"
            :value="form.pic_url"
            :rules="imgRules"
            :max-num="1"
            :multiple="true"
            :sortable="true"
            :fit="fit"
          />
        </el-form-item>
        <el-form-item label="最低价" :label-width="formLabelWidth">
          <el-input v-model="form.floor_price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权重" :label-width="formLabelWidth">
          <el-input v-model="form.sort_order" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input v-model="form.simple_desc" autocomplete="off"></el-input>
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
import UploadImgs from '@/components/base/upload-imgs'
import brand from '../models/brand'

export default {
  name: 'GroupOps',
  components: {
    UploadImgs,
  },
  props: {},
  data() {
    return {
      loading: true,
      tableData: [],
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
            message: '请输入品牌名称',
            trigger: 'blur',
          },
        ],
      },
      form: {
        name: '',
        list_pic_url: [],
        simple_desc: '',
        pic_url: [],
        sort_order: '',
        floor_price: '',
        app_list_pic_url: [],
        new_pic_url: [],
        new_sort_order: '',
      },
    }
  },
  created() {
    this.loading = true
    this._getBrand()
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      { name: '删除', func: 'handleDelete', type: 'danger' },
    ]
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
          list_pic_url: [],
          simple_desc: '',
          pic_url: [],
          sort_order: '',
          floor_price: '',
          app_list_pic_url: [],
          new_pic_url: [],
          new_sort_order: '',
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
      this.form.pic_url = await this.getValue('uploadPic')
      this.dialogFormVisible = false
      if (this.new) {
        this._newBrand(this.form)
        this._getBrand()
      } else {
        this._editBrand(this.form.id, this.form)
      }
    },
    handleRecommend(val, rowData) {
      this.loading = true
      // console.log(val, rowData)
      this._editBrand(rowData.id, rowData)
      if (val) {
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '开启成功',
          })
        }, 1000)
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '关闭成功',
          })
        }, 1000)
      }
    },
    buttonMethods(func, index, row) {
      const self = this
      const { methods } = this.$options
      methods[func](self, index, row)
    },
    handleEdit(self, index, row) {
      self.form = row // eslint-disable-line
      self.dialogFormVisible = true// eslint-disable-line
    },
    handleDelete(self, index) {
      self
        .$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(async () => {
          self.loading = true // eslint-disable-line
          setTimeout(async () => {
            await brand.delectBrand(self.tableData[index].id)
            self.tableData.splice(index, 1)
            self.loading = false // eslint-disable-line
          }, 1000)
        })
    },
    async _getBrand() {
      const form = {
        page: '1',
        size: '100',
      }
      const brands = await brand.getBrands(form)
      if (brands.data.brand) {
        const res = brands.data.brand
        res.map((item) => {
          const temp = item
          temp.pic_url = this.fixImg(temp.pic_url)
          temp.editFlag = false
          return ''
        })
        this.tableData = [...res]
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
    async _newBrand(form) {
      const brands = await brand.addBrand(form)
      if (brands.data.brand) {
        // const res = brands.data.brand
        // console.log(res)
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
    async _editBrand(id, form) {
      const brands = await brand.editBrand(id, form)
      if (brands.data.brand) {
        // const res = brands.data.brand
        // console.log(res)
        this.$message.success(brands.msg)
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
    handleCellEdit(row) {
      row.editFlag = true // eslint-disable-line
      this.editRow++
    },
    async handleCellSave(row) {
      row.editFlag = false // eslint-disable-line
      this._editBrand(row.id, row)
    },
    handleCellCancel(row) {
      row.editFlag = false // eslint-disable-line
      this.editRow--
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
.table-edit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  .content {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cell-icon {
    cursor: pointer;
    color: #3963bc;
    font-size: 16px;
  }

  .cell-icon-edit {
    display: flex;
    margin-left: 20px;
    width: 50px;
    justify-content: space-between;

    .cell-cancel {
      cursor: pointer;
      color: #3963bc;
      font-size: 16px;
    }

    .cell-save {
      cursor: pointer;
      color: #3963bc;
      font-size: 16px;
      margin-right: -20px;
    }
  }
}
</style>
