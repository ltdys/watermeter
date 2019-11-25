<template>
  <div class="lately">
    <el-row>
      <el-col :span="24">
        <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
          <el-form-item :label="$t('meterReadingNbiot.toolbarA')">
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
          <el-form-item :label="$t('meterReadingNbiot.toolbarB')" class="mr-five">
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
            <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSubmit">{{ $t('common.query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('common.add') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-refresh" class="custom-button">{{ $t('common.refresh') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('meterReadingNbiot.toolbarC') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('meterReadingNbiot.toolbarD') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('meterReadingNbiot.toolbarE') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('meterReadingNbiot.toolbarF') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('meterReadingNbiot.toolbarG') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('meterReadingNbiot.toolbarH') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" :style="{height: (tableHeightPage + 52 - 30) + 'px', background: '#E9E9E9'}">
        <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
          <my-region @handleNodeClick="handleNodeClick"></my-region>
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
            type="index"
            width="50"
            label="#"
          />
          <el-table-column
            prop="id"
            :label="$t('meterReadingNbiot.tableA')"
            width="300"
          />
          <el-table-column
            prop="name"
            :label="$t('meterReadingNbiot.tableB')"
            width="120"
          />
          <el-table-column
            prop="address"
            :label="$t('meterReadingNbiot.tableC')"
          />
          <el-table-column
            prop="tableId"
            :label="$t('meterReadingNbiot.tableD')"
          />
          <el-table-column
            prop="tableAddress"
            :label="$t('meterReadingNbiot.tableE')"
          />
           <el-table-column
            prop="IMEI"
            label="IMEI"
          />
          <el-table-column
            prop="useNum"
            :label="$t('meterReadingNbiot.tableF')"
          />
          <el-table-column
            prop="useNum"
            :label="$t('meterReadingNbiot.tableG')"
          />
          <el-table-column
            prop="rechargeTime"
            :label="$t('meterReadingNbiot.tableH')"
            width="160"
          />
          <el-table-column
            prop="useNum"
            :label="$t('meterReadingNbiot.tableI')"
          />
          <el-table-column
            prop="rechargeTime"
            :label="$t('meterReadingNbiot.tableJ')"
            width="160"
          />
          <el-table-column
            prop="surchargeType"
            :label="$t('meterReadingNbiot.tableK')"
          />
          <el-table-column
            prop="surchargeType"
            :label="$t('meterReadingNbiot.tableL')"
          />
          <el-table-column
            prop="surchargeType"
            :label="$t('meterReadingNbiot.tableM')"
          />
          <el-table-column
            prop="surchargeType"
            :label="$t('meterReadingNbiot.tableN')"
            width="160"
          />
          <el-table-column
            prop="useNum"
            :label="$t('meterReadingNbiot.tableO')"
            width="160"
          />
          <el-table-column
            prop="valveStatus"
            :label="$t('meterReadingNbiot.tableP')"
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
import { getLately } from '@/service/reading'
import myRegion from '@/components/common/region'
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
export default {

  name: 'noIot',

  components: {
    myPagination, myRegion
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
      this.getLately()
    },
    async getLately () {
      const params = {
        rows: this.pageObj.pageSize,
        page: this.pageObj.currentPage
      }
      let res = await getLately(params)
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
  .lately {
    overflow-y: scroll;
    .toolbar{
      height:auto;
      margin-bottom: 10px;
      .el-form-item {
        margin-bottom: 2.5px;
      }
    }
    .el-select {
      width: 100px !important;
    }
  }
</style>