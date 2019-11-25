<template>
  <div id="waterChart" :style="{ width: width, height: height }"></div>
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
      let myChart = this.$echarts.init(document.getElementById('waterChart'))
      let option = {
        xAxis: {
          type: 'category',
          data: ['2014', '2015', '2016', '2017', '2018', '2019']
        },
        color: '#34C635',
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 1932, 2901, 3934, 4290, 5330],
          type: 'line'
        }],
        backgroundColor: '#fff'
      };

      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    }
  }
}
</script>
