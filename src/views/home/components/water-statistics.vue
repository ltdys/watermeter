<template>
  <div id="myChartWater" :style="{ width: width, height: height }" />
</template>

<script>
import { waterAnalysisByMonth } from '@/service/api'
export default {
  props: {
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },

  data () {
    return {

    }
  },

  mounted () {
    this.init()
    this.waterAnalysisByMonth()
  },

  methods: {
    init () {
      let myChart = this.$echarts.init(document.getElementById('myChartWater'))
      let option = {
        title: {
          text: '当前账户按月用水总量统计',
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
        color: ['#8AC7FF'],
        toolbox: {
          show: true,
          padding: [20, 10],
          feature: {
            magicType: { type: ['line', 'bar'] }
          }
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisLabel: {
            color: '#F00'
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320, 800, 600, 544, 200, 544, 200],
          type: 'line'
        }]
      };

      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
      // myChart.resize()
    },
    async waterAnalysisByMonth () { // 按月统计水表用量
      const self = this;
      // USD1ED59A8133C42BFAEFBBC339EA660A5
      let param = {
        userId: self.userId
      }
      let res = await waterAnalysisByMonth(param)
      console.log('按月统计水表用量', res)
    }
  }
}
</script>
