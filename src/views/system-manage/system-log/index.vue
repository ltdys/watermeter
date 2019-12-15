<template>
  <div class="role-manage">
    <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
      <el-form-item :label="$t('systemManageLog.toolbarA')">
        <el-date-picker
          v-model="search.startTime"
          type="datetime"
          :placeholder="$t('systemManageLog.toolbarA_')">
        </el-date-picker>
        <span>-</span>
        <el-date-picker
          v-model="search.endTime"
          type="datetime"
          :placeholder="$t('systemManageLog.toolbarB_')">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSubmit">{{ $t('common.query') }}</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        size="mini"
        :height="tableHeightPage"
        highlight-current-row
      >
        <el-table-column
          type="index"
          width="50"
          label="#"
        />
        <!-- <el-table-column
          prop="menu"
          :label="$t('systemManageLog.tableA')"
          width="180"
        /> -->
        <el-table-column
          prop="operName"
          :label="$t('systemManageLog.tableB')"
          width="180"
        />
        <el-table-column
          label="组织"
        >
          <template slot-scope="scope">
            {{ scope.row.companyId | fCompanyId}}
          </template>
        </el-table-column>
        <el-table-column
          prop="operIp"
          :label="$t('systemManageLog.tableD')"
        />
        <el-table-column
          prop="browser"
          :label="$t('systemManageLog.tableE')"
        />
        <el-table-column
          :label="$t('systemManageLog.tableF')"
        >
          <template slot-scope="scope">
            {{ scope.row.operTime | fFormatDate }}
          </template>
        </el-table-column>
        <el-table-column
          prop="remarks"
          :label="$t('systemManageLog.tableG')"
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
  </div>
</template>

<script>
import { findSysLogInfo } from '@/service/api'
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
import { fFormatDate } from '@/filters/index'
export default {
  name: 'resourceManage',

  components: {
    myPagination
  },

  mixins: [list_mixins],

  data () {
    return {
      tableData: [],
      search: {
        startTime: '',
        endTime: ''
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
    this.init()
  },
  
  methods: {
    async findSysLogInfo () {
      const params = {
        pageSize: this.pageObj.pageSize,
        currentPage: this.pageObj.currentPage,
        startTime: this.search.startTime,
        endTime: this.search.endTime
      }
      let res = await findSysLogInfo(params)
      if(res.status === 200) {
        this.tableData = res.data.data
        this.pageObj.allTotal = res.data.page.totalRow || 0
      }
    },
    init () {
      this.findSysLogInfo()
    },
    searchSubmit () {
      this.search.startTime = fFormatDate(this.search.startTime) || ""
      this.search.endTime = fFormatDate(this.search.endTime) || ""
      this.init()
    },
    handleEdit () {

    },
    handleDelete () {

    },
    pageChange (data) { // 每页条数切换回调事件
      this.pageObj.pageSize = data;
      this.init()
    },
    currentChange (data) { // 当前页切换事件
      this.pageObj.currentPage = data;
      this.init()
    }
  }
}
</script>