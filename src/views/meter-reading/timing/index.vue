<template>
  <div class="user-manage">
    <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
      <el-form-item>
        <el-button type="primary" size="mini" class="custom-button" @click="addTiming">{{ $t('meterReadingTiming.toolbarA') }}</el-button>
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
        <el-table-column
          prop="id"
          :label="$t('meterReadingTiming.tableA')"
          width="220"
        />
        <el-table-column
          prop="name"
          :label="$t('meterReadingTiming.tableB')"
          width="180"
        />
        <el-table-column
          prop="concentratorAddress"
          :label="$t('meterReadingTiming.tableC')"
        />
        <el-table-column
          prop="collectorAddress"
          :label="$t('meterReadingTiming.tableD')"
        />
        <el-table-column
          prop="tableAddress"
          :label="$t('meterReadingTiming.tableE')"
        />
        <el-table-column
          prop="operationType"
          :label="$t('meterReadingTiming.tableF')"
        />
        <el-table-column
          prop="interval"
          :label="$t('meterReadingTiming.tableG')"
        />
        <el-table-column
          prop="timeTpe"
          :label="$t('meterReadingTiming.tableH')"
        />
        <el-table-column
          prop="beginTime"
          :label="$t('meterReadingTiming.tableI')"
        />
        <el-table-column fixed="right" :label="$t('common.operation')" width="120">
          <template slot-scope="scope">
            <i class="el-icon-edit" @click="handleEdit(scope.row)"></i>
            <i class="el-icon-delete" @click="handleDelete(scope.row)"></i>
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

      <el-dialog :title="$t('meterReadingTiming.dialogTitle')" :visible.sync="addVisible" @close="close">
        <my-edit @close="close" />
      </el-dialog>
  </div>
</template>

<script>
import { getReading } from '@/service/reading'
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
import myEdit from './edit'
export default {
  name: 'timing',

  components: {
    myPagination, myEdit
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
      },
      addVisible: false
    }
  },

  created () {
    this.init()
  },
  
  methods: {
    async getReading () {
      const params = {
        rows: this.pageObj.pageSize,
        page: this.pageObj.currentPage
      }
      let res = await getReading(params)
      this.tableData = res.data.data
      this.pageObj.allTotal = res.data.allTotal
    },
    init () {
      this.getReading()
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
    },
    close () {
      this.addVisible = false
    },
    addTiming () {
      this.addVisible = true
    }
  }
}
</script>