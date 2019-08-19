<template>
  <div class="lin-container">
    <el-tabs type="border-card" :tab-position="tabPosition" v-model="activeName">
      <el-tab-pane label="品牌信息" name="1">
        <brand/>
      </el-tab-pane>
      <el-tab-pane label="分类信息" name="2">
        <cate/>
      </el-tab-pane>
      <el-tab-pane label="属性信息" name="3">
        <attr/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import brand from '../../components/ShopBrand'
import cate from '../../components/ShopCate'
import attr from '../../components/ShopAttr'

export default {
  name: 'GroupOps',
  components: {
    brand,
    cate,
    attr,
  },
  props: {},
  data() {
    return {
      loading: true,
      tabPosition: 'top',
      activeName: '1',
    }
  },
  created() {
    this.loading = true
    this.loading = false
  },
  // 计算属性设置
  computed: {},
  // 数据变更监听
  watch: {},
  beforeMount() {},
  mounted() {},
  methods: {
  },
}
</script>

<style scoped lang="scss"></style>
