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
    <div class="history-chart" id="historyChart" :style="{ width: width, height: height }">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '600px'
    },
    height: {
      type: String,
      default: '300px'
    }
  },

  data() {
    return {
      search: {
        readType: 2,
        year: "",
        month: "",
        quarter: ""
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
      }],
      send: "",
      cond: "",
      condOptions: [],
      sendOptions: []  
    }
  },
  mounted() {
    this.chartInit();
  },
  methods: {
    searchSubmit1() {

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
    searchSubmit1() {

    },
    chartInit() {
      let myChart = this.$echarts.init(document.getElementById('historyChart'))
      let option = {
        color: '#0084FF',
        xAxis: {
          type: 'category',
          data: ['第一季度', '第二季度', '第三季度', '第四季度']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [6120, 7200, 8150, 9080],
          type: 'bar',
          barWidth: 26
        }],
        backgroundColor: '#fff'
      };

      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    }
  }
}
</script>

<style lang="scss">
  .lately-history {
    
  }
</style>