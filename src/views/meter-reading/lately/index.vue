<template>
  <div class="lately">
    <el-row>
      <el-col :span="24">
        <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
          <el-form-item label="筛选查询">
            <el-select v-model="search.type" clearable filterable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                clearable>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="mr-five">
            <el-input v-model="search.value" clearable></el-input>
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
            <el-button type="primary" size="mini" class="custom-button" @click="handleGather">{{ $t('meterReadingLately.toolbarD') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button" @click="handleRead">{{ $t('meterReadingLately.toolbarE') }}</el-button>
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
      <el-col :span="4" :style="{height: (tableHeightPage + 52 - 30) + 'px', background: '#E9E9E9'}">
        <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
          <my-region2 @handleNodeClick="handleNodeClick"/> 
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
            prop="autoTapSwitch"
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

    <el-dialog :visible="gatherVisiable" title="数据采集" @close="gatherClose">
      <el-form ref="gatherRuleForm" :model="gatherForm">
        <el-form-item>
          <el-transfer v-model="value" :data="data"></el-transfer>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="gatherSubmit('ruleForm')">确定</el-button>
          <el-button @click="gatherVisiable = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>  

    <el-dialog :visible="readVisiable" title="当前读数" @close="readClose">
      <div class="read-wrap">
        123321
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { recentMeterReading } from '@/service/api'
import myRegion2 from '@/components/common/region2'
import myPagination from "@/components/pagination/my-pagination";
import { list_mixins } from '@/mixins'
export default {

  name: 'lately',

  components: {
    myPagination, myRegion2
  },

  mixins: [list_mixins],

  data () {
    const generateData = _ => {
      const data = [];
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `采集器 ${ i }`,
          disabled: i % 4 === 0
        });
      }
      return data;
    };
    return {
      tableData: [],
      treeData: [],
      gatherVisiable: false, // 数据采集弹窗
      readVisiable: false, //数据读取弹窗
      gatherForm: {},
      data: generateData(),
      value: [1, 4],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      search: {
        type: '',
        value: '',
        areasId: "",
        num: "",  // 用户编号
        meterNbiotNum: "", // 编号 
        meterType: "",  // 表类型
        address: "", // 安装地址
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
        label: '表编号'
      }, {
        value: 2,
        label: "表类型"
      }, {
        value: 3,
        label: "安装地址"
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
      switch(this.search.type) {
        case 0: 
          this.search.num = this.search.value
          break;
        case 1:
          this.search.meterNbiotNum = this.search.value
          break;
        case 2:
          this.search.meterType = this.search.value
          break;
        case 3:
          this.search.address = this.search.value
          break;
      }
      const params = {
        areasId: this.search.areasId,
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize,
        meterRead: {
          num: this.search.num,  // 用户编号
          meterNbiotNum: this.search.meterNbiotNum, // 编号 
          meterType: this.search.meterType,  // 表类型
          address: this.search.address, // 安装地址
        },
        meterNbIot: {
          num: this.search.num,  // 用户编号
          meterNbiotNum: this.search.meterNbiotNum, // 编号 
          meterType: this.search.meterType,  // 表类型
          address: this.search.address, // 安装地址
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
      this.search.areasId = data.id
      this.recentMeterReading()
    },
    searchSubmit () {
      this.init()
    },
    handleEdit () {

    },
    handleDelete () {

    },
    gatherClose () {
      this.gatherVisiable = false
    },
    readClose() {
      this.readVisiable = false
    },
    gatherSubmit () {

    },
    handleGather () {
      this.gatherVisiable = true
    },
    handleRead() {
      this.readVisiable = true
    }
  }
}
</script>

<style lang="scss">
  .lately {
    overflow-y: scroll;
    .el-scrollbar__wrap {
      background: #fff;
    }
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
    .el-dialog {
      width: 550px !important;
    }
    .read-wrap {
      width: 100%;
      height: 400px;
      text-align: center;
      background: url("~@/assets/read.png") no-repeat;
      background-position: center;
      line-height: 309px;
      font-size: 40px;
      font-weight: bold;
      color: #343844;
    }
  }
</style>