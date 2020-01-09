<template>
  <div class="meter-reading-exception">
    <el-row>
      <el-col :span="24">
        <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
          <el-form-item label="组织">
            <el-cascader
              v-if="role_name === '超级管理员'"
              ref="cascader12"
              v-model="search.orgList"
              clearable
              placeholder="请选择组织"
              :options="treeData"
              filterable
              :props="setProps"
              size="mini"
              class="cascader12"
              @change="changeOrg"
            />
            <el-input v-else v-model="company_name" placeholder="请输入内容" :disabled="true" />
          </el-form-item>
          <el-form-item label="区域">
            <el-cascader
              ref="cascader3"
              v-model="search.areasList"
              class="cascader3"
              placeholder="请选择区域"
              size="mini"
              :options="list"
              clearable
              filterable
              :props="setParent"
              @change="changeParent"
            />
          </el-form-item>
          <el-form-item label="统计方式">
            <el-select v-model="search.readType" placeholder="请选择统计方式" @change="wayChange">
              <el-option
                v-for="item in readTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select v-model="send" placeholder="请选择" @change="yearChange">
              <el-option
                v-for="item in sendOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select v-if="search.readType != 0" v-model="cond" placeholder="请选择">
              <el-option
                v-for="item in condOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click.native="searchSubmit1()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <el-scrollbar class="scrollbar-page" wrap-class="scrollbar-wrapper">
          <div class="exception-wrap" :style="{ height: tableHeight + 'px'}">
            <div v-show="!errorShow" id="analysisNode" :style="{ height: tableHeight + 'px'}" />
            <div v-show="errorShow" class="exce_error" :style="{ height: tableHeight + 'px'}">{{ errormsg }}</div>
          </div>
        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { list_mixins } from '@/mixins'
import { orgTreeData, treeDataUtil } from '@/utils/publicUtil'
import { findCompany, findDistrict, meterReadAnalysisByYearQuarterMonth } from "@/service/api";

