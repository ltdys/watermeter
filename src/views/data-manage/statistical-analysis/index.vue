<template>
  <div class="meter-reading-exception">
    <el-row>
      <el-col :span="24">
        <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
          <el-form-item label="组织">
            <el-cascader
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
              v-if="role_name === '超级管理员'"
            />
          </el-form-item>
          <el-form-item label="区域">
            <el-cascader
              ref="cascader3"
              class="cascader3"
              placeholder="请选择区域"
              size="mini"
              v-model="search.areasList"
              :options="list"
              clearable
              filterable
              :props="setParent"
              @change="changeParent"
            />
          </el-form-item>
          <el-form-item label="统计方式">
            <el-select v-model="search.readType" placeholder="请选择" @change="wayChange">
              <el-option
                v-for="item in readTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="cond" placeholder="请选择">
              <el-option
                v-for="item in condOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
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
              <div id="analysisNode" :style="{ height: tableHeight + 'px'}"></div>
            </div>
          </el-scrollbar>
        </el-col>
    </el-row>  
  </div>
</template>

<script>
import { list_mixins } from '@/mixins'
import { orgTreeData, treeDataUtil, treeDataTest } from '@/utils/publicUtil'
import { findCompany, findDistrict, meterReadAnalysisByYearQuarterMonth } from "@/service/api";

export default {

  name: 'alarm',

  mixins: [list_mixins],

  data () {
    return {
      lnglatsList: [],
      companyId: "",
      tableData: [],
      cond: "",
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
      chartList: [],
      xAxis: [],
      dataList: [],
      isFirst: true
    }
  },

  created () {
    this.companyId = this.company_id
    this.search.year = new Date().getFullYear();
    this.search.month = parseInt(new Date().getMonth() + 1);
    this.cond = this.search.month
    
    if(this.role_name === "超级管理员") {
      this.findCompany('0')
    } else {
      this.findDistrict()
    }
  },

  mounted() {
  },

  methods: {
    init () {
    },
    changeOrg () { // 组织机构选择
      this.isFirst = false
      this.cascaderFalse('cascader12')
      if(this.search.orgList && this.search.orgList.length > 0) {
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
          let param = {
            companyId: this.treeData[0].id
          }

          if(this.role_name === "超级管理员") {
            this.search.orgList = [this.treeData[0].id]
            this.search.org = this.search.orgList[this.search.orgList.length - 1]
            this.companyId = this.search.org
            if(this.isFirst) {
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

            //如果是非超级管理员
            if(self.role_name !== "超级管理员") {
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
    searchSubmit1() {
      this.isFirst = false
      this.meterReadAnalysisByYearQuarterMonth()
    },
    wayChange() {
      this.condOptions = []
      this.cond = ""
      this.search.year = ""
      this.search.month = ""
      this.search.quarter = ""
      var year = parseInt(new Date().getFullYear());
      var month = parseInt(new Date().getMonth() + 1)
      if (this.search.readType === 0) {  // 按年
        console.log("当前年份", year)
        for(let i = 0; i < 5; i ++) {
          this.condOptions.push({
            label: year + "年",
            value: year
          })
          year--
        }
      } else if(this.search.readType === 2) {  // 按月
        for(let i = 0; i < month;) {
          this.condOptions.push({
            label: month + "月",
            value: month
          })
          month--
        }
      } else if(this.search.readType === 1) {  // 按季度
        this.condOptions = [{
          label: "第一季度",
          value: 1
        }, {
          label: "第二季度",
          value: 2
        }, {
          label: "第三季度",
          value: 3
        }, {
          label: "第四季度",
          value: 4
        }]
      }
    },
    chartInit() {
      
    },
    // 查询用水统计
    async meterReadAnalysisByYearQuarterMonth() {
      if(this.search.readType === 0) {  // 按年
        this.search.year = this.cond
        this.search.month = ""
        this.search.quarter = ""
      } else if(this.search.readType === 2) {  // 按月
        this.search.year = parseInt(new Date().getFullYear())
        this.search.month = this.cond
        this.search.quarter = ""
      } else if(this.search.readType === 1) {  // 按季度
        this.search.quarter = this.cond
        this.search.year = parseInt(new Date().getFullYear())
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
      if(resData.status === 200 && resData.data.code === 1) {
        this.chartList = resData.data.data || []
        
        this.xAxis = this.chartList.map(item => {
          return item.day || item.month || item.quarter
        })
        this.dataList = this.chartList.map(item => {
          return item.total
        })

        this.$nextTick(() => {
          this.chartInit()
        })
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