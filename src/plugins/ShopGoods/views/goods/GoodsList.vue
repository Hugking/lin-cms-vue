<template>
  <!-- 列表页面 -->
  <div class="tableSample">
    <div class="header">
      <div class="header-left"><p class="title">产品列表</p></div>
      <div class="header-right">
        <lin-search @query="onQueryChange" placeholder="请输入产品名称" />
        <div style="margin-left:30px">
          <el-button
            type="primary"
            @click="dialogTableVisible = !dialogTableVisible"
          >
            列操作
          </el-button>
        </div>
      </div>
    </div>
    <div class="table-main">
      <el-dialog top="5vh" width="60%" :visible.sync="dialogTableVisible">
        <!-- 定制列 -->
        <span>选择要展示的列:</span>
        <el-checkbox-group
          v-model="checkList"
          @change="handleChange"
          class="m-20"
        >
          <el-checkbox
            :disabled="item === '产品名称' || item === '产品价格'"
            :label="item"
            v-for="item in tempCheckList"
            :key="item"
          />
        </el-checkbox-group>
        <!-- 固定列 -->
        <span>选择固定在左侧的列:</span>
        <el-checkbox-group v-model="fixedLeftList" class="m-20">
          <el-checkbox
            :disabled="
              fixedRightList.indexOf(item) > -1 ||
                checkList.indexOf(item) === -1
            "
            :label="item"
            v-for="item in tempCheckList"
            :key="item"
          />
        </el-checkbox-group>
        <span>选择固定在右侧的列:</span>
        <el-checkbox-group v-model="fixedRightList" class="m-20">
          <el-checkbox
            :disabled="
              fixedLeftList.indexOf(item) > -1 || checkList.indexOf(item) === -1
            "
            :label="item"
            v-for="item in tempCheckList"
            :key="item"
          />
        </el-checkbox-group>
      </el-dialog>
      <el-table
        :data="tableData"
        v-loading="loading"
        id="out-table'"
      >
        <!-- 展示摘要 -->
        <!--        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="summary">
              <img :src="props.row.primary_img_url" alt />
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="产品品牌">
                  <span>{{ props.row.brand_id }}</span>
                </el-form-item>
                <el-form-item label="产品名称">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="产品单价">
                  <span>{{ props.row.unit_price }}</span>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-table-column> -->
        <!-- 开始循环 -->
        <template v-for="item in filterTableColumn">
          <!-- 自定义排序 -->
          <el-table-column
            label="权重"
            v-if="item.label === '权重'"
            v-bind:key="item.label"
          >
            <template slot-scope="props">
              <input
                type="number"
                class="sort-input"
                v-model="props.row.sort_order"
                @blur="handleSort(props.row.sort_order, props.row)"
              />
            </template>
          </el-table-column>
          <!-- 正常表单列 -->
          <el-table-column
            v-bind:key="item.label"
            v-if="!item.noRepeat"
            :prop="item.prop"
            :label="item.label"
            :show-overflow-tooltip="true"
            :fixed="item.fixed ? item.fixed : false"
            :width="item.width ? item.width : ''"
          ></el-table-column>
          <!-- 排序 库存 -->
          <el-table-column
            label="产品库存"
            :prop="item.prop"
            sortable
            v-bind:key="item.label"
            :fixed="item.fixed ? item.fixed : false"
            :width="item.width ? item.width : ''"
            v-if="item.label === '产品库存'"
          ></el-table-column>
          <!-- <el-table-column
            label="产品序号"
            :prop="item.prop"
            sortable
            v-bind:key="item.label"
            :fixed="item.fixed ? item.fixed : false"
            :width="item.width ? item.width : ''"
            v-if="item.label === '产品序号'"
          ></el-table-column> -->
          <el-table-column
            label="产品品牌"
            :prop="item.prop"
            sortable
            v-bind:key="item.label"
            :fixed="item.fixed ? item.fixed : false"
            :width="item.width ? item.width : ''"
            v-if="item.label === '产品品牌'"
          ></el-table-column>
          <!-- 单元格编辑 -->
          <el-table-column
            v-bind:key="item.label"
            label="产品简介"
            prop="goods_brief"
            :width="item.width"
            show-overflow-tooltip
            v-if="item.label === '产品简介'"
          >
            <template slot-scope="props">
              <div v-if="!props.row.editFlag" class="table-edit">
                <div @click="handleEdit(props.row)" class="content">
                  {{ props.row.goods_brief }}
                </div>
                <div class="cell-icon" @click="handleCellEdit(props.row)">
                  <i class="el-icon-edit"></i>
                </div>
              </div>
              <div v-else class="table-edit">
                <el-input
                  v-model="props.row.goods_brief"
                  placeholder
                ></el-input>
                <div class="cell-icon-edit">
                  <div class="cell-save" @click="handleCellSave(props.row)">
                    <i class="el-icon-check"></i>
                  </div>
                  <div class="cell-cancel" @click="handleCellCancel(props.row)">
                    <i class="el-icon-close"></i>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column
            v-bind:key="item.label"
            label="促销描述"
            prop="promotion_desc"
            :width="item.width"
            show-overflow-tooltip
            v-if="item.label === '促销描述'"
          >
            <template slot-scope="props">
              <div v-if="!props.row.editFlag" class="table-edit">
                <div @click="handleEdit(props.row)" class="content">
                  {{ props.row.promotion_desc }}
                </div>
                <div class="cell-icon" @click="handleCellEdit(props.row)">
                  <i class="el-icon-edit"></i>
                </div>
              </div>
              <div v-else class="table-edit">
                <el-input
                  v-model="props.row.promotion_desc"
                  placeholder
                ></el-input>
                <div class="cell-icon-edit">
                  <div class="cell-save" @click="handleCellSave(props.row)">
                    <i class="el-icon-check"></i>
                  </div>
                  <div class="cell-cancel" @click="handleCellCancel(props.row)">
                    <i class="el-icon-close"></i>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column
            v-bind:key="item.label"
            label="促销标签"
            prop="promtion_tag"
            :width="item.width"
            show-overflow-tooltip
            v-if="item.label === '促销标签'"
          >
            <template slot-scope="props">
              <div v-if="!props.row.editFlag" class="table-edit">
                <div @click="handleEdit(props.row)" class="content">
                  {{ props.row.promtion_tag }}
                </div>
                <div class="cell-icon" @click="handleCellEdit(props.row)">
                  <i class="el-icon-edit"></i>
                </div>
              </div>
              <div v-else class="table-edit">
                <el-input
                  v-model="props.row.promtion_tag"
                  placeholder
                ></el-input>
                <div class="cell-icon-edit">
                  <div class="cell-save" @click="handleCellSave(props.row)">
                    <i class="el-icon-check"></i>
                  </div>
                  <div class="cell-cancel" @click="handleCellCancel(props.row)">
                    <i class="el-icon-close"></i>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column> -->
          <!-- 开关 -->
          <el-table-column
            label="热门"
            v-if="item.label === '热门'"
            v-bind:key="item.label"
          >
            <template slot-scope="props">
              <el-switch
                v-model="props.row.is_hot"
                active-color="#3963bc"
                @change="handleRecommend($event, props.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="促销"
            v-if="item.label === '促销'"
            v-bind:key="item.label"
          >
            <template slot-scope="props">
              <el-switch
                v-model="props.row.is_on_sale"
                active-color="#3963bc"
                @change="handleRecommend($event, props.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="新品"
            v-if="item.label === '新品'"
            v-bind:key="item.label"
          >
            <template slot-scope="props">
              <el-switch
                v-model="props.row.is_new"
                active-color="#3963bc"
                @change="handleRecommend($event, props.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="限购"
            v-if="item.label === '限购'"
            v-bind:key="item.label"
          >
            <template slot-scope="props">
              <el-switch
                v-model="props.row.is_limited"
                active-color="#3963bc"
                @change="handleRecommend($event, props.row)"
              ></el-switch>
            </template>
          </el-table-column>
        </template>
        <!-- 操作列 -->
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

      <!-- 分页 -->
      <div class="pagination" v-if="!searchKeyword">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :background="true"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageCount"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total_nums"
        ></el-pagination>
      </div>
      <el-dialog title="编辑品牌" :visible.sync="dialogForm">
        <goods-info :Fgoods_id.sync='goods_id'></goods-info>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import LinSearch from '@/components/base/search/lin-search'
