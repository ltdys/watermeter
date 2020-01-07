<template>
  <div class="meter-reading">
    <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
      <el-form-item :label="$t('dataManageReading.toolbarA')">
        <el-select v-model="search.t1">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            clearable
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="search.t2" clearable />
      </el-form-item>
      <el-form-item :label="$t('dataManageReading.toolbarB')">
        <el-date-picker
          v-model="search.t3"
          type="datetime"
          :placeholder="$t('dataManageReading.toolbarB_')"
        />
      </el-form-item>
      <el-form-item :label="$t('dataManageReading.toolbarC')">
        <el-date-picker
          v-model="search.t4"
          type="datetime"
          :placeholder="$t('dataManageReading.toolbarC_')"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSubmit">{{ $t('common.query') }}</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" size="mini" class="custom-button">{{ $t('dataManageReading.toolbarD') }}</el-button>
      </el-form-item> -->
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
        :label="$t('dataManageReading.tableA')"
        width="300"
      />
      <el-table-column
        prop="village"
        :label="$t('dataManageReading.tableB')"
        width="180"
      />
      <el-table-column
        prop="floor"
        :label="$t('dataManageReading.tableC')"
      />
      <el-table-column
        prop="unit"
        :label="$t('dataManageReading.tableD')"
      />
      <el-table-column
        prop="plateNum"
        :label="$t('dataManageReading.tableE')"
      />
      <el-table-column
        prop="meterType"
        :label="$t('dataManageReading.tableF')"
      />
      <el-table-column
        prop="num"
        :label="$t('dataManageReading.tableG')"
      />
      <el-table-column
        prop="num"
        :label="$t('dataManageReading.tableH')"
      />
      <el-table-column
        prop="num"
        :label="$t('dataManageReading.tableI')"
      />
      <el-table-column
        prop="num"
        :label="$t('dataManageReading.tableJ')"
      />
      <el-table-column
        prop="readingStatus"
        :label="$t('dataManageReading.tableK')"
      />
      <el-table-column
        prop="time"
        :label="$t('dataManageReading.tableL')"
        width="220"
      />
      <el-table-column
        prop="num"
        :label="$t('dataManageReading.tableM')"
      />
      <el-table-column fixed="right" :label="$t('common.operation')" width="120">
        <template slot-scope="scope">
          <i class="el-icon-edit" @click="handleEdit(scope.row)" />
          <i class="el-icon-delete" @click="handleDelete(scope.row)" />
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
import { getMeterReading } from '@/service/dataManage'
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
export default {
  name: 'meterReading',

  components: {
    myPagination
  },

  mixins: [list_mixins],

  data () {
    return {
      tableData: [],
      search: {
        t1: '',
        t2: '',
        t3: '',
        t4: ''
      },
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      },
      options: [{
        value: 0,
        label: '用户编号'
      }, {
        value: 1,
        label: '其它'
      }]
    }
  },

  created () {
    // this.init()
  },

  methods: {
    async getMeterReading () {
      const params = {
        rows: this.pageObj.pageSize,
        page: this.pageObj.currentPage
      }
      let resData = await getMeterReading(params)
      this.tableData = resData.data.data
      if (resData.data.page) {
        this.pageObj.allTotal = resData.data.page.totalRow || 0
      }
    },
    init () {
      this.getMeterReading()
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

<style lang="scss">
  .meter-reading {
    .el-input, .el-select {
      width: 180px !important;
    }
  }
</style>
