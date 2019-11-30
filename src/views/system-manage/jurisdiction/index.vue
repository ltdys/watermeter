<template>
  <el-row>
    <el-col :span="24">
      <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
        <el-form-item :label="$t('systemManageJurisdiction.toolbarA')" prop="account">
          <el-input v-model="search.account" :placeholder="$t('systemManageJurisdiction.toolbarA_')" clearable />
        </el-form-item>
        <el-form-item :label="$t('systemManageJurisdiction.toolbarB')" prop="name">
          <el-input v-model="search.name" :placeholder="$t('systemManageJurisdiction.toolbarB_')" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchClick">{{ $t('common.query') }}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="12">
      <el-table
        v-myScroll:table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        :size="TABLE_SIZE"
        :height="tableHeightPage"
        highlight-current-row
        @row-click="accreditClick"
      >
        <el-table-column
          type="index"
          width="50"
          label="#"
        />
        <el-table-column
          prop="username"
          :label="$t('systemManageJurisdiction.tableA')"
          width="120"
        />
        <el-table-column
          prop="username"
          :label="$t('systemManageJurisdiction.tableB')"
        />
        <el-table-column
          prop="rolename"
          :label="$t('systemManageJurisdiction.tableC')"
        />
      </el-table>
      <my-pagination
        :all-total="pageObj.allTotal"
        :current-page="pageObj.currentPage"
        :page-size="pageObj.pageSize"
        :page-sizes="pageObj.pageSizes"
        @pageChange="pageChange"
        @currentChange="currentChange"
      />
    </el-col>
    <el-col :span="6" :style="{height: (tableHeightPage + 52) + 'px', background: '#E9E9E9', overflow: 'hidden'}">
      <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
        <div class="jur-tree-header cf">
          <div v-if="isJurisdiction" class="fl jur-tree-header_left">
            {{ $t('systemManageJurisdiction.by') }} [{{ currentAcc.username }}] {{ $t('systemManageJurisdiction.assignAuthority') }}
          </div>
          <div v-else class="fl jur-tree-header_left">
            {{ $t('systemManageJurisdiction.roleSelection') }}
          </div>
          <!-- <div class="fr jur-tree-header_right" @click="urightSave">
              <el-icon class="el-icon-document" />
            </div> -->
        </div>
        <el-tree
          ref="jurisdiction"
          :data="treeData"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-expanded-keys="unfoldList"
          :default-checked-keys="checkList"
          :props="defaultProps"
        />
      </el-scrollbar>
    </el-col>
    <el-col :span="6" :style="{height: (tableHeightPage + 52) + 'px', background: '#E9E9E9'}" class="right_col">
      <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
        <div class="jur-tree-header cf">
          <div class="fl jur-tree-header_left">
            请为用户受理操作权限
          </div>
          <div class="fr jur-tree-header_right" @click="urightSave">
            <el-icon class="el-icon-document" />
          </div>
        </div>
        <div class="slqx">
          <el-checkbox-group v-model="sqCheckList">
            <el-checkbox label="浏览" />
            <el-checkbox label="维护" />
          </el-checkbox-group>
        </div>
      </el-scrollbar>
    </el-col>
  </el-row>
</template>

<script>
import { getRole, getJurisdiction } from '@/service/system'
import { getUserDetailed, getUserResource } from '@/service/api'
import { wealthTreeData } from '@/utils/publicUtil'
import myPagination from "@/components/pagination/my-pagination";
// import { treeData } from '@/utils/publicUtil'
import { list_mixins } from '@/mixins'
export default {
  name: 'jurisdiction',
  components: {
    myPagination
  },
  mixins: [list_mixins],
  data () {
    return {
      sqCheckList: [],
      search: {
        account: '', // 账号
        name: '' // 姓名
      },
      jurisdiction: [], // 权限列表
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      },
      treeData: [], // tree列表
      checkList: [], // 选中列表
      keyList: [], // 默认的id数组
      unfoldList: [], // 展开的数组
      defaultProps: {
        children: 'children',
        label: 'resName'
      },
      currentAcc: {}, // 当前点击的账户
      isJurisdiction: false, // 头部显示
      tableData: [] // 角色列表
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      // this.getRole()
      // this.getJurisdiction()
      this.getUserDetailed()
      this.getUserResource()
    },
    async getUserDetailed () { // 获取用户列表
      let params = {
        userId: this.userId,
        companyName: this.search.account,
        roleName: this.search.name
      }
      let resData = await getUserDetailed(params)
      if (resData.status === 200 && resData.data.code === 1) {
        this.tableData = resData.data.data
      }
    },
    async getUserResource () { // 获取菜单资源
      const self = this;
      const param = {
        // userId: self.search.id
        userId: self.userId
      }
      const resData = await getUserResource(param)
      console.log('获取菜单资源', resData)
      if (resData.status === 200) {
        const list = resData.data.data
        if (list.length !== 0) {
          self.treeData = JSON.parse(wealthTreeData(list))
        }
        // self.tableList = list
      } else {
        self.$message.warning(resData.data.message)
      }
    },
    async getRole () {
      const params = {
        rows: this.pageObj.pageSize,
        page: this.pageObj.currentPage
      }
      let res = await getRole(params)
      this.tableData = res.data.data
      this.pageObj.allTotal = res.data.allTotal
    },
    async getJurisdiction () {
      let res = await getJurisdiction()
      this.treeData = res.data.data
    },
    pageChange (data) { // 每页条数切换回调事件
      this.pageObj.pageSize = data;
      this.init()
    },
    currentChange (data) { // 当前页切换事件
      this.pageObj.currentPage = data;
      this.init()
    },
    searchClick () {

    },
    accreditClick (row, column, event) {
      this.isJurisdiction = true
      this.currentAcc = row
      this.checkList = []
      this.checkList = row.account === '123456' ? [5] : [3]
    },
    urightSave () {
      this.$message.success(this.$t('systemManageJurisdiction.tip'))
    }
  }
}
</script>
<style lang="scss">
  .jur-tree-header{
    height: 37px;
    // background-color: #E6EDF8;
    line-height: 37px;
    padding:0 10px;
    color: #000;
    font-size: 14px;
    font-weight: 700;
    top: 0;
    left: 0;
  }
  .right_col{
    border-left: 1px solid #EBEEF5;
    .slqx{
      padding: 20px;
      box-sizing: border-box;
      .el-checkbox{
        display: block;
        .el-checkbox__input.is-checked + .el-checkbox__label{
          color: #0084FF;
        }
      }
    }
  }
  .scrollbar-page{
    .el-scrollbar__view{
      height: 100%;
      .el-tree, .slqx{
        height: calc(100% - 37px);
        background: #FFFFFF;
        overflow: auto;
      }
    }
  }
</style>
