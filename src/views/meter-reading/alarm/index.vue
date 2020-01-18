<template>
  <div class="alarm">
    <el-row>
      <el-col :span="24">
        <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
          <el-form-item label="用户编号">
            <el-input v-model="search.userCode" clearable />
          </el-form-item>
          <el-form-item label="表编号">
            <el-input v-model="search.listCode" clearable />
          </el-form-item>
          <!-- <el-form-item label="用水状态">
            <el-select v-model="search.waterStatus">
              <el-option
                v-for="item in waterOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                clearable
              />
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchAlarm">{{ $t('common.query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-refresh" class="custom-button" @click="refreshAlarm">{{ $t('common.refresh') }}</el-button>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" icon="el-icon-setting" class="custom-button">{{ $t('meterReadingAlarm.toolbarC') }}</el-button>
          </el-form-item> -->
        </el-form>
      </el-col>
      <el-col :span="4" :style="{height: (tableHeightPage + 52 - 30) + 'px', background: '#E9E9E9'}">
        <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
          <my-region3 @handleNodeClick="handleNodeClick" />
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
          <!-- <el-table-column
            type="selection"
            width="55"
          /> -->
          <el-table-column
            type="index"
            width="50"
            label="#"
          />
          <el-table-column
            prop="meterUserNum"
            label="用户编号"
          />
          <el-table-column
            prop="meterUserName"
            label="用户名称"
          />
          <el-table-column
            prop="meterNbiotNum"
            label="表号"
            width="160"
          />
          <el-table-column
            prop="meter_type"
            label="表类型"
          />
          <el-table-column
            prop="meter_value"
            label="当前读数"
          />
          <el-table-column
            label="读取时间"
            width="160"
          >
            <template slot-scope="scope">
              {{ scope.row.read_time | fFormatDate }}
            </template>
          </el-table-column>
          <el-table-column
            label="上次读取时间"
            width="160"
          >
            <template slot-scope="scope">
              {{ scope.row.read_time_pre | fFormatDate }}
            </template>
          </el-table-column>
          <el-table-column
            prop="meter_value_pre"
            label="上次读数"
          />
          <el-table-column
            prop="value"
            label="用量"
          />
          <el-table-column
            prop="value_alert"
            label="警戒值"
          />
          <el-table-column
            prop="meter_type"
            label="用水类型"
          />
          <el-table-column
            label="用水状态"
          >
            <div slot-scope="scope" style="color: red;">
              {{ scope.row.meter_state }}
            </div>
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
  </div>
</template>

<script>
import { getMeterNbIotAlarm, getMeterNbIotAllAlarm, findParentCompany } from '@/service/api'
import myRegion3 from '@/components/common/region3'
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
export default {

  name: 'alarm',

  components: {
    myPagination, myRegion3
  },

  mixins: [list_mixins],

  data () {
    return {
      tableData: [],
      search: {
        userCode: '',
        listCode: '',
        waterStatus: '',
        t1: '',
        t2: '',
        t3: ''
      },
      waterOptions: [
        {
          value: 1,
          label: '正常'
        }, {
          value: 0,
          label: '异常'
        }
      ],
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
      }],
      qyId: '', // 区域id
      status: 0,
      companyId: ''
    }
  },

  created () {
    this.init()
  },

  methods: {
    init () {
      this.status = 0
      this.findParentCompany()
    },
    async findParentCompany () {
      let params = {
        userId: this.userId
      }
      let resData = await findParentCompany(params)
      if (resData.status === 200 && resData.data.data) {
        let list = resData.data.data
        this.companyId = list.length > 0 ? list[0].id : ''
        this.getMeterNbIotAllAlarm()
      }
    },
    async getMeterNbIotAllAlarm () {
      const params = {
        userId: this.userId,
        companyId: this.companyId,
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize
      }
      let res = await getMeterNbIotAllAlarm(params)
      this.tableData = res.data.data
      this.pageObj.allTotal = res.data.page.totalRow
    },
    searchAlarm () {
      if (this.qyId == '') {
        this.$message.warning('请选择小区');
        return
      }
      this.pageObj.currentPage = 1
      this.getMeterNbIotAlarm()
    },
    refreshAlarm () { // 刷新
      this.pageObj.currentPage = 1
      this.pageObj.pageSize = 50
      this.search.userCode = ''
      this.search.listCode = ''
      this.getMeterNbIotAlarm()
    },
    async getMeterNbIotAlarm () {
      const params = {
        userId: this.userId,
        areasId: this.qyId,
        // userId: 'US3F87B8733B2C4C2898B0D5CFDBE7153D',
        // areasId: 23,
        meterUserNum: this.search.userCode,
        meterNbiotNum: this.search.listCode,
        meter_state: '1',
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize
      }
      let res = await getMeterNbIotAlarm(params)
      this.tableData = res.data.data
      this.pageObj.allTotal = res.data.allTotal
    },
    pageChange (data) { // 每页条数切换回调事件
      this.pageObj.pageSize = data;
      if (this.status == 0) {
        this.getMeterNbIotAllAlarm()
      } else if (this.status == 1) {
        this.getMeterNbIotAlarm()
      }
    },
    currentChange (data) { // 当前页切换事件
      this.pageObj.currentPage = data;
      if (this.status == 0) {
        this.getMeterNbIotAllAlarm()
      } else if (this.status == 1) {
        this.getMeterNbIotAlarm()
      }
    },
    handleNodeClick (data) {
      this.qyId = data.id
      this.status = 1
      this.pageObj.currentPage = 1
      this.pageObj.pageSize = 50
      console.log(data);
      this.getMeterNbIotAlarm()
    },
    searchSubmit () {

    },
    handleEdit () {

    },
    handleDelete () {

    }
    // handleNodeClick (data) {
    //   this.$message.success(`切换${data.label}成功`)
    // }
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
