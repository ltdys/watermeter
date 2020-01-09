<template>
  <div class="meter-reading">
    <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
      <!-- <el-form-item label="筛选条件">
        <el-select v-model="search.t1">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            clearable
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="用户编号">
        <el-input v-model="search.userCode" clearable />
      </el-form-item>
      <el-form-item label="水表编号">
        <el-input v-model="search.waterCode" clearable />
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="search.startTime"
          type="datetime"
          placeholder="请输入开始时间"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="search.endTime"
          type="datetime"
          placeholder="请输入结束时间"
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
        prop="meterUserNum"
        label="用户编号"
        width="100"
      />
      <el-table-column
        prop="meterUserName"
        label="用户名称"
        width="120"
      />
      <el-table-column
        prop="meterUserAddress"
        label="用户地址"
        width="200"
      />
      <el-table-column
        prop="meterNbiotNum"
        label="表编号"
      />
      <el-table-column
        prop="meterNbIotAddress"
        label="表地址"
      />
      <el-table-column
        prop="value"
        label="用量"
      />
      <el-table-column
        prop="meterValue"
        label="当前读数"
      />
      <el-table-column
        label="更新时间"
        width="160"
      >
        <template slot-scope="scope">
          {{ scope.row.readTime | fFormatDate }}
        </template>
      </el-table-column>
      <el-table-column
        prop="meterValuePrev"
        label="上次读数"
      />
      <el-table-column
        prop="readTimePrev"
        label="上次时间"
        width="160"
      >
        <template slot-scope="scope">
          {{ scope.row.readTime | fFormatDate }}
        </template>
      </el-table-column>
      <el-table-column
        label="通信状态"
      >
        <template slot-scope="scope">
          {{ scope.row.commState | fCommState }}
        </template>
      </el-table-column>
      <el-table-column
        prop="meterState"
        label="表状态"
      />
      <el-table-column
        prop="meterType"
        label="表类型"
      />
      <!-- <el-table-column fixed="right" :label="$t('common.operation')" width="120">
        <template slot-scope="scope">
          <i class="el-icon-edit" @click="handleEdit(scope.row)" />
          <i class="el-icon-delete" @click="handleDelete(scope.row)" />
        </template>
      </el-table-column> -->
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
import { getMeterRecord } from '@/service/api'
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
        userCode: '',
        waterCode: '',
        startTime: '',
        endTime: ''
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
    this.init()
  },

  methods: {
    async getMeterRecord () {
      const params = {
        userId: 'USD1ED59A8133C42BFAEFBBC339EA660A5',
        companyId: '8888',
        // userId: this.userId,
        // companyId: JSON.parse(localStorage.getItem("USER_INFO")).companyId,
        // meterUserNum: this.search.userCode,
        // meterUserNum: '003',
        meterNbiotNum: '76000180',
        // meterNbiotNum: this.search.waterCode,
        // startDate: this.fFormatDate(this.search.startTime, '{y}/{m}/{d} {h}:{i}:{s}'),
        // endDate: this.fFormatDate(this.search.endTime, '{y}/{m}/{d} {h}:{i}:{s}'),
        startDate: '2020/01/01 12:00:00',
        endDate: '2020/01/01 12:00:00',
        pageSize: this.pageObj.pageSize,
        currentPage: this.pageObj.currentPage
      }
      let resData = await getMeterRecord(params)
      if (resData.data.status == 200 && resData.data.code == 1) {
        this.tableData = resData.data.data || []
        this.pageObj.allTotal = resData.data.page.totalRow || 0
      }
    },
    init () {
      this.getMeterRecord()
    },
    searchSubmit () {
      this.getMeterRecord()
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
    fFormatDate (time, cFormat) {
      if (!time) return ""
      if (arguments.length === 0) return null
      if ((time + '').length === 10) {
        time = +time * 1000
      }

      var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'; var date
      if (typeof time === 'object') {
        date = time
      } else {
        date = new Date(time)
      }

      var formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }

      var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        var value = formatObj[key]
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
        if (result.length > 0 && value < 10) {
          value = '0' + value
        }
        return value || 0
      })

      return time_str
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
