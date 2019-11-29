<!-- 区域小区楼栋树结构 -->
<template>
  <div class="region-components">
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
import { findDistrict, findCompany } from '@/service/api'
import { orgTreeData } from '@/utils/publicUtil'
import { list_mixins } from '@/mixins'
export default {
  mixins: [list_mixins],
  props: {
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      filterText: '',
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
  computed: {
    districtIschage () {
      return this.$store.state.user.districtIschage
    }
  },
  watch: {
    districtIschage: {
      handler: function () {
        this.findCompany()
      },
      deep: true
    }
  },
  created () {
    this.findCompany()
  },
  methods: {
    async findCompany () { // 获取组织机构
      let params = {
        userId: this.userId,
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize
      }
      let resData = await findCompany(params)
      console.log('获取组织机构', resData)
      if (resData.status === 200 && resData.data.data !== null) {
        let list = resData.data.data
        this.treeData = JSON.parse(orgTreeData([...list]))
      }
    },
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