import goods from '../../models/goods'
import GoodsInfo from './GoodsInfo'
import { tableColumn } from './data'

export default {
  components: {
    LinSearch,
    'goods-info': GoodsInfo,
  },
  data() {
    return {
      goods_id: '',
      dialogForm: false,
      tableData: [],
      loading: false,
      Hidden: true, // 默认隐藏自定义排序列
      searchKeyword: '',
      // 定制列相关
      checkList: [],
      filterTableColumn: [],
      // 分页相关
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      total_nums: 1, // 分组内的总数
      // 固定列相关
      dialogTableVisible: false,
      fixedLeftList: [],
      fixedRightList: [],
      value: '',
      // 单元格编辑相关
      editRow: 0,
      showTooltip: true,
    }
  },
  computed: {},
  created() {
    // 获取数据
    this._getTableData()
    this._getCount()
    this.tableColumn = tableColumn
    // 操作栏
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      { name: '删除', func: 'handleDelete', type: 'danger' },
    ]
    // 定制列
    this.tempCheckList = tableColumn.map(v => v.label).slice()
    this.checkList = tableColumn.map(v => v.label)
    this.filterTableColumn = tableColumn.filter(
      v => this.checkList.indexOf(v.label) > -1,
    )
  },
  methods: {
    // 获取数据
    async _getTableData() {
      const form = {
        page: this.currentPage ? this.currentPage : '1',
        size: this.pageCount ? this.pageCount : '10',
      }
      const goodss = await goods.getGoodss(form)
      if (goodss.data.goods) {
        const res = goodss.data.goods
        res.map((item) => {
          const temp = item
          temp.editFlag = false
          return ''
        })
        this.tableData = [...res]
        // // console.log(this.tableData)
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

    // 获取总数
    async _getCount() {
      const count = await goods.getCount()
      if (count) {
        const res = count.data.count
        this.total_nums = res
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'error',
            message: count.msg,
          })
        }, 1000)
      }
    },

    // 定制列
    handleChange() {
      this.filterTableColumn = tableColumn.filter(
        v => this.checkList.indexOf(v.label) > -1,
      )
    },
    showRowOperateModal() {},

    // 变更排序
    handleSort(val, rowData) {
      console.log('rowData', rowData)
      this.$message({
        type: 'success',
        message: `权重已更改为：${val}`,
      })
    },

    // 开关
    handleRecommend(val, rowData) {
      this.loading = true
      // // console.log(val, rowData)
      this._doupdate(rowData)
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

    // 更新行
    async _doupdate(row) {
      this.loading = true
      const goodss = await goods.editGoods(row.id, row)
      if (goodss.data.goods) {
        const res = goodss.data.goods
        // console.log('更新goodss', res)
        return res
      }
      setTimeout(() => {
        this.loading = false
        this.$message.error(goods.msg)
      }, 1000)
      return ''
    },

    // 单元格编辑
    handleCellEdit(row) {
      row.editFlag = true // eslint-disable-line
      this.$set(this.filterTableColumn[7], 'width', 200)
      this.tempEditRemark = row.goods_brief
      this.editRow++
    },
    async handleCellSave(row) {
      row.editFlag = false // eslint-disable-line
      const goodss = await goods.editGoods(row.id, row)
      if (goodss) {
        setTimeout(() => {
          this.editRow--
          this.$message({
            type: 'success',
            message: goodss.msg,
          })
        }, 1000)
      } else {
        setTimeout(() => {
          this.editRow--
          this.$message({
            type: 'error',
            message: goodss.msg,
          })
        }, 1000)
      }
    },
    handleCellCancel(row) {
      row.editFlag = false // eslint-disable-line
      // console.log(this.tempEditRemark)
      row.goods_brief = this.tempEditRemark // eslint-disable-line
      this.editRow--
    },

    // 切换分页
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      setTimeout(() => {
        this._getTableData()
        this.loading = false
      }, 1000)
    },

    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pageCount = val
      setTimeout(() => {
        this._getTableData()
        this.loading = false
      }, 1000)
    },

    // 操作列
    buttonMethods(func, index, row) {
      const self = this
      const { methods } = this.$options
      methods[func](self, index, row)
    },
    handleEdit(self, index, row) {
      self.goods_id = row.id.toString() // eslint-disable-line
      self.dialogForm = true // eslint-disable-line
      // console.log(index, row.id)
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
            await goods.delectGoods(self.tableData[index].id)
            self.tableData.splice(index, 1)
            self.loading = false // eslint-disable-line
          }, 1000)
        })
    },

    // 搜索
    onQueryChange(query) {
      this.searchKeyword = query.trim()
      if (!query) {
        this._getTableData()
        return
      }
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this._getSearch(this.searchKeyword)
      }, 1000)
    },

    // 搜索promise
    async _getSearch(keywords) {
      const pamars = { name: keywords, page: 1, size: 100 }
      const goodss = await goods.searchGoods(pamars)
      if (goodss) {
        const res = goodss.data.goods
        res.map((item) => {
          const temp = item
          temp.editFlag = false
          return ''
        })
        this.tableData = [...res]
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '系统繁忙，请稍后重试',
          })
        }, 1000)
      }
    },
  },

  watch: {
    // 监听固定列变化
    fixedLeftList() {
      this.filterTableColumn.map((item, index) => {
        if (this.fixedLeftList.indexOf(item.label) > -1) {
          this.$set(this.filterTableColumn[index], 'fixed', 'left')
        } else if (this.fixedRightList.indexOf(item.label) === -1) {
          this.$set(this.filterTableColumn[index], 'fixed', false)
        }
        return ''
      })
      // console.log(this.filterTableColumn)
    },
    fixedRightList() {
      this.filterTableColumn.map((item, index) => {
        if (this.fixedRightList.indexOf(item.label) > -1) {
          this.$set(this.filterTableColumn[index], 'fixed', 'right')
        } else if (this.fixedLeftList.indexOf(item.label) === -1) {
          this.$set(this.filterTableColumn[index], 'fixed', false)
        }
        return ''
      })
      // console.log(this.filterTableColumn)
    },
    editRow() {
      if (this.filterTableColumn[7]) {
        this.editRow === 0 // eslint-disable-line
          ? this.$set(this.filterTableColumn[7], 'width', 200) // eslint-disable-line
          : null // eslint-disable-line
      }
      return ''
    },
    dialogForm(val) {
      if (!val) {
        this.goods_id = ''
        this._getTableData()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.tableSample {
  padding: 0 0 30px;

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

  .top-operate {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    margin-top: 30px;
  }

  .sort-input {
    width: 50px;
    background: none;
    justify-content: space-around;
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

  .m-20 {
    margin-bottom: 10px;
    margin-top: 5px;
  }

  .summary {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;

    img {
      width: 135px;
      height: 200px;
    }

    .demo-table-expand {
      font-size: 0;
      margin-left: 30px;
      display: flex;
      flex-direction: column;

      label {
        width: 90px;
        color: #99a9bf;
      }

      .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        display: flex;
        flex-direction: row;
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
