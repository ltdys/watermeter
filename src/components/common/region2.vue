<!-- 根据当前登录的用户，查询最多层级。从组织到区域 -->
<template>
  <div class="region2-components">
    <el-tree
      ref="tree"
      class="filter-tree"
      :data="resultTreeData"
      :props="defaultProps"
      :default-expand-all="true"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script>
import { list_mixins } from '@/mixins'
import { findParentCompany, findCompany, findDistrict } from '@/service/api'
import { orgTreeData, treeDataUtil, treeDataTest } from '@/utils/publicUtil'
export default {
  mixins: [list_mixins],
  data () {
    return {
      tableDataFj: [],
      tableData: [],
      treeData: [],
      companyTreeData: [],
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'companyName'
      },
      resultTreeData: []
    }
  },

  created () {
    this.findCompany()
  },
  methods: {
    handleNodeClick (data) {
      this.$emit('handleNodeClick', data)
    },
    async findCompany (key) { // 获取组织机构
      const self = this
      let params = {
        userId: this.userId,
        currentPage: 1,
        pageSize: 10000
      }
      let resData = await findCompany(params)
      if (resData.status === 200 && resData.data.data !== null) {
        let list = resData.data.data
        list.forEach(item => {
          if (item.id == this.company_id && this.company_id != '') {
            self.$set(item, 'children', [])
          }
        })
        this.companyTreeData = JSON.parse(orgTreeData([...list]))
        this.findDistrict()
      }
    },
    async findDistrict () { // 查询区域
      const self = this;
      let params = {
        companyId: this.company_id
      }
      let res = await findDistrict(params)
      if (res.status === 200 && res.data.data !== null) {
        let list = res.data.data || []
        if (list.length !== 0) {
          list = list.map(item => {
            self.$set(item, 'parentId', item.parentid)
            self.$set(item, 'companyId', item.companyid)
            self.$set(item, 'companyName', item.name)
            return item
          })

          self.$nextTick(() => {
            self.tableDataFj = list
            self.tableData = JSON.parse(treeDataUtil([...list], 'parentId', 'id'))
            self.treeData = self.tableData
            console.log(self.companyTreeData)
            if (this.company_id == '') {
              self.companyTreeData.forEach((item, index) => {
                if (item.children) {
                  item.children.forEach((item1, index1) => {
                    item1.children = []
                    self.treeData.forEach((item2, index2) => {
                      if (item1.id === item2.companyid) {
                        item1.children.push(item2)
                      }
                    })
                  })
                }
              })
            } else {
              self.companyTreeData.forEach((item, index) => {
                self.treeData.forEach((item2, index2) => {
                  console.log(item, item2)
                  if (item.id === item2.companyid) {
                    // item.children = []
                    item.children.push(item2)
                  }
                })
              })
            }
            self.resultTreeData = self.companyTreeData
          })
        } else {
          self.tableDataFj = list
          self.treeData = list
          self.treeData = self.tableData
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .region2-components {
    width: 100%;
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
