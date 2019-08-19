<template>
  <div class="lin-container">
    <el-tabs :tab-position="tabPosition" style="margin-left: 10px;">
      <el-tab-pane label="基本信息">
        <BaseInfo ref="baseForm" v-bind:Fgoods_id.sync="goods_id" />
      </el-tab-pane>
      <el-tab-pane label="其他信息">
        <OtherInfo ref="baseForm" v-bind:Fgoods_id.sync="goods_id" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BaseInfo from '../../components/BaseGoodsInfo'
import OtherInfo from '../../components/OtherGoodsInfo'

export default {
  name: 'GoodsInfo',
  components: {
    BaseInfo,
    OtherInfo,
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
      goods_id: this.Fgoods_id,
      activeName: '1',
      tabPosition: 'top',
      goodsEditFlag: false,
      checkEditFlag: false,
    }
  },
  created() {
    this.loading = true
    this.loading = false
  },
  // 计算属性设置
  computed: {},
  // 数据变更监听
  watch: {
    Fgoods_id(newvalue) {
      this.goods_id = newvalue
    },
  },
  beforeMount() {},
  mounted() {},
  methods: {
  },
}
</script>

<style scoped lang="scss"></style>