export default {

  name: 'alarm',

  mixins: [list_mixins],

  data () {
    return {
      errorShow: false,
      errormsg: '',
      lnglatsList: [],
      companyId: "",
      tableData: [],
      cond: "",
      send: "",
      search: {
        areasList: [],
        areasId: '',
        orgList: [],
        org: "",
        readType: 2,
        year: "",
        month: "",
        quarter: ""
      },
      setProps: { // 设置级联选择器
        label: 'companyName',
        value: 'id',
        expandTrigger: 'click',
        checkStrictly: true
      },
      setParent: { // 设置级联选择器
        label: 'name',
        value: 'id',
        expandTrigger: 'click',
        checkStrictly: true
      },
      treeData: [],
      tableDataFj: [],
      list: [],
      readTypeList: [{
        label: "按年统计",
        value: 0
      }, {
        label: "按月统计",
        value: 2
      }, {
        label: "按季统计",
        value: 1
      }],
      condOptions: [],
      sendOptions: [],
      chartList: [],
      xAxis: [],
      dataList: [],
      isFirst: true
    }
  },

  created () {
    this.companyId = this.company_id
    this.search.year = new Date().getFullYear();

    var month = parseInt(new Date().getMonth() + 1);
    this.search.month = month
    this.cond = this.search.month
    this.send = this.search.year
    // for (let i = 0; i < month;) {
    //   this.condOptions.push({
    //     label: month + "月",
    //     value: month
    //   })
    //   month--
    // }
    for (let i = 0; i < 6; i++) {
      this.sendOptions.push({
        label: this.search.year + "年",
        value: this.search.year
      })
      this.search.year--
    }
    for (let i = 0; i < 12; i++) {
      this.condOptions.push({
        label: i + 1 + "月",
        value: i + 1,
        disabled: (i + 1) > month
      })
    }
    // if (year == val) {
    //   this.condOptions.map(item => {
    //     if (item.value > month) {
    //       item.disabled = true
    //     }
    //     return item
    //   })
    // }

    if (this.role_name === "超级管理员") {
      this.findCompany('0')
    } else {
      this.findDistrict()
    }
  },

  mounted () {
  },

  methods: {
    init () {
    },
    changeOrg () { // 组织机构选择
      this.isFirst = false
      this.cascaderFalse('cascader12')
      if (this.search.orgList && this.search.orgList.length > 0) {
        this.search.org = this.search.orgList[this.search.orgList.length - 1]
        this.companyId = this.search.org
        this.findDistrict()
      } else {
        this.search.org = ""
        this.companyId = this.company_id
      }
    },
    async findCompany (key) { // 获取组织机构
      let params = {
        userId: this.userId,
        currentPage: 1,
        pageSize: 10000,
        company: {
          id: this.companyId
        }
      }
      let resData = await findCompany(params)
      console.log('获取组织机构', resData)
      if (resData.status === 200 && resData.data.data !== null) {
        let list = resData.data.data
        this.treeData = JSON.parse(orgTreeData([...list]))
        if (key === '0') {
          // let param = {
          //   companyId: this.treeData[0].id
          // }

          if (this.role_name === "超级管理员") {
            this.search.orgList = [this.treeData[0].id]
            this.search.org = this.search.orgList[this.search.orgList.length - 1]
            this.companyId = this.search.org
            if (this.isFirst) {
              this.meterReadAnalysisByYearQuarterMonth();
            }
          }
        }
      }
    },
    async findDistrict () { // 查询区域
      const self = this;
      let params = {
        companyId: this.companyId
      }
      let res = await findDistrict(params)
      console.log('查询区域', res)
      if (res.status === 200 && res.data.data !== null) {
        let list = res.data.data || []
        console.log('查询区域', list)
        if (list.length !== 0) {
          list = list.map(item => {
            self.$set(item, 'parentId', item.parentid)
            self.$set(item, 'companyId', item.companyid)
            return item
          })
          list = list.filter(item => {
            return item.state == 0
          })
          console.log(list)
          self.$nextTick(() => {
            self.tableDataFj = list
            self.list = JSON.parse(treeDataUtil([...list], 'parentId', 'id'))

            // 如果是非超级管理员
            if (self.role_name !== "超级管理员") {
              self.search.areasList = [self.list[0].id]
              self.search.areasId = self.search.areasList[self.search.areasList.length - 1]
            }
          })
        } else {
          self.tableDataFj = list
          self.list = list
        }
      }
    },
    changeParent () { // 区域选择、
      this.isFirst = false
      this.cascaderFalse('cascader3')
      if (this.search.areasList && this.search.areasList.length > 0) {
        this.search.areasId = this.search.areasList[this.search.areasList.length - 1]
      } else {
        this.search.areasId = ""
      }
    },
    searchSubmit1 () {
      this.isFirst = false
      this.meterReadAnalysisByYearQuarterMonth()
    },
    wayChange () {
      this.sendOptions = []
      this.cond = ""
      this.send = ""
      this.search.year = ""
      this.search.month = ""
      this.search.quarter = ""
      var year = parseInt(new Date().getFullYear());
      for (let i = 0; i < 6; i++) {
        this.sendOptions.push({
          label: year + "年",
          value: year
        })
        year--
      }
    },
    yearChange (val) {
      this.condOptions = []
      this.cond = ''
      let year = parseInt(new Date().getFullYear()); // 当前年份
      let month = parseInt(new Date().getMonth() + 1) // 当前月份
      if (this.search.readType === 2) { // 按月
        for (let i = 0; i < 12; i++) {
          this.condOptions.push({
            label: i + 1 + "月",
            value: i + 1,
            disabled: false
          })
        }
        if (year == val) {
          this.condOptions.map(item => {
            if (item.value > month) {
              item.disabled = true
            }
            return item
          })
        }
      } else if (this.search.readType === 1) { // 按季度
        this.condOptions = [{
          label: "第一季度",
          value: 1,
          disabled: false
        }, {
          label: "第二季度",
          value: 2,
          disabled: year == val && month < 4
        }, {
          label: "第三季度",
          value: 3,
          disabled: year == val && month < 7
        }, {
          label: "第四季度",
          value: 4,
          disabled: year == val && month < 10
        }]
      }
    },
    // monthChange (val) {
    //   if (this.search.readType === 2) {
    //     this.search.month = val
    //   } else if (this.search.readType === 1) {
    //     this.search.quarter = val
    //   }
    // },
    // 查询用水统计
    async meterReadAnalysisByYearQuarterMonth () {
      this.search.year = this.send
      if (this.search.readType === 0) { // 按年
        this.search.month = ""
        this.search.quarter = ""
      } else if (this.search.readType === 2) { // 按月
        this.search.month = this.cond
        this.search.quarter = ""
      } else if (this.search.readType === 1) { // 按季度
        this.search.quarter = this.cond
        this.search.month = ""
      }

      let params = {
        companyId: this.companyId,
        districtId: this.search.areasId,
        readType: this.search.readType,
        year: this.search.year.toString(),
        month: this.search.month.toString(),
        quarter: this.search.quarter.toString()
      }
      console.log("params", params)
      let resData = await meterReadAnalysisByYearQuarterMonth(params)
      console.log('resData', resData)
      if (resData.status === 200 && resData.data.code === 1) {
        this.chartList = resData.data.data || []
        this.errorShow = false

        this.xAxis = this.chartList.map(item => {
          return item.day || item.month || item.quarter
        })
        this.dataList = this.chartList.map(item => {
          return item.total
        })

        this.$nextTick(() => {
          this.chartInit()
        })
      } else {
        this.errorShow = true
        this.errormsg = resData.data.message
        // this.$message.warning(resData.data.message);
      }
    },

    chartInit () {
      const self = this
      let myChart = this.$echarts.init(document.getElementById('analysisNode'))
      let option = {
        title: {
          text: '',
          padding: [20, 10]
        },
        tooltip: {
          trigger: 'axis',
          padding: 10,
          backgroundColor: "rgba(2,15,34,0.8)",
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'none' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        color: ['#8F74FF'],
        toolbox: {
          show: true,
          padding: [20, 10],
          feature: {
            magicType: { type: ['line', 'bar'] }
          }
        },
        xAxis: {
          type: 'category',
          data: self.xAxis,
          axisLabel: {
            color: '#F00'
          }
        },
        yAxis: {
          name: '用水量(吨)',
          type: 'value'
        },
        series: [{
          data: self.dataList,
          type: 'line'
        }]
      };

      myChart.resize()
      myChart.setOption(option, true);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    }
  }
}
</script>

<style lang="scss">
  .meter-reading-exception {
    // overflow-y: scroll;
    .exception-wrap {
      width: 100%;
      #analysisNode {
        width: 100%;
      }
      .exce_error{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
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
  }
</style>
