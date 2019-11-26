<template>
  <div class="region-components">
    <el-tree
      class="filter-tree"
      :data="treeData"
      :props="defaultProps"
      :default-expand-all="true"
      ref="tree"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script>
import { findCompany } from '@/service/api'
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
  async findCompany () {
    let params = {
      userId: this.userId,
      currentPage: this.pageObj.currentPage,
      pageSize: this.pageObj.pageSize
    }
    let resData = await findCompany(params)
    if (resData.status === 200 && resData.data.code === 0 && resData.data.data !== null) {
      this.treeData = resData.data.data
    }
  },
  methods: {
    handleNodeClick (data) {
      this.$emit('handleNodeClick', data)
    }
  }
}
</script>

<style lang="scss">
  .region-components {
  }
</style>
