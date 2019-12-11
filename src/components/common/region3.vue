<!-- 根据当前登录的用户，查询最多层级。点击再查询数据 -->
<template>
  <div class="region3-components">
    <el-tree
      :props="props"
      :load="loadNode"
      lazy>
    </el-tree>
  </div>
</template>

<script>
import { findParentCompany, findChildCompany, findDistrict } from "@/service/api"
import { list_mixins } from '@/mixins'
export default {
  mixins: [list_mixins],
  data() {
    return {
       props: {
        label: 'companyName'
      }
    }
  },
  methods: {
    loadNode (node, resolve) {
      if (node.level === 0) {
        this.findParentCompany(resolve)
      } else if (node.level === 1) {
        this.findChildCompany(node, resolve)
      } else {
        this.findDistrict(node, resolve)
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
        resolve(resData.data.data)
      } else {
        resolve([])
      }
    },
    // 区域查询
    async findDistrict(node, resolve) {
      let params = {
        companyId: node.data.id
      }
      let resData = await findDistrict(params)
      if (resData.status === 200 && resData.data.data) {
        let temp = resData.data.data
        temp.forEach((item, index) => {
          item.companyName = item.name
        })
        resolve(temp)
      } else {
        resolve([])
      }
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