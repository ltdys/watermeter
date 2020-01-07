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
            <el-button type="primary" size="mini" icon="el-icon-refresh" class="custom-button" @click="refresh">{{ $t('common.refresh') }}</el-button>
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
          <!-- <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('meterReadingLately.toolbarF') }}</el-button>
          </el-form-item> -->
          <!-- <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('meterReadingLately.toolbarG') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('meterReadingLately.toolbarH') }}</el-button>
          </el-form-item> -->
          <!-- <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('meterReadingLately.toolbarI') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" class="custom-button">{{ $t('meterReadingLately.toolbarJ') }}</el-button>
          </el-form-item> -->
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
          />
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
          <!-- <el-table-column
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
          /> -->
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

    <el-dialog :visible="gatherVisiable" :title="gaTitle" :close-on-click-modal="false" @close="gatherClose">
      <div
        v-loading="loading"
        :element-loading-text="gaTitle + '中...'"
        element-loading-spinner="el-icon-loading"
        element-loading-customClass="load-class"
        class="gather-wrap"
      >
        <div class="gather-content">
          <!-- <div>
            <el-collapse accordion>
              <el-collapse-item v-for="(item, index) in concentratorList" :key="index" :title="item.meterConcentratorName" @click.native="concentratorChange(item)">
                <div v-for="(item1, index1) in meterList" :key="index1" class="gather-meter" @click.stop="meterChange(item1)">{{ item1.num }}</div>
              </el-collapse-item>
            </el-collapse>
          </div> -->
          <div class="col-box">
            <div v-for="(item, index) in concentratorList" :key="index" class="col-box_cel">
              <div class="col-box_cel_title fl" @click="openJzq(item)">
                <i class="col_icon fl" :class="[item.isShow ? 'el-icon-remove-outline' : 'el-icon-circle-plus-outline']" />
                <div>{{ item.meterConcentratorName }}</div>
              </div>
              <!-- <transition-group name="collapse"> -->
              <div class="col-box_se" :style="{height: item.maxHeight + 'px'}">
                <div v-for="(item1, index1) in item.meterList" :key="index1" class="col-box_se_main" @click.stop="meterChange(item1, item.meterList)">
                  <div class="col-box_se_main_box fl" :class="{'is-select': item1.isSelect}">
                    <span class="b-dot" />
                    <div>{{ item1.num }}</div>
                  </div>
                </div>
              </div>
              <!-- </transition-group> -->
            </div>
          </div>
          <div class="col2-box">
            <div v-for="(item, index) in nbiotList" :key="index" class="col-sb fl" :class="{'is-select': item.isSelect}" @click.stop="nbiotClick(item)">
              <span class="b-dot" />
              <div>{{ item.meterNbiotNum }}</div>
            </div>
          </div>
        </div>
        <div class="gather-btn" @click="sureGather">
          {{ gaSure }}
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible="readVisiable" title="当前读数" :close-on-click-modal="false" @close="readClose">
      <div class="read-wrap">
        123321
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { recentMeterReading, findMeterConcentrator, getMeterNodes, getMeterNbIotL, operInstruct } from '@/service/api'
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
      gaType: 0, // 0 数据采集 1 数据读取
      gaTitle: '数据采集',
      gaSure: '确认采集',
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
      concentratorList: [], // 集中器列表
      meterList: [], // 采集器列表
      nbiotList: [], //  水表列表
      checkMeterConcentrator: {}, // 选中的采集器
      checkMeterConcentratorNum: "", // 选中的集中器编号
      checkNum: "", // 选中的采集器编号
      checkSb: {}, // 选中的水表
      loading: false
    }
  },

  created () {
    this.init()
  },

  methods: {
    init () {
      this.recentMeterReading()
    },
    refresh () {
      this.search = {
        type: '',
        value: '',
        areasId: "",
        num: "", // 用户编号
        meterNbiotNum: "", // 编号
        meterType: "", // 表类型
        address: "" // 安装地址
      }
      this.pageObj = {
        allTotal: 0, // 总条数
        currentPage: 1, // 当前页数
        pageSize: 50, // 每页条数
        pageSizes: [10, 20, 50, 100]
      }
      this.checkMeterConcentrator = {}
      this.checkMeterConcentratorNum = ""
      this.checkNum = ""
      this.checkSb = {}
      this.init()
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
      this.tableData = []
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
      console.log('data', data)
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
    nbiotClick (item) { // 切换水表时
      console.log('水表', item)
      this.checkSb = item
      this.nbiotList.forEach(val => {
        val.isSelect = false
      })
      item.isSelect = true
    },
    sureGather () { // 确认采集
      if (this.gaType == 0) {
        this.sureCjFun()
      } else if (this.gaType == 1) {
        this.operInstruct2()
      }
    },
    sureCjFun () {
      const self = this;
      let param = {
        userId: self.userId
      }
      if (self.checkMeterConcentratorNum == '') { // 集中器为空
        this.$message.warning("请选择集中器");
      } else {
        param.concentratorNum = self.checkMeterConcentrator.meterConcentratorNum
        param.rule = self.checkMeterConcentrator.meterConcentratorRule
        param.cmd = 'MMM'
        if (self.checkNum == '') { // 采集器为空 1 -> 8F, 2 -> 10F, 3 -> 12F, 4 -> 14F
          // param.nodeBlockAddress = Number(param.rule) == 0 ? '{FFFFFFFFFFFF}' : Number(param.rule) == 1 ? '{FFFFFFFF}' : Number(param.rule) == 2 ? '{FFFFFFFFFFFFFF}' : '{FFFFFFFF}'
          // param.waterBlockAddress = param.rule == '02' ? '{""}' : `{FFFFFFFF}`

          param.nodeBlockAddress = Number(param.rule) == 1 ? '{FFFFFFFF}' : Number(param.rule) == 2 ? '{FFFFFFFFFF}' : Number(param.rule) == 3 ? '{FFFFFFFFFFFF}' : Number(param.rule) == 4 ? '{FFFFFFFFFFFFFF}' : '{FFFFFFFF}'
          param.waterBlockAddress = `{FFFFFFFF}`
        } else {
          param.nodeBlockAddress = `{${self.checkNum}}`
          if (Object.keys(self.checkSb).length == 0) { // 水表为空
            param.waterBlockAddress = param.rule == '02' ? '{""}' : `{FFFFFFFF}`
          } else {
            param.waterBlockAddress = param.rule == '02' ? '{""}' : `{${self.checkSb.meterNbiotNum}}`
          }
        }
      }
      self.$nextTick(() => {
        console.log('参数', param)
        self.operInstruct(param)
      })
    },
    async operInstruct (param) { // 采集操作指令
      const self = this
      const res = await operInstruct(param)
      if (res.status == 200 && res.data.code == 1) {
        this.$message.success(res.data.message);
        self.gatherClose()
        // self.loading = true
        // setTimeout(function () {
        //   self.operInstruct2()
        // }, 8000)
      } else {
        this.$message.error(res.data.message);
      }
      console.log('采集操作指令', res)
    },
    async operInstruct2 () { // 读取采集操作指令
      const self = this
      let param = {
        userId: self.userId,
        concentratorNum: self.checkMeterConcentrator.meterConcentratorNum,
        rule: self.checkMeterConcentrator.meterConcentratorRule,
        cmd: 'RRR',
        waterBlockAddress: '{""}',
        nodeBlockAddress: '{""}'
      }
      const res = await operInstruct(param)
      self.loading = false
      console.log('读取采集操作指令', res)
      if (res.status == 200 && res.data.code == 1) {
        this.$message.success(res.data.message);
        this.gatherClose()
      } else {
        this.$message.error(res.data.message);
      }
    },
    gatherClose () {
      this.nbiotList = []
      this.checkSb = {}
      this.gatherVisiable = false
    },
    readClose () {
      this.readVisiable = false
    },
    gatherSubmit () {

    },
    handleGather () {
      this.gaType = 0
      this.gaTitle = '数据采集'
      this.gaSure = '确定采集'
      console.log("当前选中的区域" + this.search.areasId)
      if (!this.search.areasId) {
        this.$message.warning("请选择区域");
        return
      }
      this.gatherVisiable = true
      this.findMeterConcentrator()
    },
    openJzq (item, index) {
      this.concentratorList.forEach(val => {
        val.maxHeight = 0
      })
      item.isShow = true
      item.maxHeight = item.meterList.length * 28
      this.checkMeterConcentrator = item
      this.checkMeterConcentratorNum = item.meterConcentratorNum
      // item.isShow = !item.isShow
      this.getMeterNodes(item, index)
      console.log('集中器', item)
    },
    handleRead () {
      // this.readVisiable = true
      this.gaType = 1
      this.gaTitle = '数据读取'
      this.gaSure = '确定读取'
      if (!this.search.areasId) {
        this.$message.warning("请选择区域");
        return
      }
      this.gatherVisiable = true
      this.findMeterConcentrator()
    },
    // 集中器查询
    async findMeterConcentrator () {
      let params = {
        userId: this.userId,
        meterConcentrator: {
          areasId: this.search.areasId
        }
      }
      let resData = await findMeterConcentrator(params)
      if (resData.status === 200) {
        this.concentratorList = resData.data.data || []
        this.concentratorList.forEach(item => {
          this.$set(item, 'maxHeight', 0)
          this.$set(item, 'meterList', [])
        })
        if (this.concentratorList.length !== 0) {
          this.openJzq(this.concentratorList[0], 0)
        }
        console.log("this.concentratorList", this.concentratorList)
      }
    },
    // 集中器点击
    concentratorChange (item, index) {
      console.log(item, index)
      this.getMeterNodes(item.meterConcentratorId || "")
    },
    async getMeterNodes (item, index) {
      let params = {
        mcId: item.meterConcentratorId || ""
      }
      let resData = await getMeterNodes(params)
      if (resData.status === 200) {
        this.meterList = resData.data.data || []
        item.meterList = resData.data.data || []
        item.meterList.forEach(val => {
          this.$set(val, 'isSelect', false)
        })
        if (item.meterList.length != 0) {
          // item.meterList[0].isSelect = true
          // this.checkNum = item.meterList[0].num
          // this.meterChange(item.meterList[0], item.meterList)
        }
        this.concentratorList.forEach(val => {
          // val.isShow = false
          val.maxHeight = 0
        })
        item.maxHeight = item.meterList.length * 28
        console.log("this.meterList", this.meterList)
      }
    },
    // 采集器点击
    meterChange (item, list) {
      this.checkNum = item.num
      list.forEach(val => {
        val.isSelect = false
      })
      item.isSelect = true
      this.getMeterNbIotL(item.num)
    },
    // 水表查询
    async getMeterNbIotL (num) {
      let params = {
        userId: this.userId,
        meterNbIot: {
          meterNodeNum: num
        }
      }
      let resData = await getMeterNbIotL(params)
      if (resData.status === 200) {
        let list = resData.data.data
        this.nbiotList = []
        list.forEach(item => {
          this.$set(item, 'isSelect', false)
          this.nbiotList.push(item)
        })
        console.log("this.nbiotList", this.nbiotList)
      }
    },
    animateManyStyle (obj, json, fn) {
      clearInterval(obj.timer);
      obj.timer = setInterval(function () {
        var flag = true; // 用来判断是否停止定时器   一定写到遍历的外面
        for (var attr in json) { // attr  属性     json[attr]  值
          // 开始遍历 json
          // 计算步长    用 target 位置 减去当前的位置  除以 10
          // console.log(attr);
          var current = 0;
          if (attr == "opacity") {
            current = parseInt(this.getStyle(obj, attr) * 100);
          } else {
            current = parseInt(this.getStyle(obj, attr)); // 数值
          }
          // 目标位置就是  属性值
          var step = (json[attr] - current) / 10; // 步长  用目标位置 - 现在的位置 / 10
          step = step > 0 ? Math.ceil(step) : Math.floor(step);
          // 判断透明度
          if (attr == "opacity") { // 判断用户有没有输入 opacity属性
            if ("opacity" in obj.style) { // 判断浏览器是否支持opacity
              obj.style.opacity = (current + step) / 100;
            } else {
              obj.style.filter = "alpha(opacity = " + (current + step) + ")";
            }
          } else if (attr == "zIndex") {
            obj.style.zIndex = json[attr];
          } else {
            obj.style[attr] = current + step + "px";
          }
          if (current != json[attr]) { // 只要其中一个不满足条件 就不应该停止定时器
            flag = false;
          }
        }
        if (flag) { // 用于判断定时器的条件
          clearInterval(obj.timer);
          if (fn) { //  当定时器停止了， 动画就结束了  如果有回调，就执行回调
            fn();
          }
        }
      }, 5)
    },
    getStyle (obj, attr) {
      if (obj.currentStyle) { // ie 等
        return obj.currentStyle[attr]; // 返回传递过来的某个属性
      } else {
        return window.getComputedStyle(obj, null)[attr]; // w3c 浏览器
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
        .col-box{
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 40%;
          height: 100%;
          background: #E9E9E9;
          padding: 20px;
          box-sizing: border-box;
          &_cel{
            &_title{
              width: 100%;
              height: 35px;
              line-height: 35px;
              justify-content: flex-start;
              cursor: pointer;
              .col_icon{
                margin-right: 10px;
                margin-top: 2px;
              }
            }
          }
          &_se{
            width:100%;
            height: 0;
            overflow: hidden;
            transition: height 0.2s ease-out;
            &_main{
              width: 100%;
              &_box{
                width: 100%;
                height: 28px;
                line-height: 28px;
                justify-content: flex-start;
                padding-left: 20px;
                box-sizing: border-box;
                cursor: pointer;
              }
              .is-select{
                font-weight: bold;
                color: #0084FF;
                .b-dot{
                  background: #0084FF;
                }
              }
            }
          }
        }
        .col2-box{
          padding: 20px 0;
          box-sizing: border-box;
          background: #F5F5F5;
          .col-sb{
            width: 100%;
            height: 28px;
            line-height: 28px;
            justify-content: flex-start;
            padding-left: 20px;
            box-sizing: border-box;
            cursor: pointer;
          }
          .is-select{
            background: #E9E9E9;
            color: #0084FF;
            .b-dot{
              background: #0084FF;
            }
          }
        }
        .b-dot{
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #343844;
          margin-right: 7px;
        }
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
