<template>
  <div class="region-components">
    <el-tree
      ref="tree"
      class="filter-tree"
      :data="treeData"
      :props="defaultProps"
      :render-content="renderContent"
      :default-expand-all="true"
      :expand-on-click-node="false"
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
        children: 'child',
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
    renderContent (h, { node, data, store }) {
      return (
        <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'>
          <span class='tree_label'>
            <span title={node.label}>{node.label}</span>
          </span>
          <span>
            <span style='font-size: 12px;color: #000;margin-right: 5px;' type='text' on-click={ () => this.edit(data) }>编辑</span>
            <span style='font-size: 12px;color: #000;margin-right: 5px;' type='text' on-click={ () => this.delete(node, data) }>删除</span>
          </span>
        </span>);
    },
    edit (data) {
      this.$emit('handleNodeEdit', data)
      // this.id = data.id
      // this.type = 1
      // this.form.id = data.id
      // this.form.parentId = 0
      // this.form.companyName = data.companyName
      // this.form.areaCode = data.areaCode
      // this.form.areaName = data.areaName
      // this.resourceVisible = true
    },
    delete (node, data) {
      this.$confirm(`此操作将永久删除${data.companyName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('handleNodeDelete', node, data)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleNodeClick (data) {
      console.log('data', data)
      this.$emit('handleNodeClick', data)
    }
  }
}
</script>

<style lang="scss">
  .region-components {
    height: 100%;
    .filter-tree{
      height: 100%;
      .el-tree-node__label{
        font-size: 14px;
        color: #606266;
      }
    }
  }
</style>
