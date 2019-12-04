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
      :render-content="renderContent"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script>
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
  created () {

  },
  methods: {
    handleNodeClick (data) {
      console.log('data', data)
      this.$emit('handleNodeClick', data)
    },
    renderContent (h, { node, data, store }) {
      return (
        <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;width: 80%;'>
          <span style='white-space: nowrap;overflow: hidden;text-overflow: ellipsis;'>
            <span title={node.label}>{node.label}</span>
          </span>
        </span>);
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
      .el-tree-node__label{
        font-size: 14px;
        color: #606266;
      }
    }
  }
</style>
