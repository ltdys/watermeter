<template>
  <div class="lately-history">
    <el-form ref="search" :inline="true" :model="search" class="toolbar" size="mini">
      <el-form-item label="统计方式">
        <el-select v-model="search.readType" placeholder="请选择统计方式" @change="wayChange">
          <el-option
            v-for="item in readTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-model="send" placeholder="请选择" @change="yearChange" v-if="search.readType == 1 || search.readType == 2 || search.readType == 0">
          <el-option
            v-for="item in sendOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-if="search.readType == 1 || search.readType == 2" v-model="cond" placeholder="请选择">
          <el-option
            v-for="item in condOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </el-select>
        <el-date-picker
          v-model="search.day"
          type="date"
          placeholder="选择日期"
          v-if="search.readType == 3 || search.readType == 4">
        </el-date-picker>
        <el-time-select
          v-if="search.readType == 4"
          v-model="search.hour"
          :picker-options="{
            start: '00:00',
            step: '00:60',
            end: '23:00'
          }"
          placeholder="选择时间">
      </el-time-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click.native="searchSubmit1()">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="history-chart" id="historyChart" :style="{ width: width, height: height }">
    </div>
  </div>
</template>

<script>
import { meterUserAnalysisMeterRead } from "@/service/api";
export default {
  props: {
    width: {
      type: String,
      default: '870px'
    },
    height: {
      type: String,
      default: '400px'
    },
    currentItem: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      search: {
        readType: 2,
        year: "",
        month: "",
        quarter: "",
        day: "",
        hour: ""
      },
      readTypeList: [{
        label: "按年统计",
        value: 0
      }, {
        label: "按月统计",
        value: 2
      }, {
        label: "按季统计",
        value: 1
      }, {
        label: "按天统计",
        value: 3
      }, {
        label: "按时统计",
        value: 4
      }],
      send: "",
      cond: "",
      condOptions: [],
      sendOptions: [],
      xDatas: [],
      yDatas: []  
    }
  },
  mounted() {
    var year = parseInt(new Date().getFullYear());
    var month = parseInt(new Date().getMonth()) + 1;
    this.send = year
    this.cond = month
    var year = parseInt(new Date().getFullYear());
    for (let i = 0; i < 6; i++) {
      this.sendOptions.push({
        label: year + "年",
        value: year
      })
      year--
    }

    for (let i = 0; i < 12; i++) {
      this.condOptions.push({
        label: i + 1 + "月",
        value: i + 1,
        disabled: false
      })
    }
    if (year == year) {
      this.condOptions.map(item => {
        if (item.value > month) {
          item.disabled = true
        }
        return item
      })
    }

    this.meterUserAnalysisMeterRead()
  },
  methods: {
    wayChange () {
      this.sendOptions = []
      this.cond = ""
      this.send = ""
      this.search.year = ""
      this.search.month = ""
      this.search.quarter = ""
      this.search.day = "";
      this.search.hour = "";
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
    searchSubmit1() {
      this.meterUserAnalysisMeterRead()
    },
    chartInit() {
      let myChart = this.$echarts.init(document.getElementById('historyChart'))
      let option = {
        color: '#0084FF',
        tooltip: {
          trigger: 'axis',
          padding: 10,
          backgroundColor: "rgba(2,15,34,0.8)",
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'none' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        // tooltip: {
        //     trigger: 'none',
        //     axisPointer: {
        //         type: 'cross'
        //     }
        // },
        grid: {
          left: 50,
          top: 20,
          right: 30,
          bottom: 30
        },
        xAxis: {
          type: 'category',
          data: this.xDatas
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.yDatas,
          type: 'line',
          dimensions: [
            { name: 'day', type: 'time' }
          ]
        }],
        backgroundColor: '#fff'
      };

      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 个人用水量统计
    async meterUserAnalysisMeterRead() {
      let day = this.fFormatDate(this.search.day, "{y}/{m}/{d}")
      let params = null;

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

      if(this.search.readType === 3) {  // 按天
        params = {
          meterUserId: this.currentItem.meterUserNum || "",  // 客户id
          nbIotNum: this.currentItem.meterNbIotNum || "",  // 水表编号
          readType: this.search.readType,
          year: day.split("/")[0] || "",
          quarter: this.search.quarter,
          month: day.split("/")[1] || "",
          day: day.split("/")[2] || "",
          hour: ""
        }
      } else if(this.search.readType === 4) {  // 按小时
        params = {
          meterUserId: this.currentItem.meterUserNum || "",  // 客户id
          nbIotNum: this.currentItem.meterNbIotNum || "",  // 水表编号
          readType: this.search.readType,
          year: day.split("/")[0] || "",
          quarter: this.search.quarter,
          month: day.split("/")[1] || "",
          day: day.split("/")[2] || "",
          hour: this.search.hour.split(":")[0] || ""
        }
      } else {
        params = {
          meterUserId: this.currentItem.meterUserNum || "",  // 客户id
          nbIotNum: this.currentItem.meterNbIotNum || "",  // 水表编号
          readType: this.search.readType,
          year: this.search.year,
          quarter: this.search.quarter,
          month: this.search.month,
          day: this.search.day,
          hour: this.search.hour
        }
      }
      let resData = await meterUserAnalysisMeterRead(params);
      if(resData.status === 200 && resData.data.code === 1) {
        let allData = resData.data.data || []
        this.xDatas = []
        this.yDatas = []
        allData.forEach((item, index) => {
          // var num = Math.floor(Math.random()*(1 - 100) + 100)
          this.xDatas.push(item.day || item.month || item.quarter || item.year || item.hour)
          this.yDatas.push(item.total)
        })

        this.$nextTick(() => {
          this.chartInit();
        })
      }
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
  .lately-history {
    width: 100%;
  }
</style>