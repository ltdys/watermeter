<template>
  <div class="user-manage">
    <!-- <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
      <el-form-item label="所属分厂">
        <el-input v-model="search.t1" placeholder="请输入所属分厂" clearable />
      </el-form-item>
      <el-form-item label="权限级别">
        <el-input v-model="search.t2" placeholder="请输入权限级别" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini">添加</el-button>
      </el-form-item>
    </el-form> -->
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%"
      size="mini"
      :height="tableHeightPage + 50"
      highlight-current-row
    >
      <el-table-column
        type="index"
        width="50"
        label="#"
      />
      <el-table-column
        prop="applyId"
        :label="$t('meterReadingRecord.tableA')"
        width="300"
      />
      <el-table-column
        prop="meterNum"
        :label="$t('meterReadingRecord.tableB')"
        width="300"
      />
      <el-table-column
        prop="concentratorBlockAddress"
        :label="$t('meterReadingRecord.tableC')"
        width="300"
      />
      <el-table-column
        prop="nodeBlockAddress"
        :label="$t('meterReadingRecord.tableD')"
        width="300"
      />
      <el-table-column
        prop="meterBlockAddress"
        :label="$t('meterReadingRecord.tableE')"
        width="300"
      />
      <el-table-column
        prop="controlDesc"
        :label="$t('meterReadingRecord.tableF')"
      />
      <el-table-column
        prop="controlType"
        :label="$t('meterReadingRecord.tableG')"
      />
      <el-table-column
        :label="$t('meterReadingRecord.tableH')"
        width="300"
      >
        <template slot-scope="scope">
          {{ scope.row.applyTime | fFormatDate }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('meterReadingRecord.tableI')"
        width="300"
      >
        <template slot-scope="scope">
          {{ scope.row.controlTime | fFormatDate }}
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
  </div>
</template>

<script>
import { getRecord } from '@/service/reading'
import { findInstructLog } from '@/service/api'
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
export default {
  name: 'record',

  components: {
    myPagination
  },

  mixins: [list_mixins],

  data () {
    return {
      tableData: [],
      search: {
        t1: '',
        t2: ''
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
    async findInstructLog () {
      const params = {
        userId: this.userId,
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize
      }
      let res = await findInstructLog(params)
      console.log('res', res)
      this.tableData = res.data.data
      this.pageObj.allTotal = res.data.page.totalRow
      console.log("======", this.tableData)
    },
    async getRecord () {
      const params = {
        rows: this.pageObj.pageSize,
        page: this.pageObj.currentPage
      }
      let res = await getRecord(params)
      this.tableData = res.data.data
      this.pageObj.allTotal = res.data.allTotal
      console.log("======", this.tableData)
    },
    init () {
      // this.getRecord()
      this.findInstructLog()
    },
    searchSubmit () {

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
