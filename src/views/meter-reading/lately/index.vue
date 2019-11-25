<template>
  <div class="lately">
    <el-row>
      <el-col :span="24">
        <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
          <el-form-item :label="$t('meterReadingLately.toolbarA')">
            <el-input v-model="search.meterType" clearable/>
            <!-- <el-select v-model="search.meterType">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                clearable>
              </el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item :label="$t('meterReadingLately.toolbarB')" class="mr-five">
            <el-input v-model="search.comState" clearable/>
            <!-- <el-select v-model="search.comState">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                clearable>
              </el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSubmit">{{ $t('common.query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('common.add') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-refresh" class="custom-button">{{ $t('common.refresh') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('meterReadingLately.toolbarC') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('meterReadingLately.toolbarD') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('meterReadingLately.toolbarE') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('meterReadingLately.toolbarF') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('meterReadingLately.toolbarG') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('meterReadingLately.toolbarH') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('meterReadingLately.toolbarI') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('meterReadingLately.toolbarJ') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!-- <el-col :span="4" :style="{height: (tableHeightPage + 52 - 30) + 'px', background: '#E9E9E9'}">
        <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
          <my-region @handleNodeClick="handleNodeClick"></my-region>
        </el-scrollbar>
      </el-col> -->
      <el-col :span="24">
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
            prop="meterNbIotNum"
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
            prop="operatorTime"
            label="更新时间"
            width="160"
          />
          <el-table-column
            prop="meterValuePrev"
            label="上次读数"
          />
          <el-table-column
            prop="readTimePrev"
            label="上次时间"
            width="160"
          />
          <el-table-column
            label="通信状态"
          >
            <template slot-scope="scope">
              {{ scope.row.commState }}
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
          <el-table-column
            prop="none"
            label="集中器编号"
            width="160"
          />
          <el-table-column
            prop="none"
            label="采集器编号"
            width="160"
          />
          <el-table-column
            prop="swingTap"
            label="阀门状态"
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
import { recentMeterReading } from '@/service/api'
import myRegion from '@/components/common/region'
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
export default {

  name: 'lately',

  components: {
    myPagination, myRegion
  },

  mixins: [list_mixins],

  data () {
    return {
      tableData: [],
      search: {
        meterType: '',
        comState: ''
      },
      pageObj: {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      },
      options: [{
        value: 0,
        label: '异常'
      }, {
        value: 1,
        label: '正常'
      }]
    }
  },

  created () {
    this.init()
  },

  methods: {
    init () {
      this.recentMeterReading()
    },
    async recentMeterReading () {
      const params = {
        areasId: 6,
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize,
        meterRead: {
          commState: this.search.comState
        },
        meterNbIot: {
          meterType: this.search.meterType
        }
      }
      let resData = await recentMeterReading(params)
      if(resData.status === 200 && resData.data.code === 1) {
        this.tableData = resData.data.data
        this.pageObj.allTotal = resData.data.page.totalRow || 0
      }
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
      this.init()
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
  .lately {
    overflow-y: scroll;
    .toolbar{
      height:auto;
      margin-bottom: 10px;
      .el-form-item {
        margin-bottom: 2.5px;
      }
    }
    .el-select, .el-input {
      width: 120px !important;
    }
  }
</style>