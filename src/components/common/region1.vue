<!-- 区域小区楼栋树结构 -->
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
import { findDistrict } from '@/service/api'
import { list_mixins } from '@/mixins'
export default {
  mixins: [list_mixins],
  watch: {
    districtIschage: {
      handler: function () {
        this.findDistrict()
      },
      deep: true
    }
  },
   computed: {
    districtIschage () {
      return this.$store.state.user.districtIschage
    }
  },
  data () {
    return {
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
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
    this.findDistrict()
  },
  methods: {
    async findDistrict () {
      let params = {
        companyId: ""
      }
      let resData = await findDistrict(params)
      if (resData.status === 200) {
        this.treeData = resData.data.data
        console.log("this.treeData", JSON.stringify(this.treeData))
      }
    },
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
