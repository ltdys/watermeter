<template>
  <div id="myChartInstall" :style="{ width: width, height: height }"/>
</template>

<script>
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
  },

  methods: {
    init () {
      let myChart = this.$echarts.init(document.getElementById('myChartInstall'))
      let option = {
        title: {
          text: this.$t('chart.installChartTitle'),
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
          data: ['04.09', '04.10', '04.11', '04.12', '04.13', '04.14', '04.15']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [200, 100, 501, 934, 590, 830, 130, 500, 1600, 1200, 20],
          type: 'line'
        }]
      };

      myChart.setOption(option, true);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
      // myChart.resize()
    }
  }
}
</script>
