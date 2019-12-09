<template>
  <div id="lossChart" :style="{ width: width, height: height }" />
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '300px'
    },
    height: {
      type: String,
      default: '300px'
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
      let myChart = this.$echarts.init(document.getElementById('lossChart'))
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
