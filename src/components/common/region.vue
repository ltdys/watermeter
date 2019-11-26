<template>
  <div class="region-components">
    <div class="region-components_title">
      <div class="name">组织机构</div>
      <i class="el-icon-refresh-right" />
    </div>
    <el-tree
      ref="tree"
      class="filter-tree"
      :data="treeData"
      :props="defaultProps"
      :default-expand-all="true"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script>
import { findCompany } from '@/service/api'
import { orgTreeData } from '@/utils/publicUtil'
import { list_mixins } from '@/mixins'
export default {
  mixins: [list_mixins],
  data () {
    return {
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'companyName'
      },
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      }
    }
  },
  created () {
    this.findCompany()
  },
  methods: {
    handleNodeClick (data) {
      console.log('data', data)
      this.$emit('handleNodeClick', data)
    },
    async findCompany () { // 获取组织机构
      let params = {
        userId: this.userId,
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize
      }
      let resData = await findCompany(params)
      console.log('获取组织机构', resData)
      if (resData.status === 200 && resData.data.code === 0 && resData.data.data !== null) {
        this.treeData = JSON.parse(orgTreeData(resData.data.data))
      }
    }
  }
}
</script>

<style lang="scss">
  .region-components {
    height: 100%;
    &_title{
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 38px;
      padding: 0 20px;
      font-weight: bold;
      box-sizing: border-box;
      background: #E6EDF8;
    }
    .filter-tree{
      height: 100%;
    }
  }
</style>
