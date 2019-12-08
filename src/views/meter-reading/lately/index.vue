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
                clearable
              />
            </el-select>
          </el-form-item>
          <el-form-item class="mr-five">
            <el-input v-model="search.value" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSubmit">{{ $t('common.query') }}</el-button>
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
          <my-region2 @handleNodeClick="handleNodeClick" />
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
      <div class="gather-wrap">
        <div class="gather-content">
          <div>
            <el-collapse accordion>
              <el-collapse-item v-for="(item, index) in concentratorList" :key="index" :title="item.meterConcentratorName" @click.native="concentratorChange(item)">
                <div v-for="(item1, index1) in meterList" :key="index1" @click.stop="meterChange(item1)" class="gather-meter">{{ item1.num }}</div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div>
          <div v-for="(item, index) in nbiotList" :key="index">
            {{ item.meterNbiotNum }}
          </div>
          </div>
        </div>
        <div class="gather-btn">
          确认采集
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible="readVisiable" title="当前读数" @close="readClose">
      <div class="read-wrap">
        123321
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { recentMeterReading, findMeterConcentrator, getMeterNodes, getMeterNbIotL } from '@/service/api'
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
    return {
      tableData: [],
      treeData: [],
      gatherVisiable: false, // 数据采集弹窗
      readVisiable: false, // 数据读取弹窗
      gatherForm: {},
      value: [1, 4],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      search: {
        type: '',
        value: '',
        areasId: "",
        num: "", // 用户编号
        meterNbiotNum: "", // 编号
        meterType: "", // 表类型
        address: "" // 安装地址
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
      }],
      concentratorList: [],  // 集中器列表
      meterList: [],  // 采集器列表
      nbiotList: []  //  水表列表
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
      switch (this.search.type) {
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
          num: this.search.num, // 用户编号
          meterNbiotNum: this.search.meterNbiotNum, // 编号
          meterType: this.search.meterType, // 表类型
          address: this.search.address // 安装地址
        },
        meterNbIot: {
          num: this.search.num, // 用户编号
          meterNbiotNum: this.search.meterNbiotNum, // 编号
          meterType: this.search.meterType, // 表类型
          address: this.search.address // 安装地址
        }
      }
      let resData = await recentMeterReading(params)
      if (resData.status === 200 && resData.data.code === 1) {
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
    handleNodeClick (data) {
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
    readClose () {
      this.readVisiable = false
    },
    gatherSubmit () {

    },
    handleGather () {
      console.log("当前选中的区域" + this.search.areasId)
      if (!this.search.areasId) {
        this.$message.warning("请选择区域");
        return
      }
      this.gatherVisiable = true
      this.findMeterConcentrator()
    },
    handleRead () {
      this.readVisiable = true
    },
    // 集中器查询
    async findMeterConcentrator() {
      let params = {
        userId: this.userId,
        meterConcentrator: {
          areasId: this.search.areasId
        }
      }
      let resData = await findMeterConcentrator(params)
      if (resData.status === 200) {
        this.concentratorList = resData.data.data || []
        console.log("this.concentratorList", this.concentratorList)
      }
    },
    // 集中器点击
    concentratorChange(item) {
      this.getMeterNodes(item.meterConcentratorId || "")
    },
    async getMeterNodes(mcId) {
      let params = {
        mcId: mcId
      }
      let resData = await getMeterNodes(params)
      if (resData.status === 200) {
        this.meterList = resData.data.data || []
        console.log("this.meterList", this.meterList)
      }
    },
    // 采集器点击
    meterChange(item) {
      this.getMeterNbIotL(item.num)
    },
    // 水表查询
    async getMeterNbIotL(num) {
      let params = {
        userId: this.userId,
        meterNbIot: {
          meterNodeNum: num
        }
      }
      let resData = await getMeterNbIotL(params)
      if(resData.status === 200) {
        this.nbiotList = resData.data.data
        console.log("this.nbiotList", this.nbiotList)
      }
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
    .gather-wrap {
      height: 400px;
      display: flex;
      flex-direction: column;
      .gather-content {
        display: flex;
        flex: 1;
        > div:first-child {
          flex: 1;
          margin-right: 15px;
          // background: #E9E9E9;
          border-radius: 4px;
          overflow: scroll;
          color: #343844;
        }
        >div:last-child {
          flex: 1.2;
          // background: #F5F5F5;
          border-radius: 4px;
          overflow: scroll;
          color: #343844;
        }
      }
      .gather-btn {
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-radius: 4px;
        font-size: 18px;
        color: #fff;
        margin-top: 10px;
        background: #0084FF;
      }
      .gather-meter {
        padding-left: 30px;
        cursor: pointer;
        // line-height: 30px;
      }
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
