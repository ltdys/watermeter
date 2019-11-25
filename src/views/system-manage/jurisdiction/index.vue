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
    <el-col :span="18">
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
          prop="name"
          :label="$t('systemManageJurisdiction.tableA')"
          width="120"
        />
        <el-table-column
          prop="account"
          :label="$t('systemManageJurisdiction.tableB')"
        />
        <el-table-column
          prop="role"
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
    <el-col :span="6" :style="{height: (tableHeightPage + 52) + 'px', background: '#E9E9E9'}">
      <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
        <div class="jur-tree-header cf">
          <div v-if="isJurisdiction" class="fl jur-tree-header_left">
            {{ $t('systemManageJurisdiction.by') }} [{{ currentAcc.name }}] {{ $t('systemManageJurisdiction.assignAuthority') }}
          </div>
          <div v-else class="fl jur-tree-header_left">
            {{ $t('systemManageJurisdiction.roleSelection') }}
          </div>
          <div class="fr jur-tree-header_right" @click="urightSave">
            <el-icon class="el-icon-document" />
          </div>
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
  </el-row>
</template>

<script>
import { getRole, getJurisdiction } from '@/service/system'
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
        label: 'text'
      },
      currentAcc: {}, // 当前点击的账户
      isJurisdiction: false, // 头部显示
      tableData: [], // 角色列表
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getRole()
      this.getJurisdiction()
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
</style>
