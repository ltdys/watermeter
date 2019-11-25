<template>
  <div id="myChartAlarm" :style="{ width: width, height: height }"></div>
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
      let myChart = this.$echarts.init(document.getElementById('myChartAlarm'))
      let option = {
        title: {
          text: this.$t('chart.alarmChartTitle'),
          padding: [20, 10]
        },
        color: ['#8FEA90'],
        toolbox: {
          show: true,
          padding: [20, 10],
          feature: {
            magicType: {type: ['line', 'bar']}
          }
        },
        xAxis: {
            type: 'category',
            data: ['1路', '2路', '3路', '4路', '5路', '6路', '7路', '8路', '9路', '10路']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [100, 932, 201, 934, 1290, 1330, 1320, 600, 600, 200, 200],
            type: 'line'
        }]
      };

      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
      // myChart.resize()
    }
  }
}
</script>