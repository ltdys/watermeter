<!-- 根据当前登录的用户，查询最多层级。点击再查询数据 -->
<template>
  <div class="region3-components">
    <el-tree
      :props="props"
      :load="loadNode"
      @node-click="handleNodeClick"
      lazy>
    </el-tree>
  </div>
</template>

<script>
import { findParentCompany, findChildCompany, findDistrict, findChildDistrict } from "@/service/api"
import { list_mixins } from '@/mixins'
export default {
  mixins: [list_mixins],
  data() {
    return {
      props: {
        label: 'companyName'
      },
      defaultAreasid: ""
    }
  },
  methods: {
    loadNode (node, resolve) {
      if (node.level === 0) {
        this.findParentCompany(resolve)
      } else if (node.level === 1) {
        this.findChildCompany(node, resolve)
      } else if(node.level === 2) {
        this.findDistrict(node, resolve)
      } else {
        this.findChildDistrict(node, resolve)
      }
    },
    // 查询一级组织
    async findParentCompany(resolve) {
      let params = {
        userId: this.userId
      }
      let resData = await findParentCompany(params)
      if (resData.status === 200 && resData.data.data) {
        resolve(resData.data.data)
      } else {
        resolve([])
      }
    },
    // 查询二级组织
    async findChildCompany(node, resolve) {
      let params = {
        currentPage: 1,
        pageSize: 10000,
        company: {
          parentId: node.data.id
        }
      }
      let resData = await findChildCompany(params)
      if (resData.status === 200 && resData.data.data) {
        if (resData.data.data.length === 0) {
          this.findDistrict(node, resolve)
        } else {
          resolve(resData.data.data)
        }
      } else {
        resolve([])
      }
    },
    // 根据组织查询区域
    async findDistrict(node, resolve) {
      let params = {
        companyId: node.data.id
      }
      let resData = await findDistrict(params)
      if (resData.status === 200 && resData.data.data) {
        let temp = resData.data.data
        if(temp.length === 0) {
          this.findChildDistrict(node, resolve)
        } else {
          temp = temp.filter(item => item.parentid == 0 )
          temp.forEach((item, index) => {
            item.companyName = item.name
          })
          resolve(temp)
        }
      } else {
        resolve([])
      }
    },
    //区域查询子区域
    async findChildDistrict(node, resolve) {
      let params = {
        districtId: node.data.id
      }
      let resData = await findChildDistrict(params)
      if(resData.status === 200 && resData.data.data) {
        let temp = resData.data.data
        temp.forEach((item, index) => {
          item.companyName = item.name
        })
        resolve(temp)
      } else {
        resolve([])
      }
    },
    handleNodeClick (data) {
      this.$emit('handleNodeClick', data)
    }
  }
}
</script>

<style lang="scss">
  .region3-components {
    width: 100%;
    height: 100%;
  }
</style>