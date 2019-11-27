<template>
  <div class="region-manage">
    <el-row>
      <el-col :span="24">
        <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
          <el-form-item :label="$t('systemManageRegion.toolbarA')">
            <el-input v-model="search.t1" :placeholder="$t('systemManageRegion.toolbarA_')" clearable />
          </el-form-item>
          <el-form-item :label="$t('systemManageRegion.toolbarB')">
            <el-input v-model="search.t2" :placeholder="$t('systemManageRegion.toolbarB_')" clearable />
          </el-form-item>
          <el-form-item :label="$t('systemManageRegion.toolbarC')">
            <el-input v-model="search.t3" :placeholder="$t('systemManageRegion.toolbarC_')" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSubmit">{{ $t('common.query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button" @click="regionAdd">{{ $t('common.add') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" :style="{height: (tableHeightPage + 52) + 'px', background: '#E9E9E9'}">
        <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
          <my-region :tree-data="treeData" @handleNodeClick="handleNodeClick" />
        </el-scrollbar>
      </el-col>
      <el-col :span="20">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          size="mini"
          :height="tableHeightPage"
          highlight-current-row
          default-expand-all
          row-key="id"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column
            type="index"
            width="50"
            label="#"
          />
          <el-table-column
            prop="companyName"
            :label="$t('systemManageRegion.tableA')"
          />
          <el-table-column
            prop="areaCode"
            :label="$t('systemManageRegion.tableB')"
            width="200"
          />
          <el-table-column
            prop="parentId"
            :label="$t('systemManageRegion.tableC')"
            width="300"
          />
          <el-table-column
            prop="updateBy"
            :label="$t('systemManageRegion.tableD')"
          />
          <el-table-column fixed="right" :label="$t('common.operation')" width="320">
            <template slot-scope="scope">
              <i class="el-icon-edit" @click="handleEdit(scope.row)" />
              <i class="el-icon-delete" @click="handleDelete(scope.row)" />
              <span class="region-manage_operator">{{ $t('systemManageRegion.operationA') }}</span>
              <span class="region-manage_operator">{{ $t('systemManageRegion.operationB') }}</span>
            </template>
          </el-table-column>
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
    </el-row>

    <el-dialog :title="$t('systemManageRegion.dialogTitle')" :visible.sync="regionVisible" width="40%" @close="close">
      <my-edit :options="treeData" @onSubmit="onSubmit" @close="close" />
    </el-dialog>
  </div>
</template>

<script>
import { getRegion } from '@/service/system'
import { orgTreeData } from '@/utils/publicUtil'
import { findCompany, findDistrict, addDistrict, updateDistrict, deleteDistrict } from '@/service/api'
import myRegion from '@/components/common/region'
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
import myEdit from './edit.vue'
export default {

  name: 'regionManage',

  components: {
    myPagination, myRegion, myEdit
  },

  mixins: [list_mixins],

  data () {
    return {
      treeData: [], // 组织机构树状
      tableData: [],
      search: {
        t1: '',
        t2: '',
        t3: ''
      },
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      },
      regionVisible: false
    }
  },

  created () {
    this.init()
  },

  methods: {
    init () {
      // this.getRegion()
      this.findCompany()
    },
    async findCompany () { // 获取组织机构
      let params = {
        userId: this.userId,
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize
      }
      let resData = await findCompany(params)
      console.log('获取组织机构', resData)
      if (resData.status === 200 && resData.data.code === 0 && resData.data.data !== null) {
        this.treeData = JSON.parse(orgTreeData(resData.data.data))
        console.log(this.treeData)
      }
    },
    async getRegion () {
      const params = {
        rows: this.pageObj.pageSize,
        page: this.pageObj.currentPage
      }
      let res = await getRegion(params)
      this.tableData = res.data.data
      this.pageObj.allTotal = res.data.allTotal
    },
    async findDistrict (param) { // 查询区域
      // const self = this;
      let res = await findDistrict(param)
      console.log('查询区域', res)
    },
    async addDistrict () { // 增加区域
      const self = this;
    },
    async updateDistrict () { // 编辑区域

    },
    async deleteDistrict () { // 删除区域

    },
    pageChange (data) { // 每页条数切换回调事件
      this.pageObj.pageSize = data;
      this.init()
    },
    currentChange (data) { // 当前页切换事件
      this.pageObj.currentPage = data;
      this.init()
    },
    searchSubmit () {

    },
    handleEdit () {

    },
    handleDelete () {

    },
    handleNodeClick (data) {
      // this.tableData = []
      // this.tableData.push(data)
      let params = {
        companyId: data.id
      }
      this.findDistrict(params)
      // this.$message.success(`切换${data.companyName}成功`)
    },
    close () {
      this.regionVisible = false
    },
    regionAdd () {
      this.regionVisible = true
    },
    onSubmit (form) {
      console.log('返回', form)
      this.addDistrict(form)
    }
  }
}
</script>

<style lang="scss">
  .region-manage {
    &_add {
      margin: 20px 20px 10px 20px;
    }
    .el-tree-node__label {
      font-size: 16px;
      color: #9EA0A6;
    }
    &_operator {
      text-decoration: underline;
      color: #0084FF;
    }
    .scrollbar-page{
      .el-scrollbar__view{
        height: 100%;
      }
    }
  }
</style>
