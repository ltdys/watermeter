<template>
  <div class="alarm">
    <el-row>
      <el-col :span="24">
        <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
          <el-form-item :label="$t('meterReadingAlarm.toolbarA')">
            <el-select v-model="search.t2">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                clearable>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="search.t3" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$t('meterReadingAlarm.toolbarB')">
            <el-select v-model="search.t1">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                clearable>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search">{{ $t('common.query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-refresh" class="custom-button">{{ $t('common.refresh') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" class="custom-button">{{ $t('meterReadingAlarm.toolbarC') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" :style="{height: (tableHeightPage + 52 - 30) + 'px', background: '#E9E9E9'}">
        <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
          <my-region2 @handleNodeClick="handleNodeClick"></my-region2>
        </el-scrollbar>
      </el-col>
      <el-col :span="20">
        <el-table
          :data="tableData"
          border
          stripe
          style="width: 100%"
          size="mini"
          :height="tableHeightPage - 30"
          highlight-current-row
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            width="50"
            label="#"
          />
          <el-table-column
            prop="id"
            :label="$t('meterReadingAlarm.tableA')"
            width="300"
          />
          <el-table-column
            prop="name"
            :label="$t('meterReadingAlarm.tableB')"
            width="120"
          />
          <el-table-column
            prop="tableId"
            :label="$t('meterReadingAlarm.tableC')"
            width="220"
          />
          <el-table-column
            prop="tableType"
            :label="$t('meterReadingAlarm.tableD')"
          />
          <el-table-column
            prop="IMEI"
            label="IMEI"
          />
          <el-table-column
            prop="currentNum"
            :label="$t('meterReadingAlarm.tableE')"
          />
          <el-table-column
            prop="lastNum"
            :label="$t('meterReadingAlarm.tableF')"
          />
          <el-table-column
            prop="useNum"
            :label="$t('meterReadingAlarm.tableG')"
            width="160"
          />
          <el-table-column
            prop="isAlarm"
            :label="$t('meterReadingAlarm.tableH')"
          />
          <el-table-column
            prop="alarmType"
            :label="$t('meterReadingAlarm.tableI')"
            width="160"
          />
          <el-table-column
            prop="alarmToplimit"
            :label="$t('meterReadingAlarm.tableJ')"
          />
          <el-table-column
            prop="alarmBottomlimit"
            :label="$t('meterReadingAlarm.tableK')"
          />
          <el-table-column
            prop="surchargeType"
            :label="$t('meterReadingAlarm.tableL')"
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
    </el-row>  
  </div>
</template>

<script>
import { getAlarm } from '@/service/reading'
import myRegion2 from '@/components/common/region2'
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
export default {

  name: 'alarm',

  components: {
    myPagination, myRegion2
  },

  mixins: [list_mixins],

  data () {
    return {
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
      options: [{
        value: 0,
        label: '全部'
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
    init () {
      this.getAlarm()
    },
    async getAlarm () {
      const params = {
        rows: this.pageObj.pageSize,
        page: this.pageObj.currentPage
      }
      let res = await getAlarm(params)
      this.tableData = res.data.data
      this.pageObj.allTotal = res.data.allTotal
    },
    pageChange (data) { // 每页条数切换回调事件
      this.pageObj.pageSize = data;
      this.init()
    },
    currentChange (data) { // 当前页切换事件
      this.pageObj.currentPage = data;
      this.init()
    },
    handleNodeClick(data) {
      console.log(data);
    },
    searchSubmit () {

    },
    handleEdit () {

    },
    handleDelete () {

    },
    handleNodeClick (data) {
      this.$message.success(`切换${data.label}成功`)
    }
  }
}
</script>

<style lang="scss">
  .alarm {
    .el-scrollbar__wrap {
      background: #fff;
    }
    overflow-y: scroll;
    .toolbar{
      height:auto;
      margin-bottom: 10px;
      .el-form-item {
        margin-bottom: 2.5px;
      }
    }
  }
</style>